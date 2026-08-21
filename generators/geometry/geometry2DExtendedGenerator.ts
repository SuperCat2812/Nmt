import type {
  Geometry2DExtendedConfig,
  Geometry2DExtendedForm,
} from '@/types/generator';

import type { Question, QuestionOption } from '@/types/question';

import { createNumericOptions } from '@/utils/createNumericOptions';

import { randomFromRange, randomItem } from '@/utils/random';

import { shuffle } from '@/utils/shuffle';

function createPiOptions(coefficient: number): QuestionOption[] {
  const values = new Set<number>();

  const candidates = [
    coefficient,
    coefficient + 1,
    coefficient - 1,
    coefficient * 2,
    Math.max(1, Math.floor(coefficient / 2)),
  ];

  for (const candidate of candidates) {
    if (candidate > 0) {
      values.add(candidate);
    }
  }

  let offset = 2;

  while (values.size < 4) {
    values.add(coefficient + offset);

    offset++;
  }

  return shuffle(Array.from(values).slice(0, 4)).map((value, index) => ({
    id: String(index),

    value: `${value}pi`,

    math: `${value}\\pi`,
  }));
}

function generateTrapezoidArea(config: Geometry2DExtendedConfig): Question {
  const a = randomFromRange(config.lengthRange);

  const b = randomFromRange(config.lengthRange);

  const h = randomFromRange(config.lengthRange);

  const answer = ((a + b) * h) / 2;

  return {
    id: crypto.randomUUID(),

    generatorId: 'geometry2d-extended',

    familyId: 'geometry',

    variantKey: `geometry2d:trapezoid:${a}:${b}:${h}`,

    topicId: 'geometry2d',

    type: 'single-choice',

    title: 'Площа трапеції',

    text: `Основи трапеції дорівнюють ${a} і ${b}, висота — ${h}.`,

    options: createNumericOptions(answer, [
      (a + b) * h,
      a * b,
      (a * h) / 2,
      answer + h,
      answer - h,
    ]),

    correctAnswer: String(answer),

    solution: [
      {
        math: `S=\\frac{(a+b)h}{2}`,
      },
      {
        math: `S=\\frac{(${a}+${b})\\cdot${h}}{2}=${answer}`,
      },
    ],
  };
}

function generateParallelogramArea(config: Geometry2DExtendedConfig): Question {
  const a = randomFromRange(config.lengthRange);

  const h = randomFromRange(config.lengthRange);

  const answer = a * h;

  return {
    id: crypto.randomUUID(),

    generatorId: 'geometry2d-extended',

    familyId: 'geometry',

    variantKey: `geometry2d:parallelogram:${a}:${h}`,

    topicId: 'geometry2d',

    type: 'single-choice',

    title: 'Площа паралелограма',

    text: `Основа паралелограма дорівнює ${a}, висота — ${h}.`,

    options: createNumericOptions(answer, [
      2 * (a + h),
      (a * h) / 2,
      a + h,
      answer + a,
      answer - a,
    ]),

    correctAnswer: String(answer),

    solution: [
      {
        math: `S=ah`,
      },
      {
        math: `S=${a}\\cdot${h}=${answer}`,
      },
    ],
  };
}

function generateRhombusArea(config: Geometry2DExtendedConfig): Question {
  const d1 = randomFromRange(config.lengthRange);

  const d2 = randomFromRange(config.lengthRange);

  const answer = (d1 * d2) / 2;

  return {
    id: crypto.randomUUID(),

    generatorId: 'geometry2d-extended',

    familyId: 'geometry',

    variantKey: `geometry2d:rhombus:${d1}:${d2}`,

    topicId: 'geometry2d',

    type: 'single-choice',

    title: 'Площа ромба',

    text: `Діагоналі ромба дорівнюють ${d1} і ${d2}.`,

    options: createNumericOptions(answer, [
      d1 * d2,
      d1 + d2,
      2 * (d1 + d2),
      answer + d1,
      answer - 1,
    ]),

    correctAnswer: String(answer),

    solution: [
      {
        math: `S=\\frac{d_1d_2}{2}`,
      },
      {
        math: `S=\\frac{${d1}\\cdot${d2}}{2}=${answer}`,
      },
    ],
  };
}

