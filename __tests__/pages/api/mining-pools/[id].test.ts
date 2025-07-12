import handler from '../../../../pages/api/mining-pools/[id]';
import { createMocks } from 'node-mocks-http';
import { NextApiRequest, NextApiResponse } from 'next';

describe('/api/mining-pools/[id] API endpoint', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('должен возвращать детали пула для валидного ID', async () => {
    const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
      method: 'GET',
      query: { id: 'pool-1' },
    });

    jest.spyOn(global, 'setTimeout').mockImplementation((callback: any) => {
      callback();
      return {} as any;
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(200);
    
    const data = JSON.parse(res._getData());
    
    // Проверяем базовые свойства
    expect(data).toHaveProperty('id', 'pool-1');
    expect(data).toHaveProperty('name');
    expect(data).toHaveProperty('hashrateTHs');
    expect(data).toHaveProperty('activeWorkers');
    expect(data).toHaveProperty('rejectRate');
    expect(data).toHaveProperty('status');
    
    // Проверяем дополнительные свойства
    expect(data).toHaveProperty('last24hRevenueBTC');
    expect(data).toHaveProperty('uptimePercent');
    expect(data).toHaveProperty('location');
    expect(data).toHaveProperty('feePercent');

    // Проверяем типы данных
    expect(typeof data.last24hRevenueBTC).toBe('number');
    expect(typeof data.uptimePercent).toBe('number');
    expect(typeof data.location).toBe('string');
    expect(typeof data.feePercent).toBe('number');

    jest.restoreAllMocks();
  });

  test('должен возвращать 404 для несуществующего ID', async () => {
    const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
      method: 'GET',
      query: { id: 'nonexistent-pool' },
    });

    jest.spyOn(global, 'setTimeout').mockImplementation((callback: any) => {
      callback();
      return {} as any;
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(404);
    
    const data = JSON.parse(res._getData());
    expect(data).toHaveProperty('error', 'Майнинг-пул не найден');

    jest.restoreAllMocks();
  });

  test('должен возвращать 405 для POST запроса', async () => {
    const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
      method: 'POST',
      query: { id: 'pool-1' },
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

  test('должен возвращать валидные значения для всех известных пулов', async () => {
    const poolIds = ['pool-1', 'pool-2', 'pool-3', 'pool-4'];
    
    for (const poolId of poolIds) {
      const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
        method: 'GET',
        query: { id: poolId },
      });

      jest.spyOn(global, 'setTimeout').mockImplementation((callback: any) => {
        callback();
        return {} as any;
      });

      await handler(req, res);

      expect(res._getStatusCode()).toBe(200);
      
      const data = JSON.parse(res._getData());
      
      // Проверяем валидность значений
      expect(data.uptimePercent).toBeGreaterThanOrEqual(0);
      expect(data.uptimePercent).toBeLessThanOrEqual(100);
      expect(data.feePercent).toBeGreaterThanOrEqual(0);
      expect(data.feePercent).toBeLessThanOrEqual(10);
      expect(data.last24hRevenueBTC).toBeGreaterThanOrEqual(0);
      expect(data.location).toBeTruthy();

      jest.restoreAllMocks();
    }
  });

  test('должен применять вариации для онлайн пулов', async () => {
    const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
      method: 'GET',
      query: { id: 'pool-1' }, // pool-1 имеет статус 'online'
    });

    jest.spyOn(global, 'setTimeout').mockImplementation((callback: any) => {
      callback();
      return {} as any;
    });

    // Мокаем Math.random для предсказуемого результата
    const originalRandom = Math.random;
    Math.random = jest.fn(() => 0.5);

    await handler(req, res);

    const data = JSON.parse(res._getData());
    
    // Для онлайн пула значения должны быть модифицированы рандомизацией
    expect(data.status).toBe('online');
    expect(typeof data.hashrateTHs).toBe('number');
    expect(typeof data.activeWorkers).toBe('number');

    // Восстанавливаем оригинальные функции
    Math.random = originalRandom;
    jest.restoreAllMocks();
  });
}); 