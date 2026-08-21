import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import {
  addTrainingHistoryItem,
  clearTrainingHistory,
  loadTrainingHistory,
} from '@/engine/trainingStorage';

const storage = new Map<string, string>();

beforeEach(() => {
  storage.clear();

  Object.defineProperty(globalThis, 'window', {
    configurable: true,

    value: {
      localStorage: {
        getItem(key: string) {
          return storage.get(key) ?? null;
        },

        setItem(key: string, value: string) {
          storage.set(key, value);
        },

        removeItem(key: string) {
          storage.delete(key);
        },
      },
    },
  });
});

afterEach(() => {
  Reflect.deleteProperty(globalThis, 'window');
});

describe('trainingStorage', () => {
  const item = {
    id: 'session-1',

    courseId: 'test',

    startedAt: 1,

    finishedAt: 2,

    settings: {
      mode: 'single-topic' as const,

      questionCount: 10,

      topicIds: ['fractions'],
    },

    result: {
      total: 10,

      correct: 8,

      incorrect: 2,

      accuracy: 80,

      elapsedSeconds: 100,

      topicProgress: [],
    },
  };

  it('зберігає історію', () => {
    addTrainingHistoryItem(item);

    expect(loadTrainingHistory()).toHaveLength(1);
  });

  it('не дублює одну сесію', () => {
    addTrainingHistoryItem(item);

    addTrainingHistoryItem(item);

    expect(loadTrainingHistory()).toHaveLength(1);
  });

  it('очищає історію', () => {
    addTrainingHistoryItem(item);

    clearTrainingHistory();

    expect(loadTrainingHistory()).toEqual([]);
  });

  it('не падає на пошкодженому JSON', () => {
    window.localStorage.setItem('nmt-math-trainer-history', '{broken');

    expect(loadTrainingHistory()).toEqual([]);
  });

  it('відкидає неправильні записи', () => {
    window.localStorage.setItem(
      'nmt-math-trainer-history',

      JSON.stringify([
        null,
        123,
        {
          hello: 'world',
        },
      ]),
    );

    expect(loadTrainingHistory()).toEqual([]);
  });
});
