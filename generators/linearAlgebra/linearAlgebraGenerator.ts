import type { LinearAlgebraConfig, LinearAlgebraForm } from '@/types/generator';

import type { Question, QuestionOption } from '@/types/question';

import { createNumericOptions } from '@/utils/createNumericOptions';

import { randomFromRange, randomItem } from '@/utils/random';

import { shuffle } from '@/utils/shuffle';

type Matrix2 = [[number, number], [number, number]];

function matrixKey(matrix: Matrix2): string {
  return matrix.flat().join(';');
}

function matrixLatex(matrix: Matrix2): string {
  return (
    `\\begin{pmatrix}` +
    `${matrix[0][0]}&${matrix[0][1]}\\\\` +
    `${matrix[1][0]}&${matrix[1][1]}` +
    `\\end{pmatrix}`
  );
}

function signedVectorScalar(coefficient: number): string {
  if (coefficient >= 0) {
    return `+${coefficient}`;
  }

  return `-${Math.abs(coefficient)}`;
}

function formatScalarCombination(
  base: number,
  coefficient: number,
  value: number,
): string {
  if (coefficient >= 0) {
    return `${base}+` + `${coefficient}\\cdot(${value})`;
  }

  return `${base}-` + `${Math.abs(coefficient)}\\cdot(${value})`;
}

function createMatrixOptions(
  correct: Matrix2,
  candidates: Matrix2[],
): QuestionOption[] {
  const correctKey = matrixKey(correct);

  const unique = new Map<string, Matrix2>();

  for (const candidate of candidates) {
    const key = matrixKey(candidate);

    if (key !== correctKey) {
      unique.set(key, candidate);
    }
  }

  let offset = 1;

  while (unique.size < 4) {
    const fallback: Matrix2 = [
      [correct[0][0] + offset, correct[0][1]],

      [correct[1][0], correct[1][1]],
    ];

    unique.set(
      matrixKey(fallback),

      fallback,
    );

    offset++;
  }

  return shuffle([correct, ...Array.from(unique.values()).slice(0, 4)]).map(
    (matrix, index) => ({
      id: String(index),

      value: matrixKey(matrix),

      math: matrixLatex(matrix),
    }),
  );
}

function randomMatrix(config: LinearAlgebraConfig): Matrix2 {
  return [
    [randomFromRange(config.valueRange), randomFromRange(config.valueRange)],

    [randomFromRange(config.valueRange), randomFromRange(config.valueRange)],
  ];
}

function generateMatrixAddition(config: LinearAlgebraConfig): Question {
  const a = randomMatrix(config);

  const b = randomMatrix(config);

  const answer: Matrix2 = [
    [a[0][0] + b[0][0], a[0][1] + b[0][1]],

    [a[1][0] + b[1][0], a[1][1] + b[1][1]],
  ];

  return {
    id: crypto.randomUUID(),

    generatorId: 'linear-algebra',

    familyId: 'linear-algebra',

    variantKey: `linear-algebra:add:${matrixKey(a)}:${matrixKey(b)}`,

    topicId: 'linear-algebra',

    type: 'single-choice',

    title: 'Додавання матриць',

    math: `${matrixLatex(a)}+${matrixLatex(b)}`,

    options: createMatrixOptions(answer, [
      [
        [a[0][0] - b[0][0], a[0][1] - b[0][1]],

        [a[1][0] - b[1][0], a[1][1] - b[1][1]],
      ],

      [
        [a[0][0] * b[0][0], a[0][1] * b[0][1]],

        [a[1][0] * b[1][0], a[1][1] * b[1][1]],
      ],

      [
        [answer[0][1], answer[0][0]],

        [answer[1][1], answer[1][0]],
      ],
    ]),

    correctAnswer: matrixKey(answer),

    solution: [
      {
        text: 'Матриці додаємо поелементно.',
      },

      {
        math: matrixLatex(answer),
      },
    ],
  };
}

function multiplyMatrices(a: Matrix2, b: Matrix2): Matrix2 {
  return [
    [
      a[0][0] * b[0][0] + a[0][1] * b[1][0],

      a[0][0] * b[0][1] + a[0][1] * b[1][1],
    ],

    [
      a[1][0] * b[0][0] + a[1][1] * b[1][0],

      a[1][0] * b[0][1] + a[1][1] * b[1][1],
    ],
  ];
}

