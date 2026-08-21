import { describe, expect, it } from 'vitest';

import { courses } from '@/data/activeCourse';

import { validateCourse } from '@/engine/courseValidator';

import { createTopicGenerator } from '@/engine/courseManager';

import { validateQuestion } from '@/test/helpers/validateQuestion';

import type { Question } from '@/types/question';

function validateQuestionDeep(question: Question, maxOptions: number) {
  validateQuestion(question);

  expect(question.id.trim()).not.toBe('');
  expect(question.generatorId.trim()).not.toBe('');
  expect(question.familyId.trim()).not.toBe('');
  expect(question.topicId.trim()).not.toBe('');
  expect(question.variantKey.trim()).not.toBe('');
  expect(question.title.trim()).not.toBe('');

  expect(question.solution.length).toBeGreaterThan(0);

  for (const step of question.solution) {
    const hasContent = Boolean(step.text?.trim()) || Boolean(step.math?.trim());

    expect(hasContent, `${question.variantKey}: порожній крок solution`).toBe(
      true,
    );
  }

  if (question.type === 'single-choice') {
    expect(question.options).toBeDefined();

    const options = question.options ?? [];

    expect(
      options.length,
      `${question.variantKey}: замало варіантів`,
    ).toBeGreaterThanOrEqual(2);

    expect(
      options.length,
      `${question.variantKey}: забагато варіантів`,
    ).toBeLessThanOrEqual(maxOptions);

    const values = options.map((option) => option.value);

    expect(
      new Set(values).size,
      `${question.variantKey}: дублікати options`,
    ).toBe(values.length);

    expect(
      values,
      `${question.variantKey}: correctAnswer немає серед options`,
    ).toContain(String(question.correctAnswer));

    for (const option of options) {
      expect(
        option.id.trim(),
        `${question.variantKey}: порожній option.id`,
      ).not.toBe('');

      expect(
        option.value.trim(),
        `${question.variantKey}: порожній option.value`,
      ).not.toBe('');

      const hasVisibleContent =
        Boolean(option.text?.trim()) ||
        Boolean(option.math?.trim()) ||
        Boolean(option.value.trim());

      expect(
        hasVisibleContent,
        `${question.variantKey}: option нічого не показує користувачу`,
      ).toBe(true);
    }
  }

  if (question.type === 'numeric') {
    expect(
      question.correctAnswer,
      `${question.variantKey}: numeric correctAnswer undefined`,
    ).not.toBeUndefined();

    expect(
      question.correctAnswer,
      `${question.variantKey}: numeric correctAnswer null`,
    ).not.toBeNull();

    expect(
      typeof question.correctAnswer,
      `${question.variantKey}: numeric correctAnswer не повинен бути object`,
    ).not.toBe('object');
  }

  if (question.type === 'matching') {
    expect(
      question.matching,
      `${question.variantKey}: matching data відсутні`,
    ).toBeDefined();

    expect(typeof question.correctAnswer).toBe('object');

    const matching = question.matching;

    if (!matching) {
      throw new Error(`Matching data missing: ${question.variantKey}`);
    }

    expect(matching.left.length).toBeGreaterThan(0);

    expect(matching.right.length).toBeGreaterThan(0);

    expect(new Set(matching.left.map((item) => item.id)).size).toBe(
      matching.left.length,
    );

    expect(new Set(matching.right.map((item) => item.id)).size).toBe(
      matching.right.length,
    );
  }
}

describe('global generator stress audit', () => {
  for (const [courseId, rawCourse] of Object.entries(courses)) {
    const course = validateCourse(rawCourse);

    describe(courseId, () => {
      for (const topic of course.topics) {
        for (const definition of topic.generators) {
          it(`${topic.id} / ${definition.id}: 2000 задач`, () => {
            const generator = createTopicGenerator(definition);

            const seenVariants = new Set<string>();

            for (let index = 0; index < 2000; index++) {
              const question = generator();

              expect(question.topicId).toBe(topic.id);

              validateQuestionDeep(
                question,
                courseId === 'nmt-math-2026' ? 4 : 5,
              );

              seenVariants.add(question.variantKey);
            }

            expect(
              seenVariants.size,
              `${topic.id}/${definition.id}: генератор майже нічого не варіює`,
            ).toBeGreaterThan(1);
          });
        }
      }
    });
  }
});
