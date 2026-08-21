import type { ProbabilityConfig, ProbabilityForm } from '@/types/generator';
import type { Question, QuestionOption } from '@/types/question';
import { randomFromRange, randomItem } from '@/utils/random';
import { shuffle } from '@/utils/shuffle';

function createProbabilityOptions(
  answer: number,
  candidates: number[],
): QuestionOption[] {
  const normalizedAnswer = roundProbability(answer);

  const unique = new Set<number>();

  function add(value: number) {
    const normalized = roundProbability(value);

    if (
      Number.isFinite(normalized) &&
      normalized >= 0 &&
      normalized <= 1 &&
      normalized !== normalizedAnswer
    ) {
      unique.add(normalized);
    }
  }

  for (const candidate of candidates) {
    add(candidate);
  }

  // Гарантированный набор допустимых
  // вероятностей от 0 до 1.
  for (let value = 0; value <= 1; value += 0.05) {
    add(value);

    if (unique.size >= 3) {
      break;
    }
  }

  if (unique.size < 3) {
    throw new Error('Не вдалося створити варіанти ймовірності.');
  }

  return shuffle([normalizedAnswer, ...Array.from(unique).slice(0, 3)]).map(
    (value, index) => ({
      id: String(index),

      value: String(value),

      text: String(value),
    }),
  );
}

function roundProbability(value: number): number {
  return Math.round(value * 1000) / 1000;
}

function generateClassical(config: ProbabilityConfig): Question {
  const total = Math.max(2, randomFromRange(config.countRange));

  const favorable = randomFromRange([1, total - 1]);

  const answer = roundProbability(favorable / total);

  return {
    id: crypto.randomUUID(),

    generatorId: 'probability',

    familyId: 'probability',

    variantKey: `probability:classical:${favorable}:${total}`,

    topicId: 'probability',

    type: 'single-choice',

    title: 'Класична ймовірність',

    text: `Є ${total} рівноймовірних результатів, з них ${favorable} сприятливих. Знайдіть ймовірність події.`,

    options: createProbabilityOptions(answer, [
      total / favorable,

      (total - favorable) / total,

      favorable / (total + 1),

      1 - answer,

      answer / 2,
    ]),

    correctAnswer: String(answer),

    solution: [
      {
        math: `P=\\frac{m}{n}`,
      },
      {
        math: `P=\\frac{${favorable}}{${total}}=${answer}`,
      },
    ],
  };
}

function generateComplement(): Question {
  const tenths = randomItem([1, 2, 3, 4, 5, 6, 7, 8, 9]);

  const probability = tenths / 10;

  const answer = roundProbability(1 - probability);

  return {
    id: crypto.randomUUID(),

    generatorId: 'probability',

    familyId: 'probability',

    variantKey: `probability:complement:${probability}`,

    topicId: 'probability',

    type: 'single-choice',

    title: 'Протилежна подія',

    text: `Ймовірність події A дорівнює ${probability}. Знайдіть ймовірність протилежної події.`,

    options: createProbabilityOptions(answer, [
      probability,
      probability / 2,
      answer / 2,
      1 + probability,
      Math.abs(probability - answer),
    ]),

    correctAnswer: String(answer),

    solution: [
      {
        math: `P(\\overline A)=1-P(A)`,
      },
      {
        math: `=1-${probability}=${answer}`,
      },
    ],
  };
}

function generateIndependentEvents(): Question {
  const p1 = randomItem([0.2, 0.25, 0.4, 0.5, 0.6, 0.75, 0.8]);

  const p2 = randomItem([0.2, 0.25, 0.4, 0.5, 0.6, 0.75, 0.8]);

  const answer = roundProbability(p1 * p2);

  return {
    id: crypto.randomUUID(),

    generatorId: 'probability',

    familyId: 'probability',

    variantKey: `probability:independent:${p1}:${p2}`,

    topicId: 'probability',

    type: 'single-choice',

    title: 'Незалежні події',

    text: `Події A і B незалежні. P(A)=${p1}, P(B)=${p2}. Знайдіть P(A∩B).`,

    options: createProbabilityOptions(answer, [
      p1 + p2,
      Math.abs(p1 - p2),

      1 - answer,
      p1,
      p2,
    ]),
    correctAnswer: String(answer),

    solution: [
      {
        math: `P(A\\cap B)=P(A)P(B)`,
      },
      {
        math: `=${p1}\\cdot${p2}=${answer}`,
      },
    ],
  };
}

const generatorsByForm: Record<
  ProbabilityForm,
  (config: ProbabilityConfig) => Question
> = {
  classical: generateClassical,

  complement: () => generateComplement(),

  'independent-events': () => generateIndependentEvents(),
};

export function generateProbability(config: ProbabilityConfig): Question {
  if (config.forms.length === 0) {
    throw new Error('Не задано форм ймовірності.');
  }

  return generatorsByForm[randomItem(config.forms)](config);
}
