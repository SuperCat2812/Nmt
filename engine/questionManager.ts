import type { Question } from '@/types/question';

const usedVariantKeys = new Set<string>();
export function resetQuestions() {
  usedVariantKeys.clear();
}
export function generateUniqueQuestion(generator: () => Question): Question {
  const maxAttempts = 100;
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    const question = generator();
    if (!usedVariantKeys.has(question.variantKey)) {
      usedVariantKeys.add(question.variantKey);
      return question;
    }
  }
  throw new Error('Не вдалося створити нове унікальне завдання.');
}
