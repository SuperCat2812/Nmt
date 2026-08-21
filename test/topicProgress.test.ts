import { describe, expect, it } from 'vitest';

import { calculateLifetimeTopicProgress } from '@/engine/topicProgress';

import type { TrainingHistoryItem } from '@/engine/trainingStorage';

describe('topicProgress', () => {
  it('обʼєднує прогрес кількох тренувань', () => {
    const history: TrainingHistoryItem[] = [
      {
        id: '1',

        courseId: 'test',

        startedAt: 1,

        finishedAt: 2,

        settings: {
          mode: 'single-topic',

          questionCount: 10,

          topicIds: ['fractions'],
        },

        result: {
          total: 10,

          correct: 8,

          incorrect: 2,

          accuracy: 80,

          elapsedSeconds: 100,

          topicProgress: [
            {
              topicId: 'fractions',

              answered: 10,

              correct: 8,

              incorrect: 2,

              accuracy: 80,
            },
          ],
        },
      },

      {
        id: '2',

        courseId: 'test',

        startedAt: 3,

        finishedAt: 4,

        settings: {
          mode: 'single-topic',

          questionCount: 10,

          topicIds: ['fractions'],
        },

        result: {
          total: 10,

          correct: 6,

          incorrect: 4,

          accuracy: 60,

          elapsedSeconds: 100,

          topicProgress: [
            {
              topicId: 'fractions',

              answered: 10,

              correct: 6,

              incorrect: 4,

              accuracy: 60,
            },
          ],
        },
      },
    ];

    const result = calculateLifetimeTopicProgress(history);

    expect(result).toHaveLength(1);

    expect(result[0]).toEqual({
      topicId: 'fractions',

      answered: 20,

      correct: 14,

      incorrect: 6,

      accuracy: 70,

      sessions: 2,
    });
  });
});
