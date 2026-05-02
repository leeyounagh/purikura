import { test, expect } from "@playwright/test";
import { cropAndProceed } from "./utils/loadImage";

test.describe("Editor multi-step flow", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await cropAndProceed(page);
  });

  test("opens each tab in sequence and applies sticker, background, filter, pen", async ({
    page,
  }) => {
    await page.getByTestId("sticker-tab").click();
    await page.getByTestId("스티커1").click();
    await expect(page.getByTestId("sticker-image").first()).toBeAttached();

    await page.getByTestId("background-tab").click();
    await page.getByTestId("배경1").click();

    await page.getByTestId("filter-tab").click();
    await page.getByTestId("핑크").click();

    await page.getByTestId("pen-tab").click();
    await page.getByTestId("pen-tab").click();

    await expect(page.getByTestId("sticker-image").first()).toBeAttached();
  });

  test("home tab from editor returns to home route", async ({ page }) => {
    await page.getByTestId("sticker-tab").click();
    await page.getByTestId("스티커1").click();
    await expect(page.getByTestId("sticker-image").first()).toBeAttached();

    await page.getByTestId("home-tab").click();
    await expect(page).toHaveURL(/\/$/);
  });
});
