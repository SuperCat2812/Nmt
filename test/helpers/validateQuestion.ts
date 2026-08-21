import type { Question } from '@/types/question';

export function validateQuestion(question: Question) {
  if (!question.id) {
    throw new Error('Question.id порожній.');
  }

  if (!question.generatorId) {
    throw new Error('generatorId порожній.');
  }

  if (!question.familyId) {
    throw new Error('familyId порожній.');
  }

  if (!question.topicId) {
    throw new Error('topicId порожній.');
  }

  if (!question.variantKey) {
    throw new Error('variantKey порожній.');
  }

  if (!question.title) {
    throw new Error('title порожній.');
  }

  if (!question.solution.length) {
    throw new Error(`У ${question.variantKey} немає solution.`);
  }

  if (question.type === 'single-choice') {
    if (!question.options || question.options.length === 0) {
      throw new Error(`У ${question.variantKey} немає options.`);
    }

    const values = question.options.map((option) => option.value);

    const uniqueValues = new Set(values);

    if (values.length !== uniqueValues.size) {
      throw new Error(
        `У ${question.variantKey} є дублікати відповідей: ${values.join(', ')}`,
      );
    }

    if (!values.includes(String(question.correctAnswer))) {
      throw new Error(
        `Правильної відповіді немає серед options у ${question.variantKey}`,
      );
    }

    for (const option of question.options) {
      if (!option.text && !option.math) {
        throw new Error(`Option ${option.id} нічого не відображає.`);
      }
    }
  }

  if (question.type === 'matching') {
    if (!question.matching) {
      throw new Error('Matching question не містить matching.');
    }

    if (typeof question.correctAnswer !== 'object') {
      throw new Error('Matching correctAnswer має бути об’єктом.');
    }
  }

  if (
    question.type === 'numeric' &&
    typeof question.correctAnswer === 'object'
  ) {
    throw new Error('Numeric correctAnswer не може бути об’єктом.');
  }
}
