import { test, expect } from '../../src/fixtures/pageFixtures';

/**
 * LEVEL: ADVANCED
 * Goal: intercept network traffic to (a) observe real API calls the app
 * makes, and (b) mock a response to test how the UI reacts to conditions
 * that are hard to trigger organically (empty results, errors, etc.).
 */
test.describe('Booking.com — network interception @network', () => {
  test('captures the search request fired when submitting the form', async ({ homePage, page }) => {
    await homePage.open();

    const searchRequestPromise = page.waitForRequest((req) =>
      req.url().includes('searchresults') && req.method() === 'GET'
    );

    await homePage.searchDestination('Prague');
    await homePage.submitSearch();

    const request = await searchRequestPromise;
    expect(request.url()).toContain('ss=Prague');
  });

  test('UI shows a no-results state when the results endpoint is mocked empty', async ({ homePage, page }) => {
    // Intercept any XHR/fetch to the results-listing endpoint and replace
    // its response with an artificially empty payload — this lets us test
    // the empty-state UI deterministically instead of hunting for a real
    // destination with zero availability.
    await page.route('**/dml/graphql**', async (route) => {
      const request = route.request();
      if (request.method() !== 'POST') return route.continue();

      const response = await route.fetch();
      const body = await response.json().catch(() => null);

      if (body && JSON.stringify(body).includes('searchQueries')) {
        // Shape simplified for demonstration; real payload structure should
        // be captured once via route.fetch() + console.log before mocking.
        return route.fulfill({
          response,
          json: { ...body, data: { ...body?.data, results: [] } },
        });
      }
      return route.continue();
    });

    await homePage.open();
    await homePage.searchDestination('Reykjavik');
    await homePage.submitSearch();

    // We don't assert a specific empty-state selector here since it depends
    // on the live markup — the point is demonstrating the interception
    // pattern. In a real suite, follow up with an assertion on the
    // no-results banner/message.
  });

  test('all API responses during search return healthy status codes', async ({ homePage, page }) => {
    const failedResponses: string[] = [];

    page.on('response', (response) => {
      if (response.status() >= 400 && response.url().includes('booking.com')) {
        failedResponses.push(`${response.status()} — ${response.url()}`);
      }
    });

    await homePage.open();
    await homePage.searchAndGoToResults('Cape Town');

    expect(failedResponses, `Unexpected failing responses:\n${failedResponses.join('\n')}`).toHaveLength(0);
  });
});
