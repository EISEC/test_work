import React from 'react';
import Head from 'next/head';
import { useTheme } from '../hooks/useTheme';

interface SEOHeadProps {
  title?: string;
  description?: string;
  canonicalUrl?: string;
  ogImage?: string;
  ogType?: string;
  twitterCard?: string;
  keywords?: string;
  author?: string;
  robots?: string;
  structuredData?: object;
}

const SEOHead = ({
  title = 'Mining Pools Dashboard - Мониторинг майнинг-пулов Bitcoin',
  description = 'Профессиональный дашборд для мониторинга майнинг-пулов Bitcoin. Отслеживайте хешрейт, количество воркеров, статистику и доходность в реальном времени.',
  canonicalUrl = 'https://mining-pools-dashboard.com',
  ogImage = '/og-image.jpg',
  ogType = 'website',
  twitterCard = 'summary_large_image',
  keywords = 'майнинг, bitcoin, mining pools, хешрейт, воркеры, cryptocurrency, блокчейн, мониторинг',
  author = 'Mining Pools Dashboard',
  robots = 'index, follow',
  structuredData,
}: SEOHeadProps) => {
  const { theme } = useTheme();
  
  return (
    <Head>
      {/* Базовые meta теги */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="author" content={author} />
      <meta name="robots" content={robots} />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta httpEquiv="Content-Type" content="text/html; charset=utf-8" />
      <meta name="theme-color" content={theme === 'dark' ? '#1f2937' : '#ffffff'} />
      
      {/* Canonical URL */}
      <link rel="canonical" href={canonicalUrl} />
      
      {/* Open Graph теги */}
      <meta property="og:type" content={ogType} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:site_name" content="Mining Pools Dashboard" />
      <meta property="og:locale" content="ru_RU" />
      
      {/* Twitter Card теги */}
      <meta name="twitter:card" content={twitterCard} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />
      <meta name="twitter:site" content="@MiningPoolsDash" />
      <meta name="twitter:creator" content="@MiningPoolsDash" />
      
      {/* Дополнительные теги для мобильных устройств */}
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      <meta name="apple-mobile-web-app-title" content="Mining Pools" />
      
      {/* Favicons */}
      <link rel="icon" href="/favicon.ico" />
      <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
      <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
      <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
      <link rel="manifest" href="/manifest.json" />
      
      {/* Preconnect для производительности */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      
      {/* Структурированные данные JSON-LD */}
      {structuredData && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData),
          }}
        />
      )}
    </Head>
  );
};

export default SEOHead; 