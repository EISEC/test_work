import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import {
  setSearchTerm,
  setStatusFilter,
  setHashrateRange,
  setWorkersRange,
  setRejectRateRange,
  resetFilters,
} from '../store/slices/miningPoolsSlice';
import { PoolStatus } from '../types/miningPool';

interface MiningPoolsFilterProps {
  className?: string;
}

const MiningPoolsFilter: React.FC<MiningPoolsFilterProps> = ({ className = '' }) => {
  const dispatch = useDispatch();
  const { filterConfig } = useSelector((state: RootState) => state.miningPools);
  
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [tempHashrateRange, setTempHashrateRange] = useState(filterConfig.hashrateRange);
  const [tempWorkersRange, setTempWorkersRange] = useState(filterConfig.workersRange);
  const [tempRejectRateRange, setTempRejectRateRange] = useState(filterConfig.rejectRateRange);

  // Обновляем локальные значения при изменении глобального состояния
  useEffect(() => {
    setTempHashrateRange(filterConfig.hashrateRange);
    setTempWorkersRange(filterConfig.workersRange);
    setTempRejectRateRange(filterConfig.rejectRateRange);
  }, [filterConfig]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setSearchTerm(e.target.value));
  };

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    dispatch(setStatusFilter(e.target.value as PoolStatus | 'all'));
  };

  const handleHashrateRangeChange = (type: 'min' | 'max', value: number) => {
    const newRange = { ...tempHashrateRange, [type]: value };
    setTempHashrateRange(newRange);
    dispatch(setHashrateRange(newRange));
  };

  const handleWorkersRangeChange = (type: 'min' | 'max', value: number) => {
    const newRange = { ...tempWorkersRange, [type]: value };
    setTempWorkersRange(newRange);
    dispatch(setWorkersRange(newRange));
  };

  const handleRejectRateRangeChange = (type: 'min' | 'max', value: number) => {
    const newRange = { ...tempRejectRateRange, [type]: value };
    setTempRejectRateRange(newRange);
    dispatch(setRejectRateRange(newRange));
  };

  const handleResetFilters = () => {
    dispatch(resetFilters());
  };

  const isFiltered = filterConfig.searchTerm || 
    filterConfig.statusFilter !== 'all' ||
    filterConfig.hashrateRange.min > 0 ||
    filterConfig.hashrateRange.max < 50000 ||
    filterConfig.workersRange.min > 0 ||
    filterConfig.workersRange.max < 10000 ||
    filterConfig.rejectRateRange.min > 0 ||
    filterConfig.rejectRateRange.max < 10;

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-6 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          Фильтры и поиск
        </h3>
        <div className="flex items-center space-x-2">
          {isFiltered && (
            <span className="text-sm text-blue-600 dark:text-blue-400">
              Применены фильтры
            </span>
          )}
          <button
            onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
            className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
          >
            {showAdvancedFilters ? 'Скрыть' : 'Показать'} расширенные
          </button>
        </div>
      </div>

      {/* Основные фильтры */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        {/* Поиск */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Поиск по названию
          </label>
          <input
            type="text"
            value={filterConfig.searchTerm}
            onChange={handleSearchChange}
            placeholder="Введите название пула..."
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Фильтр по статусу */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Статус
          </label>
          <select
            value={filterConfig.statusFilter}
            onChange={handleStatusChange}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">Все статусы</option>
            <option value="online">Online</option>
            <option value="degraded">Degraded</option>
            <option value="offline">Offline</option>
          </select>
        </div>

        {/* Кнопка сброса */}
        <div className="flex items-end">
          <button
            onClick={handleResetFilters}
            disabled={!isFiltered}
            className={`w-full px-4 py-2 rounded-md text-sm font-medium transition-colors
              ${isFiltered
                ? 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                : 'bg-gray-50 dark:bg-gray-800 text-gray-400 dark:text-gray-500 cursor-not-allowed'
              }`}
          >
            Сбросить фильтры
          </button>
        </div>
      </div>

      {/* Расширенные фильтры */}
      {showAdvancedFilters && (
        <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
          <h4 className="text-md font-medium text-gray-900 dark:text-gray-100 mb-4">
            Расширенные фильтры
          </h4>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Диапазон хешрейта */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Хешрейт (TH/s)
              </label>
              <div className="flex items-center space-x-2">
                <input
                  type="number"
                  placeholder="От"
                  value={tempHashrateRange.min}
                  onChange={(e) => handleHashrateRangeChange('min', Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <span className="text-gray-500">-</span>
                <input
                  type="number"
                  placeholder="До"
                  value={tempHashrateRange.max}
                  onChange={(e) => handleHashrateRangeChange('max', Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            {/* Диапазон воркеров */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Активные воркеры
              </label>
              <div className="flex items-center space-x-2">
                <input
                  type="number"
                  placeholder="От"
                  value={tempWorkersRange.min}
                  onChange={(e) => handleWorkersRangeChange('min', Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <span className="text-gray-500">-</span>
                <input
                  type="number"
                  placeholder="До"
                  value={tempWorkersRange.max}
                  onChange={(e) => handleWorkersRangeChange('max', Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            {/* Диапазон reject rate */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Reject Rate (%)
              </label>
              <div className="flex items-center space-x-2">
                <input
                  type="number"
                  placeholder="От"
                  step="0.1"
                  value={tempRejectRateRange.min}
                  onChange={(e) => handleRejectRateRangeChange('min', Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <span className="text-gray-500">-</span>
                <input
                  type="number"
                  placeholder="До"
                  step="0.1"
                  value={tempRejectRateRange.max}
                  onChange={(e) => handleRejectRateRangeChange('max', Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MiningPoolsFilter; 