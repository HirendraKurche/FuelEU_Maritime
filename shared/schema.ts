import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, real, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Routes table
export const routes = pgTable("routes", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  routeId: text("route_id").notNull().unique(),
  vesselType: text("vessel_type").notNull(),
  fuelType: text("fuel_type").notNull(),
  year: integer("year").notNull(),
  ghgIntensity: real("ghg_intensity").notNull(),
  fuelConsumption: real("fuel_consumption").notNull(),
  distance: real("distance").notNull(),
  totalEmissions: real("total_emissions").notNull(),
  isBaseline: boolean("is_baseline").notNull().default(false),
});

export const insertRouteSchema = createInsertSchema(routes).omit({
  id: true,
});

export type InsertRoute = z.infer<typeof insertRouteSchema>;
export type Route = typeof routes.$inferSelect;

// Ship compliance table
export const shipCompliance = pgTable("ship_compliance", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  shipId: text("ship_id").notNull(),
  year: integer("year").notNull(),
  cbGco2eq: real("cb_gco2eq").notNull(),
});

export const insertShipComplianceSchema = createInsertSchema(shipCompliance).omit({
  id: true,
});

export type InsertShipCompliance = z.infer<typeof insertShipComplianceSchema>;
export type ShipCompliance = typeof shipCompliance.$inferSelect;

// Bank entries table
export const bankEntries = pgTable("bank_entries", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  shipId: text("ship_id").notNull(),
  year: integer("year").notNull(),
  amountGco2eq: real("amount_gco2eq").notNull(),
});

export const insertBankEntrySchema = createInsertSchema(bankEntries).omit({
  id: true,
});

export type InsertBankEntry = z.infer<typeof insertBankEntrySchema>;
export type BankEntry = typeof bankEntries.$inferSelect;

// Pools table
export const pools = pgTable("pools", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  year: integer("year").notNull(),
  createdAt: timestamp("created_at").notNull().default(sql`now()`),
});

export const insertPoolSchema = createInsertSchema(pools).omit({
  id: true,
  createdAt: true,
});

export type InsertPool = z.infer<typeof insertPoolSchema>;
export type Pool = typeof pools.$inferSelect;

// Pool members table
export const poolMembers = pgTable("pool_members", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  poolId: varchar("pool_id").notNull(),
  shipId: text("ship_id").notNull(),
  cbBefore: real("cb_before").notNull(),
  cbAfter: real("cb_after").notNull(),
});

export const insertPoolMemberSchema = createInsertSchema(poolMembers).omit({
  id: true,
});

export type InsertPoolMember = z.infer<typeof insertPoolMemberSchema>;
export type PoolMember = typeof poolMembers.$inferSelect;

// DTOs for API responses
export const comparisonResultSchema = z.object({
  routeId: z.string(),
  vesselType: z.string(),
  fuelType: z.string(),
  year: z.number(),
  ghgIntensity: z.number(),
  baselineGhgIntensity: z.number(),
  percentDiff: z.number(),
  isCompliant: z.boolean(),
  target: z.number(),
});

export type ComparisonResult = z.infer<typeof comparisonResultSchema>;

export const complianceBalanceSchema = z.object({
  shipId: z.string(),
  year: z.number(),
  cbGco2eq: z.number(),
  target: z.number(),
  actual: z.number(),
  energyInScope: z.number(),
});

export type ComplianceBalance = z.infer<typeof complianceBalanceSchema>;

export const bankingOperationSchema = z.object({
  shipId: z.string(),
  year: z.number(),
  amount: z.number(),
});

export type BankingOperation = z.infer<typeof bankingOperationSchema>;

export const adjustedCBSchema = z.object({
  shipId: z.string(),
  year: z.number(),
  cbBefore: z.number(),
  bankedAmount: z.number(),
  cbAfter: z.number(),
});

export type AdjustedCB = z.infer<typeof adjustedCBSchema>;

export const poolCreationSchema = z.object({
  year: z.number(),
  members: z.array(z.object({
    shipId: z.string(),
    cbBefore: z.number(),
    cbAfter: z.number(),
  })),
});

export type PoolCreation = z.infer<typeof poolCreationSchema>;
