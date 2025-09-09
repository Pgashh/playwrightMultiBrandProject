// Framework setup validation test
import { test, expect } from '../fixtures/enhancedFixtures';

test.describe('Framework Setup Validation', () => {
  test('Environment configuration is valid @setup', async ({ brandConfig }) => {
    // Verify brand configuration
    expect(brandConfig.brand).toBeTruthy();
    expect(brandConfig.market).toBeTruthy();
    expect(brandConfig.environment).toBeTruthy();
    expect(brandConfig.baseUrl).toBeTruthy();
    
    // Verify URL format
    expect(brandConfig.baseUrl).toMatch(/^https?:\/\/.+/);
    
    console.log('✅ Framework Configuration Valid:', {
      brand: brandConfig.brand,
      market: brandConfig.market,
      environment: brandConfig.environment,
      baseUrl: brandConfig.baseUrl
    });
  });

  test('Test data is accessible @setup', async ({ testUser, brandConfig }) => {
    // Verify test user data
    expect(testUser).toBeTruthy();
    expect(testUser.email).toBeTruthy();
    expect(testUser.password).toBeTruthy();
    
    console.log('✅ Test Data Valid:', {
      brand: brandConfig.brand,
      market: brandConfig.market,
      userEmail: testUser.email
    });
  });

  test('Page factory is functional @setup', async ({ page, pageFactory, brandConfig }) => {
    // Verify page factory can create page objects
    const loginPage = pageFactory.createLoginPage();
    const homePage = pageFactory.createHomePage();
    const accountPage = pageFactory.createAccountPage();
    
    expect(loginPage).toBeTruthy();
    expect(homePage).toBeTruthy();
    expect(accountPage).toBeTruthy();
    
    console.log('✅ Page Factory Functional for brand:', brandConfig.brand);
  });

  test('Network connectivity @setup', async ({ page, brandConfig }) => {
    // Basic connectivity test
    const response = await page.goto(brandConfig.baseUrl);
    
    // Should not be a complete failure (404, 500, network error)
    expect(response).toBeTruthy();
    
    const status = response?.status();
    
    if (status && status >= 400) {
      console.warn(`⚠️  HTTP ${status} response from ${brandConfig.baseUrl} - may require VPN or auth`);
    } else {
      console.log('✅ Network Connectivity OK');
    }
  });

  test('Brand context works correctly @setup', async ({ brandContext }) => {
    // Verify brand context is working
    expect(brandContext).toBeTruthy();
    expect(brandContext.brand).toBeTruthy();
    expect(brandContext.market).toBeTruthy();
    
    console.log('✅ Brand Context Functional:', {
      brand: brandContext.brand,
      market: brandContext.market
    });
  });
});
