import type { Question } from '@/types/question';
import type { TrainingSettings } from '@/types/training';

import {
  courseTopics,
  createTopicGenerator,
  getGeneratorDefinitionsForTopic,
} from '@/engine/courseManager';

import { generateUniqueQuestion } from '@/engine/questionManager';

function randomItem<T>(values: readonly T[]): T {
  if (values.length === 0) {
    throw new Error('Неможливо вибрати елемент з порожнього масиву.');
  }

  return values[Math.floor(Math.random() * values.length)];
}

export function selectTrainingTopicId(settings: TrainingSettings): string {
  if (settings.topicIds.length === 0) {
    throw new Error('Не вибрано жодної теми.');
  }

  if (settings.mode === 'single-topic') {
    return settings.topicIds[0];
  }

  return randomItem(settings.topicIds);
}

export function generateTrainingQuestion(settings: TrainingSettings): Question {
  const topicId = selectTrainingTopicId(settings);

  const topicExists = courseTopics.some((topic) => topic.id === topicId);

  if (!topicExists) {
    throw new Error(`Тему "${topicId}" не знайдено в активному курсі.`);
  }

  const definitions = getGeneratorDefinitionsForTopic(topicId);

  if (definitions.length === 0) {
    throw new Error(`Для теми "${topicId}" немає генераторів.`);
  }

  const definition = randomItem(definitions);

  const generator = createTopicGenerator(definition);

  return generateUniqueQuestion(generator);
}
