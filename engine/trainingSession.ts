import type {
  TopicProgress,
  TrainingAnswer,
  TrainingResult,
  TrainingSession,
  TrainingSettings,
} from '@/types/training';

import type { Question } from '@/types/question';

function normalizeQuestionCount(count: number): number {
  if (!Number.isFinite(count)) {
    return 10;
  }

  return Math.max(1, Math.floor(count));
}

function normalizeTimeLimit(value: number | undefined): number | undefined {
  if (value === undefined) {
    return undefined;
  }

  if (!Number.isFinite(value) || value <= 0) {
    return undefined;
  }

  return Math.floor(value);
}

export function normalizeTrainingSettings(
  settings: TrainingSettings,
): TrainingSettings {
  return {
    ...settings,

    questionCount: normalizeQuestionCount(settings.questionCount),

    timeLimitSeconds: normalizeTimeLimit(settings.timeLimitSeconds),

    topicIds: Array.from(new Set(settings.topicIds)),
  };
}

export function createTrainingSession(
  settings: TrainingSettings,
): TrainingSession {
  const normalized = normalizeTrainingSettings(settings);

  if (normalized.topicIds.length === 0) {
    throw new Error('Для тренування потрібно вибрати хоча б одну тему.');
  }

  if (normalized.mode === 'single-topic' && normalized.topicIds.length !== 1) {
    throw new Error('Режим single-topic повинен містити рівно одну тему.');
  }

  return {
    id: crypto.randomUUID(),

    status: 'idle',

    settings: normalized,

    startedAt: null,

    finishedAt: null,

    currentQuestionIndex: 0,

    currentQuestion: null,

    answers: [],
  };
}

export function startTrainingSession(
  session: TrainingSession,
  question: Question,
  now = Date.now(),
): TrainingSession {
  if (session.status !== 'idle') {
    throw new Error('Тренування вже було запущено.');
  }

  return {
    ...session,

    status: 'running',

    startedAt: now,

    currentQuestion: question,

    currentQuestionIndex: 0,
  };
}

export function calculateQuestionTime(
  questionStartedAt: number,
  answeredAt: number,
): number {
  return Math.max(0, Math.round((answeredAt - questionStartedAt) / 1000));
}

export interface SubmitTrainingAnswerInput {
  userAnswer: string;

  isCorrect: boolean;

  answeredAt?: number;

  questionStartedAt: number;
}

export function submitTrainingAnswer(
  session: TrainingSession,
  input: SubmitTrainingAnswerInput,
): TrainingSession {
  if (session.status !== 'running') {
    throw new Error('Тренування не запущено.');
  }

  if (!session.currentQuestion) {
    throw new Error('Поточне питання відсутнє.');
  }

  const answeredAt = input.answeredAt ?? Date.now();

  const question = session.currentQuestion;

  const answer: TrainingAnswer = {
    questionId: question.id,

    generatorId: question.generatorId,

    topicId: question.topicId,

    variantKey: question.variantKey,

    userAnswer: input.userAnswer,

    correctAnswer: String(question.correctAnswer),

    isCorrect: input.isCorrect,

    answeredAt,

    timeSpentSeconds: calculateQuestionTime(
      input.questionStartedAt,
      answeredAt,
    ),
  };

  return {
    ...session,

    answers: [...session.answers, answer],
  };
}

export function shouldFinishTraining(session: TrainingSession): boolean {
  return session.answers.length >= session.settings.questionCount;
}

export function moveToNextQuestion(
  session: TrainingSession,
  question: Question,
): TrainingSession {
  if (session.status !== 'running') {
    throw new Error('Тренування не запущено.');
  }

  if (shouldFinishTraining(session)) {
    throw new Error('Усі питання тренування вже завершені.');
  }

  return {
    ...session,

    currentQuestionIndex: session.currentQuestionIndex + 1,

    currentQuestion: question,
  };
}

export function finishTrainingSession(
  session: TrainingSession,
  now = Date.now(),
): TrainingSession {
  if (session.status === 'finished') {
    return session;
  }

  return {
    ...session,

    status: 'finished',

    finishedAt: now,

    currentQuestion: null,
  };
}

export function getElapsedSeconds(
  session: TrainingSession,
  now = Date.now(),
): number {
  if (session.startedAt === null) {
    return 0;
  }

  const end = session.finishedAt ?? now;

  return Math.max(0, Math.round((end - session.startedAt) / 1000));
}

export function getRemainingSeconds(
  session: TrainingSession,
  now = Date.now(),
): number | null {
  const limit = session.settings.timeLimitSeconds;

  if (limit === undefined) {
    return null;
  }

  return Math.max(0, limit - getElapsedSeconds(session, now));
}

export function isTimeExpired(
  session: TrainingSession,
  now = Date.now(),
): boolean {
  const remaining = getRemainingSeconds(session, now);

  return remaining !== null && remaining <= 0;
}

export function calculateTopicProgress(
  answers: TrainingAnswer[],
): TopicProgress[] {
  const map = new Map<
    string,
    {
      answered: number;
      correct: number;
    }
  >();

  for (const answer of answers) {
    const current = map.get(answer.topicId) ?? {
      answered: 0,
      correct: 0,
    };

    current.answered++;

    if (answer.isCorrect) {
      current.correct++;
    }

    map.set(answer.topicId, current);
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
    };
  });
}

export function calculateTrainingResult(
  session: TrainingSession,
): TrainingResult {
  const total = session.answers.length;

  const correct = session.answers.filter((answer) => answer.isCorrect).length;

  const incorrect = total - correct;

  const accuracy = total === 0 ? 0 : Math.round((correct / total) * 100);

  return {
    total,

    correct,

    incorrect,

    accuracy,

    elapsedSeconds: getElapsedSeconds(session),

    topicProgress: calculateTopicProgress(session.answers),
  };
}
