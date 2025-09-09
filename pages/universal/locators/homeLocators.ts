// pages/universal/locators/homeLocators.ts
export class HomeLocators {
  constructor(private brand: string, private market: string) {}

  getMainNavigation(): string {
    return this.getBrandSpecificSelector('mainNav', [
      '[data-testid="main-navigation"]',
      '.main-nav',
      '.navbar',
      'nav[role="navigation"]',
      'header nav'
    ]);
  }

  getLoginButton(): string {
    return this.getBrandSpecificSelector('loginButton', [
      '[data-testid="login-button"]',
      '.login-btn',
      'a[href*="login"]',
      this.getLocalizedLoginText()
    ]);
  }

  getSignUpButton(): string {
    return this.getBrandSpecificSelector('signUpButton', [
      '[data-testid="signup-button"]',
      '.signup-btn',
      '.register-btn',
      'a[href*="register"]',
      'a[href*="signup"]',
      this.getLocalizedSignUpText()
    ]);
  }

  getWelcomeMessage(): string {
    return this.getBrandSpecificSelector('welcomeMessage', [
      '[data-testid="welcome-message"]',
      '.welcome-message',
      '.hero-title',
      'h1',
      '.main-heading'
    ]);
  }

  private getBrandSpecificSelector(element: string, fallbackPatterns: string[]): string {
    const brandOverrides = this.getBrandOverrides();
    
    if (brandOverrides[element]) {
      return brandOverrides[element];
    }

    return fallbackPatterns.join(', ');
  }

  private getBrandOverrides(): Record<string, string> {
    const overrides: Record<string, Record<string, string>> = {
      'CD': {
        mainNav: '.casino-days-nav, #cd-navigation',
        welcomeMessage: '.cd-hero-title, .casino-days-welcome'
      },
      'LS': {
        mainNav: '.lucky-spins-nav',
        welcomeMessage: '.ls-hero, .lucky-welcome'
      }
    };

    return overrides[this.brand] || {};
  }

  private getLocalizedLoginText(): string {
    const loginTexts: Record<string, string> = {
      'en': 'a:has-text("Login"), a:has-text("Sign In")',
      'fi': 'a:has-text("Kirjaudu")',
      'ca': 'a:has-text("Connexion")',
      'no': 'a:has-text("Logg inn")'
    };

    return loginTexts[this.market] || loginTexts['en'];
  }

  private getLocalizedSignUpText(): string {
    const signUpTexts: Record<string, string> = {
      'en': 'a:has-text("Sign Up"), a:has-text("Register"), a:has-text("Join")',
      'fi': 'a:has-text("Rekisteröidy"), a:has-text("Liity")',
      'ca': 'a:has-text("Inscription"), a:has-text("Rejoindre")',
      'no': 'a:has-text("Registrer"), a:has-text("Bli medlem")'
    };

    return signUpTexts[this.market] || signUpTexts['en'];
  }
}
