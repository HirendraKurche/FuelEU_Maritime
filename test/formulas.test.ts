// @vitest-environment node
import { describe, it, expect } from 'vitest';

describe('Basic Formula Tests', () => {
  describe('FuelEU Maritime Compliance Calculations', () => {
    it('should calculate target intensity correctly (2% below 91.16)', () => {
      const baseline = 91.16;
      const reduction = 0.02;
      const target = baseline * (1 - reduction);
      
      expect(target).toBeCloseTo(89.3368, 4);
    });

    it('should calculate energy in scope (fuel × 41000 MJ/t)', () => {
      const fuelConsumption = 5000; // tonnes
      const conversionFactor = 41000; // MJ per tonne
      const energyInScope = fuelConsumption * conversionFactor;
      
      expect(energyInScope).toBe(205000000);
    });

    it('should calculate compliance balance (CB)', () => {
      const target = 89.3368;
      const actual = 88.0;
      const energyInScope = 5000 * 41000;
      const cb = (target - actual) * energyInScope;
      
      expect(cb).toBeCloseTo(274044000, -5); // Within 100k
    });

    it('should calculate percentage difference in comparison', () => {
      const baseline = 91.0;
      const comparison = 88.0;
      const percentDiff = ((comparison / baseline) - 1) * 100;
      
      expect(percentDiff).toBeCloseTo(-3.297, 2);
    });

    it('should identify compliant routes (intensity <= 89.3368)', () => {
      const target = 89.3368;
      
      expect(88.0 <= target).toBe(true);  // Compliant
      expect(89.0 <= target).toBe(true);  // Compliant
      expect(90.0 <= target).toBe(false); // Not compliant
      expect(93.5 <= target).toBe(false); // Not compliant
    });
  });

  describe('Banking Validation', () => {
    it('should validate positive banking amounts', () => {
      expect(500.0 > 0).toBe(true);
      expect(-100.0 > 0).toBe(false);
      expect(0 > 0).toBe(false);
    });

    it('should validate sufficient banked amount', () => {
      const banked = 500;
      const requested = 300;
      const excessive = 600;
      
      expect(banked >= requested).toBe(true);
      expect(banked >= excessive).toBe(false);
    });

    it('should calculate total banked amount', () => {
      const entries = [500.0, 250.0, 142.3];
      const total = entries.reduce((sum, amt) => sum + amt, 0);
      
      expect(total).toBeCloseTo(892.3, 1);
    });
  });

  describe('Pooling Validation Rules', () => {
    it('should validate pool sum >= 0', () => {
      const validMembers = [
        { cbAfter: 500.0 },
        { cbAfter: -100.0 },
      ];
      const invalidMembers = [
        { cbAfter: -200.0 },
        { cbAfter: -300.0 },
      ];
      
      const validSum = validMembers.reduce((s, m) => s + m.cbAfter, 0);
      const invalidSum = invalidMembers.reduce((s, m) => s + m.cbAfter, 0);
      
      expect(validSum).toBe(400.0);
      expect(validSum >= 0).toBe(true);
      expect(invalidSum).toBe(-500.0);
      expect(invalidSum >= 0).toBe(false);
    });

    it('should validate deficit ships cannot exit worse', () => {
      const improved = { cbBefore: -450, cbAfter: -100 };
      const worsened = { cbBefore: -450, cbAfter: -500 };
      
      // If deficit (cbBefore < 0), cbAfter should NOT be < cbBefore
      const improvedExitsWorse = improved.cbBefore < 0 && improved.cbAfter < improved.cbBefore;
      const worsenedExitsWorse = worsened.cbBefore < 0 && worsened.cbAfter < worsened.cbBefore;
      
      expect(improvedExitsWorse).toBe(false); // Valid
      expect(worsenedExitsWorse).toBe(true);  // Invalid
    });

    it('should validate surplus ships cannot exit negative', () => {
      const staysPositive = { cbBefore: 1245, cbAfter: 500 };
      const goesNegative = { cbBefore: 1245, cbAfter: -100 };
      
      // If surplus (cbBefore > 0), cbAfter should NOT be < 0
      const staysPositiveExitsNegative = staysPositive.cbBefore > 0 && staysPositive.cbAfter < 0;
      const goesNegativeExitsNegative = goesNegative.cbBefore > 0 && goesNegative.cbAfter < 0;
      
      expect(staysPositiveExitsNegative).toBe(false); // Valid
      expect(goesNegativeExitsNegative).toBe(true);   // Invalid
    });

    it('should validate minimum 2 members per pool', () => {
      const validPool = ['SHIP001', 'SHIP002'];
      const invalidPool = ['SHIP001'];
      
      expect(validPool.length >= 2).toBe(true);
      expect(invalidPool.length >= 2).toBe(false);
    });
  });

  describe('Route Comparison Logic', () => {
    it('should calculate percentage improvement correctly', () => {
      const baseline = { ghgIntensity: 91.0 };
      const routes = [
        { ghgIntensity: 88.0 },  // Better (lower)
        { ghgIntensity: 93.5 },  // Worse (higher)
        { ghgIntensity: 89.2 },  // Better
      ];
      
      const percentDiffs = routes.map(r => 
        ((r.ghgIntensity / baseline.ghgIntensity) - 1) * 100
      );
      
      expect(percentDiffs[0]).toBeCloseTo(-3.297, 2); // Improved
      expect(percentDiffs[1]).toBeCloseTo(2.747, 2);  // Worsened
      expect(percentDiffs[2]).toBeCloseTo(-1.978, 2); // Improved
    });
  });
});
