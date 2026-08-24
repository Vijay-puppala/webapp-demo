import * as dotenv from 'dotenv';
dotenv.config();

export const env = {
  baseURL: process.env.BASE_URL || 'https://www.booking.com',
  headless: (process.env.HEADLESS ?? 'true') === 'true',
  slowMo: Number(process.env.SLOW_MO || 0),
  defaultTimeout: Number(process.env.DEFAULT_TIMEOUT || 30_000),
  currency: process.env.CURRENCY || 'USD',
  locale: process.env.LOCALE || 'en-US',
};
