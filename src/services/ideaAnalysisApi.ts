import { authApi } from './authApi';

const API_BASE_URL = 'http://192.168.1.111:8089';

// IMPORTANT: Always use authApi.getAccessToken() for authentication
// NEVER hardcode access tokens - they expire and change on each login

export interface UserProfile {
  full_name: string;
  official_email: string;
  current_role: string;
  current_industry: string;
  business_type: string;
  company_size: string;
  years_of_experience: number;
  funding_stage: string;
  company_website: string;
  linkedin_profile: string;
  country: string;
}

export interface IdeaDetails {
  idea_title: string;
  category: string;
  industry: string;
  domain: string;
  budget: string;
  timeline: string;
  location: string;
  scalability: string;
  validation: string;
  metrics: string;
}

export interface AnalysePayload {
  idea_id: string;
  user_profile: UserProfile;
  idea_details: IdeaDetails;
  meta: {
    submitted_on: string;
    version: string;
  };
}

// Dynamic interfaces - can handle any fields from API
export interface KeyPointsSummary {
  [key: string]: string | number | boolean | null | undefined;
}

export interface MarketAttributes {
  [key: string]: string | number | boolean | null | undefined;
}

// Dynamic interface for budget fit tiers
export interface BudgetFitTier {
  [key: string]: string | number | boolean | null | undefined;
}

export interface AIAnalysis {
  budget_fit_tiers_table: BudgetFitTier[];
  projection_if_other_tiers: {
    if_small: string;
    if_medium: string;
    if_large: string;
  };
  confidence_score: number;
}

export interface Reference {
  title: string;
  url: string;
  reason?: string;
}

export interface References {
  videos: Reference[];
  articles: Reference[];
  case_studies: Reference[];
  vendors: Reference[];
  success_stories: Reference[];
  failure_stories: Reference[];
}

export interface Verdict {
  text: string;
  sub_text: string;
  tip: string;
}

// Fully dynamic FinalOutput - can handle any fields from API
export interface FinalOutput {
  [key: string]: any; // Fully dynamic to handle any API changes
  idea_id?: string;
  key_points_summary?: KeyPointsSummary;
  market_attributes?: MarketAttributes;
  stats_summary?: any;
  population_access_table?: any[];
  budget_fit_tiers_table?: BudgetFitTier[];
  technology_development_strategy_table?: any[];
  gtm_customer_strategy_table?: any[];
  competitor_gap_table?: any[];
  market_product_fit_table?: any[];
  references?: References;
  verdict?: Verdict;
  legal_compliance_notes?: any;
  infrastructure_requirements?: any[];
}

export interface AnalyseResponse {
  idea_id: string;
  responses: {
    Claude: string;
    Gemini: string;
    'Judge(GPT-4)': string;
  };
  final_output: FinalOutput;
}

// Validation API Types
export interface ValidationQuestion {
  question_id: string;
  question: string;
  answer: string;
}

export interface ValidationQuestions {
  idea: ValidationQuestion[];
  persona: ValidationQuestion[];
  financial: ValidationQuestion[];
  network: ValidationQuestion[];
}

export interface ValidationPayload {
  idea_id: string;
  idea_detailed_description: string;
  industry_category: string;
  domain: string;
  confirmed_company_name: string;
  validation_questions: ValidationQuestions;
  meta: {
    submitted_on: string;
    version: string;
  };
}

export interface ValidationScores {
  idea: number;
  persona: number;
  financial: number;
  network: number;
  overall_score: number;
}

export interface QuestionScore {
  question_id: string;
  points: number;
  section: string;
}

export interface LearningRecommendation {
  category: string;
  recommendation: string;
  reference_link: string;
}

export interface AIFollowupQuestion {
  [key: string]: any; // Fully dynamic
  id?: string;
  question: string;
  options?: string[];
  category?: string;
  why_important?: string;
}

export interface PilotReadiness {
  criteria: string;
  status: string;
  evidence: string;
}

export interface RiskRegister {
  risk: string;
  likelihood: string;
  impact: string;
  mitigation: string;
}

export interface ValidationFinalOutput {
  idea_id: string;
  validation_scores: ValidationScores;
  confidence_scoring_rule: {
    A: number;
    B: number;
    C: number;
    max_score: number;
  };
  question_scoring_table: QuestionScore[];
  calculated_confidence_score1: number;
  learning_recommendations_table: LearningRecommendation[];
  ai_followup_questions: AIFollowupQuestion[];
  pilot_readiness_table: PilotReadiness[];
  risk_register_table: RiskRegister[];
  references: References;
}

export interface ValidationResponse {
  idea_id: string;
  final_output: ValidationFinalOutput;
  calculated_confidence_score1: number;
  question_scoring_table_calc: any[];
}

