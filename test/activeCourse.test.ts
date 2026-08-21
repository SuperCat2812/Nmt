import { describe, expect, it } from 'vitest';

import { ACTIVE_COURSE, courses } from '@/data/activeCourse';

import { validateCourse } from '@/engine/courseValidator';

describe('activeCourse', () => {
  it('активний курс існує', () => {
    expect(ACTIVE_COURSE in courses).toBe(true);
  });

  it('кожен курс має базові поля', () => {
    for (const course of Object.values(courses)) {
      expect(course.id).not.toBe('');
      expect(course.name).not.toBe('');
      expect(course.topics.length).toBeGreaterThan(0);
    }
  });

  it('усі доступні курси проходять runtime-валідацію', () => {
    for (const course of Object.values(courses)) {
      expect(() => validateCourse(course)).not.toThrow();
    }
  });
});
