import { expect, type Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export type RoomDetails = {
  roomName: string;
  type: string;
  accessible: boolean;
  roomPrice: number;
  features?: string[];
};

export class AdminRoomPage extends BasePage {
  readonly roomName: Locator = this.page.locator('#roomName');
  readonly roomType: Locator = this.page.locator('#type');
  readonly accessible: Locator = this.page.locator('#accessible');
  readonly roomPrice: Locator = this.page.locator('#roomPrice');
  readonly createRoomButton: Locator = this.page.locator('#createRoom');
  readonly roomList: Locator = this.page.locator('div[data-testid="roomlisting"]');

  private readonly featureCheckboxIds: Record<string, string> = {
    WiFi: 'wifiCheckbox',
    TV: 'tvCheckbox',
    Radio: 'radioCheckbox',
    Refreshments: 'refreshCheckbox',
    Safe: 'safeCheckbox',
    Views: 'viewsCheckbox',
  };

  async open(): Promise<void> {
    await this.goto('/admin/rooms');
    await this.waitForVisible(this.roomName);
  }

  async expectRoomFormVisible(): Promise<void> {
    await expect(this.roomName).toBeVisible();
    await expect(this.roomType).toBeVisible();
    await expect(this.accessible).toBeVisible();
    await expect(this.roomPrice).toBeVisible();
    await expect(this.createRoomButton).toBeVisible();
  }

  async createRoom(room: RoomDetails): Promise<void> {
    await this.roomName.fill(room.roomName);
    await this.roomType.selectOption(room.type);
    await this.accessible.selectOption(String(room.accessible));
    await this.roomPrice.fill(String(room.roomPrice));

    for (const feature of room.features ?? []) {
      const checkboxId = this.featureCheckboxIds[feature];
      if (checkboxId) {
        await this.page.locator(`#${checkboxId}`).check();
      }
    }

    await this.createRoomButton.click();
    await expect(this.page.locator(`#roomName${room.roomName}`)).toBeVisible();
  }

  async expectRoomListed(room: RoomDetails): Promise<void> {
    const roomRow = this.page.locator(
      `div[data-testid="roomlisting"]:has(#roomName${room.roomName})`,
    );
    await expect(roomRow).toBeVisible();
    await expect(roomRow.locator(`#type${room.type}`)).toHaveText(room.type);
    await expect(roomRow.locator(`#accessible${String(room.accessible)}`)).toHaveText(
      String(room.accessible),
    );
    await expect(roomRow.locator(`#roomPrice${room.roomPrice}`)).toHaveText(String(room.roomPrice));
  }

  async expectRoomsListed(): Promise<void> {
    await expect(this.roomList.first()).toBeVisible();
    expect(await this.roomList.count()).toBeGreaterThan(0);
  }
}
