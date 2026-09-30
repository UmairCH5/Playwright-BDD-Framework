import { expect, type Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class HomePage extends BasePage {
  readonly welcomeHeading: Locator = this.page.getByRole('heading', {
    name: /Welcome to Shady Meadows B&B/i,
  });
  readonly brandLink: Locator = this.page.getByRole('link', {
    name: /Shady Meadows B&B/i,
  });
  readonly roomsLink: Locator = this.page.locator('nav').getByRole('link', {
    name: 'Rooms',
  });
  readonly bookingLink: Locator = this.page.locator('nav').getByRole('link', {
    name: 'Booking',
  });
  readonly contactLink: Locator = this.page.locator('nav').getByRole('link', {
    name: 'Contact',
  });
  readonly adminLink: Locator = this.page.locator('nav').getByRole('link', {
    name: 'Admin',
  });
  readonly roomsSection: Locator = this.page.locator('#rooms');
  readonly bookingSection: Locator = this.page.locator('#booking');
  readonly contactSection: Locator = this.page.locator('#contact');
  readonly roomCards: Locator = this.page.locator(
    '#rooms .card, #rooms [class*="room"]',
  );
  readonly bookNowButtons: Locator = this.page.getByRole('link', {
    name: /Book now/i,
  });
  readonly checkAvailabilityButton: Locator = this.page.getByRole('button', {
    name: /Check Availability/i,
  });

  async open(): Promise<void> {
    await this.goto('/');
    await this.waitForVisible(this.welcomeHeading);
  }

  async expectWelcomeHeadingVisible(): Promise<void> {
    await expect(this.welcomeHeading).toBeVisible();
  }

  async expectMainNavigationVisible(): Promise<void> {
    await expect(this.roomsLink).toBeVisible();
    await expect(this.bookingLink).toBeVisible();
    await expect(this.contactLink).toBeVisible();
    await expect(this.adminLink).toBeVisible();
  }

  async expectRoomsListed(): Promise<void> {
    await expect(this.roomsSection).toBeVisible();
    await expect(this.bookNowButtons.first()).toBeVisible();
    expect(await this.bookNowButtons.count()).toBeGreaterThan(0);
  }

  async expectBookingSectionVisible(): Promise<void> {
    await expect(this.bookingSection).toBeVisible();
    await expect(this.checkAvailabilityButton).toBeVisible();
  }

  async expectContactSectionVisible(): Promise<void> {
    await expect(this.contactSection).toBeVisible();
  }
}
