import { MiningPool, SortConfig, FilterConfig } from '../types/miningPool';

// Функция для сортировки массива пулов
export const sortPools = (pools: MiningPool[], sortConfig: SortConfig): MiningPool[] => {
  return [...pools].sort((a, b) => {
    let aValue: any = a[sortConfig.field];
    let bValue: any = b[sortConfig.field];

    // Специальная обработка для разных типов данных
    switch (sortConfig.field) {
      case 'name':
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
        break;
      case 'status':
        // Приоритет статусов: online > degraded > offline
        const statusPriority = { online: 3, degraded: 2, offline: 1 };
        aValue = statusPriority[aValue] || 0;
        bValue = statusPriority[bValue] || 0;
        break;
      case 'hashrateTHs':
      case 'activeWorkers':
      case 'rejectRate':
        aValue = Number(aValue);
        bValue = Number(bValue);
        break;
    }

    // Сравнение значений
    if (aValue < bValue) {
      return sortConfig.direction === 'asc' ? -1 : 1;
    }
    if (aValue > bValue) {
      return sortConfig.direction === 'asc' ? 1 : -1;
    }
    return 0;
  });
};

// Функция для фильтрации массива пулов
export const filterPools = (pools: MiningPool[], filterConfig: FilterConfig): MiningPool[] => {
  return pools.filter(pool => {
    // Фильтр по поисковому запросу
    if (filterConfig.searchTerm) {
      const searchTerm = filterConfig.searchTerm.toLowerCase();
      if (!pool.name.toLowerCase().includes(searchTerm)) {
        return false;
      }
    }

    // Фильтр по статусу
    if (filterConfig.statusFilter !== 'all') {
      if (pool.status !== filterConfig.statusFilter) {
        return false;
      }
    }

    // Фильтр по хешрейту
    if (pool.hashrateTHs < filterConfig.hashrateRange.min || 
        pool.hashrateTHs > filterConfig.hashrateRange.max) {
      return false;
    }

    // Фильтр по количеству воркеров
    if (pool.activeWorkers < filterConfig.workersRange.min || 
        pool.activeWorkers > filterConfig.workersRange.max) {
      return false;
    }

    // Фильтр по reject rate
    if (pool.rejectRate < filterConfig.rejectRateRange.min || 
        pool.rejectRate > filterConfig.rejectRateRange.max) {
      return false;
    }

    return true;
  });
};

// Комбинированная функция для фильтрации и сортировки
export const filterAndSortPools = (
  pools: MiningPool[], 
  filterConfig: FilterConfig, 
  sortConfig: SortConfig
): MiningPool[] => {
  const filteredPools = filterPools(pools, filterConfig);
  return sortPools(filteredPools, sortConfig);
};

// Функция для получения иконки сортировки
export const getSortIcon = (field: string, sortConfig: SortConfig): string => {
  if (sortConfig.field !== field) {
    return '↕️'; // Без сортировки
  }
  return sortConfig.direction === 'asc' ? '↑' : '↓';
};

// Функция для получения статистики фильтрации
export const getFilterStats = (
  totalPools: number, 
  filteredPools: number
): { isFiltered: boolean; stats: string } => {
  const isFiltered = filteredPools < totalPools;
  const stats = isFiltered 
    ? `Показано ${filteredPools} из ${totalPools} пулов`
    : `Показано ${totalPools} пулов`;
  
  return { isFiltered, stats };
};

// Функция для валидации диапазонов фильтров
export const validateFilterRanges = (filterConfig: FilterConfig): FilterConfig => {
  const validated = { ...filterConfig };
  
  // Валидация хешрейта
  if (validated.hashrateRange.min > validated.hashrateRange.max) {
    validated.hashrateRange.min = validated.hashrateRange.max;
  }
  
  // Валидация воркеров
  if (validated.workersRange.min > validated.workersRange.max) {
    validated.workersRange.min = validated.workersRange.max;
  }
  
  // Валидация reject rate
  if (validated.rejectRateRange.min > validated.rejectRateRange.max) {
    validated.rejectRateRange.min = validated.rejectRateRange.max;
  }
  
  // Проверка на отрицательные значения
  validated.hashrateRange.min = Math.max(0, validated.hashrateRange.min);
  validated.hashrateRange.max = Math.max(0, validated.hashrateRange.max);
  validated.workersRange.min = Math.max(0, validated.workersRange.min);
  validated.workersRange.max = Math.max(0, validated.workersRange.max);
  validated.rejectRateRange.min = Math.max(0, validated.rejectRateRange.min);
  validated.rejectRateRange.max = Math.max(0, validated.rejectRateRange.max);
  
  return validated;
}; 