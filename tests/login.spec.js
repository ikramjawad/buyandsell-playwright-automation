import { test, expect } from './support/base';

test.describe.configure({ timeout: 60_000 });

test('logs in successfully with valid credentials', async ({ loginPage, page }) => 
  {
  await loginPage.goto();
  await loginPage.login(process.env.TEST_USERNAME, process.env.TEST_PASSWORD);
 await expect(page).toHaveURL(/\/dashboard/);
}
);

test('shows an error with an invalid password', async ({ loginPage, page }) => {
  await loginPage.goto();
  await loginPage.login(process.env.TEST_USERNAME, 'WrongPassword123!');
  await expect(loginPage.errorMessage).toHaveText('Invalid credentials.');
  await expect(page).toHaveURL(/\/login/);
});