// Plan API Types
export interface PlanPayload {
  idea_id: string;
  ai_followup_questions: Array<{
    question: string;
    answer: string;
  }>;
  meta: {
    submitted_on: string;
    version: string;
  };
}

export interface PlanResponse {
  [key: string]: any; // Fully dynamic
  idea_id?: string;
  validation_scores?: any;
  learning_recommendations?: any[];
  business_plan?: {
    high_level_overview?: any[];
    templates?: any;
  };
  planner?: any;
  implementation?: any;
  outcomes?: any;
  meta?: any;
}

// User Ideas List Types
export interface UserIdeaItem {
  idea_id: string;
  analysis_data?: {
    validation_data?: {
      idea_id: string;
      idea_description?: string;
      verdict?: {
        text: string;
        sub_text?: string;
        tip?: string;
      };
      market_attributes?: MarketAttributes;
      key_points_summary?: KeyPointsSummary;
      [key: string]: any;
    };
    stage?: string;
    created_at?: string;
    updated_at?: string;
  };
  validation_data?: {
    validation_completed_data?: any;
    stage?: string;
    calculated_confidence_score?: string;
    created_at?: string;
    updated_at?: string;
  };
  plan_data?: {
    [key: string]: any;
    stage?: string;
    created_at?: string;
    updated_at?: string;
  };
}

