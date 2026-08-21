export function formatCoefficient(a: number): string {
  if (a === 1) return '';
  if (a === -1) return '-';

  return String(a);
}

export function formatSignedNumber(value: number, spaces = false): string {
  if (value === 0) return '';

  const separator = spaces ? ' ' : '';

  if (value > 0) {
    return `${separator}+${separator}${value}`;
  }

  return `${separator}-${separator}${Math.abs(value)}`;
}

export function formatAddition(left: number | string, right: number): string {
  if (right >= 0) {
    return `${left}+${right}`;
  }

  return `${left}-${Math.abs(right)}`;
}

export function formatSubtraction(
  left: number | string,
  right: number,
): string {
  if (right >= 0) {
    return `${left}-${right}`;
  }

  return `${left}+${Math.abs(right)}`;
}

export function formatPowerBase(value: number): string {
  if (value < 0) {
    return `(${value})`;
  }

  return String(value);
}

export function roundForDisplay(value: number, digits = 10): number {
  if (!Number.isFinite(value)) return value;

  const multiplier = 10 ** digits;

  const rounded =
    Math.round((value + Number.EPSILON) * multiplier) / multiplier;

  return Object.is(rounded, -0) ? 0 : rounded;
}

export function formatDecimal(value: number, digits = 10): string {
  return String(roundForDisplay(value, digits));
}

function gcd(first: number, second: number): number {
  let a = Math.abs(first);
  let b = Math.abs(second);

  while (b !== 0) {
    const remainder = a % b;

    a = b;
    b = remainder;
  }

  return a || 1;
}

export function formatFractionLatex(
  numerator: number,
  denominator: number,
): string {
  if (denominator === 0) {
    throw new Error('Знаменник не може дорівнювати нулю.');
  }

  let normalizedNumerator = numerator;

  let normalizedDenominator = denominator;

  if (normalizedDenominator < 0) {
    normalizedNumerator *= -1;
    normalizedDenominator *= -1;
  }

  const divisor = gcd(normalizedNumerator, normalizedDenominator);

  normalizedNumerator /= divisor;

  normalizedDenominator /= divisor;

  if (normalizedDenominator === 1) {
    return String(normalizedNumerator);
  }

  if (normalizedNumerator < 0) {
    return (
      `-\\frac{${Math.abs(normalizedNumerator)}}` + `{${normalizedDenominator}}`
    );
  }

  return `\\frac{${normalizedNumerator}}` + `{${normalizedDenominator}}`;
}

export function formatPiFraction(
  numerator: number,
  denominator = 1,
): {
  value: string;
  math: string;
} {
  if (denominator === 0) {
    throw new Error('Знаменник не може дорівнювати нулю.');
  }

  let normalizedNumerator = numerator;

  let normalizedDenominator = denominator;

  if (normalizedDenominator < 0) {
    normalizedNumerator *= -1;
    normalizedDenominator *= -1;
  }

  const divisor = gcd(normalizedNumerator, normalizedDenominator);

  normalizedNumerator /= divisor;

  normalizedDenominator /= divisor;

  const value =
    normalizedDenominator === 1
      ? `${normalizedNumerator}pi`
      : `${normalizedNumerator}/${normalizedDenominator}pi`;

  return {
    value,

    math: `${formatFractionLatex(
      normalizedNumerator,
      normalizedDenominator,
    )}\\pi`,
  };
}
