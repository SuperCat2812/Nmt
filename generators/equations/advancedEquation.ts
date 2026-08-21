import type {
  AdvancedEquationConfig,
  AdvancedEquationForm,
} from '@/types/generator';

import type { Question } from '@/types/question';

import { createNumericOptions } from '@/utils/createNumericOptions';

import { randomFromRange, randomItem } from '@/utils/random';

function generateExponential(config: AdvancedEquationConfig): Question {
  const base = Math.max(2, Math.abs(randomFromRange(config.baseRange)));

  const x = randomFromRange(config.answerRange);

  const value = base ** x;

  return {
    id: crypto.randomUUID(),

    generatorId: 'advanced-equation',

    familyId: 'equations',

    variantKey: `advanced:exponential:${base}:${x}`,

    topicId: 'equations',

    type: 'single-choice',

    title: 'Показникове рівняння',

    math: `${base}^x=${value}`,

    options: createNumericOptions(x, [x + 1, x - 1, -x, base, value]),

    correctAnswer: String(x),

    solution: [
      {
        math: `${value}=${base}^{${x}}`,
      },
      {
        math: `${base}^x=${base}^{${x}}`,
      },
      {
        math: `x=${x}`,
      },
    ],
  };
}

function generateIrrational(config: AdvancedEquationConfig): Question {
  const shift = randomFromRange(config.constantRange);

  const root = randomItem([2, 3, 4, 5, 6, 7, 8]);

  const value = root ** 2;

  const x = value - shift;

  return {
    id: crypto.randomUUID(),

    generatorId: 'advanced-equation',

    familyId: 'equations',

    variantKey: `advanced:irrational:${shift}:${root}:${x}`,

    topicId: 'equations',

    type: 'single-choice',

    title: 'Ірраціональне рівняння',

    math: `\\sqrt{x${shift >= 0 ? '+' : ''}${shift}}=${root}`,

    options: createNumericOptions(x, [
      value + shift,
      root - shift,
      value,
      x + 1,
      x - 1,
    ]),

    correctAnswer: String(x),

    solution: [
      {
        math: `x${shift >= 0 ? '+' : ''}${shift}=${value}`,
      },
      {
        math: `x=${value}-${shift}`,
      },
      {
        math: `x=${x}`,
      },
    ],
  };
}

function generateLogarithmicShift(config: AdvancedEquationConfig): Question {
  const base = Math.max(2, Math.abs(randomFromRange(config.baseRange)));

  const power = randomItem([1, 2, 3]);

  const shift = randomFromRange(config.constantRange);

  const value = base ** power;

  const x = value - shift;

  return {
    id: crypto.randomUUID(),

    generatorId: 'advanced-equation',

    familyId: 'equations',

    variantKey: `advanced:log-shift:${base}:${power}:${shift}`,

    topicId: 'equations',

    type: 'single-choice',

    title: 'Логарифмічне рівняння',

    math: `\\log_{${base}}(x${shift >= 0 ? '+' : ''}${shift})=${power}`,

    options: createNumericOptions(x, [
      value + shift,
      power - shift,
      base - shift,
      x + 1,
      x - 1,
    ]),

    correctAnswer: String(x),

    solution: [
      {
        math: `x${shift >= 0 ? '+' : ''}${shift}=${base}^{${power}}`,
      },
      {
        math: `x=${value}-${shift}`,
      },
      {
        math: `x=${x}`,
      },
    ],
  };
}

const generatorsByForm: Record<
  AdvancedEquationForm,
  (config: AdvancedEquationConfig) => Question
> = {
  exponential: generateExponential,

  irrational: generateIrrational,

  'logarithmic-shift': generateLogarithmicShift,
};

export function generateAdvancedEquation(
  config: AdvancedEquationConfig,
): Question {
  if (config.forms.length === 0) {
    throw new Error('Не задано форм складних рівнянь.');
  }

  return generatorsByForm[randomItem(config.forms)](config);
}
