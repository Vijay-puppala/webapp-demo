# Playwright Booking Framework — Beginner to Advanced

A progressive Playwright + TypeScript automation framework built against
[booking.com](https://www.booking.com) as a real-world, non-trivial target
site. Each folder under `tests/` represents a skill level; work through them
in order to go from "first Playwright test" to a CI-integrated framework
with visual regression and accessibility auditing.

## Structure

```
├── playwright.config.ts        # Multi-browser config, reporters, tracing
├── src/
│   ├── config/environment.ts   # Env-var driven settings
│   ├── pages/                  # Page Object Model classes
│   │   ├── BasePage.ts
│   │   ├── HomePage.ts
│   │   ├── SearchResultsPage.ts
│   │   └── HotelDetailsPage.ts
│   ├── fixtures/pageFixtures.ts # Custom test fixture injecting page objects
│   └── utils/                  # Test data + helper functions
├── tests/
│   ├── beginner/     # Raw locators → first page object usage
│   ├── intermediate/ # Multi-page flows, filters, data-driven loops
│   └── advanced/     # test.step, soft assertions, network mocking,
│                      # visual regression, accessibility (axe-core)
├── data/testdata.json
└── .github/workflows/playwright.yml   # CI matrix across 3 browsers
```

## Setup

```bash
npm install
npx playwright install --with-deps
cp .env.example .env
```

## Running tests

```bash
npm run test:beginner       # tests/beginner only
npm run test:intermediate
npm run test:advanced

npm test                    # everything
npm run test:headed         # watch the browser
npm run test:ui             # Playwright's interactive UI mode
npm run test:debug          # step through with the inspector

npm run test:update-snapshots  # regenerate visual-regression baselines
npm run report                 # open the last HTML report
```

## Learning path

1. **Beginner** (`tests/beginner/`) — plain `page.goto`, `getByRole`
   locators, basic assertions. No page objects yet, so you see what the
   framework abstracts away later.
2. **Intermediate** (`tests/intermediate/`) — introduces the Page Object
   Model (`src/pages/`), the custom fixture (`src/fixtures/pageFixtures.ts`),
   handling a second browser tab, and data-driven tests looping over an
   array of scenarios.
3. **Advanced** (`tests/advanced/`) —
   - `test.step()` for readable multi-stage journeys in traces/reports
   - soft assertions (`expect.soft`) to collect multiple failures at once
   - `page.route()` network interception and response mocking
   - response-status monitoring across an entire flow
   - visual regression via `toHaveScreenshot()` with masking for dynamic
     content
   - accessibility auditing via `@axe-core/playwright`

## A note on selectors

booking.com changes its markup and A/B tests UI variants frequently. This
framework deliberately favors **role- and accessible-name-based locators**
(`getByRole`, `getByLabel`, `getByTestId`) over brittle CSS classes, because
they track user-facing behavior rather than implementation details. If a
locator in `src/pages/` stops matching:

```bash
npm run codegen   # opens booking.com in Playwright's recorder
```

Re-record the interaction and update the corresponding page object — tests
themselves shouldn't need to change, since they only call page object
methods.

## CI

`.github/workflows/playwright.yml` runs the full suite on push/PR and
nightly on a schedule, in a matrix across Chromium, Firefox, and WebKit,
uploading the HTML report and failure traces as artifacts.

## Extending this framework

- Add a new page object under `src/pages/`, extending `BasePage`.
- Register it in `src/fixtures/pageFixtures.ts` if you want it
  auto-injected into tests.
- Add new scenarios to `src/utils/testData.ts` or `data/testdata.json`
  rather than hardcoding values in specs.
- Tag tests (`@smoke`, `@visual`, `@a11y`, `@network`) and run subsets with
  `npx playwright test --grep @smoke`.
