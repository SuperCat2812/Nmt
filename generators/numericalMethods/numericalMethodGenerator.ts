import type {
  NumericalMethodConfig,
  NumericalMethodForm,
} from '@/types/generator';

import type { Question } from '@/types/question';

import { createNumericOptions } from '@/utils/createNumericOptions';

import { randomFromRange, randomItem } from '@/utils/random';

function round(value: number, digits = 4): number {
  const multiplier = 10 ** digits;

  return Math.round(value * multiplier) / multiplier;
}

function formatAddition(first: number, second: number): string {
  if (second >= 0) {
    return `${first}+${second}`;
  }

  return `${first}-${Math.abs(second)}`;
}

function formatSubtraction(first: number, second: number): string {
  if (second >= 0) {
    return `${first}-${second}`;
  }

  return `${first}+${Math.abs(second)}`;
}

function generateBisectionStep(config: NumericalMethodConfig): Question {
  let a = randomFromRange(config.xRange);

  let b = randomFromRange(config.xRange);

  while (a === b) {
    b = randomFromRange(config.xRange);
  }

  if (a > b) {
    [a, b] = [b, a];
  }

  const answer = (a + b) / 2;

  return {
    id: crypto.randomUUID(),

    generatorId: 'numerical-method',

    familyId: 'numerical-methods',

    variantKey: `numerical:bisection:${a}:${b}`,

    topicId: 'numerical-methods',

    type: 'single-choice',

    title: 'Метод бісекції',

    text:
      `Поточний відрізок методу бісекції: ` +
      `[${a}; ${b}]. Яку точку перевіряємо наступною?`,

    options: createNumericOptions(answer, [a, b, b - a, a + b, answer + 1]),

    correctAnswer: String(answer),

    solution: [
      {
        math: `x_m=\\frac{a+b}{2}`,
      },

      {
        math: `x_m=\\frac{${formatAddition(a, b)}}2=${answer}`,
      },
    ],
  };
}

function generateNewtonStep(config: NumericalMethodConfig): Question {
  let x = randomFromRange(config.xRange);

  while (x === 0) {
    x = randomFromRange(config.xRange);
  }

  const target = randomItem([2, 3, 5, 7]);

  const fx = x ** 2 - target;

  const derivative = 2 * x;

  const answer = round(x - fx / derivative);

  return {
    id: crypto.randomUUID(),

    generatorId: 'numerical-method',

    familyId: 'numerical-methods',

    variantKey: `numerical:newton:${target}:${x}`,

    topicId: 'numerical-methods',

    type: 'single-choice',

    title: 'Метод Ньютона',

    text:
      `Для f(x)=x²-${target} маємо ` +
      `x₀=${x}. Знайдіть наступне наближення x₁.`,

    options: createNumericOptions(answer, [
      round(x - fx),

      round(x + fx / derivative),

      round(target / x),

      round(x / 2),

      answer + 1,
    ]),

    correctAnswer: String(answer),

    solution: [
      {
        math: `x_{n+1}=x_n-\\frac{f(x_n)}{f'(x_n)}`,
      },

      {
        math: `x_1=${x}-\\frac{${fx}}{(${derivative})}=${answer}`,
      },
    ],
  };
}

function generateFiniteDifference(config: NumericalMethodConfig): Question {
  const x = randomFromRange(config.xRange);

  const h = randomItem([1, 2]);

  const fx = x ** 2;

  const fxh = (x + h) ** 2;

  const answer = (fxh - fx) / h;

  return {
    id: crypto.randomUUID(),

    generatorId: 'numerical-method',

    familyId: 'numerical-methods',

    variantKey: `numerical:finite-difference:${x}:${h}`,

    topicId: 'numerical-methods',

    type: 'single-choice',

    title: 'Чисельна похідна',

    text:
      `Для f(x)=x² знайдіть наближення похідної ` +
      `в x=${x} за прямою різницею з h=${h}.`,

    options: createNumericOptions(answer, [
      2 * x,

      fxh - fx,

      fx + fxh,

      answer + h,

      answer - h,
    ]),

    correctAnswer: String(answer),

    solution: [
      {
        math: `f'(x)\\approx\\frac{f(x+h)-f(x)}{h}`,
      },

      {
        math: `\\frac{${formatSubtraction(fxh, fx)}}{${h}}=${answer}`,
      },
    ],
  };
}

function generateTrapezoidRule(config: NumericalMethodConfig): Question {
  let a = randomFromRange(config.xRange);

  let b = randomFromRange(config.xRange);

  while (a === b) {
    b = randomFromRange(config.xRange);
  }

  if (a > b) {
    [a, b] = [b, a];
  }

  const fa = a ** 2;

  const fb = b ** 2;

  const answer = ((b - a) * (fa + fb)) / 2;

  return {
    id: crypto.randomUUID(),

    generatorId: 'numerical-method',

    familyId: 'numerical-methods',

    variantKey: `numerical:trapezoid:${a}:${b}`,

    topicId: 'numerical-methods',

    type: 'single-choice',

    title: 'Метод трапецій',

    text:
      `Наближено обчисліть ∫₍${a}₎⁽${b}⁾ ` +
      `x²dx одним інтервалом методу трапецій.`,

    options: createNumericOptions(answer, [
      (b - a) * (fa + fb),

      (fa + fb) / 2,

      b - a,

      answer + 1,

      answer - 1,
    ]),

    correctAnswer: String(answer),

    solution: [
      {
        math: `T=\\frac{b-a}{2}[f(a)+f(b)]`,
      },

      {
        math: `T=\\frac{${formatSubtraction(b, a)}}2(${formatAddition(
          fa,
          fb,
        )})=${answer}`,
      },
    ],
  };
}

const generatorsByForm: Record<
  NumericalMethodForm,
  (config: NumericalMethodConfig) => Question
> = {
  'bisection-step': generateBisectionStep,

  'newton-step': generateNewtonStep,

  'finite-difference': generateFiniteDifference,

  'trapezoid-rule': generateTrapezoidRule,
};

export function generateNumericalMethod(
  config: NumericalMethodConfig,
): Question {
  if (config.forms.length === 0) {
    throw new Error('Не задано форм чисельних методів.');
  }

  return generatorsByForm[randomItem(config.forms)](config);
}
