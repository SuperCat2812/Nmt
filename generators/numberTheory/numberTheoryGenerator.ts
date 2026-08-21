import type { NumberTheoryConfig, NumberTheoryForm } from '@/types/generator';

import type { Question } from '@/types/question';

import { createNumericOptions } from '@/utils/createNumericOptions';

import { randomFromRange, randomItem } from '@/utils/random';

function gcd(a: number, b: number): number {
  let x = Math.abs(a);

  let y = Math.abs(b);

  while (y !== 0) {
    const remainder = x % y;

    x = y;
    y = remainder;
  }

  return x;
}

function lcm(a: number, b: number): number {
  if (a === 0 || b === 0) {
    return 0;
  }

  return Math.abs(a * b) / gcd(a, b);
}

function isPrime(value: number): boolean {
  if (value < 2) {
    return false;
  }

  for (let i = 2; i * i <= value; i++) {
    if (value % i === 0) {
      return false;
    }
  }

  return true;
}

function positiveValue(config: NumberTheoryConfig): number {
  return Math.max(2, Math.abs(randomFromRange(config.valueRange)));
}

function generateGcd(config: NumberTheoryConfig): Question {
  const a = positiveValue(config);

  const b = positiveValue(config);

  const answer = gcd(a, b);

  return {
    id: crypto.randomUUID(),

    generatorId: 'number-theory',

    familyId: 'number-theory',

    variantKey: `number-theory:gcd:${a}:${b}`,

    topicId: 'number-theory',

    type: 'single-choice',

    title: 'Найбільший спільний дільник',

    text: `Знайдіть НСД(${a}, ${b}).`,

    options: createNumericOptions(answer, [
      Math.min(a, b),
      Math.abs(a - b),
      a + b,
      lcm(a, b),
      answer + 1,
    ]),

    correctAnswer: String(answer),

    solution: [
      {
        text: 'Використаємо алгоритм Евкліда.',
      },
      {
        math: `\\gcd(${a},${b})=${answer}`,
      },
    ],
  };
}

function generateLcm(config: NumberTheoryConfig): Question {
  const a = positiveValue(config);

  const b = positiveValue(config);

  const answer = lcm(a, b);

  return {
    id: crypto.randomUUID(),

    generatorId: 'number-theory',

    familyId: 'number-theory',

    variantKey: `number-theory:lcm:${a}:${b}`,

    topicId: 'number-theory',

    type: 'single-choice',

    title: 'Найменше спільне кратне',

    text: `Знайдіть НСК(${a}, ${b}).`,

    options: createNumericOptions(answer, [
      gcd(a, b),
      a * b,
      a + b,
      Math.max(a, b),
      answer + 1,
    ]),

    correctAnswer: String(answer),

    solution: [
      {
        math: '\\operatorname{lcm}(a,b)=\\frac{|ab|}{\\gcd(a,b)}',
      },
      {
        math: `\\operatorname{lcm}(${a},${b})=${answer}`,
      },
    ],
  };
}

function generateDivisibility(config: NumberTheoryConfig): Question {
  const divisor = positiveValue(config);

  const multiplier = randomItem([2, 3, 4, 5, 6]);

  const divisible = Math.random() >= 0.5;

  const value = divisible ? divisor * multiplier : divisor * multiplier + 1;

  return {
    id: crypto.randomUUID(),

    generatorId: 'number-theory',

    familyId: 'number-theory',

    variantKey: `number-theory:divisibility:${value}:${divisor}`,

    topicId: 'number-theory',

    type: 'single-choice',

    title: 'Подільність',

    text: `Чи ділиться ${value} на ${divisor} без остачі?`,

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

    correctAnswer: divisible ? 'yes' : 'no',

    solution: [
      {
        math: `${value}\\bmod${divisor}=${value % divisor}`,
      },
    ],
  };
}

function generatePrimeCheck(config: NumberTheoryConfig): Question {
  const value = positiveValue(config);

  const answer = isPrime(value);

  return {
    id: crypto.randomUUID(),

    generatorId: 'number-theory',

    familyId: 'number-theory',

    variantKey: `number-theory:prime:${value}`,

    topicId: 'number-theory',

    type: 'single-choice',

    title: 'Прості числа',

    text: `Чи є число ${value} простим?`,

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

    correctAnswer: answer ? 'yes' : 'no',

    solution: [
      {
        text: answer
          ? `${value} має рівно два додатні дільники.`
          : `${value} не є простим числом.`,
      },
    ],
  };
}

function generateModularRemainder(config: NumberTheoryConfig): Question {
  const value = positiveValue(config);

  const modulus = Math.max(2, Math.min(12, positiveValue(config)));

  const answer = value % modulus;

  return {
    id: crypto.randomUUID(),

    generatorId: 'number-theory',

    familyId: 'number-theory',

    variantKey: `number-theory:mod:${value}:${modulus}`,

    topicId: 'number-theory',

    type: 'single-choice',

    title: 'Арифметика за модулем',

    text: `Знайдіть остачу від ділення ${value} на ${modulus}.`,

    math: `${value}\\bmod ${modulus}`,

    options: createNumericOptions(
      answer,
      [modulus, value, answer + 1, answer - 1, Math.floor(value / modulus)],

      {
        isAllowed: (candidate) => Number.isInteger(candidate) && candidate >= 0,
      },
    ),

    correctAnswer: String(answer),

    solution: [
      {
        math: `${value}=${Math.floor(value / modulus)}\\cdot${modulus}+${answer}`,
      },
      {
        text: `Остача: ${answer}.`,
      },
    ],
  };
}

const generatorsByForm: Record<
  NumberTheoryForm,
  (config: NumberTheoryConfig) => Question
> = {
  gcd: generateGcd,

  lcm: generateLcm,

  divisibility: generateDivisibility,

  'prime-check': generatePrimeCheck,

  'modular-remainder': generateModularRemainder,
};

export function generateNumberTheory(config: NumberTheoryConfig): Question {
  if (config.forms.length === 0) {
    throw new Error('Не задано форм теорії чисел.');
  }

  return generatorsByForm[randomItem(config.forms)](config);
}
