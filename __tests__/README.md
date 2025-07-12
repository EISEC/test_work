# Тесты проекта Mining Pools Dashboard

## 🧪 Структура тестов

### Утилитарные функции (`utils/`)
- **formatters.test.ts** - тесты функций форматирования данных
  - Форматирование хешрейта (TH/s)
  - Форматирование процентов отклонений
  - Форматирование BTC
  - Форматирование процентных значений

### Компоненты (`components/`)
- **ThemeToggle.test.tsx** - тесты переключателя темы
  - Отображение skeleton при загрузке
  - Переключение между светлой и темной темой
  - Обработка кликов
  - Правильные CSS классы

### API endpoints (`pages/api/`)
- **mining-pools.test.ts** - тесты основного API endpoint
  - GET запросы списка пулов
  - Обработка неподдерживаемых методов
  - Валидация структуры данных
  - Проверка статусов пулов

- **mining-pools/[id].test.ts** - тесты API деталей пула
  - GET запросы деталей по ID
  - Обработка несуществующих ID (404)
  - Валидация расширенных данных
  - Рандомизация для онлайн пулов

### Типы (`types/`)
- **miningPool.test.ts** - тесты TypeScript типов
  - Валидация PoolStatus
  - Структура MiningPool
  - Расширение MiningPoolDetails
  - Поддержка всех статусов

## 🚀 Запуск тестов

### Разовый запуск
```bash
npm test
```

### Режим наблюдения
```bash
npm run test:watch
```

### С покрытием кода
```bash
npm run test:coverage
```

## 📊 Покрытие тестов

Тесты покрывают:
- ✅ Утилитарные функции форматирования (100%)
- ✅ API endpoints (основная функциональность)
- ✅ Переключатель темы (взаимодействие)
- ✅ TypeScript типы (структура данных)
- ✅ Обработка ошибок

## 🛠️ Используемые инструменты

- **Jest** - фреймворк для тестирования
- **React Testing Library** - тестирование React компонентов
- **node-mocks-http** - мокирование HTTP запросов для API
- **@testing-library/jest-dom** - дополнительные матчеры для DOM

## 📝 Примеры тестов

### Тест API endpoint
```typescript
test('должен возвращать список майнинг-пулов', async () => {
  const { req, res } = createMocks({ method: 'GET' });
  await handler(req, res);
  
  expect(res._getStatusCode()).toBe(200);
  const data = JSON.parse(res._getData());
  expect(Array.isArray(data)).toBe(true);
});
```

### Тест компонента
```typescript
test('должен переключать тему при клике', async () => {
  const mockToggle = jest.fn();
  mockUseTheme.mockReturnValue({ toggleTheme: mockToggle });
  
  render(<ThemeToggle />);
  fireEvent.click(screen.getByRole('button'));
  
  expect(mockToggle).toHaveBeenCalled();
});
```

## 🎯 Соблюдение правил проекта

Все тесты следуют правилам из `.cursor/rules/rules.mdc`:
- camelCase для имен файлов
- Комментарии на русском языке
- TypeScript типизация
- Современные технологии тестирования 