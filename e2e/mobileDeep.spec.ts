import { expect, test } from '@playwright/test';

import {
  answerCurrentQuestion,
  clearAppStorage,
  expectNoHorizontalOverflow,
  startTraining,
} from './helpers';

test.describe('Глибока mobile-перевірка', () => {
  test.beforeEach(async ({ page }) => {
    await clearAppStorage(page);
  });

  test('сторінка налаштувань не має горизонтального скролу', async ({
    page,
  }) => {
    await expectNoHorizontalOverflow(page);

    await expect(
      page.getByRole('heading', {
        name: /НМТ Математика 2026/i,
      }),
    ).toBeVisible();

    await expect(
      page.getByRole('button', {
        name: /Почати тренування/i,
      }),
    ).toBeVisible();
  });

  test('картка завдання не створює horizontal overflow', async ({ page }) => {
    await startTraining(page, 'fractions', 2);

    await expectNoHorizontalOverflow(page);

    const card = page.getByTestId('question-card');

    await expect(card).toBeVisible();

    const box = await card.boundingBox();

    expect(box).not.toBeNull();

    const viewport = page.viewportSize();

    expect(viewport).not.toBeNull();

    if (box && viewport) {
      expect(box.x + box.width).toBeLessThanOrEqual(viewport.width + 1);
    }
  });

  test('варіанти відповіді повністю поміщаються по ширині', async ({
    page,
  }) => {
    await startTraining(page, 'fractions', 1);

    const options = page.getByTestId('answer-options').getByRole('button');

    const count = await options.count();

    expect(count).toBeGreaterThanOrEqual(2);

    expect(count).toBeLessThanOrEqual(4);

    const viewport = page.viewportSize();

    expect(viewport).not.toBeNull();

    for (let index = 0; index < count; index++) {
      const box = await options.nth(index).boundingBox();

      expect(box).not.toBeNull();

      if (box && viewport) {
        expect(box.x).toBeGreaterThanOrEqual(0);

        expect(box.x + box.width).toBeLessThanOrEqual(viewport.width + 1);
      }
    }
  });

  test('після відповіді feedback і solution доступні', async ({ page }) => {
    await startTraining(page, 'fractions', 1);

    await answerCurrentQuestion(page);

    await expect(page.getByTestId('answer-feedback')).toBeVisible();

    await expect(
      page.getByRole('heading', {
        name: /Розв'язання/i,
      }),
    ).toBeVisible();

    await expectNoHorizontalOverflow(page);
  });

  test('загальна статистика не показується під активним питанням', async ({
    page,
  }) => {
    await startTraining(page, 'fractions', 2);

    await expect(page.getByTestId('training-history')).not.toBeVisible();
  });

  test('довга математична тема не ламає mobile layout', async ({ page }) => {
    await startTraining(page, 'geometry2d', 1);

    await expect(page.getByTestId('question-card')).toBeVisible();

    await expectNoHorizontalOverflow(page);

    await answerCurrentQuestion(page);

    await expectNoHorizontalOverflow(page);
  });
});
