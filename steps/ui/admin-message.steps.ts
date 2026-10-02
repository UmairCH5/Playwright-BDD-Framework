import { When, Then } from '../../fixtures/testFixture';

When('User opens the admin messages page', async ({ adminMessagePage }) => {
  await adminMessagePage.open();
});

Then('User should see messages listed', async ({ adminMessagePage }) => {
  await adminMessagePage.expectMessagesListed();
});

export {};
