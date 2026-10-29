import { HomePage } from '../pages/ui/HomePage';
import { BookingPage } from '../pages/ui/BookingPage';
import { ContactPage } from '../pages/ui/ContactPage';
import { AdminLoginPage } from '../pages/ui/AdminLoginPage';
import { AdminRoomPage } from '../pages/ui/AdminRoomPage';
import { AdminBookingPage } from '../pages/ui/AdminBookingPage';
import { AdminMessagePage } from '../pages/ui/AdminMessagePage';
import { baseTest } from './baseFixture';

export type PageFixtures = {
  homePage: HomePage;
  bookingPage: BookingPage;
  contactPage: ContactPage;
  adminLoginPage: AdminLoginPage;
  adminRoomPage: AdminRoomPage;
  adminBookingPage: AdminBookingPage;
  adminMessagePage: AdminMessagePage;
};

export const pageTest = baseTest.extend<PageFixtures>({
  homePage: async ({ page }, use) => {
    await use(new HomePage(page));
  },
  bookingPage: async ({ page }, use) => {
    await use(new BookingPage(page));
  },
  contactPage: async ({ page }, use) => {
    await use(new ContactPage(page));
  },
  adminLoginPage: async ({ page }, use) => {
    await use(new AdminLoginPage(page));
  },
  adminRoomPage: async ({ page }, use) => {
    await use(new AdminRoomPage(page));
  },
  adminBookingPage: async ({ page }, use) => {
    await use(new AdminBookingPage(page));
  },
  adminMessagePage: async ({ page }, use) => {
    await use(new AdminMessagePage(page));
  },
});
