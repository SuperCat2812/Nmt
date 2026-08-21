import type { CalculusConfig, CalculusForm } from '@/types/generator';

import type { Question, QuestionOption } from '@/types/question';

import { createNumericOptions } from '@/utils/createNumericOptions';

import {
  randomFromRange,
  randomItem,
  randomNonZeroFromRange,
} from '@/utils/random';

import { shuffle } from '@/utils/shuffle';

function createMathOptions(
  correctValue: string,
  correctMath: string,
  candidates: Array<{
    value: string;
    math: string;
  }>,
): QuestionOption[] {
  const unique = new Map<
    string,
    {
      value: string;
      math: string;
    }
  >();

  for (const candidate of candidates) {
    if (candidate.value !== correctValue) {
      unique.set(candidate.value, candidate);
    }
  }

  let index = 1;

  while (unique.size < 3) {
    const value = `${correctValue}:wrong:${index}`;

    unique.set(value, {
      value,
      math: `${correctMath}+${index}`,
    });

    index++;
  }

  return shuffle([
    {
      value: correctValue,
      math: correctMath,
    },

    ...Array.from(unique.values()).slice(0, 3),
  ]).map((option, optionIndex) => ({
    id: String(optionIndex),

    value: option.value,

    math: option.math,
  }));
}

// ========================================
// LIMIT
// lim x→a (kx+b)
// ========================================

function generateLimitPolynomial(config: CalculusConfig): Question {
  const k = randomNonZeroFromRange(config.coefficientRange);

  const b = randomFromRange(config.coefficientRange);

  const a = randomFromRange(config.xRange);

  const answer = k * a + b;

  return {
    id: crypto.randomUUID(),

    generatorId: 'calculus',

    familyId: 'calculus',

    variantKey: `calculus:limit:${k}:${b}:${a}`,

    topicId: 'calculus',

    type: 'single-choice',

    title: 'Границя функції',

    math: `\\lim_{x\\to ${a}}(${k}x${b >= 0 ? '+' : ''}${b})`,

    options: createNumericOptions(answer, [
      k + a + b,
      k * a - b,
      a + b,
      k * a,
      answer + 1,
    ]),

    correctAnswer: String(answer),

    solution: [
      {
        text: 'Лінійна функція неперервна, тому підставляємо значення x.',
      },

      {
        math: `${k}\\cdot(${a})${b >= 0 ? '+' : ''}${b}=${answer}`,
      },
    ],
  };
}

// ========================================
// DERIVATIVE AT POINT
// f(x)=ax^n
// ========================================

function generateDerivativeAtPoint(config: CalculusConfig): Question {
  const a = randomNonZeroFromRange(config.coefficientRange);

  const n = Math.max(2, randomFromRange(config.powerRange));

  const x = randomFromRange(config.xRange);

  const answer = a * n * x ** (n - 1);

  return {
    id: crypto.randomUUID(),

    generatorId: 'calculus',

    familyId: 'calculus',

    variantKey: `calculus:derivative-at-point:${a}:${n}:${x}`,

    topicId: 'calculus',

    type: 'single-choice',

    title: 'Похідна в точці',

    text: `Знайдіть f'(${x}).`,

    math: `f(x)=${a}x^{${n}}`,

    options: createNumericOptions(answer, [
      a * x ** n,

      n * x ** (n - 1),

      a * n * x ** n,

      answer + a,

      answer - a,
    ]),

    correctAnswer: String(answer),

    solution: [
      {
        math: `(ax^n)'=anx^{n-1}`,
      },

      {
        math: `f'(x)=${a * n}x^{${n - 1}}`,
      },

      {
        math: `f'(${x})=${answer}`,
      },
    ],
  };
}

// ========================================
// TANGENT SLOPE
// ========================================

