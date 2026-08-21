import type { ComplexNumberConfig, ComplexNumberForm } from '@/types/generator';

import type { Question, QuestionOption } from '@/types/question';

import { createNumericOptions } from '@/utils/createNumericOptions';

import { randomFromRange, randomItem } from '@/utils/random';

import { shuffle } from '@/utils/shuffle';

function complexValue(real: number, imaginary: number): string {
  return `${real};${imaginary}`;
}

function complexLatex(real: number, imaginary: number): string {
  if (imaginary === 0) {
    return String(real);
  }

  if (real === 0) {
    if (imaginary === 1) {
      return 'i';
    }

    if (imaginary === -1) {
      return '-i';
    }

    return `${imaginary}i`;
  }

  const sign = imaginary > 0 ? '+' : '-';

  const absolute = Math.abs(imaginary);

  const imaginaryPart = absolute === 1 ? 'i' : `${absolute}i`;

  return `${real}${sign}` + imaginaryPart;
}

function createComplexOptions(
  real: number,
  imaginary: number,
  candidates: Array<[number, number]>,
): QuestionOption[] {
  const correct = complexValue(real, imaginary);

  const unique = new Map<string, [number, number]>();

  for (const candidate of candidates) {
    const value = complexValue(candidate[0], candidate[1]);

    if (value !== correct) {
      unique.set(value, candidate);
    }
  }

  let offset = 1;

  while (unique.size < 4) {
    const candidate: [number, number] = [real + offset, imaginary];

    unique.set(complexValue(candidate[0], candidate[1]), candidate);

    offset++;
  }

  return shuffle([
    [real, imaginary] as [number, number],

    ...Array.from(unique.values()).slice(0, 4),
  ]).map((value, index) => ({
    id: String(index),

    value: complexValue(value[0], value[1]),

    math: complexLatex(value[0], value[1]),
  }));
}

function generateAddition(config: ComplexNumberConfig): Question {
  const a = randomFromRange(config.valueRange);

  const b = randomFromRange(config.valueRange);

  const c = randomFromRange(config.valueRange);

  const d = randomFromRange(config.valueRange);

  const real = a + c;

  const imaginary = b + d;

  return {
    id: crypto.randomUUID(),

    generatorId: 'complex-number',

    familyId: 'complex-numbers',

    variantKey: `complex:add:${a}:${b}:${c}:${d}`,

    topicId: 'complex-numbers',

    type: 'single-choice',

    title: 'Додавання комплексних чисел',

    math: `(${complexLatex(a, b)})+(${complexLatex(c, d)})`,

    options: createComplexOptions(real, imaginary, [
      [a - c, b - d],

      [a + c, b - d],

      [a - c, b + d],

      [a * c, b * d],
    ]),

    correctAnswer: complexValue(real, imaginary),

    solution: [
      {
        text: 'Додаємо окремо дійсні та уявні частини.',
      },

      {
        math: complexLatex(real, imaginary),
      },
    ],
  };
}

function generateSubtraction(config: ComplexNumberConfig): Question {
  const a = randomFromRange(config.valueRange);

  const b = randomFromRange(config.valueRange);

  const c = randomFromRange(config.valueRange);

  const d = randomFromRange(config.valueRange);

  const real = a - c;

  const imaginary = b - d;

  return {
    id: crypto.randomUUID(),

    generatorId: 'complex-number',

    familyId: 'complex-numbers',

    variantKey: `complex:subtract:${a}:${b}:${c}:${d}`,

    topicId: 'complex-numbers',

    type: 'single-choice',

    title: 'Віднімання комплексних чисел',

    math: `(${complexLatex(a, b)})-(${complexLatex(c, d)})`,

    options: createComplexOptions(real, imaginary, [
      [a + c, b + d],

      [a - c, b + d],

      [a + c, b - d],

      [c - a, d - b],
    ]),

    correctAnswer: complexValue(real, imaginary),

    solution: [
      {
        math: complexLatex(real, imaginary),
      },
    ],
  };
}

