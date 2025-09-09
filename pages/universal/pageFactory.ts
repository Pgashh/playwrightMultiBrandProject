// pages/universal/pageFactory.ts
import { Page } from '@playwright/test';
import { BrandConfig } from '../shared/interfaces';
import { UniversalLoginPage } from './loginPage';
import { UniversalHomePage } from './homePage';
import { UniversalAccountPage } from './accountPage';

/**
 * Universal Page Factory - Creates pages that adapt to any brand
 * This eliminates the need for brand-specific page classes
 */
export class UniversalPageFactory {
  constructor(
    private page: Page, 
    private brandConfig: BrandConfig
  ) {}

  createLoginPage(): UniversalLoginPage {
    return new UniversalLoginPage(
      this.page, 
      this.brandConfig.brand, 
      this.brandConfig.market,
      this.brandConfig.baseUrl
    );
  }

  createHomePage(): UniversalHomePage {
    return new UniversalHomePage(
      this.page, 
      this.brandConfig.brand, 
      this.brandConfig.market,
      this.brandConfig.baseUrl
    );
  }

  createAccountPage(): UniversalAccountPage {
    return new UniversalAccountPage(
      this.page, 
      this.brandConfig.brand, 
      this.brandConfig.market,
      this.brandConfig.baseUrl
    );
  }
}
