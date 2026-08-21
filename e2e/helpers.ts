import { expect, type Page } from '@playwright/test';

export async function clearAppStorage(page: Page) {
  await page.goto('/');

  await page.evaluate(() => {
    window.localStorage.clear();
  });

  await page.reload();

  await expect(
    page.getByRole('heading', {
      name: /Налаштування тренування/i,
    }),
  ).toBeVisible();
}

export async function selectFractionsTopic(page: Page) {
  await page.getByTestId('training-mode').selectOption('single-topic');

  await page.getByTestId('single-topic-select').selectOption('fractions');
}

export async function startFractionsTraining(page: Page, count = 3) {
  await page.goto('/');

  await expect(
    page.getByRole('heading', {
      name: /Налаштування тренування/i,
    }),
  ).toBeVisible();

  await selectFractionsTopic(page);

  const countInput = page.getByTestId('question-count');

  await countInput.fill(String(count));

  await expect(countInput).toHaveValue(String(count));

  const startButton = page.getByRole('button', {
    name: /Почати тренування/i,
  });

  await expect(startButton).toBeEnabled();

  await startButton.click();

  await expect(page.getByTestId('question-card')).toBeVisible({
    timeout: 15_000,
  });
}

export async function answerCurrentSingleChoice(page: Page) {
  const options = page.getByTestId('answer-options').getByRole('button');

  await expect(options.first()).toBeVisible();

  const count = await options.count();

  expect(count).toBeGreaterThanOrEqual(2);

  expect(count).toBeLessThanOrEqual(4);

  await options.first().click();

  const checkButton = page.getByRole('button', {
    name: /Перевірити/i,
  });

  await expect(checkButton).toBeEnabled();

  await checkButton.click();

  await expect(page.getByTestId('answer-feedback')).toBeVisible({
    timeout: 10_000,
  });
}
