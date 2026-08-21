import { describe, expect, it } from 'vitest';

import { generateLinearEquation } from '@/generators/equations/linearEquation';

import type {
  LinearEquationConfig,
  LinearEquationForm,
} from '@/types/generator';

import { validateQuestion } from '@/test/helpers/validateQuestion';

const forms: LinearEquationForm[] = ['ax+b=c', 'ax=b', 'a(x+b)=c', 'ax+b=cx+d'];

const baseConfig = {
  answerRange: [-10, 10],

  coefficientRange: [-9, 9],

  constantRange: [-15, 15],
} as const;

function validateLinearMath(variantKey: string, answer: number) {
  const parts = variantKey.split(':');

  const form = parts[1];

  if (form === 'ax+b=c') {
    const a = Number(parts[2]);
    const b = Number(parts[3]);
    const c = Number(parts[4]);

    expect(a * answer + b).toBeCloseTo(c);

    expect(a).not.toBe(0);
  }

  if (form === 'ax=b') {
    const a = Number(parts[2]);
    const b = Number(parts[3]);

    expect(a * answer).toBeCloseTo(b);

    expect(a).not.toBe(0);
  }

  if (form === 'a(x+b)=c') {
    const a = Number(parts[2]);
    const b = Number(parts[3]);
    const c = Number(parts[4]);

    expect(a * (answer + b)).toBeCloseTo(c);

    expect(a).not.toBe(0);
  }

  if (form === 'both-sides') {
    const a = Number(parts[2]);
    const b = Number(parts[3]);
    const c = Number(parts[4]);
    const d = Number(parts[5]);

    expect(a * answer + b).toBeCloseTo(c * answer + d);

    expect(a).not.toBe(c);
  }
}

describe('linearEquation', () => {
  for (const form of forms) {
    it(`${form}: 3000 випадкових рівнянь`, () => {
      const config: LinearEquationConfig = {
        ...baseConfig,
        forms: [form],
      };

      for (let index = 0; index < 3000; index++) {
        const question = generateLinearEquation(config);

        validateQuestion(question);

        const answer = Number(question.correctAnswer);

        expect(Number.isInteger(answer)).toBe(true);

        expect(answer).toBeGreaterThanOrEqual(-10);

        expect(answer).toBeLessThanOrEqual(10);

        validateLinearMath(question.variantKey, answer);
      }
    });
  }
});
