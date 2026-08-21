import type { SequenceConfig, SequenceForm } from '@/types/generator';

import type { Question } from '@/types/question';

import { createNumericOptions } from '@/utils/createNumericOptions';

import {
  randomFromRange,
  randomItem,
  randomNonZeroFromRange,
} from '@/utils/random';

function formatAddition(first: number, second: number): string {
  if (second >= 0) {
    return `${first}+${second}`;
  }

  return `${first}-${Math.abs(second)}`;
}

function formatMultiplication(first: number, second: number): string {
  return `${first}\\cdot(${second})`;
}

// ========================================
// Arithmetic next
// ========================================

function generateArithmeticNext(config: SequenceConfig): Question {
  const a1 = randomFromRange(config.startRange);

  const d = randomNonZeroFromRange(config.differenceRange);

  const a2 = a1 + d;

  const a3 = a2 + d;

  const answer = a3 + d;

  return {
    id: crypto.randomUUID(),

    generatorId: 'sequence',

    familyId: 'sequences',

    variantKey: `sequence:arithmetic-next:${a1}:${d}`,

    topicId: 'sequences',

    type: 'single-choice',

    title: 'Арифметична прогресія',

    text: `Продовжіть послідовність: ` + `${a1}, ${a2}, ${a3}, ...`,

    options: createNumericOptions(answer, [
      a3 - d,

      a3 + 2 * d,

      a1 + d,

      answer + 1,

      answer - 1,
    ]),

    correctAnswer: String(answer),

    solution: [
      {
        math: `d=${a2}-(${a1})=${d}`,
      },

      {
        math: `a_4=${formatAddition(a3, d)}=${answer}`,
      },
    ],
  };
}

// ========================================
// Arithmetic nth
// ========================================

function generateArithmeticNth(config: SequenceConfig): Question {
  const a1 = randomFromRange(config.startRange);

  const d = randomNonZeroFromRange(config.differenceRange);

  const n = randomFromRange(config.nRange);

  const answer = a1 + (n - 1) * d;

  return {
    id: crypto.randomUUID(),

    generatorId: 'sequence',

    familyId: 'sequences',

    variantKey: `sequence:arithmetic-nth:${a1}:${d}:${n}`,

    topicId: 'sequences',

    type: 'single-choice',

    title: 'n-й член арифметичної прогресії',

    text: `Дано a₁ = ${a1}, d = ${d}. ` + `Знайдіть a${n}.`,

    options: createNumericOptions(answer, [
      a1 + n * d,

      a1 + (n - 2) * d,

      n * d,

      answer + d,

      answer - d,
    ]),

    correctAnswer: String(answer),

    solution: [
      {
        math: `a_n=a_1+(n-1)d`,
      },

      {
        math: `a_${n}=${a1}+` + `(${n}-1)\\cdot(${d})=${answer}`,
      },
    ],
  };
}

// ========================================
// Arithmetic sum
// ========================================

function generateArithmeticSum(config: SequenceConfig): Question {
  const a1 = randomFromRange(config.startRange);

  const d = randomNonZeroFromRange(config.differenceRange);

  const n = randomFromRange(config.nRange);

  const an = a1 + (n - 1) * d;

  const answer = (n * (a1 + an)) / 2;

  const endpoints = formatAddition(a1, an);

  return {
    id: crypto.randomUUID(),

    generatorId: 'sequence',

    familyId: 'sequences',

    variantKey: `sequence:arithmetic-sum:${a1}:${d}:${n}`,

    topicId: 'sequences',

    type: 'single-choice',

    title: 'Сума арифметичної прогресії',

    text: `Дано a₁ = ${a1}, d = ${d}, ` + `n = ${n}. Знайдіть Sₙ.`,

    options: createNumericOptions(answer, [
      n * a1,

      a1 + an,

      answer + n,

      answer - n,

      an * n,
    ]),

    correctAnswer: String(answer),

    solution: [
      {
        math: `a_n=a_1+(n-1)d=${an}`,
      },

      {
        math: `S_n=\\frac{n(a_1+a_n)}{2}`,
      },

      {
        math: `S_${n}=\\frac{${n}(${endpoints})}{2}=${answer}`,
      },
    ],
  };
}

// ========================================
// Geometric next
// ========================================

