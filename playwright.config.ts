import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  timeout: 60000,
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  
  use: {
    actionTimeout: 30000,
    navigationTimeout: 30000,
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  
  reporter: [
    ['html', { outputFolder: 'playwright-report' }],
    ['json', { outputFile: 'test-results/results.json' }],
    ['junit', { outputFile: 'test-results/junit.xml' }],
  ],
  
  outputDir: 'test-results/',
  
  projects: [
    // Desktop browsers
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
    
    // Mobile browsers
    {
      name: 'mobile-chrome',
      use: { ...devices['Pixel 5'] },
    },
    {
      name: 'mobile-safari',
      use: { ...devices['iPhone 12'] },
    },
    
    // Brand-specific projects (optional, for isolation)
    {
      name: 'cd-tests',
      testMatch: '**/tests/**/*.spec.ts',
      use: { 
        ...devices['Desktop Chrome'],
        extraHTTPHeaders: {
          'Brand-Context': 'CD'
        }
      },
    },
    {
      name: 'ls-tests', 
      testMatch: '**/tests/**/*.spec.ts',
      use: { 
        ...devices['Desktop Chrome'],
        extraHTTPHeaders: {
          'Brand-Context': 'LS'
        }
      },
    },
  ],
});
