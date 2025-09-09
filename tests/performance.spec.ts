// tests/performance.spec.ts
import { test, expect } from '../fixtures/enhancedFixtures';

test.describe('Performance Tests @performance', () => {
  
  test('Page load time is acceptable @universal @performance', async ({ 
    page, 
    brandContext 
  }) => {
    const startTime = Date.now();
    
    await page.goto(brandContext.baseUrl);
    await page.waitForLoadState('domcontentloaded');
    
    const loadTime = Date.now() - startTime;
    
    // Different performance expectations per brand
    let expectedMaxTime = 3000; // default
    if (brandContext.isTargetBrand('CD')) {
      expectedMaxTime = 4000; // CD might be slower due to more content
    } else if (brandContext.isTargetBrand('LS')) {
      expectedMaxTime = 3500; // LS includes sports data
    }
    
    expect(loadTime).toBeLessThan(expectedMaxTime);
  });
});
