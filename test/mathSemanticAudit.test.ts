import { describe, expect, it } from 'vitest';

import { courses } from '@/data/activeCourse';

import { validateCourse } from '@/engine/courseValidator';

import { createTopicGenerator } from '@/engine/courseManager';

import type { Question } from '@/types/question';

const ITERATIONS = 2000;

function toNumber(value: string, context: string): number {
  const number = Number(value);

  expect(Number.isFinite(number), `${context}: "${value}" не є числом`).toBe(
    true,
  );

  return number;
}

function parsePair(value: string, context: string): [number, number] {
  const parts = value.split(';');

  expect(parts.length, `${context}: очікувалася пара чисел`).toBe(2);

  return [toNumber(parts[0], context), toNumber(parts[1], context)];
}

function expectNumberAnswer(question: Question, expected: number) {
  const actual = toNumber(String(question.correctAnswer), question.variantKey);

  expect(actual, question.variantKey).toBeCloseTo(expected, 10);
}

function auditPercentage(question: Question): boolean {
  const parts = question.variantKey.split(':');

  if (parts[0] !== 'percentage') {
    return false;
  }

  const form = parts[1];

  switch (form) {
    case 'percent-of-number': {
      const number = toNumber(parts[2], question.variantKey);

      const percent = toNumber(parts[3], question.variantKey);

      expectNumberAnswer(question, (number * percent) / 100);

      return true;
    }

    case 'number-by-percent': {
      const number = toNumber(parts[2], question.variantKey);

      expectNumberAnswer(question, number);

      return true;
    }

    case 'ratio': {
      const part = toNumber(parts[2], question.variantKey);

      const whole = toNumber(parts[3], question.variantKey);

      expectNumberAnswer(question, (part / whole) * 100);

      return true;
    }

    case 'increase': {
      const original = toNumber(parts[2], question.variantKey);

      const percent = toNumber(parts[3], question.variantKey);

      expectNumberAnswer(question, original * (1 + percent / 100));

      return true;
    }

    case 'decrease': {
      const original = toNumber(parts[2], question.variantKey);

      const percent = toNumber(parts[3], question.variantKey);

      expectNumberAnswer(question, original * (1 - percent / 100));

      return true;
    }

    case 'change': {
      const original = toNumber(parts[2], question.variantKey);

      const newValue = toNumber(parts[3], question.variantKey);

      const expected =
        (Math.abs(newValue - original) / Math.abs(original)) * 100;

      expectNumberAnswer(question, expected);

      return true;
    }

    case 'successive': {
      const original = toNumber(parts[2], question.variantKey);

      const first = toNumber(parts[3], question.variantKey);

      const second = toNumber(parts[4], question.variantKey);

      const afterFirst = Math.round(original * (1 + first / 100) * 100) / 100;

      const expected = Math.round(afterFirst * (1 - second / 100) * 100) / 100;

      expectNumberAnswer(question, expected);

      return true;
    }

    default:
      return false;
  }
}

function auditQuadratic(question: Question): boolean {
  const parts = question.variantKey.split(':');

  if (parts[0] !== 'quadratic') {
    return false;
  }

  if (parts[1] === 'two-roots') {
    const expected1 = toNumber(parts[2], question.variantKey);

    const expected2 = toNumber(parts[3], question.variantKey);

    expect(expected1).not.toBe(expected2);

    const [actual1, actual2] = parsePair(
      String(question.correctAnswer),
      question.variantKey,
    );

    expect(actual1).toBe(expected1);

    expect(actual2).toBe(expected2);

    /*
     * Рівняння було побудовано
     * за коренями:
     *
     * x² + bx + c = 0
     */
    const b = -(expected1 + expected2);

    const c = expected1 * expected2;

    expect(actual1 ** 2 + b * actual1 + c).toBeCloseTo(0);

    expect(actual2 ** 2 + b * actual2 + c).toBeCloseTo(0);

    return true;
  }

  if (parts[1] === 'double-root') {
    const root = toNumber(parts[2], question.variantKey);

    expectNumberAnswer(question, root);

    const b = -2 * root;

    const c = root ** 2;

    expect(root ** 2 + b * root + c).toBeCloseTo(0);

    return true;
  }

  return false;
}

