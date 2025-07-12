import handler from '../../../pages/api/mining-pools';
import { createMocks } from 'node-mocks-http';
import { NextApiRequest, NextApiResponse } from 'next';

describe('/api/mining-pools API endpoint', () => {
  test('должен возвращать список майнинг-пулов при GET запросе', async () => {
    const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
      method: 'GET',
    });

    // Мокаем setTimeout для ускорения теста
    jest.spyOn(global, 'setTimeout').mockImplementation((callback: any) => {
      callback();
      return {} as any;
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(200);
    
    const data = JSON.parse(res._getData());
    expect(Array.isArray(data)).toBe(true);
    expect(data.length).toBeGreaterThan(0);

    // Проверяем структуру данных первого пула
    const firstPool = data[0];
    expect(firstPool).toHaveProperty('id');
    expect(firstPool).toHaveProperty('name');
    expect(firstPool).toHaveProperty('hashrateTHs');
    expect(firstPool).toHaveProperty('activeWorkers');
    expect(firstPool).toHaveProperty('rejectRate');
    expect(firstPool).toHaveProperty('status');

    // Проверяем типы данных
    expect(typeof firstPool.id).toBe('string');
    expect(typeof firstPool.name).toBe('string');
    expect(typeof firstPool.hashrateTHs).toBe('number');
    expect(typeof firstPool.activeWorkers).toBe('number');
    expect(typeof firstPool.rejectRate).toBe('number');
    expect(['online', 'degraded', 'offline']).toContain(firstPool.status);

    // Восстанавливаем setTimeout
    jest.restoreAllMocks();
  });

  test('должен возвращать 405 для POST запроса', async () => {
    const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
      method: 'POST',
    });

    jest.spyOn(global, 'setTimeout').mockImplementation((callback: any) => {
      callback();
      return {} as any;
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(405);
    expect(res.getHeader('Allow')).toEqual(['GET']);

    jest.restoreAllMocks();
  });

  test('должен возвращать корректные статусы пулов', async () => {
    const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
      method: 'GET',
    });

    jest.spyOn(global, 'setTimeout').mockImplementation((callback: any) => {
      callback();
      return {} as any;
    });

    await handler(req, res);

    const data = JSON.parse(res._getData());
    
    // Проверяем, что есть пулы с разными статусами
    const statuses = data.map((pool: any) => pool.status);
    const uniqueStatuses = [...new Set(statuses)];
    
    expect(uniqueStatuses.length).toBeGreaterThan(1);
    uniqueStatuses.forEach(status => {
      expect(['online', 'degraded', 'offline']).toContain(status);
    });

    jest.restoreAllMocks();
  });

  test('должен возвращать пулы с валидными числовыми значениями', async () => {
    const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
      method: 'GET',
    });

    jest.spyOn(global, 'setTimeout').mockImplementation((callback: any) => {
      callback();
      return {} as any;
    });

    await handler(req, res);

    const data = JSON.parse(res._getData());
    
    data.forEach((pool: any) => {
      expect(pool.hashrateTHs).toBeGreaterThanOrEqual(0);
      expect(pool.activeWorkers).toBeGreaterThanOrEqual(0);
      expect(pool.rejectRate).toBeGreaterThanOrEqual(0);
      expect(pool.rejectRate).toBeLessThanOrEqual(1);
    });

    jest.restoreAllMocks();
  });
}); 