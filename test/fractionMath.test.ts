import { describe, expect, it } from 'vitest';

import {
  addFractions,
  compareFractions,
  createFraction,
  divideFractions,
  fractionKey,
  fractionToNumber,
  fractionsEqual,
  gcd,
  multiplyFractions,
  parseFraction,
  subtractFractions,
} from '@/utils/fractions/fraction';

describe('Fraction math core', () => {
  it('правильно знаходить НСД', () => {
    expect(gcd(18, 24)).toBe(6);

    expect(gcd(12, 8)).toBe(4);

    expect(gcd(-18, 24)).toBe(6);
  });

  it('скорочує дріб', () => {
    expect(createFraction(18, 24)).toEqual({
      numerator: 3,
      denominator: 4,
    });
  });

  it('переносить мінус у чисельник', () => {
    expect(createFraction(2, -4)).toEqual({
      numerator: -1,
      denominator: 2,
    });
  });

  it('нормалізує нуль', () => {
    expect(createFraction(0, 15)).toEqual({
      numerator: 0,
      denominator: 1,
    });
  });

  it('не дозволяє знаменник 0', () => {
    expect(() => createFraction(1, 0)).toThrow();
  });

  it('правильно додає', () => {
    expect(addFractions(createFraction(1, 2), createFraction(1, 3))).toEqual({
      numerator: 5,
      denominator: 6,
    });
  });

  it('правильно віднімає', () => {
    expect(
      subtractFractions(createFraction(3, 4), createFraction(1, 2)),
    ).toEqual({
      numerator: 1,
      denominator: 4,
    });
  });

  it('правильно множить', () => {
    expect(
      multiplyFractions(createFraction(2, 3), createFraction(3, 5)),
    ).toEqual({
      numerator: 2,
      denominator: 5,
    });
  });

  it('правильно ділить', () => {
    expect(divideFractions(createFraction(2, 3), createFraction(4, 5))).toEqual(
      {
        numerator: 5,
        denominator: 6,
      },
    );
  });

  it('не дозволяє ділити на нульовий дріб', () => {
    expect(() =>
      divideFractions(createFraction(1, 2), createFraction(0, 1)),
    ).toThrow();
  });

  it('правильно порівнює', () => {
    expect(compareFractions(createFraction(1, 2), createFraction(2, 3))).toBe(
      -1,
    );

    expect(compareFractions(createFraction(3, 4), createFraction(2, 3))).toBe(
      1,
    );

    expect(compareFractions(createFraction(2, 4), createFraction(1, 2))).toBe(
      0,
    );
  });

  it('розпізнає еквівалентні дроби', () => {
    expect(fractionsEqual(createFraction(1, 2), createFraction(2, 4))).toBe(
      true,
    );
  });

  it('створює стабільний key', () => {
    expect(
      fractionKey({
        numerator: 6,
        denominator: 8,
      }),
    ).toBe('3/4');
  });

  it('парсить 3/4', () => {
    expect(parseFraction('3/4')).toEqual({
      numerator: 3,
      denominator: 4,
    });
  });

  it('перетворює у число', () => {
    expect(fractionToNumber(createFraction(1, 2))).toBe(0.5);
  });
});
