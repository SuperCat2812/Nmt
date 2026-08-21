import type { Geometry3DConfig, Geometry3DForm } from '@/types/generator';

import type { Question, QuestionOption } from '@/types/question';

import { createNumericOptions } from '@/utils/createNumericOptions';

import { randomFromRange, randomItem } from '@/utils/random';

import { shuffle } from '@/utils/shuffle';

function createPiOptions(coefficient: number): QuestionOption[] {
  const unique = new Set<number>();

  const candidates = [
    coefficient,
    coefficient + 1,
    coefficient - 1,
    coefficient * 2,
    coefficient / 2,
  ];

  for (const value of candidates) {
    if (value > 0 && value !== coefficient) {
      unique.add(value);
    }
  }

  let offset = 2;

  while (unique.size < 3) {
    unique.add(coefficient + offset);

    offset++;
  }

  return shuffle([coefficient, ...Array.from(unique).slice(0, 3)]).map(
    (value, index) => ({
      id: String(index),

      value: `${value}pi`,

      math: `${value}\\pi`,
    }),
  );
}

function generateRectangularPrismVolume(config: Geometry3DConfig): Question {
  const a = randomFromRange(config.lengthRange);

  const b = randomFromRange(config.lengthRange);

  const c = randomFromRange(config.lengthRange);

  const answer = a * b * c;

  return {
    id: crypto.randomUUID(),

    generatorId: 'geometry3d',

    familyId: 'geometry',

    variantKey: `geometry3d:rect-prism:${a}:${b}:${c}`,

    topicId: 'geometry3d',

    type: 'single-choice',

    title: 'Об’єм прямокутного паралелепіпеда',

    text: `Ребра дорівнюють ${a}, ${b}, ${c}.`,

    options: createNumericOptions(answer, [
      a * b,
      a + b + c,
      2 * (a * b + a * c + b * c),
      answer + a,
      answer - a,
    ]),

    correctAnswer: String(answer),

    solution: [
      {
        math: `V=abc`,
      },
      {
        math: `V=${a}\\cdot${b}\\cdot${c}=${answer}`,
      },
    ],
  };
}

function generatePrismVolume(config: Geometry3DConfig): Question {
  const baseArea = randomFromRange(config.lengthRange);

  const height = randomFromRange(config.lengthRange);

  const answer = baseArea * height;

  return {
    id: crypto.randomUUID(),

    generatorId: 'geometry3d',

    familyId: 'geometry',

    variantKey: `geometry3d:prism:${baseArea}:${height}`,

    topicId: 'geometry3d',

    type: 'single-choice',

    title: 'Об’єм призми',

    text: `Площа основи призми ${baseArea}, висота ${height}.`,

    options: createNumericOptions(answer, [
      baseArea + height,
      (baseArea * height) / 2,
      baseArea * 2,
      answer + height,
      answer - height,
    ]),

    correctAnswer: String(answer),

    solution: [
      {
        math: `V=S_{осн}h`,
      },
      {
        math: `V=${baseArea}\\cdot${height}=${answer}`,
      },
    ],
  };
}

function generatePyramidVolume(config: Geometry3DConfig): Question {
  const baseArea = randomFromRange(config.lengthRange);

  const height = randomFromRange(config.lengthRange);

  const answer = (baseArea * height) / 3;

  return {
    id: crypto.randomUUID(),

    generatorId: 'geometry3d',

    familyId: 'geometry',

    variantKey: `geometry3d:pyramid:${baseArea}:${height}`,

    topicId: 'geometry3d',

    type: 'single-choice',

    title: 'Об’єм піраміди',

    text: `Площа основи піраміди ${baseArea}, висота ${height}.`,

    options: createNumericOptions(answer, [
      baseArea * height,
      (baseArea * height) / 2,
      baseArea + height,
      answer + 1,
      answer - 1,
    ]),

    correctAnswer: String(answer),

    solution: [
      {
        math: `V=\\frac13S_{осн}h`,
      },
      {
        math: `V=\\frac{${baseArea}\\cdot${height}}{3}=${answer}`,
      },
    ],
  };
}

