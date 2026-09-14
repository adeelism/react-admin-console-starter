import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    // Routes are already code-split via React.lazy (see router.tsx), so each page
    // loads on demand. The remaining vendor bundle is one cached chunk; lift the
    // advisory size warning rather than hand-splitting node_modules, which risks
    // cross-chunk initialization-order bugs.
    chunkSizeWarningLimit: 900,
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    // Node's fetch needs an absolute base URL; MSW handlers match any origin.
    env: {
      VITE_API_BASE_URL: 'http://localhost/api',
    },
    coverage: {
      provider: 'v8',
      reporter: ['text', 'text-summary', 'lcov'],
      include: ['src/**/*.{ts,tsx}'],
      exclude: [
        'src/main.tsx',
        // App.tsx is the composition root (providers + RouterProvider); its
        // behaviour is covered indirectly via AppLayout, router, and page tests.
        'src/App.tsx',
        'src/vite-env.d.ts',
        'src/test/**',
        'src/mocks/browser.ts',
        'src/**/types.ts',
        'src/**/index.ts',
      ],
      thresholds: {
        statements: 80,
        branches: 80,
        functions: 80,
        lines: 80,
      },
    },
  },
});
