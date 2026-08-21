import type { ExpressionConfig, ExpressionForm } from '@/types/generator';

import type { Question, QuestionOption } from '@/types/question';

import {
  formatLinearExpression,
  formatLinearTerm,
  formatSignedTerm,
} from '@/utils/algebra';

import {
  randomFromRange,
  randomItem,
  randomNonZeroFromRange,
} from '@/utils/random';

import { shuffle } from '@/utils/shuffle';

function createMathOptions(
  correctValue: string,
  correctMath: string,
  candidates: Array<{
    value: string;
    math: string;
  }>,
): QuestionOption[] {
  const unique = new Map<
    string,
    {
      value: string;
      math: string;
    }
  >();

  for (const candidate of candidates) {
    if (candidate.value !== correctValue) {
      unique.set(candidate.value, candidate);
    }

    if (unique.size >= 3) {
      break;
    }
  }

  let fallbackIndex = 1;

  while (unique.size < 3) {
    const value = `${correctValue}__wrong_${fallbackIndex}`;

    unique.set(value, {
      value,
      math: `${correctMath}+${fallbackIndex}`,
    });

    fallbackIndex++;
  }

  const options = [
    {
      value: correctValue,
      math: correctMath,
    },

    ...Array.from(unique.values()).slice(0, 3),
  ];

  return shuffle(options).map((option, index) => ({
    id: String(index),

    value: option.value,

    math: option.math,
  }));
}

function formatNumericSum(first: number, second: number): string {
  if (second >= 0) {
    return `${first}+${second}`;
  }

  return `${first}-${Math.abs(second)}`;
}

// ========================================
// a(x + b)
// ========================================

function generateExpandBrackets(config: ExpressionConfig): Question {
  const a = randomNonZeroFromRange(config.coefficientRange);

  const b = randomNonZeroFromRange(config.constantRange);

  const constant = a * b;

  const answer = formatLinearExpression(a, constant);

  const inside = b > 0 ? `x + ${b}` : `x - ${Math.abs(b)}`;

  const options = createMathOptions(answer, answer, [
    {
      value: formatLinearExpression(a, b),

      math: formatLinearExpression(a, b),
    },

    {
      value: formatLinearExpression(1, constant),

      math: formatLinearExpression(1, constant),
    },

    {
      value: formatLinearExpression(a, constant + a),

      math: formatLinearExpression(a, constant + a),
    },

    {
      value: formatLinearExpression(-a, constant),

      math: formatLinearExpression(-a, constant),
    },
  ]);

  return {
    id: crypto.randomUUID(),

    generatorId: 'expressions',

    familyId: 'expressions',

    variantKey: `expression:expand:${a}:${b}`,

    topicId: 'expressions',

    type: 'single-choice',

    title: 'Розкриття дужок',

    math: `${a}\\left(${inside}\\right)`,

    options,

    correctAnswer: answer,

    solution: [
      {
        text: 'Помножимо кожний доданок у дужках на множник перед дужками.',
      },

      {
        math:
          `${a}\\cdot x` +
          `${b >= 0 ? '+' : '-'}` +
          `${Math.abs(a)}\\cdot${Math.abs(b)}`,
      },

      {
        math: `=${answer}`,
      },
    ],
  };
}

// ========================================
// ax + b + cx + d
// ========================================

function generateCombineLikeTerms(config: ExpressionConfig): Question {
  const a = randomNonZeroFromRange(config.coefficientRange);

  const c = randomNonZeroFromRange(config.coefficientRange);

  const b = randomFromRange(config.constantRange);

  const d = randomFromRange(config.constantRange);

  const resultA = a + c;

  const resultB = b + d;

  const answer = formatLinearExpression(resultA, resultB);

  const expression =
    `${formatLinearTerm(a)}` +
    `${formatSignedTerm(b)}` +
    `${formatSignedTerm(c, 'x')}` +
    `${formatSignedTerm(d)}`;

  const options = createMathOptions(answer, answer, [
    {
      value: formatLinearExpression(a - c, resultB),

      math: formatLinearExpression(a - c, resultB),
    },

    {
      value: formatLinearExpression(resultA, b - d),

      math: formatLinearExpression(resultA, b - d),
    },

    {
      value: formatLinearExpression(a * c, resultB),

      math: formatLinearExpression(a * c, resultB),
    },

    {
      value: formatLinearExpression(resultA + 1, resultB),

      math: formatLinearExpression(resultA + 1, resultB),
    },
  ]);

  return {
    id: crypto.randomUUID(),

    generatorId: 'expressions',

    familyId: 'expressions',

    variantKey: `expression:combine:${a}:${b}:${c}:${d}`,

    topicId: 'expressions',

    type: 'single-choice',

    title: 'Зведення подібних доданків',

    math: expression,

    options,

    correctAnswer: answer,

    solution: [
      {
        text: 'Додамо коефіцієнти при x та окремо сталі числа.',
      },

      {
        math: `(${formatNumericSum(a, c)})x` + `+(${formatNumericSum(b, d)})`,
      },

      {
        math: `=${answer}`,
      },
    ],
  };
}

