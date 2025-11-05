import { useState } from 'react';
import { ExternalLink, Youtube, FileText, BookOpen, Video, Package, Trophy, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { ScrollArea } from './ui/scroll-area';
import { Idea } from '../App';
import { AnalyseResponse, ValidationResponse, PlanResponse } from '../services/ideaAnalysisApi';
import { useVideoEngagement, type VideoContextKey } from '../context/VideoEngagementContext';
import { ContentViewerDialog } from './ContentViewerDialog';

interface SuggestionsPanelProps {
  currentPage: string;
  currentIdea: Idea | null;
  isProfileSetup?: boolean;
  apiResponse?: AnalyseResponse | null;
  validationResponse?: ValidationResponse | null;
  planResponse?: PlanResponse | null;
}

export function SuggestionsPanel({ currentPage, currentIdea, isProfileSetup = false, apiResponse, validationResponse: _validationResponse, planResponse }: SuggestionsPanelProps) {
  const { videosBySection } = useVideoEngagement();
  const [viewerOpen, setViewerOpen] = useState(false);
  const [selectedContent, setSelectedContent] = useState<{
    type: 'video' | 'article' | 'case-study' | 'case_study' | 'vendor' | 'success_story' | 'failure_story';
    title: string;
    source: string;
    url: string;
  } | null>(null);
  
  const handleContentClick = (item: { type: string; title: string; source: string; url?: string }) => {
    if (item.url && item.url !== '#') {
      setSelectedContent({
        type: item.type as 'video' | 'article' | 'case-study' | 'case_study' | 'vendor' | 'success_story' | 'failure_story',
        title: item.title,
        source: item.source,
        url: item.url
      });
      setViewerOpen(true);
    }
  };
  
  // Get videos for current context
  const getContextVideos = () => {
    const contextKey = currentPage as VideoContextKey;
    const sections = Object.keys(videosBySection);
    
    // Try to find matching section
    for (const section of sections) {
      if (section.toLowerCase().includes(contextKey.toLowerCase()) || 
          contextKey.toLowerCase().includes(section.toLowerCase())) {
        return videosBySection[section]?.slice(0, 6) || [];
      }
    }
    
    // Fallback to general videos
    return videosBySection.general?.slice(0, 6) || [];
  };
  
  const contextVideos = getContextVideos();
  
  const getSuggestions = () => {
    if (isProfileSetup) {
      // Use real videos for profile setup if available
      const profileVideos = contextVideos.map(v => ({
        type: 'video',
        title: v.title,
        source: v.author,
        url: v.link
      }));
      
      return {
        title: 'Getting Started Resources',
        items: profileVideos.length > 0 ? profileVideos : [
          { type: 'video', title: 'Building a Startup: The Complete Guide', source: 'Y Combinator', url: '#' },
          { type: 'article', title: 'From Idea to Launch in 90 Days', source: 'TechCrunch', url: '#' },
          { type: 'case-study', title: 'How Successful Founders Started', source: 'Forbes', url: '#' },
          { type: 'video', title: 'Startup Fundamentals', source: 'Stanford eCorner', url: '#' },
          { type: 'article', title: 'Creating Your Business Roadmap', source: 'Entrepreneur', url: '#' },
          { type: 'case-study', title: 'Zero to One: Startup Stories', source: 'Medium', url: '#' },
        ],
      };
    }
    
    // Use real videos from API if available
    const realVideos = contextVideos.map(v => ({
      type: 'video',
      title: v.title,
      source: v.author,
      url: v.link
    }));
    
    switch (currentPage) {
      case 'idea':
        return {
          title: 'Idea Generation Resources',
          items: realVideos.length > 0 ? realVideos : [
            { type: 'video', title: 'How to Validate Your Business Idea', source: 'Y Combinator', url: '#' },
            { type: 'article', title: 'The Lean Startup Methodology', source: 'Eric Ries', url: '#' },
            { type: 'case-study', title: 'Airbnb: From Idea to Unicorn', source: 'Harvard Business Review', url: '#' },
            { type: 'video', title: 'Finding Product-Market Fit', source: 'a16z', url: '#' },
          ],
        };
      case 'validation':
        return {
          title: 'Validation Best Practices',
          items: [
            { type: 'video', title: 'Market Validation Framework', source: 'Steve Blank' },
            { type: 'article', title: 'Customer Discovery Interviews', source: 'Startup Grind' },
            { type: 'case-study', title: 'Dropbox MVP Strategy', source: 'TechCrunch' },
            { type: 'article', title: 'Competitive Analysis Guide', source: 'CB Insights' },
          ],
        };
      case 'business-plan':
        return {
          title: 'Business Planning Resources',
          items: [
            { type: 'article', title: 'Writing a Modern Business Plan', source: 'Forbes' },
            { type: 'video', title: 'Business Model Canvas Explained', source: 'Strategyzer' },
            { type: 'case-study', title: 'Successful Business Plans', source: 'Inc.com' },
            { type: 'article', title: 'Financial Projections Guide', source: 'Entrepreneur' },
          ],
        };
      case 'planner':
        return {
          title: 'Planning & Organization',
          items: [
            { type: 'video', title: 'Project Planning Fundamentals', source: 'PMI' },
            { type: 'article', title: 'Resource Allocation Strategies', source: 'McKinsey' },
            { type: 'article', title: 'Building Your Team', source: 'First Round Review' },
            { type: 'video', title: 'Startup Budgeting 101', source: 'SaaStr' },
          ],
        };
      case 'implementation':
        return {
          title: 'Execution & Implementation',
          items: [
            { type: 'video', title: 'Agile Project Management', source: 'Scrum.org' },
            { type: 'article', title: 'Building an MVP', source: 'Y Combinator' },
            { type: 'case-study', title: 'Spotify Squad Framework', source: 'Medium' },
            { type: 'article', title: 'Tracking KPIs Effectively', source: 'Andreessen Horowitz' },
          ],
        };
      case 'outcomes':
        return {
          title: 'Measuring Success',
          items: [
            { type: 'article', title: 'Key Metrics for Startups', source: 'a16z' },
            { type: 'video', title: 'Data-Driven Decision Making', source: 'Google Ventures' },
            { type: 'case-study', title: 'Instagram Growth Metrics', source: 'Product Hunt' },
            { type: 'article', title: 'Pivot or Persevere?', source: 'The Lean Startup' },
          ],
        };
      case 'notifications':
        return {
          title: 'Stay Organized',
          items: [
            { type: 'article', title: 'Time Management for Founders', source: 'First Round Review' },
            { type: 'video', title: 'Productivity Hacks', source: 'Y Combinator' },
            { type: 'article', title: 'Managing Multiple Projects', source: 'Harvard Business Review' },
            { type: 'video', title: 'Building Effective Habits', source: 'James Clear' },
          ],
        };
      case 'profile':
        return {
          title: 'Professional Development',
          items: [
            { type: 'article', title: 'Building Your Personal Brand', source: 'LinkedIn Learning' },
            { type: 'video', title: 'Networking for Entrepreneurs', source: 'TED' },
            { type: 'article', title: 'Leadership Skills for Founders', source: 'Harvard Business Review' },
            { type: 'video', title: 'Work-Life Balance', source: 'Y Combinator' },
          ],
        };
      default:
        return { title: 'Resources', items: [] };
    }
  };

  const suggestions = getSuggestions();

  const getIcon = (type: string) => {
    switch (type) {
      case 'video':
        return <Video className="w-5 h-5 text-red-500" />;
      case 'article':
        return <FileText className="w-5 h-5 text-blue-500" />;
      case 'case-study':
      case 'case_study':
        return <BookOpen className="w-5 h-5 text-green-500" />;
      case 'vendor':
        return <Package className="w-5 h-5 text-purple-500" />;
      case 'success':
      case 'success_story':
        return <Trophy className="w-5 h-5 text-yellow-500" />;
      case 'failure':
      case 'failure_story':
        return <AlertCircle className="w-5 h-5 text-orange-500" />;
      default:
        return <ExternalLink className="w-4 h-4" />;
    }
  };
  
  // Get API references if available for 'idea' and 'validation' pages
  const getApiReferences = () => {
    if ((currentPage !== 'idea' && currentPage !== 'validation') || !apiResponse) {
      return [];
    }
    
    // Check both live_references and final_output.references
    const liveRefs = (apiResponse as any).live_references;
    const finalRefs = apiResponse.final_output?.references;
    
    // Prefer live_references if available, otherwise use final_output.references
    const refs = liveRefs || finalRefs;
    
    if (!refs) {
      return [];
    }
    
    const allRefs: Array<{ type: string, title: string, source: string, url: string }> = [];
    
    // Filter out placeholders
    const isPlaceholder = (title: string) => title && title.toLowerCase().includes('placeholder');
    
    // Combine all reference types
    if (refs.videos) {
      refs.videos.forEach((ref: any) => {
        if (!isPlaceholder(ref.title || '')) {
          allRefs.push({ 
            type: 'video', 
            title: ref.title || 'Video Resource', 
            source: ref.author || ref.reason || 'Video', 
            url: ref.link || ref.url || '#'
          });
        }
      });
    }
    if (refs.articles) {
      refs.articles.forEach((ref: any) => {
        if (!isPlaceholder(ref.title || '')) {
          allRefs.push({ 
            type: 'article', 
            title: ref.title || 'Article', 
            source: ref.author || ref.reason || 'Article', 
            url: ref.link || ref.url || '#'
          });
        }
      });
    }
    if (refs.case_studies) {
      refs.case_studies.forEach((ref: any) => {
        if (!isPlaceholder(ref.title || '')) {
          allRefs.push({ 
            type: 'case_study', 
            title: ref.title || 'Case Study', 
            source: ref.author || ref.reason || 'Case Study', 
            url: ref.link || ref.url || '#'
          });
        }
      });
    }
    if (refs.vendors) {
      refs.vendors.forEach((ref: any) => {
        if (!isPlaceholder(ref.title || '')) {
          allRefs.push({ 
            type: 'vendor', 
            title: ref.title || 'Vendor', 
            source: ref.author || ref.reason || 'Vendor', 
            url: ref.link || ref.url || '#'
          });
        }
      });
    }
    if (refs.success_stories) {
      refs.success_stories.forEach((ref: any) => {
        if (!isPlaceholder(ref.title || '')) {
          allRefs.push({ 
            type: 'success_story', 
            title: ref.title || 'Success Story', 
            source: ref.author || ref.reason || 'Success Story', 
            url: ref.link || ref.url || '#'
          });
        }
      });
    }
    if (refs.failure_stories) {
      refs.failure_stories.forEach((ref: any) => {
        if (!isPlaceholder(ref.title || '')) {
          allRefs.push({ 
            type: 'failure_story', 
            title: ref.title || 'Failure Story', 
            source: ref.author || ref.reason || 'Lesson Learned', 
            url: ref.link || ref.url || '#'
          });
        }
      });
    }
    
    return allRefs; // Return all non-placeholder items
  };
  
  // Get plan references for business-plan, planner, implementation, outcomes pages
  const getPlanReferences = () => {
    const planPages = ['business-plan', 'planner', 'implementation', 'outcomes'];
    if (!planPages.includes(currentPage) || !planResponse) {
      return [];
    }
    
    // Check both live_references and final_output.references
    const liveRefs = (planResponse as any).live_references;
    const finalRefs = planResponse.final_output?.references;
    
    // Prefer live_references if available, otherwise use final_output.references
    const refs = liveRefs || finalRefs;
    
    if (!refs) {
      return [];
    }
    const allRefs: Array<{ type: string, title: string, source: string, url: string }> = [];
    
    // Filter out placeholders
    const isPlaceholder = (title: string) => title.toLowerCase().includes('placeholder');
    
    // Combine all reference types
    if (refs.videos) {
      refs.videos.forEach((ref: any) => {
        if (!isPlaceholder(ref.title || '')) {
          allRefs.push({ 
            type: 'video', 
            title: ref.title || 'Video Resource', 
            source: ref.author || 'Video', 
            url: ref.link || '#'
          });
        }
      });
    }
    if (refs.articles) {
      refs.articles.forEach((ref: any) => {
        if (!isPlaceholder(ref.title || '')) {
          allRefs.push({ 
            type: 'article', 
            title: ref.title || 'Article', 
            source: ref.author || 'Article', 
            url: ref.link || '#'
          });
        }
      });
    }
    if (refs.case_studies) {
      refs.case_studies.forEach((ref: any) => {
        if (!isPlaceholder(ref.title || '')) {
          allRefs.push({ 
            type: 'case_study', 
            title: ref.title || 'Case Study', 
            source: ref.author || 'Case Study', 
            url: ref.link || '#'
          });
        }
      });
    }
    if (refs.vendors) {
      refs.vendors.forEach((ref: any) => {
        if (!isPlaceholder(ref.title || '')) {
          allRefs.push({ 
            type: 'vendor', 
            title: ref.title || 'Vendor', 
            source: ref.author || 'Vendor', 
            url: ref.link || '#'
          });
        }
      });
    }
    if (refs.success_stories) {
      refs.success_stories.forEach((ref: any) => {
        if (!isPlaceholder(ref.title || '')) {
          allRefs.push({ 
            type: 'success_story', 
            title: ref.title || 'Success Story', 
            source: ref.author || 'Success Story', 
            url: ref.link || '#'
          });
        }
      });
    }
    if (refs.failure_stories) {
      refs.failure_stories.forEach((ref: any) => {
        if (!isPlaceholder(ref.title || '')) {
          allRefs.push({ 
            type: 'failure_story', 
            title: ref.title || 'Failure Story', 
            source: ref.author || 'Lesson Learned', 
            url: ref.link || '#'
          });
        }
      });
    }
    
    return allRefs; // Return all non-placeholder items
  };

  const apiReferences = getApiReferences();
  const planReferences = getPlanReferences();
  
  // Determine which references to show
  // For validation page: use API references (same as Idea page)
  // For plan pages: use plan references
  // For idea page: use API references
  const displayReferences = planReferences.length > 0 
    ? planReferences 
    : apiReferences;

  return (
    <aside className="w-80 bg-white border-l border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-gray-900">Suggestions</h2>
        <p className="text-sm text-gray-500 mt-1">Resources to help you succeed</p>
      </div>
      
      <ScrollArea className="h-[calc(100vh-100px)]">
        <div className="p-4 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">
                {displayReferences.length > 0 
                  ? (currentPage === 'validation' 
                      ? 'Validation Resources' 
                      : currentPage === 'business-plan'
                        ? 'Business Planning Resources'
                        : currentPage === 'planner'
                          ? 'Planning Resources'
                          : currentPage === 'implementation'
                            ? 'Implementation Resources'
                            : currentPage === 'outcomes'
                              ? 'Success Metrics Resources'
                              : 'Idea Generation Resources')
                  : suggestions.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {displayReferences.length > 0 ? (
                // Show API/Validation references when available
                displayReferences.map((item, index) => (
                  <button
                    key={index}
                    onClick={() => handleContentClick(item)}
                    className="w-full flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors group text-left"
                  >
                    <div className="mt-0.5">{getIcon(item.type)}</div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-900 group-hover:text-blue-600 transition-colors">
                        {item.title}
                      </p>
                      <p className="text-xs text-gray-500 mt-0.5">{item.source}</p>
                    </div>
                    <ExternalLink className="w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </button>
                ))
              ) : (
                // Show default suggestions
                suggestions.items.map((item, index) => (
                  <button
                    key={index}
                    onClick={() => handleContentClick(item)}
                    className="w-full flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors group text-left"
                  >
                    <div className="mt-0.5">{getIcon(item.type)}</div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-900 group-hover:text-blue-600 transition-colors">
                        {item.title}
                      </p>
                      <p className="text-xs text-gray-500 mt-0.5">{item.source}</p>
                    </div>
                    <ExternalLink className="w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </button>
                ))
              )}
            </CardContent>
          </Card>

          {currentIdea && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Related to Your Idea</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <a href="#" className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors group">
                  <Youtube className="w-4 h-4 text-red-500 mt-0.5" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-900 group-hover:text-blue-600 transition-colors">
                      Similar Success Stories
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5">Case Studies</p>
                  </div>
                  <ExternalLink className="w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                </a>
                <a href="#" className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors group">
                  <FileText className="w-4 h-4 text-blue-500 mt-0.5" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-900 group-hover:text-blue-600 transition-colors">
                      Market Analysis Tools
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5">Resources</p>
                  </div>
                  <ExternalLink className="w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                </a>
              </CardContent>
            </Card>
          )}
        </div>
      </ScrollArea>
      
      <ContentViewerDialog
        isOpen={viewerOpen}
        onClose={() => setViewerOpen(false)}
        content={selectedContent}
      />
    </aside>
  );
}
