// pages/universal/locators/accountLocators.ts
export class AccountLocators {
  constructor(private brand: string, private market: string) {}

  getAccountMenu(): string {
    return this.getBrandSpecificSelector('accountMenu', [
      '[data-testid="account-menu"]',
      '.account-menu',
      '.user-menu',
      '.my-account-menu'
    ]);
  }

  getProfileSection(): string {
    return this.getBrandSpecificSelector('profileSection', [
      '[data-testid="profile-section"]',
      '.profile-section',
      '.account-profile',
      '.user-profile'
    ]);
  }

  getBalanceDisplay(): string {
    return this.getBrandSpecificSelector('balanceDisplay', [
      '[data-testid="balance"]',
      '.balance',
      '.account-balance',
      '.user-balance'
    ]);
  }

  getLogoutButton(): string {
    return this.getBrandSpecificSelector('logoutButton', [
      '[data-testid="logout-button"]',
      '.logout-btn',
      'a[href*="logout"]',
      this.getLocalizedLogoutText()
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
        accountMenu: '.cd-account-menu',
        balanceDisplay: '.cd-balance'
      },
      'LS': {
        accountMenu: '.ls-user-menu',
        balanceDisplay: '.ls-balance'
      }
    };

    return overrides[this.brand] || {};
  }

  private getLocalizedLogoutText(): string {
    const logoutTexts: Record<string, string> = {
      'en': 'a:has-text("Logout"), a:has-text("Sign Out")',
      'fi': 'a:has-text("Kirjaudu ulos")',
      'ca': 'a:has-text("Déconnexion")',
      'no': 'a:has-text("Logg ut")'
    };

    return logoutTexts[this.market] || logoutTexts['en'];
  }
}
