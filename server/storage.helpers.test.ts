import { describe, it, expect } from 'vitest';
import { computeCBFromRoute, allocatePoolMembers } from './storage';

describe('Storage helpers', () => {
  it('computeCBFromRoute calculates energy and CB correctly', () => {
    const route = {
      routeId: 'R001',
      year: 2024,
      ghgIntensity: 88.0,
      fuelConsumption: 5000,
    } as any;

    const result = computeCBFromRoute(route);

    expect(result.energyInScope).toBe(5000 * 41000);
    expect(result.cbGco2eq).toBeCloseTo((89.3368 - 88.0) * (5000 * 41000), -5);
  });

  it('allocatePoolMembers fully covers deficits when surplus is sufficient', () => {
    const members = [
      { shipId: 'A', cbBefore: 1000 },
      { shipId: 'B', cbBefore: -400 },
      { shipId: 'C', cbBefore: -600 },
    ];

    const allocated = allocatePoolMembers(members);

    const a = allocated.find(m => m.shipId === 'A')!;
    const b = allocated.find(m => m.shipId === 'B')!;
    const c = allocated.find(m => m.shipId === 'C')!;

    expect(a.cbAfter).toBeCloseTo(0, 2);
    expect(b.cbAfter).toBeCloseTo(0, 2);
    expect(c.cbAfter).toBeCloseTo(0, 2);
  });

  it('allocatePoolMembers partially covers deficits when insufficient surplus', () => {
    const members = [
      { shipId: 'A', cbBefore: 500 },
      { shipId: 'B', cbBefore: -300 },
      { shipId: 'C', cbBefore: -400 },
    ];

    const allocated = allocatePoolMembers(members);
    const a = allocated.find(m => m.shipId === 'A')!;
    const b = allocated.find(m => m.shipId === 'B')!;
    const c = allocated.find(m => m.shipId === 'C')!;

    // A had 500, C is most negative (-400) and should be covered first
    expect(c.cbAfter).toBeCloseTo(0, 2);
    // Remaining 100 goes to B (-300) -> becomes -200
    expect(b.cbAfter).toBeCloseTo(-200, 2);
    expect(a.cbAfter).toBeCloseTo(0, 2);
  });

  it('allocatePoolMembers handles multiple surpluses', () => {
    const members = [
      { shipId: 'S1', cbBefore: 600 },
      { shipId: 'S2', cbBefore: 300 },
      { shipId: 'D1', cbBefore: -700 },
    ];

    const allocated = allocatePoolMembers(members);
    const s1 = allocated.find(m => m.shipId === 'S1')!;
    const s2 = allocated.find(m => m.shipId === 'S2')!;
    const d1 = allocated.find(m => m.shipId === 'D1')!;

    // Total surplus 900 covers deficit 700 -> both surpluses reduce
    expect(d1.cbAfter).toBeCloseTo(0, 2);
    expect(s1.cbAfter + s2.cbAfter).toBeCloseTo(900 - 700, 2); // remaining surplus
  });
});
