const API_BASE_URL = 'http://localhost:3001/api';

export interface Idea {
  id: string;
  summary: string;
  description: string;
  bulletPoints: string[];
  status: 'draft' | 'validated' | 'planning' | 'implementing' | 'active';
  companyName?: string;
  createdAt: Date;
  updatedAt?: Date;
  isActive: boolean;
  validationData?: any;
  validationScore?: number;
  businessPlan?: any;
}

export interface ValidationData {
  ideaId: string;
  validationData: any;
  score: number;
}

export interface BusinessPlan {
  ideaId: string;
  templateId: string;
  sections: any;
  tasks: any;
}

export interface ImplementationItem {
  ideaId: string;
  itemType: string;
  name: string;
  owner?: string;
  startDate?: string;
  endDate?: string;
  completionPercentage?: number;
  status?: 'not-started' | 'in-progress' | 'completed' | 'blocked';
}

class ApiService {
  private async request<T>(
    endpoint: string, 
    options?: RequestInit
  ): Promise<T> {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      ...options,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Request failed' }));
      throw new Error(error.error || `HTTP ${response.status}`);
    }

    return response.json();
  }

  async getIdeas(): Promise<Idea[]> {
    return this.request<Idea[]>('/ideas');
  }

  async getIdea(id: string): Promise<Idea> {
    return this.request<Idea>(`/ideas/${id}`);
  }

  async createIdea(idea: Partial<Idea>): Promise<Idea> {
    return this.request<Idea>('/ideas', {
      method: 'POST',
      body: JSON.stringify(idea),
    });
  }

  async updateIdea(id: string, idea: Partial<Idea>): Promise<Idea> {
    return this.request<Idea>(`/ideas/${id}`, {
      method: 'PUT',
      body: JSON.stringify(idea),
    });
  }

  async saveValidation(validation: ValidationData): Promise<any> {
    return this.request('/validations', {
      method: 'POST',
      body: JSON.stringify(validation),
    });
  }

  async saveBusinessPlan(businessPlan: BusinessPlan): Promise<any> {
    return this.request('/business-plans', {
      method: 'POST',
      body: JSON.stringify(businessPlan),
    });
  }

  async saveImplementationItem(item: ImplementationItem): Promise<any> {
    return this.request('/implementation-items', {
      method: 'POST',
      body: JSON.stringify(item),
    });
  }

  async getImplementationItems(ideaId: string): Promise<any[]> {
    return this.request(`/implementation-items/${ideaId}`);
  }

  async checkHealth(): Promise<{ status: string; message: string }> {
    return this.request('/health');
  }
}

export const apiService = new ApiService();
