import { useState, useEffect } from 'react';
import { Plus, Edit, Sparkles, Shield, Users, Target } from 'lucide-react';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Idea } from '../App';
import { motion, AnimatePresence } from 'framer-motion';
import { IdeaExplanationDialog } from './IdeaExplanationDialog';
import { MarketAnalysisDialog } from './MarketAnalysisDialog';
import { IdeaConfirmationDialog } from './IdeaConfirmationDialog';
import { AnalyzingDialog } from './AnalyzingDialog';
import { DetailedAnalysisView } from './DetailedAnalysisView';
import { IndustryCategoryDialog } from './IndustryCategoryDialog';
import { AIFollowUpDialog } from './AIFollowUpDialog';
import { InvalidIdeaDialog } from './InvalidIdeaDialog';
import { ideaAnalysisApi, type AnalyseResponse, type UserIdeaItem, type FollowUpQuestion, type ClarifiedFollowUp } from '../services/ideaAnalysisApi';
import { v4 as uuidv4 } from 'uuid';
import { useVideoEngagement } from '../context/VideoEngagementContext';

interface IdeaPageProps {
  ideas: Idea[];
  onIdeaSubmit: (idea: Idea) => void;
  onIdeaAccept: (idea: Idea) => void;
  onIdeaUpdate: (idea: Idea) => void;
  onApiResponse?: (response: AnalyseResponse | null) => void;
  onNavigateToValidation?: (ideaId: string, validationData: any) => void;
  onNavigateToPlan?: (ideaId: string, planData: any) => void;
  onShowFollowupQuestions?: (questions: any[]) => void;
}

interface AnalysisResult {
  strength: { large: number; medium: number; small: number; total: number };
  quality: { large: number; medium: number; small: number; total: number };
  customers: { large: number; medium: number; small: number; total: number };
}

interface KeyPoints {
  coreConcept: string;
  targetMarket: string;
  valueProposition: string;
  revenueModel: string;
  competitiveAdvantages: string;
  growthPotential: string;
  implementationTimeline: string;
}

interface IdeaKeywords {
  location: string;
  budget: string;
  category: string;
  industry: string;
  domain: string;
  timeline: string;
  target: string;
  scalability: string;
  validation: string;
  metrics: string;
}

const FIXED_KEYWORDS: (keyof IdeaKeywords)[] = [
  'location',
  'budget',
  'category',
  'industry',
  'domain',
  'timeline',
  'target',
  'scalability',
  'validation',
  'metrics'
];

