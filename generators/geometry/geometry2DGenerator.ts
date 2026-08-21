import type { Geometry2DConfig, Geometry2DForm } from '@/types/generator';

import type { Question } from '@/types/question';

import { createNumericOptions } from '@/utils/createNumericOptions';

import { randomFromRange, randomItem } from '@/utils/random';

function createPiOptions(correctCoefficient: number, candidates: number[]) {
  const unique = new Set<number>();

  for (const candidate of candidates) {
    if (candidate !== correctCoefficient) {
      unique.add(candidate);
    }
  }

  let offset = 1;

  while (unique.size < 3) {
    const candidate = correctCoefficient + offset;

    if (candidate !== correctCoefficient) {
      unique.add(candidate);
    }

    offset++;
  }

  return [correctCoefficient, ...Array.from(unique).slice(0, 3)].map(
    (coefficient, index) => ({
      id: String(index),

      value: `${coefficient}pi`,

      math: `${coefficient}\\pi`,
    }),
  );
}

function generateRectangleArea(config: Geometry2DConfig): Question {
  const width = randomFromRange(config.lengthRange);

  const height = randomFromRange(config.lengthRange);

  const answer = width * height;

  return {
    id: crypto.randomUUID(),

    generatorId: 'geometry2d',

    familyId: 'geometry',

    variantKey: `geometry:rectangle-area:${width}:${height}`,

    topicId: 'geometry2d',

    type: 'single-choice',

    title: 'Площа прямокутника',

    text: `Сторони прямокутника дорівнюють ${width} і ${height}. Знайдіть площу.`,

    visual: {
      type: 'geometry2d',

      points: [
        {
          id: 'A',
          x: 60,
          y: 60,
          label: 'A',
        },
        {
          id: 'B',
          x: 300,
          y: 60,
          label: 'B',
        },
        {
          id: 'C',
          x: 300,
          y: 220,
          label: 'C',
        },
        {
          id: 'D',
          x: 60,
          y: 220,
          label: 'D',
        },
      ],

      segments: [
        {
          from: 'A',
          to: 'B',
        },
        {
          from: 'B',
          to: 'C',
        },
        {
          from: 'C',
          to: 'D',
        },
        {
          from: 'D',
          to: 'A',
        },
      ],
    },

    options: createNumericOptions(answer, [
      2 * (width + height),

      width + height,

      (width * height) / 2,

      answer + width,

      answer - width,
    ]),

    correctAnswer: String(answer),

    solution: [
      {
        math: `S=ab`,
      },
      {
        math: `S=${width}\\cdot${height}=${answer}`,
      },
    ],
  };
}

function generateTriangleArea(config: Geometry2DConfig): Question {
  const base = randomFromRange(config.lengthRange);

  const height = randomFromRange(config.lengthRange);

  const answer = (base * height) / 2;

  return {
    id: crypto.randomUUID(),

    generatorId: 'geometry2d',

    familyId: 'geometry',

    variantKey: `geometry:triangle-area:${base}:${height}`,

    topicId: 'geometry2d',

    type: 'single-choice',

    title: 'Площа трикутника',

    text: `Основа трикутника дорівнює ${base}, висота до цієї основи — ${height}. Знайдіть площу.`,

    options: createNumericOptions(answer, [
      base * height,

      base + height,

      2 * (base + height),

      answer + height,

      answer - 1,
    ]),

    correctAnswer: String(answer),

    solution: [
      {
        math: `S=\\frac{1}{2}ah`,
      },
      {
        math: `S=\\frac{${base}\\cdot${height}}{2}=${answer}`,
      },
    ],
  };
}

function generateCircleArea(config: Geometry2DConfig): Question {
  const radius = randomFromRange(config.lengthRange);

  const coefficient = radius ** 2;

  const answer = `${coefficient}pi`;

  return {
    id: crypto.randomUUID(),

    generatorId: 'geometry2d',

    familyId: 'geometry',

    variantKey: `geometry:circle-area:${radius}`,

    topicId: 'geometry2d',

    type: 'single-choice',

    title: 'Площа круга',

    text: `Радіус круга дорівнює ${radius}. Знайдіть площу.`,
    options: createPiOptions(coefficient, [
      radius,
      2 * radius,
      2 * coefficient,
      coefficient + radius,
      coefficient - radius,
    ]),
    correctAnswer: answer,

    solution: [
      {
        math: `S=\\pi r^2`,
      },
      {
        math: `S=\\pi\\cdot${radius}^2=${coefficient}\\pi`,
      },
    ],
  };
}

function generatePythagorean(): Question {
  const triples = [
    [3, 4, 5],
    [5, 12, 13],
    [8, 15, 17],
    [7, 24, 25],
  ] as const;

  const [a, b, c] = randomItem(triples);

  return {
    id: crypto.randomUUID(),

    generatorId: 'geometry2d',

    familyId: 'geometry',

    variantKey: `geometry:pythagorean:${a}:${b}:${c}`,

    topicId: 'geometry2d',

    type: 'single-choice',

    title: 'Теорема Піфагора',

    text: `Катети прямокутного трикутника дорівнюють ${a} і ${b}. Знайдіть гіпотенузу.`,

    options: createNumericOptions(c, [
      a + b,
      Math.abs(a - b),
      a * b,
      c + 1,
      c - 1,
    ]),

    correctAnswer: String(c),

    solution: [
      {
        math: `c^2=a^2+b^2`,
      },
      {
        math: `c=\\sqrt{${a}^2+${b}^2}=${c}`,
      },
    ],
  };
}

const generatorsByForm: Record<
  Geometry2DForm,
  (config: Geometry2DConfig) => Question
> = {
  'rectangle-area': generateRectangleArea,

  'triangle-area': generateTriangleArea,

  'circle-area': generateCircleArea,

  pythagorean: () => generatePythagorean(),
};

export function generateGeometry2D(config: Geometry2DConfig): Question {
  if (config.forms.length === 0) {
    throw new Error('Не задано форм планіметрії.');
  }

  return generatorsByForm[randomItem(config.forms)](config);
}
