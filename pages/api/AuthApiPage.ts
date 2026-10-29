import type { APIResponse } from '@playwright/test';
import { BaseApiPage } from './BaseApiPage';
import { envConfig } from '../../config/envConfig';

export class AuthApiPage extends BaseApiPage {
  login(username: string, password: string): Promise<APIResponse> {
    return this.postRequest('/auth/login', { username, password });
  }

  loginAsAdmin(): Promise<APIResponse> {
    return this.login(envConfig.adminUsername, envConfig.adminPassword);
  }

  validate(token: string): Promise<APIResponse> {
    return this.postRequest('/auth/validate', { token });
  }

  async adminToken(): Promise<string> {
    const response = await this.loginAsAdmin();
    if (!response.ok()) {
      throw new Error(`Admin API login failed with status ${response.status()}`);
    }
    const body = (await response.json()) as { token?: string };
    if (!body.token) {
      throw new Error('Admin API login did not return a token');
    }
    return body.token;
  }
}
