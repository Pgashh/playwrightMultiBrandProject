// pages/universal/locators/loginLocators.ts

/**
 * Universal Locators - Adapts selectors based on brand/market
 * This approach eliminates the need for separate locator files per brand
 */
export class LoginLocators {
  constructor(
    private brand: string, 
    private market: string
  ) {}

  getLoginForm(): string {
    // Common patterns with fallbacks
    const patterns = [
      '[data-testid="login-form"]',
      '#loginForm',
      '.login-form',
      'form[action*="login"]',
      'form[name="login"]'
    ];
    
    return this.getBrandSpecificSelector('loginForm', patterns);
  }

  getEmailInput(): string {
    const patterns = [
      '[data-testid="email-input"]',
      '#email',
      'input[name="email"]',
      'input[type="email"]',
      'input[placeholder*="email" i]',
      'input[placeholder*="e-mail" i]'
    ];
    
    return this.getBrandSpecificSelector('emailInput', patterns);
  }

  getPasswordInput(): string {
    const patterns = [
      '[data-testid="password-input"]',
      '#password',
      'input[name="password"]',
      'input[type="password"]'
    ];
    
    return this.getBrandSpecificSelector('passwordInput', patterns);
  }

  getSubmitButton(): string {
    const patterns = [
      '[data-testid="login-submit"]',
      'button[type="submit"]',
      'input[type="submit"]',
      '.login-submit',
      'button:has-text("Log")',  // Matches "Log in", "Login", "Log In"
      this.getLocalizedSubmitText()
    ];
    
    return this.getBrandSpecificSelector('submitButton', patterns);
  }

  getLoginTrigger(): string {
    const patterns = [
      '[data-testid="login-trigger"]',
      'a[href*="login"]',
      '.login-trigger',
      '.login-button',
      'button:has-text("Log")',
      this.getLocalizedLoginTriggerText()
    ];
    
    return this.getBrandSpecificSelector('loginTrigger', patterns);
  }

  getErrorMessage(): string {
    const patterns = [
      '[data-testid="error-message"]',
      '.error-message',
      '.login-error',
      '.alert-danger',
      '.error',
      '[role="alert"]'
    ];
    
    return this.getBrandSpecificSelector('errorMessage', patterns);
  }

  getSuccessIndicator(): string {
    const patterns = [
      '[data-testid="login-success"]',
      '.welcome-message',
      '.user-menu',
      '.logout-button',
      '.my-account',
      this.getLocalizedWelcomeText()
    ];
    
    return this.getBrandSpecificSelector('successIndicator', patterns);
  }

  private getBrandSpecificSelector(element: string, fallbackPatterns: string[]): string {
    // Brand-specific overrides
    const brandOverrides = this.getBrandOverrides();
    
    if (brandOverrides[element]) {
      return brandOverrides[element];
    }

    // Try patterns in order, return first one
    return fallbackPatterns.join(', ');
  }

  private getBrandOverrides(): Record<string, string> {
    const overrides: Record<string, Record<string, string>> = {
      'BRAND1': {
        loginForm: '#brand1-login-form, .brand1-login',
        emailInput: '#brand1-email, input[name="brand1_email"]',
        submitButton: '.brand1-login-btn'
      },
      'BRAND2': {
        loginForm: '#brand2-login-modal, .brand2-login',
        submitButton: '.brand2-login-btn, button.brand2-submit',
        emailInput: '#brand2-email-field'
      },
      'BRAND3': {
        loginForm: '.brand3-auth-form',
        emailInput: '#brand3-email',
        passwordInput: '#brand3-password'
      }
    };

    return overrides[this.brand] || {};
  }

  private getLocalizedSubmitText(): string {
    const submitTexts: Record<string, string> = {
      'en': 'button:has-text("Login"), button:has-text("Sign In"), button:has-text("Log In")',
      'es': 'button:has-text("Iniciar"), button:has-text("Entrar")',
      'fr': 'button:has-text("Connexion"), button:has-text("Se connecter")',
      'de': 'button:has-text("Anmelden"), button:has-text("Einloggen")'
    };

    return submitTexts[this.market] || submitTexts['en'];
  }

  private getLocalizedLoginTriggerText(): string {
    const triggerTexts: Record<string, string> = {
      'en': 'a:has-text("Login"), a:has-text("Sign In"), button:has-text("Login")',
      'es': 'a:has-text("Iniciar"), a:has-text("Entrar")',
      'fr': 'a:has-text("Connexion"), a:has-text("Se connecter")',
      'de': 'a:has-text("Anmelden"), a:has-text("Einloggen")'
    };

    return triggerTexts[this.market] || triggerTexts['en'];
  }

  private getLocalizedWelcomeText(): string {
    const welcomeTexts: Record<string, string> = {
      'en': ':has-text("Welcome"), :has-text("Hello"), :has-text("My Account")',
      'es': ':has-text("Bienvenido"), :has-text("Hola"), :has-text("Mi Cuenta")',
      'fr': ':has-text("Bienvenue"), :has-text("Bonjour"), :has-text("Mon compte")',
      'de': ':has-text("Willkommen"), :has-text("Hallo"), :has-text("Mein Konto")'
    };

    return welcomeTexts[this.market] || welcomeTexts['en'];
  }
}
