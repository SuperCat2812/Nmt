import { expect, test } from '@playwright/test';

import { clearAppStorage } from './helpers';

test.describe('Налаштування тренування', () => {
  test.beforeEach(async ({ page }) => {
    await clearAppStorage(page);

    await page.goto('/');

    await expect(
      page.getByRole('heading', {
        name: /Налаштування тренування/i,
      }),
    ).toBeVisible();
  });

  // ========================================
  // Головна сторінка
  // ========================================

  test('головна сторінка відкривається', async ({ page }) => {
    await expect(
      page.getByRole('heading', {
        name: /НМТ Математика 2026/i,
      }),
    ).toBeVisible();

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

  // ========================================
  // Режим за замовчуванням
  // ========================================

  test('за замовчуванням вибрано режим однієї теми', async ({ page }) => {
    const modeSelect = page.getByTestId('training-mode');

    await expect(modeSelect).toBeVisible();

    await expect(modeSelect).toHaveValue('single-topic');

    await expect(page.getByTestId('single-topic-select')).toBeVisible();
  });

  // ========================================
  // Кількість завдань
  // ========================================

  test('кількість завдань можна змінити', async ({ page }) => {
    const countInput = page.getByTestId('question-count');

    await expect(countInput).toBeVisible();

    await countInput.fill('20');

    await expect(countInput).toHaveValue('20');
  });

  test('кількість завдань не може бути меншою за 1', async ({ page }) => {
    const countInput = page.getByTestId('question-count');

    await countInput.fill('0');

    await countInput.blur();

    const value = Number(await countInput.inputValue());

    expect(value).toBeGreaterThanOrEqual(1);
  });

  test('кількість завдань не може бути більшою за 100', async ({ page }) => {
    const countInput = page.getByTestId('question-count');

    await countInput.fill('101');

    await countInput.blur();

    const value = Number(await countInput.inputValue());

    expect(value).toBeLessThanOrEqual(100);
  });

  // ========================================
  // Змішаний режим
  // ========================================

  test('можна переключитися у змішаний режим', async ({ page }) => {
    const modeSelect = page.getByTestId('training-mode');

    await modeSelect.selectOption('mixed');

    await expect(modeSelect).toHaveValue('mixed');

    const topicGroup = page.getByRole('group', {
      name: /Обери теми:/i,
    });

    await expect(topicGroup).toBeVisible();
  });

  // ========================================
  // Вибір декількох тем
  // ========================================

  test('у змішаному режимі можна вибрати кілька тем', async ({ page }) => {
    const modeSelect = page.getByTestId('training-mode');

    await modeSelect.selectOption('mixed');

    await expect(modeSelect).toHaveValue('mixed');

    const topicGroup = page.getByRole('group', {
      name: /Обери теми:/i,
    });

    await expect(topicGroup).toBeVisible();

    const checkboxes = topicGroup.getByRole('checkbox');

    await expect(checkboxes.first()).toBeVisible();

    const checkboxCount = await checkboxes.count();

    expect(checkboxCount).toBeGreaterThan(1);

    const firstCheckbox = checkboxes.nth(0);
    const secondCheckbox = checkboxes.nth(1);

    if (!(await firstCheckbox.isChecked())) {
      await firstCheckbox.check();
    }

    if (!(await secondCheckbox.isChecked())) {
      await secondCheckbox.check();
    }

    await expect(firstCheckbox).toBeChecked();

    await expect(secondCheckbox).toBeChecked();
  });

  // ========================================
  // Без вибраних тем
  // ========================================

  test('без вибраних тем старт змішаного режиму недоступний', async ({
    page,
  }) => {
    const modeSelect = page.getByTestId('training-mode');

    await modeSelect.selectOption('mixed');

    await expect(modeSelect).toHaveValue('mixed');

    const topicGroup = page.getByRole('group', {
      name: /Обери теми:/i,
    });

    await expect(topicGroup).toBeVisible();

    const checkboxes = topicGroup.getByRole('checkbox');

    await expect(checkboxes.first()).toBeVisible();

    const checkboxCount = await checkboxes.count();

    expect(checkboxCount).toBeGreaterThan(0);

    // Знімаємо вибір з усіх тем
    for (let index = 0; index < checkboxCount; index++) {
      const checkbox = checkboxes.nth(index);

      if (await checkbox.isChecked()) {
        await checkbox.uncheck();
      }
    }

    // Перевіряємо, що жодна тема не вибрана
    for (let index = 0; index < checkboxCount; index++) {
      await expect(checkboxes.nth(index)).not.toBeChecked();
    }

    const startButton = page.getByRole('button', {
      name: /Почати тренування/i,
    });

    await expect(startButton).toBeDisabled();
  });
});
