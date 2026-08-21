import type {
  QuadraticEquationConfig,
  QuadraticEquationForm,
} from '@/types/generator';

import type { Question, QuestionOption } from '@/types/question';

import { randomFromRange, randomItem } from '@/utils/random';

import { shuffle } from '@/utils/shuffle';

function formatTerm(coefficient: number, variable: string): string {
  if (coefficient === 0) {
    return '';
  }

  if (coefficient === 1) {
    return ` + ${variable}`;
  }

  if (coefficient === -1) {
    return ` - ${variable}`;
  }

  return coefficient > 0
    ? ` + ${coefficient}${variable}`
    : ` - ${Math.abs(coefficient)}${variable}`;
}

function createRootOptions(x1: number, x2: number): QuestionOption[] {
  const normalized = [Math.min(x1, x2), Math.max(x1, x2)];

  const correct = `${normalized[0]};${normalized[1]}`;

  const candidates = new Set<string>();

  function add(a: number, b: number) {
    const values = [Math.min(a, b), Math.max(a, b)];

    const value = `${values[0]};${values[1]}`;

    if (value !== correct) {
      candidates.add(value);
    }
  }

  add(-x1, x2);

  add(x1, -x2);

  add(-x1, -x2);

  add(x1 + 1, x2);

  add(x1, x2 + 1);

  let offset = 2;

  while (candidates.size < 4) {
    add(x1 + offset, x2);

    offset++;
  }

  return shuffle([correct, ...Array.from(candidates).slice(0, 4)]).map(
    (value, index) => {
      const [first, second] = value.split(';');

      return {
        id: String(index),

        value,

        math: `x_1=${first},\\;x_2=${second}`,
      };
    },
  );
}

function generateTwoRoots(config: QuadraticEquationConfig): Question {
  const x1 = randomFromRange(config.rootRange);

  let x2 = randomFromRange(config.rootRange);

  while (x1 === x2) {
    x2 = randomFromRange(config.rootRange);
  }

  const b = -(x1 + x2);

  const c = x1 * x2;

  const equation = `x^2${formatTerm(b, 'x')}${formatTerm(c, '')} = 0`;

  const sortedRoots = [Math.min(x1, x2), Math.max(x1, x2)];

  return {
    id: crypto.randomUUID(),

    generatorId: 'quadratic-equation',

    familyId: 'equations',

    variantKey: `quadratic:two-roots:${x1}:${x2}`,

    topicId: 'equations',

    type: 'single-choice',

    title: 'Квадратне рівняння',

    math: equation,

    options: createRootOptions(x1, x2),

    correctAnswer: `${sortedRoots[0]};${sortedRoots[1]}`,

    solution: [
      {
        text: 'Використаємо теорему Вієта.',
      },
      {
        math: `x_1+x_2=${-b}`,
      },
      {
        math: `x_1x_2=${c}`,
      },
      {
        math: `x_1=${sortedRoots[0]},\\;x_2=${sortedRoots[1]}`,
      },
    ],
  };
}

function generateDoubleRoot(config: QuadraticEquationConfig): Question {
  const root = randomFromRange(config.rootRange);

  const b = -2 * root;

  const c = root ** 2;

  const equation = `x^2${formatTerm(b, 'x')}${formatTerm(c, '')} = 0`;

  const options = shuffle([root, -root, root + 1, root - 1, root + 2])
    .filter((value, index, array) => array.indexOf(value) === index)
    .slice(0, 5)
    .map((value, index) => ({
      id: String(index),

      value: String(value),

      text: String(value),
    }));

  return {
    id: crypto.randomUUID(),

    generatorId: 'quadratic-equation',

    familyId: 'equations',

    variantKey: `quadratic:double-root:${root}`,

    topicId: 'equations',

    type: 'single-choice',

    title: 'Квадратне рівняння',

    math: equation,

    options,

    correctAnswer: String(root),

    solution: [
      {
        math: `D = ${b}^2 - 4\\cdot1\\cdot${c}`,
      },
      {
        math: `D = 0`,
      },
      {
        math: `x = \\frac{-(${b})}{2} = ${root}`,
      },
    ],
  };
}

const generatorsByForm: Record<
  QuadraticEquationForm,
  (config: QuadraticEquationConfig) => Question
> = {
  'two-roots': generateTwoRoots,

  'double-root': generateDoubleRoot,
};

export function generateQuadraticEquation(
  config: QuadraticEquationConfig,
): Question {
  if (config.forms.length === 0) {
    throw new Error('Не задано жодної форми квадратного рівняння.');
  }

  const form = randomItem(config.forms);

  return generatorsByForm[form](config);
}
