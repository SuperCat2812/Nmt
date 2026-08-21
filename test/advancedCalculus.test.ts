import { describe, expect, it } from 'vitest';

import { generateAdvancedCalculus } from '@/generators/advancedCalculus/advancedCalculusGenerator';

import type {
  AdvancedCalculusConfig,
  AdvancedCalculusForm,
} from '@/types/generator';

import { validateQuestion } from '@/test/helpers/validateQuestion';

const forms: AdvancedCalculusForm[] = [
  'limit-factorization',
  'chain-rule',
  'product-rule',
  'quotient-rule',
  'extremum-quadratic',
  'substitution-integral',
];

const baseConfig = {
  coefficientRange: [-6, 6],

  xRange: [-5, 5],

  powerRange: [1, 5],
} as const;

describe('advancedCalculus', () => {
  for (const form of forms) {
    it(`${form}: 3000 задач`, () => {
      const config: AdvancedCalculusConfig = {
        ...baseConfig,
        forms: [form],
      };

      for (let i = 0; i < 3000; i++) {
        const question = generateAdvancedCalculus(config);

        validateQuestion(question);

        expect(question.generatorId).toBe('advanced-calculus');

        expect(question.solution.length).toBeGreaterThan(0);
      }
    });
  }
});
