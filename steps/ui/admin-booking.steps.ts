import { When, Then } from '../../fixtures/testFixture';

When(
  'User opens the admin bookings report',
  async ({ adminBookingPage }) => {
    await adminBookingPage.open();
  },
);

Then(
  'User should see the bookings calendar',
  async ({ adminBookingPage }) => {
    await adminBookingPage.expectBookingsCalendarVisible();
  },
);

export {};
