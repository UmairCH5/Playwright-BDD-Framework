import { expect, type Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class AdminBookingPage extends BasePage {
  readonly calendar: Locator = this.page.locator('.rbc-calendar');
  readonly todayButton: Locator = this.page.getByRole('button', {
    name: /Today/i,
  });
  readonly nextButton: Locator = this.page.getByRole('button', {
    name: /Next/i,
  });
  readonly backButton: Locator = this.page.getByRole('button', {
    name: /Back/i,
  });
  readonly monthLabel: Locator = this.calendar.locator('.rbc-toolbar-label');

  async open(): Promise<void> {
    await this.goto('/admin/report');
    await this.waitForVisible(this.calendar);
  }

  async expectBookingsCalendarVisible(): Promise<void> {
    await expect(this.calendar).toBeVisible();
    await expect(this.todayButton).toBeVisible();
    await expect(this.nextButton).toBeVisible();
    await expect(this.backButton).toBeVisible();
    await expect(this.monthLabel).toBeVisible();
  }
}
