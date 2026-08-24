import { Page } from '@playwright/test';

/** Returns true if an array of numbers is sorted ascending (or descending). */
export function isSorted(values: number[], direction: 'asc' | 'desc' = 'asc'): boolean {
  for (let i = 1; i < values.length; i++) {
    if (direction === 'asc' && values[i] < values[i - 1]) return false;
    if (direction === 'desc' && values[i] > values[i - 1]) return false;
  }
  return true;
}

/** Waits for network activity on the page to go quiet — useful after infinite-scroll or lazy-loaded widgets. */
export async function waitForNetworkIdleSafe(page: Page, timeout = 10_000) {
  await page.waitForLoadState('networkidle', { timeout }).catch(() => {
    // Some pages (booking.com included) keep background polling connections
    // open indefinitely, which means 'networkidle' may never fire. We treat
    // a timeout here as non-fatal rather than failing the test.
  });
}

/** Simple retry wrapper for flaky third-party UI interactions. */
export async function retry<T>(fn: () => Promise<T>, attempts = 3, delayMs = 1000): Promise<T> {
  let lastError: unknown;
  for (let i = 0; i < attempts; i++) {
    try {
      return await fn();
    } catch (err) {
      lastError = err;
      if (i < attempts - 1) await new Promise((r) => setTimeout(r, delayMs));
    }
  }
  throw lastError;
}
