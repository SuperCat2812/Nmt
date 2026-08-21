import { describe, expect, it } from 'vitest';

import { courses } from '@/data/activeCourse';
import { checkAnswer } from '@/engine/answerChecker';
import { createTopicGenerator } from '@/engine/courseManager';
import { validateCourse } from '@/engine/courseValidator';

import type { MatchingAnswer, Question } from '@/types/question';

const ITERATIONS = 2000;

function validateSingleChoice(question: Question) {
  const options = question.options ?? [];

  const correct = String(question.correctAnswer);

  expect(
    options.length,
    `${question.variantKey}: options відсутні`,
  ).toBeGreaterThanOrEqual(2);

  const accepted = options.filter((option) =>
    checkAnswer(question, option.value),
  );

  /*
   * Главная проверка:
   *
   * среди вариантов должен быть
   * ровно один ответ, который
   * answerChecker принимает.
   */
  expect(
    accepted.length,
    `${question.variantKey}: серед options має бути рівно одна правильна відповідь`,
  ).toBe(1);

  expect(
    accepted[0]?.value,
    `${question.variantKey}: правильний option не збігається з correctAnswer`,
  ).toBe(correct);

  for (const option of options) {
    if (option.value === correct) {
      continue;
    }

    expect(
      checkAnswer(question, option.value),
      `${question.variantKey}: distractor "${option.value}" теж приймається як правильний`,
    ).toBe(false);
  }
}

function validateNumeric(question: Question) {
  const correct = String(question.correctAnswer);

  expect(
    checkAnswer(question, correct),
    `${question.variantKey}: correctAnswer не приймається answerChecker`,
  ).toBe(true);
}

function validateMatching(question: Question) {
  expect(
    question.matching,
    `${question.variantKey}: matching відсутній`,
  ).toBeDefined();

  expect(typeof question.correctAnswer).toBe('object');

  if (!question.matching || typeof question.correctAnswer !== 'object') {
    return;
  }

  const answer = question.correctAnswer as MatchingAnswer;

  const leftIds = new Set(question.matching.left.map((item) => item.id));

  const rightIds = new Set(question.matching.right.map((item) => item.id));

  expect(Object.keys(answer).sort()).toEqual([...leftIds].sort());

  for (const [leftId, rightId] of Object.entries(answer)) {
    expect(
      leftIds.has(leftId),
      `${question.variantKey}: невідомий left id ${leftId}`,
    ).toBe(true);

    expect(
      rightIds.has(rightId),
      `${question.variantKey}: невідомий right id ${rightId}`,
    ).toBe(true);
  }

  expect(
    checkAnswer(question, answer),
    `${question.variantKey}: правильне matching не приймається answerChecker`,
  ).toBe(true);
}

describe('answer integrity + semantic distractor audit', () => {
  for (const [courseId, rawCourse] of Object.entries(courses)) {
    const course = validateCourse(rawCourse);

    describe(courseId, () => {
      for (const topic of course.topics) {
        for (const definition of topic.generators) {
          it(`${topic.id} / ${definition.id}: ${ITERATIONS} задач`, () => {
            const generator = createTopicGenerator(definition);

            for (let index = 0; index < ITERATIONS; index++) {
              const question = generator();

              if (question.type === 'single-choice') {
                validateSingleChoice(question);
              } else if (question.type === 'numeric') {
                validateNumeric(question);
              } else {
                validateMatching(question);
              }
            }
          });
        }
      }
    });
  }
});
