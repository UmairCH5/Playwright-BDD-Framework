import { expect, type Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export type ContactDetails = {
  name: string;
  email: string;
  phone: string;
  subject: string;
  description: string;
};

export class ContactPage extends BasePage {
  readonly contactSection: Locator = this.page.locator('#contact');
  readonly name: Locator = this.page.getByTestId('ContactName');
  readonly email: Locator = this.page.getByTestId('ContactEmail');
  readonly phone: Locator = this.page.getByTestId('ContactPhone');
  readonly subject: Locator = this.page.getByTestId('ContactSubject');
  readonly message: Locator = this.page.getByTestId('ContactDescription');
  readonly submitButton: Locator = this.page.getByRole('button', {
    name: /Submit/i,
  });
  readonly successHeading: Locator = this.contactSection.getByRole('heading', {
    name: /Thanks for getting in touch/i,
  });

  async openContactSection(): Promise<void> {
    await this.goto('/#contact');
    await this.waitForVisible(this.contactSection);
  }

  async expectContactFormVisible(): Promise<void> {
    await expect(this.name).toBeVisible();
    await expect(this.email).toBeVisible();
    await expect(this.phone).toBeVisible();
    await expect(this.subject).toBeVisible();
    await expect(this.message).toBeVisible();
    await expect(this.submitButton).toBeVisible();
  }

  async fillContactForm(contact: ContactDetails): Promise<void> {
    await this.name.fill(contact.name);
    await this.email.fill(contact.email);
    await this.phone.fill(contact.phone);
    await this.subject.fill(contact.subject);
    await this.message.fill(contact.description);
  }

  async submitContactForm(): Promise<void> {
    await this.submitButton.click();
  }

  async expectSuccessMessage(contact: ContactDetails): Promise<void> {
    await expect(
      this.contactSection.getByText(new RegExp(`Thanks for getting in touch ${contact.name}`, 'i')),
    ).toBeVisible();
    await expect(this.contactSection.getByText(contact.subject)).toBeVisible();
    await expect(this.contactSection.getByText(/as soon as possible/i)).toBeVisible();
  }
}