function generateMatrixMultiplication(config: LinearAlgebraConfig): Question {
  const a = randomMatrix(config);

  const b = randomMatrix(config);

  const answer = multiplyMatrices(a, b);

  const elementwise: Matrix2 = [
    [a[0][0] * b[0][0], a[0][1] * b[0][1]],

    [a[1][0] * b[1][0], a[1][1] * b[1][1]],
  ];

  return {
    id: crypto.randomUUID(),

    generatorId: 'linear-algebra',

    familyId: 'linear-algebra',

    variantKey: `linear-algebra:multiply:${matrixKey(a)}:${matrixKey(b)}`,

    topicId: 'linear-algebra',

    type: 'single-choice',

    title: 'Множення матриць',

    math: `${matrixLatex(a)}${matrixLatex(b)}`,

    options: createMatrixOptions(answer, [
      elementwise,

      multiplyMatrices(b, a),

      [
        [a[0][0] + b[0][0], a[0][1] + b[0][1]],

        [a[1][0] + b[1][0], a[1][1] + b[1][1]],
      ],
    ]),

    correctAnswer: matrixKey(answer),

    solution: [
      {
        text: 'Кожний елемент результату — скалярний добуток відповідного рядка на стовпець.',
      },

      {
        math: matrixLatex(answer),
      },
    ],
  };
}

function generateDeterminant(config: LinearAlgebraConfig): Question {
  const matrix = randomMatrix(config);

  const [[a, b], [c, d]] = matrix;

  const answer = a * d - b * c;

  return {
    id: crypto.randomUUID(),

    generatorId: 'linear-algebra',

    familyId: 'linear-algebra',

    variantKey: `linear-algebra:determinant:${matrixKey(matrix)}`,

    topicId: 'linear-algebra',

    type: 'single-choice',

    title: 'Визначник матриці',

    math: `\\det${matrixLatex(matrix)}`,

    options: createNumericOptions(answer, [
      a * d + b * c,

      a + d - b - c,

      a * b - c * d,

      answer + 1,

      answer - 1,
    ]),

    correctAnswer: String(answer),

    solution: [
      {
        math: `\\det A=ad-bc`,
      },

      {
        math: `\\det A=(${a})\\cdot(${d})-(${b})\\cdot(${c})=${answer}`,
      },
    ],
  };
}

function generateSystem2x2(config: LinearAlgebraConfig): Question {
  const x = randomFromRange(config.valueRange);

  const y = randomFromRange(config.valueRange);

  let a = randomFromRange(config.valueRange);

  let b = randomFromRange(config.valueRange);

  let c = randomFromRange(config.valueRange);

  let d = randomFromRange(config.valueRange);

  while (a * d - b * c === 0) {
    a = randomFromRange(config.valueRange);

    b = randomFromRange(config.valueRange);

    c = randomFromRange(config.valueRange);

    d = randomFromRange(config.valueRange);
  }

  const e = a * x + b * y;

  const f = c * x + d * y;

  const answer = `${x};${y}`;

  const candidates = [
    `${y};${x}`,
    `${-x};${y}`,
    `${x};${-y}`,
    `${-x};${-y}`,
    `${x + 1};${y}`,
    `${x - 1};${y}`,
    `${x};${y + 1}`,
    `${x};${y - 1}`,
    `${x + 1};${y + 1}`,
    `${x - 1};${y - 1}`,
  ];

  const unique = new Set<string>();

  for (const candidate of candidates) {
    if (candidate !== answer) {
      unique.add(candidate);
    }
  }

  let offset = 1;

  while (unique.size < 4) {
    const fallbacks = [
      `${x + offset};${y}`,

      `${x - offset};${y}`,

      `${x};${y + offset}`,

      `${x};${y - offset}`,

      `${x + offset};${y + offset}`,

      `${x - offset};${y - offset}`,
    ];

    for (const fallback of fallbacks) {
      if (fallback !== answer) {
        unique.add(fallback);
      }

      if (unique.size >= 4) {
        break;
      }
    }

    offset++;
  }

  const optionValues = shuffle([answer, ...Array.from(unique).slice(0, 4)]);

  const firstEquation =
    b >= 0 ? `${a}x+${b}y=${e}` : `${a}x-${Math.abs(b)}y=${e}`;

  const secondEquation =
    d >= 0 ? `${c}x+${d}y=${f}` : `${c}x-${Math.abs(d)}y=${f}`;

  return {
    id: crypto.randomUUID(),

    generatorId: 'linear-algebra',

    familyId: 'linear-algebra',

    variantKey: `linear-algebra:system:${a}:${b}:${c}:${d}:${e}:${f}`,

    topicId: 'linear-algebra',

    type: 'single-choice',

    title: 'Система лінійних рівнянь',

    math:
      `\\begin{cases}` +
      `${firstEquation},\\\\` +
      `${secondEquation}` +
      `\\end{cases}`,

    options: optionValues.map((value, index) => {
      const [optionX, optionY] = value.split(';');

      return {
        id: String(index),

        value,

        math: `(${optionX};${optionY})`,
      };
    }),

    correctAnswer: answer,

    solution: [
      {
        text: 'Оскільки визначник системи ненульовий, система має єдиний розв’язок.',
      },

      {
        math: `\\Delta=(${a})\\cdot(${d})-(${b})\\cdot(${c})=${a * d - b * c}\\neq0`,
      },

      {
        math: `x=${x},\\quad y=${y}`,
      },

      {
        text: 'Перевірка першого рівняння:',
      },

      {
        math: `(${a})\\cdot(${x})+(${b})\\cdot(${y})=${e}`,
      },

      {
        text: 'Перевірка другого рівняння:',
      },

      {
        math: `(${c})\\cdot(${x})+(${d})\\cdot(${y})=${f}`,
      },
    ],
  };
}

