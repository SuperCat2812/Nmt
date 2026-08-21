import { describe, expect, it } from 'vitest';

import { generateTrigonometry } from '@/generators/trigonometry/trigonometryGenerator';

import { generateVector } from '@/generators/vectors/vectorGenerator';

import { generateCombinatorics } from '@/generators/combinatorics/combinatoricsGenerator';

import { generateProbability } from '@/generators/probability/probabilityGenerator';

import { generateStatistics } from '@/generators/statistics/statisticsGenerator';

import { generateGeometry2D } from '@/generators/geometry/geometry2DGenerator';

import { validateQuestion } from '@/test/helpers/validateQuestion';

const generators = [
  {
    name: 'trigonometry',

    generate: () =>
      generateTrigonometry({
        forms: [
          'standard-value',
          'basic-equation',
          'identity',
          'right-triangle',
        ],
      }),
  },

  {
    name: 'vectors',

    generate: () =>
      generateVector({
        coordinateRange: [-10, 10],

        forms: ['coordinates-2d', 'coordinates-3d', 'length-2d', 'dot-product'],
      }),
  },

  {
    name: 'combinatorics',

    generate: () =>
      generateCombinatorics({
        nRange: [4, 8],

        forms: ['permutation', 'combination', 'arrangement'],
      }),
  },

  {
    name: 'probability',

    generate: () =>
      generateProbability({
        countRange: [2, 20],

        forms: ['classical', 'complement', 'independent-events'],
      }),
  },

  {
    name: 'statistics',

    generate: () =>
      generateStatistics({
        valueRange: [1, 30],

        itemCountRange: [5, 9],

        forms: ['mean', 'median', 'mode', 'range', 'bar-chart'],
      }),
  },

  {
    name: 'geometry2d',

    generate: () =>
      generateGeometry2D({
        lengthRange: [2, 15],

        forms: [
          'rectangle-area',
          'triangle-area',
          'circle-area',
          'pythagorean',
        ],
      }),
  },
];

describe('school generators stress tests', () => {
  for (const generator of generators) {
    it(`${generator.name}: 5000 задач`, () => {
      for (let i = 0; i < 5000; i++) {
        const question = generator.generate();

        validateQuestion(question);

        expect(question.id).not.toBe('');

        expect(question.variantKey).not.toBe('');

        expect(question.solution.length).toBeGreaterThan(0);
      }
    });
  }
});
