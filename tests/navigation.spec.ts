// tests/navigation.spec.ts
import { test, expect } from '../fixtures/enhancedFixtures';

test.describe('Navigation Tests', () => {
  
  test('Main navigation is functional @smoke @universal', async ({ 
    page, 
    pageFactory, 
    brandContext 
  }) => {
    const homePage = pageFactory.createHomePage();
    
    await homePage.goto();
    expect(await homePage.isLoaded()).toBeTruthy();
    
    // Navigation should work on all brands
    await homePage.navigateToLogin();
    const loginPage = pageFactory.createLoginPage();
    expect(await loginPage.isLoginFormVisible()).toBeTruthy();
  });

  // Brand-specific navigation tests
  test('CD navigation includes casino games section @cd @smoke', async ({ 
    page, 
    pageFactory 
  }) => {
    const homePage = pageFactory.createHomePage();
    await homePage.goto();
    
    // CD-specific navigation items
    await expect(page.locator('a:has-text("Casino Games")')).toBeVisible();
    await expect(page.locator('a:has-text("Live Casino")')).toBeVisible();
  });

  test('LS navigation includes sports betting @ls @smoke', async ({ 
    page, 
    pageFactory 
  }) => {
    const homePage = pageFactory.createHomePage();
    await homePage.goto();
    
    // LS-specific navigation items
    await expect(page.locator('a:has-text("Sports")')).toBeVisible();
    await expect(page.locator('a:has-text("Live Betting")')).toBeVisible();
  });
});
