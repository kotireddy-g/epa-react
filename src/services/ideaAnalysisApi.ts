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

export interface ScaleDetails {
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

export interface IdeaDetails {
  idea_title: string;
  large_scale: ScaleDetails;
  medium_scale: ScaleDetails;
  small_scale: ScaleDetails;
}

export interface IndustryDomainCategory {
  Industry: string;
  Domain: string;
  Subcategories: string[];
}

export interface VideoFeedItem {
  title: string;
  author: string;
  link: string;
}

export interface VideoFeedResponse {
  ok: boolean;
  params?: Record<string, any>;
  counts?: Record<string, number>;
  sections?: Record<string, VideoFeedItem[]>;
  items?: VideoFeedItem[];
  error?: string; // Error message when ok is false
}

export interface ClarifyPayload {
  idea_id: string;
  idea: {
    title: string;
    description: string;
    industry: string;
    target_location: string;
    business_model: string;
  };
}

export interface FollowUpQuestion {
  id: string;
  label: string;
  type: 'multiple_choice' | 'long_text' | 'short_text';
  required: boolean;
  options?: string[];
  placeholder?: string;
  help?: string;
  validation?: {
    min_len?: number;
    max_len?: number;
  };
}

export interface ClarifyResponse {
  status?: string; // Can be 'success', 'need_idea', or any other status
  message?: string;
  examples?: string[];
  template?: string;
  next_action?: string;
  questions?: FollowUpQuestion[];
  model?: string;
  error?: string; // Additional error field for other error types
  [key: string]: any; // Allow any additional fields from API
}

export interface GuardIdeaPayload {
  idea: string;
}

export interface GuardIdeaResponse {
  ok: boolean;
  idea_normalized?: string;
  error?: string;
  examples?: string[];
}

export interface ValidateAnswersPayload {
  questions: FollowUpQuestion[];
  answers: Record<string, string>;
}

export interface AnswerIssue {
  id: string;
  msg: string;
}

export interface ValidateAnswersResponse {
  ok: boolean;
  cleaned_answers?: Record<string, string>;
  issues?: AnswerIssue[];
}

// Interfaces for insert APIs (data persistence)
export interface InsertAnalysisDataPayload {
  userId: number;
  stage: 'Analysis';
  idea_id: string;
  final_output: any;
  live_references?: any;
}

export interface InsertValidationDataPayload {
  userId: number;
  stage: 'Validation';
  idea_id: string;
  final_output: any;
  live_references?: any;
}

export interface InsertPlanDataPayload {
  userId: number;
  stage: 'Implementation';
  idea_id: string;
  final_output: any;
  live_references?: any;
}

export interface InsertDataResponse {
  success: boolean;
  message?: string;
  error?: string;
}

export interface ClarifiedFollowUp {
  question_id: string;
  question: string;
  answer: string;
}

export interface AnalysePayload {
  idea_id: string;
  user_profile: UserProfile;
  idea_details: IdeaDetails;
  clarified_followups?: ClarifiedFollowUp[];
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
  label?: string;
  text?: string;
  rationale?: string;
  sub_text?: string;
  tip?: string;
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
  live_references?: any; // References from LLM (videos, articles, etc.)
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
  live_references?: any; // References from LLM (videos, articles, etc.)
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
  final_output?: any; // Complete plan output
  live_references?: any; // References from LLM (videos, articles, etc.)
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
    category: string,
    industry: string,
    ideaId: string = '',
    clarifiedFollowups?: ClarifiedFollowUp[]
  ): AnalysePayload {
    const userProfile = this.getUserProfileFromSession();

    // Create empty scale details with category and industry
    const emptyScaleDetails: ScaleDetails = {
      category,
      industry,
      domain: '',
      budget: '',
      timeline: '',
      location: '',
      scalability: '',
      validation: '',
      metrics: ''
    };

    const payload: AnalysePayload = {
      idea_id: ideaId,
      user_profile: userProfile,
      idea_details: {
        idea_title: ideaTitle,
        large_scale: { ...emptyScaleDetails },
        medium_scale: { ...emptyScaleDetails },
        small_scale: { ...emptyScaleDetails }
      },
      meta: {
        submitted_on: new Date().toISOString(),
        version: '1.0'
      }
    };

    // Add clarified_followups if provided
    if (clarifiedFollowups && clarifiedFollowups.length > 0) {
      payload.clarified_followups = clarifiedFollowups;
    }

    return payload;
  }

