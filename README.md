# Playwright BDD Automation

UI test framework for the [Restful Booker](https://automationintesting.online) hotel site (Shady Meadows B&B). Scenarios are written in Gherkin and run with [Playwright](https://playwright.dev) and [playwright-bdd](https://github.com/vitalets/playwright-bdd).

The suite covers guest flows (home, booking, contact) and admin flows (login, rooms, bookings report, messages).

## Prerequisites

- Node.js 20 or later
- npm

## Setup

```bash
npm install
npx playwright install chromium
```

Create the environment file the tests load by default (`ENV` defaults to `dev`):

```bash
mkdir -p env
cp .env.example env/.env.dev
```

Edit `env/.env.dev` and set every value. Tests fail at startup if any required variable is missing.

For QA and stage, copy the same template to `env/.env.qa` and `env/.env.stage`. Those files are gitignored.

## Configuration

### Environments

`config/envConfig.ts` loads `env/.env.<ENV>`, where `<ENV>` is the `ENV` variable (`dev`, `qa`, or `stage`).

| Variable | Purpose |
| --- | --- |
| `BASE_URL` | Site under test. Used as Playwright `baseURL`. |
| `ADMIN_USERNAME` | Required admin username for the selected environment. |
| `ADMIN_PASSWORD` | Required admin password for the selected environment. |

Example `env/.env.dev`:

```env
BASE_URL=https://automationintesting.online
ADMIN_USERNAME=
ADMIN_PASSWORD=
```

Select an environment with the matching npm script (`npm run test:dev`, `test:qa`, or `test:stage`). `npm test` uses `dev`.

### Test data

Scenario inputs live in JSON under `test-data/`. Steps look up a key such as `"validBooking"` or `"admin"`:

| File | Used by |
| --- | --- |
| `test-data/users.json` | Admin login |
| `test-data/bookings.json` | Guest booking |
| `test-data/contacts.json` | Contact form |
| `test-data/rooms.json` | Admin room creation |

### Timeouts, retries, and browser

- Default test timeout is 30 seconds. Assertion timeout is 10 seconds (`config/constants.ts`).
- Local runs use no retries. CI uses 2 retries and 2 workers (`config/testConfig.ts`).
- Tests run headless in Chromium. Traces, screenshots, and video are kept on failure.

## Run tests

`bddgen` generates Playwright tests from the feature files before each run. You do not need to call it separately.

```bash
# All scenarios against the default (dev) environment
npm test

# A named environment
npm run test:dev
npm run test:qa
npm run test:stage

# Dev, then QA, then stage
npm run test:all-envs
```

### By tag or area

Feature tags are `@ui`, `@smoke`, `@regression`, `@home`, `@contact`, and `@admin`.

```bash
npm run test:smoke
npm run test:regression
npm run test:ui

npm run test:home
npm run test:booking
npm run test:contact
npm run test:admin

# Smoke or regression on a specific environment
npm run test:dev:smoke
npm run test:qa:regression
npm run test:stage:smoke
```

### Headed and debug

```bash
npm run test:headed
npm run test:debug
```

### One feature file

```bash
npx bddgen && npx playwright test features/ui/home/home.feature
```

Pass extra Playwright arguments after `--`:

```bash
npm test -- --grep @home
```

## Reports

HTML reports are written to `reports/playwright-html`. Raw results, traces, screenshots, and videos go to `test-results/`.

```bash
npm run report
```

## Project layout

```text
features/ui/          Gherkin scenarios
steps/ui/             Step definitions
pages/                Page objects
fixtures/             Playwright fixtures (pages wired into steps)
test-data/            JSON data referenced by scenarios
config/               Environment, timeouts, and constants
playwright.config.ts  Playwright and playwright-bdd settings
env/                  Local env files (not committed)
```

## CI

On push and pull request to `main` or `master`, GitHub Actions runs type check, ESLint, and Prettier, then the Playwright suite with `ENV=dev`. The HTML report is uploaded as an artifact. Environment files are not committed, so the job needs `BASE_URL`, `ADMIN_USERNAME`, and `ADMIN_PASSWORD` set in the runner environment.

Local quality checks:

```bash
npm run type-check
npm run lint
npm run format:check
```
