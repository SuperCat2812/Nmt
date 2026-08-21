import { describe, expect, it } from 'vitest';

import { generatePercentage } from '@/generators/percentages/percentageGenerator';

import type { PercentageConfig, PercentageForm } from '@/types/generator';

import { validateQuestion } from '@/test/helpers/validateQuestion';

const forms: PercentageForm[] = [
  'percent-of-number',
  'number-by-percent',
  'percentage-ratio',
  'increase-by-percent',
  'decrease-by-percent',
  'percentage-change',
  'successive-change',
];

const baseConfig = {
  numberRange: [100, 5000],

  percentValues: [5, 10, 15, 20, 25, 30, 40, 50],
} as const;

describe('percentageGenerator', () => {
  for (const form of forms) {
    it(`${form}: 2000 випадкових задач`, () => {
      const config: PercentageConfig = {
        ...baseConfig,
        forms: [form],
      };

      for (let index = 0; index < 2000; index++) {
        const question = generatePercentage(config);

        validateQuestion(question);

        expect(question.generatorId).toBe('percentage');

        expect(question.familyId).toBe('percentages');

        const answer = Number(question.correctAnswer);

        expect(Number.isFinite(answer)).toBe(true);

        expect(answer).toBeGreaterThanOrEqual(0);
      }
    });
  }
});
