import type { APIResponse } from '@playwright/test';
import { BaseApiPage } from './BaseApiPage';
import type { MessagePayload } from './ApiTypes';

export class MessageApiPage extends BaseApiPage {
  create(payload: MessagePayload): Promise<APIResponse> {
    return this.postRequest('/message', payload);
  }

  list(): Promise<APIResponse> {
    return this.getRequest('/message');
  }

  getById(messageId: number): Promise<APIResponse> {
    return this.getRequest(`/message/${messageId}`);
  }

  delete(messageId: number, token: string): Promise<APIResponse> {
    return this.deleteRequest(`/message/${messageId}`, token);
  }
}