function generateTangentSlope(config: CalculusConfig): Question {
  const a = randomNonZeroFromRange(config.coefficientRange);

  const x = randomFromRange(config.xRange);

  const answer = 2 * a * x;

  return {
    id: crypto.randomUUID(),

    generatorId: 'calculus',

    familyId: 'calculus',

    variantKey: `calculus:tangent:${a}:${x}`,

    topicId: 'calculus',

    type: 'single-choice',

    title: 'Кутовий коефіцієнт дотичної',

    text: `Знайдіть кутовий коефіцієнт дотичної до графіка в точці x = ${x}.`,

    math: `f(x)=${a}x^2`,

    options: createNumericOptions(answer, [
      a * x,
      2 * a,
      a * x ** 2,
      answer + 1,
      answer - 1,
    ]),

    correctAnswer: String(answer),

    solution: [
      {
        math: `k=f'(x_0)`,
      },

      {
        math: `f'(x)=${2 * a}x`,
      },

      {
        math: `k=${2 * a}\\cdot(${x})=${answer}`,
      },
    ],
  };
}

// ========================================
// INDEFINITE INTEGRAL
// ========================================

function generateIndefiniteIntegral(config: CalculusConfig): Question {
  const a = randomNonZeroFromRange(config.coefficientRange);

  const n = Math.max(1, randomFromRange(config.powerRange));

  const newPower = n + 1;

  const coefficient = a / newPower;

  const value = `${coefficient}:x:${newPower}`;

  const math = `${coefficient}x^{${newPower}}+C`;

  return {
    id: crypto.randomUUID(),

    generatorId: 'calculus',

    familyId: 'calculus',

    variantKey: `calculus:indefinite:${a}:${n}`,

    topicId: 'calculus',

    type: 'single-choice',

    title: 'Невизначений інтеграл',

    math: `\\int ${a}x^{${n}}\\,dx`,

    options: createMathOptions(value, math, [
      {
        value: `${a * n}:x:${n - 1}`,

        math: `${a * n}x^{${n - 1}}+C`,
      },

      {
        value: `${a}:x:${newPower}`,

        math: `${a}x^{${newPower}}+C`,
      },

      {
        value: `${a / n}:x:${n}`,

        math: `${a / n}x^{${n}}+C`,
      },

      {
        value: `${coefficient}:x:${n}`,

        math: `${coefficient}x^{${n}}+C`,
      },
    ]),

    correctAnswer: value,

    solution: [
      {
        math: `\\int x^n dx=\\frac{x^{n+1}}{n+1}+C`,
      },

      {
        math: `\\int ${a}x^{${n}}dx=${math}`,
      },
    ],
  };
}

// ========================================
// DEFINITE INTEGRAL
// ∫0^b ax dx
// ========================================

function generateDefiniteIntegral(config: CalculusConfig): Question {
  const a = randomNonZeroFromRange(config.coefficientRange);

  const upper = Math.max(1, Math.abs(randomFromRange(config.xRange)));

  const answer = (a * upper ** 2) / 2;

  return {
    id: crypto.randomUUID(),

    generatorId: 'calculus',

    familyId: 'calculus',

    variantKey: `calculus:definite:${a}:${upper}`,

    topicId: 'calculus',

    type: 'single-choice',

    title: 'Визначений інтеграл',

    math: `\\int_0^{${upper}} ${a}x\\,dx`,

    options: createNumericOptions(answer, [
      a * upper,

      a * upper ** 2,

      upper ** 2 / 2,

      answer + a,

      answer - a,
    ]),

    correctAnswer: String(answer),

    solution: [
      {
        math: `\\int ${a}x\\,dx=\\frac{${a}}{2}x^2`,
      },

      {
        math: `\\left.\\frac{${a}}{2}x^2\\right|_0^{${upper}}=${answer}`,
      },
    ],
  };
}

const generatorsByForm: Record<
  CalculusForm,
  (config: CalculusConfig) => Question
> = {
  'limit-polynomial': generateLimitPolynomial,

  'derivative-at-point': generateDerivativeAtPoint,

  'tangent-slope': generateTangentSlope,

  'indefinite-integral-monomial': generateIndefiniteIntegral,

  'definite-integral-monomial': generateDefiniteIntegral,
};

export function generateCalculus(config: CalculusConfig): Question {
  if (config.forms.length === 0) {
    throw new Error('Не задано форм математичного аналізу.');
  }

  return generatorsByForm[randomItem(config.forms)](config);
}
