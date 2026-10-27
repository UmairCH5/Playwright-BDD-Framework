import { expect } from '@playwright/test';
import { When, Then } from '../../fixtures/testFixture';
import { FileUtils } from '../../utils/FileUtils';
import { RandomDataUtils } from '../../utils/RandomDataUtils';
import type { Room, RoomPayload } from '../../pages/api/ApiTypes';

type RoomsFile = Record<string, RoomPayload>;

const rooms = FileUtils.readJson<RoomsFile>('test-data/rooms.json');

function getRoom(key: string): RoomPayload {
  const room = rooms[key];
  if (!room) {
    throw new Error(`Room test data "${key}" not found in test-data/rooms.json`);
  }
  return room;
}

When('User requests the first room via the API', async ({ roomApiPage, apiState }) => {
  expect(apiState.firstRoomId).toBeDefined();
  const response = await roomApiPage.getById(apiState.firstRoomId as number);
  apiState.lastStatus = response.status();
  apiState.lastBody = await response.json();
});

Then('The room list should not be empty', async ({ apiState }) => {
  expect(apiState.rooms?.length).toBeGreaterThan(0);
});

Then('Each room should have a name, type and price', async ({ apiState }) => {
  for (const room of apiState.rooms ?? []) {
    expect(room.roomid).toBeGreaterThan(0);
    expect(room.roomName).toBeTruthy();
    expect(room.type).toBeTruthy();
    expect(room.roomPrice).toBeGreaterThan(0);
  }
});

Then('The room should match the first room in the list', async ({ apiState }) => {
  const room = apiState.lastBody as Room;
  const first = apiState.rooms?.[0];
  expect(first).toBeDefined();
  expect(room.roomid).toBe(first?.roomid);
  expect(room.roomName).toBe(first?.roomName);
  expect(room.type).toBe(first?.type);
  expect(room.roomPrice).toBe(first?.roomPrice);
});

When(
  'Admin creates a room via the API from {string}',
  async ({ roomApiPage, apiState }, roomKey: string) => {
    expect(apiState.token).toBeTruthy();
    const payload: RoomPayload = {
      ...getRoom(roomKey),
      roomName: RandomDataUtils.string('room'),
    };
    apiState.createdRoomName = payload.roomName;
    const response = await roomApiPage.create(payload, apiState.token);
    apiState.lastStatus = response.status();
    apiState.lastBody = await response.json();
  },
);

When(
  'User tries to create a room via the API from {string}',
  async ({ roomApiPage, apiState }, roomKey: string) => {
    const response = await roomApiPage.create(getRoom(roomKey));
    apiState.lastStatus = response.status();
    apiState.lastBody = await response.json();
  },
);

Then('The created room should appear in the room list', async ({ roomApiPage, apiState }) => {
  expect(apiState.lastBody).toEqual({ success: true });
  const response = await roomApiPage.list();
  const body = (await response.json()) as { rooms: Room[] };
  const created = body.rooms.find((room) => room.roomName === apiState.createdRoomName);
  expect(created).toBeDefined();
  apiState.createdRoomId = created?.roomid;
});

Then('The API should return an authentication error', async ({ apiState }) => {
  expect(apiState.lastBody).toEqual({ errors: ['Authentication required'] });
});

export {};
