import { db } from "./db";
import { 
  routes, 
  shipCompliance, 
  bankEntries, 
  pools, 
  poolMembers,
  type Route,
  type InsertRoute,
  type ShipCompliance,
  type InsertShipCompliance,
  type BankEntry,
  type InsertBankEntry,
  type Pool,
  type InsertPool,
  type PoolMember,
  type InsertPoolMember,
  type ComparisonResult,
  type ComplianceBalance,
  type AdjustedCB
} from "@shared/schema";
import { eq, and, sql } from "drizzle-orm";

const TARGET_2025 = 89.3368; // 2% below 91.16 gCO₂e/MJ
const ENERGY_CONVERSION = 41000; // MJ per tonne of fuel

export interface IStorage {
  // Routes
  getRoutes(filters?: { vesselType?: string; fuelType?: string; year?: number }): Promise<Route[]>;
  getRouteByRouteId(routeId: string): Promise<Route | undefined>;
  setBaseline(routeId: string): Promise<Route | undefined>;
  getComparison(): Promise<ComparisonResult[]>;
  
  // Compliance
  getComplianceBalance(year: number): Promise<ComplianceBalance[]>;
  getAdjustedCB(year: number): Promise<AdjustedCB[]>;
  
  // Banking
  bankSurplus(shipId: string, year: number, amount: number): Promise<BankEntry>;
  applyBanked(shipId: string, year: number, amount: number): Promise<void>;
  getBankedAmount(shipId: string): Promise<number>;
  
  // Pooling
  createPool(year: number, members: Array<{ shipId: string; cbBefore: number; cbAfter: number }>): Promise<Pool>;
}

export class PostgresStorage implements IStorage {
  // Routes methods
  async getRoutes(filters?: { vesselType?: string; fuelType?: string; year?: number }): Promise<Route[]> {
    let query = db.select().from(routes);
    
    const conditions = [];
    if (filters?.vesselType && filters.vesselType !== 'all') {
      conditions.push(eq(routes.vesselType, filters.vesselType));
    }
    if (filters?.fuelType && filters.fuelType !== 'all') {
      conditions.push(eq(routes.fuelType, filters.fuelType));
    }
    if (filters?.year) {
      conditions.push(eq(routes.year, filters.year));
    }
    
    if (conditions.length > 0) {
      query = query.where(and(...conditions)) as any;
    }
    
    return query;
  }

  async getRouteByRouteId(routeId: string): Promise<Route | undefined> {
    const result = await db.select().from(routes).where(eq(routes.routeId, routeId));
    return result[0];
  }

  async setBaseline(routeId: string): Promise<Route | undefined> {
    // First, unset any existing baseline
    await db.update(routes).set({ isBaseline: false });
    
    // Set the new baseline
    const result = await db
      .update(routes)
      .set({ isBaseline: true })
      .where(eq(routes.routeId, routeId))
      .returning();
    
    return result[0];
  }

  async getComparison(): Promise<ComparisonResult[]> {
    // Get the baseline route
    const baselineRoutes = await db.select().from(routes).where(eq(routes.isBaseline, true));
    if (baselineRoutes.length === 0) {
      return [];
    }
    const baseline = baselineRoutes[0];
    
    // Get all non-baseline routes
    const allRoutes = await db.select().from(routes).where(eq(routes.isBaseline, false));
    
    return allRoutes.map(route => {
      const percentDiff = ((route.ghgIntensity / baseline.ghgIntensity) - 1) * 100;
      const isCompliant = route.ghgIntensity <= TARGET_2025;
      
      return {
        routeId: route.routeId,
        vesselType: route.vesselType,
        fuelType: route.fuelType,
        year: route.year,
        ghgIntensity: route.ghgIntensity,
        baselineGhgIntensity: baseline.ghgIntensity,
        percentDiff,
        isCompliant,
        target: TARGET_2025,
      };
    });
  }

  // Compliance methods
  async getComplianceBalance(year: number): Promise<ComplianceBalance[]> {
    const compliance = await db
      .select()
      .from(shipCompliance)
      .where(eq(shipCompliance.year, year));
    
    return compliance.map(c => ({
      shipId: c.shipId,
      year: c.year,
      cbGco2eq: c.cbGco2eq,
      target: TARGET_2025,
      actual: 0, // Would be calculated from actual route data
      energyInScope: 0, // Would be calculated from fuel consumption
    }));
  }

  async getAdjustedCB(year: number): Promise<AdjustedCB[]> {
    const compliance = await db
      .select()
      .from(shipCompliance)
      .where(eq(shipCompliance.year, year));
    
    const results: AdjustedCB[] = [];
    
    for (const c of compliance) {
      const bankedAmount = await this.getBankedAmount(c.shipId);
      
      results.push({
        shipId: c.shipId,
        year: c.year,
        cbBefore: c.cbGco2eq,
        bankedAmount,
        cbAfter: c.cbGco2eq, // In real scenario, this would be adjusted
      });
    }
    
    return results;
  }

  // Banking methods
  async bankSurplus(shipId: string, year: number, amount: number): Promise<BankEntry> {
    const result = await db
      .insert(bankEntries)
      .values({ shipId, year, amountGco2eq: amount })
      .returning();
    
    return result[0];
  }

  async applyBanked(shipId: string, year: number, amount: number): Promise<void> {
    // 1. Delete/reduce the banked amount
    const entries = await db
      .select()
      .from(bankEntries)
      .where(eq(bankEntries.shipId, shipId))
      .orderBy(bankEntries.year);
    
    let remaining = amount;
    for (const entry of entries) {
      if (remaining <= 0) break;
      
      if (entry.amountGco2eq <= remaining) {
        // Delete entire entry
        await db.delete(bankEntries).where(eq(bankEntries.id, entry.id));
        remaining -= entry.amountGco2eq;
      } else {
        // Reduce entry amount
        await db
          .update(bankEntries)
          .set({ amountGco2eq: entry.amountGco2eq - remaining })
          .where(eq(bankEntries.id, entry.id));
        remaining = 0;
      }
    }
    
    // 2. Update the ship's compliance balance
    const compliance = await db
      .select()
      .from(shipCompliance)
      .where(and(eq(shipCompliance.shipId, shipId), eq(shipCompliance.year, year)));
    
    if (compliance.length > 0) {
      const currentCB = compliance[0].cbGco2eq;
      await db
        .update(shipCompliance)
        .set({ cbGco2eq: currentCB + amount })
        .where(and(eq(shipCompliance.shipId, shipId), eq(shipCompliance.year, year)));
    }
  }

  async getBankedAmount(shipId: string): Promise<number> {
    const entries = await db
      .select()
      .from(bankEntries)
      .where(eq(bankEntries.shipId, shipId));
    
    return entries.reduce((sum, entry) => sum + entry.amountGco2eq, 0);
  }

  // Pooling methods
  async createPool(
    year: number, 
    members: Array<{ shipId: string; cbBefore: number; cbAfter: number }>
  ): Promise<Pool> {
    // Create the pool
    const poolResult = await db.insert(pools).values({ year }).returning();
    const pool = poolResult[0];
    
    // Add members to the pool
    for (const member of members) {
      await db.insert(poolMembers).values({
        poolId: pool.id,
        shipId: member.shipId,
        cbBefore: member.cbBefore,
        cbAfter: member.cbAfter,
      });
    }
    
    return pool;
  }
}

export const storage = new PostgresStorage();
