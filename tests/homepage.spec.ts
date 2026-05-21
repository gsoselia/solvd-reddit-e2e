import { test, expect } from '@playwright/test';


test('Can navigate to r/cats and has correct title and icon', async ({ page }) => {
  await page.goto('');
  await page.locator('#search-input').click()
  await page.getByRole('textbox', { name: 'Ask' }).fill('cat');
  await page.getByTestId('search-sdui-typeahead-suggestion').filter({ has: page.getByText(/^r\/cats$/) }).click()
  await page.waitForURL('**/cats/', { waitUntil: 'domcontentloaded' })

  await expect(page.getByRole('heading', { name: "r/cats", level: 1 })).toBeVisible()
  await expect(page.getByRole('button', { name: 'Community status:' }).locator('img'))
    .toHaveAttribute('src', 'https://emoji.redditmedia.com/wtdoixyp8oe81_t5_2qhta/drink')
});

