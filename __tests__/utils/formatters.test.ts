// Утилитарные функции для тестирования
const formatHashrate = (hashrate: number): string => {
  if (hashrate === 0) return '0 TH/s';
  return `${hashrate.toFixed(1)} TH/s`;
};

const formatRejectRate = (rate: number): string => {
  return `${(rate * 100).toFixed(2)}%`;
};

const formatBTC = (amount: number): string => {
  return `${amount.toFixed(6)} BTC`;
};

const formatPercent = (value: number): string => {
  return `${value.toFixed(2)}%`;
};

describe('Утилитарные функции форматирования', () => {
  describe('formatHashrate', () => {
    test('должен форматировать нулевой хешрейт', () => {
      expect(formatHashrate(0)).toBe('0 TH/s');
    });

    test('должен форматировать положительный хешрейт', () => {
      expect(formatHashrate(830.5)).toBe('830.5 TH/s');
      expect(formatHashrate(460.33)).toBe('460.3 TH/s');
      expect(formatHashrate(1)).toBe('1.0 TH/s');
    });

    test('должен округлять до одного знака после запятой', () => {
      expect(formatHashrate(123.456)).toBe('123.5 TH/s');
      expect(formatHashrate(999.99)).toBe('1000.0 TH/s');
    });
  });

  describe('formatRejectRate', () => {
    test('должен форматировать процент отклонений', () => {
      expect(formatRejectRate(0.012)).toBe('1.20%');
      expect(formatRejectRate(0.045)).toBe('4.50%');
      expect(formatRejectRate(0)).toBe('0.00%');
    });

    test('должен округлять до двух знаков после запятой', () => {
      expect(formatRejectRate(0.123456)).toBe('12.35%');
      expect(formatRejectRate(0.001)).toBe('0.10%');
    });
  });

  describe('formatBTC', () => {
    test('должен форматировать BTC с 6 знаками после запятой', () => {
      expect(formatBTC(0.035)).toBe('0.035000 BTC');
      expect(formatBTC(0.021456)).toBe('0.021456 BTC');
      expect(formatBTC(0)).toBe('0.000000 BTC');
    });

    test('должен обрабатывать большие числа', () => {
      expect(formatBTC(1.234567)).toBe('1.234567 BTC');
      expect(formatBTC(10)).toBe('10.000000 BTC');
    });
  });

  describe('formatPercent', () => {
    test('должен форматировать проценты', () => {
      expect(formatPercent(99.82)).toBe('99.82%');
      expect(formatPercent(100)).toBe('100.00%');
      expect(formatPercent(0)).toBe('0.00%');
    });

    test('должен округлять до двух знаков', () => {
      expect(formatPercent(99.999)).toBe('100.00%');
      expect(formatPercent(50.555)).toBe('50.55%'); // JavaScript округляет 50.555 до 50.55
    });
  });
}); 