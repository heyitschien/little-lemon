---
Title: Test Coverage Workflow Documentation
Author: Chien Escalera Duong
Date Created: 2025-06-04
Time Created: 16:28:00 PDT
Last Updated: 2025-06-04 16:28:00 PDT
Version: 1.0
---

# Test Coverage Workflow

This document explains how to use the test coverage tools in the Little Lemon project.

## Available Commands

| Command | Description |
|---------|-------------|
| `npm run test` | Run tests without generating coverage reports (fast) |
| `npm run test:ui` | Run tests in UI mode without coverage |
| `npm run coverage` | Run tests with coverage |
| `npm run coverage:ui` | Run tests with coverage in UI mode |
| `npm run coverage:report` | Generate a complete coverage report |

## Coverage Workflow

### Regular Development Testing

During regular development, use the following command to run tests quickly without generating coverage reports:

```bash
npm run test
```

### Generating Coverage Reports

When you want to generate a complete coverage report for the entire project:

```bash
npm run coverage:report
```

This command will:
1. Clean the previous coverage reports (preserving the `.gitkeep` file)
2. Run all tests with coverage enabled
3. Generate a comprehensive HTML report

The coverage report will be available at `coverage/index.html`.

### Interactive Coverage UI

To view coverage in the Vitest UI:

```bash
npm run coverage:ui
```

## Configuration

The coverage configuration is defined in `vite.config.js`:

```javascript
coverage: {
  provider: 'v8',
  reporter: ['text', 'json', 'html'],
  reportsDirectory: './coverage',
  enabled: process.env.VITEST_COVERAGE === 'true' || process.argv.includes('--coverage'),
  clean: false,
  all: true,
}
```

Key settings:
- `clean: false` - Prevents automatic deletion of previous reports
- `all: true` - Includes all source files for more accurate reporting
- `enabled` - Only generates coverage when explicitly requested

## Best Practices

1. **Run fast tests during development**
   - Use `npm run test` for quick feedback during development

2. **Generate coverage reports strategically**
   - Use `npm run coverage:report` after completing a feature or before a PR

3. **Analyze coverage reports**
   - Open `coverage/index.html` in a browser to analyze coverage metrics
   - Focus on improving coverage for critical components and business logic

4. **Address React act(...) warnings**
   - Wrap state updates in tests with `act(...)` to eliminate warnings
   - Example: `await act(async () => { /* state updates */ })`

## Troubleshooting

If you encounter issues with coverage reports:

1. **Missing coverage data**
   - Ensure tests are properly set up with appropriate assertions
   - Check that components are properly mounted/rendered in tests

2. **Coverage report not updating**
   - Run `npm run coverage:report` to generate a fresh report
   - Check that the test files are properly targeting the components

3. **Low function coverage**
   - Create dedicated test files for event handlers and callbacks
   - Use explicit tests for each function path

## Notes

- Coverage reports are excluded from version control (added to `.gitignore`)
- The coverage directory structure is maintained with a `.gitkeep` file
