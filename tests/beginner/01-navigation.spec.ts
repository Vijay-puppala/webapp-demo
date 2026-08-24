import { test, expect } from '@playwright/test';

/**
 * LEVEL: BEGINNER
 * Goal: get comfortable with the basics — navigating, locating elements,
 * and making assertions. No page objects yet; that's introduced next.
 */
test.describe('Booking.com — basic navigation', () => {
  test('homepage loads with expected title', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/Booking\.com/i);
  });

  test('homepage shows the search box', async ({ page }) => {
    await page.goto('/');
    const searchButton = page.getByRole('button', { name: /^search$/i });
    await expect(searchButton).toBeVisible();
  });

  test('navigating to the homepage sets the expected URL', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveURL(/booking\.com/);
  });

  test('page is responsive to viewport resize', async ({ page }) => {
    await page.goto('/');
    await page.setViewportSize({ width: 390, height: 844 }); // mobile
    await expect(page.locator('body')).toBeVisible();
    await page.setViewportSize({ width: 1440, height: 900 }); // back to desktop
  });
});
