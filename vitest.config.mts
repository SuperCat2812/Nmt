import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('.', import.meta.url)),
    },
  },

  test: {
    environment: 'node',

    // Vitest запускает только unit/integration тесты
    include: ['test/**/*.test.ts'],

    // Playwright E2E-тесты Vitest не трогает
    exclude: ['e2e/**', 'node_modules/**', '.next/**'],
  },
});
