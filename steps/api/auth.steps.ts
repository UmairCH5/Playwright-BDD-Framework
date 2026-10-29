import { expect } from '@playwright/test';
import { When, Then } from '../../fixtures/testFixture';
import { envConfig } from '../../config/envConfig';

When('Admin logs in via the API with valid credentials', async ({ authApiPage, apiState }) => {
  const response = await authApiPage.loginAsAdmin();
  apiState.lastStatus = response.status();
  const body = (await response.json()) as { token?: string };
  apiState.token = body.token;
  apiState.lastBody = body;
});

When('Admin logs in via the API with an invalid password', async ({ authApiPage, apiState }) => {
  const response = await authApiPage.login(envConfig.adminUsername, 'invalid-password');
  apiState.lastStatus = response.status();
  apiState.token = undefined;
  apiState.lastBody = await response.json();
});

Then('The API should return an auth token', async ({ apiState }) => {
  expect(apiState.token).toBeTruthy();
});

Then('The returned auth token should be valid', async ({ authApiPage, apiState }) => {
  expect(apiState.token).toBeTruthy();
  const response = await authApiPage.validate(apiState.token as string);
  expect(response.status()).toBe(200);
  expect(await response.json()).toEqual({ valid: true });
});

Then('The API should return an invalid credentials error', async ({ apiState }) => {
  expect(apiState.lastBody).toEqual({ error: 'Invalid credentials' });
});

export {};
