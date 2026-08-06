import { BasePage } from './BasePage';

export class DealsPage extends BasePage {
  constructor(page) {
    super(page);
    this.dealsNavLink = page.locator('a.nav-link[href="/deals"]');
    this.dealCards = page.locator('.deal-card-item');
    this.confirmReservationButton = page.locator('button:has-text("Confirm")');
    this.successMessage = page.locator('.v-toast__text');
  }

  async goto() {
    await super.goto('/deals');
  }

  async navigateFromNav() {
    await this.dealsNavLink.click();
    await this.page.waitForURL(/\/deals/);
  }

  dealCardByName(itemName) {
    return this.dealCards.filter({ has: this.page.locator('.title', { hasText: itemName }) });
  }

  reserveButtonFor(itemName) {
    return this.dealCardByName(itemName).locator('button.bfmr-btn-green');
  }

  async reserveItem(itemName) {
    await this.reserveButtonFor(itemName).click();
    await this.confirmReservationButton.click();
  }
}
