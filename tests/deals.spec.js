import { test, expect } from './support/base';
import { deals } from './fixtures/deals';

test.describe.configure({ timeout: 60_000 });

test('reserves all items when every item is available', async ({ loginPage, dealsPage, page }) => {
  await loginPage.goto();
  await loginPage.login(process.env.TEST_USERNAME, process.env.TEST_PASSWORD);
  await expect(page).toHaveURL(/\/dashboard/);

  await dealsPage.goto();
  const { dealName, items } = deals.allReservable;
  const result = await dealsPage.reserveItems(dealName, items);

  expect(result.skipped).toEqual([]);
  expect(result.reserved).toEqual(items);
  await expect(dealsPage.successMessage).toHaveText('Quantity reserved successfully.');
});

test('reserves the available items and skips the ones that cannot be reserved', async ({ loginPage, dealsPage, page }) => {
  await loginPage.goto();
  await loginPage.login(process.env.TEST_USERNAME, process.env.TEST_PASSWORD);
  await expect(page).toHaveURL(/\/dashboard/);

  await dealsPage.goto();
  const { dealName, items } = deals.partiallyReservable;
  const result = await dealsPage.reserveItems(dealName, items);

  expect(result.reserved).toEqual([{ itemName: 'Black - Bose QC45', quantity: 1 }]);
  expect(result.skipped).toHaveLength(1);
  expect(result.skipped[0].itemName).toBe('White - MX542AM/A');
  expect(result.skipped[0].reason).toMatch(/maximum quantity/i);
  await expect(dealsPage.successMessage).toHaveText('Quantity reserved successfully.');
});

test('skips all items and does not submit when none are reservable', async ({ loginPage, dealsPage, page }) => {
  await loginPage.goto();
  await loginPage.login(process.env.TEST_USERNAME, process.env.TEST_PASSWORD);
  await expect(page).toHaveURL(/\/dashboard/);

  await dealsPage.goto();
  const { dealName, items } = deals.noneReservable;
  const result = await dealsPage.reserveItems(dealName, items);

  expect(result.reserved).toEqual([]);
  expect(result.skipped).toHaveLength(1);
  expect(result.skipped[0].itemName).toBe('White - MX542AM/A');
  await expect(dealsPage.successMessage).not.toBeVisible();
});

test('fails clearly when the deal is not available', async ({ loginPage, dealsPage, page }) => {
  await loginPage.goto();
  await loginPage.login(process.env.TEST_USERNAME, process.env.TEST_PASSWORD);
  await expect(page).toHaveURL(/\/dashboard/);

  await dealsPage.goto();

  await expect(
    dealsPage.reserveItems(deals.unavailable.dealName, deals.unavailable.items)
  ).rejects.toThrow(`Deal "${deals.unavailable.dealName}" not found or is not available.`);
});

test('skips an item that does not match the deal', async ({ loginPage, dealsPage, page }) => {
  await loginPage.goto();
  await loginPage.login(process.env.TEST_USERNAME, process.env.TEST_PASSWORD);
  await expect(page).toHaveURL(/\/dashboard/);

  await dealsPage.goto();
  const { dealName, items } = deals.mismatchedItem;
  const result = await dealsPage.reserveItems(dealName, items);

  expect(result.reserved).toEqual([]);
  expect(result.skipped).toEqual([{ itemName: items[0].itemName, reason: 'Item not found in this deal.' }]);
  await expect(dealsPage.successMessage).not.toBeVisible();
});
