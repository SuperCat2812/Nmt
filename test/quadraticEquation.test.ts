import { describe, expect, it } from 'vitest';

import { generateQuadraticEquation } from '@/generators/equations/quadraticEquation';

import type {
  QuadraticEquationConfig,
  QuadraticEquationForm,
} from '@/types/generator';

import { validateQuestion } from '@/test/helpers/validateQuestion';

const forms: QuadraticEquationForm[] = ['two-roots', 'double-root'];

const baseConfig = {
  rootRange: [-10, 10],
} as const;

describe('quadraticEquation', () => {
  for (const form of forms) {
    it(`${form}: 3000 випадкових задач`, () => {
      const config: QuadraticEquationConfig = {
        ...baseConfig,
        forms: [form],
      };

      for (let i = 0; i < 3000; i++) {
        const question = generateQuadraticEquation(config);

        validateQuestion(question);

        expect(question.generatorId).toBe('quadratic-equation');

        expect(question.familyId).toBe('equations');

        const parts = question.variantKey.split(':');

        if (parts[1] === 'two-roots') {
          const x1 = Number(parts[2]);

          const x2 = Number(parts[3]);

          const b = -(x1 + x2);

          const c = x1 * x2;

          expect(x1 ** 2 + b * x1 + c).toBeCloseTo(0);

          expect(x2 ** 2 + b * x2 + c).toBeCloseTo(0);

          expect(x1).not.toBe(x2);
        }

        if (parts[1] === 'double-root') {
          const root = Number(parts[2]);

          const b = -2 * root;

          const c = root ** 2;

          const discriminant = b ** 2 - 4 * c;

          expect(discriminant).toBeCloseTo(0);

          expect(root ** 2 + b * root + c).toBeCloseTo(0);
        }
      }
    });
  }
});
