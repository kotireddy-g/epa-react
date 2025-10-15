import { useState } from 'react';
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
import { Idea } from '../App';

interface IdeaPageProps {
  ideas: Idea[];
  onIdeaSubmit: (idea: Idea) => void;
  onIdeaAccept: (idea: Idea) => void;
  onIdeaUpdate: (idea: Idea) => void;
}

export function IdeaPage({ ideas, onIdeaSubmit, onIdeaAccept, onIdeaUpdate }: IdeaPageProps) {
  const [summary, setSummary] = useState('');
  const [description, setDescription] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [submittedIdea, setSubmittedIdea] = useState<Idea | null>(null);
  const [showNewIdeaForm, setShowNewIdeaForm] = useState(false);
  const [showExplanationDialog, setShowExplanationDialog] = useState(false);

  const handleSubmit = () => {
    if (!summary.trim() || !description.trim()) {
      alert('Please provide both summary and description');
      return;
    }

    // Simulate AI summarization into bullet points
    const bulletPoints = generateBulletPoints(description);

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
  };

  const generateBulletPoints = (text: string): string[] => {
    // Simulate AI bullet point generation
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

  const handleAccept = () => {
    if (submittedIdea) {
      onIdeaAccept(submittedIdea);
      setSummary('');
      setDescription('');
      setSubmittedIdea(null);
      setShowNewIdeaForm(false);
    }
  };

  const handleReject = () => {
    setSubmittedIdea(null);
    setSummary('');
    setDescription('');
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
      <div className="mb-8">
        <h1 className="text-gray-900 mb-2">Your IDEAS</h1>
        <p className="text-gray-600">Transform your ideas into actionable business plans</p>
      </div>

      {/* Previously Created Ideas */}
      {activeIdeas.length > 0 && (
        <div className="mb-8">
          <h2 className="text-gray-900 mb-4">Previously Created IDEAS</h2>
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
      {!showNewIdeaForm && !submittedIdea && (
        <Button 
          onClick={() => setShowExplanationDialog(true)}
          size="lg"
          className="mb-8 gap-2"
        >
          <Plus className="w-5 h-5" />
          Create New IDEA
        </Button>
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
              <Button onClick={handleSubmit} size="lg">
                Submit IDEA for Analysis
              </Button>
              <Button 
                variant="outline" 
                onClick={() => {
                  setShowNewIdeaForm(false);
                  setSummary('');
                  setDescription('');
                }}
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

      {/* Submitted Idea Review */}
      {submittedIdea && (
        <Card className="border-blue-200 bg-blue-50">
          <CardHeader>
            <CardTitle className="text-blue-900">IDEA Analysis Complete</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="text-gray-900 mb-2">{submittedIdea.summary}</h3>
              <p className="text-gray-700 mb-4">{submittedIdea.description}</p>
            </div>

            <div>
              <h3 className="text-gray-900 mb-3">Key Points Summary</h3>
              <ul className="space-y-2">
                {submittedIdea.bulletPoints.map((point, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center flex-shrink-0 mt-0.5">
                      {index + 1}
                    </div>
                    <span className="text-gray-700">{point}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex items-center gap-3 pt-4 border-t border-blue-200">
              <Button onClick={handleAccept} size="lg" className="gap-2">
                <Check className="w-5 h-5" />
                Accept & Continue to Validation
              </Button>
              <Button variant="outline" onClick={handleReject} className="gap-2">
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
