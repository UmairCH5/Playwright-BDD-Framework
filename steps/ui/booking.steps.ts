import { Given, When, Then } from '../../fixtures/testFixture';
import { FileUtils } from '../../utils/FileUtils';
import { DateUtils } from '../../utils/DateUtils';
import { RandomDataUtils } from '../../utils/RandomDataUtils';

type BookingData = {
  firstname: string;
  lastname: string;
  email: string;
  phone: string;
  checkin: string;
  checkout: string;
};

type BookingsFile = Record<string, BookingData>;

const bookings = FileUtils.readJson<BookingsFile>('test-data/bookings.json');
const activeBookings = new Map<string, BookingData>();

function getBooking(key: string): BookingData {
  const booking = bookings[key];
  if (!booking) {
    throw new Error(`Booking test data "${key}" not found in test-data/bookings.json`);
  }
  return booking;
}

function bookingForRun(key: string): BookingData {
  const existing = activeBookings.get(key);
  if (existing) {
    return existing;
  }

  const template = getBooking(key);
  const offsetDays = 50 + Math.floor(Math.random() * 40);
  const booking: BookingData = {
    ...template,
    email: RandomDataUtils.email('guest'),
    checkin: DateUtils.addDaysISO(offsetDays),
    checkout: DateUtils.addDaysISO(offsetDays + 2),
  };
  activeBookings.set(key, booking);
  return booking;
}

Given('User opens the Restful Booker booking page', async ({ bookingPage }) => {
  await bookingPage.openBookingSection();
});

When('User enters booking dates from {string}', async ({ bookingPage }, bookingKey: string) => {
  const booking = bookingForRun(bookingKey);
  await bookingPage.enterCheckInDate(DateUtils.toDisplayDate(booking.checkin));
  await bookingPage.enterCheckOutDate(DateUtils.toDisplayDate(booking.checkout));
});

When('User enters check in date {string}', async ({ bookingPage }, date: string) => {
  await bookingPage.enterCheckInDate(date);
});

When('User enters check out date {string}', async ({ bookingPage }, date: string) => {
  await bookingPage.enterCheckOutDate(date);
});

When('User clicks check availability', async ({ bookingPage }) => {
  await bookingPage.checkAvailability();
});

Then('User should be able to see available rooms', async ({ bookingPage }) => {
  await bookingPage.verifyAvailableRoomsDisplayed();
});

When('User clicks the first Book now button', async ({ bookingPage }) => {
  await bookingPage.clickFirstBookNow();
});

When('User clicks the Reserve Now button', async ({ bookingPage }) => {
  await bookingPage.clickReserve();
});

When('User clicks the Reserve button', async ({ bookingPage }) => {
  await bookingPage.clickReserve();
});

When('User fills the booking form from {string}', async ({ bookingPage }, bookingKey: string) => {
  const booking = bookingForRun(bookingKey);
  await bookingPage.fillGuestDetails(booking);
});

When('User confirms the reservation', async ({ bookingPage }) => {
  await bookingPage.confirmReservation();
});

Then('User should see the booking confirmation', async ({ bookingPage }) => {
  await bookingPage.expectBookingConfirmed();
});

Then(
  'User should see the confirmed dates from {string}',
  async ({ bookingPage }, bookingKey: string) => {
    const booking = bookingForRun(bookingKey);
    await bookingPage.expectConfirmedDates(booking.checkin, booking.checkout);
  },
);

Then('User should see the return home link', async ({ bookingPage }) => {
  await bookingPage.expectReturnHomeLinkVisible();
});

export {};
