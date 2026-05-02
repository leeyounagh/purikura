import path from "path";
import { expect, type Page } from "@playwright/test";

export const TEST_IMAGE = path.resolve(
  process.cwd(),
  "assets/images/common/sticker/1.png"
);

export async function loadImageFromAlbum(page: Page) {
  const fileChooserPromise = page.waitForEvent("filechooser");
  await page.getByTestId("open-photoAlbum-button").click();
  const fileChooser = await fileChooserPromise;
  await fileChooser.setFiles(TEST_IMAGE);
  await expect(page).toHaveURL(/\/bridge$/);
}

export async function cropAndProceed(page: Page) {
  await loadImageFromAlbum(page);
  await page.getByTestId("crop-done-button").click();
  await expect(page).toHaveURL(/\/main$/);
}
