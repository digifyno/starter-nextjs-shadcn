import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: ['babel-plugin-react-compiler'],
      },
    }),
  ],
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    globals: true,
    tags: [
      {
        name: 'unit',
        description: 'Fast, isolated unit tests with no side effects.',
      },
      {
        name: 'integration',
        description: 'Tests that cross module or component boundaries.',
      },
      {
        name: 'slow',
        description: 'Tests known to be slow; given extra timeout in CI.',
        timeout: 30_000,
        retry: process.env.CI ? 2 : 0,
      },
    ],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'lcov'],
      include: ['src/**/*.{ts,tsx}'],
      exclude: ['src/test/**', 'src/**/*.test.{ts,tsx}', 'src/components/ui/**'],
      thresholds: {
        lines: 80,
        functions: 80,
        branches: 70,
        statements: 80,
      },
    },
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
});
