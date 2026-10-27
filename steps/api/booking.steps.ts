import { expect } from '@playwright/test';
import { When, Then } from '../../fixtures/testFixture';
import { FileUtils } from '../../utils/FileUtils';
import { DateUtils } from '../../utils/DateUtils';
import { RandomDataUtils } from '../../utils/RandomDataUtils';
import type { Booking, BookingPayload } from '../../pages/api/ApiTypes';

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

function getBooking(key: string): BookingData {
  const booking = bookings[key];
  if (!booking) {
    throw new Error(`Booking test data "${key}" not found in test-data/bookings.json`);
  }
  return booking;
}

function bookingPayload(key: string, roomId: number): BookingPayload {
  const template = getBooking(key);
  const offsetDays = 50 + Math.floor(Math.random() * 40);
  return {
    roomid: roomId,
    firstname: template.firstname,
    lastname: template.lastname,
    depositpaid: true,
    bookingdates: {
      checkin: DateUtils.addDaysISO(offsetDays),
      checkout: DateUtils.addDaysISO(offsetDays + 2),
    },
    email: RandomDataUtils.email('user'),
    phone: template.phone,
  };
}

When(
  'User creates a booking via the API from {string}',
  async ({ bookingApiPage, apiState }, bookingKey: string) => {
    expect(apiState.firstRoomId).toBeDefined();
    const payload = bookingPayload(bookingKey, apiState.firstRoomId as number);
    apiState.submittedBooking = payload;
    const response = await bookingApiPage.create(payload);
    apiState.lastStatus = response.status();
    const body = (await response.json()) as Booking;
    apiState.lastBooking = body;
    apiState.createdBookingId = body.bookingid;
    apiState.lastBody = body;
  },
);

When(
  'User creates a booking via the API without user names',
  async ({ bookingApiPage, apiState }) => {
    expect(apiState.firstRoomId).toBeDefined();
    const payload = bookingPayload('validBooking', apiState.firstRoomId as number);
    const response = await bookingApiPage.create({ ...payload, firstname: '', lastname: '' });
    apiState.lastStatus = response.status();
    apiState.lastBody = await response.json();
  },
);

Then(
  'The booking should echo the user and dates from {string}',
  async ({ apiState }, bookingKey: string) => {
    const template = getBooking(bookingKey);
    const booking = apiState.lastBooking;
    expect(booking?.bookingid).toBeGreaterThan(0);
    expect(booking?.roomid).toBe(apiState.firstRoomId);
    expect(booking?.firstname).toBe(template.firstname);
    expect(booking?.lastname).toBe(template.lastname);
    expect(booking?.bookingdates).toEqual(apiState.submittedBooking?.bookingdates);
  },
);

When(
  'Admin retrieves the booking via the API',
  async ({ authApiPage, bookingApiPage, apiState }) => {
    apiState.token = await authApiPage.adminToken();
    expect(apiState.createdBookingId).toBeDefined();
    const response = await bookingApiPage.getById(
      apiState.createdBookingId as number,
      apiState.token,
    );
    apiState.lastStatus = response.status();
    apiState.lastBody = await response.json();
  },
);

Then('The retrieved booking should match the created booking', async ({ apiState }) => {
  expect(apiState.lastBody).toEqual(apiState.lastBooking);
});

Then(
  'The booking should appear in the room booking summary',
  async ({ bookingApiPage, apiState }) => {
    expect(apiState.token).toBeTruthy();
    const response = await bookingApiPage.getByRoom(
      apiState.firstRoomId as number,
      apiState.token as string,
    );
    expect(response.status()).toBe(200);
    const body = (await response.json()) as { bookings: Booking[] };
    expect(body.bookings.some((booking) => booking.bookingid === apiState.createdBookingId)).toBe(
      true,
    );
  },
);

Then('The API should return a firstname validation error', async ({ apiState }) => {
  const body = apiState.lastBody as { errors?: string[] };
  expect(body.errors).toContain('Firstname should not be blank');
});

When(
  'User tries to view the booking via the API without authentication',
  async ({ bookingApiPage, apiState }) => {
    expect(apiState.createdBookingId).toBeDefined();
    const response = await bookingApiPage.getById(apiState.createdBookingId as number);
    apiState.lastStatus = response.status();
  },
);

export {};