function generateLinearCombination(config: LinearAlgebraConfig): Question {
  const a = [
    randomFromRange(config.valueRange),

    randomFromRange(config.valueRange),
  ];

  const b = [
    randomFromRange(config.valueRange),

    randomFromRange(config.valueRange),
  ];

  const k = randomItem([-2, -1, 2, 3]);

  const result = [a[0] + k * b[0], a[1] + k * b[1]];

  const answer = result.join(';');

  const candidates = [
    `${a[0] + b[0]};${a[1] + b[1]}`,

    `${a[0] - k * b[0]};${a[1] - k * b[1]}`,

    `${k * a[0] + b[0]};${k * a[1] + b[1]}`,

    `${-result[0]};${-result[1]}`,

    `${result[0] + 1};${result[1]}`,

    `${result[0] - 1};${result[1]}`,

    `${result[0]};${result[1] + 1}`,

    `${result[0]};${result[1] - 1}`,
  ];

  const unique = new Set<string>();

  for (const candidate of candidates) {
    if (candidate !== answer) {
      unique.add(candidate);
    }
  }

  let offset = 1;

  while (unique.size < 4) {
    const fallback = `${result[0] + offset};${result[1]}`;

    if (fallback !== answer) {
      unique.add(fallback);
    }

    offset++;
  }

  const optionValues = shuffle([answer, ...Array.from(unique).slice(0, 4)]);

  const operation = `\\vec a` + `${signedVectorScalar(k)}` + `\\vec b`;

  const firstCoordinate = formatScalarCombination(a[0], k, b[0]);

  const secondCoordinate = formatScalarCombination(a[1], k, b[1]);

  return {
    id: crypto.randomUUID(),

    generatorId: 'linear-algebra',

    familyId: 'linear-algebra',

    variantKey: `linear-algebra:combination:${a.join(':')}:${b.join(':')}:${k}`,

    topicId: 'linear-algebra',

    type: 'single-choice',

    title: 'Лінійна комбінація векторів',

    math:
      `\\vec a=(${a.join(';')}),\\quad` +
      `\\vec b=(${b.join(';')}),\\quad` +
      `${operation}`,

    options: optionValues.map((value, index) => {
      const [x, y] = value.split(';');

      return {
        id: String(index),

        value,

        math: `(${x};${y})`,
      };
    }),

    correctAnswer: answer,

    solution: [
      {
        text: 'Помножимо координати другого вектора на число та додамо відповідні координати.',
      },

      {
        math: operation,
      },

      {
        math: `=(${firstCoordinate};\\;${secondCoordinate})`,
      },

      {
        math: `=(${result[0]};${result[1]})`,
      },
    ],
  };
}

const generatorsByForm: Record<
  LinearAlgebraForm,
  (config: LinearAlgebraConfig) => Question
> = {
  'matrix-addition': generateMatrixAddition,

  'matrix-multiplication': generateMatrixMultiplication,

  'determinant-2x2': generateDeterminant,

  'linear-system-2x2': generateSystem2x2,

  'vector-linear-combination': generateLinearCombination,
};

export function generateLinearAlgebra(config: LinearAlgebraConfig): Question {
  if (config.forms.length === 0) {
    throw new Error('Не задано форм лінійної алгебри.');
  }

  return generatorsByForm[randomItem(config.forms)](config);
}
