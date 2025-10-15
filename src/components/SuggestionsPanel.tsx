import { ExternalLink, Youtube, FileText, BookOpen } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { ScrollArea } from './ui/scroll-area';
import { Idea } from '../App';

interface SuggestionsPanelProps {
  currentPage: string;
  currentIdea: Idea | null;
  isProfileSetup?: boolean;
}

export function SuggestionsPanel({ currentPage, currentIdea, isProfileSetup = false }: SuggestionsPanelProps) {
  const getSuggestions = () => {
    if (isProfileSetup) {
      return {
        title: 'Getting Started Resources',
        items: [
          { type: 'video', title: 'Building a Startup: The Complete Guide', source: 'Y Combinator' },
          { type: 'article', title: 'From Idea to Launch in 90 Days', source: 'TechCrunch' },
          { type: 'case-study', title: 'How Successful Founders Started', source: 'Forbes' },
          { type: 'video', title: 'Startup Fundamentals', source: 'Stanford eCorner' },
          { type: 'article', title: 'Creating Your Business Roadmap', source: 'Entrepreneur' },
          { type: 'case-study', title: 'Zero to One: Startup Stories', source: 'Medium' },
        ],
      };
    }
    
    switch (currentPage) {
      case 'idea':
        return {
          title: 'Idea Generation Resources',
          items: [
            { type: 'video', title: 'How to Validate Your Business Idea', source: 'Y Combinator' },
            { type: 'article', title: 'The Lean Startup Methodology', source: 'Eric Ries' },
            { type: 'case-study', title: 'Airbnb: From Idea to Unicorn', source: 'Harvard Business Review' },
            { type: 'video', title: 'Finding Product-Market Fit', source: 'a16z' },
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
      default:
        return { title: 'Resources', items: [] };
    }
  };

  const suggestions = getSuggestions();

  const getIcon = (type: string) => {
    switch (type) {
      case 'video':
        return <Youtube className="w-4 h-4 text-red-500" />;
      case 'article':
        return <FileText className="w-4 h-4 text-blue-500" />;
      case 'case-study':
        return <BookOpen className="w-4 h-4 text-green-500" />;
      default:
        return <ExternalLink className="w-4 h-4" />;
    }
  };

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
              <CardTitle className="text-base">{suggestions.title}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {suggestions.items.map((item, index) => (
                <a
                  key={index}
                  href="#"
                  className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors group"
                >
                  <div className="mt-0.5">{getIcon(item.type)}</div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-900 group-hover:text-blue-600 transition-colors">
                      {item.title}
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5">{item.source}</p>
                  </div>
                  <ExternalLink className="w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                </a>
              ))}
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
    </aside>
  );
}
