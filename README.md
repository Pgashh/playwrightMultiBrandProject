# 🎯 Multi-Brand Playwright Framework

> **A tag-based test automation framework for testing multiple brands with universal page objects and intelligent locator resolution.**

## 🏗️ **Architecture Overview**

This framework eliminates code duplication across multiple brands using:

- **Tag-Based Organization**: Tests use tags like `@smoke @brand1 @en` instead of folder structures
- **Universal Page Objects**: Single page objects work for all brands via intelligent locator resolution
- **Smart Brand Detection**: Framework auto-detects brand/market from tags or environment variables
- **Zero Code Duplication**: Same test logic works for all brands with brand-specific configurations

## 📁 **Project Structure**

```
playwright-multibrand-framework/
├── 📁 .github/workflows/        # CI/CD pipeline
│   └── playwright.yml           # Automated testing workflow
│
├── 📁 config/                   # Configuration files
│   ├── environments.ts          # Brand URLs per environment
│   ├── testData.ts             # Test data per brand/market
│   └── 📁 env/                 # Environment files (.env.*)
│       ├── .env.staging
│       ├── .env.prelive
│       └── .env.production
│
├── 📁 fixtures/                 # Test fixtures
│   └── enhancedFixtures.ts     # Tag-aware test fixtures with brand context
│
├── 📁 pages/                    # Page objects
│   ├── 📁 shared/              # Base classes
│   │   ├── basePage.ts         # Common page functionality
│   │   └── interfaces.ts       # TypeScript interfaces
│   └── 📁 universal/           # Universal page objects (core innovation)
│       ├── pageFactory.ts      # Creates brand-adaptive pages
│       ├── loginPage.ts        # Universal login page
│       ├── homePage.ts         # Universal home page
│       ├── accountPage.ts      # Universal account page
│       └── 📁 locators/        # Smart locators with brand overrides
│           ├── loginLocators.ts
│           ├── homeLocators.ts
│           └── accountLocators.ts
│
├── 📁 tests/                    # Tag-based test files
│   ├── authentication.spec.ts  # Login/logout tests
│   ├── navigation.spec.ts      # Navigation tests
│   ├── mobile.spec.ts          # Mobile-specific tests
│   ├── performance.spec.ts     # Performance tests
│   ├── setup-check.spec.ts     # Framework validation
│   └── 📁 smoke/               # Smoke test examples
│       └── universal.spec.ts   # Cross-brand smoke tests
│
├── 📁 .vscode/                  # VS Code configuration
├── playwright.config.ts         # Multi-project Playwright configuration
├── package.json                 # Dependencies and tag-based scripts
└── tsconfig.json               # TypeScript configuration
```

## 🎯 **How It Works**

### **1. Tag-Based Test Organization**

Tests use tags instead of separate files for each brand:

```typescript
// ✅ One test works for multiple brands
test('Login functionality @smoke @brand1 @en', async ({ pageFactory, testUser }) => {
  const loginPage = pageFactory.createLoginPage();
  await loginPage.goto();
  await loginPage.login(testUser.email, testUser.password);
  await loginPage.waitForSuccessfulLogin();
});

// ✅ Universal test runs on all brands
test('Homepage loads @smoke @universal', async ({ pageFactory }) => {
  const homePage = pageFactory.createHomePage();
  await homePage.goto();
  expect(await homePage.isLoaded()).toBeTruthy();
});
```

### **2. Universal Page Objects**

Single page objects adapt automatically to any brand:

```typescript
export class UniversalLoginPage extends BasePage {
  private locators: LoginLocators;

  constructor(page: Page, brand: string, market: string, baseUrl: string) {
    super(page, brand, market);
    this.locators = new LoginLocators(brand, market); // Auto-adapts
  }

  async login(email: string, password: string): Promise<void> {
    // Uses brand-specific selectors automatically
    await this.fillInput(this.locators.getEmailInput(), email);
    await this.fillInput(this.locators.getPasswordInput(), password);
    await this.clickElement(this.locators.getSubmitButton());
  }
}
```

