import { Page, expect } from '@playwright/test';

export class BasePage {
  protected readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async open(path: string = '/') {
    await this.page.goto(path);
  }
  async expectUrlContains(value: string | RegExp) {
    if (typeof value === 'string') {
      await expect(this.page).toHaveURL(new RegExp(value));
    } else {
      await expect(this.page).toHaveURL(value);
    }
  }
}