// tests/authentication.spec.ts
import { test, expect } from '../fixtures/enhancedFixtures';

test.describe('Authentication Tests @smoke @regression', () => {
  
  // Universal test - runs on all brands/markets
  test('Login form should be accessible @accessibility @universal', async ({ 
    page, 
    pageFactory, 
    brandContext 
  }) => {
    const loginPage = pageFactory.createLoginPage();
    
    await loginPage.goto();
    
    // Check accessibility
    expect(await loginPage.isLoginFormVisible()).toBeTruthy();
    
    // Brand-aware assertions
    if (brandContext.isTargetBrand('BRAND1')) {
      // Brand1-specific validations
      await expect(page).toHaveTitle(/Brand1/);
    } else if (brandContext.isTargetBrand('BRAND2')) {
      // Brand2-specific validations
      await expect(page).toHaveTitle(/Brand2/);
    }
  });

  // Brand1-specific tests
  test('Brand1 English market login @brand1 @en @smoke', async ({ 
    page, 
    pageFactory, 
    testUser,
    brandContext 
  }) => {
    // This test only runs when BRAND=brand1 MARKET=en or when tagged with @brand1 @en
    const loginPage = pageFactory.createLoginPage();
    
    await loginPage.goto();
    await loginPage.login(testUser.email, testUser.password);
    await loginPage.waitForSuccessfulLogin();
    
    // Verify Brand1-specific post-login behavior
    await expect(page).toHaveURL(/account|dashboard/);
  });

  // Brand2-specific tests
  test('Brand2 French market login @brand2 @fr @smoke', async ({ 
    page, 
    pageFactory, 
    testUser 
  }) => {
    const loginPage = pageFactory.createLoginPage();
    
    await loginPage.goto();
    await loginPage.login(testUser.email, testUser.password);
    await loginPage.waitForSuccessfulLogin();
    
    // Verify Brand2-specific behavior
    await expect(page).toHaveURL(/mon-compte|tableau/);
  });

  // Multi-brand test with conditional logic
  test('Invalid login shows appropriate error @smoke @negative @universal', async ({ 
    page, 
    pageFactory, 
    invalidUser,
    brandContext 
  }) => {
    const loginPage = pageFactory.createLoginPage();
    
    await loginPage.goto();
    await loginPage.login(invalidUser.email, invalidUser.password);
    
    const errorMessage = await loginPage.getErrorMessage();
    expect(errorMessage).toBeTruthy();
    
    // Brand-specific error message validation
    if (brandContext.hasTag('brand1')) {
      expect(errorMessage).toMatch(/invalid.*credentials/i);
    } else if (brandContext.hasTag('brand2')) {
      expect(errorMessage).toMatch(/connexion.*échoué/i);
    }
  });

  // Regression test for specific markets
  test('Spanish market password requirements @es @regression @validation @universal', async ({ 
    page, 
    pageFactory, 
    weakPasswordUser 
  }) => {
    // Runs only for Spanish market across applicable brands
    const loginPage = pageFactory.createLoginPage();
    
    await loginPage.goto();
    await loginPage.login(weakPasswordUser.email, weakPasswordUser.password);
    
    const errorMessage = await loginPage.getErrorMessage();
    expect(errorMessage).toMatch(/contraseña.*débil/i);
  });
});
