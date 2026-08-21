import { describe, expect, it } from 'vitest';

import { generateInequality } from '@/generators/inequalities/inequalityGenerator';

import type { InequalityConfig, InequalityForm } from '@/types/generator';

import { validateQuestion } from '@/test/helpers/validateQuestion';

const forms: InequalityForm[] = ['linear', 'quadratic', 'system-linear'];

const baseConfig = {
  rootRange: [-10, 10],

  coefficientRange: [-9, 9],

  constantRange: [-15, 15],
} as const;

describe('inequalityGenerator', () => {
  for (const form of forms) {
    it(`${form}: 3000 задач`, () => {
      const config: InequalityConfig = {
        ...baseConfig,
        forms: [form],
      };

      for (let i = 0; i < 3000; i++) {
        const question = generateInequality(config);

        validateQuestion(question);

        expect(question.generatorId).toBe('inequality');

        expect(question.familyId).toBe('inequalities');

        const parts = question.variantKey.split(':');

        if (parts[1] === 'linear') {
          const a = Number(parts[2]);

          const b = Number(parts[3]);

          const c = Number(parts[4]);

          const boundary = Number(parts[5]);

          expect(a * boundary + b).toBeCloseTo(c);

          expect(a).not.toBe(0);
        }

        if (parts[1] === 'quadratic') {
          const r1 = Number(parts[2]);

          const r2 = Number(parts[3]);

          expect(r1).toBeLessThan(r2);
        }

        if (parts[1] === 'system') {
          const lower = Number(parts[2]);

          const upper = Number(parts[3]);

          expect(lower).toBeLessThan(upper);
        }
      }
    });
  }
});
