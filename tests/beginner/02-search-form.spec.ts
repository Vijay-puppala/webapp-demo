import { test, expect } from '../../src/fixtures/pageFixtures';

/**
 * LEVEL: BEGINNER
 * Goal: first use of the Page Object Model. Instead of writing raw
 * locators in the test, we call methods on `homePage`, which keeps tests
 * readable and selectors centralized in one place (src/pages/HomePage.ts).
 */
test.describe('Booking.com — search form', () => {
  test('searching for a destination navigates to results', async ({ homePage, page }) => {
    await homePage.open();
    await homePage.searchDestination('Paris');
    await homePage.submitSearch();

    await expect(page).toHaveURL(/searchresults/i);
  });

  test('search box remembers typed destination text', async ({ homePage }) => {
    await homePage.open();
    await homePage.searchDestination('London');
    await expect(homePage.destinationInput).toHaveValue(/London/i);
  });

  test('setting occupancy does not error and search still succeeds', async ({ homePage, searchResultsPage }) => {
    await homePage.open();
    await homePage.searchDestination('Barcelona');
    await homePage.setOccupancy({ adults: 2, rooms: 1, children: 0 });
    await homePage.submitSearch();

    await searchResultsPage.waitForResultsToLoad();
    expect(await searchResultsPage.resultsCount()).toBeGreaterThan(0);
  });
});
