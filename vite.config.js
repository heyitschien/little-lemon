import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  test: { // Vitest configuration block
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/setupTests.js',
    exclude: [
      '**/node_modules/**',
      '**/dist/**',
      '**/cypress/**',
      '**/.{idea,git,cache,output,temp}/**',
      '**/{karma,rollup,webpack,vite,vitest,jest,ava,babel,nyc,cypress,tsup,build}.config.*',
      '**/tests/**',          // Exclude the Playwright 'tests' directory
      '**/tests-examples/**'  // Exclude the Playwright 'tests-examples' directory
    ],
    // Optional: enable CSS processing in tests if needed
    // css: true,
    // Configure coverage to be more controlled
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      reportsDirectory: './coverage',
      // Only generate reports when explicitly requested
      enabled: process.env.VITEST_COVERAGE === 'true' || process.argv.includes('--coverage'),
      // Don't clean the directory between runs
      clean: false,
      // Include all source files for more accurate reporting
      all: true,
    },
  },
})
