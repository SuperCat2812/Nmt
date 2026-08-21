import type { Fraction } from '@/types/fraction';

export function gcd(a: number, b: number): number {
  a = Math.abs(a);
  b = Math.abs(b);

  while (b !== 0) {
    const temporary = b;

    b = a % b;
    a = temporary;
  }

  return a || 1;
}

export function createFraction(
  numerator: number,
  denominator: number,
): Fraction {
  if (!Number.isInteger(numerator) || !Number.isInteger(denominator)) {
    throw new Error('Чисельник і знаменник мають бути цілими числами.');
  }

  if (denominator === 0) {
    throw new Error('Знаменник не може дорівнювати нулю.');
  }

  return simplifyFraction({
    numerator,
    denominator,
  });
}

export function simplifyFraction(fraction: Fraction): Fraction {
  let { numerator, denominator } = fraction;

  if (denominator === 0) {
    throw new Error('Знаменник не може дорівнювати нулю.');
  }

  if (numerator === 0) {
    return {
      numerator: 0,
      denominator: 1,
    };
  }

  if (denominator < 0) {
    numerator *= -1;
    denominator *= -1;
  }

  const divisor = gcd(numerator, denominator);

  return {
    numerator: numerator / divisor,

    denominator: denominator / divisor,
  };
}

export function addFractions(first: Fraction, second: Fraction): Fraction {
  return createFraction(
    first.numerator * second.denominator + second.numerator * first.denominator,

    first.denominator * second.denominator,
  );
}

export function subtractFractions(first: Fraction, second: Fraction): Fraction {
  return createFraction(
    first.numerator * second.denominator - second.numerator * first.denominator,

    first.denominator * second.denominator,
  );
}

export function multiplyFractions(first: Fraction, second: Fraction): Fraction {
  return createFraction(
    first.numerator * second.numerator,

    first.denominator * second.denominator,
  );
}

export function divideFractions(first: Fraction, second: Fraction): Fraction {
  if (second.numerator === 0) {
    throw new Error('Ділення на нуль неможливе.');
  }

  return createFraction(
    first.numerator * second.denominator,

    first.denominator * second.numerator,
  );
}

export function compareFractions(
  first: Fraction,
  second: Fraction,
): -1 | 0 | 1 {
  const left = first.numerator * second.denominator;

  const right = second.numerator * first.denominator;

  if (left < right) {
    return -1;
  }

  if (left > right) {
    return 1;
  }

  return 0;
}

export function fractionsEqual(first: Fraction, second: Fraction): boolean {
  return compareFractions(first, second) === 0;
}

export function fractionToNumber(fraction: Fraction): number {
  return fraction.numerator / fraction.denominator;
}

export function fractionKey(fraction: Fraction): string {
  const normalized = simplifyFraction(fraction);

  return `${normalized.numerator}` + `/${normalized.denominator}`;
}

export function fractionToLatex(fraction: Fraction): string {
  const normalized = simplifyFraction(fraction);

  if (normalized.denominator === 1) {
    return String(normalized.numerator);
  }

  if (normalized.numerator < 0) {
    return `-\\frac{${Math.abs(
      normalized.numerator,
    )}}{${normalized.denominator}}`;
  }

  return `\\frac{${normalized.numerator}}{${normalized.denominator}}`;
}
export function fractionToLatexRaw(fraction: Fraction): string {
  let { numerator, denominator } = fraction;

  if (denominator === 0) {
    throw new Error('Знаменник не може дорівнювати нулю.');
  }

  if (denominator < 0) {
    numerator *= -1;
    denominator *= -1;
  }

  if (denominator === 1) {
    return String(numerator);
  }

  if (numerator < 0) {
    return `-\\frac{${Math.abs(numerator)}}{${denominator}}`;
  }

  return `\\frac{${numerator}}{${denominator}}`;
}

export function parseFraction(value: string): Fraction | null {
  const normalized = value.trim().replace(',', '.');

  const fractionMatch = normalized.match(/^(-?\d+)\s*\/\s*(-?\d+)$/);

  if (fractionMatch) {
    const numerator = Number(fractionMatch[1]);

    const denominator = Number(fractionMatch[2]);

    if (denominator === 0) {
      return null;
    }

    return createFraction(numerator, denominator);
  }

  if (/^-?\d+$/.test(normalized)) {
    return createFraction(Number(normalized), 1);
  }

  return null;
}
