import type { DiscreteMathConfig, DiscreteMathForm } from '@/types/generator';

import type { Question } from '@/types/question';

import { createNumericOptions } from '@/utils/createNumericOptions';

import { randomFromRange, randomItem } from '@/utils/random';

import { shuffle } from '@/utils/shuffle';

function createSet(config: DiscreteMathConfig): number[] {
  const values = new Set<number>();

  while (values.size < 4) {
    values.add(randomFromRange(config.valueRange));
  }

  return Array.from(values).sort((a, b) => a - b);
}

function setKey(values: number[]): string {
  if (values.length === 0) {
    return 'empty-set';
  }

  return values.join(',');
}

function setMath(values: number[]): string {
  if (values.length === 0) {
    return '\\varnothing';
  }

  return `\\{${values.join(',')}\\}`;
}
function generateSetUnion(config: DiscreteMathConfig): Question {
  const a = createSet(config);

  const b = createSet(config);

  const result = Array.from(new Set([...a, ...b])).sort((x, y) => x - y);

  const answer = setKey(result);

  const candidates = [
    a,
    b,

    a.filter((value) => b.includes(value)),

    result.slice(0, Math.max(1, result.length - 1)),
  ];

  const unique = new Map<string, number[]>();

  for (const candidate of candidates) {
    const key = setKey(candidate);

    if (key !== answer) {
      unique.set(key, candidate);
    }
  }

  let fallback = 100;

  while (unique.size < 4) {
    const candidate = [...result, fallback];

    unique.set(setKey(candidate), candidate);

    fallback++;
  }

  const options = shuffle([
    result,
    ...Array.from(unique.values()).slice(0, 4),
  ]).map((values, index) => ({
    id: String(index),

    value: setKey(values),

    math: setMath(values),
  }));

  return {
    id: crypto.randomUUID(),

    generatorId: 'discrete-math',

    familyId: 'discrete-math',

    variantKey: `discrete:union:${setKey(a)}:${setKey(b)}`,

    topicId: 'discrete-math',

    type: 'single-choice',

    title: 'Об’єднання множин',

    math: `A=${setMath(a)},\\quad B=${setMath(b)}`,

    text: 'Знайдіть A ∪ B.',

    options,

    correctAnswer: answer,

    solution: [
      {
        text: 'Об’єднання містить усі елементи обох множин без повторів.',
      },

      {
        math: `A\\cup B=${setMath(result)}`,
      },
    ],
  };
}

function generateSetIntersection(config: DiscreteMathConfig): Question {
  const shared = [
    randomFromRange(config.valueRange),

    randomFromRange(config.valueRange),
  ];

  const a = Array.from(
    new Set([...shared, ...createSet(config).slice(0, 2)]),
  ).sort((x, y) => x - y);

  const b = Array.from(
    new Set([...shared, ...createSet(config).slice(0, 2)]),
  ).sort((x, y) => x - y);

  const result = a.filter((value) => b.includes(value));

  const answer = setKey(result);

  const all = Array.from(new Set([...a, ...b])).sort((x, y) => x - y);

  const options = [result, a, b, all];

  const unique = new Map<string, number[]>();

  for (const item of options) {
    const key = setKey(item);

    if (key !== answer) {
      unique.set(key, item);
    }
  }

  let fallback = 100;

  while (unique.size < 4) {
    const candidate = [fallback];

    unique.set(setKey(candidate), candidate);

    fallback++;
  }

  return {
    id: crypto.randomUUID(),

    generatorId: 'discrete-math',

    familyId: 'discrete-math',

    variantKey: `discrete:intersection:${setKey(a)}:${setKey(b)}`,

    topicId: 'discrete-math',

    type: 'single-choice',

    title: 'Перетин множин',

    math: `A=${setMath(a)},\\quad B=${setMath(b)}`,

    text: 'Знайдіть A ∩ B.',

    options: shuffle([result, ...Array.from(unique.values()).slice(0, 4)]).map(
      (values, index) => ({
        id: String(index),

        value: setKey(values),

        math: setMath(values),
      }),
    ),

    correctAnswer: answer,

    solution: [
      {
        text: 'Перетин містить елементи, що належать одночасно обом множинам.',
      },

      {
        math: `A\\cap B=${setMath(result)}`,
      },
    ],
  };
}

