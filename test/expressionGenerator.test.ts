import { describe, expect, it } from 'vitest';

import { generateExpression } from '@/generators/expressions/expressionGenerator';

import type { ExpressionConfig, ExpressionForm } from '@/types/generator';

import { validateQuestion } from '@/test/helpers/validateQuestion';

const forms: ExpressionForm[] = [
  'expand-brackets',
  'combine-like-terms',
  'factor-common',
  'difference-of-squares',
];

const baseConfig = {
  coefficientRange: [-9, 9],

  constantRange: [-15, 15],
} as const;

describe('expressionGenerator', () => {
  for (const form of forms) {
    it(`${form}: 2000 задач`, () => {
      const config: ExpressionConfig = {
        ...baseConfig,
        forms: [form],
      };

      for (let i = 0; i < 2000; i++) {
        const question = generateExpression(config);

        validateQuestion(question);

        expect(question.generatorId).toBe('expressions');

        expect(question.familyId).toBe('expressions');
      }
    });
  }
});
