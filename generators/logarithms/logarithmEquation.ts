import type { Question } from '@/types/question';
import { createNumericOptions } from '@/utils/createNumericOptions';
import { randomInt } from '@/utils/random';

export function generateLogarithmEquation(): Question {
  const base = randomInt(2, 5);
  const power = randomInt(2, 4);
  const answer = base ** power;
  const options = createNumericOptions(
    answer,
    [
      base * power,
      base + power,
      power ** base,
      answer + base,
      answer - base,
      answer + 1,
      answer - 1,
    ],
    { isAllowed: (value) => value > 0 },
  );
  return {
    id: crypto.randomUUID(),
    generatorId: 'logarithm-equation',
    familyId: 'logarithms',
    variantKey: `log:${base}:${power}`,
    topicId: 'logarithms',
    type: 'single-choice',
    title: 'Логарифми',
    math: `\\log_{${base}} x = ${power}`,
    options,
    correctAnswer: String(answer),
    solution: [
      { math: `\\log_{${base}} x = ${power}` },
      { math: `x = ${base}^{${power}}` },
      { math: `x = ${answer}` },
    ],
  };
}
