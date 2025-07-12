import React from 'react';
import { useGetMiningPoolDetailsQuery } from '../store/api/miningPoolsApi';
import { PoolStatus } from '../types/miningPool';

interface MiningPoolDetailsModalProps {
  poolId: string;
  poolName: string;
  isOpen: boolean;
  onClose: () => void;
}

const getStatusColor = (status: PoolStatus): string => {
  switch (status) {
    case 'online':
      return 'text-green-600 dark:text-green-400';
    case 'degraded':
      return 'text-yellow-600 dark:text-yellow-400';
    case 'offline':
      return 'text-red-600 dark:text-red-400';
    default:
      return 'text-gray-600 dark:text-gray-400';
  }
};

const getStatusText = (status: PoolStatus): string => {
  switch (status) {
    case 'online':
      return 'Онлайн';
    case 'degraded':
      return 'Ограничен';
    case 'offline':
      return 'Оффлайн';
    default:
      return 'Неизвестно';
  }
};

const formatBTC = (amount: number): string => {
  return `${amount.toFixed(6)} BTC`;
};

const formatPercent = (value: number): string => {
  return `${value.toFixed(2)}%`;
};

const formatRejectRate = (rate: number): string => {
  return `${(rate * 100).toFixed(2)}%`;
};

const formatHashrate = (hashrate: number): string => {
  if (hashrate === 0) return '0 TH/s';
  return `${hashrate.toFixed(1)} TH/s`;
};

export const MiningPoolDetailsModal: React.FC<MiningPoolDetailsModalProps> = ({
  poolId,
  poolName,
  isOpen,
  onClose
}) => {
  const { data: poolDetails, error, isLoading } = useGetMiningPoolDetailsQuery(poolId, {
    skip: !isOpen, // Не загружаем данные пока модал закрыт
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
      ></div>

      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative w-full max-w-2xl transform overflow-hidden rounded-lg bg-white dark:bg-gray-800 shadow-xl transition-all">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
              Детали пула: {poolName}
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Content */}
          <div className="p-6">
            {isLoading && (
              <div className="space-y-4">
                <div className="animate-pulse">
                  <div className="grid grid-cols-2 gap-4">
                    {[...Array(6)].map((_, index) => (
                      <div key={index} className="p-4 bg-gray-200 dark:bg-gray-700 rounded-lg">
                        <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-3/4 mb-2"></div>
                        <div className="h-6 bg-gray-300 dark:bg-gray-600 rounded w-1/2"></div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {error && (
              <div className="text-center py-8">
                <div className="text-red-600 dark:text-red-400 text-xl mb-2">⚠️ Ошибка загрузки</div>
                <p className="text-gray-600 dark:text-gray-300">
                  Не удалось загрузить детали пула. Попробуйте позже.
                </p>
              </div>
            )}

            {poolDetails && (
              <div className="space-y-6">
                {/* Основная информация */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="card p-4">
                    <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">Статус</div>
                    <div className={`text-xl font-semibold ${getStatusColor(poolDetails.status)}`}>
                      {getStatusText(poolDetails.status)}
                    </div>
                  </div>

                  <div className="card p-4">
                    <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">Местоположение</div>
                    <div className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                      📍 {poolDetails.location}
                    </div>
                  </div>
                </div>

                {/* Производительность */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="card p-4 text-center">
                    <div className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-1">
                      {formatHashrate(poolDetails.hashrateTHs)}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">Хешрейт</div>
                  </div>

                  <div className="card p-4 text-center">
                    <div className="text-2xl font-bold text-green-600 dark:text-green-400 mb-1">
                      {poolDetails.activeWorkers.toLocaleString()}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">Активные воркеры</div>
                  </div>

                  <div className="card p-4 text-center">
                    <div className={`text-2xl font-bold mb-1 ${poolDetails.rejectRate > 0.03 ? 'text-red-600 dark:text-red-400' : 'text-gray-600 dark:text-gray-300'}`}>
                      {formatRejectRate(poolDetails.rejectRate)}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">Процент отклонений</div>
                  </div>
                </div>

                {/* Финансовая информация */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="card p-4 text-center">
                    <div className="text-2xl font-bold text-orange-600 dark:text-orange-400 mb-1">
                      {formatBTC(poolDetails.last24hRevenueBTC)}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">Доход за 24ч</div>
                  </div>

                  <div className="card p-4 text-center">
                    <div className={`text-2xl font-bold mb-1 ${poolDetails.uptimePercent > 99 ? 'text-green-600 dark:text-green-400' : poolDetails.uptimePercent > 95 ? 'text-yellow-600 dark:text-yellow-400' : 'text-red-600 dark:text-red-400'}`}>
                      {formatPercent(poolDetails.uptimePercent)}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">Время работы</div>
                  </div>

                  <div className="card p-4 text-center">
                    <div className="text-2xl font-bold text-purple-600 dark:text-purple-400 mb-1">
                      {formatPercent(poolDetails.feePercent)}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">Комиссия пула</div>
                  </div>
                </div>

                {/* Индикатор активности */}
                {poolDetails.status === 'online' && (
                  <div className="card p-4">
                    <div className="flex items-center justify-center">
                      <div className="w-3 h-3 bg-green-500 dark:bg-green-400 rounded-full mr-3 animate-pulse"></div>
                      <span className="text-green-600 dark:text-green-400 font-medium">
                        Майнинг активен • Пул работает стабильно
                      </span>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700 border-t border-gray-200 dark:border-gray-600">
            <div className="flex justify-end">
              <button
                onClick={onClose}
                className="btn-secondary"
              >
                Закрыть
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}; 