import { useState, useRef, useEffect } from 'react';
import { Plus, MoreVertical, Edit, XCircle, Mic, Check, X } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu';
import { Badge } from './ui/badge';
import { FeedbackButton } from './FeedbackButton';
import { NotesButton } from './NotesButton';
import { IdeaExplanationDialog } from './IdeaExplanationDialog';
import { LoadingAnimation } from './LoadingAnimation';
import { MarkdownRenderer } from './MarkdownRenderer';
import { Idea } from '../App';
import { authApi } from '../services/authApi';

interface IdeaPageProps {
  ideas: Idea[];
  onIdeaSubmit: (idea: Idea) => void;
  onIdeaAccept: (idea: Idea) => void;
  onIdeaUpdate: (idea: Idea) => void;
}

interface SavedIdea {
  id: number;
  title: string;
  description: string;
  category: string;
  status: string;
  created_at: string;
  updated_at: string;
  user: number;
}

export function IdeaPage({ ideas, onIdeaSubmit, onIdeaAccept, onIdeaUpdate }: IdeaPageProps) {
  const [summary, setSummary] = useState('');
  const [description, setDescription] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [submittedIdea, setSubmittedIdea] = useState<Idea | null>(null);
  const [showNewIdeaForm, setShowNewIdeaForm] = useState(false);
  const [showExplanationDialog, setShowExplanationDialog] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [apiResponse, setApiResponse] = useState<string>('');
  const [savedIdeas, setSavedIdeas] = useState<SavedIdea[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const loadingRef = useRef<HTMLDivElement>(null);

  const API_BASE_URL = 'http://192.168.1.111:8089';
  
  // IMPORTANT: Always use authApi.getAccessToken() for authentication
  // NEVER hardcode access tokens - they expire and change on each login

  // Auto-scroll to loading animation when it appears
  useEffect(() => {
    if (isLoading && loadingRef.current) {
      loadingRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [isLoading]);

  // Fetch saved ideas from API on mount
  useEffect(() => {
    fetchSavedIdeas();
  }, []);

  const fetchSavedIdeas = async () => {
    try {
      const accessToken = authApi.getAccessToken();
      if (!accessToken) {
        console.error('[IdeaPage] No access token available');
        return;
      }

      const response = await fetch(`${API_BASE_URL}/idea/ideas/`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setSavedIdeas(data);
      }
    } catch (error) {
      console.error('Error fetching saved ideas:', error);
    }
  };

  const handleSubmit = async () => {
    if (!summary.trim() || !description.trim()) {
      alert('Please provide both summary and description');
      return;
    }

    setIsLoading(true);
    setApiResponse('');

    try {
      // Combine summary and description for the API query
      const combinedQuery = `${summary}. ${description}`;

      const response = await fetch('http://192.168.1.111:8089/api/query/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: combinedQuery,
          use_judge: true,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch idea analysis');
      }

      const data = await response.json();
      setApiResponse(data.answer || '');

      // Generate bullet points from the API response
      const bulletPoints = generateBulletPoints(data.answer || description);

      const newIdea: Idea = {
        id: Date.now().toString(),
        summary,
        description,
        bulletPoints,
        status: 'draft',
        createdAt: new Date(),
        isActive: true,
      };

      setSubmittedIdea(newIdea);
      onIdeaSubmit(newIdea);
    } catch (error) {
      console.error('Error submitting idea:', error);
      alert('Failed to analyze idea. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const generateBulletPoints = (text: string): string[] => {
    // Extract key points from markdown response
    const lines = text.split('\n').filter(line => line.trim().startsWith('-') || line.trim().startsWith('*'));
    
    if (lines.length > 0) {
      return lines.slice(0, 6).map(line => line.replace(/^[-*]\s+/, '').replace(/\*\*/g, ''));
    }
    
    // Fallback to sentence-based extraction
    const sentences = text.split('.').filter(s => s.trim().length > 0);
    const points = [];
    
    if (sentences.length > 0) points.push(`Core Concept: ${sentences[0].trim()}`);
    if (sentences.length > 1) points.push(`Target Market: ${sentences[1]?.trim() || 'To be defined'}`);
    points.push('Unique Value Proposition: Innovative solution to market needs');
    points.push('Revenue Model: Multiple revenue streams identified');
    points.push('Competitive Advantage: First-mover advantage in niche market');
    points.push('Growth Potential: Scalable business model');
    
    return points.slice(0, 6);
  };

  const handleAccept = async () => {
    if (!submittedIdea) return;

    setIsSaving(true);
    try {
      // Get user ID from localStorage
      const sessionData = localStorage.getItem('executionPlannerSession');
      let userId = 1; // Default user ID
      
      if (sessionData) {
        const session = JSON.parse(sessionData);
        userId = session.userProfile?.userId || 1;
      }

      // Save idea to API
      const accessToken = authApi.getAccessToken();
      if (!accessToken) {
        console.error('[IdeaPage] No access token available for saving idea');
        setIsSaving(false);
        return;
      }

      const response = await fetch(`${API_BASE_URL}/idea/ideas/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: submittedIdea.summary,
          description: submittedIdea.description,
          user: userId,
          category: 'General',
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to save idea');
      }

      // Refresh saved ideas list
      await fetchSavedIdeas();

      // Continue with existing flow
      onIdeaAccept(submittedIdea);
      setSummary('');
      setDescription('');
      setSubmittedIdea(null);
      setShowNewIdeaForm(false);
      setApiResponse('');
    } catch (error) {
      console.error('Error saving idea:', error);
      alert('Failed to save idea. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleReject = () => {
    setSubmittedIdea(null);
    setSummary('');
    setDescription('');
    setApiResponse('');
  };

  const handleDeactivate = (idea: Idea) => {
    const updated = { ...idea, isActive: false };
    onIdeaUpdate(updated);
  };

  const toggleRecording = () => {
    setIsRecording(!isRecording);
    // In a real app, this would integrate with Web Speech API
    if (!isRecording) {
      alert('Voice recording would start here. In a real implementation, this would use the Web Speech API.');
    }
  };

  const activeIdeas = ideas.filter(i => i.isActive);

  return (
    <div className="p-8 max-w-6xl mx-auto">
      {/* Initial View - Only show when no form is active */}
      {!showNewIdeaForm && !submittedIdea && !isLoading && (
        <>
          <div className="mb-8">
            <h1 className="text-gray-900 mb-2">Your IDEAS</h1>
            <p className="text-gray-600">Transform your ideas into actionable business plans</p>
          </div>

          {/* Draft Ideas (local) - Show first */}
          {activeIdeas.length > 0 && (
            <div className="mb-8">
              <h2 className="text-gray-900 mb-4">Draft IDEAS</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {activeIdeas.map((idea) => (
                  <Card key={idea.id} className="relative hover:shadow-md transition-shadow">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <CardTitle className="text-base line-clamp-2">{idea.summary}</CardTitle>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <MoreVertical className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Edit className="w-4 h-4 mr-2" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              className="text-red-600"
                              onClick={() => handleDeactivate(idea)}
                            >
                              <XCircle className="w-4 h-4 mr-2" />
                              Deactivate
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-600 line-clamp-3 mb-3">{idea.description}</p>
                      <Badge variant={idea.status === 'active' ? 'default' : 'secondary'}>
                        {idea.status}
                      </Badge>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* New Idea Button */}
          <Button 
            onClick={() => setShowExplanationDialog(true)}
            size="lg"
            className="mb-8 gap-2"
          >
            <Plus className="w-5 h-5" />
            Create New IDEA
          </Button>

          {/* Previously Created IDEAS from API - Show after button */}
          {savedIdeas.length > 0 && (
            <div className="mb-8">
              <h2 className="text-gray-900 mb-4">Previously Created IDEAS</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {savedIdeas.map((idea) => (
                  <Card key={idea.id} className="relative hover:shadow-md transition-shadow">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <CardTitle className="text-base line-clamp-2">{idea.title}</CardTitle>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <MoreVertical className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Edit className="w-4 h-4 mr-2" />
                              Edit
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-600 line-clamp-3 mb-3">{idea.description}</p>
                      <Badge variant={idea.status === 'Approved' ? 'default' : 'secondary'}>
                        {idea.status}
                      </Badge>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </>
      )}


      {/* Idea Explanation Dialog */}
      <IdeaExplanationDialog
        isOpen={showExplanationDialog}
        onClose={() => setShowExplanationDialog(false)}
        onContinue={() => setShowNewIdeaForm(true)}
      />

      {/* New Idea Form */}
      {(showNewIdeaForm || submittedIdea) && !submittedIdea && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Create New IDEA</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Summary Search Bar */}
            <div>
              <label className="block mb-2 text-gray-700">Idea Summary</label>
              <Input
                placeholder="Enter a brief summary of your idea..."
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                className="text-lg p-6"
              />
            </div>

            {/* Detailed Description */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-gray-700">Detailed Description</label>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500">
                    {description.length} / 3000 characters
                  </span>
                  <Button
                    variant={isRecording ? 'destructive' : 'outline'}
                    size="sm"
                    onClick={toggleRecording}
                    className="gap-2"
                  >
                    <Mic className="w-4 h-4" />
                    {isRecording ? 'Stop Recording' : 'Voice Input'}
                  </Button>
                </div>
              </div>
              <Textarea
                placeholder="Describe your idea in detail (up to 3000 words). Include the problem you're solving, target market, unique value proposition, and your vision..."
                value={description}
                onChange={(e) => setDescription(e.target.value.slice(0, 3000))}
                className="min-h-[300px] text-base"
              />
            </div>

            <div className="flex items-center gap-3">
              <Button onClick={handleSubmit} size="lg" disabled={isLoading}>
                {isLoading ? 'Analyzing...' : 'Submit IDEA for Analysis'}
              </Button>
              <Button 
                variant="outline" 
                onClick={() => {
                  setShowNewIdeaForm(false);
                  setSummary('');
                  setDescription('');
                }}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <div className="ml-auto flex gap-2">
                <FeedbackButton itemId="new-idea" itemType="idea" />
                <NotesButton itemId="new-idea" itemType="idea" />
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Loading Animation */}
      {isLoading && (
        <div ref={loadingRef}>
          <Card className="border-blue-200 bg-white">
            <CardContent className="p-0">
              <LoadingAnimation />
            </CardContent>
          </Card>
        </div>
      )}

      {/* Submitted Idea Review */}
      {submittedIdea && !isLoading && (
        <Card className="border-blue-200 bg-blue-50">
          <CardHeader>
            <CardTitle className="text-blue-900">IDEA Analysis Complete</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="text-gray-900 mb-2">{submittedIdea.summary}</h3>
              <p className="text-gray-700 mb-4">{submittedIdea.description}</p>
            </div>

            {/* API Response in Markdown */}
            {apiResponse && (
              <div className="bg-white p-6 rounded-lg border border-blue-200">
                <MarkdownRenderer content={apiResponse} />
              </div>
            )}

            <div className="flex items-center gap-3 pt-4 border-t border-blue-200">
              <Button onClick={handleAccept} size="lg" className="gap-2" disabled={isSaving}>
                <Check className="w-5 h-5" />
                {isSaving ? 'Saving...' : 'Accept & Continue to Validation'}
              </Button>
              <Button variant="outline" onClick={handleReject} className="gap-2" disabled={isSaving}>
                <X className="w-5 h-5" />
                Reject & Revise
              </Button>
              <div className="ml-auto flex gap-2">
                <FeedbackButton itemId={submittedIdea.id} itemType="idea" />
                <NotesButton itemId={submittedIdea.id} itemType="idea" />
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