function generateMultiplication(config: ComplexNumberConfig): Question {
  const a = randomFromRange(config.valueRange);

  const b = randomFromRange(config.valueRange);

  const c = randomFromRange(config.valueRange);

  const d = randomFromRange(config.valueRange);

  const real = a * c - b * d;

  const imaginary = a * d + b * c;

  return {
    id: crypto.randomUUID(),

    generatorId: 'complex-number',

    familyId: 'complex-numbers',

    variantKey: `complex:multiply:${a}:${b}:${c}:${d}`,

    topicId: 'complex-numbers',

    type: 'single-choice',

    title: 'Множення комплексних чисел',

    math: `(${complexLatex(a, b)})(${complexLatex(c, d)})`,

    options: createComplexOptions(real, imaginary, [
      [a * c + b * d, a * d + b * c],

      [a * c - b * d, a * d - b * c],

      [a * c, b * d],

      [a + c, b + d],
    ]),

    correctAnswer: complexValue(real, imaginary),

    solution: [
      {
        math: `i^2=-1`,
      },

      {
        math: complexLatex(real, imaginary),
      },
    ],
  };
}

function generateModulus(): Question {
  const pairs = [
    [3, 4],
    [5, 12],
    [8, 15],
    [7, 24],
  ] as const;

  const [rawA, rawB] = randomItem(pairs);

  const signA = Math.random() >= 0.5 ? 1 : -1;

  const signB = Math.random() >= 0.5 ? 1 : -1;

  const a = rawA * signA;

  const b = rawB * signB;

  const answer = Math.sqrt(a ** 2 + b ** 2);

  return {
    id: crypto.randomUUID(),

    generatorId: 'complex-number',

    familyId: 'complex-numbers',

    variantKey: `complex:modulus:${a}:${b}`,

    topicId: 'complex-numbers',

    type: 'single-choice',

    title: 'Модуль комплексного числа',

    math: `z=${complexLatex(a, b)}`,

    options: createNumericOptions(answer, [
      Math.abs(a) + Math.abs(b),

      Math.abs(a * b),

      a ** 2 + b ** 2,

      answer + 1,

      answer - 1,
    ]),

    correctAnswer: String(answer),

    solution: [
      {
        math: `|z|=\\sqrt{a^2+b^2}`,
      },

      {
        math: `|z|=\\sqrt{(${a})^2+(${b})^2}=${answer}`,
      },
    ],
  };
}

function generatePowerOfI(): Question {
  const power = randomItem([2, 3, 4, 5, 6, 7, 8, 9, 10, 11]);

  const remainder = power % 4;

  const map: Record<
    number,
    {
      value: string;
      math: string;
    }
  > = {
    0: {
      value: '1',
      math: '1',
    },

    1: {
      value: 'i',
      math: 'i',
    },

    2: {
      value: '-1',
      math: '-1',
    },

    3: {
      value: '-i',
      math: '-i',
    },
  };

  const answer = map[remainder];

  return {
    id: crypto.randomUUID(),

    generatorId: 'complex-number',

    familyId: 'complex-numbers',

    variantKey: `complex:power-i:${power}`,

    topicId: 'complex-numbers',

    type: 'single-choice',

    title: 'Степені числа i',

    math: `i^{${power}}`,

    options: shuffle(['1', '-1', 'i', '-i']).map((value, index) => ({
      id: String(index),

      value,

      math: value,
    })),

    correctAnswer: answer.value,

    solution: [
      {
        math: `i^4=1`,
      },

      {
        text: `Остача від ділення ${power} на 4 дорівнює ${remainder}.`,
      },

      {
        math: `i^{${power}}=${answer.math}`,
      },
    ],
  };
}

const generatorsByForm: Record<
  ComplexNumberForm,
  (config: ComplexNumberConfig) => Question
> = {
  addition: generateAddition,

  subtraction: generateSubtraction,

  multiplication: generateMultiplication,

  modulus: () => generateModulus(),

  'power-of-i': () => generatePowerOfI(),
};

export function generateComplexNumber(config: ComplexNumberConfig): Question {
  if (config.forms.length === 0) {
    throw new Error('Не задано форм комплексних чисел.');
  }

  return generatorsByForm[randomItem(config.forms)](config);
}
