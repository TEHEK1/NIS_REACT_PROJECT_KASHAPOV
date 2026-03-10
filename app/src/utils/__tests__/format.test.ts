import { describe, it, expect } from 'vitest';
import { truncateAddress, formatEth, formatNumber, timeAgo, timeRemaining } from '../format';

describe('truncateAddress', () => {
  it('сокращает адрес до 6...4 символов', () => {
    expect(truncateAddress('0x1a2B3c4D5e6F7890AbCdEf1234567890aBcDeF12'))
      .toBe('0x1a2B...eF12');
  });

  it('работает с коротким адресом', () => {
    expect(truncateAddress('0x1234567890')).toBe('0x1234...7890');
  });
});

describe('formatEth', () => {
  it('форматирует значения >= 1000 с суффиксом K', () => {
    expect(formatEth(1500)).toBe('1.5K');
    expect(formatEth(45200)).toBe('45.2K');
  });

  it('форматирует значения >= 1 с 2 знаками', () => {
    expect(formatEth(12.5)).toBe('12.50');
    expect(formatEth(3.8)).toBe('3.80');
  });

  it('форматирует значения >= 0.01 с 3 знаками', () => {
    expect(formatEth(0.85)).toBe('0.850');
    expect(formatEth(0.01)).toBe('0.010');
  });

  it('форматирует малые значения с 4 знаками', () => {
    expect(formatEth(0.005)).toBe('0.0050');
    expect(formatEth(0.0001)).toBe('0.0001');
  });
});

describe('formatNumber', () => {
  it('форматирует миллионы', () => {
    expect(formatNumber(1_500_000)).toBe('1.5M');
  });

  it('форматирует тысячи', () => {
    expect(formatNumber(6400)).toBe('6.4K');
    expect(formatNumber(10000)).toBe('10.0K');
  });

  it('оставляет маленькие числа как есть', () => {
    expect(formatNumber(42)).toBe('42');
    expect(formatNumber(999)).toBe('999');
  });
});

describe('timeAgo', () => {
  it('возвращает минуты для недавних дат', () => {
    const date = new Date(Date.now() - 5 * 60_000).toISOString();
    expect(timeAgo(date)).toBe('5м назад');
  });

  it('возвращает часы', () => {
    const date = new Date(Date.now() - 3 * 3_600_000).toISOString();
    expect(timeAgo(date)).toBe('3ч назад');
  });

  it('возвращает дни', () => {
    const date = new Date(Date.now() - 10 * 86_400_000).toISOString();
    expect(timeAgo(date)).toBe('10д назад');
  });

  it('возвращает месяцы', () => {
    const date = new Date(Date.now() - 60 * 86_400_000).toISOString();
    expect(timeAgo(date)).toBe('2мес назад');
  });
});

describe('timeRemaining', () => {
  it('возвращает "Завершен" для прошедших дат', () => {
    const date = new Date(Date.now() - 1000).toISOString();
    expect(timeRemaining(date)).toBe('Завершен');
  });

  it('возвращает часы и минуты', () => {
    const date = new Date(Date.now() + 5 * 3_600_000 + 30 * 60_000).toISOString();
    const result = timeRemaining(date);
    expect(result).toMatch(/^5ч \d+м$/);
  });

  it('возвращает дни для далёких дат', () => {
    const date = new Date(Date.now() + 3 * 86_400_000).toISOString();
    const result = timeRemaining(date);
    expect(result).toMatch(/^\d+д \d+ч$/);
  });
});
