import type { PowerRootConfig, PowerRootForm } from '@/types/generator';

import type { Question } from '@/types/question';

import { createNumericOptions } from '@/utils/createNumericOptions';

import { randomFromRange, randomItem } from '@/utils/random';

function createOptions(answer: number, candidates: number[]) {
  return createNumericOptions(answer, candidates);
}

function generateBase(config: PowerRootConfig): number {
  let base = randomFromRange(config.baseRange);

  if (!config.allowNegativeBase) {
    base = Math.abs(base);
  }

  // 0 даёт слишком много бессмысленных примеров.
  if (base === 0) {
    base = 2;
  }

  return base;
}

function generateExponent(config: PowerRootConfig): number {
  return randomFromRange(config.exponentRange);
}

function generatePowerValue(config: PowerRootConfig): Question {
  const base = generateBase(config);

  const exponent = generateExponent(config);

  const answer = base ** exponent;

  const options = createOptions(answer, [
    base * exponent,
    base + exponent,
    answer + base,
    answer - base,
    base ** Math.max(1, exponent - 1),
  ]);

  return {
    id: crypto.randomUUID(),

    generatorId: 'powers-roots',

    familyId: 'powers-roots',

    variantKey: `powers:power-value:${base}:${exponent}`,

    topicId: 'powers-roots',

    type: 'single-choice',

    title: 'Степінь числа',

    math: `${base}^{${exponent}}`,

    options,

    correctAnswer: String(answer),

    solution: [
      {
        text: 'Степінь показує, скільки разів основу множимо саму на себе.',
      },
      {
        math: `${base}^{${exponent}} = ${answer}`,
      },
    ],
  };
}

function generateMultiplySameBase(config: PowerRootConfig): Question {
  const base = Math.abs(generateBase(config));

  const firstExponent = generateExponent(config);

  const secondExponent = generateExponent(config);

  const resultExponent = firstExponent + secondExponent;

  const answer = base ** resultExponent;

  const options = createOptions(answer, [
    base ** Math.abs(firstExponent - secondExponent),

    base ** (firstExponent * secondExponent),

    base ** Math.max(firstExponent, secondExponent),

    answer + base,
  ]);

  return {
    id: crypto.randomUUID(),

    generatorId: 'powers-roots',

    familyId: 'powers-roots',

    variantKey: `powers:multiply:${base}:${firstExponent}:${secondExponent}`,

    topicId: 'powers-roots',

    type: 'single-choice',

    title: 'Множення степенів',

    math: `${base}^{${firstExponent}} \\cdot ${base}^{${secondExponent}}`,

    options,

    correctAnswer: String(answer),

    solution: [
      {
        math: `a^m \\cdot a^n = a^{m+n}`,
      },
      {
        math: `${base}^{${firstExponent}+${secondExponent}}`,
      },
      {
        math: `${base}^{${resultExponent}} = ${answer}`,
      },
    ],
  };
}

function generateDivideSameBase(config: PowerRootConfig): Question {
  const base = Math.max(2, Math.abs(generateBase(config)));

  const secondExponent = generateExponent(config);

  const difference = randomItem([1, 2, 3]);

  const firstExponent = secondExponent + difference;

  const answer = base ** difference;

  const options = createOptions(answer, [
    base ** (firstExponent + secondExponent),

    base ** (firstExponent * secondExponent),

    base ** secondExponent,

    answer + base,
  ]);

  return {
    id: crypto.randomUUID(),

    generatorId: 'powers-roots',

    familyId: 'powers-roots',

    variantKey: `powers:divide:${base}:${firstExponent}:${secondExponent}`,

    topicId: 'powers-roots',

    type: 'single-choice',

    title: 'Ділення степенів',

    math: `\\frac{${base}^{${firstExponent}}}{${base}^{${secondExponent}}}`,

    options,

    correctAnswer: String(answer),

    solution: [
      {
        math: `\\frac{a^m}{a^n} = a^{m-n}`,
      },
      {
        math: `${base}^{${firstExponent}-${secondExponent}}`,
      },
      {
        math: `${base}^{${difference}} = ${answer}`,
      },
    ],
  };
}

