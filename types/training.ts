import type { Question } from '@/types/question';

export type TrainingMode = 'single-topic' | 'mixed';

export interface TrainingSettings {
  mode: TrainingMode;

  questionCount: number;

  topicIds: string[];

  timeLimitSeconds?: number;
}

export interface TrainingAnswer {
  questionId: string;

  generatorId: string;

  topicId: string;

  variantKey: string;

  userAnswer: string;

  correctAnswer: string;

  isCorrect: boolean;

  answeredAt: number;

  timeSpentSeconds: number;
}

export interface TopicProgress {
  topicId: string;

  answered: number;

  correct: number;

  incorrect: number;

  accuracy: number;
}

export interface TrainingResult {
  total: number;

  correct: number;

  incorrect: number;

  accuracy: number;

  elapsedSeconds: number;

  topicProgress: TopicProgress[];
}

export type TrainingStatus = 'idle' | 'running' | 'finished';

export interface TrainingSession {
  id: string;

  status: TrainingStatus;

  settings: TrainingSettings;

  startedAt: number | null;

  finishedAt: number | null;

  currentQuestionIndex: number;

  currentQuestion: Question | null;

  answers: TrainingAnswer[];
}
