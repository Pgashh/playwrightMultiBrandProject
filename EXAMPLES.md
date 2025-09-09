# 📚 Examples & Patterns

## 🎯 **Complete Test Examples**

### **Universal Login Test**
```typescript
// tests/examples/login.spec.ts
import { test, expect } from '../../fixtures/enhancedFixtures';

test.describe('Login Examples', () => {
  // Universal test - works for all brands
  test('Successful login @smoke @universal', async ({ 
    pageFactory, testUser 
  }) => {
    const loginPage = pageFactory.createLoginPage();
    
    await loginPage.goto();
    await loginPage.login(testUser.email, testUser.password);
    await loginPage.waitForSuccessfulLogin();
    
    // Verify we're logged in
    expect(await loginPage.isLoginFormVisible()).toBeFalsy();
  });

  // Brand-specific test
  test('CD English login with bonus check @cd @en @smoke', async ({ 
    page, pageFactory, testUser 
  }) => {
    const loginPage = pageFactory.createLoginPage();
    
    await loginPage.goto();
    await loginPage.login(testUser.email, testUser.password);
    await loginPage.waitForSuccessfulLogin();
    
    // CD-specific: Check for welcome bonus popup
    await expect(page.locator('.welcome-bonus-modal')).toBeVisible();
  });

  // Multi-market test
  test('Login error messages are localized @smoke @universal', async ({ 
    pageFactory, invalidUser, brandContext 
  }) => {
    const loginPage = pageFactory.createLoginPage();
    
    await loginPage.goto();
    await loginPage.login(invalidUser.email, invalidUser.password);
    
    const errorMessage = await loginPage.getErrorMessage();
    
    // Market-specific validations
    if (brandContext.isTargetMarket('fi')) {
      expect(errorMessage).toMatch(/virheelliset.*tunnukset/i);
    } else if (brandContext.isTargetMarket('en')) {
      expect(errorMessage).toMatch(/invalid.*credentials/i);
    } else {
      expect(errorMessage).toBeTruthy(); // At least some error
    }
  });
});
```

### **Navigation & Homepage Tests**
```typescript
// tests/examples/navigation.spec.ts  
import { test, expect } from '../../fixtures/enhancedFixtures';

test.describe('Navigation Examples', () => {
  test('Main navigation works @smoke @universal', async ({ 
    pageFactory 
  }) => {
    const homePage = pageFactory.createHomePage();
    
    await homePage.goto();
    expect(await homePage.isLoaded()).toBeTruthy();
    
    // Universal navigation test
    await homePage.navigateToLogin();
    
    const loginPage = pageFactory.createLoginPage();
    expect(await loginPage.isLoginFormVisible()).toBeTruthy();
  });

  test('Brand-specific navigation items @smoke', async ({ 
    page, pageFactory, brandContext 
  }) => {
    const homePage = pageFactory.createHomePage();
    await homePage.goto();
    
    // Brand-specific navigation checks
    if (brandContext.isTargetBrand('CD')) {
      await expect(page.locator('nav a:has-text("Casino")')).toBeVisible();
      await expect(page.locator('nav a:has-text("Live Casino")')).toBeVisible();
    } else if (brandContext.isTargetBrand('LS')) {
      await expect(page.locator('nav a:has-text("Sports")')).toBeVisible();
      await expect(page.locator('nav a:has-text("Live Betting")')).toBeVisible();
    }
  });
});
```

### **Mobile-Specific Tests**
```typescript
// tests/examples/mobile.spec.ts
import { test, expect } from '../../fixtures/enhancedFixtures';

test.describe('Mobile Examples @mobile', () => {
  test.use({ viewport: { width: 375, height: 667 } }); // iPhone size
  
  test('Mobile login works @smoke @mobile @universal', async ({ 
    page, pageFactory, testUser 
  }) => {
    const loginPage = pageFactory.createLoginPage();
    
    await loginPage.goto();
    
    // Mobile-specific checks
    expect(await loginPage.isLoginFormVisible()).toBeTruthy();
    
    // Check mobile layout
    const mobileMenu = page.locator('.mobile-menu, .hamburger-menu');
    if (await mobileMenu.isVisible()) {
      await mobileMenu.click();
    }
    
    await loginPage.login(testUser.email, testUser.password);
    await loginPage.waitForSuccessfulLogin();
  });

  test('Mobile navigation hamburger @mobile @universal', async ({ 
    page, pageFactory 
  }) => {
    const homePage = pageFactory.createHomePage();
    await homePage.goto();
    
    // Mobile hamburger menu
    const hamburger = page.locator('.hamburger, .mobile-menu-toggle, [data-testid="mobile-menu"]');
    await expect(hamburger).toBeVisible();
    
    await hamburger.click();
    
    // Check mobile menu is open
    const mobileNav = page.locator('.mobile-nav, .mobile-menu-items');
    await expect(mobileNav).toBeVisible();
  });
});
```

