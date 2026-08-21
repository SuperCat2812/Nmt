import { expect, test } from '@playwright/test';

import {
  answerCurrentSingleChoice,
  clearAppStorage,
  startFractionsTraining,
} from './helpers';

const STORAGE_KEY = 'nmt-math-trainer-history';

test.describe('Історія тренувань', () => {
  test.beforeEach(async ({ page }) => {
    await clearAppStorage(page);
  });

  test('завершене тренування зберігається у localStorage', async ({ page }) => {
    await startFractionsTraining(page, 1);

    await answerCurrentSingleChoice(page);

    await page
      .getByRole('button', {
        name: /Наступне завдання/i,
      })
      .click();

    await expect(page.getByTestId('training-result')).toBeVisible();

    const raw = await page.evaluate(
      (key) => window.localStorage.getItem(key),
      STORAGE_KEY,
    );

    expect(raw).not.toBeNull();

    const history = JSON.parse(raw as string) as unknown[];

    expect(history.length).toBe(1);
  });

  test('історія відображається після завершення тренування', async ({
    page,
  }) => {
    await startFractionsTraining(page, 1);

    await answerCurrentSingleChoice(page);

    await page
      .getByRole('button', {
        name: /Наступне завдання/i,
      })
      .click();

    await expect(page.getByTestId('training-history')).toBeVisible();

    await expect(page.getByText(/Всього тренувань:\s*1/i)).toBeVisible();
  });

  test('історія не зникає після перезавантаження сторінки', async ({
    page,
  }) => {
    await startFractionsTraining(page, 1);

    await answerCurrentSingleChoice(page);

    await page
      .getByRole('button', {
        name: /Наступне завдання/i,
      })
      .click();

    const beforeReload = await page.evaluate(
      (key) => window.localStorage.getItem(key),
      STORAGE_KEY,
    );

    await page.reload();

    await expect(page.getByTestId('training-history')).toBeVisible();

    const afterReload = await page.evaluate(
      (key) => window.localStorage.getItem(key),
      STORAGE_KEY,
    );

    expect(afterReload).toBe(beforeReload);
  });

  test('історію можна очистити', async ({ page }) => {
    await startFractionsTraining(page, 1);

    await answerCurrentSingleChoice(page);

    await page
      .getByRole('button', {
        name: /Наступне завдання/i,
      })
      .click();

    await expect(page.getByTestId('training-history')).toBeVisible();

    await page
      .getByRole('button', {
        name: /Очистити історію/i,
      })
      .click();

    await expect(page.getByTestId('training-history')).not.toBeVisible();

    const raw = await page.evaluate(
      (key) => window.localStorage.getItem(key),
      STORAGE_KEY,
    );

    expect(raw).toBeNull();
  });
});
