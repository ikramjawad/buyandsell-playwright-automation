import { test, expect } from './support/base';
import { deals } from './fixtures/deals';

test.describe.configure({ timeout: 60_000 });

test('reserves a deal item', async ({ loginPage, dealsPage, page }) => {
  await loginPage.goto();
  await loginPage.login(process.env.TEST_USERNAME, process.env.TEST_PASSWORD);
  await expect(page).toHaveURL(/\/dashboard/);

  await dealsPage.goto();
  await dealsPage.reserveItem(deals.reservable);

  await expect(dealsPage.successMessage).toHaveText('Reservation confirmed.');
});
