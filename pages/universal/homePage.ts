// pages/universal/homePage.ts
import { Page } from '@playwright/test';
import { BasePage } from '../shared/basePage';
import { IHomePage } from '../shared/interfaces';
import { HomeLocators } from './locators/homeLocators';

export class UniversalHomePage extends BasePage implements IHomePage {
  private locators: HomeLocators;

  constructor(page: Page, brand: string, market: string, baseUrl: string) {
    super(page, brand, market);
    this.locators = new HomeLocators(brand, market);
  }

  async goto(market?: string): Promise<void> {
    const targetMarket = market || this.config.market;
    const homePath = this.getHomePath(targetMarket);
    await super.goto(homePath);
    await this.waitForPageLoad();
  }

  async isLoaded(): Promise<boolean> {
    const mainNavSelector = this.locators.getMainNavigation();
    return await this.isVisible(mainNavSelector);
  }

  async getWelcomeMessage(): Promise<string> {
    const welcomeSelector = this.locators.getWelcomeMessage();
    await this.waitForSelector(welcomeSelector, 10000).catch(() => {});
    return await this.getText(welcomeSelector);
  }

  async navigateToLogin(): Promise<void> {
    const loginButtonSelector = this.locators.getLoginButton();
    await this.clickElement(loginButtonSelector);
    await this.waitForPageLoad();
  }

  async navigateToSignUp(): Promise<void> {
    const signUpButtonSelector = this.locators.getSignUpButton();
    await this.clickElement(signUpButtonSelector);
    await this.waitForPageLoad();
  }

  private getHomePath(market: string): string {
    // Brand-specific home paths
    const homePaths: Record<string, Record<string, string>> = {
      'CD': { 'en': '/en', 'fi': '/fi' },
      'LS': { 'en': '/ca', 'ca': '/ca' },
      'BK': { 'en': '/en', 'fi': '/fi' },
      'BL': { 'en': '/en', 'no': '/no' },
      'BB': { 'en': '/en' },
      'PT': { 'fi': '/fi' },
      'RR': { 'en': '/en' },
      'RK': { 'fi': '/fi' }
    };

    return homePaths[this.config.brand]?.[market] || `/${market}`;
  }
}
