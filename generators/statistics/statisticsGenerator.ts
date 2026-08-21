import type { StatisticsConfig, StatisticsForm } from '@/types/generator';

import type { Question } from '@/types/question';

import { createNumericOptions } from '@/utils/createNumericOptions';

import { randomFromRange, randomItem } from '@/utils/random';

function createData(config: StatisticsConfig): number[] {
  const count = randomFromRange(config.itemCountRange);

  return Array.from(
    {
      length: count,
    },

    () => randomFromRange(config.valueRange),
  );
}

function generateMean(config: StatisticsConfig): Question {
  const data = createData(config);

  const sum = data.reduce((total, value) => total + value, 0);

  const answer = Math.round((sum / data.length) * 100) / 100;

  return {
    id: crypto.randomUUID(),

    generatorId: 'statistics',

    familyId: 'statistics',

    variantKey: `statistics:mean:${data.join(':')}`,

    topicId: 'statistics',

    type: 'single-choice',

    title: 'Середнє арифметичне',

    text: `Знайдіть середнє арифметичне: ${data.join(', ')}.`,

    options: createNumericOptions(answer, [
      sum,
      answer + 1,
      answer - 1,
      data.length,
      Math.max(...data),
    ]),

    correctAnswer: String(answer),

    solution: [
      {
        math: `\\bar{x}=\\frac{${sum}}{${data.length}}=${answer}`,
      },
    ],
  };
}

function generateMedian(config: StatisticsConfig): Question {
  const count = randomItem([5, 7, 9]);

  const data = Array.from(
    {
      length: count,
    },

    () => randomFromRange(config.valueRange),
  );

  const sorted = [...data].sort((a, b) => a - b);

  const answer = sorted[Math.floor(count / 2)];

  return {
    id: crypto.randomUUID(),

    generatorId: 'statistics',

    familyId: 'statistics',

    variantKey: `statistics:median:${data.join(':')}`,

    topicId: 'statistics',

    type: 'single-choice',

    title: 'Медіана',

    text: `Знайдіть медіану набору: ${data.join(', ')}.`,

    options: createNumericOptions(answer, [
      sorted[0],
      sorted[sorted.length - 1],
      answer + 1,
      answer - 1,
      data.length,
    ]),

    correctAnswer: String(answer),

    solution: [
      {
        text: `Упорядкуємо дані: ${sorted.join(', ')}.`,
      },
      {
        text: `Центральне значення: ${answer}.`,
      },
    ],
  };
}

function generateMode(config: StatisticsConfig): Question {
  const mode = randomFromRange(config.valueRange);

  const other1 = mode + 1;

  const other2 = mode + 2;

  const data = [mode, other1, mode, other2, mode, other1];

  return {
    id: crypto.randomUUID(),

    generatorId: 'statistics',

    familyId: 'statistics',

    variantKey: `statistics:mode:${data.join(':')}`,

    topicId: 'statistics',

    type: 'single-choice',

    title: 'Мода',

    text: `Знайдіть моду набору: ${data.join(', ')}.`,

    options: createNumericOptions(mode, [other1, other2, mode - 1, mode + 3]),

    correctAnswer: String(mode),

    solution: [
      {
        text: `${mode} зустрічається найчастіше.`,
      },
    ],
  };
}

function generateRange(config: StatisticsConfig): Question {
  const data = createData(config);

  const minimum = Math.min(...data);

  const maximum = Math.max(...data);

  const answer = maximum - minimum;

  return {
    id: crypto.randomUUID(),

    generatorId: 'statistics',

    familyId: 'statistics',

    variantKey: `statistics:range:${data.join(':')}`,

    topicId: 'statistics',

    type: 'single-choice',

    title: 'Розмах',

    text: `Знайдіть розмах набору: ${data.join(', ')}.`,

    options: createNumericOptions(answer, [
      maximum,
      minimum,
      maximum + minimum,
      answer + 1,
      answer - 1,
    ]),

    correctAnswer: String(answer),

    solution: [
      {
        math: `R=x_{max}-x_{min}`,
      },
      {
        math: `R=${maximum}-${minimum}=${answer}`,
      },
    ],
  };
}

function generateBarChart(): Question {
  const data = [
    {
      label: 'A',
      value: randomFromRange([10, 50]),
    },
    {
      label: 'B',
      value: randomFromRange([10, 50]),
    },
    {
      label: 'C',
      value: randomFromRange([10, 50]),
    },
    {
      label: 'D',
      value: randomFromRange([10, 50]),
    },
  ];

  const answer = Math.max(...data.map((item) => item.value));

  return {
    id: crypto.randomUUID(),

    generatorId: 'statistics',

    familyId: 'statistics',

    variantKey: `statistics:bar:${data.map((item) => item.value).join(':')}`,

    topicId: 'statistics',

    type: 'single-choice',

    title: 'Стовпчаста діаграма',

    text: 'Визначте найбільше значення на діаграмі.',

    visual: {
      type: 'bar-chart',

      data,

      xLabel: 'Категорія',

      yLabel: 'Значення',
    },

    options: createNumericOptions(
      answer,
      data.map((item) => item.value),
    ),

    correctAnswer: String(answer),

    solution: [
      {
        text: `Найвищий стовпчик має значення ${answer}.`,
      },
    ],
  };
}

const generatorsByForm: Record<
  StatisticsForm,
  (config: StatisticsConfig) => Question
> = {
  mean: generateMean,

  median: generateMedian,

  mode: generateMode,

  range: generateRange,

  'bar-chart': () => generateBarChart(),
};

export function generateStatistics(config: StatisticsConfig): Question {
  if (config.forms.length === 0) {
    throw new Error('Не задано форм статистики.');
  }

  return generatorsByForm[randomItem(config.forms)](config);
}
