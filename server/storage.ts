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

// Helper: compute compliance balance and energyInScope from a route
export function computeCBFromRoute(r: Route) {
  const energyInScope = (r.fuelConsumption || 0) * ENERGY_CONVERSION;
  const cb = (TARGET_2025 - r.ghgIntensity) * energyInScope;
  return { shipId: r.routeId, year: r.year, cbGco2eq: cb, target: TARGET_2025, actual: r.ghgIntensity, energyInScope };
}

// Helper: greedy allocation for pool members (pure function)
export function allocatePoolMembers(members: Array<{ shipId: string; cbBefore: number }>) {
  const surpluses = members
    .filter(m => m.cbBefore > 0)
    .map(m => ({ ...m, cbAfter: m.cbBefore }));
  const deficits = members
    .filter(m => m.cbBefore < 0)
    .map(m => ({ ...m, cbAfter: m.cbBefore }));
  const neutrals = members.filter(m => m.cbBefore === 0).map(m => ({ ...m, cbAfter: 0 }));

  // Sort deficits by most negative first
  deficits.sort((a, b) => a.cbBefore - b.cbBefore);

  for (const s of surpluses) {
    let available = s.cbAfter;
    for (const d of deficits) {
      if (available <= 0) break;
      const need = Math.abs(Math.min(0, d.cbAfter));
      if (need <= 0) continue;
      const transfer = Math.min(available, need);
      d.cbAfter += transfer;
      s.cbAfter -= transfer;
      available -= transfer;
    }
  }

  return [...surpluses, ...deficits, ...neutrals];
}

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
    // Compute CB dynamically from routes for the given year.
    // Use route.routeId as shipId for compliance snapshots.
    const yearRoutes = await db.select().from(routes).where(eq(routes.year, year));

    const results: ComplianceBalance[] = [];

    for (const r of yearRoutes) {
      const energyInScope = (r.fuelConsumption || 0) * ENERGY_CONVERSION;
      const cb = (TARGET_2025 - r.ghgIntensity) * energyInScope;

      const shipId = r.routeId;

      // Upsert ship_compliance snapshot: try update, else insert
      const existing = await db
        .select()
        .from(shipCompliance)
        .where(and(eq(shipCompliance.shipId, shipId), eq(shipCompliance.year, year)));

      if (existing.length > 0) {
        await db
          .update(shipCompliance)
          .set({ cbGco2eq: cb })
          .where(and(eq(shipCompliance.shipId, shipId), eq(shipCompliance.year, year)));
      } else {
        await db.insert(shipCompliance).values({ shipId, year, cbGco2eq: cb });
      }

      results.push({
        shipId,
        year,
        cbGco2eq: cb,
        target: TARGET_2025,
        actual: r.ghgIntensity,
        energyInScope,
      });
    }

    return results;
  }

  async getAdjustedCB(year: number): Promise<AdjustedCB[]> {
    const compliance = await db
      .select()
      .from(shipCompliance)
      .where(eq(shipCompliance.year, year));
    
    const results: AdjustedCB[] = [];
    
    for (const c of compliance) {
      const bankedAmount = await this.getBankedAmount(c.shipId);
      // Include available banked amount in the adjusted CB (cbAfter = cbBefore + bankedAmount)
      results.push({
        shipId: c.shipId,
        year: c.year,
        cbBefore: c.cbGco2eq,
        bankedAmount,
        cbAfter: c.cbGco2eq + bankedAmount,
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
    // Validate available banked amount before applying
    const available = await this.getBankedAmount(shipId);
    if (available < amount) {
      throw new Error(`Insufficient banked amount: available=${available}, requested=${amount}`);
    }

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
    // Validation: minimum members
    if (!members || members.length < 2) {
      throw new Error("Pool must have at least 2 members");
    }

    // Validation: pool sum of cbBefore must be >= 0
    const poolSumBefore = members.reduce((s, m) => s + m.cbBefore, 0);
    if (poolSumBefore < 0) {
      throw new Error("Pool sum of cbBefore must be >= 0");
    }

    // Greedy allocation: compute final cbAfter values
    const surpluses = members
      .filter(m => m.cbBefore > 0)
      .map(m => ({ ...m, cbAfter: m.cbBefore }));
    const deficits = members
      .filter(m => m.cbBefore < 0)
      .map(m => ({ ...m, cbAfter: m.cbBefore }));
    const neutrals = members.filter(m => m.cbBefore === 0).map(m => ({ ...m, cbAfter: 0 }));

    // Sort deficits by most negative first (largest absolute need)
    deficits.sort((a, b) => a.cbBefore - b.cbBefore);

    for (const s of surpluses) {
      let available = s.cbAfter; // start with surplus amount
      for (const d of deficits) {
        if (available <= 0) break;
        const need = Math.abs(Math.min(0, d.cbAfter));
        if (need <= 0) continue;
        const transfer = Math.min(available, need);
        d.cbAfter += transfer; // less negative
        s.cbAfter -= transfer;
        available -= transfer;
      }
    }

    const finalMembers = [...surpluses, ...deficits, ...neutrals];

    // Post-validation: deficits cannot exit worse and surpluses cannot be negative
    const invalidDeficit = finalMembers.some(m => m.cbBefore < 0 && m.cbAfter < m.cbBefore);
    const invalidSurplus = finalMembers.some(m => m.cbBefore > 0 && m.cbAfter < 0);
    if (invalidDeficit) {
      throw new Error("Deficit ship would exit worse after allocation");
    }
    if (invalidSurplus) {
      throw new Error("Surplus ship would exit negative after allocation");
    }

    // Persist pool and members
    const poolResult = await db.insert(pools).values({ year }).returning();
    const pool = poolResult[0];
    for (const member of finalMembers) {
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
