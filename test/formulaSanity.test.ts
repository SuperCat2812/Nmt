import { describe, expect, it } from 'vitest';

import { courses } from '@/data/activeCourse';

import { validateCourse } from '@/engine/courseValidator';

import { createTopicGenerator } from '@/engine/courseManager';

import type { Question } from '@/types/question';

function collectMath(question: Question): string[] {
  const formulas: string[] = [];

  if (question.math) {
    formulas.push(question.math);
  }

  for (const step of question.solution) {
    if (step.math) {
      formulas.push(step.math);
    }
  }

  for (const option of question.options ?? []) {
    if (option.math) {
      formulas.push(option.math);
    }
  }

  if (question.matching) {
    for (const item of question.matching.left) {
      if (item.math) {
        formulas.push(item.math);
      }
    }

    for (const item of question.matching.right) {
      if (item.math) {
        formulas.push(item.math);
      }
    }
  }

  return formulas;
}

function validateFormula(formula: string, variantKey: string) {
  expect(formula.trim(), `${variantKey}: порожня формула`).not.toBe('');

  expect(formula, `${variantKey}: NaN у формулі`).not.toContain('NaN');

  expect(formula, `${variantKey}: Infinity у формулі`).not.toContain(
    'Infinity',
  );

  expect(formula, `${variantKey}: undefined у формулі`).not.toContain(
    'undefined',
  );

  expect(formula, `${variantKey}: null у формулі`).not.toContain('null');

  /*
   * Старі помилки форматування:
   *
   * x+-3
   * x--3
   */
  expect(formula, `${variantKey}: знайдено "+-"`).not.toMatch(/\+\-/);

  expect(formula, `${variantKey}: знайдено "x--"`).not.toMatch(/x--/);

  /*
   * Підозрілий квадрат від'ємного числа:
   *
   * -3^2
   *
   * замість:
   *
   * (-3)^2
   */
  expect(
    formula,
    `${variantKey}: від'ємне число піднесено до степеня без дужок`,
  ).not.toMatch(/(?<![\d})])-+\d+(?:\.\d+)?\^\d/);

  /*
   * Плаваючі артефакти JS:
   *
   * 10.666666666666666
   */
  expect(formula, `${variantKey}: занадто довге десяткове число`).not.toMatch(
    /\d+\.\d{8,}/,
  );
}

describe('formula sanity audit', () => {
  for (const [courseId, rawCourse] of Object.entries(courses)) {
    const course = validateCourse(rawCourse);

    describe(courseId, () => {
      for (const topic of course.topics) {
        for (const definition of topic.generators) {
          it(`${topic.id} / ${definition.id}: 2000 задач`, () => {
            const generator = createTopicGenerator(definition);

            let generatedQuestionCount = 0;

            let checkedFormulaCount = 0;

            for (let index = 0; index < 2000; index++) {
              const question = generator();

              generatedQuestionCount++;

              const formulas = collectMath(question);

              for (const formula of formulas) {
                checkedFormulaCount++;

                validateFormula(formula, question.variantKey);
              }
            }

            expect(generatedQuestionCount).toBe(2000);

            /*
             * Не кожен генератор
             * зобов'язаний мати math,
             * тому checkedFormulaCount
             * може теоретично бути 0.
             */
            expect(checkedFormulaCount).toBeGreaterThanOrEqual(0);
          });
        }
      }
    });
  }
});
