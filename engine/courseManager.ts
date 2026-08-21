import { ACTIVE_COURSE, courses } from '@/data/activeCourse';

import type { GeneratorDefinition, TopicDefinition } from '@/types/course';

import type { Question } from '@/types/question';

import { createGenerator, isGeneratorId } from './generatorRegistry';

import { validateCourse } from './courseValidator';

const rawCourse = courses[ACTIVE_COURSE];

export const course = validateCourse(rawCourse);

export const courseTopics = course.topics;

export function getTopicById(topicId: string): TopicDefinition | undefined {
  return courseTopics.find((topic) => topic.id === topicId);
}

export function getGeneratorDefinitionsForTopic(
  topicId: string,
): GeneratorDefinition[] {
  const topic = getTopicById(topicId);

  if (!topic) {
    throw new Error(`Тему "${topicId}" не знайдено в базі курсу.`);
  }

  return topic.generators;
}

export function createTopicGenerator(
  definition: GeneratorDefinition,
): () => Question {
  if (!isGeneratorId(definition.id)) {
    throw new Error(`Генератор "${definition.id}" не зареєстрований.`);
  }

  return createGenerator(definition.id, definition.config);
}
