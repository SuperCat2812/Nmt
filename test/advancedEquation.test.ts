import { describe, expect, it } from 'vitest';

import { generateAdvancedEquation } from '@/generators/equations/advancedEquation';

import { validateQuestion } from '@/test/helpers/validateQuestion';

describe('advancedEquation', () => {
  it('irrational: correctAnswer справді задовольняє рівняння', () => {
    for (let index = 0; index < 5000; index++) {
      const question = generateAdvancedEquation({
        answerRange: [0, 8],
        baseRange: [2, 5],
        constantRange: [-10, 10],
        forms: ['irrational'],
      });

      validateQuestion(question);

      const match = question.variantKey.match(
        /^advanced:irrational:(-?\d+):(\d+):(-?\d+)$/,
      );

      expect(match).not.toBeNull();

      const shift = Number(match?.[1]);
      const root = Number(match?.[2]);
      const x = Number(question.correctAnswer);

      expect(x + shift).toBe(root ** 2);

      expect(Math.sqrt(x + shift)).toBe(root);
    }
  });
});
