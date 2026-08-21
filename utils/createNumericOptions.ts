import type { QuestionOption } from '@/types/question';
import { shuffle } from './shuffle';

type NumericOptionsConfig = {
  count?: number;
  isAllowed?: (value: number) => boolean;
};
export function createNumericOptions(
  answer: number,
  candidates: number[],
  config: NumericOptionsConfig = {},
): QuestionOption[] {
  const { count = 4, isAllowed = Number.isFinite } = config;
  if (!Number.isFinite(answer))
    throw new Error('Правильна відповідь має бути скінченним числом.');
  if (count < 2) throw new Error('Кількість варіантів має бути не менше 2.');
  const wrongAnswers = new Set<number>();
  function tryAdd(value: number) {
    if (Number.isFinite(value) && value !== answer && isAllowed(value))
      wrongAnswers.add(value);
  }
  for (const candidate of candidates) {
    tryAdd(candidate);
    if (wrongAnswers.size >= count - 1) break;
  }
  let offset = 1;
  while (wrongAnswers.size < count - 1) {
    tryAdd(answer + offset);
    tryAdd(answer - offset);
    offset++;
    if (offset > 10_000)
      throw new Error('Не вдалося створити достатньо варіантів відповіді.');
  }

  const values = shuffle([
    answer,
    ...Array.from(wrongAnswers).slice(0, count - 1),
  ]);

  return values.map((value, index) => ({
    id: String(index),
    value: String(value),
    text: String(value),
  }));
}
