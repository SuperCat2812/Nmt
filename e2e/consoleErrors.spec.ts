import { expect, test, type Page } from '@playwright/test';

import {
  answerCurrentQuestion,
  clearAppStorage,
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

function collectBrowserProblems(page: Page) {
  const problems: string[] = [];

  page.on('pageerror', (error) => {
    problems.push(`pageerror: ${error.message}`);
  });

  page.on('console', (message) => {
    if (message.type() === 'error') {
      problems.push(`console.error: ${message.text()}`);
    }
  });

  return problems;
}

test.describe('browser console/page errors audit', () => {
  test.beforeEach(async ({ page }) => {
    await clearAppStorage(page);
  });

  for (const topic of topics) {
    test(`${topic}: немає console.error або pageerror`, async ({ page }) => {
      const problems = collectBrowserProblems(page);

      await startTraining(page, topic, 5);

      for (let index = 0; index < 5; index++) {
        await answerCurrentQuestion(page);

        await goToNextQuestion(page);
      }

      await expect(page.getByTestId('training-result')).toBeVisible();

      /*
       * Небольшая задержка,
       * чтобы асинхронные ошибки
       * успели попасть в listener.
       */
      await page.waitForTimeout(100);

      expect(problems, problems.join('\n')).toEqual([]);
    });
  }
});