function generateCylinderVolume(config: Geometry3DConfig): Question {
  const r = randomFromRange(config.lengthRange);

  const h = randomFromRange(config.lengthRange);

  const coefficient = r ** 2 * h;

  return {
    id: crypto.randomUUID(),

    generatorId: 'geometry3d',

    familyId: 'geometry',

    variantKey: `geometry3d:cylinder:${r}:${h}`,

    topicId: 'geometry3d',

    type: 'single-choice',

    title: 'Об’єм циліндра',

    text: `Радіус циліндра ${r}, висота ${h}.`,

    options: createPiOptions(coefficient),

    correctAnswer: `${coefficient}pi`,

    solution: [
      {
        math: `V=\\pi r^2h`,
      },
      {
        math: `V=\\pi\\cdot${r}^2\\cdot${h}=${coefficient}\\pi`,
      },
    ],
  };
}

function generateConeVolume(config: Geometry3DConfig): Question {
  const r = randomFromRange(config.lengthRange);

  const h = randomFromRange(config.lengthRange);

  const coefficient = (r ** 2 * h) / 3;

  return {
    id: crypto.randomUUID(),

    generatorId: 'geometry3d',

    familyId: 'geometry',

    variantKey: `geometry3d:cone:${r}:${h}`,

    topicId: 'geometry3d',

    type: 'single-choice',

    title: 'Об’єм конуса',

    text: `Радіус конуса ${r}, висота ${h}.`,

    options: createPiOptions(coefficient),

    correctAnswer: `${coefficient}pi`,

    solution: [
      {
        math: `V=\\frac13\\pi r^2h`,
      },
      {
        math: `V=${coefficient}\\pi`,
      },
    ],
  };
}

function generateSphereVolume(config: Geometry3DConfig): Question {
  const r = randomFromRange(config.lengthRange);

  const coefficient = (4 * r ** 3) / 3;

  return {
    id: crypto.randomUUID(),

    generatorId: 'geometry3d',

    familyId: 'geometry',

    variantKey: `geometry3d:sphere-volume:${r}`,

    topicId: 'geometry3d',

    type: 'single-choice',

    title: 'Об’єм кулі',

    text: `Радіус кулі дорівнює ${r}.`,

    options: createPiOptions(coefficient),

    correctAnswer: `${coefficient}pi`,

    solution: [
      {
        math: `V=\\frac43\\pi r^3`,
      },
      {
        math: `V=${coefficient}\\pi`,
      },
    ],
  };
}

function generateSphereSurface(config: Geometry3DConfig): Question {
  const r = randomFromRange(config.lengthRange);

  const coefficient = 4 * r ** 2;

  return {
    id: crypto.randomUUID(),

    generatorId: 'geometry3d',

    familyId: 'geometry',

    variantKey: `geometry3d:sphere-surface:${r}`,

    topicId: 'geometry3d',

    type: 'single-choice',

    title: 'Площа поверхні сфери',

    text: `Радіус сфери дорівнює ${r}.`,

    options: createPiOptions(coefficient),

    correctAnswer: `${coefficient}pi`,

    solution: [
      {
        math: `S=4\\pi r^2`,
      },
      {
        math: `S=${coefficient}\\pi`,
      },
    ],
  };
}

const generatorsByForm: Record<
  Geometry3DForm,
  (config: Geometry3DConfig) => Question
> = {
  'rectangular-prism-volume': generateRectangularPrismVolume,

  'prism-volume': generatePrismVolume,

  'pyramid-volume': generatePyramidVolume,

  'cylinder-volume': generateCylinderVolume,

  'cone-volume': generateConeVolume,

  'sphere-volume': generateSphereVolume,

  'sphere-surface': generateSphereSurface,
};

export function generateGeometry3D(config: Geometry3DConfig): Question {
  if (config.forms.length === 0) {
    throw new Error('Не задано форм стереометрії.');
  }

  return generatorsByForm[randomItem(config.forms)](config);
}
