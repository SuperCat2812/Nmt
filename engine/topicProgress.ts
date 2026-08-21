import type { TopicProgress } from '@/types/training';

import type { TrainingHistoryItem } from './trainingStorage';

export interface LifetimeTopicProgress extends TopicProgress {
  sessions: number;
}

export function calculateLifetimeTopicProgress(
  history: TrainingHistoryItem[],
): LifetimeTopicProgress[] {
  const map = new Map<
    string,
    {
      answered: number;
      correct: number;
      sessions: Set<string>;
    }
  >();

  for (const session of history) {
    for (const progress of session.result.topicProgress) {
      const current = map.get(progress.topicId) ?? {
        answered: 0,
        correct: 0,
        sessions: new Set<string>(),
      };

      current.answered += progress.answered;

      current.correct += progress.correct;

      current.sessions.add(session.id);

      map.set(progress.topicId, current);
    }
  }

  return Array.from(map.entries()).map(([topicId, value]) => {
    const incorrect = value.answered - value.correct;

    const accuracy =
      value.answered === 0
        ? 0
        : Math.round((value.correct / value.answered) * 100);

    return {
      topicId,

      answered: value.answered,

      correct: value.correct,

      incorrect,

      accuracy,

      sessions: value.sessions.size,
    };
  });
}
