import { describe, expect, it } from 'vitest';

import { generateRationalEquation } from '@/generators/equations/rationalEquation';

import type {
  RationalEquationConfig,
  RationalEquationForm,
} from '@/types/generator';

import { validateQuestion } from '@/test/helpers/validateQuestion';

const forms: RationalEquationForm[] = ['a-over-x-minus-b', 'linear-fraction'];

const baseConfig = {
  answerRange: [-10, 10],

  coefficientRange: [-6, 6],

  constantRange: [-10, 10],
} as const;

describe('rationalEquation', () => {
  for (const form of forms) {
    it(`${form}: 3000 задач`, () => {
      const config: RationalEquationConfig = {
        ...baseConfig,
        forms: [form],
      };

      for (let i = 0; i < 3000; i++) {
        const question = generateRationalEquation(config);

        validateQuestion(question);

        const parts = question.variantKey.split(':');

        const answer = Number(question.correctAnswer);

        if (parts[1] === 'a-over') {
          const a = Number(parts[2]);

          const b = Number(parts[3]);

          const c = Number(parts[4]);

          expect(answer).not.toBe(b);

          expect(a / (answer - b)).toBeCloseTo(c);
        }

        if (parts[1] === 'linear-fraction') {
          const a = Number(parts[2]);

          const b = Number(parts[3]);

          const c = Number(parts[4]);

          expect(answer + b).not.toBe(0);

          expect((answer + a) / (answer + b)).toBeCloseTo(c);
        }
      }
    });
  }
});
