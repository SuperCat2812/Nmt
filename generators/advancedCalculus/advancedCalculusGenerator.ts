import type {
  AdvancedCalculusConfig,
  AdvancedCalculusForm,
} from '@/types/generator';

import type { Question, QuestionOption } from '@/types/question';

import { createNumericOptions } from '@/utils/createNumericOptions';

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
  }

  let offset = 1;

  while (unique.size < 3) {
    const value = `${correctValue}:wrong:${offset}`;

    unique.set(value, {
      value,
      math: `\\left(${correctMath}\\right)+${offset}`,
    });

    offset++;
  }

  return shuffle([
    {
      value: correctValue,
      math: correctMath,
    },

    ...Array.from(unique.values()).slice(0, 3),
  ]).map((option, index) => ({
    id: String(index),
    value: option.value,
    math: option.math,
  }));
}

// ========================================
// LIMIT VIA FACTORIZATION
// lim (x²-a²)/(x-a)
// ========================================

function generateLimitFactorization(config: AdvancedCalculusConfig): Question {
  const a = randomNonZeroFromRange(config.xRange);

  const answer = 2 * a;

  return {
    id: crypto.randomUUID(),

    generatorId: 'advanced-calculus',

    familyId: 'calculus',

    variantKey: `advanced-calculus:limit-factorization:${a}`,

    topicId: 'advanced-calculus',

    type: 'single-choice',

    title: 'Границя з невизначеністю 0/0',

    math: `\\lim_{x\\to ${a}}\\frac{x^2-${a ** 2}}{x-${a}}`,

    options: createNumericOptions(answer, [
      a,
      a ** 2,
      -a,
      answer + 1,
      answer - 1,
    ]),

    correctAnswer: String(answer),

    solution: [
      {
        math: `x^2-${a ** 2}=(x-${a})(x+${a})`,
      },
      {
        math: `\\frac{(x-${a})(x+${a})}{x-${a}}=x+${a}`,
      },
      {
        math: `\\lim_{x\\to ${a}}(x+${a})=${answer}`,
      },
    ],
  };
}

// ========================================
// CHAIN RULE
// f(x)=(ax+b)^n
// ========================================

function generateChainRule(config: AdvancedCalculusConfig): Question {
  const a = randomNonZeroFromRange(config.coefficientRange);

  const b = randomFromRange(config.coefficientRange);

  const n = Math.max(2, randomFromRange(config.powerRange));

  const coefficient = n * a;

  const correctValue = `${coefficient}:${a}:${b}:${n - 1}`;

  const correctMath = `${coefficient}(${a}x${b >= 0 ? '+' : ''}${b})^{${n - 1}}`;

  return {
    id: crypto.randomUUID(),

    generatorId: 'advanced-calculus',

    familyId: 'calculus',

    variantKey: `advanced-calculus:chain:${a}:${b}:${n}`,

    topicId: 'advanced-calculus',

    type: 'single-choice',

    title: 'Правило ланцюга',

    text: 'Знайдіть похідну.',

    math: `f(x)=(${a}x${b >= 0 ? '+' : ''}${b})^{${n}}`,

    options: createMathOptions(correctValue, correctMath, [
      {
        value: `${n}:${a}:${b}:${n - 1}`,

        math: `${n}(${a}x${b >= 0 ? '+' : ''}${b})^{${n - 1}}`,
      },

      {
        value: `${coefficient}:${a}:${b}:${n}`,

        math: `${coefficient}(${a}x${b >= 0 ? '+' : ''}${b})^{${n}}`,
      },

      {
        value: `${a}:${a}:${b}:${n - 1}`,

        math: `${a}(${a}x${b >= 0 ? '+' : ''}${b})^{${n - 1}}`,
      },

      {
        value: `${coefficient + 1}:${a}:${b}:${n - 1}`,

        math: `${coefficient + 1}(${a}x${b >= 0 ? '+' : ''}${b})^{${n - 1}}`,
      },
    ]),

    correctAnswer: correctValue,

    solution: [
      {
        math: `(u^n)'=nu^{n-1}u'`,
      },
      {
        math: `u=${a}x${b >= 0 ? '+' : ''}${b},\\quad u'=${a}`,
      },
      {
        math: `f'(x)=${correctMath}`,
      },
    ],
  };
}

// ========================================
// PRODUCT RULE
// (ax+b)(cx+d)
// ========================================

