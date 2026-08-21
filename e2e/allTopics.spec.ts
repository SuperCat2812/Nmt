import { expect, test } from '@playwright/test';

import {
  answerCurrentQuestion,
  clearAppStorage,
  expectNoHorizontalOverflow,
  goToNextQuestion,
  startTraining,
} from './helpers';

const topics = [
  {
    id: 'fractions',
    name: 'Звичайні дроби',
  },
  {
    id: 'percentages',
    name: 'Відсотки',
  },
  {
    id: 'powers-roots',
    name: 'Степені та корені',
  },
  {
    id: 'expressions',
    name: 'Алгебраїчні вирази',
  },
  {
    id: 'equations',
    name: 'Рівняння',
  },
  {
    id: 'inequalities',
    name: 'Нерівності',
  },
  {
    id: 'functions',
    name: 'Функції',
  },
  {
    id: 'logarithms',
    name: 'Логарифми',
  },
  {
    id: 'sequences',
    name: 'Послідовності та прогресії',
  },
  {
    id: 'trigonometry',
    name: 'Тригонометрія',
  },
  {
    id: 'geometry2d',
    name: 'Планіметрія',
  },
  {
    id: 'geometry3d',
    name: 'Стереометрія',
  },
  {
    id: 'vectors',
    name: 'Вектори',
  },
  {
    id: 'combinatorics',
    name: 'Комбінаторика',
  },
  {
    id: 'probability',
    name: 'Ймовірність',
  },
  {
    id: 'statistics',
    name: 'Статистика',
  },
] as const;

test.describe('Всі теми НМТ', () => {
  test.beforeEach(async ({ page }) => {
    await clearAppStorage(page);
  });

  for (const topic of topics) {
    test(`${topic.name}: повний цикл одного завдання`, async ({ page }) => {
      await startTraining(page, topic.id, 1);

      const questionCard = page.getByTestId('question-card');

      await expect(questionCard).toBeVisible();
      await expect(questionCard).not.toBeEmpty();

      await expectNoHorizontalOverflow(page);

      await answerCurrentQuestion(page);

      await expect(page.getByTestId('answer-feedback')).toBeVisible();

      await expect(page.getByText(/Правильно!|Неправильно/i)).toBeVisible();

      await expect(
        page.getByRole('heading', {
          name: /Розв'язання/i,
        }),
      ).toBeVisible();

      await expectNoHorizontalOverflow(page);

      await goToNextQuestion(page);

      await expect(page.getByTestId('training-result')).toBeVisible();

      await expect(
        page.getByRole('heading', {
          name: /Твій результат/i,
        }),
      ).toBeVisible();

      await expectNoHorizontalOverflow(page);
    });
  }
});
