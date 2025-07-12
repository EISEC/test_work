# Mining Pools Dashboard

## 🚀 Технологический стек

- **NextJS 14** - React фреймворк с SSR/SSG
- **Redux Toolkit** - управление состоянием с RTK Query
- **TypeScript** - статическая типизация
- **TailwindCSS** - utility-first CSS фреймворк
- **Google Fonts (Roboto)** - современная типографика

## 📦 Быстрый старт

### Установка зависимостей

```bash
npm install
```

### Запуск в режиме разработки

```bash
npm run dev
```

Откройте [http://localhost:3000](http://localhost:3000) в браузере.

### Сборка для продакшена

```bash
npm run build
npm start
```

## 🏗️ Структура проекта

```
/
├── components/
│   ├── miningPoolCard.tsx         # Карточка майнинг-пула (legacy)
│   ├── miningPoolsList.tsx        # Список пулов (legacy)
│   ├── miningPoolsTable.tsx       # Таблица майнинг-пулов
│   ├── miningPoolDetailsModal.tsx # Модальное окно с деталями
│   └── themeToggle.tsx           # Переключатель темы
├── pages/
│   ├── api/
│   │   └── mining-pools.ts   # Mock API endpoint
│   ├── _app.tsx              # Redux Provider
│   └── index.tsx             # Главная страница
├── store/
│   ├── api/
│   │   └── miningPoolsApi.ts # RTK Query API
│   └── index.ts              # Redux store
├── types/
│   └── miningPool.ts         # TypeScript типы
└── styles/
    └── globals.css           # Глобальные стили
```

## ✨ Функции

- 📊 **Реальное время** - автоматическое обновление каждые 30 секунд
- 🎨 **Современный UI** - responsive дизайн с TailwindCSS
- 🌙 **Темная тема** - полноценная поддержка светлой и темной темы
- 📋 **Табличный интерфейс** - удобное отображение данных пулов
- 🔍 **Модальные окна** - детальная информация по каждому пулу
- 🔄 **Redux Toolkit** - эффективное управление состоянием
- 📱 **Мобильная адаптация** - работает на всех устройствах
- ⚡ **Быстрая загрузка** - оптимизированная сборка NextJS
- 🛡️ **TypeScript** - безопасность типов
- 💾 **Сохранение настроек** - запоминание выбранной темы
- 🧪 **Полное тестирование** - Jest + React Testing Library

## 🏊‍♂️ Особенности пулов

### Статусы
- 🟢 **Онлайн** - пул работает нормально
- 🟡 **Ограничен** - пул работает с ограничениями
- 🔴 **Оффлайн** - пул недоступен

### Метрики
- **Хешрейт (TH/s)** - вычислительная мощность
- **Активные воркеры** - количество подключенных майнеров
- **Процент отклонений** - качество соединения

## 🔧 Скрипты

- `npm run dev` - запуск в режиме разработки
- `npm run build` - сборка проекта
- `npm run start` - запуск продакшен сервера
- `npm run lint` - проверка кода ESLint
- `npm run type-check` - проверка типов TypeScript
- `npm test` - запуск тестов
- `npm run test:watch` - тесты в режиме наблюдения
- `npm run test:coverage` - тесты с покрытием кода

## 📝 API

### GET /api/mining-pools

Возвращает список майнинг-пулов с актуальной статистикой.

```json
[
  {
    "id": "pool-1",
    "name": "US East Pool",
    "hashrateTHs": 830.5,
    "activeWorkers": 1240,
    "rejectRate": 0.012,
    "status": "online"
  }
]
```

### GET /api/mining-pools/[id]

Возвращает детальную информацию о конкретном пуле.

```json
{
  "id": "pool-1",
  "name": "US East Pool",
  "hashrateTHs": 830.5,
  "activeWorkers": 1240,
  "rejectRate": 0.012,
  "status": "online",
  "last24hRevenueBTC": 0.035,
  "uptimePercent": 99.82,
  "location": "Ashburn, VA",
  "feePercent": 1.0
}
```

## 🎯 Соглашения

Проект следует правилам:

- **camelCase** для файлов и папок
- **PascalCase** для React компонентов
- **API-first** подход для данных
- **SSR совместимость** с Redux
- **Utility-first** стили с TailwindCSS
- **Обязательная поддержка темной темы** для всех интерфейсов

## 🌙 Темная тема

### Функциональность
- Переключатель в правом верхнем углу интерфейса
- Автоматическое определение системной темы при первом посещении
- Сохранение выбора пользователя в localStorage
- Плавные анимации переходов между темами

### Технические детали
- Использование `dark:` префиксов TailwindCSS
- CSS переменные для адаптивных цветов
- Предотвращение hydration mismatch в SSR
- Поддержка системных настроек `prefers-color-scheme`