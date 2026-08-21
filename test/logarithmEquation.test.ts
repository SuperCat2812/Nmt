import { describe, expect, it } from 'vitest';

import { generateLogarithmEquation } from '@/generators/logarithms/logarithmEquation';

import { validateQuestion } from '@/test/helpers/validateQuestion';

describe('logarithmEquation', () => {
  it('5000 випадкових задач математично правильні', () => {
    for (let index = 0; index < 5000; index++) {
      const question = generateLogarithmEquation();

      validateQuestion(question);

      const [, baseText, powerText] = question.variantKey.split(':');

      const base = Number(baseText);

      const power = Number(powerText);

      const answer = Number(question.correctAnswer);

      expect(base).toBeGreaterThan(0);

      expect(base).not.toBe(1);

      expect(answer).toBe(base ** power);

      expect(answer).toBeGreaterThan(0);
    }
  });
});
