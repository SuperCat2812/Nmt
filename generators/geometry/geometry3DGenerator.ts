import type { Geometry3DConfig, Geometry3DForm } from '@/types/generator';

import type { Question, QuestionOption } from '@/types/question';

import { createNumericOptions } from '@/utils/createNumericOptions';

import { randomFromRange, randomItem } from '@/utils/random';

import { shuffle } from '@/utils/shuffle';

function gcd(first: number, second: number): number {
  let a = Math.abs(first);
  let b = Math.abs(second);

  while (b !== 0) {
    const remainder = a % b;

    a = b;
    b = remainder;
  }

  return a || 1;
}

function simplifyFraction(
  numerator: number,
  denominator: number,
): {
  numerator: number;
  denominator: number;
} {
  if (denominator === 0) {
    throw new Error('Знаменник не може дорівнювати нулю.');
  }

  let normalizedNumerator = numerator;

  let normalizedDenominator = denominator;

  if (normalizedDenominator < 0) {
    normalizedNumerator *= -1;

    normalizedDenominator *= -1;
  }

  const divisor = gcd(normalizedNumerator, normalizedDenominator);

  return {
    numerator: normalizedNumerator / divisor,

    denominator: normalizedDenominator / divisor,
  };
}

function fractionKey(numerator: number, denominator: number): string {
  const fraction = simplifyFraction(numerator, denominator);

  if (fraction.denominator === 1) {
    return String(fraction.numerator);
  }

  return `${fraction.numerator}/` + `${fraction.denominator}`;
}

function fractionLatex(numerator: number, denominator: number): string {
  const fraction = simplifyFraction(numerator, denominator);

  if (fraction.denominator === 1) {
    return String(fraction.numerator);
  }

  if (fraction.numerator < 0) {
    return (
      `-\\frac{${Math.abs(fraction.numerator)}}` + `{${fraction.denominator}}`
    );
  }

  return `\\frac{${fraction.numerator}}` + `{${fraction.denominator}}`;
}

function createPiOptions(numerator: number, denominator = 1): QuestionOption[] {
  const correct = simplifyFraction(numerator, denominator);

  const correctKey = `${fractionKey(correct.numerator, correct.denominator)}pi`;

  const candidates = [
    {
      numerator: correct.numerator + correct.denominator,

      denominator: correct.denominator,
    },

    {
      numerator: correct.numerator + 2 * correct.denominator,

      denominator: correct.denominator,
    },

    {
      numerator: correct.numerator * 2,

      denominator: correct.denominator,
    },

    {
      numerator: correct.numerator,

      denominator: correct.denominator * 2,
    },

    {
      numerator: correct.numerator + 3 * correct.denominator,

      denominator: correct.denominator,
    },
  ];

  const unique = new Map<
    string,
    {
      numerator: number;
      denominator: number;
    }
  >();

  for (const candidate of candidates) {
    const normalized = simplifyFraction(
      candidate.numerator,
      candidate.denominator,
    );

    if (normalized.numerator <= 0) {
      continue;
    }

    const key = `${fractionKey(
      normalized.numerator,
      normalized.denominator,
    )}pi`;

    if (key !== correctKey) {
      unique.set(key, normalized);
    }
  }

  let offset = 4;

  while (unique.size < 3) {
    const candidate = simplifyFraction(
      correct.numerator + offset * correct.denominator,

      correct.denominator,
    );

    const key = `${fractionKey(candidate.numerator, candidate.denominator)}pi`;

    if (key !== correctKey) {
      unique.set(key, candidate);
    }

    offset++;
  }

  const values = [correct, ...Array.from(unique.values()).slice(0, 3)];

  return shuffle(values).map((value, index) => ({
    id: String(index),

    value: `${fractionKey(value.numerator, value.denominator)}pi`,

    math: `${fractionLatex(value.numerator, value.denominator)}\\pi`,
  }));
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
        math: `V=S_{\\text{осн}}h`,
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

  const numerator = baseArea * height;

  const answer = numerator / 3;

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
        math: `V=\\frac13S_{\\text{осн}}h`,
      },

      {
        math:
          `V=\\frac{${baseArea}\\cdot${height}}{3}` +
          `=${fractionLatex(numerator, 3)}`,
      },
    ],
  };
}