function generateSetCardinality(config: DiscreteMathConfig): Question {
  const values = createSet(config);

  const answer = values.length;

  return {
    id: crypto.randomUUID(),

    generatorId: 'discrete-math',

    familyId: 'discrete-math',

    variantKey: `discrete:cardinality:${setKey(values)}`,

    topicId: 'discrete-math',

    type: 'single-choice',

    title: 'Потужність множини',

    math: `A=${setMath(values)}`,

    text: 'Знайдіть |A|.',

    options: createNumericOptions(answer, [
      answer + 1,
      answer - 1,
      values.reduce((sum, value) => sum + value, 0),

      2 ** answer,
    ]),

    correctAnswer: String(answer),

    solution: [
      {
        text: `Множина містить ${answer} різних елементів.`,
      },

      {
        math: `|A|=${answer}`,
      },
    ],
  };
}

function generateLogicImplication(): Question {
  const p = randomItem([true, false]);

  const q = randomItem([true, false]);

  const answer = !p || q;

  const value = answer ? 'true' : 'false';

  return {
    id: crypto.randomUUID(),

    generatorId: 'discrete-math',

    familyId: 'discrete-math',

    variantKey: `discrete:implication:${p}:${q}`,

    topicId: 'discrete-math',

    type: 'single-choice',

    title: 'Логічна імплікація',

    text: `p = ${p ? 'істина' : 'хиба'}, q = ${q ? 'істина' : 'хиба'}. Визначте p → q.`,

    options: [
      {
        id: 'true',
        value: 'true',
        text: 'Істина',
      },

      {
        id: 'false',
        value: 'false',
        text: 'Хиба',
      },
    ],

    correctAnswer: value,

    solution: [
      {
        text: 'Імплікація є хибною лише коли p істинне, а q хибне.',
      },

      {
        text: `Відповідь: ${answer ? 'істина' : 'хиба'}.`,
      },
    ],
  };
}

function generateGraphHandshake(config: DiscreteMathConfig): Question {
  const minVertices = 3;

  const rawVertexCount = Math.abs(randomFromRange(config.valueRange));

  const vertexCount = Math.max(minVertices, rawVertexCount);

  const possibleDegrees = [1, 2, 3, 4].filter(
    (degree) => degree < vertexCount && (vertexCount * degree) % 2 === 0,
  );

  const degree = possibleDegrees.length > 0 ? randomItem(possibleDegrees) : 2;

  const sumDegrees = vertexCount * degree;

  const answer = sumDegrees / 2;

  return {
    id: crypto.randomUUID(),

    generatorId: 'discrete-math',

    familyId: 'discrete-math',

    variantKey: `discrete:handshake:${vertexCount}:${degree}:${sumDegrees}`,

    topicId: 'discrete-math',

    type: 'single-choice',

    title: 'Лема про рукостискання',

    text:
      `У ${degree}-регулярному графі ${vertexCount} вершин. ` +
      'Скільки ребер має граф?',

    options: createNumericOptions(answer, [
      sumDegrees,
      vertexCount,
      degree,
      answer + 1,
      answer - 1,
    ]),

    correctAnswer: String(answer),

    solution: [
      {
        text: 'За лемою про рукостискання сума степенів усіх вершин дорівнює подвоєній кількості ребер.',
      },

      {
        math: `\\sum \\deg(v)=2|E|`,
      },

      {
        math: `${vertexCount}\\cdot${degree}=2|E|`,
      },

      {
        math: `|E|=\\frac{${vertexCount}\\cdot${degree}}{2}=${answer}`,
      },
    ],
  };
}

const generatorsByForm: Record<
  DiscreteMathForm,
  (config: DiscreteMathConfig) => Question
> = {
  'set-union': generateSetUnion,

  'set-intersection': generateSetIntersection,

  'set-cardinality': generateSetCardinality,

  'logic-implication': () => generateLogicImplication(),

  'graph-handshake': generateGraphHandshake,
};

export function generateDiscreteMath(config: DiscreteMathConfig): Question {
  if (config.forms.length === 0) {
    throw new Error('Не задано форм дискретної математики.');
  }

  return generatorsByForm[randomItem(config.forms)](config);
}
