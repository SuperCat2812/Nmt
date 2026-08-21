import { describe, expect, it } from 'vitest';

import { generateAdvancedCalculus } from '@/generators/advancedCalculus/advancedCalculusGenerator';

import { generateAdvancedLinearAlgebra } from '@/generators/advancedLinearAlgebra/advancedLinearAlgebraGenerator';

import { generateSeries } from '@/generators/series/seriesGenerator';

import { generateNumberTheory } from '@/generators/numberTheory/numberTheoryGenerator';

import { generateGraphTheory } from '@/generators/graphTheory/graphTheoryGenerator';

import { generateNumericalMethod } from '@/generators/numericalMethods/numericalMethodGenerator';

import { validateQuestion } from '@/test/helpers/validateQuestion';

const generators = [
  {
    name: 'advanced-calculus',

    generate: () =>
      generateAdvancedCalculus({
        coefficientRange: [-6, 6],

        xRange: [-5, 5],

        powerRange: [1, 5],

        forms: [
          'limit-factorization',
          'chain-rule',
          'product-rule',
          'quotient-rule',
          'extremum-quadratic',
          'substitution-integral',
        ],
      }),
  },

  {
    name: 'advanced-linear-algebra',

    generate: () =>
      generateAdvancedLinearAlgebra({
        valueRange: [-5, 5],

        forms: [
          'determinant-3x3',
          'inverse-2x2',
          'rank-basic',
          'eigenvalues-diagonal',
          'eigenvector-diagonal',
        ],
      }),
  },

  {
    name: 'series',

    generate: () =>
      generateSeries({
        valueRange: [-8, 8],

        nRange: [3, 8],

        forms: [
          'finite-arithmetic-sum',
          'finite-geometric-sum',
          'infinite-geometric-sum',
          'convergence-geometric',
          'taylor-basic',
        ],
      }),
  },

  {
    name: 'number-theory',

    generate: () =>
      generateNumberTheory({
        valueRange: [2, 50],

        forms: [
          'gcd',
          'lcm',
          'divisibility',
          'prime-check',
          'modular-remainder',
        ],
      }),
  },

  {
    name: 'graph-theory',

    generate: () =>
      generateGraphTheory({
        vertexRange: [3, 12],

        forms: [
          'complete-graph-edges',
          'tree-edges',
          'degree-sum',
          'cycle-vertices',
          'path-length',
        ],
      }),
  },

  {
    name: 'numerical-methods',

    generate: () =>
      generateNumericalMethod({
        xRange: [-6, 6],

        forms: [
          'bisection-step',
          'newton-step',
          'finite-difference',
          'trapezoid-rule',
        ],
      }),
  },
];

describe('advanced university generators', () => {
  for (const generator of generators) {
    it(`${generator.name}: 5000 задач`, () => {
      for (let i = 0; i < 5000; i++) {
        const question = generator.generate();

        validateQuestion(question);

        expect(question.generatorId).not.toBe('');

        expect(question.variantKey).not.toBe('');

        expect(question.solution.length).toBeGreaterThan(0);

        if (question.type === 'single-choice' && question.options) {
          const values = question.options.map((option) => option.value);

          expect(new Set(values).size).toBe(values.length);

          expect(values).toContain(String(question.correctAnswer));
        }
      }
    });
  }
});