### **Performance Tests**
```typescript
// tests/examples/performance.spec.ts
import { test, expect } from '../../fixtures/enhancedFixtures';

test.describe('Performance Examples @performance', () => {
  test('Page load performance @performance @universal', async ({ 
    page, brandContext 
  }) => {
    const startTime = Date.now();
    
    await page.goto(brandContext.baseUrl);
    await page.waitForLoadState('domcontentloaded');
    
    const loadTime = Date.now() - startTime;
    
    // Brand-specific performance expectations
    const maxLoadTime = brandContext.isTargetBrand('CD') ? 4000 : 3000;
    expect(loadTime).toBeLessThan(maxLoadTime);
    
    console.log(`${brandContext.brand} load time: ${loadTime}ms`);
  });

  test('Critical resources load quickly @performance @universal', async ({ 
    page, brandContext 
  }) => {
    const responses: any[] = [];
    
    page.on('response', response => {
      if (response.url().includes('.css') || response.url().includes('.js')) {
        responses.push({
          url: response.url(),
          status: response.status(),
          timing: response.timing()
        });
      }
    });
    
    await page.goto(brandContext.baseUrl);
    await page.waitForLoadState('domcontentloaded');
    
    // Check critical resources loaded successfully
    const failedResources = responses.filter(r => r.status >= 400);
    expect(failedResources).toHaveLength(0);
  });
});
```

## 🎨 **Page Object Customization Examples**

### **Custom Universal Page Object**
```typescript
// pages/universal/customPage.ts
import { Page } from '@playwright/test';
import { BasePage } from '../shared/basePage';
import { CustomLocators } from './locators/customLocators';

export class UniversalCustomPage extends BasePage {
  private locators: CustomLocators;

  constructor(page: Page, brand: string, market: string, baseUrl: string) {
    super(page, brand, market);
    this.locators = new CustomLocators(brand, market);
  }

  async performCustomAction(): Promise<void> {
    // Universal logic with brand-specific selectors
    const actionButton = this.locators.getActionButton();
    await this.clickElement(actionButton);
    
    // Brand-specific behavior
    if (this.config.brand === 'CD') {
      await this.waitForSelector('.cd-success-message');
    } else if (this.config.brand === 'LS') {
      await this.waitForSelector('.ls-confirmation');
    }
  }

  async getResults(): Promise<string[]> {
    const resultsSelector = this.locators.getResultsContainer();
    const results = await this.page.locator(resultsSelector).all();
    
    return Promise.all(
      results.map(result => result.textContent())
    ).then(texts => texts.filter(text => text !== null) as string[]);
  }
}
```

### **Custom Locators with Brand Overrides**
```typescript
// pages/universal/locators/customLocators.ts
export class CustomLocators {
  constructor(private brand: string, private market: string) {}

  getActionButton(): string {
    const patterns = [
      '[data-testid="action-button"]',
      '.action-btn',
      'button[name="action"]'
    ];
    
    const brandOverrides = this.getBrandOverrides();
    if (brandOverrides.actionButton) {
      patterns.unshift(brandOverrides.actionButton);
    }
    
    return patterns.join(', ');
  }

  getResultsContainer(): string {
    const patterns = [
      '[data-testid="results"]',
      '.results-container',
      '#results'
    ];
    
    // Add localized patterns
    const localizedPatterns = this.getLocalizedPatterns();
    return [...localizedPatterns, ...patterns].join(', ');
  }

  private getBrandOverrides() {
    const overrides: Record<string, Record<string, string>> = {
      'CD': {
        actionButton: '.cd-action-btn, #casino-days-action',
        resultsContainer: '.cd-results, .casino-days-results'
      },
      'LS': {
        actionButton: '.ls-action, .lucky-spins-btn',
        resultsContainer: '.ls-results'
      }
    };
    
    return overrides[this.brand] || {};
  }

  private getLocalizedPatterns(): string[] {
    const patterns: Record<string, string[]> = {
      'fi': ['.tulokset', '[data-testid="tulokset"]'],
      'en': ['.results', '[data-testid="results"]'],
      'ca': ['.résultats', '[data-testid="résultats"]'],
      'no': ['.resultater', '[data-testid="resultater"]']
    };
    
    return patterns[this.market] || patterns['en'];
  }
}
```

## 🔧 **Configuration Examples**

### **Adding a New Brand**
```typescript
// 1. Update config/environments.ts
export const BRAND_ENVIRONMENTS = {
  // Existing brands...
  NEWBRAND: {
    staging: "https://newbrand-staging.company.com",
    prelive: "https://newbrand-prelive.company.com",
    production: "https://newbrand.com"
  }
};

// 2. Update config/testData.ts  
export const BRAND_TEST_DATA = {
  // Existing brands...
  NEWBRAND: {
    en: {
      validUser: {
        email: 'newbrand-test@example.com',
        password: 'TestPass123!',
        country: 'Canada',
        currency: 'CAD'
      },
      invalidUser: {
        email: 'invalid@example.com',
        password: 'wrongpass'
      },
      weakPasswordUser: {
        email: 'weak@example.com',
        password: '123'
      }
    }
  }
};

// 3. Add package.json script
{
  "scripts": {
    "test:newbrand": "BRAND=newbrand MARKET=en TEST_ENV=staging playwright test --grep=\"(@newbrand|@universal)\""
  }
}

// 4. Add locator overrides (if needed)
// pages/universal/locators/loginLocators.ts
private getBrandOverrides(): Record<string, string> {
  return {
    'NEWBRAND': {
      emailInput: '#nb-email, .newbrand-email-field',
      passwordInput: '#nb-password, .newbrand-pwd',
      submitButton: '.nb-login-btn, .newbrand-submit'
    }
  };
}
```

