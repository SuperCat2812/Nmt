import { describe, expect, it } from 'vitest';

import { courses } from '@/data/activeCourse';

import { createTopicGenerator } from '@/engine/courseManager';

import { validateCourse } from '@/engine/courseValidator';

import type { Visual } from '@/types/visual';

const ITERATIONS = 2000;

function expectFinite(value: number, context: string) {
  expect(Number.isFinite(value), `${context}: значення має бути finite`).toBe(
    true,
  );
}

function validateVisual(visual: Visual, variantKey: string) {
  if (visual.type === 'bar-chart') {
    expect(
      visual.data.length,
      `${variantKey}: bar-chart порожній`,
    ).toBeGreaterThan(0);

    for (const item of visual.data) {
      expect(item.label.trim(), `${variantKey}: порожній label`).not.toBe('');

      expectFinite(item.value, `${variantKey}: bar value`);
    }

    return;
  }

  if (visual.type === 'function') {
    expect(
      visual.expression.trim(),
      `${variantKey}: порожній expression`,
    ).not.toBe('');

    for (const [name, value] of Object.entries({
      xMin: visual.xMin,

      xMax: visual.xMax,

      yMin: visual.yMin,

      yMax: visual.yMax,
    })) {
      if (value !== undefined) {
        expectFinite(value, `${variantKey}: ${name}`);
      }
    }

    if (visual.xMin !== undefined && visual.xMax !== undefined) {
      expect(visual.xMin, `${variantKey}: xMin має бути < xMax`).toBeLessThan(
        visual.xMax,
      );
    }

    if (visual.yMin !== undefined && visual.yMax !== undefined) {
      expect(visual.yMin, `${variantKey}: yMin має бути < yMax`).toBeLessThan(
        visual.yMax,
      );
    }

    return;
  }

  if (visual.type === 'geometry2d') {
    expect(
      visual.points.length,
      `${variantKey}: немає geometry points`,
    ).toBeGreaterThan(0);

    const ids = visual.points.map((point) => point.id);

    const idSet = new Set(ids);

    expect(idSet.size, `${variantKey}: дублікати point.id`).toBe(ids.length);

    for (const point of visual.points) {
      expect(point.id.trim()).not.toBe('');

      expectFinite(point.x, `${variantKey}: point.x`);

      expectFinite(point.y, `${variantKey}: point.y`);
    }

    for (const segment of visual.segments) {
      expect(
        idSet.has(segment.from),
        `${variantKey}: segment.from=${segment.from} не існує`,
      ).toBe(true);

      expect(
        idSet.has(segment.to),
        `${variantKey}: segment.to=${segment.to} не існує`,
      ).toBe(true);

      expect(
        segment.from,
        `${variantKey}: segment з'єднує точку саму з собою`,
      ).not.toBe(segment.to);
    }

    return;
  }

  /*
   * Если дошли сюда —
   * это table visual.
   */

  expect(
    visual.headers.length,
    `${variantKey}: table headers порожні`,
  ).toBeGreaterThan(0);

  expect(
    visual.rows.length,
    `${variantKey}: table rows порожні`,
  ).toBeGreaterThan(0);

  for (const row of visual.rows) {
    expect(
      row.length,
      `${variantKey}: неправильна кількість клітинок table`,
    ).toBe(visual.headers.length);

    for (const cell of row) {
      if (typeof cell === 'number') {
        expectFinite(cell, `${variantKey}: table cell`);
      }
    }
  }
}

describe('visual integrity audit', () => {
  let visualCount = 0;

  for (const [courseId, rawCourse] of Object.entries(courses)) {
    const course = validateCourse(rawCourse);

    describe(courseId, () => {
      for (const topic of course.topics) {
        for (const definition of topic.generators) {
          it(`${topic.id} / ${definition.id}: visual audit`, () => {
            const generator = createTopicGenerator(definition);

            for (let index = 0; index < ITERATIONS; index++) {
              const question = generator();

              if (!question.visual) {
                continue;
              }

              visualCount++;

              validateVisual(question.visual, question.variantKey);
            }
          });
        }
      }
    });
  }

  it('audit реально зустрів visual-задачі', () => {
    expect(visualCount).toBeGreaterThan(0);
  });
});
