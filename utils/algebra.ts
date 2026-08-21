export function formatNumber(value: number): string {
  return Object.is(value, -0) ? '0' : String(value);
}

export function formatLinearTerm(coefficient: number, variable = 'x'): string {
  if (coefficient === 0) {
    return '0';
  }

  if (coefficient === 1) {
    return variable;
  }

  if (coefficient === -1) {
    return `-${variable}`;
  }

  return `${coefficient}${variable}`;
}

export function formatSignedTerm(coefficient: number, variable = ''): string {
  if (coefficient === 0) {
    return '';
  }

  const absolute = Math.abs(coefficient);

  let value: string;

  if (variable) {
    value = absolute === 1 ? variable : `${absolute}${variable}`;
  } else {
    value = String(absolute);
  }

  return coefficient > 0 ? ` + ${value}` : ` - ${value}`;
}

export function formatLinearExpression(a: number, b: number): string {
  if (a === 0) {
    return formatNumber(b);
  }

  return formatLinearTerm(a) + formatSignedTerm(b);
}

export function formatQuadraticExpression(
  a: number,
  b: number,
  c: number,
): string {
  let result = '';

  if (a !== 0) {
    if (a === 1) {
      result = 'x^2';
    } else if (a === -1) {
      result = '-x^2';
    } else {
      result = `${a}x^2`;
    }
  }

  if (b !== 0) {
    if (!result) {
      result = formatLinearTerm(b);
    } else {
      result += formatSignedTerm(b, 'x');
    }
  }

  if (c !== 0) {
    if (!result) {
      result = String(c);
    } else {
      result += formatSignedTerm(c);
    }
  }

  return result || '0';
}
