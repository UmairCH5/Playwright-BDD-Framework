import { When, Then } from '../../fixtures/testFixture';
import { FileUtils } from '../../utils/FileUtils';
import type { RoomDetails } from '../../pages/AdminRoomPage';

type RoomsFile = Record<string, RoomDetails & { description?: string; image?: string }>;

const rooms = FileUtils.readJson<RoomsFile>('test-data/rooms.json');

const createdRooms = new Map<string, RoomDetails>();

function getRoomTemplate(key: string): RoomDetails {
  const room = rooms[key];
  if (!room) {
    throw new Error(`Room test data "${key}" not found in test-data/rooms.json`);
  }
  return {
    roomName: room.roomName,
    type: room.type,
    accessible: room.accessible,
    roomPrice: room.roomPrice,
    features: room.features,
  };
}

function uniqueRoom(key: string): RoomDetails {
  const template = getRoomTemplate(key);
  const roomName = String(200 + (Date.now() % 700));
  const created: RoomDetails = { ...template, roomName };
  createdRooms.set(key, created);
  return created;
}

When(
  'User creates a room from {string}',
  async ({ adminRoomPage }, roomKey: string) => {
    const room = uniqueRoom(roomKey);
    await adminRoomPage.createRoom(room);
  },
);

Then(
  'User should see the admin room form',
  async ({ adminRoomPage }) => {
    await adminRoomPage.expectRoomFormVisible();
  },
);

Then(
  'User should see rooms listed in the admin room list',
  async ({ adminRoomPage }) => {
    await adminRoomPage.expectRoomsListed();
  },
);

Then(
  'User should see the created room from {string} in the room list',
  async ({ adminRoomPage }, roomKey: string) => {
    const room = createdRooms.get(roomKey);
    if (!room) {
      throw new Error(
        `No created room found for "${roomKey}". Create the room before asserting.`,
      );
    }
    await adminRoomPage.expectRoomListed(room);
  },
);

export {};
