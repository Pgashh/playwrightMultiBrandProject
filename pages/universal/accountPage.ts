// pages/universal/accountPage.ts
import { Page } from '@playwright/test';
import { BasePage } from '../shared/basePage';
import { IAccountPage, AccountInfo, ProfileData } from '../shared/interfaces';
import { AccountLocators } from './locators/accountLocators';

export class UniversalAccountPage extends BasePage implements IAccountPage {
  private locators: AccountLocators;

  constructor(page: Page, brand: string, market: string, baseUrl: string) {
    super(page, brand, market);
    this.locators = new AccountLocators(brand, market);
  }

  async goto(market?: string): Promise<void> {
    const targetMarket = market || this.config.market;
    const accountPath = this.getAccountPath(targetMarket);
    await super.goto(accountPath);
    await this.waitForPageLoad();
  }

  async isLoaded(): Promise<boolean> {
    const accountMenuSelector = this.locators.getAccountMenu();
    return await this.isVisible(accountMenuSelector);
  }

  async getAccountInfo(): Promise<AccountInfo> {
    // This is a simplified implementation
    // In reality, you'd extract actual account information from the page
    const profileSection = this.locators.getProfileSection();
    await this.waitForSelector(profileSection);
    
    return {
      email: await this.getText(`${profileSection} .email`) || '',
      firstName: await this.getText(`${profileSection} .first-name`) || '',
      lastName: await this.getText(`${profileSection} .last-name`) || '',
      country: await this.getText(`${profileSection} .country`) || '',
      currency: await this.getText(`${profileSection} .currency`) || ''
    };
  }

  async updateProfile(profileData: ProfileData): Promise<void> {
    const profileSection = this.locators.getProfileSection();
    
    if (profileData.firstName) {
      await this.fillInput(`${profileSection} input[name="firstName"]`, profileData.firstName);
    }
    
    if (profileData.lastName) {
      await this.fillInput(`${profileSection} input[name="lastName"]`, profileData.lastName);
    }
    
    if (profileData.phone) {
      await this.fillInput(`${profileSection} input[name="phone"]`, profileData.phone);
    }
    
    // Submit the form
    await this.clickElement(`${profileSection} button[type="submit"]`);
  }

  async changePassword(oldPassword: string, newPassword: string): Promise<void> {
    // Navigate to password change section if needed
    await this.clickElement('[data-testid="change-password"], .change-password');
    
    await this.fillInput('input[name="oldPassword"], #oldPassword', oldPassword);
    await this.fillInput('input[name="newPassword"], #newPassword', newPassword);
    await this.fillInput('input[name="confirmPassword"], #confirmPassword', newPassword);
    
    await this.clickElement('button[type="submit"], .save-password');
  }

  private getAccountPath(market: string): string {
    // Brand-specific account paths
    const accountPaths: Record<string, Record<string, string>> = {
      'CD': { 'en': '/en/my-space', 'fi': '/fi/oma-tila' },
      'LS': { 'en': '/ca/my-account', 'ca': '/ca/mon-compte' },
      'BK': { 'en': '/en/my-account', 'fi': '/fi/oma-tili' },
      'BL': { 'en': '/en/my-account', 'no': '/no/min-konto' },
      'BB': { 'en': '/en/my-account' },
      'PT': { 'fi': '/fi/oma-tili' },
      'RR': { 'en': '/en/my-account' },
      'RK': { 'fi': '/fi/oma-tili' }
    };

    return accountPaths[this.config.brand]?.[market] || `/${market}/my-account`;
  }
}
