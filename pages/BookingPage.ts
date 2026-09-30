import { expect, type Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export type GuestBookingDetails = {
  firstname: string;
  lastname: string;
  email: string;
  phone: string;
};

export class BookingPage extends BasePage {
  readonly bookingSection: Locator = this.page.locator('#booking');

  readonly checkIn: Locator = this.bookingSection.getByRole('textbox').first();

  readonly checkOut: Locator = this.bookingSection.getByRole('textbox').nth(1);

  readonly checkAvailabilityButton: Locator = this.page.getByRole('button', {
    name: /Check Availability/i,
  });

  readonly availableRooms: Locator = this.page.locator('#rooms .card, #rooms [class*="room"]');

  readonly bookNowButtons: Locator = this.page.locator('a[href*="/reservation/"]');

  readonly reserveButton: Locator = this.page.getByRole('button', {
    name: /Reserve Now/i,
  });

  readonly firstNameInput: Locator = this.page.getByPlaceholder('Firstname');

  readonly lastNameInput: Locator = this.page.getByPlaceholder('Lastname');

  readonly emailInput: Locator = this.page.getByPlaceholder('Email');

  readonly phoneInput: Locator = this.page.getByPlaceholder('Phone');

  readonly bookingConfirmedHeading: Locator = this.page.getByRole('heading', {
    name: /Booking Confirmed/i,
  });

  readonly bookingConfirmationCard: Locator = this.page.locator(
    '.booking-card',
  );

  readonly confirmationMessage: Locator = this.bookingConfirmationCard.getByText(
    /Your booking has been confirmed for the following dates:/i,
  );

  readonly confirmedDates: Locator =
    this.bookingConfirmationCard.locator('strong');

  readonly returnHomeLink: Locator = this.page.getByRole('link', {
    name: /Return home/i,
  });

  async openBookingSection(): Promise<void> {
    await this.goto('/#booking');
    await this.waitForVisible(this.bookingSection);
  }

  async enterCheckInDate(date: string): Promise<void> {
    await this.checkIn.click();
    await this.checkIn.fill(date);
    await this.checkIn.press('Enter');
  }

  async enterCheckOutDate(date: string): Promise<void> {
    await this.checkOut.click();
    await this.checkOut.fill(date);
    await this.checkOut.press('Enter');
  }

  async checkAvailability(): Promise<void> {
    await this.checkAvailabilityButton.click();
  }

  async verifyAvailableRoomsDisplayed(): Promise<void> {
    await expect(this.bookNowButtons.first()).toBeVisible();
    expect(await this.bookNowButtons.count()).toBeGreaterThan(0);
  }

  async clickFirstBookNow(): Promise<void> {
    await Promise.all([
      this.page.waitForURL(/\/reservation\//),
      this.bookNowButtons.first().click(),
    ]);
  }

  async clickReserve(): Promise<void> {
    await this.reserveButton.click();
  }

  async fillGuestDetails(guest: GuestBookingDetails): Promise<void> {
    await this.firstNameInput.fill(guest.firstname);
    await this.lastNameInput.fill(guest.lastname);
    await this.emailInput.fill(guest.email);
    await this.phoneInput.fill(guest.phone);
  }

  async confirmReservation(): Promise<void> {
    await Promise.all([
      this.page.waitForResponse(
        (response) =>
          response.url().includes('/api/booking') &&
          response.request().method() === 'POST' &&
          response.status() === 201,
      ),
      this.reserveButton.click(),
    ]);
    await expect(this.bookingConfirmedHeading).toBeVisible();
  }

  async expectBookingConfirmed(): Promise<void> {
    await expect(this.bookingConfirmedHeading).toBeVisible();
    await expect(this.confirmationMessage).toBeVisible();
  }

  async expectConfirmedDates(checkin: string, checkout: string): Promise<void> {
    await expect(this.confirmedDates).toHaveText(`${checkin} - ${checkout}`);
  }

  async expectReturnHomeLinkVisible(): Promise<void> {
    await expect(this.returnHomeLink).toBeVisible();
  }
}
