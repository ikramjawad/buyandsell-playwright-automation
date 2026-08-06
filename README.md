# buyandsell-playwright-automation
End-to-end test automation for BuyAndSell, built with Playwright using a fixture-based Page Object Model for a clean, scalable test suite.

## Getting Started

1. Install dependencies: `npm install`
2. Copy `.env.example` to `.env` and fill in `BASE_URL`, `TEST_USERNAME`, `TEST_PASSWORD`
3. Run tests: `npm test`

## Structure

- `tests/pages/` — page object classes (locators + methods per page)
- `tests/support/base.js` — fixture wiring; import `test`/`expect` from here in specs
- `tests/fixtures/` — test data

