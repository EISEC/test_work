import { sortPools, filterPools, filterAndSortPools, getSortIcon, getFilterStats, validateFilterRanges } from '../../utils/tableUtils';
import { MiningPool, SortConfig, FilterConfig } from '../../types/miningPool';

// Mock данные для тестирования
const mockPools: MiningPool[] = [
  {
    id: 'pool-1',
    name: 'Antpool',
    hashrateTHs: 25420.8,
    activeWorkers: 8547,
    rejectRate: 0.8,
    status: 'online',
  },
  {
    id: 'pool-2',
    name: 'F2Pool',
    hashrateTHs: 18950.3,
    activeWorkers: 6234,
    rejectRate: 1.2,
    status: 'online',
  },
  {
    id: 'pool-3',
    name: 'Via BTC',
    hashrateTHs: 12670.5,
    activeWorkers: 4321,
    rejectRate: 2.1,
    status: 'degraded',
  },
  {
    id: 'pool-4',
    name: 'Slush Pool',
    hashrateTHs: 9834.2,
    activeWorkers: 3456,
    rejectRate: 0.9,
    status: 'online',
  },
  {
    id: 'pool-5',
    name: 'BTC.com',
    hashrateTHs: 7652.8,
    activeWorkers: 2987,
    rejectRate: 3.4,
    status: 'offline',
  },
];

const defaultFilterConfig: FilterConfig = {
  searchTerm: '',
  statusFilter: 'all',
  hashrateRange: { min: 0, max: 50000 },
  workersRange: { min: 0, max: 10000 },
  rejectRateRange: { min: 0, max: 10 },
};

