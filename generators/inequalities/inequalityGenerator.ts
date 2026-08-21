import type { InequalityConfig, InequalityForm } from '@/types/generator';

import type { Question, QuestionOption } from '@/types/question';

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

function createTextOptions(
  correct: string,
  candidates: string[],
): QuestionOption[] {
  const unique = Array.from(
    new Set(candidates.filter((value) => value !== correct)),
  );

  if (unique.length < 3) {
    throw new Error('Недостатньо варіантів відповіді для нерівності.');
  }

  return shuffle([correct, ...unique.slice(0, 3)]).map((value, index) => ({
    id: String(index),
    value,
    math: value,
  }));
}

function generateLinear(config: InequalityConfig): Question {
  const boundary = randomFromRange(config.rootRange);

  const a = randomNonZeroFromRange(config.coefficientRange);

  const b = randomFromRange(config.constantRange);

  const c = a * boundary + b;

  const answer = a > 0 ? `(-\\infty;${boundary})` : `(${boundary};+\\infty)`;

  const options = createTextOptions(answer, [
    `(-\\infty;${boundary}]`,
    `[${boundary};+\\infty)`,
    `(${boundary};+\\infty)`,
    `(-\\infty;${boundary})`,
    `{${boundary}}`,
  ]);

  return {
    id: crypto.randomUUID(),

    generatorId: 'inequality',

    familyId: 'inequalities',

    variantKey: `inequality:linear:${a}:${b}:${c}:${boundary}`,

    topicId: 'inequalities',

    type: 'single-choice',

    title: 'Лінійна нерівність',

    math: `${formatLinearExpression(a, b)}<${c}`,

    options,

    correctAnswer: answer,

    solution: [
      {
        math: `${a}x < ${c - b}`,
      },

      ...(a < 0
        ? [
            {
              text: 'Під час ділення на від’ємне число знак нерівності змінюємо.',
            },
          ]
        : []),

      {
        math: a > 0 ? `x<${boundary}` : `x>${boundary}`,
      },

      {
        math: answer,
      },
    ],
  };
}

function generateQuadratic(config: InequalityConfig): Question {
  const first = randomFromRange(config.rootRange);

  let second = randomFromRange(config.rootRange);

  while (first === second) {
    second = randomFromRange(config.rootRange);
  }

  const r1 = Math.min(first, second);

  const r2 = Math.max(first, second);

  const b = -(r1 + r2);

  const c = r1 * r2;

  const expression = formatQuadraticExpression(1, b, c);

  const answer = `(-\\infty;${r1})\\cup(${r2};+\\infty)`;

  const options = createTextOptions(answer, [
    `(${r1};${r2})`,
    `[${r1};${r2}]`,
    `(-\\infty;${r1}]\\cup[${r2};+\\infty)`,
    `(-\\infty;${r2})`,
    `(${r1};+\\infty)`,
  ]);

  return {
    id: crypto.randomUUID(),

    generatorId: 'inequality',

    familyId: 'inequalities',

    variantKey: `inequality:quadratic:${r1}:${r2}`,

    topicId: 'inequalities',

    type: 'single-choice',

    title: 'Квадратна нерівність',

    math: `${expression}>0`,

    options,

    correctAnswer: answer,

    solution: [
      {
        text: 'Знайдемо нулі квадратного тричлена.',
      },
      {
        math: `x_1=${r1},\\quad x_2=${r2}`,
      },
      {
        text: 'Оскільки старший коефіцієнт додатний, вираз додатний поза коренями.',
      },
      {
        math: answer,
      },
    ],
  };
}

function generateSystem(config: InequalityConfig): Question {
  let lower = randomFromRange(config.rootRange);

  let upper = randomFromRange(config.rootRange);

  while (lower === upper) {
    upper = randomFromRange(config.rootRange);
  }

  if (lower > upper) {
    [lower, upper] = [upper, lower];
  }

  const answer = `(${lower};${upper})`;

  const options = createTextOptions(answer, [
    `[${lower};${upper}]`,
    `(-\\infty;${lower})`,
    `(${upper};+\\infty)`,
    `(-\\infty;${lower})\\cup(${upper};+\\infty)`,
  ]);

  return {
    id: crypto.randomUUID(),

    generatorId: 'inequality',

    familyId: 'inequalities',

    variantKey: `inequality:system:${lower}:${upper}`,

    topicId: 'inequalities',

    type: 'single-choice',

    title: 'Система нерівностей',

    math: `\\begin{cases}
x>${lower},\\\\
x<${upper}
\\end{cases}`,

    options,

    correctAnswer: answer,

    solution: [
      {
        text: 'Знайдемо перетин множин розв’язків.',
      },
      {
        math: `x>${lower}`,
      },
      {
        math: `x<${upper}`,
      },
      {
        math: answer,
      },
    ],
  };
}

const generatorsByForm: Record<
  InequalityForm,
  (config: InequalityConfig) => Question
> = {
  linear: generateLinear,

  quadratic: generateQuadratic,

  'system-linear': generateSystem,
};

export function generateInequality(config: InequalityConfig): Question {
  if (config.forms.length === 0) {
    throw new Error('Не задано жодної форми нерівностей.');
  }

  const form = randomItem(config.forms);

  return generatorsByForm[form](config);
}
