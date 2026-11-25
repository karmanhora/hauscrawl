import { expect, test } from "@playwright/test";

test("keyboard controls update the sample counter and demo ends with waitlist CTA", async ({ page }) => {
  await page.goto("/");
  const deck = page.getByLabel("Sample demo. Use arrow keys or buttons to save, skip, or book a tour.");
  await deck.focus();
  await page.keyboard.press("ArrowRight");
  await expect(deck.getByText("Saved 1, skipped 0, tours 0.")).toBeVisible();
  for (let i = 0; i < 7; i++) await page.keyboard.press("ArrowLeft");
  await expect(page.getByText("Want this with real homes? Join the waitlist.")).toBeVisible();
});
