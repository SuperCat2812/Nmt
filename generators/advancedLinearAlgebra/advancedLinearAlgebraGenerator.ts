import type {
  AdvancedLinearAlgebraConfig,
  AdvancedLinearAlgebraForm,
} from '@/types/generator';

import type { Question, QuestionOption } from '@/types/question';

import { createNumericOptions } from '@/utils/createNumericOptions';

import {
  randomFromRange,
  randomItem,
  randomNonZeroFromRange,
} from '@/utils/random';

import { shuffle } from '@/utils/shuffle';

type Matrix3 = [
  [number, number, number],
  [number, number, number],
  [number, number, number],
];

function createStringOptions(
  correct: string,
  candidates: string[],
  render: (value: string) => string = (value) => value,
): QuestionOption[] {
  const unique = new Set<string>();

  for (const candidate of candidates) {
    if (candidate !== correct) {
      unique.add(candidate);
    }
  }

  let offset = 1;

  while (unique.size < 4) {
    unique.add(`${correct}:wrong:${offset}`);
    offset++;
  }

  return shuffle([correct, ...Array.from(unique).slice(0, 4)]).map(
    (value, index) => ({
      id: String(index),
      value,
      math: render(value),
    }),
  );
}

function determinant3x3(matrix: Matrix3): number {
  const [[a, b, c], [d, e, f], [g, h, i]] = matrix;

  return a * (e * i - f * h) - b * (d * i - f * g) + c * (d * h - e * g);
}

function generateDeterminant3x3(config: AdvancedLinearAlgebraConfig): Question {
  const matrix: Matrix3 = [
    [
      randomFromRange(config.valueRange),
      randomFromRange(config.valueRange),
      randomFromRange(config.valueRange),
    ],
    [
      randomFromRange(config.valueRange),
      randomFromRange(config.valueRange),
      randomFromRange(config.valueRange),
    ],
    [
      randomFromRange(config.valueRange),
      randomFromRange(config.valueRange),
      randomFromRange(config.valueRange),
    ],
  ];

  const answer = determinant3x3(matrix);

  const [[a, b, c], [d, e, f], [g, h, i]] = matrix;

  return {
    id: crypto.randomUUID(),

    generatorId: 'advanced-linear-algebra',
    familyId: 'linear-algebra',

    variantKey: `advanced-linear-algebra:det3:${matrix.flat().join(':')}`,

    topicId: 'advanced-linear-algebra',

    type: 'single-choice',

    title: 'Визначник матриці 3×3',

    math: `\\det
\\begin{pmatrix}
${a}&${b}&${c}\\\\
${d}&${e}&${f}\\\\
${g}&${h}&${i}
\\end{pmatrix}`,

    options: createNumericOptions(answer, [
      a * e * i,
      a + e + i,
      answer + 1,
      answer - 1,
      -answer,
    ]),

    correctAnswer: String(answer),

    solution: [
      {
        math: '\\det A=a(ei-fh)-b(di-fg)+c(dh-eg)',
      },
      {
        math: `\\det A=${answer}`,
      },
    ],
  };
}

function generateInverse2x2(config: AdvancedLinearAlgebraConfig): Question {
  let a = randomFromRange(config.valueRange);
  let b = randomFromRange(config.valueRange);
  let c = randomFromRange(config.valueRange);
  let d = randomFromRange(config.valueRange);

  let determinant = a * d - b * c;

  while (determinant === 0 || Math.abs(determinant) !== 1) {
    a = randomFromRange(config.valueRange);
    b = randomFromRange(config.valueRange);
    c = randomFromRange(config.valueRange);
    d = randomFromRange(config.valueRange);

    determinant = a * d - b * c;
  }

  const inverse = [
    d / determinant,
    -b / determinant,
    -c / determinant,
    a / determinant,
  ];

  const correct = inverse.join(';');

  const render = (value: string) => {
    if (value.includes(':wrong:')) {
      return '\\text{інший варіант}';
    }

    const values = value.split(';');

    return `\\begin{pmatrix}
${values[0]}&${values[1]}\\\\
${values[2]}&${values[3]}
\\end{pmatrix}`;
  };

  return {
    id: crypto.randomUUID(),

    generatorId: 'advanced-linear-algebra',
    familyId: 'linear-algebra',

    variantKey: `advanced-linear-algebra:inverse:${a}:${b}:${c}:${d}`,

    topicId: 'advanced-linear-algebra',

    type: 'single-choice',

    title: 'Обернена матриця',

    math: `A=
\\begin{pmatrix}
${a}&${b}\\\\
${c}&${d}
\\end{pmatrix}`,

    options: createStringOptions(
      correct,
      [
        [a, -b, -c, d].join(';'),

        [d, b, c, a].join(';'),

        [d, -c, -b, a].join(';'),

        [-d, b, c, -a].join(';'),
      ],
      render,
    ),

    correctAnswer: correct,

    solution: [
      {
        math: `\\det A=${a}\\cdot${d}-${b}\\cdot${c}=${determinant}`,
      },
      {
        math: 'A^{-1}=\\frac1{\\det A}\\begin{pmatrix}d&-b\\\\-c&a\\end{pmatrix}',
      },
      {
        math: render(correct),
      },
    ],
  };
}

