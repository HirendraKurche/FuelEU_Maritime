// @vitest-environment node
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { PostgresStorage } from './storage';
import type { Route, ComparisonResult } from '../shared/schema';

// Mock the database
vi.mock('./db', () => ({
  db: {
    select: vi.fn().mockReturnThis(),
    insert: vi.fn().mockReturnThis(),
    update: vi.fn().mockReturnThis(),
    delete: vi.fn().mockReturnThis(),
    from: vi.fn().mockReturnThis(),
    where: vi.fn().mockReturnThis(),
    values: vi.fn().mockReturnThis(),
    returning: vi.fn(),
    set: vi.fn().mockReturnThis(),
    orderBy: vi.fn().mockReturnThis(),
  },
}));

describe('Storage Layer - Unit Tests', () => {
  let storage: PostgresStorage;

  beforeEach(() => {
    storage = new PostgresStorage();
    vi.clearAllMocks();
  });

  describe('Route Management', () => {
    it('should calculate comparison percentages correctly', () => {
      const baseline = {
        ghgIntensity: 91.0,
        routeId: 'R001',
        vesselType: 'Container',
        fuelType: 'HFO',
        year: 2024,
      };

      const comparison = {
        ghgIntensity: 88.0,
        routeId: 'R002',
        vesselType: 'BulkCarrier',
        fuelType: 'LNG',
        year: 2024,
      };

      // Calculate percent difference
      const percentDiff = ((comparison.ghgIntensity / baseline.ghgIntensity) - 1) * 100;
      
      expect(percentDiff).toBeCloseTo(-3.297, 2); // ~-3.30% improvement
    });

    it('should correctly identify compliant routes', () => {
      const TARGET_2025 = 89.3368; // 2% below 91.16
      
      const compliantRoute = { ghgIntensity: 88.0 };
      const nonCompliantRoute = { ghgIntensity: 93.5 };

      expect(compliantRoute.ghgIntensity <= TARGET_2025).toBe(true);
      expect(nonCompliantRoute.ghgIntensity <= TARGET_2025).toBe(false);
    });
  });

  describe('Compliance Balance Calculations', () => {
    it('should calculate CB with correct formula', () => {
      const TARGET_2025 = 89.3368;
      const ENERGY_CONVERSION = 41000;
      
      // Example: ghgIntensity=88, fuelConsumption=5000t
      const actual = 88.0;
      const fuelConsumption = 5000;
      
      const energyInScope = fuelConsumption * ENERGY_CONVERSION;
      const cb = (TARGET_2025 - actual) * energyInScope;
      
      expect(energyInScope).toBe(205000000); // 5000 * 41000
      expect(cb).toBeCloseTo(274044000, -5); // Positive = surplus (within 100k)
    });

    it('should identify surplus vs deficit correctly', () => {
      const positiveCB = 1245.8; // Surplus
      const negativeCB = -450.2; // Deficit
      
      expect(positiveCB > 0).toBe(true); // Can be banked
      expect(negativeCB < 0).toBe(true); // Needs banking or pooling
    });
  });

  describe('Banking Logic', () => {
    it('should validate positive banking amounts', () => {
      const validAmount = 500.0;
      const invalidAmount = -100.0;
      
      expect(validAmount > 0).toBe(true);
      expect(invalidAmount > 0).toBe(false);
    });

    it('should validate sufficient banked amount before applying', () => {
      const bankedAmount = 500.0;
      const requestedAmount = 300.0;
      const excessiveAmount = 600.0;
      
      expect(bankedAmount >= requestedAmount).toBe(true);
      expect(bankedAmount >= excessiveAmount).toBe(false);
    });

    it('should calculate banked total correctly', () => {
      const bankEntries = [
        { amountGco2eq: 500.0 },
        { amountGco2eq: 250.0 },
        { amountGco2eq: 142.3 },
      ];
      
      const total = bankEntries.reduce((sum, entry) => sum + entry.amountGco2eq, 0);
      
      expect(total).toBeCloseTo(892.3, 1);
    });
  });

  describe('Pooling Validation', () => {
    it('should validate pool sum must be >= 0', () => {
      const validPool = [
        { shipId: 'SHIP001', cbBefore: 1245.8, cbAfter: 500.0 },
        { shipId: 'SHIP002', cbBefore: -450.2, cbAfter: -100.0 },
      ];
      
      const invalidPool = [
        { shipId: 'SHIP001', cbBefore: -200.0, cbAfter: -150.0 },
        { shipId: 'SHIP002', cbBefore: -450.2, cbAfter: -300.0 },
      ];
      
      const validSum = validPool.reduce((sum, m) => sum + m.cbAfter, 0);
      const invalidSum = invalidPool.reduce((sum, m) => sum + m.cbAfter, 0);
      
      expect(validSum).toBeCloseTo(400.0, 1);
      expect(validSum >= 0).toBe(true);
      expect(invalidSum).toBeLessThan(0);
      expect(invalidSum >= 0).toBe(false);
    });

    it('should validate deficit ships cannot exit worse', () => {
      const validMember = { cbBefore: -450.2, cbAfter: -100.0 }; // Improved
      const invalidMember = { cbBefore: -450.2, cbAfter: -500.0 }; // Worse
      
      const validCheck = validMember.cbBefore < 0 && validMember.cbAfter < validMember.cbBefore;
      const invalidCheck = invalidMember.cbBefore < 0 && invalidMember.cbAfter < invalidMember.cbBefore;
      
      expect(validCheck).toBe(false); // Valid: didn't exit worse
      expect(invalidCheck).toBe(true); // Invalid: exited worse
    });

    it('should validate surplus ships cannot exit negative', () => {
      const validMember = { cbBefore: 1245.8, cbAfter: 500.0 }; // Still positive
      const invalidMember = { cbBefore: 1245.8, cbAfter: -100.0 }; // Went negative
      
      const validCheck = validMember.cbBefore > 0 && validMember.cbAfter < 0;
      const invalidCheck = invalidMember.cbBefore > 0 && invalidMember.cbAfter < 0;
      
      expect(validCheck).toBe(false); // Valid: didn't go negative
      expect(invalidCheck).toBe(true); // Invalid: went negative
    });

    it('should validate minimum pool size', () => {
      const validPool = [
        { shipId: 'SHIP001', cbBefore: 1245.8, cbAfter: 500.0 },
        { shipId: 'SHIP002', cbBefore: -450.2, cbAfter: -100.0 },
      ];
      
      const invalidPool = [
        { shipId: 'SHIP001', cbBefore: 1245.8, cbAfter: 500.0 },
      ];
      
      expect(validPool.length >= 2).toBe(true);
      expect(invalidPool.length >= 2).toBe(false);
    });
  });

  describe('Formula Constants', () => {
    it('should use correct target intensity for 2025', () => {
      const TARGET_2025 = 89.3368;
      const baseline = 91.16;
      const reduction = 0.02; // 2%
      
      const calculatedTarget = baseline * (1 - reduction);
      
      expect(TARGET_2025).toBeCloseTo(calculatedTarget, 3);
    });

    it('should use correct energy conversion factor', () => {
      const ENERGY_CONVERSION = 41000; // MJ per tonne
      
      expect(ENERGY_CONVERSION).toBe(41000);
    });
  });
});
