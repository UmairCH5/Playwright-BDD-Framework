export type Room = {
  roomid: number;
  roomName: string;
  type: string;
  accessible: boolean;
  roomPrice: number;
  image: string;
  description: string;
  features: string[];
};

export type RoomPayload = Omit<Room, 'roomid'>;

export type BookingDates = {
  checkin: string;
  checkout: string;
};

export type BookingPayload = {
  roomid: number;
  firstname: string;
  lastname: string;
  depositpaid: boolean;
  bookingdates: BookingDates;
  email: string;
  phone: string;
};

export type Booking = {
  bookingid: number;
  roomid: number;
  firstname: string;
  lastname: string;
  depositpaid: boolean;
  bookingdates: BookingDates;
};

export type MessagePayload = {
  name: string;
  email: string;
  phone: string;
  subject: string;
  description: string;
};

export type MessageSummary = {
  id: number;
  name: string;
  subject: string;
  read: boolean;
};

export type Message = MessagePayload & {
  messageid: number;
};

export type Branding = {
  name: string;
  description: string;
  logoUrl: string;
  contact: {
    name: string;
    email: string;
    phone: string;
  };
  address: {
    line1: string;
    line2: string;
    postTown: string;
    county: string;
    postCode: string;
  };
};
