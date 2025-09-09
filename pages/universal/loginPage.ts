// pages/universal/loginPage.ts
import { Page, Locator } from '@playwright/test';
import { BasePage } from '../shared/basePage';
import { ILoginPage } from '../shared/interfaces';
import { LoginLocators } from './locators/loginLocators';

export class UniversalLoginPage extends BasePage implements ILoginPage {
  private locators: LoginLocators;

  constructor(page: Page, brand: string, market: string, baseUrl: string) {
    super(page, brand, market);
    this.locators = new LoginLocators(brand, market);
  }

  async goto(market?: string): Promise<void> {
    const targetMarket = market || this.config.market;
    const loginPath = this.getLoginPath(targetMarket);
    await super.goto(loginPath);
    await this.waitForPageLoad();
  }

  async login(email: string, password: string): Promise<void> {
    await this.ensureLoginFormVisible();
    
    const emailSelector = this.locators.getEmailInput();
    const passwordSelector = this.locators.getPasswordInput();
    const submitSelector = this.locators.getSubmitButton();

    await this.fillInput(emailSelector, email);
    await this.fillInput(passwordSelector, password);
    await this.clickElement(submitSelector);
  }

  async waitForSuccessfulLogin(market?: string): Promise<void> {
    const targetMarket = market || this.config.market;
    const expectedUrl = this.getPostLoginUrl(targetMarket);
    
    // Wait for redirect or success indicator
    await Promise.race([
      this.page.waitForURL(new RegExp(expectedUrl)),
      this.page.waitForSelector(this.locators.getSuccessIndicator(), { timeout: 30000 })
    ]);
  }

  async getErrorMessage(): Promise<string> {
    const errorSelector = this.locators.getErrorMessage();
    await this.waitForSelector(errorSelector, 10000).catch(() => {});
    return await this.getText(errorSelector);
  }

  async isLoginFormVisible(): Promise<boolean> {
    const formSelector = this.locators.getLoginForm();
    return await this.isVisible(formSelector);
  }

  private async ensureLoginFormVisible(): Promise<void> {
    const isVisible = await this.isLoginFormVisible();
    if (!isVisible) {
      // Try to find and click login trigger
      const loginTrigger = this.locators.getLoginTrigger();
      const isTriggerVisible = await this.isVisible(loginTrigger);
      if (isTriggerVisible) {
        await this.clickElement(loginTrigger);
        await this.waitForSelector(this.locators.getLoginForm());
      }
    }
  }

  private getLoginPath(market: string): string {
    // Brand-specific login paths
    const loginPaths: Record<string, Record<string, string>> = {
      'CD': { 'en': '/en/login', 'fi': '/fi/kirjaudu' },
      'LS': { 'en': '/ca/login', 'ca': '/ca/connexion' },
      'BK': { 'en': '/en/login', 'fi': '/fi/kirjaudu' },
      'BL': { 'en': '/en/login', 'no': '/no/logg-inn' },
      'BB': { 'en': '/en/login' },
      'PT': { 'fi': '/fi/kirjaudu' },
      'RR': { 'en': '/en/login' },
      'RK': { 'fi': '/fi/kirjaudu' }
    };

    return loginPaths[this.config.brand]?.[market] || `/${market}/login`;
  }

  private getPostLoginUrl(market: string): string {
    // Expected URL after successful login
    const postLoginUrls: Record<string, Record<string, string>> = {
      'CD': { 'en': '/en/my-space', 'fi': '/fi/oma-tila' },
      'LS': { 'en': '/ca/my-account', 'ca': '/ca/mon-compte' },
      'BK': { 'en': '/en/my-account', 'fi': '/fi/oma-tili' },
      'BL': { 'en': '/en/my-account', 'no': '/no/min-konto' },
      'BB': { 'en': '/en/my-account' },
      'PT': { 'fi': '/fi/oma-tili' },
      'RR': { 'en': '/en/my-account' },
      'RK': { 'fi': '/fi/oma-tili' }
    };

    return postLoginUrls[this.config.brand]?.[market] || `/${market}/my-account`;
  }
}
