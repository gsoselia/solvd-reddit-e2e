import { test, expect } from "@playwright/test";
import { RedditPage } from "./page-object-model.spec";

test("Can navigate to r/cats and has correct title and icon", async ({
  page,
}) => {
  await page.goto("");
  const redditPage = new RedditPage(page);
  await redditPage.pageObjectModel();

  await page.locator("#search-input").click();
  await page.getByRole("textbox", { name: "Ask" }).fill("cat");
  await page
    .getByTestId("search-sdui-typeahead-suggestion")
    .filter({ has: page.getByText(/^r\/cats$/) })
    .click();
  await page.waitForURL("**/cats/", { waitUntil: "domcontentloaded" });

  await expect(
    page.getByRole("heading", { name: "r/cats", level: 1 }),
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Community status:" }).locator("img"),
  ).toHaveAttribute("src", "https://emoji.redditmedia.com");
});

const getButtonBySortOption = (page, option) =>
  page.getByRole("button", { name: `Sort by: ${option}` });

test("Can sort", async ({ page }) => {
  await page.goto("/r/cats");
  const redditPage = new RedditPage(page);
  await redditPage.pageObjectModel();
  const bestBtn = await getButtonBySortOption(page, "Best");
  const hotBtn = await getButtonBySortOption(page, "Hot");
  const newBtn = await getButtonBySortOption(page, "New");
  const topBtn = await getButtonBySortOption(page, "Top");
  const risingBtn = await getButtonBySortOption(page, "Rising");

  // check if Best is a default
  await expect(bestBtn).toHaveText("Best");

  await bestBtn.click();

  const dropdown = page
    .locator('div[slot="dropdown-items"]')
    .filter({ hasText: "Best" });

  // check for all dropdown options
  await expect(dropdown.locator(".text-body-2")).toHaveText([
    "Best",
    "Hot",
    "New",
    "Top",
    "Rising",
  ]);
  await expect(dropdown.locator(".text-body-2").first()).toHaveText("Best");

  // check for individual sort options
  await dropdown.locator(".text-body-2").filter({ hasText: "Best" }).click();
  await page.waitForURL("**/cats/best/");
  await expect(dropdown).not.toBeVisible();
  await expect(bestBtn).toHaveText("Best");

  await bestBtn.click();
  await dropdown.locator(".text-body-2").filter({ hasText: "Hot" }).click();
  await page.waitForURL("**/cats/hot/");
  await expect(dropdown).not.toBeVisible();
  await expect(hotBtn).toHaveText("Hot");

  await hotBtn.click();
  await dropdown.locator(".text-body-2").filter({ hasText: "New" }).click();
  await page.waitForURL("**/cats/new/");
  await expect(dropdown).not.toBeVisible();
  await expect(newBtn).toHaveText("New");

  await newBtn.click();
  await dropdown.locator(".text-body-2").filter({ hasText: "Top" }).click();
  await page.waitForURL("**/cats/top/");
  await expect(dropdown).not.toBeVisible();
  await expect(topBtn).toHaveText("Top");

  await topBtn.click();
  await dropdown.locator(".text-body-2").filter({ hasText: "Rising" }).click();
  await page.waitForURL("**/cats/rising/");
  await expect(dropdown).not.toBeVisible();
  await expect(risingBtn).toHaveText("Rising");
});

test("Can validate invalid email", async ({ page }) => {
  await page.goto("");
  const redditPage = new RedditPage(page);
  await redditPage.pageObjectModel();
  await page.locator("#login-button").click();

  await expect(page.locator('[aria-label="Log In"]')).toBeVisible();

  await page
    .locator("auth-flow-link")
    .filter({ hasText: "Email me a one-time link" })
    .click();

  await page.locator("#auth-magic-link-login-email").click();
  await page.locator("input[type=email]").fill("invalid-email");

  const errorMsg = await page.locator("faceplate-form-helper-text").filter({
    hasText:
      "Please include an '@' in the email address. 'invalid-email' is missing an '@'.",
  });

  await expect(errorMsg).toBeVisible();
});
