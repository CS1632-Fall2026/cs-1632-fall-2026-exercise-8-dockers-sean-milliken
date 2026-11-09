import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('http://localhost:8080');

  await page.evaluate(() => {
    document.cookie = "1=false";
    document.cookie = "2=false";
    document.cookie = "3=false";
  });
});

test('TEST-1-RESET', async ({ page }) => {
  await page.evaluate(() => {
    document.cookie = "1=true";
    document.cookie = "2=true";
    document.cookie = "3=true";
  });

  await page.click('a:has-text("Reset")');

  const catListing = page.locator('ul[aria-label="Cat names"] li');
  await expect(catListing.nth(0)).toHaveText('ID 1. Jennyanydots');
  await expect(catListing.nth(1)).toHaveText('ID 2. Old Deuteronomy');
  await expect(catListing.nth(2)).toHaveText('ID 3. Mistoffelees');
});

test('TEST-2-CATALOG', async ({ page }) => {
  await page.click('a:has-text("Catalog")');

  const secondImage = page.locator('ol[aria-label="Cat photos"] img').nth(1);
  await expect(secondImage).toHaveAttribute('src', '/images/cat2.jpg');
});

test('TEST-3-LISTING', async ({ page }) => {
  await page.click('a:has-text("Catalog")');

  const catListing = page.locator('ul[aria-label="Cat names"] li');
  await expect(catListing).toHaveCount(3);
  await expect(catListing.nth(2)).toHaveText('ID 3. Mistoffelees');
});

test('TEST-4-RENT-A-CAT', async ({ page }) => {
  await page.click('a:has-text("Rent-A-Cat")');

  await expect(page.locator('button:has-text("Rent")')).toBeVisible();
  await expect(page.locator('button:has-text("Return")')).toBeVisible();
});

test('TEST-5-RENT', async ({ page }) => {
  await page.click('a:has-text("Rent-A-Cat")');

  await page.locator('input[type="text"]').first().fill('1');

  await page.click('button:has-text("Rent")');

  const catListing = page.locator('ul[aria-label="Cat names"] li');
  await expect(catListing.nth(0)).toHaveText('Rented out');
  await expect(catListing.nth(1)).toHaveText('ID 2. Old Deuteronomy');
  await expect(catListing.nth(2)).toHaveText('ID 3. Mistoffelees');

  await expect(page.locator('text=Success!')).toBeVisible();
});

test('TEST-6-RETURN', async ({ page }) => {
  await page.evaluate(() => {
    document.cookie = "2=true";
    document.cookie = "3=true";
  });

  await page.click('a:has-text("Rent-A-Cat")');

  await page.locator('input[type="text"]').nth(1).fill('2');

  await page.click('button:has-text("Return")');

  const catListing = page.locator('ul[aria-label="Cat names"] li');
  await expect(catListing.nth(0)).toHaveText('ID 1. Jennyanydots');
  await expect(catListing.nth(1)).toHaveText('ID 2. Old Deuteronomy');
  await expect(catListing.nth(2)).toHaveText('Rented out');

  await expect(page.locator('text=Success!')).toBeVisible();
});

test('TEST-7-FEED-A-CAT', async ({ page }) => {
  await page.click('a:has-text("Feed-A-Cat")');

  await expect(page.locator('button:has-text("Feed")')).toBeVisible();
});

test('TEST-8-FEED', async ({ page }) => {
  await page.click('a:has-text("Feed-A-Cat")');

  await page.locator('input[type="text"]').fill('6');

  await page.click('button:has-text("Feed")');

  await expect(page.locator('text=Nom, nom, nom.')).toBeVisible({ timeout: 10000 });
});

test('TEST-9-GREET-A-CAT', async ({ page }) => {
  await page.click('a:has-text("Greet-A-Cat")');

  await expect(page.locator('text=Meow!Meow!Meow!')).toBeVisible();
});

test('TEST-10-GREET-A-CAT-WITH-NAME', async ({ page }) => {
  await page.goto('http://localhost:8080/greet-a-cat/Jennyanydots');

  await expect(page.locator('text=Meow! from Jennyanydots.')).toBeVisible();
});

test('TEST-11-FEED-A-CAT-SCREENSHOT', async ({ page }) => {
  await page.evaluate(() => {
    document.cookie = "1=true";
    document.cookie = "2=true";
    document.cookie = "3=true";
  });

  await page.click('a:has-text("Feed-A-Cat")');

  await expect(page.locator('body')).toHaveScreenshot();
});