function generatePowerOfPower(config: PowerRootConfig): Question {
  const base = Math.abs(generateBase(config));

  const firstExponent = generateExponent(config);

  const secondExponent = randomItem([2, 3]);

  const resultExponent = firstExponent * secondExponent;

  const answer = base ** resultExponent;

  const options = createOptions(answer, [
    base ** (firstExponent + secondExponent),

    base ** Math.abs(firstExponent - secondExponent),

    base ** firstExponent,

    answer + base,
  ]);

  return {
    id: crypto.randomUUID(),

    generatorId: 'powers-roots',

    familyId: 'powers-roots',

    variantKey: `powers:power-of-power:${base}:${firstExponent}:${secondExponent}`,

    topicId: 'powers-roots',

    type: 'single-choice',

    title: 'Степінь степеня',

    math: `\\left(${base}^{${firstExponent}}\\right)^{${secondExponent}}`,

    options,

    correctAnswer: String(answer),

    solution: [
      {
        math: `\\left(a^m\\right)^n = a^{mn}`,
      },
      {
        math: `${base}^{${firstExponent}\\cdot${secondExponent}}`,
      },
      {
        math: `${base}^{${resultExponent}} = ${answer}`,
      },
    ],
  };
}

function generateSquareRoot(): Question {
  const root = randomItem([2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]);

  const number = root ** 2;

  const options = createOptions(root, [
    root + 1,
    root - 1,
    number / 2,
    root * 2,
    number,
  ]);

  return {
    id: crypto.randomUUID(),

    generatorId: 'powers-roots',

    familyId: 'powers-roots',

    variantKey: `roots:square:${number}`,

    topicId: 'powers-roots',

    type: 'single-choice',

    title: 'Квадратний корінь',

    math: `\\sqrt{${number}}`,

    options,

    correctAnswer: String(root),

    solution: [
      {
        math: `${root}^2 = ${number}`,
      },
      {
        math: `\\sqrt{${number}} = ${root}`,
      },
    ],
  };
}

function generateCubeRoot(): Question {
  const root = randomItem([-5, -4, -3, -2, 2, 3, 4, 5]);

  const number = root ** 3;

  const options = createOptions(root, [
    -root,
    root + 1,
    root - 1,
    root * 2,
    Math.abs(root),
  ]);

  return {
    id: crypto.randomUUID(),

    generatorId: 'powers-roots',

    familyId: 'powers-roots',

    variantKey: `roots:cube:${number}`,

    topicId: 'powers-roots',

    type: 'single-choice',

    title: 'Кубічний корінь',

    math: `\\sqrt[3]{${number}}`,

    options,

    correctAnswer: String(root),

    solution: [
      {
        math: `${root}^3 = ${number}`,
      },
      {
        math: `\\sqrt[3]{${number}} = ${root}`,
      },
    ],
  };
}

function generateSimplifySquareRoot(): Question {
  const outside = randomItem([2, 3, 4, 5, 6]);

  const remainder = randomItem([2, 3, 5, 6, 7, 10]);

  const radicand = outside ** 2 * remainder;

  const correctString = `${outside}*sqrt(${remainder})`;

  const mathOptions = [
    {
      value: correctString,
      math: `${outside}\\sqrt{${remainder}}`,
    },
    {
      value: `${outside + 1}*sqrt(${remainder})`,
      math: `${outside + 1}\\sqrt{${remainder}}`,
    },
    {
      value: `${outside}*sqrt(${remainder + 1})`,
      math: `${outside}\\sqrt{${remainder + 1}}`,
    },
    {
      value: String(outside * remainder),
      math: String(outside * remainder),
    },
  ];

  return {
    id: crypto.randomUUID(),

    generatorId: 'powers-roots',

    familyId: 'powers-roots',

    variantKey: `roots:simplify:${outside}:${remainder}`,

    topicId: 'powers-roots',

    type: 'single-choice',

    title: 'Спрощення квадратного кореня',

    math: `\\sqrt{${radicand}}`,

    options: mathOptions.map((option, index) => ({
      id: String(index),
      value: option.value,
      math: option.math,
    })),

    correctAnswer: correctString,

    solution: [
      {
        math: `${radicand} = ${outside ** 2}\\cdot${remainder}`,
      },
      {
        math: `\\sqrt{${radicand}} = \\sqrt{${outside ** 2}\\cdot${remainder}}`,
      },
      {
        math: `= ${outside}\\sqrt{${remainder}}`,
      },
    ],
  };
}

const generatorsByForm: Record<
  PowerRootForm,
  (config: PowerRootConfig) => Question
> = {
  'power-value': generatePowerValue,

  'multiply-same-base': generateMultiplySameBase,

  'divide-same-base': generateDivideSameBase,

  'power-of-power': generatePowerOfPower,

  'square-root': () => generateSquareRoot(),

  'cube-root': () => generateCubeRoot(),

  'simplify-square-root': () => generateSimplifySquareRoot(),
};

export function generatePowerRoot(config: PowerRootConfig): Question {
  if (config.forms.length === 0) {
    throw new Error('Не задано жодної форми для степенів і коренів.');
  }

  const form = randomItem(config.forms);

  return generatorsByForm[form](config);
}