export function EnhancedIdeaPage({ ideas, onIdeaSubmit, onIdeaAccept, onApiResponse, onNavigateToValidation, onNavigateToPlan, onShowFollowupQuestions }: IdeaPageProps) {
  const { videosBySection, loading: videosLoading } = useVideoEngagement();
  const [showJourneyDialog, setShowJourneyDialog] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [summary, setSummary] = useState('');
  const [description, setDescription] = useState('');
  const [summarySubmitted, setSummarySubmitted] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [showDetailedDescription, setShowDetailedDescription] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [apiResponse, setApiResponse] = useState<any>(null);
  const [ideaId, setIdeaId] = useState('');
  const [userIdeas, setUserIdeas] = useState<UserIdeaItem[]>([]);
  const [isLoadingIdeas, setIsLoadingIdeas] = useState(true);
  const [ideasError, setIdeasError] = useState('');
  const [showIndustryCategoryDialog, setShowIndustryCategoryDialog] = useState(false);
  const [showFollowUpDialog, setShowFollowUpDialog] = useState(false);
  const [followUpQuestions, setFollowUpQuestions] = useState<FollowUpQuestion[]>([]);
  const [pendingIndustry, setPendingIndustry] = useState('');
  const [pendingCategory, setPendingCategory] = useState('');
  const [showInvalidIdeaDialog, setShowInvalidIdeaDialog] = useState(false);
  const [invalidIdeaMessage, setInvalidIdeaMessage] = useState('');
  const [invalidIdeaExamples, setInvalidIdeaExamples] = useState<string[]>([]);
  const [invalidIdeaTemplate, setInvalidIdeaTemplate] = useState('');
  const [answerValidationErrors, setAnswerValidationErrors] = useState<Record<string, string>>({});
  
  // Get videos for the journey dialog
  const journeyVideos = videosBySection.idea || videosBySection.general || [];
  
  const [summaryKeywords, setSummaryKeywords] = useState<IdeaKeywords>({
    location: '',
    budget: '',
    category: '',
    industry: '',
    domain: '',
    timeline: '',
    target: '',
    scalability: '',
    validation: '',
    metrics: ''
  });
  
  const [detailedKeywords, setDetailedKeywords] = useState<IdeaKeywords>({
    location: '',
    budget: '',
    category: '',
    industry: '',
    domain: '',
    timeline: '',
    target: '',
    scalability: '',
    validation: '',
    metrics: ''
  });

  const [showMarketAnalysis, setShowMarketAnalysis] = useState(false);
  const [marketAnalysisConfig, setMarketAnalysisConfig] = useState<{
    category: 'strength' | 'quality' | 'customers';
    matchType: 'large' | 'medium' | 'small';
  }>({ category: 'strength', matchType: 'large' });

  const [keyPoints, setKeyPoints] = useState<KeyPoints | null>(null);
  const [showConfirmationDialog, setShowConfirmationDialog] = useState(false);

  // Fetch user ideas on component mount
  useEffect(() => {
    const fetchUserIdeas = async () => {
      try {
        setIsLoadingIdeas(true);
        setIdeasError('');
        const ideas = await ideaAnalysisApi.getUserIdeas();
        // Ensure we always set an array
        setUserIdeas(Array.isArray(ideas) ? ideas : []);
      } catch (error: any) {
        console.error('[EnhancedIdeaPage] Error fetching user ideas:', error);
        setIdeasError(error.message || 'Failed to load ideas');
        setUserIdeas([]); // Set empty array on error
      } finally {
        setIsLoadingIdeas(false);
      }
    };

    fetchUserIdeas();
  }, []);

  // Extract keywords from text (robust, covers synonyms and free-form input)
  const extractKeywordsFromText = (text: string): Partial<IdeaKeywords> => {
    const extracted: Partial<IdeaKeywords> = {};

    if (!text) return extracted;

    const lower = text.toLowerCase();

    // 1) Direct key markers and common synonyms
    const synonymMap: Record<keyof IdeaKeywords, string[]> = {
      location: ['location', 'based in', 'in ', 'at ', 'city', 'country', 'region', 'state'],
      budget: [], // Removed generic triggers - budget extraction now relies on number+currency patterns only
      category: ['category', 'segment', 'type'],
      industry: ['industry', 'vertical', 'sector', 'field'],
      domain: ['domain', 'area', 'niche'],
      timeline: ['timeline', 'by ', 'within', 'deadline', 'timeframe', 'eta'],
      target: ['target', 'audience', 'customer', 'users', 'buyer'],
      scalability: ['scalable', 'scale', 'expansion', 'growth plan'],
      validation: ['validation', 'survey', 'interview', 'pilot', 'mvp'],
      metrics: ['metrics', 'kpi', 'okrs', 'measure', 'success metric']
    };

    const takePhrase = (src: string, startIndex: number): string => {
      // capture up to next punctuation
      const tail = src.slice(startIndex).split(/[.;\n\r]/)[0];
      return tail.trim().slice(0, 80);
    };

    // Try explicit "key: value" or synonym matches
    Object.entries(synonymMap).forEach(([key, triggers]) => {
      if (extracted[key as keyof IdeaKeywords]) return;
      // 1a. key: value
      const colonMatch = new RegExp(`(?:^|\n|\s)${key}[:\s-]+([^\n\r\.]+)`, 'i').exec(text);
      if (colonMatch) {
        extracted[key as keyof IdeaKeywords] = colonMatch[1].trim().slice(0, 80);
        return;
      }
      // 1b. synonyms
      for (const trig of triggers) {
        const idx = lower.indexOf(trig);
        if (idx !== -1) {
          const phrase = takePhrase(text, idx + trig.length);
          if (phrase) {
            extracted[key as keyof IdeaKeywords] = phrase.replace(/^[:-]\s*/, '').slice(0, 80);
            break;
          }
        }
      }
    });

    // 2) Heuristics
    // Location: detect words after prepositions (case-insensitive for flexibility)
    if (!extracted.location) {
      // Try title-cased first
      let m = /(in|at|based in|from)\s+([A-Z][a-zA-Z]+(?:\s+[A-Z][a-zA-Z]+)*)/.exec(text);
      if (m) {
        extracted.location = m[2];
      } else {
        // Try any word after location prepositions (handles lowercase like "hyderabad")
        m = /(in|at|based in|from)\s+([a-zA-Z]+(?:\s+[a-zA-Z]+)?)/.exec(text);
        if (m) extracted.location = m[2];
      }
    }

    // Budget: currency, ranges (enhanced for Indian formats)
    // Only match if there's a number with currency/amount indicator
    if (!extracted.budget) {
      // Indian formats: 80L, 80 Lakhs, 20C, 20 Crores, 5Cr, ₹80L, etc.
      const indianMatch = /(?:₹|rs\.?|inr)?\s*(\d+(?:\.\d+)?\s*(?:l|lakh|lakhs|c|cr|crore|crores))/i.exec(text);
      if (indianMatch) {
        extracted.budget = indianMatch[0];
      } else {
        // International formats: $50k, $1M, 1000 USD, etc.
        const intlMatch = /(\$\s?\d[\d,]*(?:\.\d+)?\s?(?:k|m|million|thousand|billion)|\d+\s?(?:usd|dollars))/i.exec(text);
        if (intlMatch) {
          extracted.budget = intlMatch[0];
        } else {
          // Explicit budget mentions with numbers: "budget of 50 lakhs", "50 lakhs budget"
          const explicitMatch = /(?:budget|investment|capital|funding)(?:\s+of)?\s+(?:₹|rs\.?)?\s*(\d+(?:\.\d+)?\s*(?:l|lakh|lakhs|c|cr|crore|crores|k|thousand|million))/i.exec(text);
          if (explicitMatch) {
            extracted.budget = explicitMatch[1];
          }
        }
      }
    }

    // Timeline: durations or deadlines (enhanced patterns)
    if (!extracted.timeline) {
      const m = /(in\s+next\s+\d+\s+(days|weeks|months|years)|within\s+\d+\s+(days|weeks|months|years)|\d+\s+(days|weeks|months|years)|next\s+\d+\s+(days|weeks|months|years)|by\s+q[1-4]\s*\d{4}|by\s+\w+\s+\d{4})/i.exec(text);
      if (m) extracted.timeline = m[0];
    }

    // Compact cleanup
    Object.keys(extracted).forEach(k => {
      const v = (extracted as any)[k];
      if (typeof v === 'string') {
        (extracted as any)[k] = v.replace(/^[:\s-]+/, '').trim();
      }
    });

    return extracted;
  };

  const handleSummaryChange = (text: string) => {
    setSummary(text);
    const extracted = extractKeywordsFromText(text);
    setSummaryKeywords(prev => ({ ...prev, ...extracted }));
  };

  const handleDetailedChange = (text: string) => {
    setDescription(text);
    const extracted = extractKeywordsFromText(text);
    setDetailedKeywords(prev => ({ ...prev, ...extracted }));
  };

  const handleApplyRecommendations = async (updatedKeywords: { [key: string]: string }) => {
    console.log('[EnhancedIdeaPage] Apply Recommendations - Updated keywords:', updatedKeywords);
    console.log('[EnhancedIdeaPage] Apply Recommendations - Reusing idea_id:', ideaId);
    
    if (!ideaId) {
      alert('No idea ID found. Please submit the idea first.');
      return;
    }

    setIsAnalyzing(true);
    
    try {
      // Get category and industry from API response or use stored values
      const category = apiResponse?.final_output?.market_attributes?.category || summaryKeywords.category || 'General';
      const industry = apiResponse?.final_output?.market_attributes?.industry || summaryKeywords.industry || 'General';

      // Create scale details from updated keywords
      const scaleDetails = {
        domain: updatedKeywords.domain || '',
        budget: updatedKeywords.budget || '',
        timeline: updatedKeywords.timeline || '',
        location: updatedKeywords.location || '',
        scalability: updatedKeywords.scalability || '',
        validation: updatedKeywords.validation || '',
        metrics: updatedKeywords.metrics || ''
      };

      // Create payload with all three scales having the same updated data
      const payload = ideaAnalysisApi.createReAnalysePayload(
        summary,
        category,
        industry,
        scaleDetails, // large_scale
        scaleDetails, // medium_scale
        scaleDetails, // small_scale
        ideaId
      );

      console.log('[EnhancedIdeaPage] Re-analysis payload:', payload);

      // Call the API
      const response = await ideaAnalysisApi.analyseIdea(payload);
      
      setApiResponse(response);
      onApiResponse?.(response);

      // Update keywords from response
      const attrs = response.final_output?.market_attributes;
      if (attrs) {
        setSummaryKeywords({
          location: String(attrs.location || ''),
          budget: String(attrs.budget || ''),
          category: String(attrs.category || ''),
          industry: String(attrs.industry || ''),
          domain: String(attrs.domain || ''),
          timeline: String(attrs.timeline || ''),
          target: String(attrs.target || ''),
          scalability: String(attrs.scalability || ''),
          validation: String(attrs.validation || ''),
          metrics: String(attrs.metrics || '')
        });
      }

      console.log('[EnhancedIdeaPage] Re-analysis completed successfully');
    } catch (error) {
      console.error('[EnhancedIdeaPage] Re-analysis failed:', error);
      alert('Failed to re-analyze idea. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleStartCreate = () => {
    setShowJourneyDialog(true);
  };

  const handleContinueToForm = () => {
    setShowCreateForm(true);
  };

  const handleSummarySubmit = async () => {
    if (!summary.trim()) {
      alert('Please enter an idea summary');
      return;
    }

    // Step 1: Validate the idea using guard API
    setIsAnalyzing(true);
    try {
      console.log('[EnhancedIdeaPage] Validating idea with guard API...');
      const guardResponse = await ideaAnalysisApi.guardIdea({ idea: summary });
      
      // Check if idea is invalid
      if (!guardResponse.ok) {
        console.log('[EnhancedIdeaPage] Guard API rejected the idea');
        setIsAnalyzing(false);
        setInvalidIdeaMessage(guardResponse.error || 'Please provide a valid business idea.');
        setInvalidIdeaExamples(guardResponse.examples || []);
        setInvalidIdeaTemplate(''); // Guard API doesn't provide template
        setShowInvalidIdeaDialog(true);
        return;
      }
      
      console.log('[EnhancedIdeaPage] Idea validated successfully:', guardResponse.idea_normalized);
      setIsAnalyzing(false);
      
      // Step 2: Try to extract industry and category from existing keywords
      const existingIndustry = summaryKeywords.industry?.trim();
      const existingCategory = summaryKeywords.category?.trim();

      // If both industry and category are already filled, proceed directly
      if (existingIndustry && existingCategory) {
        console.log('[EnhancedIdeaPage] Industry and Category already extracted, proceeding directly');
        await handleIndustryCategorySubmit(existingIndustry, existingCategory);
      } else {
        // Show industry/category dialog to collect missing information
        console.log('[EnhancedIdeaPage] Industry or Category missing, showing dialog');
        setShowIndustryCategoryDialog(true);
      }
    } catch (error) {
      console.error('[EnhancedIdeaPage] Error validating idea:', error);
      setIsAnalyzing(false);
      alert('Failed to validate idea. Please try again.');
    }
  };

  const handleIndustryCategorySubmit = async (industry: string, category: string) => {
    // Close industry/category dialog
    setShowIndustryCategoryDialog(false);
    
    // Show analyzing dialog while calling clarify API
    setIsAnalyzing(true);
    
    // Store industry and category for later use
    setPendingIndustry(industry);
    setPendingCategory(category);
    
    // Generate UUID for new idea if not already set
    const currentIdeaId = ideaId || uuidv4();
    if (!ideaId) {
      setIdeaId(currentIdeaId);
      console.log('[EnhancedIdeaPage] Generated new idea_id:', currentIdeaId);
    }
    
    try {
      // Call clarify API to get follow-up questions
      console.log('[EnhancedIdeaPage] Calling clarify API...');
      
      const clarifyPayload = {
        idea_id: currentIdeaId,
        idea: {
          title: summary,
          description: summary,
          industry: industry,
          target_location: summaryKeywords.location || '',
          business_model: summaryKeywords.category || category || ''
        }
      };
      
      const clarifyResponse = await ideaAnalysisApi.clarifyIdea(clarifyPayload);
      console.log('[EnhancedIdeaPage] Clarify response:', clarifyResponse);
      
      // Hide analyzing dialog
      setIsAnalyzing(false);
      
      // Check if response has valid questions (success case)
      const hasValidQuestions = clarifyResponse.questions && clarifyResponse.questions.length > 0;
      
      // If no valid questions, treat as error response (regardless of status)
      if (!hasValidQuestions) {
        console.log('[EnhancedIdeaPage] Non-success response detected, showing guidance dialog');
        
        // Extract error information from response (works for any error format)
        const errorMessage = clarifyResponse.message 
          || clarifyResponse.error 
          || 'Please provide a clearer business idea with more details.';
        
        const errorExamples = clarifyResponse.examples || [];
        const errorTemplate = clarifyResponse.template || '';
        
        // Log the status for debugging
        if (clarifyResponse.status) {
          console.log('[EnhancedIdeaPage] Response status:', clarifyResponse.status);
        }
        
        setInvalidIdeaMessage(errorMessage);
        setInvalidIdeaExamples(errorExamples);
        setInvalidIdeaTemplate(errorTemplate);
        setShowInvalidIdeaDialog(true);
        return;
      }
      
      // Success case: Show follow-up questions dialog
      console.log('[EnhancedIdeaPage] Valid response with questions, proceeding to follow-up dialog');
      setFollowUpQuestions(clarifyResponse.questions!); // Non-null assertion safe here due to hasValidQuestions check
      setShowFollowUpDialog(true);
      
    } catch (error) {
      console.error('[EnhancedIdeaPage] Error calling clarify API:', error);
      setIsAnalyzing(false); // Hide analyzing dialog
      alert('Failed to get follow-up questions. Please try again.');
      setShowIndustryCategoryDialog(true); // Show industry dialog again
    }
  };

  const handleFollowUpSubmit = async (answers: ClarifiedFollowUp[]) => {
    // Clear previous validation errors
    setAnswerValidationErrors({});
    setIsAnalyzing(true);
    
    try {
      // Step 1: Validate answers before submitting
      console.log('[EnhancedIdeaPage] Validating answers...');
      const answersMap = answers.reduce((acc, a) => {
        acc[a.question_id] = a.answer;
        return acc;
      }, {} as Record<string, string>);
      
      const validateResponse = await ideaAnalysisApi.validateAnswers({
        questions: followUpQuestions,
        answers: answersMap
      });
      
      // Check if validation failed
      if (!validateResponse.ok && validateResponse.issues) {
        console.log('[EnhancedIdeaPage] Answer validation failed:', validateResponse.issues);
        setIsAnalyzing(false);
        
        // Convert issues array to error map
        const errorMap = validateResponse.issues.reduce((acc, issue) => {
          acc[issue.id] = issue.msg;
          return acc;
        }, {} as Record<string, string>);
        
        setAnswerValidationErrors(errorMap);
        // Keep dialog open to show errors
        return;
      }
      
      console.log('[EnhancedIdeaPage] Answers validated successfully');
      
      // Step 2: Close dialog and proceed with analysis
      setShowFollowUpDialog(false);
      setSummarySubmitted(true);
      
      const currentIdeaId = ideaId || uuidv4();
      
      // Create payload using the API service with industry, category, and clarified followups
      const payload = ideaAnalysisApi.createAnalysePayload(
        summary,
        pendingCategory,
        pendingIndustry,
        currentIdeaId,
        answers
      );

      console.log('[EnhancedIdeaPage] Calling analyze API with clarified followups:', payload);

      // Call the analyze API
      const response = await ideaAnalysisApi.analyseIdea(payload);
      
      setApiResponse(response);
      setIdeaId(response.idea_id || response.final_output?.idea_id || '');
      
      // Pass response to parent for suggestions panel
      onApiResponse?.(response);

      // Insert analysis data to database (non-blocking)
      const userId = ideaAnalysisApi.getUserId();
      if (userId && response.idea_id) {
        console.log('[EnhancedIdeaPage] Persisting analysis data to database...');
        ideaAnalysisApi.insertAnalysisData({
          userId,
          stage: 'Analysis',
          idea_id: response.idea_id,
          final_output: response.final_output || {},
          live_references: response.live_references || {}
        }).then(result => {
          if (result.success) {
            console.log('[EnhancedIdeaPage] Analysis data persisted successfully');
          } else {
            console.error('[EnhancedIdeaPage] Failed to persist analysis data:', result.error);
          }
        }).catch(err => {
          console.error('[EnhancedIdeaPage] Error persisting analysis data:', err);
        });
      }

      // Auto-fill keywords from API response - Handle nested structure
      const attrs = response.final_output?.market_attributes as any;
      if (attrs) {
        setSummaryKeywords({
          location: String((attrs.location?.value || attrs.location || '')),
          budget: String((attrs.budget?.value || attrs.budget || '')),
          category: String((attrs.category?.value || attrs.category || pendingCategory)),
          industry: String((attrs.industry?.value || attrs.industry || pendingIndustry)),
          domain: String((attrs.domain?.value || attrs.domain || '')),
          timeline: String((attrs.timeline?.value || attrs.timeline || '')),
          target: String((attrs.target?.value || attrs.target || '')),
          scalability: String((attrs.scalability?.value || attrs.scalability || '')),
          validation: String((attrs.validation?.value || attrs.validation || '')),
          metrics: String((attrs.metrics?.value || attrs.metrics || ''))
        });
      }

      // Calculate confidence based on market_attributes field completion
      const marketAttrFields = ['category', 'domain', 'industry', 'budget', 'location', 'timeline', 'scalability', 'validation', 'metrics'];
      const filledFields = marketAttrFields.filter(field => attrs?.[field as keyof typeof attrs] && String(attrs[field as keyof typeof attrs]).trim().length > 0);
      const confidenceScore = Math.round((filledFields.length / marketAttrFields.length) * 100);
      
      console.log('[EnhancedIdeaPage] Confidence Calculation:', {
        totalFields: marketAttrFields.length,
        filledFields: filledFields.length,
        confidence: confidenceScore,
        fields: filledFields
      });
      
      // Calculate dynamic scores for Strength, Quality, Customers based on confidence
      // Large match: 70-100% confidence
      // Medium match: 40-69% confidence  
      // Small match: 0-39% confidence
      const largeScore = confidenceScore >= 70 ? Math.ceil((confidenceScore / 100) * 10) : 0;
      const mediumScore = confidenceScore >= 40 && confidenceScore < 70 ? Math.ceil(((confidenceScore - 40) / 30) * 10) : 0;
      const smallScore = confidenceScore < 40 ? Math.ceil((confidenceScore / 40) * 10) : 0;
      
      const analysis: AnalysisResult = {
        strength: { 
          large: largeScore,
          medium: mediumScore,
          small: smallScore,
          total: 10 
        },
        quality: { 
          large: largeScore,
          medium: mediumScore,
          small: smallScore,
          total: 10 
        },
        customers: { 
          large: largeScore,
          medium: mediumScore,
          small: smallScore,
          total: 10 
        }
      };
      
      setAnalysisResult(analysis);

      // Extract key points from API response - DYNAMIC HANDLING
      if (response.final_output?.key_points_summary) {
        const kps = response.final_output.key_points_summary;
        const points: KeyPoints = {
          coreConcept: String(kps.core_concept || kps.coreConcept || summary),
          targetMarket: String(kps.target_market || kps.targetMarket || 'To be defined'),
          valueProposition: String(kps.unique_value_proposition || kps.valueProposition || 'Innovative solution'),
          revenueModel: String(kps.revenue_model || kps.revenueModel || 'Multiple revenue streams'),
          competitiveAdvantages: String(kps.competitive_advantage || kps.competitiveAdvantages || 'Market differentiation'),
          growthPotential: String(kps.growth_potential || kps.growthPotential || 'High scalability'),
          implementationTimeline: String(kps.implementation_timeline || kps.implementationTimeline || '6-12 months')
        };
        setKeyPoints(points);
      } else {
        // Fallback to generating key points from summary
        generateKeyPoints(summary);
      }

      // Update keywords from API response - DYNAMIC HANDLING with String conversion
      if (response.final_output?.market_attributes) {
        const attrs = response.final_output.market_attributes;
        console.log('[EnhancedIdeaPage] Updating keywords from API response:', attrs);
        setSummaryKeywords(prev => ({
          ...prev,
          category: String(attrs.category || prev.category),
          domain: String(attrs.domain || prev.domain),
          industry: String(attrs.industry || prev.industry),
          budget: String(attrs.budget || prev.budget),
          location: String(attrs.location || prev.location),
          timeline: String(attrs.timeline || prev.timeline),
          scalability: String(attrs.scalability || prev.scalability),
          validation: String(attrs.validation || prev.validation),
          metrics: String(attrs.metrics || prev.metrics)
        }));
      }

      // Show detailed description if confidence is high enough
      if (confidenceScore >= 70) {
        setTimeout(() => setShowDetailedDescription(true), 1000);
      }

    } catch (error: any) {
      console.error('[EnhancedIdeaPage] Error calling API:', error);
      if (error?.message?.toLowerCase().includes('unauthorized')) {
        alert('Session expired or unauthorized. Please login again to continue.');
      } else {
        alert('Failed to analyze idea. Please try again.');
      }
      
      // Fallback to local analysis
      generateKeyPoints(summary);
      const keywordsFilled = Object.values(summaryKeywords).filter(v => v.trim().length > 0).length;
      const completionRate = keywordsFilled / FIXED_KEYWORDS.length;
      
      const analysis: AnalysisResult = {
        strength: { 
          large: Math.min(10, Math.floor(completionRate * 10)),
          medium: Math.floor(Math.random() * 3),
          small: Math.floor(Math.random() * 2),
          total: 10 
        },
        quality: { 
          large: Math.min(10, Math.floor(completionRate * 10)),
          medium: Math.floor(Math.random() * 3),
          small: Math.floor(Math.random() * 2),
          total: 10 
        },
        customers: { 
          large: Math.min(10, Math.floor(completionRate * 10)),
          medium: Math.floor(Math.random() * 3),
          small: Math.floor(Math.random() * 2),
          total: 10 
        }
      };
      
      setAnalysisResult(analysis);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const generateKeyPoints = (summaryText: string) => {
    // AI-powered key points generation based on summary
    const sentences = summaryText.split('.').filter(s => s.trim().length > 0);
    
    const points: KeyPoints = {
      coreConcept: sentences[0]?.trim() || 'Innovative solution addressing market needs',
      targetMarket: summaryKeywords.target || 'Small to medium businesses and individual consumers',
      valueProposition: 'Unique approach combining technology and user-centric design to deliver exceptional value',
      revenueModel: summaryKeywords.budget ? 
        `${summaryKeywords.budget} initial investment with projected ROI through subscription and service fees` : 
        'Multi-stream revenue model including subscriptions, premium features, and partnerships',
      competitiveAdvantages: `${summaryKeywords.domain || 'Industry'} expertise combined with innovative technology stack`,
      growthPotential: summaryKeywords.location ? 
        `High scalability potential starting from ${summaryKeywords.location} with expansion opportunities` :
        'Significant growth potential with scalable business model and market expansion opportunities',
      implementationTimeline: summaryKeywords.timeline || '6-12 months to MVP, 18-24 months to market leadership'
    };
    
    setKeyPoints(points);
  };

  const handleDetailedDescriptionSubmit = () => {
    if (!description.trim()) {
      alert('Please enter detailed description');
      return;
    }

    // Show confirmation dialog instead of immediately submitting
    setShowConfirmationDialog(true);
  };

  const handleIdeaAccept = () => {
    const bulletPoints = generateBulletPoints(description);
    
    // Use the UUID-based idea_id instead of timestamp
    const finalIdeaId = ideaId || uuidv4();
    
    const newIdea: Idea = {
      id: finalIdeaId,
      summary,
      description,
      bulletPoints,
      status: 'draft',
      createdAt: new Date(),
      isActive: true,
    };

    console.log('[EnhancedIdeaPage] Idea accepted with UUID:', finalIdeaId);
    
    onIdeaSubmit(newIdea);
    onIdeaAccept(newIdea);
    
    // Close confirmation dialog
    setShowConfirmationDialog(false);
    
    // Reset form
    setSummary('');
    setDescription('');
    setSummarySubmitted(false);
    setAnalysisResult(null);
    setShowDetailedDescription(false);
    setShowCreateForm(false);
    setKeyPoints(null);
    setApiResponse(null);
    setIdeaId('');
    setSummaryKeywords({
      location: '',
      budget: '',
      category: '',
      industry: '',
      domain: '',
      timeline: '',
      target: '',
      scalability: '',
      validation: '',
      metrics: ''
    });
    setDetailedKeywords({
      location: '',
      budget: '',
      category: '',
      industry: '',
      domain: '',
      timeline: '',
      target: '',
      scalability: '',
      validation: '',
      metrics: ''
    });
  };

  const generateBulletPoints = (text: string): string[] => {
    const sentences = text.split('.').filter(s => s.trim().length > 0);
    const points = [];
    
    if (sentences.length > 0) points.push(`Core Concept: ${sentences[0].trim()}`);
    if (sentences.length > 1) points.push(`Target Market: ${sentences[1]?.trim() || 'To be defined'}`);
    points.push('Unique Value Proposition: Innovative solution to market needs');
    points.push('Revenue Model: Multiple revenue streams identified');
    points.push('Competitive Advantage: First-mover advantage in niche market');
    points.push('Growth Potential: Scalable business model');
    points.push('Implementation Timeline: 6-12 months to MVP');
    
    return points.slice(0, 7);
  };

  const calculateConfidence = (): number => {
    if (!analysisResult) return 0;
    const total = (analysisResult.strength.large + analysisResult.quality.large + analysisResult.customers.large);
    return Math.round((total / 30) * 100);
  };

  const handleEditMatch = (category: 'strength' | 'quality' | 'customers', matchType: 'large' | 'medium' | 'small') => {
    setMarketAnalysisConfig({ category, matchType });
    setShowMarketAnalysis(true);
  };

  const activeIdeas = ideas.filter(i => i.isActive);

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl text-black mb-2">Your Ideas</h1>
            <p className="text-gray-600">Capture, analyze, and validate your concepts with AI</p>
          </div>
          
          <Button 
            onClick={handleStartCreate}
            className="bg-red-600 hover:bg-red-700 text-white gap-2"
            size="lg"
          >
            <Plus className="w-5 h-5" />
            Create New Idea
          </Button>
        </div>

        {/* Journey Dialog */}
        <IdeaExplanationDialog
          isOpen={showJourneyDialog}
          onClose={() => setShowJourneyDialog(false)}
          onContinue={handleContinueToForm}
          videos={journeyVideos}
          loadingVideos={videosLoading}
        />

        {/* Industry & Category Selection Dialog */}
        <IndustryCategoryDialog
          isOpen={showIndustryCategoryDialog}
          onClose={() => setShowIndustryCategoryDialog(false)}
          onSubmit={handleIndustryCategorySubmit}
        />

        {/* AI Follow-Up Questions Dialog */}
        <AIFollowUpDialog
          isOpen={showFollowUpDialog}
          onClose={() => setShowFollowUpDialog(false)}
          questions={followUpQuestions}
          onSubmit={handleFollowUpSubmit}
          validationErrors={answerValidationErrors}
        />

        {/* Invalid Idea Dialog - Shows when user enters unclear/random text */}
        <InvalidIdeaDialog
          isOpen={showInvalidIdeaDialog}
          onClose={() => {
            setShowInvalidIdeaDialog(false);
            // Reset form to allow user to enter a clearer idea
            setSummary('');
            setDescription('');
            setSummarySubmitted(false);
            setShowCreateForm(true);
          }}
          message={invalidIdeaMessage}
          examples={invalidIdeaExamples}
          template={invalidIdeaTemplate}
        />

        {/* Analyzing Dialog - Shows during API call */}
        <AnalyzingDialog open={isAnalyzing} />

        {/* Market Analysis Dialog */}
        <MarketAnalysisDialog
          isOpen={showMarketAnalysis}
          onClose={() => setShowMarketAnalysis(false)}
          category={marketAnalysisConfig.category}
          matchType={marketAnalysisConfig.matchType}
          ideaKeywords={apiResponse?.final_output?.market_attributes || { ...summaryKeywords, ...detailedKeywords }}
          onApplyRecommendations={handleApplyRecommendations}
          analysisScores={analysisResult || undefined as any}
        />

        {/* Idea Confirmation Dialog */}
        {keyPoints && (
          <IdeaConfirmationDialog
            isOpen={showConfirmationDialog}
            onClose={() => setShowConfirmationDialog(false)}
            onAccept={handleIdeaAccept}
            ideaSummary={summary}
            ideaDescription={description}
            keyPoints={keyPoints}
          />
        )}

        {/* User Ideas List */}
        {!showCreateForm && (
          <div className="space-y-8">
            {/* Drafts Section - Local ideas that haven't been analyzed yet */}
            {activeIdeas.length > 0 && (
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Drafts</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {activeIdeas.map((idea) => (
                    <Card key={idea.id} className="hover:shadow-lg transition-shadow border-dashed border-2">
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <Badge className="mb-2 bg-gray-500 text-white">Draft</Badge>
                            <CardTitle className="text-base line-clamp-2">{idea.summary}</CardTitle>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        {idea.description && (
                          <p className="text-sm text-gray-600 mb-3 line-clamp-2">{idea.description}</p>
                        )}
                        <div className="space-y-2 text-xs text-gray-500">
                          <div className="flex items-center gap-2">
                            <span>📅</span>
                            <span>{new Date(idea.createdAt).toLocaleDateString()}</span>
                          </div>
                        </div>
                        <Button 
                          className="w-full mt-4" 
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            // TODO: Handle draft click - will be implemented in Point 3
                            console.log('Draft clicked:', idea);
                          }}
                        >
                          Continue Editing
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* Your Active Ideas Section - Ideas from API */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Your Active Ideas</h2>
              {isLoadingIdeas ? (
                <div className="text-center py-12">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
                  <p className="mt-4 text-gray-600">Loading your ideas...</p>
                </div>
              ) : ideasError ? (
                <Card className="border-red-200 bg-red-50">
                  <CardContent className="pt-6">
                    <p className="text-red-600">{ideasError}</p>
                  </CardContent>
                </Card>
              ) : userIdeas.length === 0 && activeIdeas.length === 0 ? (
                <Card className="border-dashed border-2">
                  <CardContent className="pt-12 pb-12 text-center">
                    <Sparkles className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No ideas yet</h3>
                    <p className="text-gray-600 mb-4">Start your journey by creating your first idea</p>
                    <Button 
                      onClick={handleStartCreate}
                      className="bg-red-600 hover:bg-red-700 text-white"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Create Your First Idea
                    </Button>
                  </CardContent>
                </Card>
              ) : userIdeas.length === 0 ? (
                <Card className="border-dashed border-2">
                  <CardContent className="pt-8 pb-8 text-center">
                    <p className="text-gray-600">No active ideas yet. Analyze your drafts to see them here!</p>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {Array.isArray(userIdeas) && userIdeas.map((idea) => {
                  const ideaDescription = idea.analysis_data?.validation_data?.idea_description || 'No description';
                  const verdict = idea.analysis_data?.validation_data?.verdict;
                  const marketAttrs = idea.analysis_data?.validation_data?.market_attributes;
                  
                  // Determine status based on available data
                  const hasAnalysis = !!idea.analysis_data;
                  const hasValidation = !!idea.validation_data;
                  const hasPlan = !!idea.plan_data;
                  
                  let status = 'Draft';
                  let statusColor = 'bg-gray-500';
                  
                  if (hasAnalysis && hasValidation && hasPlan) {
                    status = 'Plan';
                    statusColor = 'bg-purple-500';
                  } else if (hasAnalysis && hasValidation) {
                    status = 'Validated';
                    statusColor = 'bg-green-500';
                  } else if (hasAnalysis) {
                    status = 'Analysis';
                    statusColor = 'bg-blue-500';
                  }
                  
                  const handleViewDetails = () => {
                    if (hasAnalysis && hasValidation && hasPlan) {
                      // Navigate to business plan tab with plan_data
                      if (onNavigateToPlan) {
                        onNavigateToPlan(idea.idea_id, idea.plan_data);
                      }
                    } else if (hasAnalysis && hasValidation) {
                      // Navigate to validation tab and show AI followup questions
                      const followupQuestions = idea.validation_data?.validation_completed_data?.ai_followup_questions;
                      if (followupQuestions && onShowFollowupQuestions) {
                        onShowFollowupQuestions(followupQuestions);
                      }
                      if (onNavigateToValidation) {
                        onNavigateToValidation(idea.idea_id, idea.validation_data);
                      }
                    } else if (hasAnalysis) {
                      // Navigate to validation tab to fill answers
                      if (onNavigateToValidation) {
                        onNavigateToValidation(idea.idea_id, idea.analysis_data);
                      }
                    }
                  };
                  
                  return (
                    <Card key={idea.idea_id} className="hover:shadow-lg transition-shadow">
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <Badge className={`mb-2 ${statusColor} text-white`}>{status}</Badge>
                            <CardTitle className="text-base line-clamp-2">{ideaDescription}</CardTitle>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        {verdict && (
                          <p className="text-sm text-gray-600 mb-3 line-clamp-2">{verdict.text}</p>
                        )}
                        <div className="space-y-2 text-xs text-gray-500">
                          {marketAttrs?.location && (
                            <div className="flex items-center gap-2">
                              <Target className="w-3 h-3" />
                              <span>{marketAttrs.location}</span>
                            </div>
                          )}
                          {marketAttrs?.budget && (
                            <div className="flex items-center gap-2">
                              <span>💰</span>
                              <span>{marketAttrs.budget}</span>
                            </div>
                          )}
                          {marketAttrs?.category && (
                            <div className="flex items-center gap-2">
                              <span>📁</span>
                              <span>{marketAttrs.category}</span>
                            </div>
                          )}
                        </div>
                        <Button 
                          className="w-full mt-4" 
                          variant="outline"
                          size="sm"
                          onClick={handleViewDetails}
                        >
                          View Details
                        </Button>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
            </div>
          </div>
        )}

        {/* Idea Input Form */}
        {showCreateForm && (
          <Card className="border-2 border-gray-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-red-600" />
                Create New Idea
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Summary Input */}
              <div>
                <label className="block text-sm text-gray-700 mb-2">
                  Idea Summary <span className="text-red-600">*</span>
                </label>
                <Textarea
                  value={summary}
                  onChange={(e) => handleSummaryChange(e.target.value)}
                  placeholder="Describe your idea in a few sentences..."
                  className="min-h-[120px] text-base"
                  disabled={summarySubmitted}
                />
                
                {/* Keywords as Badges */}
                {summary && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-3 flex flex-wrap gap-2"
                  >
                    <span className="text-sm text-gray-600">#keywords:</span>
                    {FIXED_KEYWORDS.map((keyword) => (
                      <Badge 
                        key={keyword} 
                        variant="outline" 
                        className={`${summaryKeywords[keyword] 
                          ? 'bg-green-50 border-green-300 text-green-800' 
                          : 'bg-gray-50 border-gray-300 text-gray-600'}`}
                        title={summaryKeywords[keyword] || ''}
                      >
                        #{keyword}
                      </Badge>
                    ))}
                  </motion.div>
                )}

                {!summarySubmitted && (
                  <Button 
                    onClick={handleSummarySubmit}
                    disabled={!summary.trim() || isAnalyzing}
                    className="mt-4 bg-red-600 hover:bg-red-700 text-white"
                  >
                    {isAnalyzing ? 'Analyzing...' : 'Submit for AI Analysis'}
                  </Button>
                )}
              </div>

              {/* AI Analysis Results */}
              <AnimatePresence>
                {summarySubmitted && analysisResult && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="space-y-6"
                  >
                    <div className="bg-gradient-to-r from-red-50 to-yellow-50 p-6 rounded-lg border-2 border-red-200">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-xl text-black flex items-center gap-2">
                          <Sparkles className="w-6 h-6 text-red-600" />
                          AI Analysis Results
                        </h3>
                        <div className="text-right">
                          <div className="text-3xl text-red-600">{calculateConfidence()}%</div>
                          <div className="text-sm text-gray-600">Confidence</div>
                        </div>
                      </div>

                      <div className="grid md:grid-cols-3 gap-6">
                        {/* Strength Analysis */}
                        <AnalysisCard
                          title="Strength"
                          icon={<Shield className="w-6 h-6 text-blue-600" />}
                          data={analysisResult.strength}
                          onEdit={(matchType) => handleEditMatch('strength', matchType)}
                        />

                        {/* Quality Analysis */}
                        <AnalysisCard
                          title="Quality"
                          icon={<Target className="w-6 h-6 text-green-600" />}
                          data={analysisResult.quality}
                          onEdit={(matchType) => handleEditMatch('quality', matchType)}
                        />

                        {/* Customers Analysis */}
                        <AnalysisCard
                          title="Customers"
                          icon={<Users className="w-6 h-6 text-purple-600" />}
                          data={analysisResult.customers}
                          onEdit={(matchType) => handleEditMatch('customers', matchType)}
                        />
                      </div>

                      {/* Show Detailed Analysis View when confidence >= 70% */}
                      {calculateConfidence() >= 70 && apiResponse?.final_output && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="mt-6"
                        >
                          <DetailedAnalysisView 
                            data={apiResponse.final_output} 
                            additionalInfo={apiResponse.additional_information}
                          />
                        </motion.div>
                      )}
                    </div>

                    {/* Detailed Description (shown after high confidence) */}
                    {showDetailedDescription && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-4"
                      >
                        <label className="block text-sm text-gray-700">
                          Detailed Description <span className="text-red-600">*</span>
                        </label>
                        <Textarea
                          value={description}
                          onChange={(e) => handleDetailedChange(e.target.value)}
                          placeholder="Provide a comprehensive description of your idea, including target audience, problem solved, unique value proposition, and implementation approach..."
                          className="min-h-[200px] text-base"
                        />
                        
                        {/* Keywords as Badges for Detailed Description */}
                        {description && (
                          <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex flex-wrap gap-2"
                          >
                            <span className="text-sm text-blue-700">#keywords:</span>
                            {FIXED_KEYWORDS.map((keyword) => (
                              <Badge 
                                key={keyword} 
                                variant="outline" 
                                className={`${detailedKeywords[keyword] 
                                  ? 'bg-blue-50 border-blue-300 text-blue-800' 
                                  : 'bg-gray-50 border-gray-300 text-gray-600'}`}
                                title={detailedKeywords[keyword] || ''}
                              >
                                #{keyword}
                              </Badge>
                            ))}
                          </motion.div>
                        )}

                        <Button 
                          onClick={handleDetailedDescriptionSubmit}
                          disabled={!description.trim()}
                          className="bg-red-600 hover:bg-red-700 text-white"
                        >
                          Complete Idea Submission
                        </Button>
                      </motion.div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </CardContent>
          </Card>
        )}

        {/* Existing Ideas - Smaller Cards */}
        {activeIdeas.length > 0 && (
          <div className="mt-8">
            <h2 className="text-xl text-black mb-3">Your Active Ideas</h2>
            <div className="grid md:grid-cols-2 gap-3">
              {activeIdeas.map((idea) => (
                <Card key={idea.id} className="relative hover:shadow-md transition-colors">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between gap-2">
                      <CardTitle className="text-base line-clamp-1" title={idea.summary}>{idea.summary}</CardTitle>
                      <Badge variant="outline" className="text-xs">{idea.status}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <p className="text-sm text-gray-600 line-clamp-2 mb-2" title={idea.description}>{idea.description}</p>
                    <div className="text-xs text-gray-500">
                      {idea.bulletPoints.length} key points
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Analysis Card Component
function AnalysisCard({ 
  title, 
  icon, 
  data,
  onEdit
}: { 
  title: string; 
  icon: React.ReactNode; 
  data: { large: number; medium: number; small: number; total: number };
  onEdit: (matchType: 'large' | 'medium' | 'small') => void;
}) {
  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <div className="flex items-center gap-2 mb-3">
        {icon}
        <h4 className="text-black">{title}</h4>
      </div>
      
      <div className="space-y-3">
        <MatchItem 
          label="Large" 
          count={data.large} 
          total={data.total} 
          color="green"
          onEdit={() => onEdit('large')}
        />
        <MatchItem 
          label="Medium" 
          count={data.medium} 
          total={data.total} 
          color="yellow"
          onEdit={() => onEdit('medium')}
        />
        <MatchItem 
          label="Small" 
          count={data.small} 
          total={data.total} 
          color="red"
          onEdit={() => onEdit('small')}
        />
      </div>

      <div className="mt-4 pt-3 border-t border-gray-200">
        <div className="flex justify-between items-center text-sm">
          <span className="text-gray-600">Total Match</span>
          <span className="text-black">{data.large + data.medium + data.small}/{data.total}</span>
        </div>
        <Progress 
          value={((data.large + data.medium + data.small) / data.total) * 100} 
          className="mt-2"
        />
      </div>
    </div>
  );
}

// Match Item Component
function MatchItem({ 
  label, 
  count, 
  total, 
  color,
  onEdit
}: { 
  label: string; 
  count: number; 
  total: number; 
  color: string;
  onEdit: () => void;
}) {
  const colorClasses = {
    green: 'bg-green-100 text-green-800 border-green-300',
    yellow: 'bg-yellow-100 text-yellow-800 border-yellow-300',
    red: 'bg-red-100 text-red-800 border-red-300'
  };

  return (
    <div className="flex items-center justify-between">
      <span className="text-sm text-gray-700">{label}</span>
      <div className="flex items-center gap-2">
        <Badge variant="outline" className={`${colorClasses[color as keyof typeof colorClasses]} text-xs`}>
          {count}/{total}
        </Badge>
        <button 
          onClick={onEdit}
          className="text-blue-600 hover:text-blue-700 transition-colors"
          title="View Market Analysis"
        >
          <Edit className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
