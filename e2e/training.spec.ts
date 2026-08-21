import { expect, test } from '@playwright/test';

import {
  answerCurrentSingleChoice,
  clearAppStorage,
  startFractionsTraining,
} from './helpers';

test.describe('Проходження тренування', () => {
  test.beforeEach(async ({ page }) => {
    await clearAppStorage(page);
  });

  test('тренування успішно запускається', async ({ page }) => {
    await startFractionsTraining(page, 3);

    await expect(page.getByText(/Завдання\s+1\s+з\s+3/i)).toBeVisible();

    await expect(page.getByTestId('question-card')).toBeVisible();
  });

  test('single-choice має від 2 до 4 варіантів', async ({ page }) => {
    await startFractionsTraining(page, 3);

    const options = page.getByTestId('answer-options').getByRole('button');

    const count = await options.count();

    expect(count).toBeGreaterThanOrEqual(2);

    expect(count).toBeLessThanOrEqual(4);
  });

  test('вибір відповіді ще не показує результат', async ({ page }) => {
    await startFractionsTraining(page, 3);

    const options = page.getByTestId('answer-options').getByRole('button');

    await options.first().click();

    await expect(page.getByTestId('answer-feedback')).not.toBeVisible();

    await expect(
      page.getByRole('button', {
        name: /Перевірити/i,
      }),
    ).toBeVisible();
  });

  test('після Перевірити показується результат і розв’язання', async ({
    page,
  }) => {
    await startFractionsTraining(page, 3);

    await answerCurrentSingleChoice(page);

    await expect(page.getByText(/Правильно!|Неправильно/i)).toBeVisible();

    await expect(
      page.getByRole('heading', {
        name: /Розв'язання/i,
      }),
    ).toBeVisible();

    await expect(
      page.getByRole('button', {
        name: /Наступне завдання/i,
      }),
    ).toBeVisible();
  });

  test('після перевірки варіанти відповідей блокуються', async ({ page }) => {
    await startFractionsTraining(page, 3);

    const options = page.getByTestId('answer-options').getByRole('button');

    await options.first().click();

    await page
      .getByRole('button', {
        name: /Перевірити/i,
      })
      .click();

    const count = await options.count();

    for (let index = 0; index < count; index++) {
      await expect(options.nth(index)).toBeDisabled();
    }
  });

  test('можна перейти до другого завдання', async ({ page }) => {
    await startFractionsTraining(page, 3);

    await answerCurrentSingleChoice(page);

    await page
      .getByRole('button', {
        name: /Наступне завдання/i,
      })
      .click();

    await expect(page.getByText(/Завдання\s+2\s+з\s+3/i)).toBeVisible();
  });
});
