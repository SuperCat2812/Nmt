import { describe, expect, it } from 'vitest';

import { generateFraction } from '@/generators/fractions/fractionGenerator';

import type { FractionConfig, FractionForm } from '@/types/generator';

import { validateQuestion } from '@/test/helpers/validateQuestion';

const baseConfig = {
  numeratorRange: [1, 12],

  denominatorRange: [2, 12],

  allowNegative: false,

  allowImproper: false,
} as const;

const forms: FractionForm[] = [
  'reduce',
  'compare',
  'add',
  'subtract',
  'multiply',
  'divide',
];

describe('fractionGenerator', () => {
  for (const form of forms) {
    it(`${form}: 2000 випадкових задач`, () => {
      const config: FractionConfig = {
        ...baseConfig,
        forms: [form],
      };

      for (let index = 0; index < 2000; index++) {
        const question = generateFraction(config);

        validateQuestion(question);

        expect(question.generatorId).toBe('fraction');

        expect(question.familyId).toBe('fractions');

        expect(question.topicId).toBe('fractions');

        expect(question.variantKey).toContain(`fraction:${form}:`);
      }
    });
  }
});
