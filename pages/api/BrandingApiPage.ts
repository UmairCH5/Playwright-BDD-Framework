import type { APIResponse } from '@playwright/test';
import { BaseApiPage } from './BaseApiPage';

export class BrandingApiPage extends BaseApiPage {
  get(): Promise<APIResponse> {
    return this.getRequest('/branding');
  }
}
