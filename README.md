# Playwright BDD Automation

UI test framework for the [Restful Booker](https://automationintesting.online) hotel site (Shady Meadows B&B). Scenarios are written in Gherkin and run with [Playwright](https://playwright.dev) and [playwright-bdd](https://github.com/vitalets/playwright-bdd).

The suite covers guest flows (home, booking, contact) and admin flows (login, rooms, bookings report, messages) in the UI, plus the underlying REST API (`/api/auth`, `/api/room`, `/api/booking`, `/api/message`, and `/api/branding`).

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

| Variable         | Purpose                                               |
| ---------------- | ----------------------------------------------------- |
| `BASE_URL`       | Site under test. Used as Playwright `baseURL`.        |
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

| File                      | Used by                           |
| ------------------------- | --------------------------------- |
| `test-data/users.json`    | Admin login (UI)                  |
| `test-data/bookings.json` | Guest booking (UI and API)        |
| `test-data/contacts.json` | Contact form (UI) and message API |
| `test-data/rooms.json`    | Admin room creation (UI and API)  |

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

## API coverage

API scenarios live in `features/api/` and use typed API pages in `pages/api/` (one per resource, named `*ApiPage`) on top of Playwright's `request` fixture — no browser is launched. Page objects are split by convention: UI pages in `pages/ui/` (`*Page`) and API pages in `pages/api/` (`*ApiPage`). They reuse the same test data and environment config as the UI suite: `apiBaseURL` is derived from `BASE_URL` in `config/envConfig.ts`, and admin calls log in with `ADMIN_USERNAME` / `ADMIN_PASSWORD`. Authenticated endpoints expect the login token as a `token` cookie. Records a scenario creates (booking, room, message) are deleted again in fixture teardown.

| Area     | Endpoints covered                                                            | Includes negative cases                         |
| -------- | ---------------------------------------------------------------------------- | ----------------------------------------------- |
| Auth     | `POST /api/auth/login`, `POST /api/auth/validate`                            | Invalid password returns `401`                  |
| Branding | `GET /api/branding`                                                          | —                                               |
| Room     | `GET /api/room`, `GET /api/room/{id}`, `POST /api/room`                      | Unauthenticated create returns `401`            |
| Booking  | `POST /api/booking`, `GET /api/booking/{id}`, `GET /api/booking?roomid={id}` | Missing names `400`, unauthenticated read `403` |
| Message  | `POST /api/message`, `GET /api/message`, `GET /api/message/{id}`             | Empty payload returns `400`                     |

```bash
# All API scenarios (any environment: test:dev:api, test:qa:api, test:stage:api)
npm run test:api

# One API area
npm run test:auth
npm run test:room
npm run test:branding
npm run test:message
```

### By tag or area

Feature tags are `@ui`, `@api`, `@smoke`, `@regression`, `@home`, `@contact`, `@admin`, `@auth`, `@room`, `@booking`, `@message`, and `@branding`. `@smoke` and `@regression` span both UI and API scenarios.

```bash
npm run test:smoke
npm run test:regression
npm run test:ui
npm run test:api

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
features/ui/          Gherkin scenarios (UI)
features/api/         Gherkin scenarios (API)
steps/ui/             UI step definitions
steps/api/            API step definitions
pages/ui/             UI page objects (*Page)
pages/api/            API pages (*ApiPage): typed REST clients for auth, room, booking, message, branding
fixtures/             Playwright fixtures (UI and API pages wired into steps)
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