class IdeaAnalysisApiService {
  /**
   * Analyze an idea using the /api/analyse endpoint
   */
  async analyseIdea(payload: AnalysePayload): Promise<AnalyseResponse> {
    const accessToken = authApi.getAccessToken();
    
    if (!accessToken) {
      console.error('[IdeaAnalysisAPI] No access token available');
      throw new Error('Authentication required. Please login.');
    }

    console.log('[IdeaAnalysisAPI] Sending analyse request:', {
      idea_id: payload.idea_id,
      idea_title: payload.idea_details.idea_title,
      user: payload.user_profile.full_name
    });

    try {
      const response = await authApi.fetchWithAuth(`${API_BASE_URL}/api/idea/analyze/`, {
        method: 'POST',
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        if (response.status === 401) {
          console.error('[IdeaAnalysisAPI] Unauthorized (401)');
          throw new Error('Unauthorized: Please re-authenticate and try again.');
        }
        const errorData = await response.json().catch(() => ({}));
        console.error('[IdeaAnalysisAPI] API error:', response.status, errorData);
        throw new Error(errorData.message || `API returned ${response.status}`);
      }

      const data: AnalyseResponse = await response.json();
      console.log('[IdeaAnalysisAPI] Analysis successful:', {
        idea_id: data.idea_id,
        confidence: data.final_output?.ai_analysis?.confidence_score
      });

      return data;
    } catch (error: any) {
      console.error('[IdeaAnalysisAPI] Error:', error);
      throw error;
    }
  }

  /**
   * Validate an idea using the /api/idea/validate endpoint
   */
  async validateIdea(payload: ValidationPayload): Promise<ValidationResponse> {
    const accessToken = authApi.getAccessToken();
    
    if (!accessToken) {
      console.error('[IdeaAnalysisAPI] No access token available');
      throw new Error('Authentication required. Please login.');
    }

    console.log('[IdeaAnalysisAPI] Sending validation request:', {
      idea_id: payload.idea_id,
      company_name: payload.confirmed_company_name
    });

    try {
      const response = await authApi.fetchWithAuth(`${API_BASE_URL}/api/idea/validate/`, {
        method: 'POST',
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        if (response.status === 401) {
          console.error('[IdeaAnalysisAPI] Validation Unauthorized (401)');
          throw new Error('Unauthorized: Please re-authenticate and try again.');
        }
        const errorData = await response.json().catch(() => ({}));
        console.error('[IdeaAnalysisAPI] Validation API error:', response.status, errorData);
        throw new Error(errorData.message || `API returned ${response.status}`);
      }

      const data: ValidationResponse = await response.json();
      console.log('[IdeaAnalysisAPI] Validation successful:', {
        idea_id: data.idea_id,
        confidence: data.final_output?.calculated_confidence_score1
      });

      return data;
    } catch (error: any) {
      console.error('[IdeaAnalysisAPI] Validation error:', error);
      throw error;
    }
  }

  /**
   * Get user profile from localStorage session
   */
  getUserProfileFromSession(): UserProfile {
    const sessionData = localStorage.getItem('executionPlannerSession');
    
    // Default profile
    const defaultProfile: UserProfile = {
      full_name: "User",
      official_email: "user@example.com",
      current_role: "Entrepreneur",
      current_industry: "Technology",
      business_type: "Startup",
      company_size: "1-10",
      years_of_experience: 5,
      funding_stage: "Bootstrapped",
      company_website: "",
      linkedin_profile: "",
      country: "India"
    };

    if (!sessionData) {
      return defaultProfile;
    }

    try {
      const session = JSON.parse(sessionData);
      
      if (session.userProfile) {
        return {
          full_name: session.userProfile.fullName || defaultProfile.full_name,
          official_email: session.user?.email || defaultProfile.official_email,
          current_role: session.userProfile.professionalTitle || defaultProfile.current_role,
          current_industry: session.userProfile.industry || defaultProfile.current_industry,
          business_type: session.userProfile.businessType || defaultProfile.business_type,
          company_size: session.userProfile.companySize || defaultProfile.company_size,
          years_of_experience: session.userProfile.yearsOfExperience || defaultProfile.years_of_experience,
          funding_stage: session.userProfile.fundingStage || defaultProfile.funding_stage,
          company_website: defaultProfile.company_website,
          linkedin_profile: defaultProfile.linkedin_profile,
          country: defaultProfile.country
        };
      }

      return defaultProfile;
    } catch (error) {
      console.error('[IdeaAnalysisAPI] Error parsing session data:', error);
      return defaultProfile;
    }
  }

  /**
   * Create a payload for the analyse API
   */
  createAnalysePayload(
    ideaTitle: string,
    ideaDetails: Partial<IdeaDetails>,
    ideaId: string = ''
  ): AnalysePayload {
    const userProfile = this.getUserProfileFromSession();

    return {
      idea_id: ideaId,
      user_profile: userProfile,
      idea_details: {
        idea_title: ideaTitle,
        category: ideaDetails.category || '',
        industry: ideaDetails.industry || '',
        domain: ideaDetails.domain || '',
        budget: ideaDetails.budget || '',
        timeline: ideaDetails.timeline || '',
        location: ideaDetails.location || '',
        scalability: ideaDetails.scalability || '',
        validation: ideaDetails.validation || '',
        metrics: ideaDetails.metrics || ''
      },
      meta: {
        submitted_on: new Date().toISOString(),
        version: '1.0'
      }
    };
  }

  /**
   * Submit AI follow-up questions and get business plan
   */
  async submitPlan(payload: PlanPayload): Promise<PlanResponse> {
    const accessToken = authApi.getAccessToken();
    
    if (!accessToken) {
      console.error('[IdeaAnalysisAPI] No access token available');
      throw new Error('Authentication required. Please login.');
    }

    console.log('[IdeaAnalysisAPI] Submitting plan request:', {
      idea_id: payload.idea_id,
      questions_count: payload.ai_followup_questions.length
    });

    try {
      const response = await authApi.fetchWithAuth(`${API_BASE_URL}/api/idea/plan/`, {
        method: 'POST',
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        if (response.status === 401) {
          console.error('[IdeaAnalysisAPI] Unauthorized (401)');
          throw new Error('Unauthorized: Please re-authenticate and try again.');
        }
        const errorData = await response.json().catch(() => ({}));
        console.error('[IdeaAnalysisAPI] API error:', response.status, errorData);
        throw new Error(errorData.message || `API returned ${response.status}`);
      }

      const data: PlanResponse = await response.json();
      console.log('[IdeaAnalysisAPI] Plan submission successful:', {
        idea_id: data.idea_id
      });

      return data;
    } catch (error) {
      console.error('[IdeaAnalysisAPI] Error submitting plan:', error);
      throw error;
    }
  }

  /**
   * Get all ideas for the logged-in user
   */
  async getUserIdeas(): Promise<UserIdeaItem[]> {
    const accessToken = authApi.getAccessToken();
    
    if (!accessToken) {
      console.error('[IdeaAnalysisAPI] No access token available');
      throw new Error('Authentication required. Please login.');
    }

    console.log('[IdeaAnalysisAPI] Fetching user ideas...');

    try {
      const response = await authApi.fetchWithAuth(`${API_BASE_URL}/idea/user/`, {
        method: 'GET',
      });

      if (!response.ok) {
        if (response.status === 401) {
          console.error('[IdeaAnalysisAPI] Unauthorized (401)');
          throw new Error('Unauthorized: Please re-authenticate and try again.');
        }
        const errorData = await response.json().catch(() => ({}));
        console.error('[IdeaAnalysisAPI] API error:', response.status, errorData);
        throw new Error(errorData.message || `API returned ${response.status}`);
      }

      const data: UserIdeaItem[] = await response.json();
      console.log('[IdeaAnalysisAPI] User ideas fetched successfully:', data.length, 'ideas');

      return data;
    } catch (error) {
      console.error('[IdeaAnalysisAPI] Error fetching user ideas:', error);
      throw error;
    }
  }
}

export const ideaAnalysisApi = new IdeaAnalysisApiService();
