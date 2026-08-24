import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';
import { HotelDetailsPage } from './HotelDetailsPage';

export class SearchResultsPage extends BasePage {
  readonly propertyCards: Locator;
  readonly resultsHeading: Locator;
  readonly sortDropdown: Locator;
  readonly priceFilterMin: Locator;
  readonly starRatingFilters: (stars: number) => Locator;

  constructor(page: Page) {
    super(page);
    this.propertyCards = page.getByTestId('property-card');
    this.resultsHeading = page.getByRole('heading', { level: 1 });
    this.sortDropdown = page.getByTestId('sorters-dropdown-trigger');
    this.priceFilterMin = page.getByTestId('filters-group-price');
    this.starRatingFilters = (stars: number) =>
      page.getByTestId('filters-group-class').getByLabel(new RegExp(`${stars} stars?`, 'i'));
  }

  async waitForResultsToLoad() {
    await this.propertyCards.first().waitFor({ state: 'visible', timeout: 30_000 });
  }

  async resultsCount(): Promise<number> {
    return this.propertyCards.count();
  }

  async filterByStarRating(stars: number) {
    const countBefore = await this.resultsCount();
    await this.clickWhenReady(this.starRatingFilters(stars));
    // Wait for the list to actually change rather than using a fixed sleep.
    await expect
      .poll(async () => this.resultsCount(), { timeout: 15_000 })
      .not.toBe(countBefore);
  }

  async sortBy(optionLabel: RegExp) {
    await this.clickWhenReady(this.sortDropdown);
    await this.page.getByRole('option', { name: optionLabel }).click();
    await this.waitForResultsToLoad();
  }

  async openPropertyByIndex(index: number): Promise<HotelDetailsPage> {
    const [newPage] = await Promise.all([
      this.page.context().waitForEvent('page'),
      this.propertyCards.nth(index).click(),
    ]);
    await newPage.waitForLoadState('domcontentloaded');
    return new HotelDetailsPage(newPage);
  }

  async allDisplayedPrices(): Promise<number[]> {
    const priceLocators = this.page.getByTestId('price-and-discounted-price');
    const texts = await priceLocators.allTextContents();
    return texts
      .map((t) => Number(t.replace(/[^\d.]/g, '')))
      .filter((n) => !Number.isNaN(n));
  }
}
