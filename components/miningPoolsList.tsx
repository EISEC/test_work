import React from 'react';
import { useGetMiningPoolsQuery } from '../store/api/miningPoolsApi';
import { MiningPoolCard } from './miningPoolCard';

const LoadingSkeleton = () => {
  return (
    <div className="space-y-6">
      {[...Array(4)].map((_, index) => (
        <div key={index} className="card p-6 animate-pulse">
          <div className="flex justify-between items-start mb-4">
            <div className="h-6 bg-gray-300 dark:bg-gray-600 rounded w-48"></div>
            <div className="h-6 bg-gray-300 dark:bg-gray-600 rounded w-20"></div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="metric-card">
              <div className="h-8 bg-gray-300 dark:bg-gray-600 rounded w-24 mx-auto"></div>
              <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-16 mx-auto mt-2"></div>
            </div>
            <div className="metric-card">
              <div className="h-8 bg-gray-300 dark:bg-gray-600 rounded w-20 mx-auto"></div>
              <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-24 mx-auto mt-2"></div>
            </div>
          </div>
        </div>
      ))}
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

export const MiningPoolsList: React.FC = () => {
  const { data: pools, error, isLoading, refetch } = useGetMiningPoolsQuery();

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

  const onlinePools = pools.filter(pool => pool.status === 'online').length;
  const totalHashrate = pools
    .filter(pool => pool.status === 'online')
    .reduce((sum, pool) => sum + pool.hashrateTHs, 0);
  const totalWorkers = pools
    .filter(pool => pool.status === 'online')
    .reduce((sum, pool) => sum + pool.activeWorkers, 0);

  return (
    <div className="space-y-6">
      {/* Общая статистика */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card p-6 text-center">
          <div className="metric-value text-green-600">{onlinePools}</div>
          <div className="metric-label">Активных пулов</div>
        </div>
        <div className="card p-6 text-center">
          <div className="metric-value text-blue-600">{totalHashrate.toFixed(1)} TH/s</div>
          <div className="metric-label">Общий хешрейт</div>
        </div>
        <div className="card p-6 text-center">
          <div className="metric-value text-purple-600">{totalWorkers.toLocaleString()}</div>
          <div className="metric-label">Всего воркеров</div>
        </div>
      </div>

      {/* Список пулов */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {pools.map((pool) => (
          <MiningPoolCard key={pool.id} pool={pool} />
        ))}
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
  );
}; 