  /**
   * Create a payload for re-analysis with updated market attributes
   */
  createReAnalysePayload(
    ideaTitle: string,
    category: string,
    industry: string,
    largeScale: Partial<ScaleDetails>,
    mediumScale: Partial<ScaleDetails>,
    smallScale: Partial<ScaleDetails>,
    ideaId: string = ''
  ): AnalysePayload {
    const userProfile = this.getUserProfileFromSession();

    const createScaleDetails = (scale: Partial<ScaleDetails>): ScaleDetails => ({
      category,
      industry,
      domain: scale.domain || '',
      budget: scale.budget || '',
      timeline: scale.timeline || '',
      location: scale.location || '',
      scalability: scale.scalability || '',
      validation: scale.validation || '',
      metrics: scale.metrics || ''
    });

    return {
      idea_id: ideaId,
      user_profile: userProfile,
      idea_details: {
        idea_title: ideaTitle,
        large_scale: createScaleDetails(largeScale),
        medium_scale: createScaleDetails(mediumScale),
        small_scale: createScaleDetails(smallScale)
      },
      meta: {
        submitted_on: new Date().toISOString(),
        version: '1.0'
      }
    };
  }

  /**
   * Submit feedback or notes for an idea
   */
  async submitFeedbackOrNotes(
    ideaId: string,
    messageType: 'Feedback' | 'Notes',
    description: string
  ): Promise<any> {
    const accessToken = authApi.getAccessToken();
    if (!accessToken) {
      throw new Error('Authentication required');
    }

    // Get user ID from session
    const user = authApi.getStoredUser();
    if (!user || !user.id) {
      throw new Error('User not found');
    }

    const payload = {
      user: user.id,
      idea: ideaId,
      message_type: messageType,
      description
    };

    console.log('[IdeaAnalysisAPI] Submitting feedback/notes:', payload);

    try {
      const response = await authApi.fetchWithAuth(
        `${API_BASE_URL}/ideabusinessplan/businessidea-feedback-notes-messages/`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `API returned ${response.status}`);
      }

      const data = await response.json();
      console.log('[IdeaAnalysisAPI] Feedback/notes submitted successfully');
      return data;
    } catch (error) {
      console.error('[IdeaAnalysisAPI] Error submitting feedback/notes:', error);
      throw error;
    }
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
   * Guard/validate the initial idea before proceeding
   */
  async guardIdea(payload: GuardIdeaPayload): Promise<GuardIdeaResponse> {
    const accessToken = authApi.getAccessToken();
    
    if (!accessToken) {
      console.error('[IdeaAnalysisAPI] No access token available');
      throw new Error('Authentication required. Please login.');
    }

    console.log('[IdeaAnalysisAPI] Calling guard API with payload:', payload);

    try {
      const response = await authApi.fetchWithAuth(`${API_BASE_URL}/api/idea/guard/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
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

      const data: GuardIdeaResponse = await response.json();
      console.log('[IdeaAnalysisAPI] Guard response received:', data);

      return data;
    } catch (error) {
      console.error('[IdeaAnalysisAPI] Error calling guard API:', error);
      throw error;
    }
  }

  /**
   * Call clarify API to get follow-up questions
   */
  async clarifyIdea(payload: ClarifyPayload): Promise<ClarifyResponse> {
    const accessToken = authApi.getAccessToken();
    
    if (!accessToken) {
      console.error('[IdeaAnalysisAPI] No access token available');
      throw new Error('Authentication required. Please login.');
    }

    console.log('[IdeaAnalysisAPI] Calling clarify API with payload:', payload);

    try {
      const response = await authApi.fetchWithAuth(`${API_BASE_URL}/api/idea/clarify/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
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

      const data: ClarifyResponse = await response.json();
      console.log('[IdeaAnalysisAPI] Clarify response received:', data);

      return data;
    } catch (error) {
      console.error('[IdeaAnalysisAPI] Error calling clarify API:', error);
      throw error;
    }
  }

  /**
   * Validate follow-up answers before submitting for analysis
   */
  async validateAnswers(payload: ValidateAnswersPayload): Promise<ValidateAnswersResponse> {
    const accessToken = authApi.getAccessToken();
    
    if (!accessToken) {
      console.error('[IdeaAnalysisAPI] No access token available');
      throw new Error('Authentication required. Please login.');
    }

    console.log('[IdeaAnalysisAPI] Calling validate-answers API with payload:', payload);

    try {
      const response = await authApi.fetchWithAuth(`${API_BASE_URL}/api/idea/clarify/validate-answers/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
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

      const data: ValidateAnswersResponse = await response.json();
      console.log('[IdeaAnalysisAPI] Validate-answers response received:', data);

      return data;
    } catch (error) {
      console.error('[IdeaAnalysisAPI] Error calling validate-answers API:', error);
      throw error;
    }
  }

  /**
   * Insert analysis data to database after /analyze API
   */
  async insertAnalysisData(payload: InsertAnalysisDataPayload): Promise<InsertDataResponse> {
    const accessToken = authApi.getAccessToken();
    
    if (!accessToken) {
      console.error('[IdeaAnalysisAPI] No access token available');
      throw new Error('Authentication required. Please login.');
    }

    console.log('[IdeaAnalysisAPI] Inserting analysis data to database...');

    try {
      const response = await authApi.fetchWithAuth(`${API_BASE_URL}/ideabusinessplan/insert-validation-data/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('[IdeaAnalysisAPI] Insert analysis data failed:', response.status, errorData);
        return { success: false, error: errorData.message || `API returned ${response.status}` };
      }

      const data = await response.json();
      console.log('[IdeaAnalysisAPI] Analysis data inserted successfully');
      return { success: true, ...data };
    } catch (error) {
      console.error('[IdeaAnalysisAPI] Error inserting analysis data:', error);
      return { success: false, error: String(error) };
    }
  }

  /**
   * Insert validation data to database after /validate API
   */
  async insertValidationCompletedData(payload: InsertValidationDataPayload): Promise<InsertDataResponse> {
    const accessToken = authApi.getAccessToken();
    
    if (!accessToken) {
      console.error('[IdeaAnalysisAPI] No access token available');
      throw new Error('Authentication required. Please login.');
    }

    console.log('[IdeaAnalysisAPI] Inserting validation completed data to database...');

    try {
      const response = await authApi.fetchWithAuth(`${API_BASE_URL}/ideabusinessplan/insert-validationcompleted-data/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('[IdeaAnalysisAPI] Insert validation data failed:', response.status, errorData);
        return { success: false, error: errorData.message || `API returned ${response.status}` };
      }

      const data = await response.json();
      console.log('[IdeaAnalysisAPI] Validation data inserted successfully');
      return { success: true, ...data };
    } catch (error) {
      console.error('[IdeaAnalysisAPI] Error inserting validation data:', error);
      return { success: false, error: String(error) };
    }
  }

  /**
   * Insert plan data to database after /plan API
   */
  async insertIdeaPlanData(payload: InsertPlanDataPayload): Promise<InsertDataResponse> {
    const accessToken = authApi.getAccessToken();
    
    if (!accessToken) {
      console.error('[IdeaAnalysisAPI] No access token available');
      throw new Error('Authentication required. Please login.');
    }

    console.log('[IdeaAnalysisAPI] Inserting idea plan data to database...');

    try {
      const response = await authApi.fetchWithAuth(`${API_BASE_URL}/ideabusinessplan/insert-ideaplan-data/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('[IdeaAnalysisAPI] Insert plan data failed:', response.status, errorData);
        return { success: false, error: errorData.message || `API returned ${response.status}` };
      }

      const data = await response.json();
      console.log('[IdeaAnalysisAPI] Plan data inserted successfully');
      return { success: true, ...data };
    } catch (error) {
      console.error('[IdeaAnalysisAPI] Error inserting plan data:', error);
      return { success: false, error: String(error) };
    }
  }

  /**
   * Get user ID from localStorage
   */
  getUserId(): number | null {
    try {
      // User data is stored in executionPlannerSession
      const sessionStr = localStorage.getItem('executionPlannerSession');
      if (!sessionStr) {
        console.warn('[IdeaAnalysisAPI] No session data in localStorage');
        return null;
      }
      const session = JSON.parse(sessionStr);
      const userId = session.user?.id || null;
      
      if (!userId) {
        console.warn('[IdeaAnalysisAPI] No user ID found in session');
      } else {
        console.log('[IdeaAnalysisAPI] User ID retrieved:', userId);
      }
      
      return userId;
    } catch (error) {
      console.error('[IdeaAnalysisAPI] Error getting user ID:', error);
      return null;
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

  /**
   * Fetch industry, domain, and subcategory metadata
   */
  async getIndustryDomainSubcategories(): Promise<IndustryDomainCategory[]> {
    const accessToken = authApi.getAccessToken();

    if (!accessToken) {
      console.error('[IdeaAnalysisAPI] No access token available');
      throw new Error('Authentication required. Please login.');
    }

    console.log('[IdeaAnalysisAPI] Fetching industry/domain/subcategory metadata...');

    try {
      const response = await authApi.fetchWithAuth(
        `${API_BASE_URL}/ideabusinessplan/industry-domain-subcategories/`,
        { method: 'GET' }
      );

      if (!response.ok) {
        if (response.status === 401) {
          console.error('[IdeaAnalysisAPI] Unauthorized (401) while fetching industry metadata');
          throw new Error('Unauthorized: Please re-authenticate and try again.');
        }
        const errorData = await response.json().catch(() => ({}));
        console.error('[IdeaAnalysisAPI] API error:', response.status, errorData);
        throw new Error(errorData.message || `API returned ${response.status}`);
      }

      const data: IndustryDomainCategory[] = await response.json();
      console.log('[IdeaAnalysisAPI] Industry metadata fetched successfully:', data.length, 'industries');

      return data;
    } catch (error) {
      console.error('[IdeaAnalysisAPI] Error fetching industry metadata:', error);
      throw error;
    }
  }

  /**
   * Fetch curated YouTube video feed for user engagement
   */
  async getVideoEngageFeed(): Promise<VideoFeedResponse> {
    const accessToken = authApi.getAccessToken();

    if (!accessToken) {
      console.error('[IdeaAnalysisAPI] No access token available');
      throw new Error('Authentication required. Please login.');
    }

    console.log('[IdeaAnalysisAPI] Fetching video engagement feed...');

    try {
      const response = await authApi.fetchWithAuth(
        `${API_BASE_URL}/api/videos/engage/feed/`,
        { method: 'GET' }
      );

      if (!response.ok) {
        if (response.status === 401) {
          console.error('[IdeaAnalysisAPI] Unauthorized (401) while fetching video feed');
          throw new Error('Unauthorized: Please re-authenticate and try again.');
        }
        const errorData = await response.json().catch(() => ({}));
        console.error('[IdeaAnalysisAPI] Video feed API error:', response.status, errorData);
        throw new Error(errorData.message || `API returned ${response.status}`);
      }

      const data: VideoFeedResponse = await response.json();
      console.log('[IdeaAnalysisAPI] Video feed fetched successfully:', data.items?.length || 0, 'videos');

      return data;
    } catch (error) {
      console.error('[IdeaAnalysisAPI] Error fetching video feed:', error);
      throw error;
    }
  }
}

export const ideaAnalysisApi = new IdeaAnalysisApiService();
