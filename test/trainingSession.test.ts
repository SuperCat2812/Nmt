import { describe, expect, it } from 'vitest';

import {
  calculateTopicProgress,
  calculateTrainingResult,
  createTrainingSession,
  finishTrainingSession,
  getElapsedSeconds,
  getRemainingSeconds,
  isTimeExpired,
  moveToNextQuestion,
  shouldFinishTraining,
  startTrainingSession,
  submitTrainingAnswer,
} from '@/engine/trainingSession';

import type { Question } from '@/types/question';

function createQuestion(id: string, topicId = 'fractions'): Question {
  return {
    id,

    generatorId: 'fraction',

    familyId: 'fractions',

    variantKey: `test:${id}`,

    topicId,

    type: 'single-choice',

    title: 'Test',

    options: [
      {
        id: '1',
        value: '1',
        text: '1',
      },

      {
        id: '2',
        value: '2',
        text: '2',
      },
    ],

    correctAnswer: '1',

    solution: [
      {
        text: 'Solution',
      },
    ],
  };
}

describe('trainingSession', () => {
  it('створює нову сесію', () => {
    const session = createTrainingSession({
      mode: 'single-topic',

      questionCount: 10,

      topicIds: ['fractions'],
    });

    expect(session.status).toBe('idle');

    expect(session.answers).toHaveLength(0);

    expect(session.settings.questionCount).toBe(10);
  });

  it('не дозволяє тренування без тем', () => {
    expect(() =>
      createTrainingSession({
        mode: 'mixed',

        questionCount: 10,

        topicIds: [],
      }),
    ).toThrow();
  });

  it('single-topic дозволяє лише одну тему', () => {
    expect(() =>
      createTrainingSession({
        mode: 'single-topic',

        questionCount: 10,

        topicIds: ['fractions', 'percentages'],
      }),
    ).toThrow();
  });

  it('запускає сесію', () => {
    const session = createTrainingSession({
      mode: 'single-topic',

      questionCount: 5,

      topicIds: ['fractions'],
    });

    const started = startTrainingSession(session, createQuestion('q1'), 1000);

    expect(started.status).toBe('running');

    expect(started.startedAt).toBe(1000);

    expect(started.currentQuestion?.id).toBe('q1');
  });

  it('зберігає відповідь', () => {
    let session = createTrainingSession({
      mode: 'single-topic',

      questionCount: 2,

      topicIds: ['fractions'],
    });

    session = startTrainingSession(session, createQuestion('q1'), 1000);

    session = submitTrainingAnswer(session, {
      userAnswer: '1',

      isCorrect: true,

      questionStartedAt: 1000,

      answeredAt: 6000,
    });

    expect(session.answers).toHaveLength(1);

    expect(session.answers[0].isCorrect).toBe(true);

    expect(session.answers[0].timeSpentSeconds).toBe(5);
  });

  it('переходить до наступного питання', () => {
    let session = createTrainingSession({
      mode: 'single-topic',

      questionCount: 2,

      topicIds: ['fractions'],
    });

    session = startTrainingSession(session, createQuestion('q1'));

    session = submitTrainingAnswer(session, {
      userAnswer: '1',

      isCorrect: true,

      questionStartedAt: Date.now(),
    });

    session = moveToNextQuestion(session, createQuestion('q2'));

    expect(session.currentQuestionIndex).toBe(1);

    expect(session.currentQuestion?.id).toBe('q2');
  });

  it('визначає завершення тренування', () => {
    let session = createTrainingSession({
      mode: 'single-topic',

      questionCount: 1,

      topicIds: ['fractions'],
    });

    session = startTrainingSession(session, createQuestion('q1'));

    session = submitTrainingAnswer(session, {
      userAnswer: '1',

      isCorrect: true,

      questionStartedAt: Date.now(),
    });

    expect(shouldFinishTraining(session)).toBe(true);
  });

  it('рахує результат', () => {
    let session = createTrainingSession({
      mode: 'mixed',

      questionCount: 2,

      topicIds: ['fractions', 'percentages'],
    });

    session = startTrainingSession(
      session,
      createQuestion('q1', 'fractions'),
      1000,
    );

    session = submitTrainingAnswer(session, {
      userAnswer: '1',

      isCorrect: true,

      questionStartedAt: 1000,

      answeredAt: 2000,
    });

    session = moveToNextQuestion(session, createQuestion('q2', 'percentages'));

    session = submitTrainingAnswer(session, {
      userAnswer: '2',

      isCorrect: false,

      questionStartedAt: 2000,

      answeredAt: 4000,
    });

    session = finishTrainingSession(session, 4000);

    const result = calculateTrainingResult(session);

    expect(result.total).toBe(2);

    expect(result.correct).toBe(1);

    expect(result.incorrect).toBe(1);

    expect(result.accuracy).toBe(50);

    expect(result.elapsedSeconds).toBe(3);
  });

  it('рахує прогрес по темах', () => {
    const progress = calculateTopicProgress([
      {
        questionId: '1',

        generatorId: 'fraction',

        topicId: 'fractions',

        variantKey: '1',

        userAnswer: '1',

        correctAnswer: '1',

        isCorrect: true,

        answeredAt: 1,

        timeSpentSeconds: 2,
      },

      {
        questionId: '2',

        generatorId: 'fraction',

        topicId: 'fractions',

        variantKey: '2',

        userAnswer: '2',

        correctAnswer: '1',

        isCorrect: false,

        answeredAt: 2,

        timeSpentSeconds: 2,
      },
    ]);

    expect(progress).toHaveLength(1);

    expect(progress[0].accuracy).toBe(50);
  });

  it('працює таймер', () => {
    let session = createTrainingSession({
      mode: 'single-topic',

      questionCount: 10,

      topicIds: ['fractions'],

      timeLimitSeconds: 60,
    });

    session = startTrainingSession(session, createQuestion('q1'), 1000);

    expect(getElapsedSeconds(session, 31000)).toBe(30);

    expect(getRemainingSeconds(session, 31000)).toBe(30);

    expect(isTimeExpired(session, 61000)).toBe(true);
  });
});
