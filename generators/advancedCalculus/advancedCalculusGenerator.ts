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

function formatLinear(coefficient: number, constant: number): string {
  const coefficientPart =
    coefficient === 1 ? 'x' : coefficient === -1 ? '-x' : `${coefficient}x`;

  if (constant === 0) {
    return coefficientPart;
  }

  if (constant > 0) {
    return `${coefficientPart}+${constant}`;
  }

  return `${coefficientPart}-${Math.abs(constant)}`;
}

function xMinus(value: number): string {
  if (value >= 0) {
    return `x-${value}`;
  }

  return `x+${Math.abs(value)}`;
}

function xPlus(value: number): string {
  if (value >= 0) {
    return `x+${value}`;
  }

  return `x-${Math.abs(value)}`;
}

function formatLinearPolynomial(coefficient: number, constant: number): string {
  return formatLinear(coefficient, constant);
}

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
    if (candidate.value !== correctValue && !unique.has(candidate.value)) {
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

  const denominator = xMinus(a);

  const secondFactor = xPlus(a);

  return {
    id: crypto.randomUUID(),

    generatorId: 'advanced-calculus',

    familyId: 'calculus',

    variantKey: `advanced-calculus:limit-factorization:${a}`,

    topicId: 'advanced-calculus',

    type: 'single-choice',

    title: 'Границя з невизначеністю 0/0',

    math: `\\lim_{x\\to ${a}}` + `\\frac{x^2-${a ** 2}}{${denominator}}`,

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
        math: `x^2-${a ** 2}=` + `(${denominator})(${secondFactor})`,
      },

      {
        math:
          `\\frac{(${denominator})(${secondFactor})}` +
          `{${denominator}}=${secondFactor}`,
      },

      {
        math: `\\lim_{x\\to ${a}}` + `(${secondFactor})=${answer}`,
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

  const inner = formatLinear(a, b);

  const correctValue = `${coefficient}:${a}:${b}:${n - 1}`;

  const correctMath = `${coefficient}` + `(${inner})^{${n - 1}}`;

  return {
    id: crypto.randomUUID(),

    generatorId: 'advanced-calculus',

    familyId: 'calculus',

    variantKey: `advanced-calculus:chain:${a}:${b}:${n}`,

    topicId: 'advanced-calculus',

    type: 'single-choice',

    title: 'Правило ланцюга',

    text: 'Знайдіть похідну.',

    math: `f(x)=(${inner})^{${n}}`,

    options: createMathOptions(correctValue, correctMath, [
      {
        value: `${n}:${a}:${b}:${n - 1}`,

        math: `${n}(${inner})^{${n - 1}}`,
      },

      {
        value: `${coefficient}:${a}:${b}:${n}`,

        math: `${coefficient}(${inner})^{${n}}`,
      },

      {
        value: `${a}:${a}:${b}:${n - 1}`,

        math: `${a}(${inner})^{${n - 1}}`,
      },

      {
        value: `${coefficient + 1}:${a}:${b}:${n - 1}`,

        math: `${coefficient + 1}` + `(${inner})^{${n - 1}}`,
      },
    ]),

    correctAnswer: correctValue,

    solution: [
      {
        math: `(u^n)'=nu^{n-1}u'`,
      },

      {
        math: `u=${inner},\\quad u'=${a}`,
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

  const first = formatLinear(a, b);

  const second = formatLinear(c, d);

  const quadraticCoefficient = 2 * a * c;

  const constant = a * d + b * c;

  const correctValue = `${quadraticCoefficient};${constant}`;

  const correctMath = formatLinearPolynomial(quadraticCoefficient, constant);

  return {
    id: crypto.randomUUID(),

    generatorId: 'advanced-calculus',

    familyId: 'calculus',

    variantKey: `advanced-calculus:product:${a}:${b}:${c}:${d}`,

    topicId: 'advanced-calculus',

    type: 'single-choice',

    title: 'Похідна добутку',

    math: `f(x)=(${first})(${second})`,

    options: createMathOptions(correctValue, correctMath, [
      {
        value: `${a * c};${constant}`,

        math: formatLinearPolynomial(a * c, constant),
      },

      {
        value: `${quadraticCoefficient};${b * d}`,

        math: formatLinearPolynomial(quadraticCoefficient, b * d),
      },

      {
        value: `${a + c};${b + d}`,

        math: formatLinearPolynomial(a + c, b + d),
      },

      {
        value: `${quadraticCoefficient + 1};${constant}`,

        math: formatLinearPolynomial(quadraticCoefficient + 1, constant),
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
// (ax+b)/(cx+d)
// ========================================

function generateQuotientRule(config: AdvancedCalculusConfig): Question {
  const a = randomNonZeroFromRange(config.coefficientRange);

  const b = randomFromRange(config.coefficientRange);

  const c = randomNonZeroFromRange(config.coefficientRange);

  const d = randomFromRange(config.coefficientRange);

  const numerator = a * d - b * c;

  const numeratorExpression = formatLinear(a, b);

  const denominatorExpression = formatLinear(c, d);

  const correctValue = `${numerator}:${c}:${d}`;

  const correctMath = `\\frac{${numerator}}` + `{(${denominatorExpression})^2}`;

  return {
    id: crypto.randomUUID(),

    generatorId: 'advanced-calculus',

    familyId: 'calculus',

    variantKey: `advanced-calculus:quotient:${a}:${b}:${c}:${d}`,

    topicId: 'advanced-calculus',

    type: 'single-choice',

    title: 'Похідна частки',

    math: `f(x)=\\frac{${numeratorExpression}}` + `{${denominatorExpression}}`,

    options: createMathOptions(correctValue, correctMath, [
      {
        value: `${a * d + b * c}:${c}:${d}`,

        math: `\\frac{${a * d + b * c}}` + `{(${denominatorExpression})^2}`,
      },

      {
        value: `${a - c}:${c}:${d}`,

        math: `\\frac{${a - c}}` + `{(${denominatorExpression})^2}`,
      },

      {
        value: `${numerator}:${c}:${d}:no-square`,

        math: `\\frac{${numerator}}` + `{${denominatorExpression}}`,
      },

      {
        value: `${-numerator}:${c}:${d}`,

        math: `\\frac{${-numerator}}` + `{(${denominatorExpression})^2}`,
      },
    ]),

    correctAnswer: correctValue,

    solution: [
      {
        math: `\\left(\\frac{u}{v}\\right)'=` + `\\frac{u'v-uv'}{v^2}`,
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

  const candidates = new Set<string>();

  function addCandidate(value: string) {
    if (value !== answer) {
      candidates.add(value);
    }
  }

  addCandidate(`${-h};${k}`);

  addCandidate(`${h};${-k}`);

  addCandidate(`${k};${h}`);

  addCandidate(`${h + 1};${k}`);

  addCandidate(`${h - 1};${k}`);

  addCandidate(`${h};${k + 1}`);

  let offset = 2;

  while (candidates.size < 3) {
    addCandidate(`${h + offset};${k + offset}`);

    offset++;
  }

  const inside = xMinus(h);

  const constantPart = k === 0 ? '' : k > 0 ? `+${k}` : `-${Math.abs(k)}`;

  const options = shuffle([answer, ...Array.from(candidates).slice(0, 3)]).map(
    (value, index) => {
      const [x, y] = value.split(';');

      return {
        id: String(index),

        value,

        math: `(${x};${y})`,
      };
    },
  );

  return {
    id: crypto.randomUUID(),

    generatorId: 'advanced-calculus',

    familyId: 'calculus',

    variantKey: `advanced-calculus:extremum:${a}:${h}:${k}`,

    topicId: 'advanced-calculus',

    type: 'single-choice',

    title: 'Екстремум функції',

    text: `Знайдіть точку, у якій функція має ${extremumType}.`,

    math: `f(x)=${a}(${inside})^2${constantPart}`,

    options,

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

  const inner = formatLinear(a, b);

  const correctValue = `${coefficient}:${a}:${b}:${newPower}`;

  const correctMath = `\\frac{(${inner})^{${newPower}}}` + `{${newPower}}+C`;

  return {
    id: crypto.randomUUID(),

    generatorId: 'advanced-calculus',

    familyId: 'calculus',

    variantKey: `advanced-calculus:substitution:${a}:${b}:${n}`,

    topicId: 'advanced-calculus',

    type: 'single-choice',

    title: 'Інтегрування підстановкою',

    math: `\\int ${a}(${inner})^{${n}}dx`,

    options: createMathOptions(correctValue, correctMath, [
      {
        value: `1:${a}:${b}:${newPower}`,

        math: `(${inner})^{${newPower}}+C`,
      },

      {
        value: `${coefficient}:${a}:${b}:${n}`,

        math: `\\frac{(${inner})^{${n}}}` + `{${newPower}}+C`,
      },

      {
        value: `${a / newPower}:${a}:${b}:${newPower}`,

        math: `\\frac{${a}}{${newPower}}` + `(${inner})^{${newPower}}+C`,
      },

      {
        value: `${newPower}:${a}:${b}:${newPower}`,

        math: `${newPower}` + `(${inner})^{${newPower}}+C`,
      },
    ]),

    correctAnswer: correctValue,

    solution: [
      {
        math: `u=${inner}`,
      },

      {
        math: `du=${a}\\,dx`,
      },

      {
        math: `\\int u^{${n}}du=` + `\\frac{u^{${newPower}}}{${newPower}}+C`,
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
