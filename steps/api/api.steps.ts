import { expect } from '@playwright/test';
import { Given, When, Then } from '../../fixtures/testFixture';
import type { RoomApiPage } from '../../pages/api/RoomApiPage';
import type { Room } from '../../pages/api/ApiTypes';
import type { ApiState } from '../../fixtures/apiFixture';

type RoomListContext = { roomApiPage: RoomApiPage; apiState: ApiState };

async function requestRoomList({ roomApiPage, apiState }: RoomListContext): Promise<void> {
  const response = await roomApiPage.list();
  apiState.lastStatus = response.status();
  const body = (await response.json()) as { rooms: Room[] };
  apiState.rooms = body.rooms;
  apiState.firstRoomId = body.rooms[0]?.roomid;
}

Given('Admin is authenticated via the API', async ({ authApiPage, apiState }) => {
  apiState.token = await authApiPage.adminToken();
});

Given('User has requested the room list via the API', requestRoomList);
When('User requests the room list via the API', requestRoomList);

Then('The API response status should be {int}', async ({ apiState }, expectedStatus: number) => {
  expect(apiState.lastStatus).toBe(expectedStatus);
});

export {};
