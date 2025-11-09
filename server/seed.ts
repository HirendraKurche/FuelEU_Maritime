import { db } from "./db";
import { routes, shipCompliance, bankEntries } from "@shared/schema";

async function seed() {
  console.log("🌱 Seeding database...");

  // Clear existing data
  await db.delete(routes);
  await db.delete(shipCompliance);
  await db.delete(bankEntries);

  // Seed routes with mock data
  await db.insert(routes).values([
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
      year: 2025,
      ghgIntensity: 89.2,
      fuelConsumption: 4900,
      distance: 11800,
      totalEmissions: 4300,
      isBaseline: false,
    },
    {
      routeId: "R005",
      vesselType: "Container",
      fuelType: "LNG",
      year: 2025,
      ghgIntensity: 90.5,
      fuelConsumption: 4950,
      distance: 11900,
      totalEmissions: 4400,
      isBaseline: false,
    },
  ]);

  // Seed ship compliance data
  const TARGET_2025 = 89.3368; // 2% below 91.16
  const ENERGY_CONVERSION = 41000; // MJ per tonne

  await db.insert(shipCompliance).values([
    {
      shipId: "SHIP001",
      year: 2025,
      cbGco2eq: 1245.8,
    },
    {
      shipId: "SHIP002",
      year: 2025,
      cbGco2eq: -450.2,
    },
    {
      shipId: "SHIP003",
      year: 2025,
      cbGco2eq: 670.5,
    },
    {
      shipId: "SHIP004",
      year: 2025,
      cbGco2eq: -120.0,
    },
    {
      shipId: "SHIP005",
      year: 2025,
      cbGco2eq: 892.3,
    },
  ]);

  // Seed some banked entries
  await db.insert(bankEntries).values([
    {
      shipId: "SHIP001",
      year: 2024,
      amountGco2eq: 500.0,
    },
    {
      shipId: "SHIP003",
      year: 2024,
      amountGco2eq: 250.0,
    },
    {
      shipId: "SHIP005",
      year: 2024,
      amountGco2eq: 142.3,
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
