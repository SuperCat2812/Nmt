import { describe, expect, it } from 'vitest';

import {
  generateTrainingQuestion,
  selectTrainingTopicId,
} from '@/engine/trainingQuestionFactory';

import { resetQuestions } from '@/engine/questionManager';

import { validateQuestion } from '@/test/helpers/validateQuestion';

describe('trainingQuestionFactory', () => {
  it('single-topic завжди повертає вибрану тему', () => {
    const topicId = selectTrainingTopicId({
      mode: 'single-topic',

      questionCount: 10,

      topicIds: ['fractions'],
    });

    expect(topicId).toBe('fractions');
  });

  it('mixed повертає тільки дозволену тему', () => {
    const allowed = ['fractions', 'percentages'];

    for (let i = 0; i < 100; i++) {
      const topicId = selectTrainingTopicId({
        mode: 'mixed',

        questionCount: 10,

        topicIds: allowed,
      });

      expect(allowed).toContain(topicId);
    }
  });

  it('генерує валідне питання', () => {
    resetQuestions();

    for (let i = 0; i < 100; i++) {
      const question = generateTrainingQuestion({
        mode: 'single-topic',

        questionCount: 10,

        topicIds: ['fractions'],
      });

      validateQuestion(question);

      expect(question.topicId).toBe('fractions');
    }
  });

  it('не дозволяє порожній список тем', () => {
    expect(() =>
      selectTrainingTopicId({
        mode: 'mixed',

        questionCount: 10,

        topicIds: [],
      }),
    ).toThrow();
  });
});