function generateGeometricNext(config: SequenceConfig): Question {
  const b1 = randomNonZeroFromRange(config.startRange);

  const q = randomNonZeroFromRange(config.ratioRange);

  const b2 = b1 * q;

  const b3 = b2 * q;

  const answer = b3 * q;

  return {
    id: crypto.randomUUID(),

    generatorId: 'sequence',

    familyId: 'sequences',

    variantKey: `sequence:geometric-next:${b1}:${q}`,

    topicId: 'sequences',

    type: 'single-choice',

    title: 'Геометрична прогресія',

    text: `Продовжіть послідовність: ` + `${b1}, ${b2}, ${b3}, ...`,

    options: createNumericOptions(answer, [
      b3 + q,

      b3 - q,

      b1 * q,

      answer + q,

      answer - q,
    ]),

    correctAnswer: String(answer),

    solution: [
      {
        math: `q=\\frac{b_2}{b_1}=${q}`,
      },

      {
        math: `b_4=${formatMultiplication(b3, q)}=${answer}`,
      },
    ],
  };
}

// ========================================
// Geometric nth
// ========================================

function generateGeometricNth(config: SequenceConfig): Question {
  const b1 = randomNonZeroFromRange(config.startRange);

  let q = randomNonZeroFromRange(config.ratioRange);

  while (Math.abs(q) === 1) {
    q = randomNonZeroFromRange(config.ratioRange);
  }

  const n = randomFromRange(config.nRange);

  const answer = b1 * q ** (n - 1);

  return {
    id: crypto.randomUUID(),

    generatorId: 'sequence',

    familyId: 'sequences',

    variantKey: `sequence:geometric-nth:${b1}:${q}:${n}`,

    topicId: 'sequences',

    type: 'single-choice',

    title: 'n-й член геометричної прогресії',

    text: `Дано b₁ = ${b1}, q = ${q}. ` + `Знайдіть b${n}.`,

    options: createNumericOptions(answer, [
      b1 * q ** n,

      b1 * (n - 1) * q,

      q ** (n - 1),

      answer + q,

      answer - q,
    ]),

    correctAnswer: String(answer),

    solution: [
      {
        math: `b_n=b_1q^{n-1}`,
      },

      {
        math: `b_${n}=${b1}\\cdot(${q})^{${n - 1}}=${answer}`,
      },
    ],
  };
}

// ========================================
// Geometric sum
// ========================================

function generateGeometricSum(config: SequenceConfig): Question {
  const b1 = randomNonZeroFromRange(config.startRange);

  let q = randomNonZeroFromRange(config.ratioRange);

  while (q === 1 || q === -1) {
    q = randomNonZeroFromRange(config.ratioRange);
  }

  const n = randomFromRange(config.nRange);

  const answer = (b1 * (q ** n - 1)) / (q - 1);

  const qMinusOne = q >= 1 ? `${q}-1` : `(${q})-1`;

  return {
    id: crypto.randomUUID(),

    generatorId: 'sequence',

    familyId: 'sequences',

    variantKey: `sequence:geometric-sum:${b1}:${q}:${n}`,

    topicId: 'sequences',

    type: 'single-choice',

    title: 'Сума геометричної прогресії',

    text: `Дано b₁ = ${b1}, q = ${q}, ` + `n = ${n}. Знайдіть Sₙ.`,

    options: createNumericOptions(answer, [
      b1 * q ** n,

      b1 * n,

      answer + q,

      answer - q,

      q ** n,
    ]),

    correctAnswer: String(answer),

    solution: [
      {
        math: `S_n=b_1\\frac{q^n-1}{q-1}`,
      },

      {
        math:
          `S_${n}=${b1}\\cdot` +
          `\\frac{(${q})^{${n}}-1}{${qMinusOne}}=${answer}`,
      },
    ],
  };
}

const generatorsByForm: Record<
  SequenceForm,
  (config: SequenceConfig) => Question
> = {
  'arithmetic-next': generateArithmeticNext,

  'arithmetic-nth': generateArithmeticNth,

  'arithmetic-sum': generateArithmeticSum,

  'geometric-next': generateGeometricNext,

  'geometric-nth': generateGeometricNth,

  'geometric-sum': generateGeometricSum,
};

export function generateSequence(config: SequenceConfig): Question {
  if (config.forms.length === 0) {
    throw new Error('Не задано форм послідовностей.');
  }

  const form = randomItem(config.forms);

  return generatorsByForm[form](config);
}
