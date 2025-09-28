import { defineConfig } from 'vitest/config';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default defineConfig({
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: [],
    include: ['tests/**/*.spec.ts'],
    restoreMocks: true,
    clearMocks: true,
    environmentOptions: {
      jsdom: {
        url: 'http://localhost/test',
      },
    },
  },
  resolve: {
    alias: {
      core: resolve(__dirname, 'src/core'),
      models: resolve(__dirname, 'src/models'),
      types: resolve(__dirname, 'src/types'),
    },
  },
});

