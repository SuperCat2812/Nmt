import { describe, expect, it } from 'vitest';

import { generatePowerRoot } from '@/generators/powersRoots/powerRootGenerator';

import type { PowerRootConfig, PowerRootForm } from '@/types/generator';

import { validateQuestion } from '@/test/helpers/validateQuestion';

const forms: PowerRootForm[] = [
  'power-value',
  'multiply-same-base',
  'divide-same-base',
  'power-of-power',
  'square-root',
  'cube-root',
  'simplify-square-root',
];

const baseConfig = {
  baseRange: [2, 10],

  exponentRange: [2, 4],

  allowNegativeBase: true,
} as const;

describe('powerRootGenerator', () => {
  for (const form of forms) {
    it(`${form}: 2000 випадкових задач`, () => {
      const config: PowerRootConfig = {
        ...baseConfig,
        forms: [form],
      };

      for (let i = 0; i < 2000; i++) {
        const question = generatePowerRoot(config);

        validateQuestion(question);

        expect(question.generatorId).toBe('powers-roots');

        expect(question.familyId).toBe('powers-roots');
      }
    });
  }
});
