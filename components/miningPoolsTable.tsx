import React, { useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useGetMiningPoolsQuery } from '../store/api/miningPoolsApi';
import { MiningPoolDetailsModal } from './miningPoolDetailsModal';
import { setSortField } from '../store/slices/miningPoolsSlice';
import { RootState } from '../store';
import { PoolStatus, SortField } from '../types/miningPool';
import { filterAndSortPools, getSortIcon, getFilterStats } from '../utils/tableUtils';

const formatHashrate = (hashrate: number): string => {
  if (hashrate === 0) return '0 TH/s';
  return `${hashrate.toFixed(1)} TH/s`;
};

const formatRejectRate = (rate: number): string => {
  return `${(rate * 100).toFixed(2)}%`;
};

const getStatusBadge = (status: PoolStatus): { text: string; className: string } => {
  switch (status) {
    case 'online':
      return {
        text: 'Онлайн',
        className: 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200'
      };
    case 'degraded':
      return {
        text: 'Ограничен',
        className: 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200'
      };
    case 'offline':
      return {
        text: 'Оффлайн',
        className: 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200'
      };
    default:
      return {
        text: 'Неизвестно',
        className: 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
      };
  }
};

const LoadingSkeleton = () => {
  return (
    <div className="card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-800">
            <tr>
              {['Название пула', 'Хешрейт', 'Активные воркеры', 'Reject Rate', 'Статус', 'Действия'].map((header, index) => (
                <th key={index} className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {[...Array(4)].map((_, index) => (
              <tr key={index} className="animate-pulse">
                <td className="px-6 py-4"><div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-32"></div></td>
                <td className="px-6 py-4"><div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-20"></div></td>
                <td className="px-6 py-4"><div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-16"></div></td>
                <td className="px-6 py-4"><div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-14"></div></td>
                <td className="px-6 py-4"><div className="h-6 bg-gray-300 dark:bg-gray-600 rounded-full w-20"></div></td>
                <td className="px-6 py-4"><div className="h-8 bg-gray-300 dark:bg-gray-600 rounded w-24"></div></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const ErrorMessage = ({ error }: { error: any }) => {
  return (
    <div className="card p-6 text-center">
      <div className="text-red-600 dark:text-red-400 text-xl mb-2">⚠️ Ошибка загрузки</div>
      <p className="text-gray-600 dark:text-gray-300">
        Не удалось загрузить данные майнинг-пулов. Попробуйте обновить страницу.
      </p>
      <button
        onClick={() => window.location.reload()}
        className="btn-primary mt-4"
      >
        Обновить страницу
      </button>
    </div>
  );
};

export const MiningPoolsTable: React.FC = () => {
  const dispatch = useDispatch();
  const { data: pools, error, isLoading, refetch } = useGetMiningPoolsQuery(undefined, {
    pollingInterval: 30000, // Автообновление каждые 30 секунд
  });
  
  const { sortConfig, filterConfig } = useSelector((state: RootState) => state.miningPools);
  
  const [selectedPoolId, setSelectedPoolId] = useState<string | null>(null);
  const [selectedPoolName, setSelectedPoolName] = useState<string>('');

  // Фильтрация и сортировка пулов
  const filteredAndSortedPools = useMemo(() => {
    if (!pools) return [];
    return filterAndSortPools(pools, filterConfig, sortConfig);
  }, [pools, filterConfig, sortConfig]);

  // Статистика фильтрации
  const filterStats = useMemo(() => {
    if (!pools) return { isFiltered: false, stats: 'Загрузка...' };
    return getFilterStats(pools.length, filteredAndSortedPools.length);
  }, [pools, filteredAndSortedPools]);

  // Обработчик клика по заголовку для сортировки
  const handleSort = (field: SortField) => {
    dispatch(setSortField(field));
  };

  const openModal = (poolId: string, poolName: string) => {
    setSelectedPoolId(poolId);
    setSelectedPoolName(poolName);
  };

  const closeModal = () => {
    setSelectedPoolId(null);
    setSelectedPoolName('');
  };

  if (isLoading) {
    return <LoadingSkeleton />;
  }

  if (error) {
    return <ErrorMessage error={error} />;
  }

  if (!pools || pools.length === 0) {
    return (
      <div className="card p-6 text-center">
        <div className="text-gray-600 dark:text-gray-300 text-xl mb-2">📊 Нет данных</div>
        <p className="text-gray-500 dark:text-gray-400">Майнинг-пулы не найдены</p>
      </div>
    );
  }

  if (filteredAndSortedPools.length === 0 && filterStats.isFiltered) {
    return (
      <div className="card p-6 text-center">
        <div className="text-gray-600 dark:text-gray-300 text-xl mb-2">🔍 Нет результатов</div>
        <p className="text-gray-500 dark:text-gray-400">
          По заданным фильтрам майнинг-пулы не найдены. Попробуйте изменить критерии поиска.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-6">
        {/* Общая статистика */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="card p-6 text-center">
            <div className="metric-value text-green-600">{filteredAndSortedPools.filter(pool => pool.status === 'online').length}</div>
            <div className="metric-label">Активных пулов</div>
          </div>
          <div className="card p-6 text-center">
            <div className="metric-value text-blue-600">
              {filteredAndSortedPools
                .filter(pool => pool.status === 'online')
                .reduce((sum, pool) => sum + pool.hashrateTHs, 0)
                .toFixed(1)} TH/s
            </div>
            <div className="metric-label">Общий хешрейт</div>
          </div>
          <div className="card p-6 text-center">
            <div className="metric-value text-purple-600">
              {filteredAndSortedPools
                .filter(pool => pool.status === 'online')
                .reduce((sum, pool) => sum + pool.activeWorkers, 0)
                .toLocaleString()}
            </div>
            <div className="metric-label">Всего воркеров</div>
          </div>
          <div className="card p-6 text-center">
            <div className="metric-value text-orange-600">{filteredAndSortedPools.length}</div>
            <div className="metric-label">Отображено пулов</div>
          </div>
        </div>

        {/* Статистика фильтрации */}
        {filterStats.isFiltered && (
          <div className="card p-4 bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-700">
            <div className="flex items-center justify-between">
              <div className="text-sm text-blue-800 dark:text-blue-200">
                📊 {filterStats.stats}
              </div>
              <div className="text-xs text-blue-600 dark:text-blue-400">
                Применены фильтры
              </div>
            </div>
          </div>
        )}

        {/* Таблица пулов */}
        <div className="card overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Майнинг-пулы
            </h3>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-800">
                <tr>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    onClick={() => handleSort('name')}
                  >
                    <div className="flex items-center space-x-1">
                      <span>Название пула</span>
                      <span className="text-gray-400">{getSortIcon('name', sortConfig)}</span>
                    </div>
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    onClick={() => handleSort('hashrateTHs')}
                  >
                    <div className="flex items-center space-x-1">
                      <span>Хешрейт</span>
                      <span className="text-gray-400">{getSortIcon('hashrateTHs', sortConfig)}</span>
                    </div>
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    onClick={() => handleSort('activeWorkers')}
                  >
                    <div className="flex items-center space-x-1">
                      <span>Активные воркеры</span>
                      <span className="text-gray-400">{getSortIcon('activeWorkers', sortConfig)}</span>
                    </div>
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    onClick={() => handleSort('rejectRate')}
                  >
                    <div className="flex items-center space-x-1">
                      <span>Reject Rate</span>
                      <span className="text-gray-400">{getSortIcon('rejectRate', sortConfig)}</span>
                    </div>
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    onClick={() => handleSort('status')}
                  >
                    <div className="flex items-center space-x-1">
                      <span>Статус</span>
                      <span className="text-gray-400">{getSortIcon('status', sortConfig)}</span>
                    </div>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Действия
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {filteredAndSortedPools.map((pool) => {
                  const statusBadge = getStatusBadge(pool.status);
                  return (
                    <tr key={pool.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                            {pool.name}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 dark:text-gray-100 font-mono">
                          {formatHashrate(pool.hashrateTHs)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 dark:text-gray-100">
                          {pool.activeWorkers.toLocaleString()}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className={`text-sm font-medium ${pool.rejectRate > 0.03 ? 'text-red-600 dark:text-red-400' : 'text-gray-900 dark:text-gray-100'}`}>
                          {formatRejectRate(pool.rejectRate)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${statusBadge.className}`}>
                          {statusBadge.text}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => openModal(pool.id, pool.name)}
                          className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors"
                        >
                          Подробнее
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Кнопка обновления */}
        <div className="text-center">
          <button
            onClick={() => refetch()}
            className="btn-secondary px-6 py-2"
          >
            🔄 Обновить данные
          </button>
        </div>
      </div>

      {/* Модальное окно */}
      {selectedPoolId && (
        <MiningPoolDetailsModal
          poolId={selectedPoolId}
          poolName={selectedPoolName}
          isOpen={!!selectedPoolId}
          onClose={closeModal}
        />
      )}
    </>
  );
}; 