function generateCircumference(config: Geometry2DExtendedConfig): Question {
  const r = randomFromRange(config.lengthRange);

  const coefficient = 2 * r;

  return {
    id: crypto.randomUUID(),

    generatorId: 'geometry2d-extended',

    familyId: 'geometry',

    variantKey: `geometry2d:circumference:${r}`,

    topicId: 'geometry2d',

    type: 'single-choice',

    title: 'Довжина кола',

    text: `Радіус кола дорівнює ${r}.`,

    options: createPiOptions(coefficient),

    correctAnswer: `${coefficient}pi`,

    solution: [
      {
        math: `L=2\\pi r`,
      },
      {
        math: `L=2\\pi\\cdot${r}=${coefficient}\\pi`,
      },
    ],
  };
}

function generateArcLength(config: Geometry2DExtendedConfig): Question {
  const r = randomFromRange(config.lengthRange);

  const angle = randomItem([30, 60, 90, 120, 180]);

  const coefficient = (2 * r * angle) / 360;

  return {
    id: crypto.randomUUID(),

    generatorId: 'geometry2d-extended',

    familyId: 'geometry',

    variantKey: `geometry2d:arc:${r}:${angle}`,

    topicId: 'geometry2d',

    type: 'single-choice',

    title: 'Довжина дуги',

    text: `Радіус кола ${r}, центральний кут ${angle}°.`,

    options: createPiOptions(coefficient),

    correctAnswer: `${coefficient}pi`,

    solution: [
      {
        math: `l=\\frac{\\alpha}{360^{\\circ}}\\cdot2\\pi r`,
      },
      {
        math: `l=${coefficient}\\pi`,
      },
    ],
  };
}

function generateSectorArea(config: Geometry2DExtendedConfig): Question {
  const r = randomFromRange(config.lengthRange);

  const angle = randomItem([30, 60, 90, 120, 180]);

  const coefficient = (r ** 2 * angle) / 360;

  return {
    id: crypto.randomUUID(),

    generatorId: 'geometry2d-extended',

    familyId: 'geometry',

    variantKey: `geometry2d:sector:${r}:${angle}`,

    topicId: 'geometry2d',

    type: 'single-choice',

    title: 'Площа сектора',

    text: `Радіус круга ${r}, центральний кут ${angle}°.`,

    options: createPiOptions(coefficient),

    correctAnswer: `${coefficient}pi`,

    solution: [
      {
        math: `S=\\frac{\\alpha}{360^{\\circ}}\\pi r^2`,
      },
      {
        math: `S=${coefficient}\\pi`,
      },
    ],
  };
}

function generateDistance(config: Geometry2DExtendedConfig): Question {
  const triples = [
    [3, 4],
    [5, 12],
    [8, 15],
    [7, 24],
  ] as const;

  const [dx, dy] = randomItem(triples);

  const x1 = randomFromRange(config.coordinateRange);

  const y1 = randomFromRange(config.coordinateRange);

  const x2 = x1 + dx;

  const y2 = y1 + dy;

  const answer = Math.sqrt(dx ** 2 + dy ** 2);

  return {
    id: crypto.randomUUID(),

    generatorId: 'geometry2d-extended',

    familyId: 'geometry',

    variantKey: `geometry2d:distance:${x1}:${y1}:${x2}:${y2}`,

    topicId: 'geometry2d',

    type: 'single-choice',

    title: 'Відстань між точками',

    text: `Знайдіть відстань між A(${x1}; ${y1}) та B(${x2}; ${y2}).`,

    options: createNumericOptions(answer, [
      dx + dy,
      dx * dy,
      Math.abs(dx - dy),
      answer + 1,
      answer - 1,
    ]),

    correctAnswer: String(answer),

    solution: [
      {
        math: `AB=\\sqrt{(x_2-x_1)^2+(y_2-y_1)^2}`,
      },
      {
        math: `AB=\\sqrt{${dx}^2+${dy}^2}=${answer}`,
      },
    ],
  };
}

const generatorsByForm: Record<
  Geometry2DExtendedForm,
  (config: Geometry2DExtendedConfig) => Question
> = {
  'trapezoid-area': generateTrapezoidArea,

  'parallelogram-area': generateParallelogramArea,

  'rhombus-area': generateRhombusArea,

  circumference: generateCircumference,

  'arc-length': generateArcLength,

  'sector-area': generateSectorArea,

  'distance-between-points': generateDistance,
};

export function generateGeometry2DExtended(
  config: Geometry2DExtendedConfig,
): Question {
  if (config.forms.length === 0) {
    throw new Error('Не задано розширених форм планіметрії.');
  }

  return generatorsByForm[randomItem(config.forms)](config);
}
