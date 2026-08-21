import { expect, test } from '@playwright/test';

import {
  answerCurrentSingleChoice,
  clearAppStorage,
  startFractionsTraining,
} from './helpers';

test.describe('Завершення тренування', () => {
  test.beforeEach(async ({ page }) => {
    await clearAppStorage(page);
  });

  test('користувач може пройти тренування від початку до кінця', async ({
    page,
  }) => {
    await startFractionsTraining(page, 3);

    for (let question = 1; question <= 3; question++) {
      await expect(
        page.getByText(new RegExp(`Завдання\\s+${question}\\s+з\\s+3`, 'i')),
      ).toBeVisible();

      await answerCurrentSingleChoice(page);

      await page
        .getByRole('button', {
          name: /Наступне завдання/i,
        })
        .click();
    }

    await expect(page.getByTestId('training-result')).toBeVisible();

    await expect(
      page.getByRole('heading', {
        name: /Твій результат/i,
      }),
    ).toBeVisible();
  });

  test('після завершення доступна кнопка пройти ще раз', async ({ page }) => {
    await startFractionsTraining(page, 1);

    await answerCurrentSingleChoice(page);

    await page
      .getByRole('button', {
        name: /Наступне завдання/i,
      })
      .click();

    await expect(
      page.getByRole('button', {
        name: /Пройти ще раз/i,
      }),
    ).toBeVisible();
  });

  test('Пройти ще раз запускає нову сесію з тими самими налаштуваннями', async ({
    page,
  }) => {
    await startFractionsTraining(page, 1);

    await answerCurrentSingleChoice(page);

    await page
      .getByRole('button', {
        name: /Наступне завдання/i,
      })
      .click();

    await page
      .getByRole('button', {
        name: /Пройти ще раз/i,
      })
      .click();

    await expect(page.getByText(/Завдання\s+1\s+з\s+1/i)).toBeVisible();

    await expect(page.getByTestId('question-card')).toBeVisible();
  });

  test('Нове тренування повертає до налаштувань', async ({ page }) => {
    await startFractionsTraining(page, 1);

    await answerCurrentSingleChoice(page);

    await page
      .getByRole('button', {
        name: /Наступне завдання/i,
      })
      .click();

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
});
