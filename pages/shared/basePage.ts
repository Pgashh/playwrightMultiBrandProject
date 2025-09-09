import { Page, Locator } from '@playwright/test';
import { getEnvironmentUrl } from '../../config/environments';

export interface PageConfig {
  brand: string;
  market: string;
  baseUrl: string;
}

export abstract class BasePage {
  protected page: Page;
  protected config: PageConfig;

  constructor(page: Page, brand: string, market: string = 'en') {
    this.page = page;
    this.config = {
      brand: brand.toUpperCase(),
      market: market.toLowerCase(),
      baseUrl: this.getBaseUrl(brand)
    };
  }

  private getBaseUrl(brand: string): string {
    const environment = process.env.TEST_ENV || 'staging';
    return getEnvironmentUrl(brand, environment);
  }

  async goto(path: string = ''): Promise<void> {
    const url = `${this.config.baseUrl}${path}`;
    await this.page.goto(url);
  }

  async waitForPageLoad(): Promise<void> {
    await this.page.waitForLoadState('domcontentloaded');
  }

  async waitForNetworkIdle(): Promise<void> {
    await this.page.waitForLoadState('networkidle');
  }

  async screenshot(name: string): Promise<Buffer> {
    return await this.page.screenshot({ path: `screenshots/${name}.png`, fullPage: true });
  }

  protected async clickElement(selector: string): Promise<void> {
    await this.page.click(selector);
  }

  protected async fillInput(selector: string, value: string): Promise<void> {
    await this.page.fill(selector, value);
  }

  protected async getText(selector: string): Promise<string> {
    return await this.page.textContent(selector) || '';
  }

  protected async isVisible(selector: string): Promise<boolean> {
    return await this.page.isVisible(selector);
  }

  protected async waitForSelector(selector: string, timeout: number = 30000): Promise<void> {
    await this.page.waitForSelector(selector, { timeout });
  }
}
