# Playwright for Little Lemon: Specific Configuration

This document details the specific Playwright configuration for the Little Lemon project, primarily focusing on `playwright.config.ts`.

## 1. Key Configuration Goals

-   **Automated Server Management**: Playwright should automatically start and stop the local development server.
-   **Targeted Browser Testing**: Initially focus tests on Chromium (Desktop Chrome) for speed and primary development, with the ability to expand to other browsers easily.
-   **Clear Base URL**: Simplify navigation in tests by setting a `baseURL`.
-   **Effective Debugging**: Utilize trace collection for failed tests.

## 2. `playwright.config.ts` Breakdown

Key sections and our specific settings:

### `testDir`
-   **Setting**: `testDir: './tests'`
-   **Purpose**: Specifies that all test files (`*.spec.ts`) are located in the `/tests` directory.

### `fullyParallel`
-   **Setting**: `fullyParallel: true`
-   **Purpose**: Enables tests to run in parallel, significantly speeding up the test suite execution time.

### `reporter`
-   **Setting**: `reporter: 'html'`
-   **Purpose**: Generates an HTML report after tests run (in `playwright-report/`), which is excellent for visualizing results and debugging.

### `use` (Shared Settings)

-   **`baseURL`**
    -   **Setting (to be configured)**: `baseURL: 'http://localhost:5173'` (Assuming Vite default. **Verify this!**)
    -   **Purpose**: Allows `page.goto('/')` to navigate to the root of the local dev server, making test navigation cleaner.
-   **`trace`**
    -   **Setting**: `trace: 'on-first-retry'` (Default, good practice)
    -   **Purpose**: Collects a detailed trace (DOM snapshots, actions, console logs, network requests) if a test fails and is retried. This trace is invaluable for debugging and can be viewed in the HTML report.

### `projects` (Browser Configurations)

-   **Initial Focus**: While Playwright sets up Chromium, Firefox, and WebKit by default, for initial development speed and focus, we might primarily run tests against Chromium. The configuration will allow easy switching or running all.
    ```typescript
    projects: [
      {
        name: 'chromium',
        use: { ...devices['Desktop Chrome'] },
      },
      // To enable other browsers, uncomment them:
      // {
      //   name: 'firefox',
      //   use: { ...devices['Desktop Firefox'] },
      // },
      // {
      //   name: 'webkit',
      //   use: { ...devices['Desktop Safari'] },
      // },
      // Mobile examples also available and can be enabled as needed.
    ],
    ```
-   **Note**: For CI runs (via GitHub Actions), all configured browsers are typically tested to ensure broader compatibility.

### `webServer` (Automatic Dev Server Management)

-   **Setting (to be configured)**:
    ```typescript
    webServer: {
      command: 'npm run dev', // Matches the script in package.json
      url: 'http://localhost:5173', // **Verify this URL and port!**
      reuseExistingServer: !process.env.CI, // If server already running locally, use it (except on CI)
      timeout: 120 * 1000, // Optional: Increase timeout for server to start
      stdout: 'pipe', // Pipe server output to Playwright logs
      stderr: 'pipe',
    },
    ```
-   **Purpose**: This is a powerful feature.
    -   `command`: The command Playwright will execute to start your dev server.
    -   `url`: The URL Playwright will poll to know when your server is ready to accept requests.
    -   `reuseExistingServer`: If `true` (and not on CI), Playwright won't start a new server if one is already running on the specified `url`.

## 3. Setup Verification Steps

1.  **Confirm Dev Server URL**: The most critical step is to confirm the exact URL (including port) that `npm run dev` starts your Little Lemon application on. Update `baseURL` and `webServer.url` in `playwright.config.ts` accordingly.
2.  **Run Example Test**: Execute `npx playwright test tests/example.spec.ts --headed` to ensure the example test (which visits `playwright.dev`) runs correctly against the configured browser.
3.  **Adapt Example Test**: Modify `tests/example.spec.ts` or create a new `tests/homepage.spec.ts` to navigate to your application's `baseURL` and perform a simple assertion (e.g., check for the main page title or a visible element).

## 4. Future Enhancements

-   **`data-testid` Attributes**: For elements that are hard to locate reliably via ARIA roles or text, consider adding `data-testid` attributes to your React components to provide stable hooks for Playwright.
-   **Page Object Model (POM)**: For larger test suites, consider implementing the Page Object Model design pattern to create reusable and maintainable test code.
-   **Environment Variables**: For sensitive data or environment-specific configurations, use `.env` files (e.g., with `dotenv` package) as shown commented out in the default `playwright.config.ts`.

This configuration provides a robust starting point for E2E testing the Little Lemon application.
