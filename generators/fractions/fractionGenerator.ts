import type { FractionConfig, FractionForm } from '@/types/generator';

import type { Fraction } from '@/types/fraction';

import type { Question, QuestionOption } from '@/types/question';

import {
  addFractions,
  compareFractions,
  createFraction,
  divideFractions,
  fractionKey,
  fractionToLatex,
  multiplyFractions,
  simplifyFraction,
  subtractFractions,
} from '@/utils/fractions/fraction';

import { randomFromRange, randomItem } from '@/utils/random';

import { shuffle } from '@/utils/shuffle';

function generateFractionValue(config: FractionConfig): Fraction {
  let numerator = randomFromRange(config.numeratorRange);

  const denominator = randomFromRange(config.denominatorRange);

  if (config.allowNegative && Math.random() >= 0.5) {
    numerator *= -1;
  }

  if (!config.allowImproper && Math.abs(numerator) >= denominator) {
    const sign = numerator < 0 ? -1 : 1;

    numerator = sign * Math.max(1, denominator - 1);
  }

  return createFraction(numerator, denominator);
}

function createFractionOptions(
  correct: Fraction,
  candidates: Fraction[],
): QuestionOption[] {
  const correctKey = fractionKey(correct);

  const unique = new Map<string, Fraction>();

  for (const candidate of candidates) {
    const key = fractionKey(candidate);

    if (key !== correctKey) {
      unique.set(key, candidate);
    }

    if (unique.size >= 3) {
      break;
    }
  }

  let offset = 1;

  while (unique.size < 3) {
    const candidate = createFraction(
      correct.numerator + offset,
      correct.denominator,
    );

    const key = fractionKey(candidate);

    if (key !== correctKey) {
      unique.set(key, candidate);
    }

    offset++;
  }

  const values = shuffle([correct, ...Array.from(unique.values()).slice(0, 3)]);

  return values.map((fraction, index) => ({
    id: String(index),

    value: fractionKey(fraction),

    math: fractionToLatex(fraction),
  }));
}

function generateReduce(config: FractionConfig): Question {
  const simplified = generateFractionValue(config);

  const multiplier = randomItem([2, 3, 4, 5]);

  const original: Fraction = {
    numerator: simplified.numerator * multiplier,

    denominator: simplified.denominator * multiplier,
  };

  const answer = simplifyFraction(original);

  const options = createFractionOptions(answer, [
    createFraction(original.numerator, simplified.denominator),

    createFraction(simplified.numerator + 1, simplified.denominator),

    createFraction(simplified.numerator, simplified.denominator + 1),

    createFraction(original.numerator - multiplier, original.denominator),
  ]);

  return {
    id: crypto.randomUUID(),

    generatorId: 'fraction',

    familyId: 'fractions',

    variantKey: `fraction:reduce:${original.numerator}/${original.denominator}`,

    topicId: 'fractions',

    type: 'single-choice',

    title: 'Скорочення дробу',

    text: 'Скоротіть дріб.',

    math: fractionToLatex(original),

    options,

    correctAnswer: fractionKey(answer),

    solution: [
      {
        text: `Чисельник і знаменник ділимо на ${multiplier}.`,
      },
      {
        math: `${fractionToLatex(original)} = ${fractionToLatex(answer)}`,
      },
    ],
  };
}

function generateCompare(config: FractionConfig): Question {
  const first = generateFractionValue(config);

  let second = generateFractionValue(config);

  while (compareFractions(first, second) === 0) {
    second = generateFractionValue(config);
  }

  const comparison = compareFractions(first, second);

  const answer = comparison < 0 ? '<' : '>';

  const options: QuestionOption[] = [
    {
      id: 'less',
      value: '<',
      text: '<',
    },
    {
      id: 'greater',
      value: '>',
      text: '>',
    },
    {
      id: 'equal',
      value: '=',
      text: '=',
    },
  ];

  const leftProduct = first.numerator * second.denominator;

  const rightProduct = second.numerator * first.denominator;

  return {
    id: crypto.randomUUID(),

    generatorId: 'fraction',

    familyId: 'fractions',

    variantKey: `fraction:compare:${fractionKey(first)}:${fractionKey(second)}`,

    topicId: 'fractions',

    type: 'single-choice',

    title: 'Порівняння дробів',

    text: 'Оберіть правильний знак.',

    math: `${fractionToLatex(first)}\\;?\\;${fractionToLatex(second)}`,

    options,

    correctAnswer: answer,

    solution: [
      {
        text: 'Порівняємо дроби перехресним множенням.',
      },
      {
        math: `${first.numerator}\\cdot${second.denominator}=${leftProduct}`,
      },
      {
        math: `${second.numerator}\\cdot${first.denominator}=${rightProduct}`,
      },
      {
        math: `${fractionToLatex(first)} ${answer} ${fractionToLatex(second)}`,
      },
    ],
  };
}

