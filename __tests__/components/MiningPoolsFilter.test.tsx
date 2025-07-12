import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import MiningPoolsFilter from '../../components/miningPoolsFilter';
import miningPoolsReducer from '../../store/slices/miningPoolsSlice';
import { miningPoolsApi } from '../../store/api/miningPoolsApi';

// Мок для store
const createMockStore = () => {
  return configureStore({
    reducer: {
      miningPools: miningPoolsReducer,
      [miningPoolsApi.reducerPath]: miningPoolsApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(miningPoolsApi.middleware),
  });
};

const renderWithProvider = (component: React.ReactElement) => {
  const store = createMockStore();
  return render(
    <Provider store={store}>
      {component}
    </Provider>
  );
};

describe('MiningPoolsFilter', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('рендерит компонент фильтрации', () => {
    renderWithProvider(<MiningPoolsFilter />);
    
    expect(screen.getByText('Фильтры и поиск')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Введите название пула...')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Все статусы')).toBeInTheDocument();
  });

  it('показывает и скрывает расширенные фильтры', () => {
    renderWithProvider(<MiningPoolsFilter />);
    
    // Изначально расширенные фильтры скрыты
    expect(screen.queryByText('Расширенные фильтры')).not.toBeInTheDocument();
    
    // Клик по кнопке показать расширенные фильтры
    const toggleButton = screen.getByText('Показать расширенные');
    fireEvent.click(toggleButton);
    
    // Проверяем, что расширенные фильтры появились
    expect(screen.getByText('Расширенные фильтры')).toBeInTheDocument();
    expect(screen.getByText('Хешрейт (TH/s)')).toBeInTheDocument();
    expect(screen.getByText('Активные воркеры')).toBeInTheDocument();
    expect(screen.getByText('Reject Rate (%)')).toBeInTheDocument();
    
    // Клик по кнопке скрыть расширенные фильтры
    const hideButton = screen.getByText('Скрыть расширенные');
    fireEvent.click(hideButton);
    
    // Проверяем, что расширенные фильтры скрылись
    expect(screen.queryByText('Расширенные фильтры')).not.toBeInTheDocument();
  });

  it('обновляет поисковый запрос при вводе', () => {
    renderWithProvider(<MiningPoolsFilter />);
    
    const searchInput = screen.getByPlaceholderText('Введите название пула...');
    fireEvent.change(searchInput, { target: { value: 'Antpool' } });
    
    expect(searchInput).toHaveValue('Antpool');
  });

  it('обновляет фильтр статуса при выборе', () => {
    renderWithProvider(<MiningPoolsFilter />);
    
    const statusSelect = screen.getByRole('combobox');
    fireEvent.change(statusSelect, { target: { value: 'online' } });
    
    expect(statusSelect).toHaveValue('online');
  });

  it('показывает индикатор применения фильтров', () => {
    renderWithProvider(<MiningPoolsFilter />);
    
    // Применяем фильтр
    const searchInput = screen.getByPlaceholderText('Введите название пула...');
    fireEvent.change(searchInput, { target: { value: 'test' } });
    
    // Проверяем, что появился индикатор
    expect(screen.getByText('Применены фильтры')).toBeInTheDocument();
  });

  it('активирует кнопку сброса фильтров при наличии фильтров', () => {
    renderWithProvider(<MiningPoolsFilter />);
    
    const resetButton = screen.getByText('Сбросить фильтры');
    
    // Изначально кнопка неактивна
    expect(resetButton).toBeDisabled();
    
    // Применяем фильтр
    const searchInput = screen.getByPlaceholderText('Введите название пула...');
    fireEvent.change(searchInput, { target: { value: 'test' } });
    
    // Проверяем, что кнопка стала активной
    expect(resetButton).toBeEnabled();
  });

  it('работает с расширенными фильтрами диапазонов', () => {
    renderWithProvider(<MiningPoolsFilter />);
    
    // Показываем расширенные фильтры
    const toggleButton = screen.getByText('Показать расширенные');
    fireEvent.click(toggleButton);
    
    // Находим поля для хешрейта по placeholder
    const hashrateMinInputs = screen.getAllByPlaceholderText('От');
    const hashrateMin = hashrateMinInputs[0]; // 1-й элемент для хешрейта
    
    const hashrateMaxInputs = screen.getAllByPlaceholderText('До');
    const hashrateMax = hashrateMaxInputs[0]; // 1-й элемент для хешрейта
    
    // Изменяем значения
    fireEvent.change(hashrateMin, { target: { value: '1000' } });
    fireEvent.change(hashrateMax, { target: { value: '5000' } });
    
    expect(hashrateMin).toHaveValue(1000);
    expect(hashrateMax).toHaveValue(5000);
  });

  it('правильно обрабатывает reject rate фильтр', () => {
    renderWithProvider(<MiningPoolsFilter />);
    
    // Показываем расширенные фильтры
    const toggleButton = screen.getByText('Показать расширенные');
    fireEvent.click(toggleButton);
    
    // Находим поля для reject rate по placeholder
    const rejectRateInputs = screen.getAllByPlaceholderText('От');
    const rejectRateMin = rejectRateInputs[2]; // 3-й элемент для reject rate
    
    const rejectRateMaxInputs = screen.getAllByPlaceholderText('До');
    const rejectRateMax = rejectRateMaxInputs[2]; // 3-й элемент для reject rate
    
    // Изменяем значения
    fireEvent.change(rejectRateMin, { target: { value: '0.5' } });
    fireEvent.change(rejectRateMax, { target: { value: '2.0' } });
    
    expect(rejectRateMin).toHaveValue(0.5);
    expect(rejectRateMax).toHaveValue(2.0);
  });

  it('сбрасывает фильтры при клике на кнопку сброса', () => {
    renderWithProvider(<MiningPoolsFilter />);
    
    // Применяем фильтр
    const searchInput = screen.getByPlaceholderText('Введите название пула...');
    fireEvent.change(searchInput, { target: { value: 'test' } });
    
    const statusSelect = screen.getByRole('combobox');
    fireEvent.change(statusSelect, { target: { value: 'online' } });
    
    // Проверяем, что фильтры применены
    expect(searchInput).toHaveValue('test');
    expect(statusSelect).toHaveValue('online');
    
    // Сбрасываем фильтры
    const resetButton = screen.getByText('Сбросить фильтры');
    fireEvent.click(resetButton);
    
    // Проверяем, что фильтры сброшены
    expect(searchInput).toHaveValue('');
    expect(statusSelect).toHaveValue('all');
  });

  it('применяет корректные классы темной темы', () => {
    renderWithProvider(<MiningPoolsFilter />);
    
    const container = screen.getByText('Фильтры и поиск').closest('div')?.parentElement;
    expect(container).toHaveClass('dark:bg-gray-800');
    expect(container).toHaveClass('dark:border-gray-700');
  });

  it('содержит все необходимые поля для фильтрации', () => {
    renderWithProvider(<MiningPoolsFilter />);
    
    // Основные поля
    expect(screen.getByText('Поиск по названию')).toBeInTheDocument();
    expect(screen.getByText('Статус')).toBeInTheDocument();
    
    // Показываем расширенные фильтры
    const toggleButton = screen.getByText('Показать расширенные');
    fireEvent.click(toggleButton);
    
    // Расширенные поля
    expect(screen.getByText('Хешрейт (TH/s)')).toBeInTheDocument();
    expect(screen.getByText('Активные воркеры')).toBeInTheDocument();
    expect(screen.getByText('Reject Rate (%)')).toBeInTheDocument();
  });
}); 