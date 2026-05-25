import { expect, type Locator, type Page } from "@playwright/test";

export class RedditPage {
  readonly page: Page;
  readonly header: Locator;
  readonly sidebar: Locator;

  constructor(page: Page) {
    this.page = page;
    this.header = page.locator("header");
    this.sidebar = page.locator("#left-sidebar-container");
  }

  async hasSidebar() {
    await expect(this.sidebar).toBeVisible();
  }

  async hasHeader() {
    await expect(this.header).toBeVisible();
    await expect(this.header.locator("reddit-search-large")).toBeVisible();
  }

  async pageObjectModel() {
    await this.hasHeader();
    await this.hasSidebar();
  }
}
