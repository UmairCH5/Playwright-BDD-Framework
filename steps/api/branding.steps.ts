import { expect } from '@playwright/test';
import { When, Then } from '../../fixtures/testFixture';
import { CONSTANTS } from '../../config/constants';
import type { Branding } from '../../pages/api/ApiTypes';

function branding(apiState: { lastBody?: unknown }): Branding {
  return apiState.lastBody as Branding;
}

When('User requests the hotel branding via the API', async ({ brandingApiPage, apiState }) => {
  const response = await brandingApiPage.get();
  apiState.lastStatus = response.status();
  apiState.lastBody = await response.json();
});

Then('The branding should show the hotel name', async ({ apiState }) => {
  expect(branding(apiState).name).toBe(CONSTANTS.HOTEL_NAME);
});

Then('The branding should include contact details', async ({ apiState }) => {
  const body = branding(apiState);
  expect(body.contact.name).toBeTruthy();
  expect(body.contact.email).toContain('@');
  expect(body.contact.phone).toBeTruthy();
  expect(body.description).toBeTruthy();
  expect(body.address.postCode).toBeTruthy();
});

export {};
