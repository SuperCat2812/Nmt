import { describe, expect, it } from 'vitest';

import { generateSequence } from '@/generators/sequences/sequenceGenerator';

import { generateAdvancedEquation } from '@/generators/equations/advancedEquation';

import { generateGeometry2DExtended } from '@/generators/geometry/geometry2DExtendedGenerator';

import { generateGeometry3D } from '@/generators/geometry/geometry3DGenerator';

import { validateQuestion } from '@/test/helpers/validateQuestion';

const generators = [
  {
    name: 'sequences',

    generate: () =>
      generateSequence({
        startRange: [-10, 10],

        differenceRange: [-5, 5],

        ratioRange: [-3, 3],

        nRange: [3, 7],

        forms: [
          'arithmetic-next',
          'arithmetic-nth',
          'arithmetic-sum',
          'geometric-next',
          'geometric-nth',
          'geometric-sum',
        ],
      }),
  },

  {
    name: 'advanced-equations',

    generate: () =>
      generateAdvancedEquation({
        answerRange: [0, 8],

        baseRange: [2, 5],

        constantRange: [-10, 10],

        forms: ['exponential', 'irrational', 'logarithmic-shift'],
      }),
  },

  {
    name: 'geometry2d-extended',

    generate: () =>
      generateGeometry2DExtended({
        lengthRange: [2, 12],

        coordinateRange: [-10, 10],

        forms: [
          'trapezoid-area',
          'parallelogram-area',
          'rhombus-area',
          'circumference',
          'arc-length',
          'sector-area',
          'distance-between-points',
        ],
      }),
  },

  {
    name: 'geometry3d',

    generate: () =>
      generateGeometry3D({
        lengthRange: [2, 9],

        forms: [
          'rectangular-prism-volume',
          'prism-volume',
          'pyramid-volume',
          'cylinder-volume',
          'cone-volume',
          'sphere-volume',
          'sphere-surface',
        ],
      }),
  },
];

describe('extended school generators', () => {
  for (const generator of generators) {
    it(`${generator.name}: 5000 задач`, () => {
      for (let i = 0; i < 5000; i++) {
        const question = generator.generate();

        validateQuestion(question);

        expect(question.solution.length).toBeGreaterThan(0);

        expect(question.variantKey).not.toBe('');
      }
    });
  }
});
