import { expect, type Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export type AdminCredentials = {
  username: string;
  password: string;
};

export class AdminLoginPage extends BasePage {
  readonly username: Locator = this.page.locator(
    '#username, input[name="username"]',
  );
  readonly password: Locator = this.page.locator(
    '#password, input[name="password"]',
  );
  readonly loginButton: Locator = this.page.getByRole('button', {
    name: /^Login$/i,
  });
  readonly roomsNavLink: Locator = this.page.getByRole('link', {
    name: /^Rooms$/i,
  });
  readonly reportNavLink: Locator = this.page.getByRole('link', {
    name: /^Report$/i,
  });
  readonly messagesNavLink: Locator = this.page.getByRole('link', {
    name: /Messages/i,
  });
  readonly logoutButton: Locator = this.page.getByRole('button', {
    name: /Logout/i,
  });

  async open(): Promise<void> {
    await this.goto('/admin');
    await this.waitForVisible(this.username);
  }

  async login(credentials: AdminCredentials): Promise<void> {
    await this.username.fill(credentials.username);
    await this.password.fill(credentials.password);
    await Promise.all([
      this.page.waitForURL(/\/admin\/rooms/),
      this.loginButton.click(),
    ]);
  }

  async expectOnAdminRoomsPage(): Promise<void> {
    await expect(this.page).toHaveURL(/\/admin\/rooms/);
    await expect(this.logoutButton).toBeVisible();
  }

  async expectAdminNavigationVisible(): Promise<void> {
    await expect(this.roomsNavLink).toBeVisible();
    await expect(this.reportNavLink).toBeVisible();
    await expect(this.messagesNavLink).toBeVisible();
    await expect(this.logoutButton).toBeVisible();
  }
}
