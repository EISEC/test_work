import { MiningPool, MiningPoolDetails } from '../types/miningPool';

// Базовые структурированные данные для сайта
export const getBaseStructuredData = () => ({
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Mining Pools Dashboard',
  description: 'Профессиональный дашборд для мониторинга майнинг-пулов Bitcoin',
  url: 'https://mining-pools-dashboard.com',
  applicationCategory: 'FinanceApplication',
  operatingSystem: 'Web',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'USD',
  },
  author: {
    '@type': 'Organization',
    name: 'Mining Pools Dashboard',
    url: 'https://mining-pools-dashboard.com',
  },
  keywords: 'майнинг, bitcoin, mining pools, хешрейт, воркеры, cryptocurrency, блокчейн, мониторинг',
  inLanguage: 'ru-RU',
});

// Структурированные данные для списка майнинг-пулов  
export const getMiningPoolsListStructuredData = (pools: MiningPool[]) => ({
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  name: 'Список майнинг-пулов Bitcoin',
  description: 'Актуальный список майнинг-пулов Bitcoin с их характеристиками',
  numberOfItems: pools.length,
  itemListElement: pools.map((pool, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    item: {
      '@type': 'Service',
      name: pool.name,
      description: `Майнинг-пул ${pool.name} с хешрейтом ${pool.hashrateTHs} TH/s`,
      provider: {
        '@type': 'Organization',
        name: pool.name,
      },
      additionalProperty: [
        {
          '@type': 'PropertyValue',
          name: 'Хешрейт',
          value: `${pool.hashrateTHs} TH/s`,
        },
        {
          '@type': 'PropertyValue',
          name: 'Активные воркеры',
          value: pool.activeWorkers.toString(),
        },
        {
          '@type': 'PropertyValue',
          name: 'Reject Rate',
          value: `${pool.rejectRate}%`,
        },
        {
          '@type': 'PropertyValue',
          name: 'Статус',
          value: pool.status,
        },
      ],
    },
  })),
});

// Структурированные данные для отдельного майнинг-пула
export const getMiningPoolStructuredData = (pool: MiningPool, details?: MiningPoolDetails) => ({
  '@context': 'https://schema.org',
  '@type': 'Service',
  name: pool.name,
  description: `Майнинг-пул ${pool.name} предоставляет услуги майнинга Bitcoin с хешрейтом ${pool.hashrateTHs} TH/s`,
  provider: {
    '@type': 'Organization',
    name: pool.name,
  },
  serviceType: 'Bitcoin Mining Pool',
  areaServed: 'Global',
  hasOfferCatalog: {
    '@type': 'OfferCatalog',
    name: 'Услуги майнинга',
    itemListElement: [
      {
        '@type': 'Offer',
        name: 'Bitcoin Mining',
        description: 'Майнинг Bitcoin в пуле',
        priceCurrency: 'BTC',
        price: details?.feePercent ? `${details.feePercent}%` : 'Переменная',
      },
    ],
  },
  additionalProperty: [
    {
      '@type': 'PropertyValue',
      name: 'Хешрейт',
      value: `${pool.hashrateTHs} TH/s`,
      unitText: 'TH/s',
    },
    {
      '@type': 'PropertyValue',
      name: 'Активные воркеры',
      value: pool.activeWorkers.toString(),
      unitText: 'шт',
    },
    {
      '@type': 'PropertyValue',
      name: 'Reject Rate',
      value: `${pool.rejectRate}%`,
      unitText: '%',
    },
    {
      '@type': 'PropertyValue',
      name: 'Статус',
      value: pool.status,
    },
    ...(details ? [
      {
        '@type': 'PropertyValue',
        name: 'Доходность за 24ч',
        value: `${details.last24hRevenueBTC} BTC`,
        unitText: 'BTC',
      },
      {
        '@type': 'PropertyValue',
        name: 'Uptime',
        value: `${details.uptimePercent}%`,
        unitText: '%',
      },
      {
        '@type': 'PropertyValue',
        name: 'Местоположение',
        value: details.location,
      },
      {
        '@type': 'PropertyValue',
        name: 'Комиссия',
        value: `${details.feePercent}%`,
        unitText: '%',
      },
    ] : []),
  ],
  aggregateRating: {
    '@type': 'AggregateRating',
    ratingValue: pool.status === 'online' ? '5' : pool.status === 'degraded' ? '3' : '1',
    bestRating: '5',
    worstRating: '1',
  },
});

// Структурированные данные для хлебных крошек
export const getBreadcrumbStructuredData = (items: Array<{name: string, url: string}>) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: items.map((item, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    name: item.name,
    item: item.url,
  })),
});

// Структурированные данные для FAQ
export const getFAQStructuredData = () => ({
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'Что такое майнинг-пул?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Майнинг-пул - это объединение майнеров для совместного майнинга криптовалют. Участники пула объединяют свои вычислительные мощности для увеличения шансов на нахождение блоков.',
      },
    },
    {
      '@type': 'Question',
      name: 'Как выбрать майнинг-пул?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'При выборе майнинг-пула следует учитывать: размер комиссии, стабильность работы, хешрейт пула, географическое расположение серверов и репутацию.',
      },
    },
    {
      '@type': 'Question',
      name: 'Что такое хешрейт?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Хешрейт - это скорость вычислений в сети Bitcoin, измеряется в хешах в секунду. Чем выше хешрейт, тем больше вычислительной мощности у пула.',
      },
    },
  ],
}); 