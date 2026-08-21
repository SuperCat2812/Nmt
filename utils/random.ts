import type { NumberRange } from '@/types/generator';

export function randomInt(min: number, max: number): number {
  if (!Number.isInteger(min) || !Number.isInteger(max)) {
    throw new Error('Межі мають бути цілими числами.');
  }

  if (min > max) {
    throw new Error('Мінімальне значення не може бути більшим за максимальне.');
  }

  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function randomFromRange([min, max]: NumberRange): number {
  return randomInt(min, max);
}

export function randomNonZeroFromRange(range: NumberRange): number {
  const [min, max] = range;

  if (min === 0 && max === 0) {
    throw new Error('Діапазон не містить ненульових значень.');
  }

  let value = 0;

  while (value === 0) {
    value = randomFromRange(range);
  }

  return value;
}

export function randomItem<T>(array: readonly T[]): T {
  if (array.length === 0) {
    throw new Error('Неможливо вибрати елемент із порожнього масиву.');
  }

  return array[randomInt(0, array.length - 1)];
}
