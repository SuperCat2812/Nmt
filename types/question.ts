import type { Visual } from './visual';

export type QuestionType = 'single-choice' | 'numeric' | 'matching';

export interface QuestionOption {
  id: string;
  value: string;
  text?: string;
  math?: string;
}
export interface SolutionStep {
  text?: string;
  math?: string;
}
export interface MatchingItem {
  id: string;
  text?: string;
  math?: string;
}
export interface MatchingContent {
  left: MatchingItem[];
  right: MatchingItem[];
}
export type MatchingAnswer = Record<string, string>;
export type QuestionAnswer = string | number | MatchingAnswer;
export interface Question {
  id: string;
  generatorId: string;
  familyId: string;
  variantKey: string;
  topicId: string;
  type: QuestionType;
  title: string;
  text?: string;
  math?: string;
  options?: QuestionOption[];
  matching?: MatchingContent;
  correctAnswer: QuestionAnswer;
  solution: SolutionStep[];
  visual?: Visual;
}
