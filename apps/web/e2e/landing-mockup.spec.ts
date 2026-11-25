import { expect, test } from "@playwright/test";

const shortlistLabel = "Example shortlist showing two partners' ratings for two homes";

test("renders the interactive shortlist and its computed summary", async ({ page }) => {
  await page.goto("/");

  const shortlist = page.getByRole("group", { name: shortlistLabel });
  await expect(shortlist).toBeVisible();
  await expect(shortlist.getByText("You both like 1 of 2 homes")).toBeVisible();
  await expect(shortlist.getByText("Early access screens may change.")).toBeVisible();
  await expect(shortlist.getByRole("heading", { name: "Maple Hollow" })).toBeVisible();
  await expect(shortlist.getByRole("heading", { name: "Alder Bend" })).toBeVisible();
  await expect(shortlist.getByText("Everyone likes")).toBeVisible();
  await expect(shortlist.getByText("Split opinion")).toBeVisible();
});

for (const width of [375, 768, 1280]) {
  test(`has no horizontal overflow at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/");

    const { scrollWidth, clientWidth } = await page.evaluate(() => ({
      scrollWidth: document.documentElement.scrollWidth,
      clientWidth: document.documentElement.clientWidth,
    }));

    expect(scrollWidth).toBeLessThanOrEqual(clientWidth + 1);
  });
}

test("keeps the form submit above the fold at 375x667", async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 667 });
  await page.goto("/");

  const submit = page.locator("#join button[type='submit']");
  await expect(submit).toBeVisible();

  const box = await submit.boundingBox();
  expect(box).not.toBeNull();
  expect(box!.y + box!.height).toBeLessThanOrEqual(667);
});

test("does not animate the demo when reduced motion is enabled", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");

  const duration = await page.locator(".landing-deal").evaluate((element) => getComputedStyle(element).animationDuration);

  expect(Number.parseFloat(duration)).toBeLessThan(0.001);
});
