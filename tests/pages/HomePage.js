import { BasePage } from './BasePage';

export class HomePage extends BasePage {
  constructor(page) {
    super(page);
  }

  async goto() {
    await super.goto('/');
  }
}
