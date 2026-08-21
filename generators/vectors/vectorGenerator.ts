import type { VectorConfig, VectorForm } from '@/types/generator';

import type { Question } from '@/types/question';

import { createNumericOptions } from '@/utils/createNumericOptions';

import { randomFromRange, randomItem } from '@/utils/random';
import { shuffle } from '@/utils/shuffle';

function createVectorOptions(correct: number[], candidates: number[][]) {
  const correctValue = correct.join(';');

  const unique = new Map<string, number[]>();

  for (const candidate of candidates) {
    const value = candidate.join(';');

    if (value !== correctValue) {
      unique.set(value, candidate);
    }
  }

  let offset = 1;

  while (unique.size < 3) {
    const fallback = correct.map((value, index) =>
      index === 0 ? value + offset : value,
    );

    const value = fallback.join(';');

    if (value !== correctValue) {
      unique.set(value, fallback);
    }

    offset++;
  }

  return shuffle([correct, ...Array.from(unique.values()).slice(0, 3)]).map(
    (vector, index) => ({
      id: String(index),
      value: vector.join(';'),
      math: `(${vector.join(';')})`,
    }),
  );
}

function generateCoordinates2D(config: VectorConfig): Question {
  const x1 = randomFromRange(config.coordinateRange);

  const y1 = randomFromRange(config.coordinateRange);

  const x2 = randomFromRange(config.coordinateRange);

  const y2 = randomFromRange(config.coordinateRange);

  const dx = x2 - x1;

  const dy = y2 - y1;

  const answer = `${dx};${dy}`;

  return {
    id: crypto.randomUUID(),

    generatorId: 'vector',

    familyId: 'vectors',

    variantKey: `vector:coordinates2d:${x1}:${y1}:${x2}:${y2}`,

    topicId: 'vectors',

    type: 'single-choice',

    title: 'Координати вектора',

    text: `Дано A(${x1}; ${y1}) та B(${x2}; ${y2}). Знайдіть координати вектора AB.`,

    options: createVectorOptions(
      [dx, dy],
      [
        [-dx, -dy],

        [x1 + x2, y1 + y2],

        [dx, -dy],

        [-dx, dy],

        [dx + 1, dy],
      ],
    ),

    correctAnswer: answer,

    solution: [
      {
        math: '\\overrightarrow{AB}=(x_B-x_A;\\;y_B-y_A)',
      },
      {
        math: `\\overrightarrow{AB}=(${x2}-${x1};\\;${y2}-${y1})`,
      },
      {
        math: `=(${dx};${dy})`,
      },
    ],
  };
}

function generateCoordinates3D(config: VectorConfig): Question {
  const a = [
    randomFromRange(config.coordinateRange),
    randomFromRange(config.coordinateRange),
    randomFromRange(config.coordinateRange),
  ];

  const b = [
    randomFromRange(config.coordinateRange),
    randomFromRange(config.coordinateRange),
    randomFromRange(config.coordinateRange),
  ];

  const result = b.map((value, index) => value - a[index]);

  const answer = result.join(';');

  const wrong = a.map((value, index) => value + b[index]);

  return {
    id: crypto.randomUUID(),

    generatorId: 'vector',

    familyId: 'vectors',

    variantKey: `vector:coordinates3d:${a.join(':')}:${b.join(':')}`,

    topicId: 'vectors',

    type: 'single-choice',

    title: 'Координати вектора у просторі',

    text: `A(${a.join('; ')}) і B(${b.join('; ')}). Знайдіть координати вектора AB.`,

    options: createVectorOptions(result, [
      wrong,

      result.map((value) => -value),

      [result[0], -result[1], result[2]],

      [result[0] + 1, result[1], result[2]],
    ]),

    correctAnswer: answer,

    solution: [
      {
        math: '\\overrightarrow{AB}=(x_B-x_A;\\;y_B-y_A;\\;z_B-z_A)',
      },
      {
        math: `(${result.join(';')})`,
      },
    ],
  };
}

function generateLength2D(): Question {
  const triples = [
    [3, 4],
    [5, 12],
    [8, 15],
    [7, 24],
  ] as const;

  let [x, y] = randomItem(triples);

  if (Math.random() >= 0.5) {
    x *= -1;
  }

  if (Math.random() >= 0.5) {
    y *= -1;
  }

  const answer = Math.sqrt(x ** 2 + y ** 2);

  return {
    id: crypto.randomUUID(),

    generatorId: 'vector',

    familyId: 'vectors',

    variantKey: `vector:length:${x}:${y}`,

    topicId: 'vectors',

    type: 'single-choice',

    title: 'Довжина вектора',

    math: `\\vec a=(${x};${y})`,

    options: createNumericOptions(answer, [
      Math.abs(x) + Math.abs(y),

      Math.abs(x * y),

      Math.sqrt(Math.abs(x) + Math.abs(y)),

      answer + 1,
      answer - 1,
    ]),

    correctAnswer: String(answer),

    solution: [
      {
        math: `|\\vec a|=\\sqrt{x^2+y^2}`,
      },
      {
        math: `=\\sqrt{${x}^2+${y}^2}=${answer}`,
      },
    ],
  };
}

function generateDotProduct(config: VectorConfig): Question {
  const a1 = randomFromRange(config.coordinateRange);

  const a2 = randomFromRange(config.coordinateRange);

  const b1 = randomFromRange(config.coordinateRange);

  const b2 = randomFromRange(config.coordinateRange);

  const answer = a1 * b1 + a2 * b2;

  return {
    id: crypto.randomUUID(),

    generatorId: 'vector',

    familyId: 'vectors',

    variantKey: `vector:dot:${a1}:${a2}:${b1}:${b2}`,

    topicId: 'vectors',

    type: 'single-choice',

    title: 'Скалярний добуток',

    math: `\\vec a=(${a1};${a2}),\\quad\\vec b=(${b1};${b2})`,

    options: createNumericOptions(answer, [
      a1 + a2 + b1 + b2,

      a1 * b1 - a2 * b2,

      a1 * a2 + b1 * b2,

      answer + 1,
      answer - 1,
    ]),

    correctAnswer: String(answer),

    solution: [
      {
        math: `\\vec a\\cdot\\vec b=a_1b_1+a_2b_2`,
      },
      {
        math: `=${a1}\\cdot${b1}+${a2}\\cdot${b2}=${answer}`,
      },
    ],
  };
}

const generatorsByForm: Record<VectorForm, (config: VectorConfig) => Question> =
  {
    'coordinates-2d': generateCoordinates2D,

    'coordinates-3d': generateCoordinates3D,

    'length-2d': () => generateLength2D(),

    'dot-product': generateDotProduct,
  };

export function generateVector(config: VectorConfig): Question {
  if (config.forms.length === 0) {
    throw new Error('Не задано жодної форми для векторів.');
  }

  return generatorsByForm[randomItem(config.forms)](config);
}
