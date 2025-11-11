import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertRouteSchema,
  bankingOperationSchema,
  poolCreationSchema 
} from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // GET /api/routes - Fetch all routes with optional filters
  app.get("/api/routes", async (req, res) => {
    try {
      const { vesselType, fuelType, year } = req.query;
      
      const filters: any = {};
      if (vesselType) filters.vesselType = vesselType as string;
      if (fuelType) filters.fuelType = fuelType as string;
      if (year) filters.year = parseInt(year as string);
      
      const routes = await storage.getRoutes(filters);
      res.json(routes);
    } catch (error) {
      console.error("Error fetching routes:", error);
      res.status(500).json({ error: "Failed to fetch routes" });
    }
  });

  // POST /api/routes/:routeId/baseline - Set a route as baseline
  app.post("/api/routes/:routeId/baseline", async (req, res) => {
    try {
      const { routeId } = req.params;
      const route = await storage.setBaseline(routeId);
      
      if (!route) {
        return res.status(404).json({ error: "Route not found" });
      }
      
      res.json(route);
    } catch (error) {
      console.error("Error setting baseline:", error);
      res.status(500).json({ error: "Failed to set baseline" });
    }
  });

  // GET /api/routes/comparison - Get comparison data
  app.get("/api/routes/comparison", async (req, res) => {
    try {
      const comparison = await storage.getComparison();
      res.json(comparison);
    } catch (error) {
      console.error("Error fetching comparison:", error);
      res.status(500).json({ error: "Failed to fetch comparison data" });
    }
  });

  // GET /api/compliance/cb - Get compliance balance
  app.get("/api/compliance/cb", async (req, res) => {
    try {
      const year = parseInt(req.query.year as string) || 2025;
      const complianceBalance = await storage.getComplianceBalance(year);
      res.json(complianceBalance);
    } catch (error) {
      console.error("Error fetching compliance balance:", error);
      res.status(500).json({ error: "Failed to fetch compliance balance" });
    }
  });

  // GET /api/compliance/adjusted-cb - Get adjusted compliance balance for pooling
  app.get("/api/compliance/adjusted-cb", async (req, res) => {
    try {
      const year = parseInt(req.query.year as string) || 2025;
      const adjustedCB = await storage.getAdjustedCB(year);
      res.json(adjustedCB);
    } catch (error) {
      console.error("Error fetching adjusted CB:", error);
      res.status(500).json({ error: "Failed to fetch adjusted compliance balance" });
    }
  });

  // POST /api/banking/bank - Bank surplus compliance balance
  app.post("/api/banking/bank", async (req, res) => {
    try {
      const parsed = bankingOperationSchema.parse(req.body);
      
      // Validate that the amount is positive
      if (parsed.amount <= 0) {
        return res.status(400).json({ error: "Amount must be positive" });
      }
      
      const bankEntry = await storage.bankSurplus(
        parsed.shipId,
        parsed.year,
        parsed.amount
      );
      
      res.json(bankEntry);
    } catch (error) {
      console.error("Error banking surplus:", error);
      res.status(500).json({ error: "Failed to bank surplus" });
    }
  });

  // POST /api/banking/apply - Apply banked surplus
  app.post("/api/banking/apply", async (req, res) => {
    try {
      const parsed = bankingOperationSchema.parse(req.body);
      
      // Validate that the amount is positive
      if (parsed.amount <= 0) {
        return res.status(400).json({ error: "Amount must be positive" });
      }
      
      // Check if sufficient banked amount exists
      const bankedAmount = await storage.getBankedAmount(parsed.shipId);
      if (bankedAmount < parsed.amount) {
        return res.status(400).json({ 
          error: "Insufficient banked amount",
          available: bankedAmount,
          requested: parsed.amount
        });
      }
      
      await storage.applyBanked(parsed.shipId, parsed.year, parsed.amount);
      
      res.json({ success: true, message: "Banked surplus applied successfully" });
    } catch (error) {
      console.error("Error applying banked surplus:", error);
      res.status(500).json({ error: "Failed to apply banked surplus" });
    }
  });

  // POST /api/pools - Create a compliance pool
  app.post("/api/pools", async (req, res) => {
    try {
      const parsed = poolCreationSchema.parse(req.body);
      
      // Validate pool rules
      const poolSum = parsed.members.reduce((sum, m) => sum + m.cbAfter, 0);
      
      if (poolSum < 0) {
        return res.status(400).json({ 
          error: "Pool sum must be >= 0",
          poolSum 
        });
      }
      
      if (parsed.members.length < 2) {
        return res.status(400).json({ 
          error: "Pool must have at least 2 members" 
        });
      }
      
      // Check if deficit ships exit worse
      const hasInvalidDeficitShip = parsed.members.some(
        (m) => m.cbBefore < 0 && m.cbAfter < m.cbBefore
      );
      if (hasInvalidDeficitShip) {
        return res.status(400).json({ 
          error: "Deficit ships cannot exit with worse balance" 
        });
      }
      
      // Check if surplus ships exit negative
      const hasInvalidSurplusShip = parsed.members.some(
        (m) => m.cbBefore > 0 && m.cbAfter < 0
      );
      if (hasInvalidSurplusShip) {
        return res.status(400).json({ 
          error: "Surplus ships cannot exit with negative balance" 
        });
      }
      
      const pool = await storage.createPool(parsed.year, parsed.members);
      
      res.json(pool);
    } catch (error) {
      console.error("Error creating pool:", error);
      res.status(500).json({ error: "Failed to create pool" });
    }
  });

  // Health check used by Render and load balancers
  app.get("/healthz", (_req, res) => {
    res.status(200).json({ status: "ok" });
  });

  const httpServer = createServer(app);
  return httpServer;
}
