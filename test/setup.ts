// Test setup file
import { beforeAll, afterAll } from 'vitest';
import 'dotenv/config';

beforeAll(() => {
  // Set test environment variables
  process.env.NODE_ENV = 'test';
  // Use existing DATABASE_URL or set a placeholder for unit tests that don't need DB
  if (!process.env.DATABASE_URL) {
    process.env.DATABASE_URL = 'postgresql://test:test@localhost:5432/test';
  }
});

afterAll(() => {
  // Cleanup after tests
});
