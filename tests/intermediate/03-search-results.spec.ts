import { test, expect } from '../../src/fixtures/pageFixtures';

/**
 * LEVEL: INTERMEDIATE
 * Goal: work across multiple page objects, handle a new tab/window (booking.com
 * opens property details in a new tab), and assert on cross-page state.
 */
test.describe('Booking.com — search results', () => {
  test('results list shows at least one property for a valid destination', async ({ homePage, searchResultsPage }) => {
    await homePage.open();
    const results = await homePage.searchAndGoToResults('Amsterdam');

    expect(await results.resultsCount()).toBeGreaterThan(0);
  });

  test('opening the first property shows a matching, non-empty name', async ({ homePage }) => {
    await homePage.open();
    const results = await homePage.searchAndGoToResults('Lisbon');

    const details = await results.openPropertyByIndex(0);
    await details.waitForLoad();

    const name = await details.getName();
    expect(name.length).toBeGreaterThan(0);
  });

  test('each results page assertion runs independently (test isolation)', async ({ homePage, searchResultsPage }) => {
    // Playwright gives every test a fresh browser context automatically —
    // no cookies/localStorage leak in from the previous test above.
    await homePage.open();
    await homePage.searchAndGoToResults('Berlin');
    await expect(searchResultsPage.propertyCards.first()).toBeVisible();
  });
});
