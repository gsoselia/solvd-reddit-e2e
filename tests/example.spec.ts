import { test, expect } from '@playwright/test';


test('Can navigate to r/cats', async ({ page }) => {
  await page.goto('');
  await page.locator('#search-input').click()
  await page.getByRole('textbox', { name: 'Ask' }).fill('cat');
  await page.getByTestId('search-sdui-typeahead-suggestion').filter({ has: page.getByText(/^r\/cats$/) }).click()
  await page.waitForURL('https://www.reddit.com/r/cats/')
  await expect(page.getByRole('heading', {name: 'r/cats'}))
});

