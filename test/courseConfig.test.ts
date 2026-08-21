import { describe, expect, it } from 'vitest';

import { validateCourse } from '@/engine/courseValidator';

import courseData from '@/data/course.json';

import {
  course,
  courseTopics,
  createTopicGenerator,
} from '@/engine/courseManager';

import { isGeneratorId } from '@/engine/generatorRegistry';

import { validateQuestion } from '@/test/helpers/validateQuestion';

describe('course config', () => {
  it('курс містить теми', () => {
    expect(course.topics.length).toBeGreaterThan(0);
  });

  it('усі генератори з JSON зареєстровані', () => {
    for (const topic of courseTopics) {
      for (const generator of topic.generators) {
        expect(isGeneratorId(generator.id)).toBe(true);
      }
    }
  });

  it('кожна конфігурація реально генерує задачу', () => {
    for (const topic of courseTopics) {
      for (const definition of topic.generators) {
        const generator = createTopicGenerator(definition);

        for (let i = 0; i < 100; i++) {
          const question = generator();

          validateQuestion(question);

          expect(question.id).not.toBe('');

          expect(question.variantKey).not.toBe('');
        }
      }
    }
  });
  it('активний JSON проходить повну валідацію', () => {
    expect(() => validateCourse(courseData)).not.toThrow();
  });
});
