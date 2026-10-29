import { expect } from '@playwright/test';
import { When, Then } from '../../fixtures/testFixture';
import { FileUtils } from '../../utils/FileUtils';
import { RandomDataUtils } from '../../utils/RandomDataUtils';
import type { ContactDetails } from '../../pages/ui/ContactPage';
import type { Message, MessagePayload, MessageSummary } from '../../pages/api/ApiTypes';

type ContactsFile = Record<string, ContactDetails>;

const contacts = FileUtils.readJson<ContactsFile>('test-data/contacts.json');

function getContact(key: string): ContactDetails {
  const contact = contacts[key];
  if (!contact) {
    throw new Error(`Contact test data "${key}" not found in test-data/contacts.json`);
  }
  return contact;
}

When(
  'User submits a contact message via the API from {string}',
  async ({ messageApiPage, apiState }, contactKey: string) => {
    const contact = getContact(contactKey);
    // Unique subject so the message can be found again in the shared list.
    const payload: MessagePayload = {
      ...contact,
      email: RandomDataUtils.email('user'),
      subject: `${contact.subject} ${RandomDataUtils.string('api')}`,
    };
    apiState.submittedMessage = payload;
    const response = await messageApiPage.create(payload);
    apiState.lastStatus = response.status();
    apiState.lastBody = await response.json();
  },
);

When('User submits an empty contact message via the API', async ({ messageApiPage, apiState }) => {
  const response = await messageApiPage.create({
    name: '',
    email: '',
    phone: '',
    subject: '',
    description: '',
  });
  apiState.lastStatus = response.status();
  apiState.lastBody = await response.json();
});

Then(
  'The submitted message should appear in the message list',
  async ({ messageApiPage, apiState }) => {
    expect(apiState.lastBody).toEqual({ success: true });
    const response = await messageApiPage.list();
    expect(response.status()).toBe(200);
    const body = (await response.json()) as { messages: MessageSummary[] };
    const submitted = body.messages.find(
      (message) => message.subject === apiState.submittedMessage?.subject,
    );
    expect(submitted).toBeDefined();
    apiState.createdMessageId = submitted?.id;
  },
);

Then(
  'The submitted message should be readable via the API',
  async ({ messageApiPage, apiState }) => {
    expect(apiState.createdMessageId).toBeDefined();
    const response = await messageApiPage.getById(apiState.createdMessageId as number);
    expect(response.status()).toBe(200);
    const message = (await response.json()) as Message;
    expect(message.name).toBe(apiState.submittedMessage?.name);
    expect(message.email).toBe(apiState.submittedMessage?.email);
    expect(message.subject).toBe(apiState.submittedMessage?.subject);
    expect(message.description).toBe(apiState.submittedMessage?.description);
  },
);

Then('The API should return message validation errors', async ({ apiState }) => {
  const errors = apiState.lastBody as string[];
  expect(errors).toContain('Name may not be blank');
  expect(errors).toContain('Subject may not be blank');
  expect(errors).toContain('Message may not be blank');
});

When('Admin requests the message list via the API', async ({ messageApiPage, apiState }) => {
  const response = await messageApiPage.list();
  apiState.lastStatus = response.status();
  apiState.lastBody = await response.json();
});

Then('The message list should not be empty', async ({ apiState }) => {
  const body = apiState.lastBody as { messages: MessageSummary[] };
  expect(body.messages.length).toBeGreaterThan(0);
  for (const message of body.messages) {
    expect(message.id).toBeGreaterThan(0);
    expect(message.name).toBeTruthy();
    expect(message.subject).toBeTruthy();
  }
});

export {};
