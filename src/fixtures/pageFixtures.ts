import { test as base } from '@playwright/test';
import { HomePage } from '../pages/HomePage';
import { SearchResultsPage } from '../pages/SearchResultsPage';

type PageFixtures = {
  homePage: HomePage;
  searchResultsPage: SearchResultsPage;
};

/**
 * Extends Playwright's base test with ready-to-use page objects.
 * Import `test`/`expect` from this file in specs instead of '@playwright/test'
 * so every test automatically gets typed, pre-wired page objects:
 *
 *   import { test, expect } from '../../src/fixtures/pageFixtures';
 *   test('...', async ({ homePage }) => { ... });
 */
export const test = base.extend<PageFixtures>({
  homePage: async ({ page }, use) => {
    await use(new HomePage(page));
  },
  searchResultsPage: async ({ page }, use) => {
    await use(new SearchResultsPage(page));
  },
});

export { expect } from '@playwright/test';
