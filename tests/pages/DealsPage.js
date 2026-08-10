import { expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class DealsPage extends BasePage {
  constructor(page) {
    super(page);
    this.dealCards = page.locator('.deal-card-item');
    this.confirmReservationButton = page.locator('[role="dialog"] button:has-text("Reserve")');
    this.successMessage = page.locator('.v-toast__text');
  }

  async goto() {
    await super.goto('/deals');
    await this.dealCards.locator('.title').first().waitFor({ state: 'visible', timeout: 30_000 });
  }

  dealCardByName(dealName) {
    const trimmed = dealName.trim();
    const escaped = trimmed.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    return this.dealCards.filter({ has: this.page.locator('.title', { hasText: new RegExp(`^${escaped}$`, 'i') }) });
  }

  itemRowByName(itemName) {
    return this.page.locator('tr').filter({ has: this.page.locator('.text-cont .text', { hasText: itemName }) });
  }

  async reserveItems(dealName, items) {
    const dealCard = this.dealCardByName(dealName);
    if (await dealCard.count() === 0) {
      throw new Error(`Deal "${dealName}" not found or is not available.`);
    }

    await dealCard.locator('button.bfmr-btn-green').click();

    const reserved = [];
    const skipped = [];

    for (const { itemName, quantity } of items) {
      const row = this.itemRowByName(itemName);
      try {
        await expect(row).toHaveCount(1, { timeout: 15_000 });
      } catch {
        skipped.push({ itemName, reason: 'Item not found in this deal.' });
        continue;
      }

      const input = row.locator('input[type="number"]');
      if (await input.isDisabled()) {
        const tooltipText = await row.locator('.error-tooltip').first().textContent().catch(() => null);
        const reason = tooltipText ? tooltipText.trim().replace(/\s+/g, ' ') : 'Item is unavailable to reserve.';
        skipped.push({ itemName, reason });
        continue;
      }

      await input.fill(String(quantity));
      if (await row.locator('td.has-error-border').count() > 0) {
        skipped.push({ itemName, reason: `Requested quantity ${quantity} exceeds the available stock.` });
        await input.fill('');
        continue;
      }

      reserved.push({ itemName, quantity });
    }

    if (reserved.length > 0) {
      await this.confirmReservationButton.click();
    }

    return { reserved, skipped };
  }
}
