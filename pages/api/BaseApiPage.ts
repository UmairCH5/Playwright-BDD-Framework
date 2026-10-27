import type { APIRequestContext, APIResponse } from '@playwright/test';
import { envConfig } from '../../config/envConfig';

export abstract class BaseApiPage {
  protected readonly apiBaseURL = envConfig.apiBaseURL;

  constructor(protected readonly request: APIRequestContext) {}

  protected authHeaders(token: string): Record<string, string> {
    return { Cookie: `token=${token}` };
  }

  protected getRequest(path: string, token?: string): Promise<APIResponse> {
    return this.request.get(`${this.apiBaseURL}${path}`, {
      headers: token ? this.authHeaders(token) : undefined,
    });
  }

  protected postRequest(path: string, data: unknown, token?: string): Promise<APIResponse> {
    return this.request.post(`${this.apiBaseURL}${path}`, {
      data,
      headers: token ? this.authHeaders(token) : undefined,
    });
  }

  protected deleteRequest(path: string, token?: string): Promise<APIResponse> {
    return this.request.delete(`${this.apiBaseURL}${path}`, {
      headers: token ? this.authHeaders(token) : undefined,
    });
  }
}
