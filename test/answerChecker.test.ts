import { describe, expect, it } from 'vitest';

import { checkAnswer } from '@/engine/answerChecker';

import type { Question } from '@/types/question';

function createNumericQuestion(correctAnswer: string | number): Question {
  return {
    id: 'test',

    generatorId: 'test',

    familyId: 'test',

    variantKey: 'test',

    topicId: 'test',

    type: 'numeric',

    title: 'Test',

    correctAnswer,

    solution: [
      {
        text: 'Test',
      },
    ],
  };
}

describe('answerChecker', () => {
  it('розуміє десяткову кому', () => {
    expect(checkAnswer(createNumericQuestion(2.5), '2,5')).toBe(true);
  });

  it('розуміє еквівалентний дріб', () => {
    expect(checkAnswer(createNumericQuestion('1/2'), '2/4')).toBe(true);
  });

  it('розуміє дріб і десяткове число', () => {
    expect(checkAnswer(createNumericQuestion('1/2'), '0.5')).toBe(true);
  });

  it('відхиляє неправильну відповідь', () => {
    expect(checkAnswer(createNumericQuestion(5), '4')).toBe(false);
  });
});
