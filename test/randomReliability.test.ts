import { describe, expect, it } from 'vitest';

import { courses } from '@/data/activeCourse';

import { createTopicGenerator } from '@/engine/courseManager';

import { validateCourse } from '@/engine/courseValidator';

const ITERATIONS = 5000;

type GeneratedQuestion = ReturnType<ReturnType<typeof createTopicGenerator>>;

function questionFingerprint(question: GeneratedQuestion) {
  return JSON.stringify({
    generatorId: question.generatorId,

    familyId: question.familyId,

    topicId: question.topicId,

    variantKey: question.variantKey,

    type: question.type,

    correctAnswer: question.correctAnswer,
  });
}

describe('random reliability audit', () => {
  for (const [courseId, rawCourse] of Object.entries(courses)) {
    const course = validateCourse(rawCourse);

    describe(courseId, () => {
      for (const topic of course.topics) {
        for (const definition of topic.generators) {
          it(`${topic.id} / ${definition.id}: ${ITERATIONS} генерацій без нестабільності`, () => {
            const generator = createTopicGenerator(definition);

            const ids = new Set<string>();

            const variants = new Set<string>();

            const fingerprintsByVariant = new Map<string, string>();

            for (let index = 0; index < ITERATIONS; index++) {
              const question = generator();

              /*
               * UUID вопроса
               * не должен повторяться.
               */
              expect(
                ids.has(question.id),
                `${question.variantKey}: повторний question.id`,
              ).toBe(false);

              ids.add(question.id);

              variants.add(question.variantKey);

              /*
               * Один variantKey
               * должен всегда означать
               * ту же математическую задачу.
               */
              const fingerprint = questionFingerprint(question);

              const previous = fingerprintsByVariant.get(question.variantKey);

              if (previous !== undefined) {
                expect(
                  fingerprint,
                  `${question.variantKey}: однаковий variantKey описує різні правильні відповіді`,
                ).toBe(previous);
              } else {
                fingerprintsByVariant.set(question.variantKey, fingerprint);
              }
            }

            expect(ids.size).toBe(ITERATIONS);

            expect(
              variants.size,
              `${topic.id}/${definition.id}: немає варіативності`,
            ).toBeGreaterThan(1);
          });
        }
      }
    });
  }
});
