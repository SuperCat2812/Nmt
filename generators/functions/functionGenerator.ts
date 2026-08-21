import type { FunctionConfig, FunctionForm } from '@/types/generator';

import type { Question, QuestionOption } from '@/types/question';

import { createNumericOptions } from '@/utils/createNumericOptions';

import {
  formatLinearExpression,
  formatQuadraticExpression,
} from '@/utils/algebra';

import {
  randomFromRange,
  randomItem,
  randomNonZeroFromRange,
} from '@/utils/random';

import { shuffle } from '@/utils/shuffle';

function signedConstant(value: number): string {
  if (value === 0) {
    return '';
  }

  if (value > 0) {
    return `+${value}`;
  }

  return `-${Math.abs(value)}`;
}

function factorByRoot(root: number): string {
  if (root >= 0) {
    return `(x-${root})`;
  }

  return `(x+${Math.abs(root)})`;
}

// ========================================
// f(x0)
// ========================================

function generateValue(config: FunctionConfig): Question {
  const a = randomNonZeroFromRange(config.coefficientRange);

  const b = randomFromRange(config.constantRange);

  const x = randomFromRange(config.xRange);

  const answer = a * x + b;

  return {
    id: crypto.randomUUID(),

    generatorId: 'function',

    familyId: 'functions',

    variantKey: `function:value:${a}:${b}:${x}`,

    topicId: 'functions',

    type: 'single-choice',

    title: 'Значення функції',

    text: `Знайдіть f(${x}).`,

    math: `f(x)=${formatLinearExpression(a, b)}`,

    options: createNumericOptions(answer, [
      a + x + b,

      a * x - b,

      a + b,

      answer + 1,

      answer - 1,
    ]),

    correctAnswer: String(answer),

    solution: [
      {
        math: `f(${x})=${a}\\cdot(${x})${signedConstant(b)}`,
      },

      {
        math: `f(${x})=${answer}`,
      },
    ],
  };
}

// ========================================
// zeros of quadratic
// ========================================

function generateZeros(config: FunctionConfig): Question {
  const r1 = randomFromRange(config.xRange);

  let r2 = randomFromRange(config.xRange);

  while (r1 === r2) {
    r2 = randomFromRange(config.xRange);
  }

  const first = Math.min(r1, r2);

  const second = Math.max(r1, r2);

  const b = -(first + second);

  const c = first * second;

  const correct = `${first};${second}`;

  const candidates = new Set<string>();

  function addCandidate(value: string) {
    if (value !== correct) {
      candidates.add(value);
    }
  }

  addCandidate(`${-first};${second}`);

  addCandidate(`${first};${-second}`);

  addCandidate(`${first + 1};${second}`);

  addCandidate(`${first};${second + 1}`);

  addCandidate(`${-first};${-second}`);

  let offset = 2;

  while (candidates.size < 3) {
    addCandidate(`${first + offset};${second}`);

    offset++;
  }

  const options: QuestionOption[] = shuffle([
    correct,

    ...Array.from(candidates).slice(0, 3),
  ]).map((value, index) => {
    const [x1, x2] = value.split(';');

    return {
      id: String(index),

      value,

      math: `x_1=${x1},\\;x_2=${x2}`,
    };
  });

  return {
    id: crypto.randomUUID(),

    generatorId: 'function',

    familyId: 'functions',

    variantKey: `function:zeros:${first}:${second}`,

    topicId: 'functions',

    type: 'single-choice',

    title: 'Нулі функції',

    text: 'Знайдіть нулі функції.',

    math: `f(x)=${formatQuadraticExpression(1, b, c)}`,

    options,

    correctAnswer: correct,

    solution: [
      {
        math: `f(x)=0`,
      },

      {
        math: `${factorByRoot(first)}${factorByRoot(second)}=0`,
      },

      {
        math: `x_1=${first},\\quad x_2=${second}`,
      },
    ],
  };
}

// ========================================
// vertex
// ========================================

function generateVertex(config: FunctionConfig): Question {
  const h = randomFromRange(config.xRange);

  const k = randomFromRange(config.constantRange);

  const a = randomItem([-2, -1, 1, 2]);

  const correct = `${h};${k}`;

  const candidates = new Set<string>();

  function addCandidate(value: string) {
    if (value !== correct) {
      candidates.add(value);
    }
  }

  addCandidate(`${-h};${k}`);

  addCandidate(`${h};${-k}`);

  addCandidate(`${k};${h}`);

  addCandidate(`${h + 1};${k}`);

  addCandidate(`${h - 1};${k}`);

  addCandidate(`${h};${k + 1}`);

  addCandidate(`${h};${k - 1}`);

  let offset = 2;

  while (candidates.size < 3) {
    addCandidate(`${h + offset};${k + offset}`);

    offset++;
  }

  const options: QuestionOption[] = shuffle([
    correct,

    ...Array.from(candidates).slice(0, 3),
  ]).map((value, index) => {
    const [x, y] = value.split(';');

    return {
      id: String(index),

      value,

      math: `(${x};${y})`,
    };
  });

  const inside = h >= 0 ? `x-${h}` : `x+${Math.abs(h)}`;

  const constantPart = k === 0 ? '' : k > 0 ? `+${k}` : `-${Math.abs(k)}`;

  return {
    id: crypto.randomUUID(),

    generatorId: 'function',

    familyId: 'functions',

    variantKey: `function:vertex:${a}:${h}:${k}`,

    topicId: 'functions',

    type: 'single-choice',

    title: 'Вершина параболи',

    text: 'Визначте координати вершини параболи.',

    math: `f(x)=${a}(${inside})^2${constantPart}`,

    options,

    correctAnswer: correct,

    solution: [
      {
        math: `f(x)=a(x-h)^2+k`,
      },

      {
        text: 'Вершина параболи має координати (h; k).',
      },

      {
        math: `(${h};${k})`,
      },
    ],
  };
}

// ========================================
// graph + value
// ========================================

function generateGraphValue(config: FunctionConfig): Question {
  const a = randomNonZeroFromRange(config.coefficientRange);

  const b = randomFromRange(config.constantRange);

  const x = randomFromRange(config.xRange);

  const answer = a * x + b;

  return {
    id: crypto.randomUUID(),

    generatorId: 'function',

    familyId: 'functions',

    variantKey: `function:graph-value:${a}:${b}:${x}`,

    topicId: 'functions',

    type: 'single-choice',

    title: 'Графік функції',

    text: `За функцією визначте значення y при x = ${x}.`,

    math: `y=${formatLinearExpression(a, b)}`,

    visual: {
      type: 'function',

      expression: `${a}*x+(${b})`,

      xMin: -10,

      xMax: 10,

      yMin: -20,

      yMax: 20,
    },

    options: createNumericOptions(answer, [
      answer + 1,

      answer - 1,

      -answer,

      a + b,

      a * x,
    ]),

    correctAnswer: String(answer),

    solution: [
      {
        math: `y=${a}\\cdot(${x})${signedConstant(b)}`,
      },

      {
        math: `y=${answer}`,
      },
    ],
  };
}

const generatorsByForm: Record<
  FunctionForm,
  (config: FunctionConfig) => Question
> = {
  value: generateValue,

  zeros: generateZeros,

  vertex: generateVertex,

  'graph-value': generateGraphValue,
};

export function generateFunction(config: FunctionConfig): Question {
  if (config.forms.length === 0) {
    throw new Error('Не задано жодної форми для функцій.');
  }

  const form = randomItem(config.forms);

  return generatorsByForm[form](config);
}
