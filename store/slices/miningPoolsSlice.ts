import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { SortConfig, FilterConfig, SortField, SortDirection, PoolStatus } from '../../types/miningPool';

// Начальное состояние фильтров
const initialFilterConfig: FilterConfig = {
  searchTerm: '',
  statusFilter: 'all',
  hashrateRange: { min: 0, max: 50000 },
  workersRange: { min: 0, max: 10000 },
  rejectRateRange: { min: 0, max: 10 },
};

// Начальное состояние сортировки
const initialSortConfig: SortConfig = {
  field: 'hashrateTHs',
  direction: 'desc',
};

interface MiningPoolsFilterState {
  sortConfig: SortConfig;
  filterConfig: FilterConfig;
}

const initialState: MiningPoolsFilterState = {
  sortConfig: initialSortConfig,
  filterConfig: initialFilterConfig,
};

const miningPoolsSlice = createSlice({
  name: 'miningPools',
  initialState,
  reducers: {
    // Действия для сортировки
    setSortConfig: (state, action: PayloadAction<SortConfig>) => {
      state.sortConfig = action.payload;
    },
    setSortField: (state, action: PayloadAction<SortField>) => {
      const currentField = state.sortConfig.field;
      const currentDirection = state.sortConfig.direction;
      
      if (currentField === action.payload) {
        // Если поле то же, меняем направление
        state.sortConfig.direction = currentDirection === 'asc' ? 'desc' : 'asc';
      } else {
        // Если поле другое, устанавливаем новое поле с направлением по умолчанию
        state.sortConfig.field = action.payload;
        state.sortConfig.direction = 'desc';
      }
    },
    
    // Действия для фильтрации
    setFilterConfig: (state, action: PayloadAction<FilterConfig>) => {
      state.filterConfig = action.payload;
    },
    setSearchTerm: (state, action: PayloadAction<string>) => {
      state.filterConfig.searchTerm = action.payload;
    },
    setStatusFilter: (state, action: PayloadAction<PoolStatus | 'all'>) => {
      state.filterConfig.statusFilter = action.payload;
    },
    setHashrateRange: (state, action: PayloadAction<{ min: number; max: number }>) => {
      state.filterConfig.hashrateRange = action.payload;
    },
    setWorkersRange: (state, action: PayloadAction<{ min: number; max: number }>) => {
      state.filterConfig.workersRange = action.payload;
    },
    setRejectRateRange: (state, action: PayloadAction<{ min: number; max: number }>) => {
      state.filterConfig.rejectRateRange = action.payload;
    },
    
    // Сброс всех фильтров
    resetFilters: (state) => {
      state.filterConfig = initialFilterConfig;
      state.sortConfig = initialSortConfig;
    },
  },
});

export const {
  setSortConfig,
  setSortField,
  setFilterConfig,
  setSearchTerm,
  setStatusFilter,
  setHashrateRange,
  setWorkersRange,
  setRejectRateRange,
  resetFilters,
} = miningPoolsSlice.actions;

export default miningPoolsSlice.reducer; 