function generateAdd(config: FractionConfig): Question {
  const first = generateFractionValue(config);

  const second = generateFractionValue(config);

  const answer = addFractions(first, second);

  const options = createFractionOptions(answer, [
    subtractFractions(first, second),

    multiplyFractions(first, second),

    createFraction(
      first.numerator + second.numerator,
      first.denominator + second.denominator,
    ),

    createFraction(answer.numerator + 1, answer.denominator),
  ]);

  return {
    id: crypto.randomUUID(),

    generatorId: 'fraction',

    familyId: 'fractions',

    variantKey: `fraction:add:${fractionKey(first)}:${fractionKey(second)}`,

    topicId: 'fractions',

    type: 'single-choice',

    title: 'Додавання дробів',

    math: `${fractionToLatex(first)} + ${fractionToLatex(second)}`,

    options,

    correctAnswer: fractionKey(answer),

    solution: [
      {
        math: `\\frac{${first.numerator}\\cdot${second.denominator}+${second.numerator}\\cdot${first.denominator}}{${first.denominator}\\cdot${second.denominator}}`,
      },
      {
        math: `= ${fractionToLatex(answer)}`,
      },
    ],
  };
}

function generateSubtract(config: FractionConfig): Question {
  let first = generateFractionValue(config);

  let second = generateFractionValue(config);

  if (!config.allowNegative && compareFractions(first, second) < 0) {
    [first, second] = [second, first];
  }

  const answer = subtractFractions(first, second);

  const options = createFractionOptions(answer, [
    addFractions(first, second),

    multiplyFractions(first, second),

    createFraction(
      first.numerator - second.numerator,
      first.denominator + second.denominator,
    ),

    createFraction(answer.numerator + 1, answer.denominator),
  ]);

  return {
    id: crypto.randomUUID(),

    generatorId: 'fraction',

    familyId: 'fractions',

    variantKey: `fraction:subtract:${fractionKey(first)}:${fractionKey(second)}`,

    topicId: 'fractions',

    type: 'single-choice',

    title: 'Віднімання дробів',

    math: `${fractionToLatex(first)} - ${fractionToLatex(second)}`,

    options,

    correctAnswer: fractionKey(answer),

    solution: [
      {
        math: `\\frac{${first.numerator}\\cdot${second.denominator}-${second.numerator}\\cdot${first.denominator}}{${first.denominator}\\cdot${second.denominator}}`,
      },
      {
        math: `= ${fractionToLatex(answer)}`,
      },
    ],
  };
}

function generateMultiply(config: FractionConfig): Question {
  const first = generateFractionValue(config);

  const second = generateFractionValue(config);

  const answer = multiplyFractions(first, second);

  const options = createFractionOptions(answer, [
    addFractions(first, second),

    subtractFractions(first, second),

    createFraction(
      first.numerator * second.denominator,
      first.denominator * second.numerator,
    ),

    createFraction(answer.numerator + 1, answer.denominator),
  ]);

  return {
    id: crypto.randomUUID(),

    generatorId: 'fraction',

    familyId: 'fractions',

    variantKey: `fraction:multiply:${fractionKey(first)}:${fractionKey(second)}`,

    topicId: 'fractions',

    type: 'single-choice',

    title: 'Множення дробів',

    math: `${fractionToLatex(first)} \\cdot ${fractionToLatex(second)}`,

    options,

    correctAnswer: fractionKey(answer),

    solution: [
      {
        math: `\\frac{${first.numerator}\\cdot${second.numerator}}{${first.denominator}\\cdot${second.denominator}}`,
      },
      {
        math: `= ${fractionToLatex(answer)}`,
      },
    ],
  };
}

function generateDivide(config: FractionConfig): Question {
  const first = generateFractionValue(config);

  let second = generateFractionValue(config);

  while (second.numerator === 0) {
    second = generateFractionValue(config);
  }

  const answer = divideFractions(first, second);

  const options = createFractionOptions(answer, [
    multiplyFractions(first, second),

    addFractions(first, second),

    createFraction(
      first.numerator * second.numerator,
      first.denominator * second.denominator,
    ),

    createFraction(answer.numerator + 1, answer.denominator),
  ]);

  return {
    id: crypto.randomUUID(),

    generatorId: 'fraction',

    familyId: 'fractions',

    variantKey: `fraction:divide:${fractionKey(first)}:${fractionKey(second)}`,

    topicId: 'fractions',

    type: 'single-choice',

    title: 'Ділення дробів',

    math: `${fractionToLatex(first)} : ${fractionToLatex(second)}`,

    options,

    correctAnswer: fractionKey(answer),

    solution: [
      {
        text: 'Ділення на дріб замінюємо множенням на обернений дріб.',
      },
      {
        math: `${fractionToLatex(first)} \\cdot \\frac{${second.denominator}}{${second.numerator}}`,
      },
      {
        math: `= ${fractionToLatex(answer)}`,
      },
    ],
  };
}

const generatorsByForm: Record<
  FractionForm,
  (config: FractionConfig) => Question
> = {
  reduce: generateReduce,

  compare: generateCompare,

  add: generateAdd,

  subtract: generateSubtract,

  multiply: generateMultiply,

  divide: generateDivide,
};

export function generateFraction(config: FractionConfig): Question {
  if (config.forms.length === 0) {
    throw new Error('Для теми дробів не задано жодної форми.');
  }

  const form = randomItem(config.forms);

  return generatorsByForm[form](config);
}
