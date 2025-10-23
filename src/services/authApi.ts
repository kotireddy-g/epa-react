const API_BASE_URL = 'http://192.168.1.111:8089/accounts';

export interface RegisterData {
  email: string;
  password: string;
  confirm_password: string;
  first_name: string;
  last_name: string;
  phone_number: string;
  linkedin_profile: string;
  profile: {
    fullname: string;
    date_of_birth: string;
    gender: string;
    professional_title: string;
    company: string;
    industry: string;
    years_of_experience: number;
    businessType: string;
    companySize: string;
    fundingStage: string;
    location: string;
  };
}

export interface LoginData {
  username: string;
  password: string;
}

export interface VerifyEmailData {
  email: string;
  otp_code: string;
}

export interface ResendOTPData {
  email: string;
}

export interface LinkedInLoginResponse {
  success: boolean;
  code: string;
}

export interface VerifyLinkedInData {
  email: string;
  linkedin_profile: string;
  code: string;
}

export interface UserProfile {
  fullname: string;
  date_of_birth: string;
  gender: string;
  professional_title: string;
  company: string;
  industry: string;
  years_of_experience: number;
  businessType: string;
  companySize: string;
  fundingStage: string;
  location: string;
}

export interface UserAccount {
  id: number;
  phone_number: string;
  email_verified: boolean;
  linkedin_verified: boolean;
  github_verified: boolean;
  verification_score: number;
  is_genuine_user: boolean;
  account_status: string;
  linkedin_profile: string | null;
  github_profile: string | null;
  profile: UserProfile;
}

export interface User {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  is_active: boolean;
  date_joined: string;
  last_login: string | null;
  user_account: UserAccount;
}

export interface AuthTokens {
  refresh: string;
  access: string;
}

export interface LoginResponse {
  status: string;
  message: string;
  data: {
    user: User;
    tokens: AuthTokens;
  };
}

export interface ApiResponse<T = any> {
  status?: string;
  message?: string;
  data?: T;
}

class AuthApiService {
  private accessToken: string | null = null;
  private refreshToken: string | null = null;

  private async request<T>(
    endpoint: string,
    options?: RequestInit
  ): Promise<T> {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        headers: {
          'Content-Type': 'application/json',
          ...options?.headers,
        },
        ...options,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || `HTTP ${response.status}`);
      }

      return data;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Network request failed');
    }
  }

  async register(registerData: RegisterData): Promise<ApiResponse> {
    return this.request<ApiResponse>('/register/', {
      method: 'POST',
      body: JSON.stringify(registerData),
    });
  }

  async verifyEmail(verifyData: VerifyEmailData): Promise<ApiResponse> {
    return this.request<ApiResponse>('/verify-email/', {
      method: 'POST',
      body: JSON.stringify(verifyData),
    });
  }

  async resendOTP(resendData: ResendOTPData): Promise<ApiResponse> {
    return this.request<ApiResponse>('/resend-otp/', {
      method: 'POST',
      body: JSON.stringify(resendData),
    });
  }

  async linkedInLogin(): Promise<LinkedInLoginResponse> {
    return this.request<LinkedInLoginResponse>('/linkedin/login/', {
      method: 'POST',
    });
  }

  async verifyLinkedIn(verifyData: VerifyLinkedInData): Promise<ApiResponse> {
    return this.request<ApiResponse>('/verify-linkedin/', {
      method: 'POST',
      body: JSON.stringify(verifyData),
    });
  }

  async login(loginData: LoginData): Promise<LoginResponse> {
    try {
      // Clear any existing tokens before login
      console.log('[AuthAPI] Clearing old tokens before login...');
      this.logout();
      
      const response = await fetch(`${API_BASE_URL}/login/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(loginData),
      });

      const data = await response.json();

      if (data.status === 'Error') {
        throw new Error(data.message || 'Login failed');
      }

      if (data.status === 'Success' && data.data) {
        this.accessToken = data.data.tokens.access;
        this.refreshToken = data.data.tokens.refresh;
        console.log('[AuthAPI] New tokens set:', {
          access: this.accessToken?.substring(0, 20) + '...',
          refresh: this.refreshToken?.substring(0, 20) + '...'
        });
        this.saveToLocalStorage(data);
      }

      return data;
    } catch (error: any) {
      if (error.message) {
        throw error;
      }
      throw new Error('Network error. Please check your connection.');
    }
  }

  private saveToLocalStorage(loginResponse: LoginResponse) {
    const profile = loginResponse.data.user.user_account.profile;
    const sessionData = {
      isAuthenticated: true,
      user: loginResponse.data.user,
      tokens: loginResponse.data.tokens,
      userProfile: {
        // Basic Info
        fullName: profile.fullname,
        email: loginResponse.data.user.email,
        
        // Professional Details
        currentRole: profile.professional_title,
        professionalTitle: profile.professional_title,
        company: profile.company,
        currentIndustry: profile.industry,
        industry: profile.industry,
        yearsOfExperience: profile.years_of_experience,
        
        // Business Details
        businessType: profile.businessType,
        companySize: profile.companySize,
        fundingStage: profile.fundingStage,
        
        // Location & Links
        address: profile.location || '',
        location: profile.location || '',
        linkedinProfile: loginResponse.data.user.user_account.linkedin_profile || '',
        companyLink: profile.company || '',
        
        // Additional fields
        dateOfBirth: profile.date_of_birth,
        gender: profile.gender,
        
        // Verification status
        emailVerified: loginResponse.data.user.user_account.email_verified,
        linkedinVerified: loginResponse.data.user.user_account.linkedin_verified,
      },
      isProfileComplete: true,
    };

    localStorage.setItem('executionPlannerSession', JSON.stringify(sessionData));
  }

  getAccessToken(): string | null {
    if (this.accessToken) {
      console.log('[AuthAPI] Returning cached token:', this.accessToken.substring(0, 20) + '...');
      return this.accessToken;
    }

    const sessionData = localStorage.getItem('executionPlannerSession');
    if (sessionData) {
      try {
        const session = JSON.parse(sessionData);
        this.accessToken = session.tokens?.access || null;
        this.refreshToken = session.tokens?.refresh || null;
        console.log('[AuthAPI] Loaded token from localStorage:', this.accessToken?.substring(0, 20) + '...');
        return this.accessToken;
      } catch {
        return null;
      }
    }

    console.log('[AuthAPI] No token found');
    return null;
  }

  getRefreshToken(): string | null {
    if (this.refreshToken) {
      return this.refreshToken;
    }

    const sessionData = localStorage.getItem('executionPlannerSession');
    if (sessionData) {
      try {
        const session = JSON.parse(sessionData);
        this.refreshToken = session.tokens?.refresh || null;
        return this.refreshToken;
      } catch {
        return null;
      }
    }

    return null;
  }

  logout() {
    console.log('[AuthAPI] Logout called - clearing tokens');
    this.accessToken = null;
    this.refreshToken = null;
    localStorage.removeItem('executionPlannerSession');
  }

  getStoredUser(): User | null {
    const sessionData = localStorage.getItem('executionPlannerSession');
    if (sessionData) {
      try {
        const session = JSON.parse(sessionData);
        return session.user || null;
      } catch {
        return null;
      }
    }
    return null;
  }

  async updateProfile(userId: number, profileData: UserProfile): Promise<ApiResponse> {
    const token = this.getAccessToken();
    return this.request<ApiResponse>(`/profile/${userId}/`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ profile: profileData }),
    });
  }

  isAuthenticated(): boolean {
    return this.getAccessToken() !== null;
  }
}

export const authApi = new AuthApiService();
