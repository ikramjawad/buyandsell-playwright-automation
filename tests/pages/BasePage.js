export class BasePage {
  constructor(page) {
    this.page = page;
  }

  async goto(path = '/login') {
    let response;
    try {
      response = await this.page.goto(path, { waitUntil: 'domcontentloaded' });
    } catch (error) {
      throw new Error(`Site did not load at "${path}": ${error.message}`);
    }

    if (response && !response.ok()) {
      throw new Error(
        `Site returned an error at "${path}": HTTP ${response.status()} ${response.statusText()}`
      );
    }
  }

  async getTitle() {
    return this.page.title();
  }
}
