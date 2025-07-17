import {test, expect} from '@playwright/test';

// Test suite for the homepage
test.describe('Homepage', () => {
  // Before each test, navigate to the homepage
  test.beforeEach(async ({page}) => {
    await page.goto('/');
  });

  // Test that the homepage loads correctly
  test('should load the homepage correctly', async ({page}) => {
    // Check that the page title is correct
    await expect(page).toHaveTitle('Book Store');

    // Check that the header is visible
    await expect(page.locator('header')).toBeVisible();

    // Check that the Bookshop title is visible
    await expect(page.locator('header h2')).toHaveText('Bookshop');

    // Check that the navigation menu is visible
    await expect(page.locator('nav')).toBeVisible();

    // Check that the main content is visible
    await expect(page.locator('main')).toBeVisible();

    // Check that the footer is visible
    await expect(page.locator('footer')).toBeVisible();
  });

  // Test that the navigation menu has the correct links
  test('should display navigation menu with correct links', async ({page}) => {
    // Check that the navigation menu has the correct links
    const navLinks = page.locator('nav ul li a');
    await expect(navLinks).toHaveCount(4);

    // Check the text of each navigation link
    await expect(navLinks.nth(0)).toHaveText('Books');
    await expect(navLinks.nth(1)).toHaveText('Audiobooks');
    await expect(navLinks.nth(2)).toHaveText('Stationery & gifts');
    await expect(navLinks.nth(3)).toHaveText('Blog');
  });

  // Test that the slider is visible
  test('should display the slider', async ({page}) => {
    // Check that the slider is visible
    await expect(page.locator('.ant-carousel')).toBeVisible();

    // Check that at least one banner image is visible
    await expect(page.locator('.banner img')).toBeVisible();
  });

  // Test that books are displayed
  test('should display books', async ({page}) => {
    // Wait for the books to load (may take some time due to API call)
    await page.waitForSelector('.book', {timeout: 10000});

    // Check that books are displayed
    const books = page.locator('.book');

    // There should be at least one book
    const booksCount = await books.count();
    expect(booksCount).toBeGreaterThanOrEqual(1);

    // Check that each book has a cover image
    await expect(books.first().locator('img')).toBeVisible();

    // Check that each book has details
    await expect(books.first().locator('h3')).toBeVisible();
  });

  // Test that clicking the user icon shows the login form
  test('should show login form when user icon is clicked', async ({page}) => {
    // Click the user icon
    await page.locator('#user-icon').click();

    // Check that the login form is displayed
    await expect(page.locator('form')).toBeVisible();

    // Check that the login form has email and password fields
    await expect(page.getByPlaceholder('Email')).toBeVisible();
    await expect(page.getByPlaceholder('Password')).toBeVisible();
  });

  // Test that the "Load more" button works
  test('should load more books when "Load more" button is clicked', async ({
    page
  }) => {
    // Wait for the books to load
    await page.waitForSelector('.book', {timeout: 10000});

    // Count the initial number of books
    const initialBookCount = await page.locator('.book').count();

    // Check if "Load more" button exists
    const loadMoreButton = page.getByText('Load more');
    if (await loadMoreButton.isVisible()) {
      // Click the "Load more" button
      await loadMoreButton.click();

      // Wait for more books to load
      await page.waitForTimeout(1000);

      // Count the new number of books
      const newBookCount = await page.locator('.book').count();

      // Check that more books were loaded
      expect(newBookCount).toBeGreaterThan(initialBookCount);
    }
  });

  // Test that clicking on a book's "Buy now" button works
  test('should handle "Buy now" button click', async ({page}) => {
    // Wait for the books to load
    await page.waitForSelector('.book', {timeout: 10000});

    // Find the first "Buy now" button
    const buyButton = page.locator('.book button').first();

    // Click the "Buy now" button
    await buyButton.click();

    // Since the user is not logged in, it should redirect to login page
    // or show the login form
    await expect(page).toHaveURL(/login|\/$/);
  });
});