### **Multi-Market Configuration**
```typescript
// config/testData.ts - Multi-market example
export const BRAND_TEST_DATA = {
  CD: {
    en: {
      validUser: { email: 'cd-en@test.com', password: 'Pass123!', currency: 'CAD' }
    },
    fi: {
      validUser: { email: 'cd-fi@test.com', password: 'Pass123!', currency: 'EUR' }
    },
    de: {
      validUser: { email: 'cd-de@test.com', password: 'Pass123!', currency: 'EUR' }
    }
  }
};

// Usage in tests:
test('Multi-market login @cd @smoke', async ({ pageFactory, testUser, brandContext }) => {
  const loginPage = pageFactory.createLoginPage();
  
  // testUser automatically matches current market
  await loginPage.login(testUser.email, testUser.password);
  
  // Market-specific validation
  if (brandContext.isTargetMarket('fi')) {
    // Finnish-specific checks
  }
});
```

## 🚀 **Advanced Patterns**

### **Data-Driven Tests**
```typescript
const testUsers = [
  { type: 'valid', shouldSucceed: true },
  { type: 'invalid', shouldSucceed: false },
  { type: 'weakPassword', shouldSucceed: false }
];

for (const userTest of testUsers) {
  test(`Login with ${userTest.type} user @smoke @universal`, async ({ 
    pageFactory, testUser, invalidUser, weakPasswordUser 
  }) => {
    const user = userTest.type === 'valid' ? testUser :
                 userTest.type === 'invalid' ? invalidUser : weakPasswordUser;
    
    const loginPage = pageFactory.createLoginPage();
    await loginPage.goto();
    await loginPage.login(user.email, user.password);
    
    if (userTest.shouldSucceed) {
      await loginPage.waitForSuccessfulLogin();
    } else {
      const error = await loginPage.getErrorMessage();
      expect(error).toBeTruthy();
    }
  });
}
```

### **Cross-Brand Comparison**
```typescript
test('Cross-brand homepage comparison @regression @universal', async ({ 
  pageFactory, brandContext 
}) => {
  const homePage = pageFactory.createHomePage();
  await homePage.goto();
  
  const welcomeMessage = await homePage.getWelcomeMessage();
  
  // Collect data for comparison
  console.log(`${brandContext.brand}: "${welcomeMessage}"`);
  
  // Universal validations
  expect(welcomeMessage.length).toBeGreaterThan(0);
  expect(await homePage.isLoaded()).toBeTruthy();
});
```

### **API + UI Testing**
```typescript
test('API and UI consistency @regression @universal', async ({ 
  request, pageFactory, brandContext 
}) => {
  // API call
  const apiResponse = await request.get(`${brandContext.baseUrl}/api/config`);
  const apiData = await apiResponse.json();
  
  // UI verification
  const homePage = pageFactory.createHomePage();
  await homePage.goto();
  
  const uiTitle = await homePage.getWelcomeMessage();
  
  // Verify consistency
  expect(uiTitle).toContain(apiData.brandName);
});
```

## 📝 **Test Organization Patterns**

### **Feature-Based Organization**
```typescript
// tests/features/checkout.spec.ts
test.describe('Checkout Flow @regression', () => {
  test('Complete checkout @cd @en', async ({ ... }) => { /* CD-specific checkout */ });
  test('Checkout with promo code @universal', async ({ ... }) => { /* Universal checkout */ });
  test('Mobile checkout @mobile @universal', async ({ ... }) => { /* Mobile checkout */ });
});
```

### **Journey-Based Tests**
```typescript
// tests/journeys/new-user.spec.ts
test.describe('New User Journey @smoke', () => {
  test('Complete registration and first deposit @universal', async ({ 
    pageFactory, testUser 
  }) => {
    // 1. Homepage
    const homePage = pageFactory.createHomePage();
    await homePage.goto();
    
    // 2. Registration  
    await homePage.navigateToSignUp();
    // ... registration logic
    
    // 3. First login
    const loginPage = pageFactory.createLoginPage();
    await loginPage.login(testUser.email, testUser.password);
    
    // 4. Account verification
    const accountPage = pageFactory.createAccountPage();
    await accountPage.goto();
    expect(await accountPage.isLoaded()).toBeTruthy();
  });
});
```

These examples show how to leverage the framework's power while maintaining clean, maintainable test code. Use them as templates for your own test scenarios!