function generateCylinderVolume(config: Geometry3DConfig): Question {
  const r = randomFromRange(config.lengthRange);

  const h = randomFromRange(config.lengthRange);

  const numerator = r ** 2 * h;

  const denominator = 1;

  return {
    id: crypto.randomUUID(),

    generatorId: 'geometry3d',

    familyId: 'geometry',

    variantKey: `geometry3d:cylinder:${r}:${h}`,

    topicId: 'geometry3d',

    type: 'single-choice',

    title: 'Об’єм циліндра',

    text: `Радіус циліндра ${r}, висота ${h}.`,

    options: createPiOptions(numerator, denominator),

    correctAnswer: `${fractionKey(numerator, denominator)}pi`,

    solution: [
      {
        math: `V=\\pi r^2h`,
      },

      {
        math:
          `V=\\pi\\cdot${r}^2\\cdot${h}` +
          `=${fractionLatex(numerator, denominator)}\\pi`,
      },
    ],
  };
}

function generateConeVolume(config: Geometry3DConfig): Question {
  const r = randomFromRange(config.lengthRange);

  const h = randomFromRange(config.lengthRange);

  const numerator = r ** 2 * h;

  const denominator = 3;

  return {
    id: crypto.randomUUID(),

    generatorId: 'geometry3d',

    familyId: 'geometry',

    variantKey: `geometry3d:cone:${r}:${h}`,

    topicId: 'geometry3d',

    type: 'single-choice',

    title: 'Об’єм конуса',

    text: `Радіус конуса ${r}, висота ${h}.`,

    options: createPiOptions(numerator, denominator),

    correctAnswer: `${fractionKey(numerator, denominator)}pi`,

    solution: [
      {
        math: `V=\\frac13\\pi r^2h`,
      },

      {
        math: `V=${fractionLatex(numerator, denominator)}\\pi`,
      },
    ],
  };
}

function generateSphereVolume(config: Geometry3DConfig): Question {
  const r = randomFromRange(config.lengthRange);

  const numerator = 4 * r ** 3;

  const denominator = 3;

  return {
    id: crypto.randomUUID(),

    generatorId: 'geometry3d',

    familyId: 'geometry',

    variantKey: `geometry3d:sphere-volume:${r}`,

    topicId: 'geometry3d',

    type: 'single-choice',

    title: 'Об’єм кулі',

    text: `Радіус кулі дорівнює ${r}.`,

    options: createPiOptions(numerator, denominator),

    correctAnswer: `${fractionKey(numerator, denominator)}pi`,

    solution: [
      {
        math: `V=\\frac43\\pi r^3`,
      },

      {
        math: `V=${fractionLatex(numerator, denominator)}\\pi`,
      },
    ],
  };
}

function generateSphereSurface(config: Geometry3DConfig): Question {
  const r = randomFromRange(config.lengthRange);

  const numerator = 4 * r ** 2;

  const denominator = 1;

  return {
    id: crypto.randomUUID(),

    generatorId: 'geometry3d',

    familyId: 'geometry',

    variantKey: `geometry3d:sphere-surface:${r}`,

    topicId: 'geometry3d',

    type: 'single-choice',

    title: 'Площа поверхні сфери',

    text: `Радіус сфери дорівнює ${r}.`,

    options: createPiOptions(numerator, denominator),

    correctAnswer: `${fractionKey(numerator, denominator)}pi`,

    solution: [
      {
        math: `S=4\\pi r^2`,
      },

      {
        math: `S=${fractionLatex(numerator, denominator)}\\pi`,
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