function auditFunction(question: Question): boolean {
  const parts = question.variantKey.split(':');

  if (parts[0] !== 'function') {
    return false;
  }

  switch (parts[1]) {
    case 'value':
    case 'graph-value': {
      const a = toNumber(parts[2], question.variantKey);

      const b = toNumber(parts[3], question.variantKey);

      const x = toNumber(parts[4], question.variantKey);

      expectNumberAnswer(question, a * x + b);

      return true;
    }

    case 'zeros': {
      const first = toNumber(parts[2], question.variantKey);

      const second = toNumber(parts[3], question.variantKey);

      const [actual1, actual2] = parsePair(
        String(question.correctAnswer),
        question.variantKey,
      );

      expect(actual1).toBe(first);

      expect(actual2).toBe(second);

      const b = -(first + second);

      const c = first * second;

      expect(actual1 ** 2 + b * actual1 + c).toBeCloseTo(0);

      expect(actual2 ** 2 + b * actual2 + c).toBeCloseTo(0);

      return true;
    }

    case 'vertex': {
      const h = toNumber(parts[3], question.variantKey);

      const k = toNumber(parts[4], question.variantKey);

      const [actualH, actualK] = parsePair(
        String(question.correctAnswer),
        question.variantKey,
      );

      expect(actualH).toBe(h);
      expect(actualK).toBe(k);

      return true;
    }

    default:
      return false;
  }
}

function auditSequence(question: Question): boolean {
  const parts = question.variantKey.split(':');

  if (parts[0] !== 'sequence') {
    return false;
  }

  switch (parts[1]) {
    case 'arithmetic-next': {
      const a1 = toNumber(parts[2], question.variantKey);

      const d = toNumber(parts[3], question.variantKey);

      expectNumberAnswer(question, a1 + 3 * d);

      return true;
    }

    case 'arithmetic-nth': {
      const a1 = toNumber(parts[2], question.variantKey);

      const d = toNumber(parts[3], question.variantKey);

      const n = toNumber(parts[4], question.variantKey);

      expectNumberAnswer(question, a1 + (n - 1) * d);

      return true;
    }

    case 'arithmetic-sum': {
      const a1 = toNumber(parts[2], question.variantKey);

      const d = toNumber(parts[3], question.variantKey);

      const n = toNumber(parts[4], question.variantKey);

      const an = a1 + (n - 1) * d;

      expectNumberAnswer(question, (n * (a1 + an)) / 2);

      return true;
    }

    case 'geometric-next': {
      const b1 = toNumber(parts[2], question.variantKey);

      const q = toNumber(parts[3], question.variantKey);

      expectNumberAnswer(question, b1 * q ** 3);

      return true;
    }

    case 'geometric-nth': {
      const b1 = toNumber(parts[2], question.variantKey);

      const q = toNumber(parts[3], question.variantKey);

      const n = toNumber(parts[4], question.variantKey);

      expectNumberAnswer(question, b1 * q ** (n - 1));

      return true;
    }

    case 'geometric-sum': {
      const b1 = toNumber(parts[2], question.variantKey);

      const q = toNumber(parts[3], question.variantKey);

      const n = toNumber(parts[4], question.variantKey);

      expect(q).not.toBe(1);

      expectNumberAnswer(question, (b1 * (q ** n - 1)) / (q - 1));

      return true;
    }

    default:
      return false;
  }
}

function auditVector(question: Question): boolean {
  const parts = question.variantKey.split(':');

  if (parts[0] !== 'vector') {
    return false;
  }

  if (parts[1] === 'dot') {
    const a1 = toNumber(parts[2], question.variantKey);

    const a2 = toNumber(parts[3], question.variantKey);

    const b1 = toNumber(parts[4], question.variantKey);

    const b2 = toNumber(parts[5], question.variantKey);

    expectNumberAnswer(question, a1 * b1 + a2 * b2);

    return true;
  }

  if (parts[1] === 'length') {
    const x = toNumber(parts[2], question.variantKey);

    const y = toNumber(parts[3], question.variantKey);

    expectNumberAnswer(question, Math.sqrt(x ** 2 + y ** 2));

    return true;
  }

  if (parts[1] === 'coordinates2d') {
    const x1 = toNumber(parts[2], question.variantKey);

    const y1 = toNumber(parts[3], question.variantKey);

    const x2 = toNumber(parts[4], question.variantKey);

    const y2 = toNumber(parts[5], question.variantKey);

    const [dx, dy] = parsePair(
      String(question.correctAnswer),
      question.variantKey,
    );

    expect(dx).toBe(x2 - x1);

    expect(dy).toBe(y2 - y1);

    return true;
  }

  return false;
}

