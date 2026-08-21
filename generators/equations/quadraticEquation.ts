import type {
  QuadraticEquationConfig,
  QuadraticEquationForm,
} from '@/types/generator';

import type { Question, QuestionOption } from '@/types/question';

import { randomFromRange, randomItem } from '@/utils/random';

import { shuffle } from '@/utils/shuffle';

function createRootPairOptions(
  first: number,
  second: number,
): {
  options: QuestionOption[];
  correct: string;
} {
  const x1 = Math.min(first, second);

  const x2 = Math.max(first, second);

  const correct = `${x1};${x2}`;

  const candidates = new Set<string>();

  function addCandidate(value: string) {
    if (value !== correct) {
      candidates.add(value);
    }
  }

  addCandidate(`${-x1};${x2}`);

  addCandidate(`${x1};${-x2}`);

  addCandidate(`${x1 + 1};${x2}`);

  addCandidate(`${x1};${x2 + 1}`);

  addCandidate(`${x1 - 1};${x2}`);

  addCandidate(`${x1};${x2 - 1}`);

  let offset = 2;

  while (candidates.size < 3) {
    addCandidate(`${x1 + offset};${x2 + offset}`);

    offset++;
  }

  const options = shuffle([correct, ...Array.from(candidates).slice(0, 3)]).map(
    (value, index) => {
      const [root1, root2] = value.split(';');

      return {
        id: String(index),

        value,

        math: `x_1=${root1},\\;x_2=${root2}`,
      };
    },
  );

  return {
    options,
    correct,
  };
}

function createSingleRootOptions(root: number): QuestionOption[] {
  const values = new Set<number>();

  values.add(root);

  const candidates = [-root, root + 1, root - 1, root + 2, root - 2];

  for (const candidate of candidates) {
    values.add(candidate);

    if (values.size >= 4) {
      break;
    }
  }

  let offset = 3;

  while (values.size < 4) {
    values.add(root + offset);

    offset++;
  }

  return shuffle(Array.from(values).slice(0, 4)).map((value, index) => ({
    id: String(index),

    value: String(value),

    math: `x=${value}`,
  }));
}

function factorByRoot(root: number): string {
  if (root >= 0) {
    return `(x-${root})`;
  }

  return `(x+${Math.abs(root)})`;
}

function formatQuadratic(b: number, c: number): string {
  const bPart = b === 0 ? '' : b > 0 ? `+${b}x` : `-${Math.abs(b)}x`;

  const cPart = c === 0 ? '' : c > 0 ? `+${c}` : `-${Math.abs(c)}`;

  return `x^2${bPart}${cPart}=0`;
}

// ========================================
// TWO ROOTS
// ========================================

function generateTwoRoots(config: QuadraticEquationConfig): Question {
  const root1 = randomFromRange(config.rootRange);

  let root2 = randomFromRange(config.rootRange);

  while (root1 === root2) {
    root2 = randomFromRange(config.rootRange);
  }

  /*
   * ВАЖНО:
   *
   * Не делаем:
   *
   * first = Math.min(first, second);
   * second = Math.max(first, second);
   *
   * потому что first уже изменён перед
   * вычислением second.
   *
   * Например:
   *
   * first = 5
   * second = -8
   *
   * после первой строки first = -8,
   * затем Math.max(-8, -8) тоже даст -8.
   *
   * В результате два разных корня
   * превращались в один.
   */

  const first = Math.min(root1, root2);

  const second = Math.max(root1, root2);

  const b = -(first + second);

  const c = first * second;

  const discriminant = b ** 2 - 4 * c;

  const pair = createRootPairOptions(first, second);

  return {
    id: crypto.randomUUID(),

    generatorId: 'quadratic-equation',

    familyId: 'equations',

    variantKey: `quadratic:two-roots:${first}:${second}`,

    topicId: 'equations',

    type: 'single-choice',

    title: 'Квадратне рівняння',

    text: 'Розв’яжіть квадратне рівняння.',

    math: formatQuadratic(b, c),

    options: pair.options,

    correctAnswer: pair.correct,

    solution: [
      {
        math: `D=(${b})^2-4\\cdot1\\cdot(${c})=${discriminant}`,
      },

      {
        math: `x=\\frac{-(${b})\\pm\\sqrt{${discriminant}}}{2}`,
      },

      {
        math: `x_1=${first},\\quad x_2=${second}`,
      },

      {
        text: 'Перевірка першого кореня:',
      },

      {
        math: `(${first})^2+(${b})\\cdot(${first})+(${c})=0`,
      },

      {
        text: 'Перевірка другого кореня:',
      },

      {
        math: `(${second})^2+(${b})\\cdot(${second})+(${c})=0`,
      },
    ],
  };
}

// ========================================
// DOUBLE ROOT
// ========================================

function generateDoubleRoot(config: QuadraticEquationConfig): Question {
  const root = randomFromRange(config.rootRange);

  const b = -2 * root;

  const c = root ** 2;

  const discriminant = b ** 2 - 4 * c;

  return {
    id: crypto.randomUUID(),

    generatorId: 'quadratic-equation',

    familyId: 'equations',

    variantKey: `quadratic:double-root:${root}`,

    topicId: 'equations',

    type: 'single-choice',

    title: 'Квадратне рівняння',

    text: 'Знайдіть корінь квадратного рівняння.',

    math: formatQuadratic(b, c),

    options: createSingleRootOptions(root),

    correctAnswer: String(root),

    solution: [
      {
        math: `D=(${b})^2-4\\cdot1\\cdot(${c})=${discriminant}`,
      },

      {
        math: `D=0`,
      },

      {
        math: `x=\\frac{-(${b})}{2}=${root}`,
      },

      {
        math: `${factorByRoot(root)}^2=0`,
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
