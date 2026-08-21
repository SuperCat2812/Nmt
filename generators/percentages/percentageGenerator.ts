import type { PercentageConfig, PercentageForm } from '@/types/generator';

import type { Question, SolutionStep } from '@/types/question';

import { createNumericOptions } from '@/utils/createNumericOptions';

import { formatDecimal } from '@/utils/formatMath';

import { randomFromRange, randomItem } from '@/utils/random';

function createPercentageOptions(answer: number, candidates: number[]) {
  return createNumericOptions(answer, candidates, {
    isAllowed: (value) => Number.isFinite(value) && value >= 0,
  });
}

function generatePercentOfNumber(config: PercentageConfig): Question {
  const percent = randomItem(config.percentValues);

  const base = randomFromRange(config.numberRange);

  const number = Math.ceil(base / 100) * 100;

  const answer = (number * percent) / 100;

  const options = createPercentageOptions(answer, [
    number / percent,
    number - answer,
    number + answer,
    answer * 2,
    answer + 10,
    answer - 10,
  ]);

  const solution: SolutionStep[] = [
    {
      math: `${percent}\\% = ` + `\\frac{${percent}}{100}`,
    },

    {
      math: `${number} \\cdot ` + `\\frac{${percent}}{100} = ${answer}`,
    },

    {
      text: `Відповідь: ${answer}`,
    },
  ];

  return {
    id: crypto.randomUUID(),

    generatorId: 'percentage',

    familyId: 'percentages',

    variantKey: `percentage:percent-of-number:${number}:${percent}`,

    topicId: 'percentages',

    type: 'single-choice',

    title: 'Відсотки',

    text: `Знайдіть ${percent}% ` + `від числа ${number}.`,

    options,

    correctAnswer: String(answer),

    solution,
  };
}

function generateNumberByPercent(config: PercentageConfig): Question {
  const percent = randomItem(config.percentValues);

  const rawNumber = randomFromRange(config.numberRange);

  const number = Math.ceil(rawNumber / 100) * 100;

  const part = (number * percent) / 100;

  const answer = number;

  const options = createPercentageOptions(answer, [
    part,
    part * 100,
    number / 2,
    number * 2,
    number + 100,
    number - 100,
  ]);

  return {
    id: crypto.randomUUID(),

    generatorId: 'percentage',

    familyId: 'percentages',

    variantKey: `percentage:number-by-percent:${number}:${percent}`,

    topicId: 'percentages',

    type: 'single-choice',

    title: 'Знаходження числа за відсотком',

    text:
      `${part} становить ${percent}% ` + `деякого числа. Знайдіть це число.`,

    options,

    correctAnswer: String(answer),

    solution: [
      {
        math: `\\frac{${percent}}{100}x = ${part}`,
      },

      {
        math: `x = \\frac{${part} \\cdot 100}{${percent}}`,
      },

      {
        math: `x = ${answer}`,
      },
    ],
  };
}

function generatePercentageRatio(config: PercentageConfig): Question {
  const percent = randomItem(config.percentValues);

  const rawWhole = randomFromRange(config.numberRange);

  const whole = Math.ceil(rawWhole / 100) * 100;

  const part = (whole * percent) / 100;

  const answer = percent;

  const options = createPercentageOptions(answer, [
    answer + 5,
    answer - 5,
    answer * 2,
    answer / 2,
    whole / part,
    part / whole,
  ]);

  return {
    id: crypto.randomUUID(),

    generatorId: 'percentage',

    familyId: 'percentages',

    variantKey: `percentage:ratio:${part}:${whole}`,

    topicId: 'percentages',

    type: 'single-choice',

    title: 'Відсоткове відношення',

    text: `Скільки відсотків становить ` + `${part} від ${whole}?`,

    options,

    correctAnswer: String(answer),

    solution: [
      {
        math: `\\frac{${part}}{${whole}} ` + `\\cdot 100\\%`,
      },

      {
        math: `= ${answer}\\%`,
      },
    ],
  };
}

function generateIncreaseByPercent(config: PercentageConfig): Question {
  const percent = randomItem(config.percentValues);

  const rawNumber = randomFromRange(config.numberRange);

  const original = Math.ceil(rawNumber / 100) * 100;

  const increase = (original * percent) / 100;

  const answer = original + increase;

  const options = createPercentageOptions(answer, [
    increase,
    original - increase,
    original + percent,
    answer + 100,
    answer - 100,
    original * 2,
  ]);

  return {
    id: crypto.randomUUID(),

    generatorId: 'percentage',

    familyId: 'percentages',

    variantKey: `percentage:increase:${original}:${percent}`,

    topicId: 'percentages',

    type: 'single-choice',

    title: 'Збільшення на відсоток',

    text:
      `Число ${original} збільшили ` + `на ${percent}%. Яке число отримали?`,

    options,

    correctAnswer: String(answer),

    solution: [
      {
        math: `${original} \\cdot ` + `\\frac{${percent}}{100} = ${increase}`,
      },

      {
        math: `${original} + ${increase} = ${answer}`,
      },
    ],
  };
}

