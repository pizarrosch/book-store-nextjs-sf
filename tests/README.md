# Playwright Tests for Book Store

This directory contains Playwright tests for the Book Store application. These tests verify that the application's UI components and functionality work as expected.

## Test Files

- `homepage.spec.ts`: Tests for the homepage, including page loading, navigation, book display, and interactive elements.
- `sidebar.spec.ts`: Tests for the sidebar and category selection functionality.

## Running Tests

To run the tests, use the following commands:

### Run all tests

```bash
npx playwright test
```

### Run a specific test file

```bash
npx playwright test homepage.spec.ts
```

### Run tests in UI mode

```bash
npx playwright test --ui
```

### Run tests in debug mode

```bash
npx playwright test --debug
```

### Run tests in a specific browser

```bash
npx playwright test --project=chromium
npx playwright test --project=firefox
npx playwright test --project=webkit
```

## Test Structure

Each test file follows a similar structure:

1. Import the necessary Playwright modules
2. Define a test suite using `test.describe`
3. Set up common test conditions using `test.beforeEach`
4. Define individual tests using `test`
5. Use assertions with `expect` to verify expected behavior

## Adding New Tests

When adding new tests:

1. Create a new test file with a descriptive name (e.g., `cart.spec.ts` for cart functionality tests)
2. Follow the existing test structure
3. Use appropriate selectors to target UI elements
4. Add meaningful assertions to verify functionality
5. Document the new test file in this README

## Best Practices

- Keep tests independent of each other
- Use descriptive test names
- Add comments to explain complex test logic
- Use appropriate timeouts for asynchronous operations
- Handle conditional UI elements gracefully
- Add error handling for potential test failures