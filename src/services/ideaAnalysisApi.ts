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

export interface KeyPointsSummary {
  core_concept: string;
  target_market: string;
  unique_value_proposition: string;
  revenue_model: string;
  competitive_advantage: string;
  growth_potential: string;
  implementation_timeline: string;
}

export interface MarketAttributes {
  category: string;
  domain: string;
  industry: string;
  budget: string;
  location: string;
  timeline: string;
  scalability: string;
  validation: string;
  metrics: string;
}

export interface BudgetFitTier {
  tier: string;
  cap: string;
  fit: string;
  approach: string;
  scope: string;
  team: string;
  infra: string;
  compliance: string;
  metrics: string;
  risks: string;
  notes: string;
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

export interface FinalOutput {
  policy_guard: string;
  idea_id: string;
  key_points_summary: KeyPointsSummary;
  market_attributes: MarketAttributes;
  stats_summary: any;
  population_access_table: any[];
  budget_fit_tiers_table: BudgetFitTier[];
  ai_analysis: AIAnalysis;
  budget_plan: any;
  technology_development_strategy_table: any[];
  gtm_customer_strategy_table: any[];
  competitor_gap_table: any[];
  market_product_fit_table: any[];
  references: References;
  verdict: Verdict;
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
  question: string;
  options: string[];
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
      const response = await fetch(`${API_BASE_URL}/api/idea/analyze/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
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
      const response = await fetch(`${API_BASE_URL}/api/idea/validate/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
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
}

export const ideaAnalysisApi = new IdeaAnalysisApiService();
