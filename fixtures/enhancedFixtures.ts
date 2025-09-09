// Enhanced fixtures with tag-based brand detection
import { test as base, TestInfo } from '@playwright/test';
import { getEnvironmentUrl } from '../config/environments';
import { TestDataGenerator, TestUser } from '../config/testData';
import { BrandConfig } from '../pages/shared/interfaces';
import { UniversalPageFactory } from '../pages/universal/pageFactory';

export interface TestFixtures {
  brandConfig: BrandConfig;
  pageFactory: UniversalPageFactory;
  testUser: TestUser;
  invalidUser: TestUser;
  weakPasswordUser: TestUser;
  brandContext: BrandContext;
}

export interface BrandContext {
  brand: string;
  market: string;
  environment: string;
  baseUrl: string;
  isTargetBrand: (targetBrand: string) => boolean;
  isTargetMarket: (targetMarket: string) => boolean;
  hasTag: (tag: string) => boolean;
}

// Enhanced test with tag and brand context
export const test = base.extend<TestFixtures>({
  // Brand configuration with tag awareness
  brandConfig: async ({}, use, testInfo) => {
    const brand = process.env.BRAND || extractBrandFromTags(testInfo) || 'CD';
    const market = process.env.MARKET || extractMarketFromTags(testInfo) || 'en';
    const environment = process.env.TEST_ENV || 'staging';
    
    const baseUrl = getEnvironmentUrl(brand, environment);
    
    const config: BrandConfig = {
      brand: brand.toUpperCase(),
      market: market.toLowerCase(),
      environment: environment.toLowerCase(),
      baseUrl
    };
    
    // Skip test if brand/market doesn't match tags
    if (shouldSkipTest(testInfo, config)) {
      testInfo.skip(true, `Test not applicable for ${config.brand}/${config.market}`);
    }
    
    await use(config);
  },

  // Brand context helper
  brandContext: async ({ brandConfig }, use, testInfo) => {
    const context: BrandContext = {
      ...brandConfig,
      isTargetBrand: (targetBrand: string) => 
        brandConfig.brand === targetBrand.toUpperCase(),
      isTargetMarket: (targetMarket: string) => 
        brandConfig.market === targetMarket.toLowerCase(),
      hasTag: (tag: string) => 
        testInfo.tags.includes(tag.toLowerCase()) || testInfo.tags.includes(tag.toUpperCase())
    };
    
    await use(context);
  },

  // Universal page factory
  pageFactory: async ({ page, brandConfig }, use) => {
    const factory = new UniversalPageFactory(page, brandConfig);
    await use(factory);
  },

  // Test users
  testUser: async ({ brandConfig }, use) => {
    const user = TestDataGenerator.getTestUser(
      brandConfig.brand,
      brandConfig.market,
      'valid'
    );
    await use(user);
  },

  invalidUser: async ({ brandConfig }, use) => {
    const user = TestDataGenerator.getTestUser(
      brandConfig.brand,
      brandConfig.market,
      'invalid'
    );
    await use(user);
  },

  weakPasswordUser: async ({ brandConfig }, use) => {
    const user = TestDataGenerator.getTestUser(
      brandConfig.brand,
      brandConfig.market,
      'weakPassword'
    );
    await use(user);
  },
});

export { expect } from '@playwright/test';

// Helper functions
function extractBrandFromTags(testInfo: TestInfo): string | null {
  const brandTags = ['cd', 'ls', 'bk', 'bl', 'bb', 'pt', 'rr', 'rk'];
  const foundBrand = testInfo.tags.find(tag => 
    brandTags.includes(tag.toLowerCase())
  );
  return foundBrand ? foundBrand.toUpperCase() : null;
}

function extractMarketFromTags(testInfo: TestInfo): string | null {
  const marketTags = ['en', 'fi', 'ca', 'no'];
  const foundMarket = testInfo.tags.find(tag => 
    marketTags.includes(tag.toLowerCase())
  );
  return foundMarket ? foundMarket.toLowerCase() : null;
}

function shouldSkipTest(testInfo: TestInfo, config: BrandConfig): boolean {
  const tags = testInfo.tags || [];
  
  // If no brand/market tags specified, run everywhere
  const brandTags = tags.filter(tag => ['cd', 'ls', 'bk', 'bl', 'bb', 'pt', 'rr', 'rk'].includes(tag.toLowerCase()));
  const marketTags = tags.filter(tag => ['en', 'fi', 'ca', 'no'].includes(tag.toLowerCase()));
  
  if (brandTags.length === 0 && marketTags.length === 0) {
    return false; // Universal test
  }
  
  // Check brand match
  const brandMatch = brandTags.length === 0 || 
    brandTags.some(tag => tag.toLowerCase() === config.brand.toLowerCase());
  
  // Check market match
  const marketMatch = marketTags.length === 0 || 
    marketTags.some(tag => tag.toLowerCase() === config.market.toLowerCase());
  
  return !(brandMatch && marketMatch);
}
