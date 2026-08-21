import type {
  RationalEquationConfig,
  RationalEquationForm,
} from '@/types/generator';

import type { Question } from '@/types/question';

import { createNumericOptions } from '@/utils/createNumericOptions';

import {
  randomFromRange,
  randomItem,
  randomNonZeroFromRange,
} from '@/utils/random';

// ========================================
// a / (x - b) = c
// ========================================

function generateAOverXMinusB(config: RationalEquationConfig): Question {
  const x = randomFromRange(config.answerRange);

  let b = randomFromRange(config.constantRange);

  while (b === x) {
    b = randomFromRange(config.constantRange);
  }

  const c = randomNonZeroFromRange(config.coefficientRange);

  const a = c * (x - b);

  const options = createNumericOptions(x, [b, x + 1, x - 1, -x, b + c, b - c]);

  const denominator = b >= 0 ? `x-${b}` : `x+${Math.abs(b)}`;

  return {
    id: crypto.randomUUID(),

    generatorId: 'rational-equation',

    familyId: 'equations',

    variantKey: `rational:a-over:${a}:${b}:${c}:${x}`,

    topicId: 'equations',

    type: 'single-choice',

    title: 'Дробово-раціональне рівняння',

    math: `\\frac{${a}}{${denominator}}=${c}`,

    options,

    correctAnswer: String(x),

    solution: [
      {
        text: 'Спочатку визначимо ОДЗ.',
      },
      {
        math: `x \\ne ${b}`,
      },
      {
        math: `${a}=${c}(${denominator})`,
      },
      {
        math: `x=${x}`,
      },
    ],
  };
}

// ========================================
// (x + a) / (x + b) = c
// ========================================

function generateLinearFraction(config: RationalEquationConfig): Question {
  const x = randomFromRange(config.answerRange);

  let b = randomFromRange(config.constantRange);

  while (x + b === 0) {
    b = randomFromRange(config.constantRange);
  }

  let c = randomNonZeroFromRange(config.coefficientRange);

  while (c === 1) {
    c = randomNonZeroFromRange(config.coefficientRange);
  }

  const a = c * (x + b) - x;

  const options = createNumericOptions(x, [-b, -a, x + 1, x - 1, -x, a - b]);

  const numerator = a >= 0 ? `x+${a}` : `x-${Math.abs(a)}`;

  const denominator = b >= 0 ? `x+${b}` : `x-${Math.abs(b)}`;

  return {
    id: crypto.randomUUID(),

    generatorId: 'rational-equation',

    familyId: 'equations',

    variantKey: `rational:linear-fraction:${a}:${b}:${c}:${x}`,

    topicId: 'equations',

    type: 'single-choice',

    title: 'Дробово-раціональне рівняння',

    math: `\\frac{${numerator}}{${denominator}}=${c}`,

    options,

    correctAnswer: String(x),

    solution: [
      {
        math: `x \\ne ${-b}`,
      },
      {
        math: `${numerator}=${c}(${denominator})`,
      },
      {
        math: `x=${x}`,
      },
      {
        text: 'Отриманий корінь належить ОДЗ.',
      },
    ],
  };
}

const generatorsByForm: Record<
  RationalEquationForm,
  (config: RationalEquationConfig) => Question
> = {
  'a-over-x-minus-b': generateAOverXMinusB,

  'linear-fraction': generateLinearFraction,
};

export function generateRationalEquation(
  config: RationalEquationConfig,
): Question {
  if (config.forms.length === 0) {
    throw new Error('Не задано жодної форми дробово-раціональних рівнянь.');
  }

  const form = randomItem(config.forms);

  return generatorsByForm[form](config);
}
