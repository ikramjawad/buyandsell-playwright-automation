import { test, expect } from './support/base';

test('home page loads', async ({ homePage }) => {
  await homePage.goto();
  await expect(homePage.page).toHaveTitle(/BuyForMeRetail/);
});
