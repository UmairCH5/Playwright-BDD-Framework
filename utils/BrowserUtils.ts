import { Page } from '@playwright/test';

export class BrowserUtils {
  static async clearCookies(page: Page): Promise<void> {
    await page.context().clearCookies();
  }

  static async reload(page: Page): Promise<void> {
    await page.reload();
  }
}