function generateProductRule(config: AdvancedCalculusConfig): Question {
  const a = randomNonZeroFromRange(config.coefficientRange);

  const b = randomFromRange(config.coefficientRange);

  const c = randomNonZeroFromRange(config.coefficientRange);

  const d = randomFromRange(config.coefficientRange);

  const quadraticCoefficient = 2 * a * c;

  const constant = a * d + b * c;

  const correctValue = `${quadraticCoefficient};${constant}`;

  const correctMath = `${quadraticCoefficient}x${constant >= 0 ? '+' : ''}${constant}`;

  return {
    id: crypto.randomUUID(),

    generatorId: 'advanced-calculus',

    familyId: 'calculus',

    variantKey: `advanced-calculus:product:${a}:${b}:${c}:${d}`,

    topicId: 'advanced-calculus',

    type: 'single-choice',

    title: 'Похідна добутку',

    math: `f(x)=(${a}x${b >= 0 ? '+' : ''}${b})(${c}x${d >= 0 ? '+' : ''}${d})`,

    options: createMathOptions(correctValue, correctMath, [
      {
        value: `${a * c};${constant}`,

        math: `${a * c}x${constant >= 0 ? '+' : ''}${constant}`,
      },

      {
        value: `${quadraticCoefficient};${b * d}`,

        math: `${quadraticCoefficient}x${b * d >= 0 ? '+' : ''}${b * d}`,
      },

      {
        value: `${a + c};${b + d}`,

        math: `${a + c}x${b + d >= 0 ? '+' : ''}${b + d}`,
      },

      {
        value: `${quadraticCoefficient + 1};${constant}`,

        math: `${quadraticCoefficient + 1}x${constant >= 0 ? '+' : ''}${constant}`,
      },
    ]),

    correctAnswer: correctValue,

    solution: [
      {
        math: `(uv)'=u'v+uv'`,
      },
      {
        math: `f'(x)=${correctMath}`,
      },
    ],
  };
}

// ========================================
// QUOTIENT RULE
// f(x)=(ax+b)/(cx+d)
// ========================================

function generateQuotientRule(config: AdvancedCalculusConfig): Question {
  const a = randomNonZeroFromRange(config.coefficientRange);

  const b = randomFromRange(config.coefficientRange);

  const c = randomNonZeroFromRange(config.coefficientRange);

  const d = randomFromRange(config.coefficientRange);

  const numerator = a * d - b * c;

  const correctValue = `${numerator}:${c}:${d}`;

  const correctMath = `\\frac{${numerator}}{(${c}x${d >= 0 ? '+' : ''}${d})^2}`;

  return {
    id: crypto.randomUUID(),

    generatorId: 'advanced-calculus',

    familyId: 'calculus',

    variantKey: `advanced-calculus:quotient:${a}:${b}:${c}:${d}`,

    topicId: 'advanced-calculus',

    type: 'single-choice',

    title: 'Похідна частки',

    math: `f(x)=\\frac{${a}x${b >= 0 ? '+' : ''}${b}}{${c}x${d >= 0 ? '+' : ''}${d}}`,

    options: createMathOptions(correctValue, correctMath, [
      {
        value: `${a * d + b * c}:${c}:${d}`,

        math: `\\frac{${a * d + b * c}}{(${c}x${d >= 0 ? '+' : ''}${d})^2}`,
      },

      {
        value: `${a - c}:${c}:${d}`,

        math: `\\frac{${a - c}}{(${c}x${d >= 0 ? '+' : ''}${d})^2}`,
      },

      {
        value: `${numerator}:${c}:${d}:no-square`,

        math: `\\frac{${numerator}}{${c}x${d >= 0 ? '+' : ''}${d}}`,
      },

      {
        value: `${-numerator}:${c}:${d}`,

        math: `\\frac{${-numerator}}{(${c}x${d >= 0 ? '+' : ''}${d})^2}`,
      },
    ]),

    correctAnswer: correctValue,

    solution: [
      {
        math: `\\left(\\frac{u}{v}\\right)'=\\frac{u'v-uv'}{v^2}`,
      },
      {
        math: `f'(x)=${correctMath}`,
      },
    ],
  };
}

// ========================================
// EXTREMUM OF QUADRATIC
// f(x)=a(x-h)^2+k
// ========================================

