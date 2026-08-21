import { expect, test } from '@playwright/test';

import {
  clearAppStorage,
  completeTraining,
  expectNoHorizontalOverflow,
  startTraining,
} from './helpers';

test.describe('Повний користувацький сценарій', () => {
  test.beforeEach(async ({ page }) => {
    await clearAppStorage(page);
  });

  test('користувач проходить 10 завдань і отримує історію', async ({
    page,
  }) => {
    await startTraining(page, 'equations', 10);

    await completeTraining(page, 10);

    await expect(page.getByTestId('training-result')).toBeVisible();

    await expect(page.getByTestId('training-history')).toBeVisible();

    await expectNoHorizontalOverflow(page);
  });

  test('Пройти ще раз запускає нову сесію', async ({ page }) => {
    await startTraining(page, 'functions', 2);

    await completeTraining(page, 2);

    const repeatButton = page.getByRole('button', {
      name: /Пройти ще раз/i,
    });

    await expect(repeatButton).toBeVisible();

    await repeatButton.click();

    await expect(page.getByText(/Завдання\s+1\s+з\s+2/i)).toBeVisible();

    await expect(page.getByTestId('question-card')).toBeVisible();
  });

  test('Нове тренування повертає користувача до форми', async ({ page }) => {
    await startTraining(page, 'probability', 1);

    await completeTraining(page, 1);

    await page
      .getByRole('button', {
        name: /Нове тренування/i,
      })
      .click();

    await expect(
      page.getByRole('heading', {
        name: /Налаштування тренування/i,
      }),
    ).toBeVisible();
  });

  test('історія переживає повний reload', async ({ page }) => {
    await startTraining(page, 'statistics', 1);

    await completeTraining(page, 1);

    await expect(page.getByTestId('training-history')).toBeVisible();

    await page.reload();

    await expect(page.getByTestId('training-history')).toBeVisible();
  });
});