function auditCalculus(question: Question): boolean {
  const parts = question.variantKey.split(':');

  if (parts[0] !== 'calculus') {
    return false;
  }

  switch (parts[1]) {
    case 'limit': {
      const k = toNumber(parts[2], question.variantKey);

      const b = toNumber(parts[3], question.variantKey);

      const x = toNumber(parts[4], question.variantKey);

      expectNumberAnswer(question, k * x + b);

      return true;
    }

    case 'derivative-at-point': {
      const a = toNumber(parts[2], question.variantKey);

      const n = toNumber(parts[3], question.variantKey);

      const x = toNumber(parts[4], question.variantKey);

      expectNumberAnswer(question, a * n * x ** (n - 1));

      return true;
    }

    case 'tangent': {
      const a = toNumber(parts[2], question.variantKey);

      const x = toNumber(parts[3], question.variantKey);

      expectNumberAnswer(question, 2 * a * x);

      return true;
    }

    default:
      return false;
  }
}

function auditNumericalMethod(question: Question): boolean {
  const parts = question.variantKey.split(':');

  if (parts[0] !== 'numerical') {
    return false;
  }

  switch (parts[1]) {
    case 'bisection': {
      const a = toNumber(parts[2], question.variantKey);

      const b = toNumber(parts[3], question.variantKey);

      expectNumberAnswer(question, (a + b) / 2);

      return true;
    }

    case 'newton': {
      const target = toNumber(parts[2], question.variantKey);

      const x = toNumber(parts[3], question.variantKey);

      const fx = x ** 2 - target;

      const derivative = 2 * x;

      const expected = Math.round((x - fx / derivative) * 10_000) / 10_000;

      expectNumberAnswer(question, expected);

      return true;
    }

    case 'finite-difference': {
      const x = toNumber(parts[2], question.variantKey);

      const h = toNumber(parts[3], question.variantKey);

      const expected = ((x + h) ** 2 - x ** 2) / h;

      expectNumberAnswer(question, expected);

      return true;
    }

    case 'trapezoid': {
      const a = toNumber(parts[2], question.variantKey);

      const b = toNumber(parts[3], question.variantKey);

      const expected = ((b - a) * (a ** 2 + b ** 2)) / 2;

      expectNumberAnswer(question, expected);

      return true;
    }

    default:
      return false;
  }
}

function auditQuestion(question: Question): boolean {
  return (
    auditPercentage(question) ||
    auditQuadratic(question) ||
    auditFunction(question) ||
    auditSequence(question) ||
    auditVector(question) ||
    auditCalculus(question) ||
    auditNumericalMethod(question)
  );
}

describe('deep mathematical semantic audit', () => {
  let auditedQuestions = 0;

  for (const [courseId, rawCourse] of Object.entries(courses)) {
    const course = validateCourse(rawCourse);

    describe(courseId, () => {
      for (const topic of course.topics) {
        for (const definition of topic.generators) {
          it(`${topic.id} / ${definition.id}: semantic audit`, () => {
            const generator = createTopicGenerator(definition);

            let localAudited = 0;

            for (let index = 0; index < ITERATIONS; index++) {
              const question = generator();

              if (auditQuestion(question)) {
                localAudited++;
                auditedQuestions++;
              }
            }

            /*
             * Не всі генератори поки
             * мають semantic checker.
             *
             * Якщо checker підтримується,
             * він повинен реально
             * перевірити багато задач.
             */
            if (localAudited > 0) {
              expect(localAudited).toBeGreaterThan(100);
            }
          });
        }
      }
    });
  }

  it('semantic audit реально перевіряє тисячі задач', () => {
    expect(auditedQuestions).toBeGreaterThan(10_000);
  });
});
