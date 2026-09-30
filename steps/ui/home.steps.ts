import { Given, Then } from '../../fixtures/testFixture';

Given(
  'User opens the Restful Booker home page',
  async ({ homePage }) => {
    await homePage.open();
  },
);

Then(
  'User should see the hotel welcome heading',
  async ({ homePage }) => {
    await homePage.expectWelcomeHeadingVisible();
  },
);

Then(
  'User should see the main navigation links',
  async ({ homePage }) => {
    await homePage.expectMainNavigationVisible();
  },
);

Then(
  'User should see available rooms listed',
  async ({ homePage }) => {
    await homePage.expectRoomsListed();
  },
);

Then(
  'User should see the booking section',
  async ({ homePage }) => {
    await homePage.expectBookingSectionVisible();
  },
);

Then(
  'User should see the contact section',
  async ({ homePage }) => {
    await homePage.expectContactSectionVisible();
  },
);
