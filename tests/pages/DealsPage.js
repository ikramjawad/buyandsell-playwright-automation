import { expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class DealsPage extends BasePage {
  constructor(page) {
    super(page);
    this.dealsNavLink = page.locator('a.nav-link[href="/deals"][title="Deals"]')
    this.dealCards = page.locator('.deal-card-item');
    this.confirmReservationButton = page.locator('[role="dialog"] button:has-text("Reserve")');
    this.successMessage = page.locator('.v-toast__text');
  }

  async goto() {
    await super.goto('/deals');
  }

  async navigateFromNav() {
    await this.page.locator('#initial-loading').waitFor({ state: 'hidden' }).catch(() => {});
    await this.dealsNavLink.click({ force: true });
    await this.dealCards.first().waitFor({ state: 'visible' });
  }

  dealCardByName(dealName) {
    return this.dealCards.filter({ has: this.page.locator('.title', { hasText: dealName }) });
  }

  reserveButtonFor(dealName) {
    return this.dealCardByName(dealName).locator('button.bfmr-btn-green');
  }

  itemRowByName(itemName) {
    return this.page.locator('tr').filter({ has: this.page.locator('.text-cont .text', { hasText: itemName }) });
  }

  quantityInputFor(itemName) {
    return this.itemRowByName(itemName).locator('input[type="number"]');
  }

  async reserveItems(dealName, items) {
    await this.reserveButtonFor(dealName).click();

    for (const { itemName, quantity } of items) {
      const row = this.itemRowByName(itemName);
      try {
        await expect(row).toHaveCount(1, { timeout: 15_000 });
      } catch {
        throw new Error(`Item "${itemName}" not found in deal "${dealName}"`);
      }

      const input = row.locator('input[type="number"]');
      if (await input.isDisabled()) {
        throw new Error(`Item "${itemName}" in deal "${dealName}" is out of stock and cannot be reserved.`);
      }

      await input.fill(String(quantity));
      if (await row.locator('td.has-error-border').count() > 0) {
        throw new Error(`Requested quantity ${quantity} for "${itemName}" in deal "${dealName}" exceeds the available stock.`);
      }
    }
    await this.confirmReservationButton.click();
  }
}
