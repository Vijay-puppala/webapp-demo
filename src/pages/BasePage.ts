import { Page, Locator, expect } from '@playwright/test';

/**
 * BasePage centralizes behavior every page object needs:
 * - dismissing the cookie/consent dialog booking.com shows on first load
 * - resilient click/fill wrappers
 * - generic wait helpers
 *
 * Page objects should extend this rather than duplicating boilerplate.
 */
export class BasePage {
  constructor(protected readonly page: Page) {}

  async goto(path: string = '/') {
    await this.page.goto(path);
    await this.dismissConsentIfPresent();
  }

  /**
   * booking.com shows a cookie-consent modal on first visit per session/locale.
   * It isn't always present (e.g. already accepted via storage state), so we
   * treat it as optional and never fail the test if it's missing.
   */
  async dismissConsentIfPresent() {
    const consentButton = this.page.getByRole('button', { name: /accept/i });
    try {
      await consentButton.waitFor({ state: 'visible', timeout: 5_000 });
      await consentButton.click();
    } catch {
      // No consent dialog shown this run — nothing to do.
    }
  }

  /** Click with an explicit visibility wait, useful for elements that animate in. */
  async clickWhenReady(locator: Locator) {
    await locator.waitFor({ state: 'visible' });
    await locator.scrollIntoViewIfNeeded();
    await locator.click();
  }

  async fillWhenReady(locator: Locator, value: string) {
    await locator.waitFor({ state: 'visible' });
    await locator.click();
    await locator.fill('');
    await locator.fill(value);
  }

  async expectUrlContains(fragment: string) {
    await expect(this.page).toHaveURL(new RegExp(fragment));
  }

  async currentUrl(): Promise<string> {
    return this.page.url();
  }
}
