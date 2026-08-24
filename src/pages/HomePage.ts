import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';
import { SearchResultsPage } from './SearchResultsPage';

/**
 * NOTE on selectors: booking.com regularly changes internal class names and
 * test ids as they A/B test the UI. This page object intentionally prefers
 * role- and label-based locators (getByRole, getByPlaceholder, getByLabel)
 * over CSS/XPath, since those are far more resilient to markup churn.
 * If a locator below stops matching, re-record it quickly with:
 *   npm run codegen
 */
export class HomePage extends BasePage {
  readonly destinationInput: Locator;
  readonly datesButton: Locator;
  readonly occupancyButton: Locator;
  readonly searchButton: Locator;
  readonly firstSuggestion: Locator;

  constructor(page: Page) {
    super(page);
    this.destinationInput = page.getByTestId('destination-container').getByRole('combobox')
      .or(page.getByPlaceholder(/where are you going/i));
    this.datesButton = page.getByTestId('searchbox-dates-container');
    this.occupancyButton = page.getByTestId('occupancy-config');
    this.searchButton = page.getByRole('button', { name: /^search$/i });
    this.firstSuggestion = page.getByTestId('autocomplete-results').locator('li').first();
  }

  async open() {
    await this.goto('/');
  }

  /** Types a destination and selects the first autocomplete suggestion. */
  async searchDestination(destination: string) {
    await this.fillWhenReady(this.destinationInput, destination);
    await this.firstSuggestion.waitFor({ state: 'visible' });
    await this.firstSuggestion.click();
  }

  /**
   * Sets guest counts via the occupancy widget.
   * Uses accessible "increase/decrease" buttons rather than typing into
   * inputs, matching how booking.com's stepper controls actually work.
   */
  async setOccupancy({ adults, rooms, children }: { adults?: number; rooms?: number; children?: number }) {
    await this.clickWhenReady(this.occupancyButton);

    const adjustStepper = async (label: RegExp, target?: number) => {
      if (target === undefined) return;
      const group = this.page.getByRole('group', { name: label }).or(this.page.locator(`[aria-label*="${label.source}" i]`));
      const increment = group.getByRole('button', { name: /increase/i });
      // Read the current count, then click "increase"/"decrease" the right
      // number of times to reach the target — robust to whatever the
      // widget's starting default is.
      const countText = await group.locator('span').filter({ hasText: /^\d+$/ }).first().textContent().catch(() => '1');
      let current = Number(countText?.trim() || 1);
      const decrement = group.getByRole('button', { name: /decrease/i });
      while (current < target) { await increment.click(); current++; }
      while (current > target) { await decrement.click(); current--; }
    };

    await adjustStepper(/adults/i, adults);
    await adjustStepper(/room/i, rooms);
    await adjustStepper(/children/i, children);

    // Close the popover by clicking elsewhere on the page.
    await this.page.keyboard.press('Escape');
  }

  async submitSearch(): Promise<SearchResultsPage> {
    await this.clickWhenReady(this.searchButton);
    const resultsPage = new SearchResultsPage(this.page);
    await resultsPage.waitForResultsToLoad();
    return resultsPage;
  }

  /** Convenience method chaining the common beginner flow into one call. */
  async searchAndGoToResults(destination: string): Promise<SearchResultsPage> {
    await this.searchDestination(destination);
    return this.submitSearch();
  }
}
