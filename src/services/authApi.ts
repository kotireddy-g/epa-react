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

export interface ApiResponse<T = any> {
  status?: string;
  message?: string;
  data?: T;
}

class AuthApiService {
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

  async login(loginData: LoginData): Promise<ApiResponse> {
    return this.request<ApiResponse>('/login/', {
      method: 'POST',
      body: JSON.stringify(loginData),
    });
  }
}

export const authApi = new AuthApiService();
