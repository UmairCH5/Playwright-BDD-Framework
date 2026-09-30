import { Given, When, Then } from '../../fixtures/testFixture';
import { FileUtils } from '../../utils/FileUtils';
import type { AdminCredentials } from '../../pages/AdminLoginPage';

type UsersFile = Record<string, AdminCredentials & { role?: string }>;

const users = FileUtils.readJson<UsersFile>('test-data/users.json');

function getAdmin(key: string): AdminCredentials {
  const user = users[key];
  if (!user) {
    throw new Error(`User test data "${key}" not found in test-data/users.json`);
  }
  return { username: user.username, password: user.password };
}

Given(
  'User opens the admin login page',
  async ({ adminLoginPage }) => {
    await adminLoginPage.open();
  },
);

Given(
  'User is logged in as admin from {string}',
  async ({ adminLoginPage }, userKey: string) => {
    await adminLoginPage.open();
    await adminLoginPage.login(getAdmin(userKey));
    await adminLoginPage.expectOnAdminRoomsPage();
  },
);

When(
  'User logs in as admin from {string}',
  async ({ adminLoginPage }, userKey: string) => {
    await adminLoginPage.login(getAdmin(userKey));
  },
);

Then(
  'User should be on the admin rooms page',
  async ({ adminLoginPage }) => {
    await adminLoginPage.expectOnAdminRoomsPage();
  },
);

Then(
  'User should see the admin navigation',
  async ({ adminLoginPage }) => {
    await adminLoginPage.expectAdminNavigationVisible();
  },
);

export {};
