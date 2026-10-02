import { Given, When, Then } from '../../fixtures/testFixture';
import { FileUtils } from '../../utils/FileUtils';
import type { ContactDetails } from '../../pages/ContactPage';

type ContactsFile = Record<string, ContactDetails>;

const contacts = FileUtils.readJson<ContactsFile>('test-data/contacts.json');

function getContact(key: string): ContactDetails {
  const contact = contacts[key];
  if (!contact) {
    throw new Error(`Contact test data "${key}" not found in test-data/contacts.json`);
  }
  return contact;
}

Given('User opens the Restful Booker contact page', async ({ contactPage }) => {
  await contactPage.openContactSection();
});

Then('User should see the contact form', async ({ contactPage }) => {
  await contactPage.expectContactFormVisible();
});

When('User fills the contact form from {string}', async ({ contactPage }, contactKey: string) => {
  await contactPage.fillContactForm(getContact(contactKey));
});

When('User submits the contact form', async ({ contactPage }) => {
  await contactPage.submitContactForm();
});

Then(
  'User should see the contact success message for {string}',
  async ({ contactPage }, contactKey: string) => {
    await contactPage.expectSuccessMessage(getContact(contactKey));
  },
);

export {};