function generateDecreaseByPercent(config: PercentageConfig): Question {
  const percent = randomItem(config.percentValues);

  const rawNumber = randomFromRange(config.numberRange);

  const original = Math.ceil(rawNumber / 100) * 100;

  const decrease = (original * percent) / 100;

  const answer = original - decrease;

  const options = createPercentageOptions(answer, [
    decrease,
    original + decrease,
    original - percent,
    answer + 100,
    answer - 100,
    original / 2,
  ]);

  return {
    id: crypto.randomUUID(),

    generatorId: 'percentage',

    familyId: 'percentages',

    variantKey: `percentage:decrease:${original}:${percent}`,

    topicId: 'percentages',

    type: 'single-choice',

    title: 'Зменшення на відсоток',

    text: `Число ${original} зменшили ` + `на ${percent}%. Яке число отримали?`,

    options,

    correctAnswer: String(answer),

    solution: [
      {
        math: `${original} \\cdot ` + `\\frac{${percent}}{100} = ${decrease}`,
      },

      {
        math: `${original} - ${decrease} = ${answer}`,
      },
    ],
  };
}

function generatePercentageChange(config: PercentageConfig): Question {
  const percent = randomItem(config.percentValues);

  const rawOriginal = randomFromRange(config.numberRange);

  const original = Math.ceil(rawOriginal / 100) * 100;

  const increase = Math.random() >= 0.5;

  const difference = (original * percent) / 100;

  const newValue = increase ? original + difference : original - difference;

  const answer = percent;

  const options = createPercentageOptions(answer, [
    answer + 5,
    answer - 5,
    answer * 2,
    answer / 2,
    difference,
    newValue - original,
  ]);

  return {
    id: crypto.randomUUID(),

    generatorId: 'percentage',

    familyId: 'percentages',

    variantKey: `percentage:change:${original}:${newValue}`,

    topicId: 'percentages',

    type: 'single-choice',

    title: 'Відсоткова зміна',

    text:
      `Значення змінилося з ${original} ` +
      `до ${newValue}. На скільки відсотків ` +
      `воно ${increase ? 'збільшилося' : 'зменшилося'}?`,

    options,

    correctAnswer: String(answer),

    solution: [
      {
        math: `|${newValue} - ${original}| = ${difference}`,
      },

      {
        math:
          `\\frac{${difference}}{${original}} ` +
          `\\cdot 100\\% = ${answer}\\%`,
      },
    ],
  };
}

function generateSuccessiveChange(config: PercentageConfig): Question {
  const percent1 = randomItem(config.percentValues);

  const percent2 = randomItem(config.percentValues);

  const rawOriginal = randomFromRange(config.numberRange);

  const original = Math.ceil(rawOriginal / 100) * 100;

  const afterFirstRaw = original * (1 + percent1 / 100);

  const afterFirst = Math.round(afterFirstRaw * 100) / 100;

  const answer = afterFirst * (1 - percent2 / 100);

  const roundedAnswer = Math.round(answer * 100) / 100;

  const options = createPercentageOptions(roundedAnswer, [
    original * (1 + (percent1 - percent2) / 100),

    original + percent1 - percent2,

    afterFirst,

    original,

    roundedAnswer + 100,

    roundedAnswer - 100,
  ]);

  return {
    id: crypto.randomUUID(),

    generatorId: 'percentage',

    familyId: 'percentages',

    variantKey: `percentage:successive:${original}:${percent1}:${percent2}`,

    topicId: 'percentages',

    type: 'single-choice',

    title: 'Послідовна зміна у відсотках',

    text:
      `Число ${original} спочатку ` +
      `збільшили на ${percent1}%, ` +
      `а потім отримане число зменшили ` +
      `на ${percent2}%. Яке число отримали?`,

    options,

    correctAnswer: String(roundedAnswer),

    solution: [
      {
        math:
          `${original} \\cdot ` +
          `\\left(1 + \\frac{${percent1}}{100}\\right)` +
          ` = ${formatDecimal(afterFirst, 2)}`,
      },

      {
        math:
          `${formatDecimal(afterFirst, 2)} \\cdot ` +
          `\\left(1 - \\frac{${percent2}}{100}\\right)` +
          ` = ${formatDecimal(roundedAnswer, 2)}`,
      },
    ],
  };
}

const generatorsByForm: Record<
  PercentageForm,
  (config: PercentageConfig) => Question
> = {
  'percent-of-number': generatePercentOfNumber,

  'number-by-percent': generateNumberByPercent,

  'percentage-ratio': generatePercentageRatio,

  'increase-by-percent': generateIncreaseByPercent,

  'decrease-by-percent': generateDecreaseByPercent,

  'percentage-change': generatePercentageChange,

  'successive-change': generateSuccessiveChange,
};

export function generatePercentage(config: PercentageConfig): Question {
  if (config.forms.length === 0) {
    throw new Error('Для теми відсотків не задано жодної форми.');
  }

  const form = randomItem(config.forms);

  return generatorsByForm[form](config);
}
