import type { MatchingAnswer, Question } from '@/types/question';
import { fractionToNumber, parseFraction } from '@/utils/fractions/fraction';

export type UserAnswer = string | MatchingAnswer;

function normalizeNumericValue(value: string): number | null {
  const normalized = value.trim().replace(',', '.');
  if (normalized === '') return null;
  const fraction = parseFraction(normalized);
  if (fraction) return fractionToNumber(fraction);
  const number = Number(normalized);
  return Number.isFinite(number) ? number : null;
}

function checkStringAnswer(userAnswer: string, correctAnswer: string): boolean {
  const userNumber = normalizeNumericValue(userAnswer);
  const correctNumber = normalizeNumericValue(correctAnswer);
  if (userNumber !== null && correctNumber !== null)
    return Math.abs(userNumber - correctNumber) < 1e-9;

  return userAnswer.trim() === correctAnswer.trim();
}

function checkMatching(
  userAnswer: MatchingAnswer,
  correctAnswer: MatchingAnswer,
): boolean {
  const correctKeys = Object.keys(correctAnswer);
  const userKeys = Object.keys(userAnswer);
  if (correctKeys.length !== userKeys.length) return false;
  return correctKeys.every((key) => userAnswer[key] === correctAnswer[key]);
}

export function checkAnswer(
  question: Question,
  userAnswer: UserAnswer,
): boolean {
  if (question.type === 'matching') {
    if (
      typeof userAnswer === 'string' ||
      typeof question.correctAnswer !== 'object'
    )
      return false;
    return checkMatching(userAnswer, question.correctAnswer);
  }
  if (typeof userAnswer !== 'string') return false;
  if (typeof question.correctAnswer === 'object') return false;
  return checkStringAnswer(userAnswer, String(question.correctAnswer));
}
