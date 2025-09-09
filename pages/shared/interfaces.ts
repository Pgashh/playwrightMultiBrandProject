import { TestUser } from '../../config/testData';

// Page object interfaces
export interface ILoginPage {
  goto(market?: string): Promise<void>;
  login(email: string, password: string): Promise<void>;
  waitForSuccessfulLogin(market?: string): Promise<void>;
  getErrorMessage(): Promise<string>;
  isLoginFormVisible(): Promise<boolean>;
}

export interface IHomePage {
  goto(market?: string): Promise<void>;
  isLoaded(): Promise<boolean>;
  getWelcomeMessage(): Promise<string>;
  navigateToLogin(): Promise<void>;
  navigateToSignUp(): Promise<void>;
}

export interface IAccountPage {
  goto(market?: string): Promise<void>;
  isLoaded(): Promise<boolean>;
  getAccountInfo(): Promise<AccountInfo>;
  updateProfile(profileData: ProfileData): Promise<void>;
  changePassword(oldPassword: string, newPassword: string): Promise<void>;
}

// Data interfaces
export interface AccountInfo {
  email: string;
  firstName?: string;
  lastName?: string;
  country?: string;
  currency?: string;
}

export interface ProfileData {
  firstName?: string;
  lastName?: string;
  phone?: string;
  dateOfBirth?: string;
  address?: string;
}

// Brand configuration interface
export interface BrandConfig {
  brand: string;
  market: string;
  environment: string;
  baseUrl: string;
}
