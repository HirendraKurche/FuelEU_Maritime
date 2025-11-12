// @vitest-environment node
import { describe, it, expect } from 'vitest';
import RoutesPage from './Routes';
import ComparePage from './Compare';
import BankingPage from './Banking';
import PoolingPage from './Pooling';

describe('Pages smoke tests', () => {
  it('Routes page should export a component', () => {
    expect(RoutesPage).toBeTruthy();
  });

  it('Compare page should export a component', () => {
    expect(ComparePage).toBeTruthy();
  });

  it('Banking page should export a component', () => {
    expect(BankingPage).toBeTruthy();
  });

  it('Pooling page should export a component', () => {
    expect(PoolingPage).toBeTruthy();
  });
});
