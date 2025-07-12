import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ThemeToggle } from '../../components/themeToggle';

// Мокаем хук useTheme
jest.mock('../../hooks/useTheme', () => ({
  useTheme: jest.fn(),
}));

const mockUseTheme = require('../../hooks/useTheme').useTheme;

describe('ThemeToggle', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('должен показывать skeleton при загрузке', () => {
    mockUseTheme.mockReturnValue({
      theme: 'light',
      toggleTheme: jest.fn(),
      mounted: false,
    });

    render(<ThemeToggle />);
    
    const skeleton = document.querySelector('.animate-pulse');
    expect(skeleton).toBeInTheDocument();
  });

  test('должен отображать переключатель после монтирования', async () => {
    const mockToggleTheme = jest.fn();
    mockUseTheme.mockReturnValue({
      theme: 'light',
      toggleTheme: mockToggleTheme,
      mounted: true,
    });

    render(<ThemeToggle />);
    
    await waitFor(() => {
      const button = screen.getByRole('button');
      expect(button).toBeInTheDocument();
      expect(button).toHaveAttribute('aria-label', 'Переключить на темную тему');
    });
  });

  test('должен показывать иконку солнца для светлой темы', async () => {
    mockUseTheme.mockReturnValue({
      theme: 'light',
      toggleTheme: jest.fn(),
      mounted: true,
    });

    render(<ThemeToggle />);
    
    await waitFor(() => {
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('title', 'Переключить на темную тему');
    });
  });

  test('должен показывать иконку луны для темной темы', async () => {
    mockUseTheme.mockReturnValue({
      theme: 'dark',
      toggleTheme: jest.fn(),
      mounted: true,
    });

    render(<ThemeToggle />);
    
    await waitFor(() => {
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('title', 'Переключить на светлую тему');
    });
  });

  test('должен вызывать toggleTheme при клике', async () => {
    const mockToggleTheme = jest.fn();
    mockUseTheme.mockReturnValue({
      theme: 'light',
      toggleTheme: mockToggleTheme,
      mounted: true,
    });

    render(<ThemeToggle />);
    
    await waitFor(() => {
      const button = screen.getByRole('button');
      fireEvent.click(button);
      expect(mockToggleTheme).toHaveBeenCalledTimes(1);
    });
  });

  test('должен иметь правильные CSS классы для разных тем', async () => {
    // Тест для светлой темы
    mockUseTheme.mockReturnValue({
      theme: 'light',
      toggleTheme: jest.fn(),
      mounted: true,
    });

    const { rerender } = render(<ThemeToggle />);
    
    await waitFor(() => {
      const button = screen.getByRole('button');
      expect(button).toHaveClass('bg-gray-200');
    });

    // Тест для темной темы
    mockUseTheme.mockReturnValue({
      theme: 'dark',
      toggleTheme: jest.fn(),
      mounted: true,
    });

    rerender(<ThemeToggle />);
    
    await waitFor(() => {
      const button = screen.getByRole('button');
      expect(button).toHaveClass('bg-blue-600');
    });
  });
}); 