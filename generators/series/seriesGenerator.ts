import type { SeriesConfig, SeriesForm } from '@/types/generator';

import type { Question, QuestionOption } from '@/types/question';

import { createNumericOptions } from '@/utils/createNumericOptions';

import {
  randomFromRange,
  randomItem,
  randomNonZeroFromRange,
} from '@/utils/random';

import { shuffle } from '@/utils/shuffle';

function generateFiniteArithmetic(config: SeriesConfig): Question {
  const a1 = randomFromRange(config.valueRange);

  const d = randomNonZeroFromRange(config.valueRange);

  const n = randomFromRange(config.nRange);

  const an = a1 + (n - 1) * d;

  const answer = (n * (a1 + an)) / 2;

  return {
    id: crypto.randomUUID(),

    generatorId: 'series',
    familyId: 'series',

    variantKey: `series:finite-arithmetic:${a1}:${d}:${n}`,

    topicId: 'series',

    type: 'single-choice',

    title: 'Сума арифметичного ряду',

    text: `a₁=${a1}, d=${d}, n=${n}. Знайдіть суму.`,

    options: createNumericOptions(answer, [
      n * a1,
      an,
      n * an,
      answer + n,
      answer - n,
    ]),

    correctAnswer: String(answer),

    solution: [
      {
        math: `a_n=a_1+(n-1)d=${an}`,
      },
      {
        math: `S_n=\\frac{n(a_1+a_n)}2=${answer}`,
      },
    ],
  };
}

function generateFiniteGeometric(config: SeriesConfig): Question {
  const b1 = randomNonZeroFromRange(config.valueRange);

  const q = randomItem([-3, -2, 2, 3]);

  const n = randomFromRange(config.nRange);

  const answer = (b1 * (q ** n - 1)) / (q - 1);

  return {
    id: crypto.randomUUID(),

    generatorId: 'series',

    familyId: 'series',

    variantKey: `series:finite-geometric:${b1}:${q}:${n}`,

    topicId: 'series',

    type: 'single-choice',

    title: 'Сума геометричного ряду',

    text: `b₁=${b1}, q=${q}, n=${n}.`,

    options: createNumericOptions(answer, [
      b1 * q ** n,
      b1 * n,
      q ** n,
      answer + q,
      answer - q,
    ]),

    correctAnswer: String(answer),

    solution: [
      {
        math: `S_n=b_1\\frac{q^n-1}{q-1}`,
      },
      {
        math: `S_n=${answer}`,
      },
    ],
  };
}

function generateInfiniteGeometric(config: SeriesConfig): Question {
  const b1 = randomNonZeroFromRange(config.valueRange);

  const q = randomItem([-0.5, -0.25, 0.25, 0.5]);

  const answer = Math.round((b1 / (1 - q)) * 1000) / 1000;

  return {
    id: crypto.randomUUID(),

    generatorId: 'series',

    familyId: 'series',

    variantKey: `series:infinite-geometric:${b1}:${q}`,

    topicId: 'series',

    type: 'single-choice',

    title: 'Нескінченний геометричний ряд',

    text: `b₁=${b1}, q=${q}. Знайдіть суму нескінченного ряду.`,

    options: createNumericOptions(answer, [
      b1 * (1 - q),
      b1 / q,
      b1 * q,
      answer + 1,
      answer - 1,
    ]),

    correctAnswer: String(answer),

    solution: [
      {
        math: '|q|<1',
      },
      {
        math: `S=\\frac{b_1}{1-q}`,
      },
      {
        math: `S=${answer}`,
      },
    ],
  };
}

function generateConvergenceGeometric(): Question {
  const q = randomItem([-2, -1.5, -0.75, -0.5, 0.25, 0.8, 1, 1.5, 2]);

  const converges = Math.abs(q) < 1;

  return {
    id: crypto.randomUUID(),

    generatorId: 'series',

    familyId: 'series',

    variantKey: `series:convergence:${q}`,

    topicId: 'series',

    type: 'single-choice',

    title: 'Збіжність геометричного ряду',

    text: `Геометричний ряд має знаменник q=${q}. Чи збігається він?`,

    options: [
      {
        id: 'yes',
        value: 'yes',
        text: 'Так',
      },
      {
        id: 'no',
        value: 'no',
        text: 'Ні',
      },
    ],

    correctAnswer: converges ? 'yes' : 'no',

    solution: [
      {
        math: '\\text{Ряд збігається тоді й лише тоді, коли }|q|<1.',
      },
      {
        text: converges ? 'Ряд збігається.' : 'Ряд не збігається.',
      },
    ],
  };
}

function generateTaylorBasic(): Question {
  const variant = randomItem([
    {
      name: 'e^x',
      correct: '1+x+x2/2',
      math: '1+x+\\frac{x^2}{2}+\\dots',
    },
    {
      name: 'sin(x)',
      correct: 'x-x3/6',
      math: 'x-\\frac{x^3}{6}+\\dots',
    },
    {
      name: 'cos(x)',
      correct: '1-x2/2',
      math: '1-\\frac{x^2}{2}+\\dots',
    },
  ]);

  const options: QuestionOption[] = shuffle([
    {
      value: variant.correct,
      math: variant.math,
    },
    {
      value: '1+x',
      math: '1+x',
    },
    {
      value: 'x+x2',
      math: 'x+x^2',
    },
    {
      value: '1-x',
      math: '1-x',
    },
  ])
    .filter(
      (option, index, array) =>
        array.findIndex((candidate) => candidate.value === option.value) ===
        index,
    )
    .map((option, index) => ({
      id: String(index),
      ...option,
    }));

  return {
    id: crypto.randomUUID(),

    generatorId: 'series',

    familyId: 'series',

    variantKey: `series:taylor:${variant.name}`,

    topicId: 'series',

    type: 'single-choice',

    title: 'Ряд Тейлора',

    text: `Оберіть початок розкладу ${variant.name} біля x=0.`,

    options,

    correctAnswer: variant.correct,

    solution: [
      {
        math: variant.math,
      },
    ],
  };
}

const generatorsByForm: Record<SeriesForm, (config: SeriesConfig) => Question> =
  {
    'finite-arithmetic-sum': generateFiniteArithmetic,

    'finite-geometric-sum': generateFiniteGeometric,

    'infinite-geometric-sum': generateInfiniteGeometric,

    'convergence-geometric': () => generateConvergenceGeometric(),

    'taylor-basic': () => generateTaylorBasic(),
  };

export function generateSeries(config: SeriesConfig): Question {
  if (config.forms.length === 0) {
    throw new Error('Не задано форм рядів.');
  }

  return generatorsByForm[randomItem(config.forms)](config);
}
