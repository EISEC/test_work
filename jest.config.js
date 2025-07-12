const nextJest = require('next/jest')

const createJestConfig = nextJest({
  // Путь к Next.js приложению
  dir: './',
})

// Добавляем кастомную конфигурацию Jest
const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  moduleNameMapping: {
    '^@/components/(.*)$': '<rootDir>/components/$1',
    '^@/pages/(.*)$': '<rootDir>/pages/$1',
    '^@/store/(.*)$': '<rootDir>/store/$1',
    '^@/types/(.*)$': '<rootDir>/types/$1',
    '^@/hooks/(.*)$': '<rootDir>/hooks/$1',
  },
  testEnvironment: 'jest-environment-jsdom',
}

// createJestConfig экспортируется таким способом чтобы next/jest мог загрузить конфигурацию Next.js (которая асинхронная)
module.exports = createJestConfig(customJestConfig) 