import { describe, expect, it } from 'vitest';

import {
  courseTopics,
  createTopicGenerator,
  getGeneratorDefinitionsForTopic,
} from '@/engine/courseManager';

import { resetQuestions } from '@/engine/questionManager';

describe('single-choice option count', () => {
  it('звичайні single-choice задачі не створюють більше 4 відповідей', () => {
    resetQuestions();

    for (const topic of courseTopics) {
      const definitions = getGeneratorDefinitionsForTopic(topic.id);

      for (const definition of definitions) {
        const generator = createTopicGenerator(definition);

        for (let i = 0; i < 200; i++) {
          const question = generator();

          if (question.type !== 'single-choice') {
            continue;
          }

          expect(
            question.options?.length,
            `${question.variantKey} має забагато варіантів`,
          ).toBeLessThanOrEqual(4);

          expect(
            question.options?.length,
            `${question.variantKey} має замало варіантів`,
          ).toBeGreaterThanOrEqual(2);
        }
      }
    }
  });
});
