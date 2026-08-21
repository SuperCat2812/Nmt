import { expect, test } from '@playwright/test';

import {
  answerCurrentQuestion,
  clearAppStorage,
  expectNoHorizontalOverflow,
  goToNextQuestion,
  startTraining,
} from './helpers';

const topics = [
  'fractions',
  'percentages',
  'powers-roots',
  'expressions',
  'equations',
  'inequalities',
  'functions',
  'logarithms',
  'sequences',
  'trigonometry',
  'geometry2d',
  'geometry3d',
  'vectors',
  'combinatorics',
  'probability',
  'statistics',
] as const;

test.describe('User stress scenarios', () => {
  test.beforeEach(async ({ page }) => {
    await clearAppStorage(page);
  });

  for (const topic of topics) {
    test(`${topic}: 5 задач підряд`, async ({ page }) => {
      await startTraining(page, topic, 5);

      for (let number = 1; number <= 5; number++) {
        await expect(
          page.getByText(new RegExp(`Завдання\\s+${number}\\s+з\\s+5`, 'i')),
        ).toBeVisible();

        await expect(page.getByTestId('question-card')).toBeVisible();

        await expectNoHorizontalOverflow(page);

        await answerCurrentQuestion(page);

        await expect(page.getByTestId('answer-feedback')).toBeVisible();

        await expect(
          page.getByRole('heading', {
            name: /Розв'язання/i,
          }),
        ).toBeVisible();

        /*
         * Після перевірки питання
         * не повинно зникати.
         */
        await expect(page.getByTestId('question-card')).toBeVisible();

        await expectNoHorizontalOverflow(page);

        await goToNextQuestion(page);
      }

      await expect(page.getByTestId('training-result')).toBeVisible({
        timeout: 15_000,
      });

      await expect(
        page.getByRole('heading', {
          name: /Твій результат/i,
        }),
      ).toBeVisible();

      await expectNoHorizontalOverflow(page);
    });
  }

  test('50 задач проходяться без зависання UI', async ({ page }) => {
    test.setTimeout(180_000);

    await startTraining(page, 'fractions', 50);

    for (let number = 1; number <= 50; number++) {
      await expect(
        page.getByText(new RegExp(`Завдання\\s+${number}\\s+з\\s+50`, 'i')),
      ).toBeVisible();

      await answerCurrentQuestion(page);

      await goToNextQuestion(page);
    }

    await expect(page.getByTestId('training-result')).toBeVisible();
  });

  test('100 задач реально стартують', async ({ page }) => {
    await startTraining(page, 'equations', 100);

    await expect(page.getByText(/Завдання\s+1\s+з\s+100/i)).toBeVisible();

    await expect(page.getByTestId('question-card')).toBeVisible();
  });

  test('подвійний клік по Перевірити не ламає стан', async ({ page }) => {
    await startTraining(page, 'functions', 2);

    const options = page.getByTestId('answer-options').getByRole('button');

    await options.first().click();

    const check = page.getByRole('button', {
      name: /Перевірити/i,
    });

    await check.dblclick();

    await expect(page.getByTestId('answer-feedback')).toBeVisible();

    await expect(
      page.getByRole('heading', {
        name: /Розв'язання/i,
      }),
    ).toBeVisible();
  });

  test('після відповіді не можна змінити вибраний варіант', async ({
    page,
  }) => {
    await startTraining(page, 'fractions', 1);

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

  test('reload під час налаштування не ламає застосунок', async ({ page }) => {
    await page.goto('/');

    const count = page.getByTestId('question-count');

    await count.fill('25');

    await page.reload();

    await expect(
      page.getByRole('heading', {
        name: /Налаштування тренування/i,
      }),
    ).toBeVisible();

    await expect(
      page.getByRole('button', {
        name: /Почати тренування/i,
      }),
    ).toBeVisible();
  });

  test('історія не дублюється через reload', async ({ page }) => {
    await startTraining(page, 'fractions', 1);

    await answerCurrentQuestion(page);

    await goToNextQuestion(page);

    await expect(page.getByTestId('training-result')).toBeVisible();

    const before = await page.evaluate(() => {
      return Object.entries(localStorage);
    });

    await page.reload();

    const after = await page.evaluate(() => {
      return Object.entries(localStorage);
    });

    expect(after).toEqual(before);
  });

  test('сторінка не створює horizontal overflow після декількох питань', async ({
    page,
  }) => {
    await startTraining(page, 'geometry2d', 5);

    for (let index = 0; index < 5; index++) {
      await expectNoHorizontalOverflow(page);

      await answerCurrentQuestion(page);

      await expectNoHorizontalOverflow(page);

      await goToNextQuestion(page);
    }

    await expectNoHorizontalOverflow(page);
  });
});
