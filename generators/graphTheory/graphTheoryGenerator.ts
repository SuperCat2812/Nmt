import type { GraphTheoryConfig, GraphTheoryForm } from '@/types/generator';

import type { Question } from '@/types/question';

import { createNumericOptions } from '@/utils/createNumericOptions';

import { randomFromRange, randomItem } from '@/utils/random';

function vertexCount(config: GraphTheoryConfig): number {
  return Math.max(3, Math.abs(randomFromRange(config.vertexRange)));
}

function generateCompleteGraphEdges(config: GraphTheoryConfig): Question {
  const n = vertexCount(config);

  const answer = (n * (n - 1)) / 2;

  return {
    id: crypto.randomUUID(),

    generatorId: 'graph-theory',

    familyId: 'graph-theory',

    variantKey: `graph:complete:${n}`,

    topicId: 'graph-theory',

    type: 'single-choice',

    title: 'Повний граф',

    text: `Скільки ребер має повний граф K${n}?`,

    options: createNumericOptions(answer, [
      n,
      n - 1,
      n ** 2,
      n * (n - 1),
      answer + 1,
    ]),

    correctAnswer: String(answer),

    solution: [
      {
        math: `|E|=\\frac{n(n-1)}2`,
      },
      {
        math: `|E|=\\frac{${n}(${n}-1)}2=${answer}`,
      },
    ],
  };
}

function generateTreeEdges(config: GraphTheoryConfig): Question {
  const n = vertexCount(config);

  const answer = n - 1;

  return {
    id: crypto.randomUUID(),

    generatorId: 'graph-theory',

    familyId: 'graph-theory',

    variantKey: `graph:tree:${n}`,

    topicId: 'graph-theory',

    type: 'single-choice',

    title: 'Дерево',

    text: `Дерево має ${n} вершин. Скільки в ньому ребер?`,

    options: createNumericOptions(answer, [n, n + 1, n - 2, 2 * n, answer + 2]),

    correctAnswer: String(answer),

    solution: [
      {
        math: '|E|=|V|-1',
      },
      {
        math: `|E|=${n}-1=${answer}`,
      },
    ],
  };
}

function generateDegreeSum(config: GraphTheoryConfig): Question {
  const edges = Math.max(1, vertexCount(config));

  const answer = 2 * edges;

  return {
    id: crypto.randomUUID(),

    generatorId: 'graph-theory',

    familyId: 'graph-theory',

    variantKey: `graph:degree-sum:${edges}`,

    topicId: 'graph-theory',

    type: 'single-choice',

    title: 'Сума степенів вершин',

    text: `Граф має ${edges} ребер. Знайдіть суму степенів усіх його вершин.`,

    options: createNumericOptions(answer, [
      edges,
      edges + 1,
      edges - 1,
      3 * edges,
      answer + 1,
    ]),

    correctAnswer: String(answer),

    solution: [
      {
        math: '\\sum_v\\deg(v)=2|E|',
      },
      {
        math: `2\\cdot${edges}=${answer}`,
      },
    ],
  };
}

function generateCycleVertices(config: GraphTheoryConfig): Question {
  const n = vertexCount(config);

  const edges = n;

  return {
    id: crypto.randomUUID(),

    generatorId: 'graph-theory',

    familyId: 'graph-theory',

    variantKey: `graph:cycle:${n}`,

    topicId: 'graph-theory',

    type: 'single-choice',

    title: 'Цикл',

    text: `Цикл C${n} має ${edges} ребер. Скільки в ньому вершин?`,

    options: createNumericOptions(n, [n - 1, n + 1, 2 * n, edges + 2]),

    correctAnswer: String(n),

    solution: [
      {
        text: 'У циклі Cₙ кількість вершин дорівнює кількості ребер.',
      },
      {
        math: `|V|=|E|=${n}`,
      },
    ],
  };
}

function generatePathLength(config: GraphTheoryConfig): Question {
  const n = vertexCount(config);

  const answer = n - 1;

  return {
    id: crypto.randomUUID(),

    generatorId: 'graph-theory',

    familyId: 'graph-theory',

    variantKey: `graph:path:${n}`,

    topicId: 'graph-theory',

    type: 'single-choice',

    title: 'Шлях у графі',

    text: `Простий шлях проходить через ${n} різних вершин послідовно. Яка його довжина?`,

    options: createNumericOptions(answer, [n, n + 1, n - 2, 2 * n]),

    correctAnswer: String(answer),

    solution: [
      {
        text: 'Довжина шляху — кількість його ребер.',
      },
      {
        math: `${n}-1=${answer}`,
      },
    ],
  };
}

const generatorsByForm: Record<
  GraphTheoryForm,
  (config: GraphTheoryConfig) => Question
> = {
  'complete-graph-edges': generateCompleteGraphEdges,

  'tree-edges': generateTreeEdges,

  'degree-sum': generateDegreeSum,

  'cycle-vertices': generateCycleVertices,

  'path-length': generatePathLength,
};

export function generateGraphTheory(config: GraphTheoryConfig): Question {
  if (config.forms.length === 0) {
    throw new Error('Не задано форм теорії графів.');
  }

  return generatorsByForm[randomItem(config.forms)](config);
}
