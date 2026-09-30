import { Locator, expect } from '@playwright/test';

export class ElementUtils {
  static async click(locator: Locator): Promise<void> {
    await locator.click();
  }

  static async fill(locator: Locator, value: string): Promise<void> {
    await locator.fill(value);
  }

  static async expectVisible(locator: Locator): Promise<void> {
    await expect(locator).toBeVisible();
  }
}
