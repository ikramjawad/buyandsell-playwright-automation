import { expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class LoginPage extends BasePage {
  constructor(page) {
    super(page);
    this.emailInput = page.locator('#email');
    this.passwordInput = page.locator('#password');
    this.signInButton = page.locator('button.bfmr-btn-primary[type="submit"]');
    this.errorMessage = page.locator('.v-toast__text');
  }

  async goto() {
    await super.goto('/login');
  }

  async login(email, password) {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await expect(this.signInButton).toBeEnabled();
    await this.signInButton.click();
  }
}








