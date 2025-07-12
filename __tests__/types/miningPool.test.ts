import { PoolStatus, MiningPool, MiningPoolDetails } from '../../types/miningPool';

describe('Types - MiningPool', () => {
  test('PoolStatus должен содержать корректные значения', () => {
    const validStatuses: PoolStatus[] = ['online', 'degraded', 'offline'];
    
    validStatuses.forEach(status => {
      expect(['online', 'degraded', 'offline']).toContain(status);
    });
  });

  test('MiningPool должен иметь корректную структуру', () => {
    const mockPool: MiningPool = {
      id: 'test-pool',
      name: 'Test Pool',
      hashrateTHs: 100.5,
      activeWorkers: 1000,
      rejectRate: 0.02,
      status: 'online'
    };

    expect(mockPool.id).toBe('test-pool');
    expect(mockPool.name).toBe('Test Pool');
    expect(mockPool.hashrateTHs).toBe(100.5);
    expect(mockPool.activeWorkers).toBe(1000);
    expect(mockPool.rejectRate).toBe(0.02);
    expect(mockPool.status).toBe('online');
  });

  test('MiningPoolDetails должен расширять MiningPool', () => {
    const mockPoolDetails: MiningPoolDetails = {
      id: 'test-pool',
      name: 'Test Pool',
      hashrateTHs: 100.5,
      activeWorkers: 1000,
      rejectRate: 0.02,
      status: 'online',
      last24hRevenueBTC: 0.05,
      uptimePercent: 99.5,
      location: 'Test Location',
      feePercent: 1.0
    };

    // Проверяем базовые свойства из MiningPool
    expect(mockPoolDetails.id).toBe('test-pool');
    expect(mockPoolDetails.name).toBe('Test Pool');
    expect(mockPoolDetails.hashrateTHs).toBe(100.5);
    expect(mockPoolDetails.activeWorkers).toBe(1000);
    expect(mockPoolDetails.rejectRate).toBe(0.02);
    expect(mockPoolDetails.status).toBe('online');

    // Проверяем дополнительные свойства из MiningPoolDetails
    expect(mockPoolDetails.last24hRevenueBTC).toBe(0.05);
    expect(mockPoolDetails.uptimePercent).toBe(99.5);
    expect(mockPoolDetails.location).toBe('Test Location');
    expect(mockPoolDetails.feePercent).toBe(1.0);
  });

  test('должен поддерживать все статусы пулов', () => {
    const onlinePool: MiningPool = {
      id: 'pool-1',
      name: 'Online Pool',
      hashrateTHs: 500,
      activeWorkers: 1500,
      rejectRate: 0.01,
      status: 'online'
    };

    const degradedPool: MiningPool = {
      id: 'pool-2',
      name: 'Degraded Pool',
      hashrateTHs: 300,
      activeWorkers: 800,
      rejectRate: 0.05,
      status: 'degraded'
    };

    const offlinePool: MiningPool = {
      id: 'pool-3',
      name: 'Offline Pool',
      hashrateTHs: 0,
      activeWorkers: 0,
      rejectRate: 0,
      status: 'offline'
    };

    expect(onlinePool.status).toBe('online');
    expect(degradedPool.status).toBe('degraded');
    expect(offlinePool.status).toBe('offline');
  });
}); 