### **3. Smart Locator Resolution**

Locators automatically resolve based on brand with fallback patterns:

```typescript
export class LoginLocators {
  constructor(private brand: string, private market: string) {}

  getEmailInput(): string {
    const patterns = [
      '[data-testid="email-input"]',  // Standard
      '#email',                       // Common fallback
      'input[name="email"]',          // Generic fallback
      ...this.getBrandOverrides()     // Brand-specific selectors
    ];
    return patterns.join(', ');
  }

  private getBrandOverrides(): string[] {
    const overrides = {
      'BRAND1': ['#brand1-email', '.brand1-email-field'],
      'BRAND2': ['#brand2-email', '.brand2-email-input'],
    };
    return overrides[this.brand] || [];
  }
}
```

### **4. Brand Configuration**

Environment-driven with automatic fallbacks:

```typescript
export const BRAND_ENVIRONMENTS = {
  BRAND1: {
    staging: "https://brand1-staging.example.com",
    prelive: "https://brand1-prelive.example.com", 
    production: "https://brand1.com"
  },
  BRAND2: {
    staging: "https://brand2-staging.example.com",
    prelive: "https://brand2-prelive.example.com",
    production: "https://brand2.com"
  }
};
```

## 🚀 **Getting Started**

### **Quick Setup**
```bash
git clone [your-repo-url]
cd playwright-multibrand-framework
npm install
npx playwright install
```

### **Run Tests**
```bash
# Run all smoke tests
npm run test:smoke

# Run tests for specific brand
npm run test:brand1:smoke

# Run universal tests (work on all brands)
npm run test:universal

# Interactive testing
npm run test:ui
```

### **Tag Examples**
```bash
# Run smoke tests for BRAND1
npm test -- --grep="@smoke.*@brand1"

# Run mobile tests universally  
npm test -- --grep="@mobile.*@universal"

# Complex combinations
npm test -- --grep="@smoke.*@mobile.*(@brand1|@brand2)"
```

## 🏷️ **Tag Reference**

### **Test Types**
- `@smoke` - Quick validation tests
- `@regression` - Comprehensive tests
- `@universal` - Cross-brand compatibility tests
- `@performance` - Performance validation
- `@mobile` - Mobile-specific tests

### **Brands** (customize for your brands)
- `@brand1` - Your first brand
- `@brand2` - Your second brand
- `@brand3` - Your third brand

### **Markets** (customize for your markets)
- `@en` - English
- `@es` - Spanish
- `@fr` - French

## ➕ **Adding New Brands**

1. **Update environments.ts**:
   ```typescript
   NEWBRAND: {
     staging: "https://newbrand-staging.com",
     production: "https://newbrand.com"
   }
   ```

2. **Add test data**:
   ```typescript
   NEWBRAND: {
     en: {
       validUser: { email: 'test@example.com', password: 'Pass123!' }
     }
   }
   ```

3. **Add npm script**:
   ```json
   "test:newbrand": "BRAND=newbrand MARKET=en playwright test --grep=\"(@newbrand|@universal)\""
   ```

4. **Add locator overrides (if needed)**:
   ```typescript
   'NEWBRAND': ['#nb-email-field', '.newbrand-email']
   ```

## 🔑 **Key Benefits**

- **90% Code Reduction**: One page object replaces multiple brand-specific ones
- **Instant Brand Addition**: New brands require minimal configuration
- **Flexible Execution**: Run any combination of brands/markets/test types
- **Zero Maintenance**: Universal tests work across all brands automatically
- **Type Safety**: Full TypeScript support with IntelliSense

## 📚 **Documentation**

- **[QUICK_START.md](./QUICK_START.md)** - Get running in 2 minutes
- **[EXAMPLES.md](./EXAMPLES.md)** - Complete examples and patterns

---

**🎉 Ready to eliminate code duplication in your multi-brand testing? Check out the [Quick Start Guide](./QUICK_START.md)!**
