import { useState } from 'react';
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
import { ideaAnalysisApi, type AnalyseResponse } from '../services/ideaAnalysisApi';
import { v4 as uuidv4 } from 'uuid';

interface IdeaPageProps {
  ideas: Idea[];
  onIdeaSubmit: (idea: Idea) => void;
  onIdeaAccept: (idea: Idea) => void;
  onIdeaUpdate: (idea: Idea) => void;
  onApiResponse?: (response: AnalyseResponse | null) => void;
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

export function EnhancedIdeaPage({ ideas, onIdeaSubmit, onIdeaAccept, onApiResponse }: IdeaPageProps) {
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

  // Extract keywords from text (robust, covers synonyms and free-form input)
  const extractKeywordsFromText = (text: string): Partial<IdeaKeywords> => {
    const extracted: Partial<IdeaKeywords> = {};

    if (!text) return extracted;

    const lower = text.toLowerCase();

    // 1) Direct key markers and common synonyms
    const synonymMap: Record<keyof IdeaKeywords, string[]> = {
      location: ['location', 'based in', 'in ', 'at ', 'city', 'country', 'region', 'state'],
      budget: ['budget', 'cost', 'spend', 'investment', 'capex', 'opex', 'price'],
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
    // Location: detect title-cased words after prepositions
    if (!extracted.location) {
      const m = /(in|at|based in|from)\s+([A-Z][a-zA-Z]+(?:\s+[A-Z][a-zA-Z]+)*)/.exec(text);
      if (m) extracted.location = m[2];
    }

    // Budget: currency, ranges
    if (!extracted.budget) {
      const m = /(\$\s?\d[\d,]*(?:\.\d+)?\s?(k|m|million|thousand)?|\d+\s?(usd|dollars))/i.exec(text);
      if (m) extracted.budget = m[0];
    }

    // Timeline: durations or deadlines
    if (!extracted.timeline) {
      const m = /(within\s+\d+\s+(days|weeks|months|years)|\d+\s+(days|weeks|months|years)|by\s+q[1-4]\s*\d{4}|by\s+\w+\s+\d{4})/i.exec(text);
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

  const handleApplyRecommendations = (updatedKeywords: { [key: string]: string }) => {
    console.log('[EnhancedIdeaPage] Apply Recommendations - Updated keywords:', updatedKeywords);
    console.log('[EnhancedIdeaPage] Apply Recommendations - Reusing idea_id:', ideaId);
    
    // Update summary keywords with recommendations
    setSummaryKeywords(prev => {
      const updated = { ...prev, ...updatedKeywords };
      console.log('[EnhancedIdeaPage] Updated summaryKeywords:', updated);
      return updated;
    });
    
    // Update the summary text to include the new keyword information
    let updatedSummary = summary;
    Object.entries(updatedKeywords).forEach(([key, value]) => {
      if (value && !summary.toLowerCase().includes(value.toLowerCase())) {
        updatedSummary += ` ${key}: ${value}.`;
      }
    });
    setSummary(updatedSummary);
    
    // Re-trigger analysis with updated data (will use the same ideaId)
    setTimeout(() => {
      handleSummarySubmit();
    }, 100);
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

    setIsAnalyzing(true);
    setSummarySubmitted(true);
    
    try {
      // Generate UUID for new idea if not already set
      const currentIdeaId = ideaId || uuidv4();
      if (!ideaId) {
        setIdeaId(currentIdeaId);
        console.log('[EnhancedIdeaPage] Generated new idea_id:', currentIdeaId);
      }

      // Create payload using the API service with all keyword fields
      const payload = ideaAnalysisApi.createAnalysePayload(
        summary,
        {
          category: summaryKeywords.category,
          industry: summaryKeywords.industry,
          domain: summaryKeywords.domain,
          budget: summaryKeywords.budget,
          timeline: summaryKeywords.timeline,
          location: summaryKeywords.location,
          scalability: summaryKeywords.scalability,
          validation: summaryKeywords.validation,
          metrics: summaryKeywords.metrics
        },
        currentIdeaId
      );

      // Call the API
      const response = await ideaAnalysisApi.analyseIdea(payload);
      
      setApiResponse(response);
      setIdeaId(response.idea_id || response.final_output?.idea_id || '');
      
      // Pass response to parent for suggestions panel
      onApiResponse?.(response);

      // Calculate confidence based on market_attributes field completion
      const attrs = response.final_output?.market_attributes;
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

      // Extract key points from API response
      if (response.final_output?.key_points_summary) {
        const kps = response.final_output.key_points_summary;
        const points: KeyPoints = {
          coreConcept: kps.core_concept || summary,
          targetMarket: kps.target_market || 'To be defined',
          valueProposition: kps.unique_value_proposition || 'Innovative solution',
          revenueModel: kps.revenue_model || 'Multiple revenue streams',
          competitiveAdvantages: kps.competitive_advantage || 'Market differentiation',
          growthPotential: kps.growth_potential || 'High scalability',
          implementationTimeline: kps.implementation_timeline || '6-12 months'
        };
        setKeyPoints(points);
      } else {
        // Fallback to generating key points from summary
        generateKeyPoints(summary);
      }

      // Update keywords from API response - populate all fields
      if (response.final_output?.market_attributes) {
        const attrs = response.final_output.market_attributes;
        console.log('[EnhancedIdeaPage] Updating keywords from API response:', attrs);
        setSummaryKeywords(prev => ({
          ...prev,
          category: attrs.category || prev.category,
          domain: attrs.domain || prev.domain,
          industry: attrs.industry || prev.industry,
          budget: attrs.budget || prev.budget,
          location: attrs.location || prev.location,
          timeline: attrs.timeline || prev.timeline,
          scalability: attrs.scalability || prev.scalability,
          validation: attrs.validation || prev.validation,
          metrics: attrs.metrics || prev.metrics
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
                        #{keyword}{summaryKeywords[keyword] ? ` (${summaryKeywords[keyword].substring(0, 20)}${summaryKeywords[keyword].length > 20 ? '...' : ''})` : ''}
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
                          <DetailedAnalysisView data={apiResponse.final_output} />
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
                                #{keyword}{detailedKeywords[keyword] ? ` (${detailedKeywords[keyword].substring(0, 20)}${detailedKeywords[keyword].length > 20 ? '...' : ''})` : ''}
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
