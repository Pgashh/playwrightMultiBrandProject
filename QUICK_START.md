# 🚀 Quick Start Guide

## ⚡ **Get Running in 2 Minutes**

```bash
# 1. Clone and setup
git clone [your-repo-url]
cd playwrightMultiBrandProject
npm run setup

# 2. Run your first test
npm run test:cd:smoke

# 3. Explore interactively
npm run test:ui
```

## 🎯 **Essential Commands**

```bash
# Quick validation (5 minutes)
npm run test:smoke

# Test specific brand
npm run test:cd:smoke

# Interactive development  
npm run test:ui

# Debug failing tests
npm run test:debug

# Check framework setup
npm run test:setup-check
```

## 🏷️ **Tag Examples**

```bash
# Run all smoke tests
npm test -- --grep="@smoke"

# Run CD brand tests  
npm test -- --grep="@cd"

# Run Finnish market tests
npm test -- --grep="@fi"

# Complex combinations
npm test -- --grep="@smoke.*@mobile.*@cd"
npm test -- --grep="@regression.*(@cd|@ls)"
```

## 🔧 **Environment Setup**

```bash
# Set brand and market
export BRAND=cd
export MARKET=en
export TEST_ENV=staging

# Or pass inline
BRAND=cd MARKET=en npm run test:smoke
```

## 📝 **Writing Your First Test**

```typescript
import { test, expect } from '../fixtures/enhancedFixtures';

// Universal test (runs everywhere)
test('Feature works @smoke @universal', async ({ pageFactory }) => {
  const homePage = pageFactory.createHomePage();
  await homePage.goto();
  expect(await homePage.isLoaded()).toBeTruthy();
});

// Brand-specific test
test('CD welcome bonus @cd @smoke', async ({ page, pageFactory }) => {
  const homePage = pageFactory.createHomePage();
  await homePage.goto();
  await expect(page.locator('.welcome-bonus')).toBeVisible();
});

// Market-specific test
test('Finnish language @fi @smoke @universal', async ({ page, pageFactory }) => {
  const homePage = pageFactory.createHomePage();
  await homePage.goto();
  await expect(page.locator('html[lang="fi"]')).toBeVisible();
});
```

## 🔍 **Troubleshooting**

```bash
# No tests running?
npm run test:dry-run -- --grep="@your-tag"

# Environment issues?
npm run test:setup-check

# Locator problems?
npm run test:headed -- tests/your-test.spec.ts

# Need help with tags?
npm test -- --help
```

## 🎨 **Common Patterns**

### **Test Different Users**
```typescript
test('Login validation @smoke @universal', async ({ 
  pageFactory, testUser, invalidUser, weakPasswordUser 
}) => {
  const loginPage = pageFactory.createLoginPage();
  
  // Test valid user
  await loginPage.login(testUser.email, testUser.password);
  await loginPage.waitForSuccessfulLogin();
  
  // Test invalid user
  await loginPage.login(invalidUser.email, invalidUser.password);
  expect(await loginPage.getErrorMessage()).toBeTruthy();
});
```

### **Brand-Aware Logic**
```typescript
test('Brand-specific behavior @smoke @universal', async ({ 
  pageFactory, brandContext 
}) => {
  const homePage = pageFactory.createHomePage();
  await homePage.goto();
  
  if (brandContext.isTargetBrand('CD')) {
    await expect(page.locator('.casino-games')).toBeVisible();
  } else if (brandContext.isTargetBrand('LS')) {
    await expect(page.locator('.sports-betting')).toBeVisible();
  }
});
```

### **Multi-Environment Testing**
```bash
# Test same functionality across environments
BRAND=cd TEST_ENV=staging npm run test:smoke
BRAND=cd TEST_ENV=prelive npm run test:smoke
BRAND=cd TEST_ENV=production npm run test:smoke
```

## 🎯 **Next Steps**

1. **Customize Your Brands**:
   - Update `config/environments.ts` with your URLs
   - Add your test data in `config/testData.ts`
   - Customize locators in `pages/universal/locators/`

2. **Create Your Tests**:
   - Start with universal tests (`@universal`)
   - Add brand-specific tests only when needed
   - Use meaningful tags for easy filtering

3. **Set Up CI/CD**:
   - The `.github/workflows/playwright.yml` is ready
   - Customize the brand matrix for your needs
   - Add environment secrets as needed

## 💡 **Pro Tips**

- **Start Universal**: Write `@universal` tests first, add brand-specific logic only when needed
- **Use UI Mode**: `npm run test:ui` is perfect for developing and debugging tests  
- **Tag Everything**: Every test should have at least `@smoke` or `@regression`
- **Test Locally**: Use `BRAND=x MARKET=y` before pushing to CI
- **Check Often**: Run `npm run test:setup-check` to validate your setup

## 🎉 **You're Ready!**

Your multi-brand testing framework is ready to scale. Start with:

```bash
npm run test:setup-check  # Verify everything works
npm run test:cd:smoke     # Run first real tests  
npm run test:ui           # Explore interactively
```

**Happy testing! 🧪✨**
