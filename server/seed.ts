import 'dotenv/config';
import { db } from "./db";
import { routes, shipCompliance, bankEntries } from "@shared/schema";

async function seed() {
  console.log("🌱 Seeding database...");

  // Clear existing data
  await db.delete(routes);
  await db.delete(shipCompliance);
  await db.delete(bankEntries);

  // Seed routes with mock data - Multiple years and vessel types
  await db.insert(routes).values([
    // 2024 Routes - Baseline Year
    {
      routeId: "R001",
      vesselType: "Container",
      fuelType: "HFO",
      year: 2024,
      ghgIntensity: 91.0,
      fuelConsumption: 5000,
      distance: 12000,
      totalEmissions: 4500,
      isBaseline: true,
    },
    {
      routeId: "R002",
      vesselType: "BulkCarrier",
      fuelType: "LNG",
      year: 2024,
      ghgIntensity: 88.0,
      fuelConsumption: 4800,
      distance: 11500,
      totalEmissions: 4200,
      isBaseline: false,
    },
    {
      routeId: "R003",
      vesselType: "Tanker",
      fuelType: "MGO",
      year: 2024,
      ghgIntensity: 93.5,
      fuelConsumption: 5100,
      distance: 12500,
      totalEmissions: 4700,
      isBaseline: false,
    },
    {
      routeId: "R004",
      vesselType: "RoRo",
      fuelType: "HFO",
      year: 2024,
      ghgIntensity: 92.8,
      fuelConsumption: 4900,
      distance: 11800,
      totalEmissions: 4300,
      isBaseline: false,
    },
    {
      routeId: "R005",
      vesselType: "Container",
      fuelType: "LNG",
      year: 2024,
      ghgIntensity: 87.5,
      fuelConsumption: 4700,
      distance: 11200,
      totalEmissions: 4100,
      isBaseline: false,
    },
    {
      routeId: "R006",
      vesselType: "Tanker",
      fuelType: "HFO",
      year: 2024,
      ghgIntensity: 94.2,
      fuelConsumption: 5200,
      distance: 13000,
      totalEmissions: 4800,
      isBaseline: false,
    },
    {
      routeId: "R007",
      vesselType: "BulkCarrier",
      fuelType: "MGO",
      year: 2024,
      ghgIntensity: 90.3,
      fuelConsumption: 4850,
      distance: 11600,
      totalEmissions: 4250,
      isBaseline: false,
    },
    {
      routeId: "R008",
      vesselType: "Container",
      fuelType: "Biofuel",
      year: 2024,
      ghgIntensity: 75.2,
      fuelConsumption: 4600,
      distance: 11000,
      totalEmissions: 3450,
      isBaseline: false,
    },
    
    // 2025 Routes - Year 1 Compliance
    {
      routeId: "R009",
      vesselType: "Container",
      fuelType: "HFO",
      year: 2025,
      ghgIntensity: 89.2,
      fuelConsumption: 4900,
      distance: 11800,
      totalEmissions: 4300,
      isBaseline: false,
    },
    {
      routeId: "R010",
      vesselType: "Container",
      fuelType: "LNG",
      year: 2025,
      ghgIntensity: 85.5,
      fuelConsumption: 4650,
      distance: 11100,
      totalEmissions: 3980,
      isBaseline: false,
    },
    {
      routeId: "R011",
      vesselType: "Tanker",
      fuelType: "MGO",
      year: 2025,
      ghgIntensity: 91.3,
      fuelConsumption: 5050,
      distance: 12300,
      totalEmissions: 4600,
      isBaseline: false,
    },
    {
      routeId: "R012",
      vesselType: "BulkCarrier",
      fuelType: "LNG",
      year: 2025,
      ghgIntensity: 86.8,
      fuelConsumption: 4750,
      distance: 11400,
      totalEmissions: 4120,
      isBaseline: false,
    },
    {
      routeId: "R013",
      vesselType: "RoRo",
      fuelType: "HFO",
      year: 2025,
      ghgIntensity: 90.5,
      fuelConsumption: 4920,
      distance: 11850,
      totalEmissions: 4350,
      isBaseline: false,
    },
    {
      routeId: "R014",
      vesselType: "Container",
      fuelType: "Biofuel",
      year: 2025,
      ghgIntensity: 72.1,
      fuelConsumption: 4500,
      distance: 10800,
      totalEmissions: 3245,
      isBaseline: false,
    },
    {
      routeId: "R015",
      vesselType: "Tanker",
      fuelType: "LNG",
      year: 2025,
      ghgIntensity: 87.9,
      fuelConsumption: 4800,
      distance: 11500,
      totalEmissions: 4220,
      isBaseline: false,
    },
    {
      routeId: "R016",
      vesselType: "BulkCarrier",
      fuelType: "MGO",
      year: 2025,
      ghgIntensity: 89.7,
      fuelConsumption: 4880,
      distance: 11700,
      totalEmissions: 4280,
      isBaseline: false,
    },
    
    // 2026 Routes - Improved Compliance
    {
      routeId: "R017",
      vesselType: "Container",
      fuelType: "LNG",
      year: 2026,
      ghgIntensity: 83.4,
      fuelConsumption: 4550,
      distance: 10900,
      totalEmissions: 3800,
      isBaseline: false,
    },
    {
      routeId: "R018",
      vesselType: "Tanker",
      fuelType: "Biofuel",
      year: 2026,
      ghgIntensity: 70.5,
      fuelConsumption: 4450,
      distance: 10600,
      totalEmissions: 3135,
      isBaseline: false,
    },
    {
      routeId: "R019",
      vesselType: "BulkCarrier",
      fuelType: "LNG",
      year: 2026,
      ghgIntensity: 85.2,
      fuelConsumption: 4680,
      distance: 11200,
      totalEmissions: 3990,
      isBaseline: false,
    },
    {
      routeId: "R020",
      vesselType: "Container",
      fuelType: "Methanol",
      year: 2026,
      ghgIntensity: 68.9,
      fuelConsumption: 4350,
      distance: 10400,
      totalEmissions: 2998,
      isBaseline: false,
    },
  ]);

  // Seed ship compliance data - More ships with varied compliance status
  const TARGET_2025 = 89.3368; // 2% below 91.16
  const ENERGY_CONVERSION = 41000; // MJ per tonne

  await db.insert(shipCompliance).values([
    // 2024 Baseline Year
    {
      shipId: "SHIP001",
      year: 2024,
      cbGco2eq: 1245.8,
    },
    {
      shipId: "SHIP002",
      year: 2024,
      cbGco2eq: -450.2,
    },
    {
      shipId: "SHIP003",
      year: 2024,
      cbGco2eq: 670.5,
    },
    {
      shipId: "SHIP004",
      year: 2024,
      cbGco2eq: -120.0,
    },
    {
      shipId: "SHIP005",
      year: 2024,
      cbGco2eq: 892.3,
    },
    {
      shipId: "SHIP006",
      year: 2024,
      cbGco2eq: -340.7,
    },
    {
      shipId: "SHIP007",
      year: 2024,
      cbGco2eq: 520.9,
    },
    {
      shipId: "SHIP008",
      year: 2024,
      cbGco2eq: -890.4,
    },
    
    // 2025 Compliance Year
    {
      shipId: "SHIP001",
      year: 2025,
      cbGco2eq: 1050.3,
    },
    {
      shipId: "SHIP002",
      year: 2025,
      cbGco2eq: -680.5,
    },
    {
      shipId: "SHIP003",
      year: 2025,
      cbGco2eq: 450.2,
    },
    {
      shipId: "SHIP004",
      year: 2025,
      cbGco2eq: -250.8,
    },
    {
      shipId: "SHIP005",
      year: 2025,
      cbGco2eq: 720.6,
    },
    {
      shipId: "SHIP006",
      year: 2025,
      cbGco2eq: -520.3,
    },
    {
      shipId: "SHIP007",
      year: 2025,
      cbGco2eq: 340.9,
    },
    {
      shipId: "SHIP008",
      year: 2025,
      cbGco2eq: -1120.7,
    },
    {
      shipId: "SHIP009",
      year: 2025,
      cbGco2eq: 890.4,
    },
    {
      shipId: "SHIP010",
      year: 2025,
      cbGco2eq: -420.6,
    },
    {
      shipId: "SHIP011",
      year: 2025,
      cbGco2eq: 1340.8,
    },
    {
      shipId: "SHIP012",
      year: 2025,
      cbGco2eq: -780.9,
    },
    
    // 2026 Improved Compliance
    {
      shipId: "SHIP001",
      year: 2026,
      cbGco2eq: 820.5,
    },
    {
      shipId: "SHIP002",
      year: 2026,
      cbGco2eq: -890.3,
    },
    {
      shipId: "SHIP003",
      year: 2026,
      cbGco2eq: 280.7,
    },
    {
      shipId: "SHIP004",
      year: 2026,
      cbGco2eq: -450.2,
    },
    {
      shipId: "SHIP005",
      year: 2026,
      cbGco2eq: 560.8,
    },
    {
      shipId: "SHIP006",
      year: 2026,
      cbGco2eq: -720.5,
    },
    {
      shipId: "SHIP007",
      year: 2026,
      cbGco2eq: 180.4,
    },
    {
      shipId: "SHIP008",
      year: 2026,
      cbGco2eq: -1340.9,
    },
  ]);

  // Seed banked entries - Ships with positive and negative balances
  await db.insert(bankEntries).values([
    // 2024 Banking
    {
      shipId: "SHIP001",
      year: 2024,
      amountGco2eq: 500.0,
    },
    {
      shipId: "SHIP002",
      year: 2024,
      amountGco2eq: -450.2,
    },
    {
      shipId: "SHIP003",
      year: 2024,
      amountGco2eq: 250.0,
    },
    {
      shipId: "SHIP004",
      year: 2024,
      amountGco2eq: -120.0,
    },
    {
      shipId: "SHIP005",
      year: 2024,
      amountGco2eq: 892.3,
    },
    {
      shipId: "SHIP006",
      year: 2024,
      amountGco2eq: -340.7,
    },
    {
      shipId: "SHIP008",
      year: 2024,
      amountGco2eq: -890.4,
    },
    
    // 2025 Banking
    {
      shipId: "SHIP001",
      year: 2025,
      amountGco2eq: 320.5,
    },
    {
      shipId: "SHIP002",
      year: 2025,
      amountGco2eq: -230.3,
    },
    {
      shipId: "SHIP003",
      year: 2025,
      amountGco2eq: 180.7,
    },
    {
      shipId: "SHIP005",
      year: 2025,
      amountGco2eq: 420.6,
    },
    {
      shipId: "SHIP006",
      year: 2025,
      amountGco2eq: -180.9,
    },
    {
      shipId: "SHIP008",
      year: 2025,
      amountGco2eq: -560.4,
    },
    {
      shipId: "SHIP009",
      year: 2025,
      amountGco2eq: 340.8,
    },
    {
      shipId: "SHIP010",
      year: 2025,
      amountGco2eq: -140.2,
    },
    {
      shipId: "SHIP012",
      year: 2025,
      amountGco2eq: -390.5,
    },
  ]);

  console.log("✅ Database seeded successfully!");
}

seed()
  .catch((error) => {
    console.error("❌ Seeding failed:", error);
    process.exit(1);
  })
  .finally(() => {
    process.exit(0);
  });
