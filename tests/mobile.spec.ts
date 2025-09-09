// tests/mobile.spec.ts
import { test, expect } from '../fixtures/enhancedFixtures';

test.describe('Mobile Tests @mobile', () => {
  
  test.use({ viewport: { width: 375, height: 667 } }); // iPhone viewport
  
  test('Mobile login works correctly @smoke @mobile @universal', async ({ 
    page, 
    pageFactory, 
    testUser 
  }) => {
    const loginPage = pageFactory.createLoginPage();
    
    await loginPage.goto();
    
    // Mobile-specific checks
    expect(await loginPage.isLoginFormVisible()).toBeTruthy();
    
    await loginPage.login(testUser.email, testUser.password);
    await loginPage.waitForSuccessfulLogin();
  });
});
