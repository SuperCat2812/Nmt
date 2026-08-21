import { describe, expect, it } from 'vitest';

import { generateFunction } from '@/generators/functions/functionGenerator';

import type { FunctionConfig, FunctionForm } from '@/types/generator';

import { validateQuestion } from '@/test/helpers/validateQuestion';

const forms: FunctionForm[] = ['value', 'zeros', 'vertex', 'graph-value'];

const baseConfig = {
  xRange: [-8, 8],

  coefficientRange: [-5, 5],

  constantRange: [-10, 10],
} as const;

describe('functionGenerator', () => {
  for (const form of forms) {
    it(`${form}: 3000 задач`, () => {
      const config: FunctionConfig = {
        ...baseConfig,
        forms: [form],
      };

      for (let i = 0; i < 3000; i++) {
        const question = generateFunction(config);

        validateQuestion(question);

        const parts = question.variantKey.split(':');

        if (parts[1] === 'value' || parts[1] === 'graph-value') {
          const a = Number(parts[2]);

          const b = Number(parts[3]);

          const x = Number(parts[4]);

          const answer = Number(question.correctAnswer);

          expect(answer).toBeCloseTo(a * x + b);
        }

        if (parts[1] === 'zeros') {
          const r1 = Number(parts[2]);

          const r2 = Number(parts[3]);

          expect(r1).toBeLessThan(r2);
        }

        if (parts[1] === 'vertex') {
          const h = Number(parts[3]);

          const k = Number(parts[4]);

          expect(question.correctAnswer).toBe(`${h};${k}`);
        }
      }
    });
  }
});