function generateQuadraticExtremum(config: AdvancedCalculusConfig): Question {
  const a = randomNonZeroFromRange(config.coefficientRange);

  const h = randomFromRange(config.xRange);

  const k = randomFromRange(config.coefficientRange);

  const answer = `${h};${k}`;

  const extremumType = a > 0 ? 'мінімум' : 'максимум';

  const options = shuffle([
    answer,
    `${-h};${k}`,
    `${h};${-k}`,
    `${k};${h}`,
    `${h + 1};${k}`,
  ]);

  const unique = Array.from(new Set(options));

  let offset = 1;

  while (unique.length < 5) {
    const value = `${h + offset};${k + offset}`;

    if (value !== answer && !unique.includes(value)) {
      unique.push(value);
    }

    offset++;
  }

  const inside = h >= 0 ? `x-${h}` : `x+${Math.abs(h)}`;

  return {
    id: crypto.randomUUID(),

    generatorId: 'advanced-calculus',

    familyId: 'calculus',

    variantKey: `advanced-calculus:extremum:${a}:${h}:${k}`,

    topicId: 'advanced-calculus',

    type: 'single-choice',

    title: 'Екстремум функції',

    text: `Знайдіть точку, у якій функція має ${extremumType}.`,

    math: `f(x)=${a}(${inside})^2${k >= 0 ? '+' : ''}${k}`,

    options: unique.slice(0, 5).map((value, index) => {
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
        text: 'Функція вже записана у вершинній формі.',
      },
      {
        math: `f(x)=a(x-h)^2+k`,
      },
      {
        math: `(${h};${k})`,
      },
    ],
  };
}

// ========================================
// SUBSTITUTION INTEGRAL
// ∫ a(ax+b)^n dx
// ========================================

function generateSubstitutionIntegral(
  config: AdvancedCalculusConfig,
): Question {
  const a = randomNonZeroFromRange(config.coefficientRange);

  const b = randomFromRange(config.coefficientRange);

  const n = Math.max(1, randomFromRange(config.powerRange));

  const newPower = n + 1;

  const coefficient = 1 / newPower;

  const correctValue = `${coefficient}:${a}:${b}:${newPower}`;

  const correctMath = `\\frac{(${a}x${b >= 0 ? '+' : ''}${b})^{${newPower}}}{${newPower}}+C`;

  return {
    id: crypto.randomUUID(),

    generatorId: 'advanced-calculus',

    familyId: 'calculus',

    variantKey: `advanced-calculus:substitution:${a}:${b}:${n}`,

    topicId: 'advanced-calculus',

    type: 'single-choice',

    title: 'Інтегрування підстановкою',

    math: `\\int ${a}(${a}x${b >= 0 ? '+' : ''}${b})^{${n}}dx`,

    options: createMathOptions(correctValue, correctMath, [
      {
        value: `1:${a}:${b}:${newPower}`,

        math: `(${a}x${b >= 0 ? '+' : ''}${b})^{${newPower}}+C`,
      },

      {
        value: `${coefficient}:${a}:${b}:${n}`,

        math: `\\frac{(${a}x${b >= 0 ? '+' : ''}${b})^{${n}}}{${newPower}}+C`,
      },

      {
        value: `${a / newPower}:${a}:${b}:${newPower}`,

        math: `\\frac{${a}}{${newPower}}(${a}x${b >= 0 ? '+' : ''}${b})^{${newPower}}+C`,
      },

      {
        value: `${newPower}:${a}:${b}:${newPower}`,

        math: `${newPower}(${a}x${b >= 0 ? '+' : ''}${b})^{${newPower}}+C`,
      },
    ]),

    correctAnswer: correctValue,

    solution: [
      {
        math: `u=${a}x${b >= 0 ? '+' : ''}${b}`,
      },
      {
        math: `du=${a}\\,dx`,
      },
      {
        math: `\\int u^{${n}}du=\\frac{u^{${newPower}}}{${newPower}}+C`,
      },
      {
        math: correctMath,
      },
    ],
  };
}

const generatorsByForm: Record<
  AdvancedCalculusForm,
  (config: AdvancedCalculusConfig) => Question
> = {
  'limit-factorization': generateLimitFactorization,

  'chain-rule': generateChainRule,

  'product-rule': generateProductRule,

  'quotient-rule': generateQuotientRule,

  'extremum-quadratic': generateQuadraticExtremum,

  'substitution-integral': generateSubstitutionIntegral,
};

export function generateAdvancedCalculus(
  config: AdvancedCalculusConfig,
): Question {
  if (config.forms.length === 0) {
    throw new Error('Не задано форм поглибленого математичного аналізу.');
  }

  return generatorsByForm[randomItem(config.forms)](config);
}
