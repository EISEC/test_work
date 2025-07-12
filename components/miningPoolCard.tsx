import React from 'react';
import { MiningPool } from '../types/miningPool';

interface MiningPoolCardProps {
  pool: MiningPool;
}

const formatHashrate = (hashrate: number): string => {
  if (hashrate === 0) return '0 TH/s';
  return `${hashrate.toFixed(1)} TH/s`;
};

const formatRejectRate = (rate: number): string => {
  return `${(rate * 100).toFixed(2)}%`;
};

const getStatusColor = (status: string): string => {
  switch (status) {
    case 'online':
      return 'status-online';
    case 'degraded':
      return 'status-degraded';
    case 'offline':
      return 'status-offline';
    default:
      return 'status-offline';
  }
};

const getStatusText = (status: string): string => {
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

export const MiningPoolCard: React.FC<MiningPoolCardProps> = ({ pool }) => {
  return (
    <div className="card p-6">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">{pool.name}</h3>
        <span className={`status-indicator ${getStatusColor(pool.status)}`}>
          {getStatusText(pool.status)}
        </span>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="metric-card">
          <div className="metric-value text-blue-600">
            {formatHashrate(pool.hashrateTHs)}
          </div>
          <div className="metric-label">Хешрейт</div>
        </div>
        
        <div className="metric-card">
          <div className="metric-value text-green-600">
            {pool.activeWorkers.toLocaleString()}
          </div>
          <div className="metric-label">Активные воркеры</div>
        </div>
        
        <div className="metric-card col-span-2">
          <div className={`metric-value ${pool.rejectRate > 0.03 ? 'text-red-600 dark:text-red-400' : 'text-gray-600 dark:text-gray-300'}`}>
            {formatRejectRate(pool.rejectRate)}
          </div>
          <div className="metric-label">Процент отклонений</div>
        </div>
      </div>
      
      {pool.status === 'online' && (
        <div className="mt-4 flex items-center text-sm text-green-600 dark:text-green-400">
          <div className="w-2 h-2 bg-green-500 dark:bg-green-400 rounded-full mr-2 animate-pulse"></div>
          Майнинг активен
        </div>
      )}
    </div>
  );
}; 