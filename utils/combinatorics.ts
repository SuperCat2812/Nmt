export function factorial(value: number): number {
  if (!Number.isInteger(value) || value < 0) {
    throw new Error('Факторіал визначений лише для невід’ємних цілих чисел.');
  }

  let result = 1;

  for (let i = 2; i <= value; i++) {
    result *= i;
  }

  return result;
}

export function combinations(n: number, k: number): number {
  if (k < 0 || n < 0 || k > n) {
    throw new Error('Некоректні параметри C(n, k).');
  }

  const safeK = Math.min(k, n - k);

  let result = 1;

  for (let i = 1; i <= safeK; i++) {
    result = (result * (n - safeK + i)) / i;
  }

  return result;
}

export function arrangements(n: number, k: number): number {
  if (k < 0 || n < 0 || k > n) {
    throw new Error('Некоректні параметри A(n, k).');
  }

  return factorial(n) / factorial(n - k);
}
