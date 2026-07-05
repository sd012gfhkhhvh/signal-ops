import { defineConfig } from 'vitest/config';
import tsConfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  plugins: [tsConfigPaths()],
  test: {
    globals: true,
    environment: 'node',
    include: ['test/**/*.e2e-spec.ts'],
    exclude: ['node_modules', 'dist'],
    testTimeout: 30000,
  },
});