// ========================================
// ga*x + gb
// ========================================

function generateFactorCommon(config: ExpressionConfig): Question {
  const common = randomItem([2, 3, 4, 5, 6]);

  const a = randomNonZeroFromRange(config.coefficientRange);

  const b = randomNonZeroFromRange(config.constantRange);

  const ax = common * a;

  const constant = common * b;

  const inside = formatLinearExpression(a, b);

  const answer = `${common}(${inside})`;

  const source = formatLinearExpression(ax, constant);

  const options = createMathOptions(
    answer,
    `${common}\\left(${inside}\\right)`,
    [
      {
        value: `${common + 1}(${inside})`,

        math: `${common + 1}\\left(${inside}\\right)`,
      },

      {
        value: `${common}(${formatLinearExpression(a, b + 1)})`,

        math: `${common}\\left(${formatLinearExpression(a, b + 1)}\\right)`,
      },

      {
        value: `${a}(${formatLinearExpression(common, b)})`,

        math: `${a}\\left(${formatLinearExpression(common, b)}\\right)`,
      },

      {
        value: `${common}(${formatLinearExpression(-a, b)})`,

        math: `${common}\\left(${formatLinearExpression(-a, b)}\\right)`,
      },
    ],
  );

  return {
    id: crypto.randomUUID(),

    generatorId: 'expressions',

    familyId: 'expressions',

    variantKey: `expression:factor:${common}:${a}:${b}`,

    topicId: 'expressions',

    type: 'single-choice',

    title: 'Винесення спільного множника',

    text: 'Винесіть спільний множник за дужки.',

    math: source,

    options,

    correctAnswer: answer,

    solution: [
      {
        text: `Спільний множник дорівнює ${common}.`,
      },

      {
        math: `${source}=${common}\\left(${inside}\\right)`,
      },
    ],
  };
}

// ========================================
// x² - a²
// ========================================

function generateDifferenceSquares(): Question {
  const a = randomItem([2, 3, 4, 5, 6, 7, 8, 9]);

  const square = a ** 2;

  const answer = `(x-${a})(x+${a})`;

  const options = createMathOptions(answer, `(x-${a})(x+${a})`, [
    {
      value: `(x-${a})(x-${a})`,

      math: `(x-${a})^2`,
    },

    {
      value: `(x+${a})(x+${a})`,

      math: `(x+${a})^2`,
    },

    {
      value: `(x-${square})(x+${square})`,

      math: `(x-${square})(x+${square})`,
    },

    {
      value: `x(x-${square})`,

      math: `x(x-${square})`,
    },
  ]);

  return {
    id: crypto.randomUUID(),

    generatorId: 'expressions',

    familyId: 'expressions',

    variantKey: `expression:difference-squares:${a}`,

    topicId: 'expressions',

    type: 'single-choice',

    title: 'Різниця квадратів',

    math: `x^2-${square}`,

    options,

    correctAnswer: answer,

    solution: [
      {
        math: `a^2-b^2=(a-b)(a+b)`,
      },

      {
        math: `x^2-${a}^2=(x-${a})(x+${a})`,
      },
    ],
  };
}

const generatorsByForm: Record<
  ExpressionForm,
  (config: ExpressionConfig) => Question
> = {
  'expand-brackets': generateExpandBrackets,

  'combine-like-terms': generateCombineLikeTerms,

  'factor-common': generateFactorCommon,

  'difference-of-squares': () => generateDifferenceSquares(),
};

export function generateExpression(config: ExpressionConfig): Question {
  if (config.forms.length === 0) {
    throw new Error('Не задано жодної форми алгебраїчних виразів.');
  }

  const form = randomItem(config.forms);

  return generatorsByForm[form](config);
}
