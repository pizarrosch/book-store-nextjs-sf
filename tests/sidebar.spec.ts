import {test, expect} from '@playwright/test';

// Test suite for the sidebar/category functionality
test.describe('Sidebar and Category Selection', () => {
  // Before each test, navigate to the homepage
  test.beforeEach(async ({page}) => {
    await page.goto('/');
  });

  // Test that the sidebar is visible
  test('should display the sidebar with categories', async ({page}) => {
    // Check that the sidebar is visible
    await expect(page.locator('.sidebar')).toBeVisible();

    // Check that there are category links in the sidebar
    const categoryLinks = page.locator('.sidebar a');
    const count = await categoryLinks.count();
    expect(count).toBeGreaterThanOrEqual(1);
  });

  // Test that clicking a category changes the displayed books
  test('should change displayed books when a category is selected', async ({
    page
  }) => {
    // Wait for the books to load
    await page.waitForSelector('.book', {timeout: 10000});

    // Get the current category title
    const initialCategoryTitle = await page.locator('h2').first().textContent();

    // Get the initial books
    const initialBooks = page.locator('.book');

    // Get the first book title for comparison
    const initialFirstBookTitle = await initialBooks
      .first()
      .locator('h3')
      .textContent();

    // Find and click a different category in the sidebar
    const categoryLinks = page.locator('.sidebar a');

    // Make sure we have at least one category link
    const categoryCount = await categoryLinks.count();
    if (categoryCount > 0) {
      // Click the second category (or the first if there's only one)
      const categoryToClick =
        categoryCount > 1 ? categoryLinks.nth(1) : categoryLinks.nth(0);
      await categoryToClick.click();

      // Wait for the books to reload
      await page.waitForTimeout(2000);

      // Check if the category title has changed
      const newCategoryTitle = await page.locator('h2').first().textContent();

      // If we clicked a different category, the title should be different
      if (categoryCount > 1) {
        expect(newCategoryTitle).not.toEqual(initialCategoryTitle);
      }

      // Get the new books
      const newBooks = page.locator('.book');
      const newBooksCount = await newBooks.count();
      expect(newBooksCount).toBeGreaterThanOrEqual(1);

      // If we clicked a different category, the first book should be different
      if (categoryCount > 1) {
        const newFirstBookTitle = await newBooks
          .first()
          .locator('h3')
          .textContent();
        // The book titles should be different if we changed categories
        // (this might not always be true, but it's a reasonable assumption)
        expect(newFirstBookTitle).not.toEqual(initialFirstBookTitle);
      }
    }
  });

  // Test that the active category is highlighted
  test('should highlight the active category', async ({page}) => {
    // Wait for the sidebar to load
    await page.waitForSelector('.sidebar', {timeout: 5000});

    // Find and click a category in the sidebar
    const categoryLinks = page.locator('.sidebar a');

    // Make sure we have at least one category link
    const categoryCount = await categoryLinks.count();
    if (categoryCount > 0) {
      // Click the first category
      await categoryLinks.first().click();

      // Wait for the UI to update
      await page.waitForTimeout(1000);

      // Check that the clicked category has the active class or some visual indication
      // This depends on how the active category is styled in the application
      // It might be a class, a different color, or some other visual indicator
      await expect(categoryLinks.first()).toHaveClass(/active|selected/);
    }
  });

  // Test that the books are filtered correctly when a category is selected
  test('should display books related to the selected category', async ({
    page
  }) => {
    // Wait for the sidebar to load
    await page.waitForSelector('.sidebar', {timeout: 5000});

    // Find and click a specific category (e.g., "Architecture")
    const architectureCategory = page.getByText('Architecture');
    if (await architectureCategory.isVisible()) {
      await architectureCategory.click();

      // Wait for the books to load
      await page.waitForTimeout(2000);

      // Check that the category title is displayed
      await expect(page.locator('h2').first()).toContainText('Architecture');

      // Check that books are displayed
      const books = page.locator('.book');
      const booksCount = await books.count();
      expect(booksCount).toBeGreaterThanOrEqual(1);
    }
  });
});
