import { describe, expect, it } from 'vitest';

import { generateCalculus } from '@/generators/calculus/calculusGenerator';

import { generateLinearAlgebra } from '@/generators/linearAlgebra/linearAlgebraGenerator';

import { generateComplexNumber } from '@/generators/complexNumbers/complexNumberGenerator';

import { generateDifferentialEquation } from '@/generators/differentialEquations/differentialEquationGenerator';

import { generateDiscreteMath } from '@/generators/discreteMath/discreteMathGenerator';

import { validateQuestion } from '@/test/helpers/validateQuestion';

const generators = [
  {
    name: 'calculus',

    generate: () =>
      generateCalculus({
        coefficientRange: [-6, 6],

        powerRange: [1, 5],

        xRange: [-5, 5],

        forms: [
          'limit-polynomial',
          'derivative-at-point',
          'tangent-slope',
          'indefinite-integral-monomial',
          'definite-integral-monomial',
        ],
      }),
  },

  {
    name: 'linear-algebra',

    generate: () =>
      generateLinearAlgebra({
        valueRange: [-5, 5],

        forms: [
          'matrix-addition',
          'matrix-multiplication',
          'determinant-2x2',
          'linear-system-2x2',
          'vector-linear-combination',
        ],
      }),
  },

  {
    name: 'complex-numbers',

    generate: () =>
      generateComplexNumber({
        valueRange: [-6, 6],

        forms: [
          'addition',
          'subtraction',
          'multiplication',
          'modulus',
          'power-of-i',
        ],
      }),
  },

  {
    name: 'differential-equations',

    generate: () =>
      generateDifferentialEquation({
        coefficientRange: [-6, 6],

        initialValueRange: [-10, 10],

        xRange: [-5, 5],

        forms: [
          'constant-derivative',
          'linear-x-derivative',
          'exponential-general-solution',
        ],
      }),
  },

  {
    name: 'discrete-math',

    generate: () =>
      generateDiscreteMath({
        valueRange: [1, 12],

        forms: [
          'set-union',
          'set-intersection',
          'set-cardinality',
          'logic-implication',
          'graph-handshake',
        ],
      }),
  },
];

describe('university generators', () => {
  for (const generator of generators) {
    it(`${generator.name}: 5000 задач`, () => {
      for (let i = 0; i < 5000; i++) {
        const question = generator.generate();

        validateQuestion(question);
        if (question.type === 'single-choice') {
          const values = question.options?.map((option) => option.value) ?? [];

          expect(new Set(values).size).toBe(values.length);

          expect(values).toContain(String(question.correctAnswer));
        }

        expect(question.id).not.toBe('');

        expect(question.variantKey).not.toBe('');

        expect(question.solution.length).toBeGreaterThan(0);
      }
    });
  }
});
