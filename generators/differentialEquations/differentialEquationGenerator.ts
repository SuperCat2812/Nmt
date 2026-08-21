import type {
  DifferentialEquationConfig,
  DifferentialEquationForm,
} from '@/types/generator';

import type { Question, QuestionOption } from '@/types/question';

import { createNumericOptions } from '@/utils/createNumericOptions';

import {
  randomFromRange,
  randomItem,
  randomNonZeroFromRange,
} from '@/utils/random';

import { shuffle } from '@/utils/shuffle';

function formatCPlusKX(k: number): string {
  if (k >= 0) {
    return `C+${k}x`;
  }

  return `C-${Math.abs(k)}x`;
}

function generateConstantDerivative(
  config: DifferentialEquationConfig,
): Question {
  const k = randomNonZeroFromRange(config.coefficientRange);

  const initial = randomFromRange(config.initialValueRange);

  const x = randomFromRange(config.xRange);

  const answer = k * x + initial;

  return {
    id: crypto.randomUUID(),

    generatorId: 'differential-equation',

    familyId: 'differential-equations',

    variantKey: `differential:constant:${k}:${initial}:${x}`,

    topicId: 'differential-equations',

    type: 'single-choice',

    title: 'Диференціальне рівняння',

    text: `Дано y' = ${k}, y(0) = ${initial}. ` + `Знайдіть y(${x}).`,

    options: createNumericOptions(answer, [
      k + initial,

      k * x,

      initial * x,

      answer + 1,

      answer - 1,
    ]),

    correctAnswer: String(answer),

    solution: [
      {
        math: `y=${k}x+C`,
      },

      {
        math: `y(0)=C=${initial}`,
      },

      {
        math: `y(${x})=${answer}`,
      },
    ],
  };
}

function generateLinearXDerivative(
  config: DifferentialEquationConfig,
): Question {
  const a = randomNonZeroFromRange(config.coefficientRange);

  const initial = randomFromRange(config.initialValueRange);

  const x = randomFromRange(config.xRange);

  const answer = (a * x ** 2) / 2 + initial;

  return {
    id: crypto.randomUUID(),

    generatorId: 'differential-equation',

    familyId: 'differential-equations',

    variantKey: `differential:linear-x:${a}:${initial}:${x}`,

    topicId: 'differential-equations',

    type: 'single-choice',

    title: 'Диференціальне рівняння',

    text: `Дано y' = ${a}x, y(0) = ${initial}. ` + `Знайдіть y(${x}).`,

    options: createNumericOptions(answer, [
      a * x + initial,

      a * x ** 2 + initial,

      (a * x) / 2 + initial,

      answer + 1,

      answer - 1,
    ]),

    correctAnswer: String(answer),

    solution: [
      {
        math: `y=\\int ${a}x\\,dx`,
      },

      {
        math: `y=\\frac{${a}}{2}x^2+C`,
      },

      {
        math: `C=${initial}`,
      },

      {
        math: `y(${x})=${answer}`,
      },
    ],
  };
}

function generateExponentialGeneralSolution(
  config: DifferentialEquationConfig,
): Question {
  const k = randomNonZeroFromRange(config.coefficientRange);

  const correct = `Ce^(${k}x)`;

  const additiveWrong = formatCPlusKX(k);

  const options: QuestionOption[] = shuffle([
    {
      value: correct,

      math: `y=Ce^{${k}x}`,
    },

    {
      value: additiveWrong,

      math: `y=${additiveWrong}`,
    },

    {
      value: `C*x^${k}`,

      math: `y=Cx^{${k}}`,
    },

    {
      value: `Ce^(${-k}x)`,

      math: `y=Ce^{${-k}x}`,
    },
  ]).map((option, index) => ({
    id: String(index),

    ...option,
  }));

  return {
    id: crypto.randomUUID(),

    generatorId: 'differential-equation',

    familyId: 'differential-equations',

    variantKey: `differential:exponential:${k}`,

    topicId: 'differential-equations',

    type: 'single-choice',

    title: 'Загальний розв’язок диференціального рівняння',

    math: `y'=${k}y`,

    options,

    correctAnswer: correct,

    solution: [
      {
        math: `\\frac{dy}{y}=${k}\\,dx`,
      },

      {
        math: `\\ln|y|=${k}x+C`,
      },

      {
        math: `y=Ce^{${k}x}`,
      },
    ],
  };
}

const generatorsByForm: Record<
  DifferentialEquationForm,
  (config: DifferentialEquationConfig) => Question
> = {
  'constant-derivative': generateConstantDerivative,

  'linear-x-derivative': generateLinearXDerivative,

  'exponential-general-solution': generateExponentialGeneralSolution,
};

export function generateDifferentialEquation(
  config: DifferentialEquationConfig,
): Question {
  if (config.forms.length === 0) {
    throw new Error('Не задано форм диференціальних рівнянь.');
  }

  return generatorsByForm[randomItem(config.forms)](config);
}
