import { expect, test } from '@playwright/test';

import {
  answerCurrentQuestion,
  clearAppStorage,
  expectNoHorizontalOverflow,
  goToNextQuestion,
} from './helpers';

test.describe('Глибока перевірка змішаного режиму', () => {
  test.beforeEach(async ({ page }) => {
    await clearAppStorage(page);
  });

  test('можна вибрати багато тем і пройти змішане тренування', async ({
    page,
  }) => {
    const mode = page.getByTestId('training-mode');

    await mode.selectOption('mixed');

    await expect(mode).toHaveValue('mixed');

    const group = page.getByRole('group', {
      name: /Обери теми:/i,
    });

    await expect(group).toBeVisible();

    const checkboxes = group.getByRole('checkbox');

    const count = await checkboxes.count();

    expect(count).toBeGreaterThanOrEqual(16);

    for (let index = 0; index < count; index++) {
      const checkbox = checkboxes.nth(index);

      if (!(await checkbox.isChecked())) {
        await checkbox.check();
      }
    }

    for (let index = 0; index < count; index++) {
      await expect(checkboxes.nth(index)).toBeChecked();
    }

    const questionCount = page.getByTestId('question-count');

    await questionCount.fill('10');

    await page
      .getByRole('button', {
        name: /Почати тренування/i,
      })
      .click();

    await expect(page.getByText(/Завдання\s+1\s+з\s+10/i)).toBeVisible();

    await expectNoHorizontalOverflow(page);

    for (let number = 1; number <= 10; number++) {
      await expect(
        page.getByText(new RegExp(`Завдання\\s+${number}\\s+з\\s+10`, 'i')),
      ).toBeVisible();

      await answerCurrentQuestion(page);

      await expect(page.getByTestId('answer-feedback')).toBeVisible();

      await goToNextQuestion(page);
    }

    await expect(page.getByTestId('training-result')).toBeVisible();
  });

  test('старт недоступний після зняття всіх тем', async ({ page }) => {
    await page.getByTestId('training-mode').selectOption('mixed');

    const group = page.getByRole('group', {
      name: /Обери теми:/i,
    });

    const checkboxes = group.getByRole('checkbox');

    const count = await checkboxes.count();

    for (let index = 0; index < count; index++) {
      const checkbox = checkboxes.nth(index);

      if (await checkbox.isChecked()) {
        await checkbox.uncheck();
      }
    }

    await expect(
      page.getByRole('button', {
        name: /Почати тренування/i,
      }),
    ).toBeDisabled();
  });

  test('перемикання mixed → single → mixed не ламає форму', async ({
    page,
  }) => {
    const mode = page.getByTestId('training-mode');

    await mode.selectOption('mixed');

    await expect(
      page.getByRole('group', {
        name: /Обери теми:/i,
      }),
    ).toBeVisible();

    await mode.selectOption('single-topic');

    await expect(page.getByTestId('single-topic-select')).toBeVisible();

    await mode.selectOption('mixed');

    await expect(
      page.getByRole('group', {
        name: /Обери теми:/i,
      }),
    ).toBeVisible();
  });
});
