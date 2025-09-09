export interface BrandEnvironments {
  [brand: string]: {
    staging: string;
    prelive: string;
    production: string;
  };
}

export const BRAND_ENVIRONMENTS: BrandEnvironments = {
  BRAND1: {
    staging: "https://brand1-staging.example.com",
    prelive: "https://brand1-prelive.example.com",
    production: "https://brand1.com",
  },
  BRAND2: {
    staging: "https://brand2-staging.example.com",
    prelive: "https://brand2-prelive.example.com",
    production: "https://brand2.com",
  },
  BRAND3: {
    staging: "https://brand3-staging.example.com",
    prelive: "https://brand3-prelive.example.com",
    production: "https://brand3.com",
  },
};

export function getEnvironmentUrl(brand: string, environment: string): string {
  const brandKey = brand.toUpperCase();
  const envKey = environment.toLowerCase() as keyof BrandEnvironments[string];

  if (!BRAND_ENVIRONMENTS[brandKey]) {
    throw new Error(
      `Unknown brand: ${brand}. Available brands: ${Object.keys(
        BRAND_ENVIRONMENTS
      ).join(", ")}`
    );
  }

  if (!BRAND_ENVIRONMENTS[brandKey][envKey]) {
    throw new Error(
      `Unknown environment: ${environment}. Available environments: staging, prelive, production`
    );
  }

  return BRAND_ENVIRONMENTS[brandKey][envKey];
}
