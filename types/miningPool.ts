export type PoolStatus = 'online' | 'degraded' | 'offline';

export interface MiningPool {
  id: string;
  name: string;
  hashrateTHs: number;
  activeWorkers: number;
  rejectRate: number;
  status: PoolStatus;
}

export interface MiningPoolDetails extends MiningPool {
  last24hRevenueBTC: number;
  uptimePercent: number;
  location: string;
  feePercent: number;
}

export interface MiningPoolsState {
  pools: MiningPool[];
  loading: boolean;
  error: string | null;
  lastUpdated: number | null;
}

export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
}

// Типы для сортировки
export type SortField = 'name' | 'hashrateTHs' | 'activeWorkers' | 'rejectRate' | 'status';
export type SortDirection = 'asc' | 'desc';

export interface SortConfig {
  field: SortField;
  direction: SortDirection;
}

// Типы для фильтрации
export interface FilterConfig {
  searchTerm: string;
  statusFilter: PoolStatus | 'all';
  hashrateRange: {
    min: number;
    max: number;
  };
  workersRange: {
    min: number;
    max: number;
  };
  rejectRateRange: {
    min: number;
    max: number;
  };
}

// Обновленное состояние с фильтрами
export interface MiningPoolsState {
  pools: MiningPool[];
  loading: boolean;
  error: string | null;
  lastUpdated: number | null;
  sortConfig: SortConfig;
  filterConfig: FilterConfig;
} 