describe('tableUtils', () => {
  describe('sortPools', () => {
    it('сортирует пулы по названию по возрастанию', () => {
      const sortConfig: SortConfig = { field: 'name', direction: 'asc' };
      const result = sortPools(mockPools, sortConfig);
      
      expect(result[0].name).toBe('Antpool');
      expect(result[1].name).toBe('BTC.com');
      expect(result[2].name).toBe('F2Pool');
      expect(result[3].name).toBe('Slush Pool');
      expect(result[4].name).toBe('Via BTC');
    });

    it('сортирует пулы по названию по убыванию', () => {
      const sortConfig: SortConfig = { field: 'name', direction: 'desc' };
      const result = sortPools(mockPools, sortConfig);
      
      expect(result[0].name).toBe('Via BTC');
      expect(result[1].name).toBe('Slush Pool');
      expect(result[2].name).toBe('F2Pool');
      expect(result[3].name).toBe('BTC.com');
      expect(result[4].name).toBe('Antpool');
    });

    it('сортирует пулы по хешрейту по убыванию', () => {
      const sortConfig: SortConfig = { field: 'hashrateTHs', direction: 'desc' };
      const result = sortPools(mockPools, sortConfig);
      
      expect(result[0].hashrateTHs).toBe(25420.8);
      expect(result[1].hashrateTHs).toBe(18950.3);
      expect(result[2].hashrateTHs).toBe(12670.5);
      expect(result[3].hashrateTHs).toBe(9834.2);
      expect(result[4].hashrateTHs).toBe(7652.8);
    });

    it('сортирует пулы по статусу (online > degraded > offline)', () => {
      const sortConfig: SortConfig = { field: 'status', direction: 'desc' };
      const result = sortPools(mockPools, sortConfig);
      
      // Проверяем, что online пулы идут первыми
      expect(result[0].status).toBe('online');
      expect(result[1].status).toBe('online');
      expect(result[2].status).toBe('online');
      expect(result[3].status).toBe('degraded');
      expect(result[4].status).toBe('offline');
    });

    it('не мутирует исходный массив', () => {
      const sortConfig: SortConfig = { field: 'name', direction: 'asc' };
      const originalOrder = mockPools.map(pool => pool.name);
      
      sortPools(mockPools, sortConfig);
      
      // Проверяем, что исходный массив не изменился
      expect(mockPools.map(pool => pool.name)).toEqual(originalOrder);
    });
  });

  describe('filterPools', () => {
    it('фильтрует пулы по поисковому запросу', () => {
      const filterConfig: FilterConfig = {
        ...defaultFilterConfig,
        searchTerm: 'pool',
      };
      
      const result = filterPools(mockPools, filterConfig);
      
      expect(result).toHaveLength(3);
      expect(result.map(p => p.name)).toContain('Antpool');
      expect(result.map(p => p.name)).toContain('F2Pool');
      expect(result.map(p => p.name)).toContain('Slush Pool');
    });

    it('фильтрует пулы по статусу', () => {
      const filterConfig: FilterConfig = {
        ...defaultFilterConfig,
        statusFilter: 'online',
      };
      
      const result = filterPools(mockPools, filterConfig);
      
      expect(result).toHaveLength(3);
      expect(result.every(pool => pool.status === 'online')).toBe(true);
    });

    it('фильтрует пулы по диапазону хешрейта', () => {
      const filterConfig: FilterConfig = {
        ...defaultFilterConfig,
        hashrateRange: { min: 10000, max: 20000 },
      };
      
      const result = filterPools(mockPools, filterConfig);
      
      expect(result).toHaveLength(2);
      expect(result[0].name).toBe('F2Pool');
      expect(result[1].name).toBe('Via BTC');
    });

    it('фильтрует пулы по диапазону воркеров', () => {
      const filterConfig: FilterConfig = {
        ...defaultFilterConfig,
        workersRange: { min: 5000, max: 7000 },
      };
      
      const result = filterPools(mockPools, filterConfig);
      
      expect(result).toHaveLength(1);
      expect(result[0].name).toBe('F2Pool');
    });

    it('фильтрует пулы по диапазону reject rate', () => {
      const filterConfig: FilterConfig = {
        ...defaultFilterConfig,
        rejectRateRange: { min: 0, max: 1 },
      };
      
      const result = filterPools(mockPools, filterConfig);
      
      expect(result).toHaveLength(2);
      expect(result[0].name).toBe('Antpool');
      expect(result[1].name).toBe('Slush Pool');
    });

    it('применяет несколько фильтров одновременно', () => {
      const filterConfig: FilterConfig = {
        ...defaultFilterConfig,
        statusFilter: 'online',
        hashrateRange: { min: 15000, max: 30000 },
      };
      
      const result = filterPools(mockPools, filterConfig);
      
      expect(result).toHaveLength(2);
      expect(result[0].name).toBe('Antpool');
      expect(result[1].name).toBe('F2Pool');
    });

    it('возвращает пустой массив если ничего не найдено', () => {
      const filterConfig: FilterConfig = {
        ...defaultFilterConfig,
        searchTerm: 'nonexistent',
      };
      
      const result = filterPools(mockPools, filterConfig);
      
      expect(result).toHaveLength(0);
    });
  });

  describe('filterAndSortPools', () => {
    it('применяет фильтрацию и сортировку', () => {
      const filterConfig: FilterConfig = {
        ...defaultFilterConfig,
        statusFilter: 'online',
      };
      const sortConfig: SortConfig = { field: 'hashrateTHs', direction: 'desc' };
      
      const result = filterAndSortPools(mockPools, filterConfig, sortConfig);
      
      expect(result).toHaveLength(3);
      expect(result[0].name).toBe('Antpool'); // Наибольший хешрейт среди online
      expect(result[1].name).toBe('F2Pool');
      expect(result[2].name).toBe('Slush Pool');
    });
  });

  describe('getSortIcon', () => {
    it('возвращает иконку направления сортировки для активного поля', () => {
      const sortConfig: SortConfig = { field: 'name', direction: 'asc' };
      
      expect(getSortIcon('name', sortConfig)).toBe('↑');
      
      const sortConfigDesc: SortConfig = { field: 'name', direction: 'desc' };
      expect(getSortIcon('name', sortConfigDesc)).toBe('↓');
    });

    it('возвращает нейтральную иконку для неактивного поля', () => {
      const sortConfig: SortConfig = { field: 'name', direction: 'asc' };
      
      expect(getSortIcon('hashrateTHs', sortConfig)).toBe('↕️');
    });
  });

  describe('getFilterStats', () => {
    it('возвращает статистику без фильтрации', () => {
      const result = getFilterStats(5, 5);
      
      expect(result.isFiltered).toBe(false);
      expect(result.stats).toBe('Показано 5 пулов');
    });

    it('возвращает статистику с фильтрацией', () => {
      const result = getFilterStats(5, 3);
      
      expect(result.isFiltered).toBe(true);
      expect(result.stats).toBe('Показано 3 из 5 пулов');
    });
  });

  describe('validateFilterRanges', () => {
    it('исправляет перевернутые диапазоны', () => {
      const invalidConfig: FilterConfig = {
        ...defaultFilterConfig,
        hashrateRange: { min: 1000, max: 500 }, // min > max
      };
      
      const result = validateFilterRanges(invalidConfig);
      
      expect(result.hashrateRange.min).toBe(500);
      expect(result.hashrateRange.max).toBe(500);
    });

    it('исправляет отрицательные значения', () => {
      const invalidConfig: FilterConfig = {
        ...defaultFilterConfig,
        hashrateRange: { min: -100, max: 1000 },
        workersRange: { min: -50, max: 500 },
      };
      
      const result = validateFilterRanges(invalidConfig);
      
      expect(result.hashrateRange.min).toBe(0);
      expect(result.workersRange.min).toBe(0);
    });

    it('не изменяет валидные диапазоны', () => {
      const validConfig: FilterConfig = {
        ...defaultFilterConfig,
        hashrateRange: { min: 100, max: 1000 },
        workersRange: { min: 50, max: 500 },
      };
      
      const result = validateFilterRanges(validConfig);
      
      expect(result.hashrateRange).toEqual({ min: 100, max: 1000 });
      expect(result.workersRange).toEqual({ min: 50, max: 500 });
    });
  });
}); 