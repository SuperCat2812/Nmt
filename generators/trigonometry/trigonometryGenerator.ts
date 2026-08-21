import type { TrigonometryConfig, TrigonometryForm } from '@/types/generator';

import type { Question, QuestionOption } from '@/types/question';

import { createNumericOptions } from '@/utils/createNumericOptions';

import { randomItem } from '@/utils/random';

import { shuffle } from '@/utils/shuffle';

type StandardTrigValue = {
  angle: number;
  sin: string;
  cos: string;
  tan?: string;
};

const standardValues: StandardTrigValue[] = [
  {
    angle: 0,
    sin: '0',
    cos: '1',
    tan: '0',
  },
  {
    angle: 30,
    sin: '1/2',
    cos: 'sqrt(3)/2',
    tan: 'sqrt(3)/3',
  },
  {
    angle: 45,
    sin: 'sqrt(2)/2',
    cos: 'sqrt(2)/2',
    tan: '1',
  },
  {
    angle: 60,
    sin: 'sqrt(3)/2',
    cos: '1/2',
    tan: 'sqrt(3)',
  },
  {
    angle: 90,
    sin: '1',
    cos: '0',
  },
];

function valueToLatex(value: string): string {
  const map: Record<string, string> = {
    '0': '0',
    '1': '1',
    '1/2': '\\frac{1}{2}',
    'sqrt(2)/2': '\\frac{\\sqrt{2}}{2}',
    'sqrt(3)/2': '\\frac{\\sqrt{3}}{2}',
    'sqrt(3)/3': '\\frac{\\sqrt{3}}{3}',
    'sqrt(3)': '\\sqrt{3}',
  };

  return map[value] ?? value;
}

function generateStandardValue(): Question {
  const functionName = randomItem(['sin', 'cos', 'tan'] as const);

  const allowed = standardValues.filter(
    (item) => functionName !== 'tan' || item.tan !== undefined,
  );

  const item = randomItem(allowed);

  const answer = item[functionName];

  if (!answer) {
    throw new Error('Не вдалося визначити тригонометричне значення.');
  }

  const candidateValues = Array.from(
    new Set(
      standardValues
        .flatMap((value) => [value.sin, value.cos, value.tan])
        .filter((value): value is string => Boolean(value)),
    ),
  ).filter((value) => value !== answer);

  const options: QuestionOption[] = shuffle([
    answer,
    ...shuffle(candidateValues).slice(0, 3),
  ]).map((value, index) => ({
    id: String(index),

    value,

    math: valueToLatex(value),
  }));

  return {
    id: crypto.randomUUID(),

    generatorId: 'trigonometry',

    familyId: 'trigonometry',

    variantKey: `trigonometry:value:${functionName}:${item.angle}`,

    topicId: 'trigonometry',

    type: 'single-choice',

    title: 'Тригонометричні значення',

    math: `\\${functionName}${item.angle}^{\\circ}`,

    options,

    correctAnswer: answer,

    solution: [
      {
        text: 'Використаємо таблицю стандартних значень тригонометричних функцій.',
      },
      {
        math: `\\${functionName}${item.angle}^{\\circ}=${valueToLatex(answer)}`,
      },
    ],
  };
}

function generateIdentity(): Question {
  const options: QuestionOption[] = shuffle([
    {
      value: 'sin2+cos2=1',
      math: '\\sin^2x+\\cos^2x=1',
    },

    {
      value: 'sin+cos=1',
      math: '\\sin x+\\cos x=1',
    },

    {
      value: 'sin2-cos2=1',
      math: '\\sin^2x-\\cos^2x=1',
    },

    {
      value: 'tan=sin*cos',
      math: '\\tan x=\\sin x\\cos x',
    },
  ]).map((option, index) => ({
    id: String(index),
    ...option,
  }));

  return {
    id: crypto.randomUUID(),

    generatorId: 'trigonometry',
    familyId: 'trigonometry',

    variantKey: 'trigonometry:identity:basic',

    topicId: 'trigonometry',

    type: 'single-choice',

    title: 'Основна тригонометрична тотожність',

    text: 'Оберіть правильну тотожність.',

    options,

    correctAnswer: 'sin2+cos2=1',

    solution: [
      {
        math: '\\sin^2x+\\cos^2x=1',
      },
    ],
  };
}

function generateBasicEquation(): Question {
  const variant = randomItem([
    {
      math: '\\sin x = 0',
      answer: 'pi*n',
      answerMath: 'x=\\pi n,\\;n\\in\\mathbb{Z}',
    },

    {
      math: '\\cos x = 0',
      answer: 'pi/2+pi*n',
      answerMath: 'x=\\frac{\\pi}{2}+\\pi n,\\;n\\in\\mathbb{Z}',
    },

    {
      math: '\\tan x = 0',
      answer: 'pi*n',
      answerMath: 'x=\\pi n,\\;n\\in\\mathbb{Z}',
    },
  ]);

  const options = shuffle([
    {
      value: variant.answer,
      math: variant.answerMath,
    },

    {
      value: '2pi*n',
      math: 'x=2\\pi n',
    },

    {
      value: 'pi/2+2pi*n',
      math: 'x=\\frac{\\pi}{2}+2\\pi n',
    },

    {
      value: 'pi+2pi*n',
      math: 'x=\\pi+2\\pi n',
    },
  ]).map((option, index) => ({
    id: String(index),

    ...option,
  }));

  return {
    id: crypto.randomUUID(),

    generatorId: 'trigonometry',

    familyId: 'trigonometry',

    variantKey: `trigonometry:equation:${variant.math}`,

    topicId: 'trigonometry',

    type: 'single-choice',

    title: 'Тригонометричне рівняння',

    math: variant.math,

    options,

    correctAnswer: variant.answer,

    solution: [
      {
        math: variant.answerMath,
      },
    ],
  };
}

function generateRightTriangle(): Question {
  const triples = [
    [3, 4, 5],
    [5, 12, 13],
    [8, 15, 17],
    [7, 24, 25],
  ] as const;

  const [opposite, adjacent, hypotenuse] = randomItem(triples);

  const answer = opposite / hypotenuse;

  return {
    id: crypto.randomUUID(),

    generatorId: 'trigonometry',

    familyId: 'trigonometry',

    variantKey: `trigonometry:right-triangle:${opposite}:${adjacent}:${hypotenuse}`,

    topicId: 'trigonometry',

    type: 'single-choice',

    title: 'Тригонометрія прямокутного трикутника',

    text: `Протилежний катет дорівнює ${opposite}, гіпотенуза — ${hypotenuse}. Знайдіть sin α.`,

    options: createNumericOptions(answer, [
      adjacent / hypotenuse,

      opposite / adjacent,

      hypotenuse / opposite,

      1 - answer,

      answer + 1,
    ]),

    correctAnswer: String(answer),

    solution: [
      {
        math: '\\sin\\alpha=\\frac{\\text{протилежний катет}}{\\text{гіпотенуза}}',
      },
      {
        math: `\\sin\\alpha=\\frac{${opposite}}{${hypotenuse}}`,
      },
    ],
  };
}

const generatorsByForm: Record<
  TrigonometryForm,
  (config: TrigonometryConfig) => Question
> = {
  'standard-value': () => generateStandardValue(),

  'basic-equation': () => generateBasicEquation(),

  identity: () => generateIdentity(),

  'right-triangle': () => generateRightTriangle(),
};

export function generateTrigonometry(config: TrigonometryConfig): Question {
  if (config.forms.length === 0) {
    throw new Error('Не задано жодної форми тригонометрії.');
  }

  return generatorsByForm[randomItem(config.forms)](config);
}