function generateRankBasic(config: AdvancedLinearAlgebraConfig): Question {
  const a = randomNonZeroFromRange(config.valueRange);

  const b = randomFromRange(config.valueRange);

  const multiplier = randomItem([-3, -2, 2, 3]);

  const dependent = Math.random() >= 0.5;

  const c = dependent
    ? a * multiplier
    : randomNonZeroFromRange(config.valueRange);

  let d = dependent ? b * multiplier : randomFromRange(config.valueRange);

  if (!dependent) {
    while (a * d - b * c === 0) {
      d = randomFromRange(config.valueRange);
    }
  }

  const answer = dependent ? 1 : 2;

  return {
    id: crypto.randomUUID(),

    generatorId: 'advanced-linear-algebra',
    familyId: 'linear-algebra',

    variantKey: `advanced-linear-algebra:rank:${a}:${b}:${c}:${d}`,

    topicId: 'advanced-linear-algebra',

    type: 'single-choice',

    title: 'Ранг матриці',

    math: `A=
\\begin{pmatrix}
${a}&${b}\\\\
${c}&${d}
\\end{pmatrix}`,

    options: createNumericOptions(answer, [0, 1, 2, 3, answer + 1]),

    correctAnswer: String(answer),

    solution: [
      {
        text: dependent
          ? 'Другий рядок лінійно залежний від першого.'
          : 'Визначник матриці ненульовий.',
      },
      {
        math: `\\operatorname{rank}A=${answer}`,
      },
    ],
  };
}

function generateEigenvaluesDiagonal(
  config: AdvancedLinearAlgebraConfig,
): Question {
  const lambda1 = randomFromRange(config.valueRange);

  let lambda2 = randomFromRange(config.valueRange);

  while (lambda1 === lambda2) {
    lambda2 = randomFromRange(config.valueRange);
  }

  const sorted = [Math.min(lambda1, lambda2), Math.max(lambda1, lambda2)];

  const answer = sorted.join(';');

  const render = (value: string) => {
    const [first, second] = value.split(';');

    return `\\lambda_1=${first},\\;\\lambda_2=${second}`;
  };

  return {
    id: crypto.randomUUID(),

    generatorId: 'advanced-linear-algebra',

    familyId: 'linear-algebra',

    variantKey: `advanced-linear-algebra:eigenvalues:${lambda1}:${lambda2}`,

    topicId: 'advanced-linear-algebra',

    type: 'single-choice',

    title: 'Власні значення',

    math: `A=
\\begin{pmatrix}
${lambda1}&0\\\\
0&${lambda2}
\\end{pmatrix}`,

    options: createStringOptions(
      answer,
      [
        `${lambda1 + 1};${lambda2}`,
        `${lambda1};${lambda2 + 1}`,
        `${-lambda1};${lambda2}`,
        `${lambda1};${-lambda2}`,
      ],
      render,
    ),

    correctAnswer: answer,

    solution: [
      {
        text: 'Для діагональної матриці власні значення — її діагональні елементи.',
      },
      {
        math: render(answer),
      },
    ],
  };
}

function generateEigenvectorDiagonal(
  config: AdvancedLinearAlgebraConfig,
): Question {
  const lambda1 = randomFromRange(config.valueRange);

  let lambda2 = randomFromRange(config.valueRange);

  while (lambda1 === lambda2) {
    lambda2 = randomFromRange(config.valueRange);
  }

  const chooseFirst = Math.random() >= 0.5;

  const lambda = chooseFirst ? lambda1 : lambda2;

  const answer = chooseFirst ? '1;0' : '0;1';

  const options = createStringOptions(
    answer,
    ['1;1', '-1;0', '0;-1', chooseFirst ? '0;1' : '1;0'],
    (value) => {
      if (value.includes(':wrong:')) {
        return '\\text{інший вектор}';
      }

      const [x, y] = value.split(';');

      return `\\begin{pmatrix}${x}\\\\${y}\\end{pmatrix}`;
    },
  );

  return {
    id: crypto.randomUUID(),

    generatorId: 'advanced-linear-algebra',

    familyId: 'linear-algebra',

    variantKey: `advanced-linear-algebra:eigenvector:${lambda1}:${lambda2}:${lambda}`,

    topicId: 'advanced-linear-algebra',

    type: 'single-choice',

    title: 'Власний вектор',

    text: `Оберіть власний вектор для λ = ${lambda}.`,

    math: `A=
\\begin{pmatrix}
${lambda1}&0\\\\
0&${lambda2}
\\end{pmatrix}`,

    options,

    correctAnswer: answer,

    solution: [
      {
        math: 'A\\vec v=\\lambda\\vec v',
      },
      {
        math: chooseFirst ? '\\vec v=(1;0)' : '\\vec v=(0;1)',
      },
    ],
  };
}

const generatorsByForm: Record<
  AdvancedLinearAlgebraForm,
  (config: AdvancedLinearAlgebraConfig) => Question
> = {
  'determinant-3x3': generateDeterminant3x3,

  'inverse-2x2': generateInverse2x2,

  'rank-basic': generateRankBasic,

  'eigenvalues-diagonal': generateEigenvaluesDiagonal,

  'eigenvector-diagonal': generateEigenvectorDiagonal,
};

export function generateAdvancedLinearAlgebra(
  config: AdvancedLinearAlgebraConfig,
): Question {
  if (config.forms.length === 0) {
    throw new Error('Не задано форм поглибленої лінійної алгебри.');
  }

  return generatorsByForm[randomItem(config.forms)](config);
}
