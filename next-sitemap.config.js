/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.SITE_URL || 'https://mining-pools-dashboard.com',
  generateRobotsTxt: true,
  generateIndexSitemap: false,
  exclude: ['/server-sitemap.xml'],
  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        allow: '/',
      },
      {
        userAgent: '*',
        disallow: '/api/',
      },
    ],
    additionalSitemaps: [
      'https://mining-pools-dashboard.com/server-sitemap.xml',
    ],
  },
  // Настройки для частоты обновления
  changefreq: 'hourly',
  priority: 0.7,
  // Дополнительные пути для статических страниц
  additionalPaths: async (config) => {
    const paths = []
    
    // Основные страницы
    paths.push(
      await config.transform(config, '/'),
      await config.transform(config, '/about'),
      await config.transform(config, '/faq'),
    )
    
    return paths
  },
  transform: async (config, path) => {
    // Настройка приоритета для разных типов страниц
    let priority = 0.5
    let changefreq = 'weekly'
    
    if (path === '/') {
      priority = 1.0
      changefreq = 'hourly'
    } else if (path.startsWith('/pool/')) {
      priority = 0.8
      changefreq = 'daily'
    }
    
    return {
      loc: path,
      changefreq,
      priority,
      lastmod: new Date().toISOString(),
      alternateRefs: [
        {
          href: `${config.siteUrl}${path}`,
          hreflang: 'ru',
        },
        {
          href: `${config.siteUrl}${path}`,
          hreflang: 'x-default',
        },
      ],
    }
  },
} 