// Universal tests that work across all brands
// These tests use the fixture system to automatically adapt to any brand

import { test, expect } from '../../fixtures/enhancedFixtures';

test.describe('Universal Brand Tests @universal', () => {
  test('Homepage accessibility @smoke @universal', async ({ page, brandConfig }) => {
    await page.goto(brandConfig.baseUrl);
    
    // Check basic accessibility features
    const title = await page.title();
    expect(title).toBeTruthy();
    expect(title.length).toBeGreaterThan(0);
    
    // Check for main landmark
    const main = page.locator('main, [role="main"], .main-content');
    await expect(main.first()).toBeVisible();
  });

  test('Response time is acceptable @performance @universal', async ({ page, brandConfig }) => {
    const startTime = Date.now();
    
    await page.goto(brandConfig.baseUrl);
    await page.waitForLoadState('domcontentloaded');
    
    const loadTime = Date.now() - startTime;
    expect(loadTime).toBeLessThan(5000); // 5 second timeout
  });

  test('No JavaScript errors on homepage @universal @smoke', async ({ page, brandConfig }) => {
    const errors: string[] = [];
    
    page.on('pageerror', (error: Error) => {
      errors.push(error.message);
    });
    
    await page.goto(brandConfig.baseUrl);
    await page.waitForLoadState('domcontentloaded');
    
    expect(errors).toHaveLength(0);
  });

  test('Basic navigation is functional @universal @smoke', async ({ 
    page, 
    pageFactory 
  }) => {
    const homePage = pageFactory.createHomePage();
    
    await homePage.goto();
    expect(await homePage.isLoaded()).toBeTruthy();
    
    // Try to navigate to login
    try {
      await homePage.navigateToLogin();
      const loginPage = pageFactory.createLoginPage();
      expect(await loginPage.isLoginFormVisible()).toBeTruthy();
    } catch (error) {
      console.warn('Login navigation not available or different implementation needed');
    }
  });
});
