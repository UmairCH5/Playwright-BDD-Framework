import {
  Locator,
  Page,
  expect,
} from '@playwright/test';

export abstract class BasePage {

  constructor(
    protected readonly page: Page
  ) {}

  async goto(path = '/'): Promise<void> {
    await this.page.goto(path, {
      waitUntil: 'commit',
    });
  }

  async waitForVisible(
    locator: Locator,
    timeout = 10_000
  ): Promise<void> {

    await expect(locator).toBeVisible({
      timeout,
    });
  }

  async getTitle(): Promise<string> {

    return this.page.title();
  }
}