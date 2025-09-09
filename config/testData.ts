export interface TestUser {
  email: string;
  password: string;
  country?: string;
  currency?: string;
  phone?: string;
}

export interface BrandTestData {
  [brand: string]: {
    [market: string]: {
      validUser: TestUser;
      invalidUser: TestUser;
      weakPasswordUser: TestUser;
    };
  };
}

export const BRAND_TEST_DATA: BrandTestData = {
  BRAND1: {
    en: {
      validUser: {
        email: 'brand1-test@example.com',
        password: 'TestPass123!',
        country: 'Canada',
        currency: 'CAD'
      },
      invalidUser: {
        email: 'invalid@example.com',
        password: 'wrongpassword'
      },
      weakPasswordUser: {
        email: 'weak@example.com',
        password: '123456'
      }
    },
    es: {
      validUser: {
        email: 'brand1-es@example.com',
        password: 'TestPass123!',
        country: 'Spain',
        currency: 'EUR'
      },
      invalidUser: {
        email: 'invalid@example.com',
        password: 'wrongpassword'
      },
      weakPasswordUser: {
        email: 'weak@example.com',
        password: '123456'
      }
    }
  },
  BRAND2: {
    en: {
      validUser: {
        email: 'brand2-test@example.com',
        password: 'TestPass123!',
        country: 'Canada',
        currency: 'CAD'
      },
      invalidUser: {
        email: 'invalid@example.com',
        password: 'wrongpassword'
      },
      weakPasswordUser: {
        email: 'weak@example.com',
        password: '123456'
      }
    },
    fr: {
      validUser: {
        email: 'brand2-fr@example.com',
        password: 'TestPass123!',
        country: 'France',
        currency: 'EUR'
      },
      invalidUser: {
        email: 'invalid@example.com',
        password: 'wrongpassword'
      },
      weakPasswordUser: {
        email: 'weak@example.com',
        password: '123456'
      }
    }
  },
  BRAND3: {
    en: {
      validUser: {
        email: 'brand3-test@example.com',
        password: 'TestPass123!',
        country: 'United States',
        currency: 'USD'
      },
      invalidUser: {
        email: 'invalid@example.com',
        password: 'wrongpassword'
      },
      weakPasswordUser: {
        email: 'weak@example.com',
        password: '123456'
      }
    }
  }
};

export class TestDataGenerator {
  static getTestUser(brand: string, market: string, userType: 'valid' | 'invalid' | 'weakPassword'): TestUser {
    const brandKey = brand.toUpperCase();
    const marketKey = market.toLowerCase();
    
    if (!BRAND_TEST_DATA[brandKey]) {
      throw new Error(`No test data available for brand: ${brand}. Available brands: ${Object.keys(BRAND_TEST_DATA).join(', ')}`);
    }
    
    if (!BRAND_TEST_DATA[brandKey][marketKey]) {
      throw new Error(`No test data available for brand: ${brand}, market: ${market}. Available markets: ${Object.keys(BRAND_TEST_DATA[brandKey]).join(', ')}`);
    }
    
    const userKey = userType === 'valid' ? 'validUser' : 
                   userType === 'invalid' ? 'invalidUser' : 'weakPasswordUser';
    
    return BRAND_TEST_DATA[brandKey][marketKey][userKey];
  }
  
  static getAllMarkets(brand: string): string[] {
    const brandKey = brand.toUpperCase();
    if (!BRAND_TEST_DATA[brandKey]) {
      throw new Error(`No test data available for brand: ${brand}`);
    }
    
    return Object.keys(BRAND_TEST_DATA[brandKey]);
  }
  
  static getAllBrands(): string[] {
    return Object.keys(BRAND_TEST_DATA);
  }
}
