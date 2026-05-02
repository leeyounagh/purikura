import { test, expect } from "@playwright/test";
import { loadImageFromAlbum } from "./utils/loadImage";

test.describe("Crop multi-step flow", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await loadImageFromAlbum(page);
  });

  test("rotate, flip horizontal, flip vertical then complete proceeds to editor", async ({
    page,
  }) => {
    await page.getByTestId("rotate-button").click();
    await page.getByTestId("flip-horizontal-button").click();
    await page.getByTestId("flip-vertical-button").click();

    await page.getByTestId("crop-done-button").click();
    await expect(page).toHaveURL(/\/main$/);
  });

  test("toggle aspect ratio twice then complete proceeds to editor", async ({
    page,
  }) => {
    await page.getByTestId("aspect-ratio-button").click();
    await page.getByTestId("aspect-ratio-button").click();

    await page.getByTestId("crop-done-button").click();
    await expect(page).toHaveURL(/\/main$/);
  });
});
