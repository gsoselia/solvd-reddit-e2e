import { test as setup, expect } from '@playwright/test';
import path from 'path';
import fs from 'fs';
import dotenv from "dotenv";
import { hasUsableAuthState } from '../utils';

dotenv.config({ path: path.resolve(__dirname, "..", ".env") });

const authFile = path.join(__dirname, '../playwright/.auth/user.json');

const shouldSkipAuth = hasUsableAuthState(authFile);

setup.skip(
  shouldSkipAuth,
  `Auth state already exists at ${authFile}`
);

setup('authenticate', async ({ page }) => {
  // Perform authentication steps. Replace these actions with your own.
  await page.goto(process.env.BASE_URL!);
  await page.locator("#login-button").click();

  await expect(page.locator('[aria-label="Log In"]')).toBeVisible();

  await page.locator('#login-username').click();
  await page.getByRole('textbox', { name: 'Email or username' }).fill(process.env.REDDIT_USER!);
  await page.getByRole('textbox', { name: 'Password' }).click();
  await page.getByRole('textbox', { name: 'Password' }).fill(process.env.REDDIT_PASS!);
  await page.getByRole('button', { name: 'Log In' }).click();

  // End of authentication steps.
  fs.mkdirSync(path.dirname(authFile), { recursive: true });
  await page.context().storageState({ path: authFile });
});