import { expect, type Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class AdminMessagePage extends BasePage {
  readonly messageRows: Locator = this.page.locator(
    '[data-testid^="message"]:not([data-testid*="Description"])',
  );
  readonly messageDescriptions: Locator = this.page.locator('[data-testid^="messageDescription"]');

  async open(): Promise<void> {
    await this.goto('/admin/message');
    await expect(this.page).toHaveURL(/\/admin\/message/);
    await this.page.getByText('Name').first().waitFor({ state: 'visible' });
  }

  async expectMessagesListed(): Promise<void> {
    await expect(this.messageRows.first()).toBeVisible();
    expect(await this.messageRows.count()).toBeGreaterThan(0);
  }

  async expectMessageVisible(name: string, subject: string): Promise<void> {
    await expect(this.page.getByText(name, { exact: true }).first()).toBeVisible();
    await expect(this.page.getByText(subject, { exact: true }).first()).toBeVisible();
  }
}
