import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class HotelDetailsPage extends BasePage {
  readonly propertyName: Locator;
  readonly reviewScore: Locator;
  readonly reserveButton: Locator;
  readonly priceDisplay: Locator;

  constructor(page: Page) {
    super(page);
    this.propertyName = page.getByTestId('property-header').getByRole('heading').first();
    this.reviewScore = page.getByTestId('review-score-component');
    this.reserveButton = page.getByRole('button', { name: /reserve|i'll reserve/i }).first();
    this.priceDisplay = page.getByTestId('availability-summary-price').first();
  }

  async waitForLoad() {
    await this.propertyName.waitFor({ state: 'visible', timeout: 30_000 });
  }

  async getName(): Promise<string> {
    return (await this.propertyName.textContent())?.trim() ?? '';
  }
}
