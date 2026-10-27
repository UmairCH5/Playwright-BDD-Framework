import type { APIResponse } from '@playwright/test';
import { BaseApiPage } from './BaseApiPage';
import type { BookingPayload } from './ApiTypes';

export class BookingApiPage extends BaseApiPage {
  create(payload: BookingPayload): Promise<APIResponse> {
    return this.postRequest('/booking', payload);
  }

  getByRoom(roomId: number, token?: string): Promise<APIResponse> {
    return this.getRequest(`/booking?roomid=${roomId}`, token);
  }

  getById(bookingId: number, token?: string): Promise<APIResponse> {
    return this.getRequest(`/booking/${bookingId}`, token);
  }

  delete(bookingId: number, token: string): Promise<APIResponse> {
    return this.deleteRequest(`/booking/${bookingId}`, token);
  }
}
