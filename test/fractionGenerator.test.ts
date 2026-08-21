import { describe, expect, it } from 'vitest';

import { generateFraction } from '@/generators/fractions/fractionGenerator';

import type { FractionConfig, FractionForm } from '@/types/generator';

import { validateQuestion } from '@/test/helpers/validateQuestion';
import { gcd } from '@/utils/fractions/fraction';

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

        if (form === 'compare') {
          expect(
            question.options,
            `${question.variantKey} має мати 3 варіанти відповіді`,
          ).toHaveLength(3);
        } else {
          expect(
            question.options,
            `${question.variantKey} має мати 4 варіанти відповіді`,
          ).toHaveLength(4);
        }
      }
    });
  }
  it('reduce: початкова дріб завжди реально скорочується', () => {
    const config: FractionConfig = {
      ...baseConfig,
      forms: ['reduce'],
    };

    for (let index = 0; index < 5000; index++) {
      const question = generateFraction(config);

      const match = question.variantKey.match(
        /^fraction:reduce:(-?\d+)\/(\d+)$/,
      );

      expect(match).not.toBeNull();

      const numerator = Number(match?.[1]);
      const denominator = Number(match?.[2]);

      expect(gcd(numerator, denominator)).toBeGreaterThan(1);

      const original = `${numerator}/${denominator}`;

      expect(original).not.toBe(question.correctAnswer);
    }
  });
});
