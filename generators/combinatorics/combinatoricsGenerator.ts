import type { CombinatoricsConfig, CombinatoricsForm } from '@/types/generator';

import type { Question } from '@/types/question';

import { arrangements, combinations, factorial } from '@/utils/combinatorics';

import { createNumericOptions } from '@/utils/createNumericOptions';

import { randomFromRange, randomItem } from '@/utils/random';

function generatePermutation(config: CombinatoricsConfig): Question {
  const n = Math.min(8, Math.max(2, randomFromRange(config.nRange)));

  const answer = factorial(n);

  return {
    id: crypto.randomUUID(),

    generatorId: 'combinatorics',

    familyId: 'combinatorics',

    variantKey: `combinatorics:permutation:${n}`,

    topicId: 'combinatorics',

    type: 'single-choice',

    title: 'Перестановки',

    text: `Скількома способами можна розташувати ${n} різних об’єктів у ряд?`,

    options: createNumericOptions(answer, [
      n ** 2,
      n * (n - 1),
      factorial(n - 1),
      answer + n,
      answer - n,
    ]),

    correctAnswer: String(answer),

    solution: [
      {
        math: `P_n=n!`,
      },
      {
        math: `P_${n}=${n}!=${answer}`,
      },
    ],
  };
}

function generateCombination(config: CombinatoricsConfig): Question {
  const n = Math.max(4, randomFromRange(config.nRange));

  const k = randomItem([2, 3].filter((value) => value <= n));

  const answer = combinations(n, k);

  return {
    id: crypto.randomUUID(),

    generatorId: 'combinatorics',

    familyId: 'combinatorics',

    variantKey: `combinatorics:combination:${n}:${k}`,

    topicId: 'combinatorics',

    type: 'single-choice',

    title: 'Комбінації',

    text: `Скількома способами можна вибрати ${k} об’єкти з ${n}, якщо порядок не має значення?`,

    options: createNumericOptions(answer, [
      arrangements(n, k),

      factorial(k),

      n * k,

      answer + n,

      answer - 1,
    ]),

    correctAnswer: String(answer),

    solution: [
      {
        math: `C_n^k=\\frac{n!}{k!(n-k)!}`,
      },
      {
        math: `C_${n}^{${k}}=${answer}`,
      },
    ],
  };
}

function generateArrangement(config: CombinatoricsConfig): Question {
  const n = Math.max(4, randomFromRange(config.nRange));

  const k = randomItem([2, 3].filter((value) => value <= n));

  const answer = arrangements(n, k);

  return {
    id: crypto.randomUUID(),

    generatorId: 'combinatorics',

    familyId: 'combinatorics',

    variantKey: `combinatorics:arrangement:${n}:${k}`,

    topicId: 'combinatorics',

    type: 'single-choice',

    title: 'Розміщення',

    text: `Скільки впорядкованих вибірок по ${k} елементи можна утворити з ${n} різних елементів?`,

    options: createNumericOptions(answer, [
      combinations(n, k),

      factorial(k),

      n ** k,

      answer + n,

      answer - n,
    ]),

    correctAnswer: String(answer),

    solution: [
      {
        math: `A_n^k=\\frac{n!}{(n-k)!}`,
      },
      {
        math: `A_${n}^{${k}}=${answer}`,
      },
    ],
  };
}

const generatorsByForm: Record<
  CombinatoricsForm,
  (config: CombinatoricsConfig) => Question
> = {
  permutation: generatePermutation,

  combination: generateCombination,

  arrangement: generateArrangement,
};

export function generateCombinatorics(config: CombinatoricsConfig): Question {
  if (config.forms.length === 0) {
    throw new Error('Не задано форм комбинаторики.');
  }

  return generatorsByForm[randomItem(config.forms)](config);
}
