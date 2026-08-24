import { test, expect } from '../../src/fixtures/pageFixtures';
import { futureDateRange } from '../../src/utils/testData';

/**
 * LEVEL: ADVANCED
 * Goal: chain a realistic multi-step user journey using test.step() for
 * readable trace/report output, combine hard and soft assertions, and tag
 * tests so they can be selected in CI (e.g. `playwright test --grep @smoke`).
 */
test.describe('Booking.com — end-to-end booking journey @e2e', () => {
  test('user can search, filter, and reach a property detail page @smoke', async ({ homePage, searchResultsPage, page }) => {
    const { checkIn, checkOut } = futureDateRange(30, 3);
    test.info().annotations.push({ type: 'dates', description: `${checkIn} → ${checkOut}` });

    await test.step('Open homepage and dismiss consent', async () => {
      await homePage.open();
    });

    await test.step('Search for a destination', async () => {
      await homePage.searchDestination('Dubai');
      await homePage.setOccupancy({ adults: 2, rooms: 1 });
      await homePage.submitSearch();
    });

    await test.step('Verify and filter results', async () => {
      await searchResultsPage.waitForResultsToLoad();
      const initialCount = await searchResultsPage.resultsCount();
      expect(initialCount, 'search should return at least one property').toBeGreaterThan(0);

      await searchResultsPage.sortBy(/price.*lowest/i);
    });

    await test.step('Open the top result and validate details', async () => {
      const details = await searchResultsPage.openPropertyByIndex(0);
      await details.waitForLoad();

      // Soft assertions: collect multiple failures instead of stopping at
      // the first one, useful when validating several independent facts
      // about the same page in one step.
      await expect.soft(details.propertyName).toBeVisible();
      await expect.soft(details.reserveButton).toBeVisible();

      const name = await details.getName();
      expect.soft(name.length, 'property name should not be empty').toBeGreaterThan(0);
    });
  });

  test('slow third-party page gets extra time via per-test timeout override @flaky-prone', async ({ homePage }) => {
    test.slow(); // triples the default timeout for this test only
    await homePage.open();
    await homePage.searchAndGoToResults('São Paulo');
  });
});
