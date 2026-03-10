import { describe, it, expect } from 'vitest';
import { generateGradient, generateAvatarGradient } from '../gradient';

describe('generateGradient', () => {
  it('возвращает CSS linear-gradient', () => {
    const result = generateGradient('test-id');
    expect(result).toMatch(/^linear-gradient\(\d+deg, #[0-9a-f]+, #[0-9a-f]+\)$/i);
  });

  it('генерирует одинаковый градиент для одного seed', () => {
    expect(generateGradient('nft-001')).toBe(generateGradient('nft-001'));
  });

  it('генерирует разные градиенты для разных seeds', () => {
    const g1 = generateGradient('alpha');
    const g2 = generateGradient('beta');
    expect(g1).not.toBe(g2);
  });
});

describe('generateAvatarGradient', () => {
  it('возвращает CSS linear-gradient с углом 135deg', () => {
    const result = generateAvatarGradient('user-1');
    expect(result).toMatch(/^linear-gradient\(135deg, #[0-9a-f]+, #[0-9a-f]+\)$/i);
  });

  it('отличается от обычного градиента для того же seed', () => {
    const gradient = generateGradient('same-seed');
    const avatar = generateAvatarGradient('same-seed');
    expect(gradient).not.toBe(avatar);
  });

  it('детерминирована', () => {
    expect(generateAvatarGradient('xyz')).toBe(generateAvatarGradient('xyz'));
  });
});
