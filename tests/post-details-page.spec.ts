import { test, expect } from "@playwright/test";
import { RedditPage } from "./page-object-model";

test("Can view galery images", async ({ page }) => {
  await page.goto(
    "/r/cats/comments/1tkf6ai/little_ginger_cat_turned_into_a_grumpy_cat_uncle/",
  );
  const redditPage = new RedditPage(page);
  await redditPage.pageObjectModel();

  const galleryComponent = page.locator(
    'shreddit-async-loader[bundlename="gallery_carousel"]',
  );

  expect(galleryComponent).toBeVisible();

  const galleryItems = galleryComponent.locator("ul li");

  // check that gallery has at least one image
  expect(galleryItems).not.toHaveCount(0);

  const prevButton = galleryComponent.locator('span[slot="prevButton"]');
  const nextButton = galleryComponent.locator('span[slot="nextButton"]');
  const pageIndicator = galleryComponent.locator("#current-page-indicator");

  expect(pageIndicator).toBeVisible();
  expect(prevButton).toBeVisible();
  expect(nextButton).toBeVisible();

  for (const item of await galleryItems.all()) {
    await item.locator("img").last().click();
    await expect(page.getByTestId("close-button")).toBeVisible();
    await page.getByTestId("close-button").click();
    nextButton.click();
  }
});

test("Can fold/unfold comments", async ({ page }) => {
  await page.goto(
    "/r/cats/comments/1tkf6ai/little_ginger_cat_turned_into_a_grumpy_cat_uncle/",
  );

  const redditPage = new RedditPage(page);
  await redditPage.pageObjectModel();

  await page.mouse.wheel(0, 1500);

  const authModalVisible = await page
    .getByRole("heading", {
      name: "Sign Up",
      level: 1,
    })
    .count();

  if (authModalVisible > 0) {
    await page.getByRole("button", { name: "Close" }).click();
  }

  const allCommentsCount = await page.locator("shreddit-comment").count();
  // await page.getByRole('button', { name: 'Toggle Comment Thread' }).click();
  const commentThread = await page.locator("shreddit-comment").filter({
    has: page.getByRole("button"),
  });
  await commentThread.locator("button").first().click();
  await expect(await page.locator("shreddit-comment").count()).toEqual(
    allCommentsCount,
  );
  // await page.locator('.text-neutral-content-strong.bg-neutral-background').first().click();
  await page.getByRole("button", { name: "Toggle Comment Thread" }).click();
  await expect(await page.locator("shreddit-comment").count()).toEqual(
    allCommentsCount,
  );
});

test("Can search comments", async ({ page }) => {
  await page.goto(
    "/r/cats/comments/1tkf6ai/little_ginger_cat_turned_into_a_grumpy_cat_uncle/",
  );

  const redditPage = new RedditPage(page);
  await redditPage.pageObjectModel();

  await page.mouse.wheel(0, 500);

  const authModalVisible = await page
    .getByRole("heading", {
      name: "Sign Up",
      level: 1,
    })
    .count();

  if (authModalVisible > 0) {
    await page.getByRole("button", { name: "Close" }).click();
  }

  await page.getByRole("button", { name: "Search Comments Expand" }).click();

  await page
    .locator("#pdp-comment-search-form")
    .getByLabel("", { exact: true })
    .fill("Cat");
  await page
    .locator("#pdp-comment-search-form")
    .getByLabel("", { exact: true })
    .press("Enter");
  await expect(page.getByTestId("search-comment")).not.toHaveCount(0);

  await page.getByRole("textbox", { name: "Clear search" }).click();

  await page
    .locator("#pdp-comment-search-form")
    .getByLabel("", { exact: true })
    .fill("Car");
  await page
    .locator("#pdp-comment-search-form")
    .getByLabel("", { exact: true })
    .press("Enter");
  await expect(
    await page.getByText("Hm... we couldn’t find any"),
  ).toBeVisible();
});
