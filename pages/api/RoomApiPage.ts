import type { APIResponse } from '@playwright/test';
import { BaseApiPage } from './BaseApiPage';
import type { RoomPayload } from './ApiTypes';

export class RoomApiPage extends BaseApiPage {
  list(): Promise<APIResponse> {
    return this.getRequest('/room');
  }

  getById(roomId: number): Promise<APIResponse> {
    return this.getRequest(`/room/${roomId}`);
  }

  create(payload: RoomPayload, token?: string): Promise<APIResponse> {
    return this.postRequest('/room', payload, token);
  }

  delete(roomId: number, token: string): Promise<APIResponse> {
    return this.deleteRequest(`/room/${roomId}`, token);
  }
}
