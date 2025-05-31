# Playwright for Little Lemon: Main Principles & User Guide

This document outlines the main principles and guidelines for using Playwright for end-to-end (E2E) testing in the Little Lemon project.

## 1. Purpose of E2E Testing with Playwright

-   **Verify User Journeys**: Ensure critical user paths through the application function as expected after code changes.
-   **Automated Regression Detection**: Automatically catch bugs or regressions introduced by new features, refactoring, or component removal.
-   **Increase Confidence**: Provide assurance that the application is stable before deployments or further development.
-   **Cross-Browser Consistency**: (Future Goal) Validate functionality across major browsers (Chromium, Firefox, WebKit).

## 2. Core Concepts

-   **Test Files (`*.spec.ts`)**: Tests are written in TypeScript and reside in the `/tests` directory. Each file typically focuses on a specific feature or page (e.g., `homepage.spec.ts`, `reservations.spec.ts`).
-   **`test` and `expect`**: Imported from `@playwright/test`.
    -   `test('description', async ({ page }) => { ... })`: Defines an individual test case. The `page` object is a fresh browser page instance for each test.
    -   `expect(value).matcher()`: Used for assertions (e.g., `expect(locator).toBeVisible()`).
-   **Locators**: Methods to find elements on the page (e.g., `page.getByRole()`, `page.getByText()`, `page.getByTestId()`). Prioritize user-facing attributes like ARIA roles and text for more resilient tests.
-   **Actions**: Interactions with elements (e.g., `.click()`, `.fill('text')`, `page.goto('/')`).
-   **Assertions**: Checks that verify expected outcomes (e.g., `toHaveTitle()`, `toBeVisible()`, `toContainText()`).

## 3. Running Tests

1.  **Automatic Server Management**: The `playwright.config.ts` is configured to automatically start the Little Lemon development server (`npm run dev`) before tests run and shut it down afterward.
2.  **Command**: To run all tests:
    ```bash
    npx playwright test
    ```
3.  **Running Specific Tests**:
    -   A single test file: `npx playwright test tests/mytest.spec.ts`
    -   A test with a specific title: `npx playwright test -g "my test title"`
4.  **Headed Mode (Debugging)**: To watch tests run in a browser window:
    ```bash
    npx playwright test --headed
    ```
5.  **UI Mode (Debugging & Exploration)**: Playwright's powerful UI mode for a better debugging experience:
    ```bash
    npx playwright test --ui
    ```

## 4. Viewing Reports

-   After tests run, an HTML report is generated in the `playwright-report` directory.
-   Open it with:
    ```bash
    npx playwright show-report
    ```
-   The report includes test results, traces for failed tests (if `trace` is enabled in config), and screenshots.

## 5. Writing Good Tests

-   **Focus on User Behavior**: Test what the user does and sees, not implementation details.
-   **Independent Tests**: Each test should be able to run independently and not rely on the state from other tests.
-   **Resilient Locators**: Use locators that are less likely to break with UI changes (e.g., ARIA roles, `data-testid` attributes for elements that lack good user-facing locators).
-   **Clear Descriptions**: Test descriptions should clearly state what is being tested.
-   **Atomic Assertions**: Prefer multiple specific assertions over one broad one if it improves clarity on failure.

## 6. Test Organization

-   Group related tests into the same `*.spec.ts` file (e.g., all reservation tests in `reservations.spec.ts`).
-   Use `test.describe('Feature X tests', () => { ... })` to group tests within a file.

## 7. GitHub Actions Integration

-   A GitHub Actions workflow is set up in `.github/workflows/playwright.yml`.
-   This workflow automatically runs all Playwright tests on every push and pull request to the main branches, providing continuous integration.

This guide will evolve as our testing strategy matures.
