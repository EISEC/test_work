import React from 'react';
import Link from 'next/link';
import { MiningPoolsTable } from '../components/miningPoolsTable';
import { ThemeToggle } from '../components/themeToggle';
import MiningPoolsFilter from '../components/miningPoolsFilter';
import SEOHead from '../components/SEOHead';
import { getBaseStructuredData, getMiningPoolsListStructuredData } from '../utils/structuredData';
import { useGetMiningPoolsQuery } from '../store/api/miningPoolsApi';

const HomePage: React.FC = () => {
  // Получаем данные о майнинг-пулах для SEO
  const { data: pools } = useGetMiningPoolsQuery();
  
  // Генерируем структурированные данные
  const baseStructuredData = getBaseStructuredData();
  const poolsListStructuredData = getMiningPoolsListStructuredData(pools || []);
  
  return (
    <>
      <SEOHead
        title="Mining Pools Dashboard - Мониторинг майнинг-пулов Bitcoin"
        description="Профессиональный дашборд для мониторинга майнинг-пулов Bitcoin в реальном времени. Отслеживайте хешрейт, количество воркеров, статистику и доходность."
        keywords="майнинг, bitcoin, майнинг-пулы, хешрейт, воркеры, cryptocurrency, блокчейн, мониторинг, dashboard"
        structuredData={[baseStructuredData, poolsListStructuredData]}
      />

      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
        {/* Header */}
        <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Link href="/">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                      ⚡ <span className="hidden md:inline">Mining Pools Dashboard</span>
                    </h1>
                  </Link>
                </div>
              </div>
              <div className="flex items-center space-x-6">
                <div className="flex items-center space-x-3">
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    Обновление каждые 30 сек
                  </div>
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                </div>
                <ThemeToggle />
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
              Мониторинг майнинг-пулов
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              Отслеживайте производительность и статус ваших майнинг-пулов в реальном времени
            </p>
          </div>

          <MiningPoolsFilter />
          <MiningPoolsTable />
        </main>

        {/* Footer */}
        <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 mt-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="text-center text-gray-500 dark:text-gray-400 text-sm">
              <p>© 2025 Mining Pools Dashboard. Все права защищены.</p>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
};

export default HomePage; 