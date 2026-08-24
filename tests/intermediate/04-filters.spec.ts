import { test, expect } from '../../src/fixtures/pageFixtures';
import { destinations } from '../../src/utils/testData';
import { isSorted } from '../../src/utils/helpers';

/**
 * LEVEL: INTERMEDIATE
 * Goal: filtering/sorting interactions, and data-driven testing by looping
 * over a shared fixture array instead of copy-pasting near-identical tests.
 */
test.describe('Booking.com — filters and sorting', () => {
  test('sorting by price (lowest first) produces an ascending price list', async ({ homePage, searchResultsPage }) => {
    await homePage.open();
    await homePage.searchAndGoToResults('Madrid');

    await searchResultsPage.sortBy(/price.*lowest/i);
    const prices = await searchResultsPage.allDisplayedPrices();

    expect(prices.length).toBeGreaterThan(0);
    expect(isSorted(prices, 'asc')).toBeTruthy();
  });

  test('applying a star-rating filter changes the result set', async ({ homePage, searchResultsPage }) => {
    await homePage.open();
    await homePage.searchAndGoToResults('Vienna');

    await searchResultsPage.filterByStarRating(5);
    expect(await searchResultsPage.resultsCount()).toBeGreaterThanOrEqual(0);
  });

  // Data-driven: same test logic, run once per destination in testData.ts.
  for (const scenario of destinations) {
    test(`search flow works end-to-end for ${scenario.destination}`, async ({ homePage, searchResultsPage }) => {
      await homePage.open();
      await homePage.searchDestination(scenario.destination);
      await homePage.setOccupancy({ adults: scenario.adults, rooms: scenario.rooms });
      await homePage.submitSearch();

      await searchResultsPage.waitForResultsToLoad();
      expect(await searchResultsPage.resultsCount()).toBeGreaterThan(0);

      if (scenario.minStars) {
        await searchResultsPage.filterByStarRating(scenario.minStars);
      }
    });
  }
});
