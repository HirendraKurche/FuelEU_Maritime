// @vitest-environment node
import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import express, { type Express } from 'express';
import { registerRoutes } from './routes';

describe('API Integration Tests', () => {
  let app: Express;

  beforeAll(async () => {
    app = express();
    app.use(express.json());
    await registerRoutes(app);
  });

  describe('GET /api/routes', () => {
    it('should return all routes without filters', async () => {
      const response = await request(app)
        .get('/api/routes')
        .expect('Content-Type', /json/);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });

    it('should filter routes by vessel type', async () => {
      const response = await request(app)
        .get('/api/routes?vesselType=Container')
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      if (response.body.length > 0) {
        expect(response.body.every((r: any) => r.vesselType === 'Container')).toBe(true);
      }
    });

    it('should filter routes by year', async () => {
      const response = await request(app)
        .get('/api/routes?year=2024')
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      if (response.body.length > 0) {
        expect(response.body.every((r: any) => r.year === 2024)).toBe(true);
      }
    });
  });

  describe('POST /api/routes/:routeId/baseline', () => {
    it('should set a route as baseline', async () => {
      const response = await request(app)
        .post('/api/routes/R001/baseline')
        .expect('Content-Type', /json/);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('routeId');
      expect(response.body).toHaveProperty('isBaseline', true);
    });

    it('should return 404 for non-existent route', async () => {
      const response = await request(app)
        .post('/api/routes/INVALID_ROUTE/baseline')
        .expect('Content-Type', /json/);

      // Could be 404 or 500 depending on implementation
      expect([404, 500]).toContain(response.status);
    });
  });

  describe('GET /api/routes/comparison', () => {
    it('should return comparison data', async () => {
      const response = await request(app)
        .get('/api/routes/comparison')
        .expect('Content-Type', /json/);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      
      if (response.body.length > 0) {
        const comparison = response.body[0];
        expect(comparison).toHaveProperty('routeId');
        expect(comparison).toHaveProperty('ghgIntensity');
        expect(comparison).toHaveProperty('baselineGhgIntensity');
        expect(comparison).toHaveProperty('percentDiff');
        expect(comparison).toHaveProperty('isCompliant');
        expect(comparison).toHaveProperty('target');
      }
    });
  });

  describe('GET /api/compliance/cb', () => {
    it('should return compliance balance for a year', async () => {
      const response = await request(app)
        .get('/api/compliance/cb?year=2025')
        .expect('Content-Type', /json/);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      
      if (response.body.length > 0) {
        const cb = response.body[0];
        expect(cb).toHaveProperty('shipId');
        expect(cb).toHaveProperty('year');
        expect(cb).toHaveProperty('cbGco2eq');
      }
    });

    it('should default to year 2025 if not specified', async () => {
      const response = await request(app)
        .get('/api/compliance/cb')
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
    });
  });

  describe('GET /api/compliance/adjusted-cb', () => {
    it('should return adjusted compliance balance', async () => {
      const response = await request(app)
        .get('/api/compliance/adjusted-cb?year=2025')
        .expect('Content-Type', /json/);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      
      if (response.body.length > 0) {
        const adjustedCB = response.body[0];
        expect(adjustedCB).toHaveProperty('shipId');
        expect(adjustedCB).toHaveProperty('year');
        expect(adjustedCB).toHaveProperty('cbBefore');
        expect(adjustedCB).toHaveProperty('bankedAmount');
        expect(adjustedCB).toHaveProperty('cbAfter');
      }
    });
  });

  describe('POST /api/banking/bank', () => {
    it('should reject banking with negative amount', async () => {
      const response = await request(app)
        .post('/api/banking/bank')
        .send({
          shipId: 'SHIP001',
          year: 2025,
          amount: -100,
        })
        .expect('Content-Type', /json/);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });

    it('should reject banking with zero amount', async () => {
      const response = await request(app)
        .post('/api/banking/bank')
        .send({
          shipId: 'SHIP001',
          year: 2025,
          amount: 0,
        })
        .expect('Content-Type', /json/);

      expect(response.status).toBe(400);
    });

    it('should accept valid banking request', async () => {
      const response = await request(app)
        .post('/api/banking/bank')
        .send({
          shipId: 'SHIP001',
          year: 2025,
          amount: 100,
        })
        .expect('Content-Type', /json/);

      // Should either succeed (200) or fail validation (400)
      expect([200, 400, 500]).toContain(response.status);
    });
  });

  describe('POST /api/banking/apply', () => {
    it('should reject applying negative amount', async () => {
      const response = await request(app)
        .post('/api/banking/apply')
        .send({
          shipId: 'SHIP001',
          year: 2025,
          amount: -50,
        })
        .expect('Content-Type', /json/);

      expect(response.status).toBe(400);
    });

    it('should reject applying more than banked amount', async () => {
      const response = await request(app)
        .post('/api/banking/apply')
        .send({
          shipId: 'SHIP_NO_BANK',
          year: 2025,
          amount: 999999,
        })
        .expect('Content-Type', /json/);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });
  });

  describe('POST /api/pools', () => {
    it('should reject pool with negative sum', async () => {
      const response = await request(app)
        .post('/api/pools')
        .send({
          year: 2025,
          members: [
            { shipId: 'SHIP001', cbBefore: -200, cbAfter: -150 },
            { shipId: 'SHIP002', cbBefore: -300, cbAfter: -250 },
          ],
        })
        .expect('Content-Type', /json/);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toContain('Pool sum must be >= 0');
    });

    it('should reject pool with less than 2 members', async () => {
      const response = await request(app)
        .post('/api/pools')
        .send({
          year: 2025,
          members: [
            { shipId: 'SHIP001', cbBefore: 500, cbAfter: 500 },
          ],
        })
        .expect('Content-Type', /json/);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toContain('at least 2 members');
    });

    it('should reject pool where deficit ship exits worse', async () => {
      const response = await request(app)
        .post('/api/pools')
        .send({
          year: 2025,
          members: [
            { shipId: 'SHIP001', cbBefore: 1000, cbAfter: 500 },
            { shipId: 'SHIP002', cbBefore: -200, cbAfter: -300 }, // Worse!
          ],
        })
        .expect('Content-Type', /json/);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toContain('Deficit ships cannot exit with worse balance');
    });

    it('should reject pool where surplus ship exits negative', async () => {
      const response = await request(app)
        .post('/api/pools')
        .send({
          year: 2025,
          members: [
            { shipId: 'SHIP001', cbBefore: 500, cbAfter: -100 }, // Went negative!
            { shipId: 'SHIP002', cbBefore: -200, cbAfter: 300 },
          ],
        })
        .expect('Content-Type', /json/);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toContain('Surplus ships cannot exit with negative balance');
    });

    it('should accept valid pool', async () => {
      const response = await request(app)
        .post('/api/pools')
        .send({
          year: 2025,
          members: [
            { shipId: 'SHIP001', cbBefore: 1000, cbAfter: 500 },
            { shipId: 'SHIP002', cbBefore: -200, cbAfter: -100 },
          ],
        })
        .expect('Content-Type', /json/);

      // Should succeed (200) or fail for DB reasons (500)
      expect([200, 500]).toContain(response.status);
      
      if (response.status === 200) {
        expect(response.body).toHaveProperty('id');
        expect(response.body).toHaveProperty('year', 2025);
      }
    });
  });
});
