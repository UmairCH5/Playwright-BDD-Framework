import { AuthApiPage } from '../pages/api/AuthApiPage';
import { RoomApiPage } from '../pages/api/RoomApiPage';
import { BookingApiPage } from '../pages/api/BookingApiPage';
import { MessageApiPage } from '../pages/api/MessageApiPage';
import { BrandingApiPage } from '../pages/api/BrandingApiPage';
import { pageTest } from './pageFixture';

import type { Booking, BookingPayload, MessagePayload, Room } from '../pages/api/ApiTypes';

export type ApiState = {
  token?: string;
  lastStatus?: number;
  lastBody?: unknown;
  rooms?: Room[];
  firstRoomId?: number;
  createdRoomId?: number;
  createdRoomName?: string;
  createdBookingId?: number;
  submittedBooking?: BookingPayload;
  lastBooking?: Booking;
  createdMessageId?: number;
  submittedMessage?: MessagePayload;
};

export type ApiFixtures = {
  authApiPage: AuthApiPage;
  roomApiPage: RoomApiPage;
  bookingApiPage: BookingApiPage;
  messageApiPage: MessageApiPage;
  brandingApiPage: BrandingApiPage;
  apiState: ApiState;
};

export const apiTest = pageTest.extend<ApiFixtures>({
  authApiPage: async ({ request }, use) => {
    await use(new AuthApiPage(request));
  },
  roomApiPage: async ({ request }, use) => {
    await use(new RoomApiPage(request));
  },
  bookingApiPage: async ({ request }, use) => {
    await use(new BookingApiPage(request));
  },
  messageApiPage: async ({ request }, use) => {
    await use(new MessageApiPage(request));
  },
  brandingApiPage: async ({ request }, use) => {
    await use(new BrandingApiPage(request));
  },
  apiState: async ({ request }, use) => {
    const state: ApiState = {};
    await use(state);

    if (
      state.createdBookingId === undefined &&
      state.createdRoomId === undefined &&
      state.createdMessageId === undefined
    ) {
      return;
    }

    try {
      const token = state.token ?? (await new AuthApiPage(request).adminToken());
      if (state.createdBookingId !== undefined) {
        await new BookingApiPage(request).delete(state.createdBookingId, token);
      }
      if (state.createdMessageId !== undefined) {
        await new MessageApiPage(request).delete(state.createdMessageId, token);
      }
      if (state.createdRoomId !== undefined) {
        await new RoomApiPage(request).delete(state.createdRoomId, token);
      }
    } catch {
      // Best-effort cleanup: never fail a passing scenario on teardown.
    }
  },
});
