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

export async function selectSingleTopic(page: Page, topicId: string) {
  const modeSelect = page.getByTestId('training-mode');

  await expect(modeSelect).toBeVisible();

  await modeSelect.selectOption('single-topic');

  await expect(modeSelect).toHaveValue('single-topic');

  const topicSelect = page.getByTestId('single-topic-select');

  await expect(topicSelect).toBeVisible();

  await topicSelect.selectOption(topicId);

  await expect(topicSelect).toHaveValue(topicId);
}

export async function selectFractionsTopic(page: Page) {
  await selectSingleTopic(page, 'fractions');
}

export async function setQuestionCount(page: Page, count: number) {
  const countInput = page.getByTestId('question-count');

  await expect(countInput).toBeVisible();

  await countInput.fill(String(count));

  await expect(countInput).toHaveValue(String(count));
}

export async function startTraining(page: Page, topicId: string, count = 3) {
  await page.goto('/');

  await expect(
    page.getByRole('heading', {
      name: /Налаштування тренування/i,
    }),
  ).toBeVisible();

  await selectSingleTopic(page, topicId);

  await setQuestionCount(page, count);

  const startButton = page.getByRole('button', {
    name: /Почати тренування/i,
  });

  await expect(startButton).toBeEnabled();

  await startButton.click();

  await expect(page.getByTestId('question-card')).toBeVisible({
    timeout: 15_000,
  });

  await expect(
    page.getByText(new RegExp(`Завдання\\s+1\\s+з\\s+${count}`, 'i')),
  ).toBeVisible();
}

export async function startFractionsTraining(page: Page, count = 3) {
  await startTraining(page, 'fractions', count);
}

export async function answerCurrentSingleChoice(page: Page) {
  const container = page.getByTestId('answer-options');

  await expect(container).toBeVisible();

  const options = container.getByRole('button');

  await expect(options.first()).toBeVisible();

  const optionCount = await options.count();

  expect(optionCount).toBeGreaterThanOrEqual(2);

  expect(optionCount).toBeLessThanOrEqual(4);

  await options.first().click();

  const checkButton = page.getByRole('button', {
    name: /Перевірити/i,
  });

  await expect(checkButton).toBeVisible();

  await expect(checkButton).toBeEnabled();

  await checkButton.click();

  await expect(page.getByTestId('answer-feedback')).toBeVisible({
    timeout: 10_000,
  });
}

export async function answerCurrentNumeric(page: Page) {
  const numericInput = page.getByTestId('numeric-answer');

  await expect(numericInput).toBeVisible();

  await numericInput.fill('0');

  const checkButton = page.getByRole('button', {
    name: /Перевірити/i,
  });

  await expect(checkButton).toBeEnabled();

  await checkButton.click();

  await expect(page.getByTestId('answer-feedback')).toBeVisible();
}

export async function answerCurrentMatching(page: Page) {
  const matching = page.getByTestId('matching-answer');

  await expect(matching).toBeVisible();

  const selects = matching.locator('select');

  const selectCount = await selects.count();

  expect(selectCount).toBeGreaterThan(0);

  for (let index = 0; index < selectCount; index++) {
    const select = selects.nth(index);

    const options = select.locator('option');

    const optionCount = await options.count();

    expect(optionCount).toBeGreaterThan(1);

    const value = await options.nth(1).getAttribute('value');

    expect(value).not.toBeNull();

    await select.selectOption(value as string);
  }

  const checkButton = page.getByRole('button', {
    name: /Перевірити/i,
  });

  await expect(checkButton).toBeEnabled();

  await checkButton.click();

  await expect(page.getByTestId('answer-feedback')).toBeVisible();
}

export async function answerCurrentQuestion(page: Page) {
  const singleChoice = page.getByTestId('answer-options');

  if (await singleChoice.isVisible()) {
    await answerCurrentSingleChoice(page);

    return;
  }

  const numeric = page.getByTestId('numeric-answer');

  if (await numeric.isVisible()) {
    await answerCurrentNumeric(page);

    return;
  }

  const matching = page.getByTestId('matching-answer');

  if (await matching.isVisible()) {
    await answerCurrentMatching(page);

    return;
  }

  throw new Error('Не знайдено підтримуваного типу відповіді.');
}

export async function goToNextQuestion(page: Page) {
  const nextButton = page.getByRole('button', {
    name: /Наступне завдання/i,
  });

  await expect(nextButton).toBeVisible();

  await nextButton.click();
}

export async function completeTraining(page: Page, count: number) {
  for (let questionNumber = 1; questionNumber <= count; questionNumber++) {
    await expect(
      page.getByText(
        new RegExp(`Завдання\\s+${questionNumber}\\s+з\\s+${count}`, 'i'),
      ),
    ).toBeVisible();

    await answerCurrentQuestion(page);

    await expect(
      page.getByRole('heading', {
        name: /Розв'язання/i,
      }),
    ).toBeVisible();

    await goToNextQuestion(page);
  }

  await expect(page.getByTestId('training-result')).toBeVisible({
    timeout: 15_000,
  });
}

export async function expectNoHorizontalOverflow(page: Page) {
  const overflow = await page.evaluate(() => {
    return (
      document.documentElement.scrollWidth >
      document.documentElement.clientWidth + 1
    );
  });

  expect(overflow).toBe(false);
}
