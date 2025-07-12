import type { NextApiRequest, NextApiResponse } from 'next';
import { MiningPoolDetails } from '../../../types/miningPool';

// Те же данные что и в основном API, но с деталями
const mockMiningPoolsDetails: MiningPoolDetails[] = [
  {
    id: 'pool-1',
    name: 'US East Pool',
    hashrateTHs: 830.5,
    activeWorkers: 1240,
    rejectRate: 0.012,
    status: 'online',
    last24hRevenueBTC: 0.035,
    uptimePercent: 99.82,
    location: 'Ashburn, VA',
    feePercent: 1.0
  },
  {
    id: 'pool-2',
    name: 'EU Central Pool',
    hashrateTHs: 460.3,
    activeWorkers: 876,
    rejectRate: 0.045,
    status: 'degraded',
    last24hRevenueBTC: 0.021,
    uptimePercent: 97.45,
    location: 'Frankfurt, Germany',
    feePercent: 1.2
  },
  {
    id: 'pool-3',
    name: 'Asia Pacific Pool',
    hashrateTHs: 720.8,
    activeWorkers: 1567,
    rejectRate: 0.021,
    status: 'online',
    last24hRevenueBTC: 0.042,
    uptimePercent: 99.95,
    location: 'Singapore',
    feePercent: 0.8
  },
  {
    id: 'pool-4',
    name: 'Canada North Pool',
    hashrateTHs: 0,
    activeWorkers: 0,
    rejectRate: 0,
    status: 'offline',
    last24hRevenueBTC: 0,
    uptimePercent: 0,
    location: 'Toronto, Canada',
    feePercent: 1.5
  }
];

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<MiningPoolDetails | { error: string }>
) {
  // Симуляция задержки сети
  setTimeout(() => {
    if (req.method === 'GET') {
      const { id } = req.query;
      
      const pool = mockMiningPoolsDetails.find(p => p.id === id);
      
      if (!pool) {
        res.status(404).json({ error: 'Майнинг-пул не найден' });
        return;
      }

      // Добавляем небольшую рандомизацию для живых данных
      const poolWithVariation = {
        ...pool,
        hashrateTHs: pool.status === 'online' 
          ? pool.hashrateTHs + (Math.random() - 0.5) * 50 
          : pool.hashrateTHs,
        activeWorkers: pool.status === 'online'
          ? Math.floor(pool.activeWorkers + (Math.random() - 0.5) * 100)
          : pool.activeWorkers,
        rejectRate: pool.status === 'online'
          ? Math.max(0, pool.rejectRate + (Math.random() - 0.5) * 0.01)
          : pool.rejectRate,
        last24hRevenueBTC: pool.status === 'online'
          ? Math.max(0, pool.last24hRevenueBTC + (Math.random() - 0.5) * 0.01)
          : pool.last24hRevenueBTC,
        uptimePercent: pool.status === 'online'
          ? Math.min(100, Math.max(95, pool.uptimePercent + (Math.random() - 0.5) * 2))
          : pool.uptimePercent,
      };
      
      res.status(200).json(poolWithVariation);
    } else {
      res.setHeader('Allow', ['GET']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  }, 300); // 300ms задержка для имитации сетевого запроса
} 