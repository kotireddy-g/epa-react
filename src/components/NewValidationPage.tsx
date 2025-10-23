import { useState } from 'react';
import { CheckCircle2, AlertCircle } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Label } from './ui/label';
import { Progress } from './ui/progress';
import { Idea } from '../App';
import { ideaAnalysisApi, ValidationResponse } from '../services/ideaAnalysisApi';
import { AnalyzingDialog } from './AnalyzingDialog';
import { AIFollowupQuestionsDialog } from './AIFollowupQuestionsDialog';

interface ValidationPageProps {
  idea: Idea;
  onComplete: (validationData: any, score: number) => void;
  ideaId: string;
  detailedDescription: string;
  companyName: string;
  industryCategory: string;
  domain: string;
  onValidationResponse?: (response: ValidationResponse | null) => void;
}


const VALIDATION_QUESTIONS = {
  idea: [
    {
      id: 'I1',
      question: 'How clearly can you describe your idea in one sentence?',
      options: [
        { label: 'A) Very clearly', value: 'a', score: 5 },
        { label: 'B) Somewhat clearly', value: 'b', score: 3 },
        { label: 'C) Not sure / still thinking', value: 'c', score: 1 }
      ]
    },
    {
      id: 'I2',
      question: 'Have you identified the main problem your idea solves?',
      options: [
        { label: 'A) Yes, clearly', value: 'a', score: 5 },
        { label: 'B) Partially', value: 'b', score: 3 },
        { label: 'C) Not yet', value: 'c', score: 1 }
      ]
    },
    {
      id: 'I3',
      question: 'Have you checked if similar ideas already exist?',
      options: [
        { label: 'A) Yes, and mine is different', value: 'a', score: 5 },
        { label: 'B) Yes, but not deeply', value: 'b', score: 3 },
        { label: 'C) No', value: 'c', score: 1 }
      ]
    },
    {
      id: 'I4',
      question: 'Do you have a clear target audience in mind?',
      options: [
        { label: 'A) Yes', value: 'a', score: 5 },
        { label: 'B) Somewhat', value: 'b', score: 3 },
        { label: 'C) No', value: 'c', score: 1 }
      ]
    },
    {
      id: 'I5',
      question: 'Can you explain how your idea will create value for users?',
      options: [
        { label: 'A) Strongly', value: 'a', score: 5 },
        { label: 'B) Partly', value: 'b', score: 3 },
        { label: 'C) Unsure', value: 'c', score: 1 }
      ]
    }
  ],
  persona: [
    {
      id: 'P1',
      question: 'How confident are you in executing your idea?',
      options: [
        { label: 'A) Very confident', value: 'a', score: 5 },
        { label: 'B) Somewhat confident', value: 'b', score: 3 },
        { label: 'C) Not confident', value: 'c', score: 1 }
      ]
    },
    {
      id: 'P2',
      question: 'Do you have prior experience in this domain or industry?',
      options: [
        { label: 'A) Yes', value: 'a', score: 5 },
        { label: 'B) Some experience', value: 'b', score: 3 },
        { label: 'C) No experience', value: 'c', score: 1 }
      ]
    },
    {
      id: 'P3',
      question: 'Are you ready to handle challenges and setbacks?',
      options: [
        { label: 'A) Absolutely', value: 'a', score: 5 },
        { label: 'B) Maybe', value: 'b', score: 3 },
        { label: 'C) Not sure', value: 'c', score: 1 }
      ]
    },
    {
      id: 'P4',
      question: "Are you open to learning new skills for your idea's success?",
      options: [
        { label: 'A) Definitely', value: 'a', score: 5 },
        { label: 'B) Maybe', value: 'b', score: 3 },
        { label: 'C) Not really', value: 'c', score: 1 }
      ]
    },
    {
      id: 'P5',
      question: 'Do you have a clear reason or motivation for pursuing this idea?',
      options: [
        { label: 'A) Yes, strongly', value: 'a', score: 5 },
        { label: 'B) Somewhat', value: 'b', score: 3 },
        { label: 'C) Not yet', value: 'c', score: 1 }
      ]
    }
  ],
  network: [
    {
      id: 'N1',
      question: "Do you know anyone who can help with your idea's development?",
      options: [
        { label: 'A) Yes, multiple', value: 'a', score: 5 },
        { label: 'B) A few', value: 'b', score: 3 },
        { label: 'C) None yet', value: 'c', score: 1 }
      ]
    },
    {
      id: 'N2',
      question: 'Are you connected to a professional community or startup network?',
      options: [
        { label: 'A) Yes', value: 'a', score: 5 },
        { label: 'B) Somewhat', value: 'b', score: 3 },
        { label: 'C) Not yet', value: 'c', score: 1 }
      ]
    },
    {
      id: 'N3',
      question: 'Have you identified potential collaborators or co-founders?',
      options: [
        { label: 'A) Yes', value: 'a', score: 5 },
        { label: 'B) In progress', value: 'b', score: 3 },
        { label: 'C) Not yet', value: 'c', score: 1 }
      ]
    },
    {
      id: 'N4',
      question: 'Are you open to joining accelerators or incubators?',
      options: [
        { label: 'A) Definitely', value: 'a', score: 5 },
        { label: 'B) Maybe', value: 'b', score: 3 },
        { label: 'C) Not now', value: 'c', score: 1 }
      ]
    },
    {
      id: 'N5',
      question: 'How would you rate your network in your business domain?',
      options: [
        { label: 'A) A solid set of contacts', value: 'a', score: 5 },
        { label: 'B) A few acquaintances', value: 'b', score: 3 },
        { label: 'C) No network', value: 'c', score: 1 }
      ]
    }
  ],
  financial: [
    {
      id: 'F1',
      question: 'Do you have an estimated budget for your idea?',
      options: [
        { label: 'A) Yes, detailed', value: 'a', score: 5 },
        { label: 'B) Rough estimate', value: 'b', score: 3 },
        { label: 'C) Not yet', value: 'c', score: 1 }
      ]
    },
    {
      id: 'F2',
      question: 'Have you considered funding options (loans, investors, grants)?',
      options: [
        { label: 'A) Yes', value: 'a', score: 5 },
        { label: 'B) Partially', value: 'b', score: 3 },
        { label: 'C) Not yet', value: 'c', score: 1 }
      ]
    },
    {
      id: 'F3',
      question: 'How familiar are you with startup costs in your industry?',
      options: [
        { label: 'A) Well-researched', value: 'a', score: 5 },
        { label: 'B) Somewhat familiar', value: 'b', score: 3 },
        { label: 'C) Not familiar', value: 'c', score: 1 }
      ]
    },
    {
      id: 'F4',
      question: 'Have you identified possible revenue sources or models?',
      options: [
        { label: 'A) Yes', value: 'a', score: 5 },
        { label: 'B) Somewhat', value: 'b', score: 3 },
        { label: 'C) No', value: 'c', score: 1 }
      ]
    },
    {
      id: 'F5',
      question: 'Are you prepared for at least 6 months of expenses without profit?',
      options: [
        { label: 'A) Yes', value: 'a', score: 5 },
        { label: 'B) Maybe', value: 'b', score: 3 },
        { label: 'C) No', value: 'c', score: 1 }
      ]
    }
  ]
};

export function NewValidationPage({
  onComplete,
  ideaId,
  detailedDescription,
  companyName,
  industryCategory,
  domain,
  onValidationResponse
}: ValidationPageProps) {
  const [currentSection, setCurrentSection] = useState<'idea' | 'persona' | 'network' | 'financial'>('idea');
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [isValidating, setIsValidating] = useState(false);
  const [validationResponse, setValidationResponse] = useState<ValidationResponse | null>(null);
  const [showFollowupDialog, setShowFollowupDialog] = useState(false);

  // Calculate per-section confidence using formula: Sum of selected option values / 25 × 100
  const calculateSectionConfidence = (sectionKey: keyof typeof VALIDATION_QUESTIONS) => {
    const questions = VALIDATION_QUESTIONS[sectionKey];
    let totalScore = 0;
    questions.forEach((q) => {
      const answer = answers[q.id];
      if (answer) {
        const option = q.options.find(opt => opt.value === answer);
        if (option) {
          totalScore += option.score;
        }
      }
    });
    // Formula: Sum / 25 * 100
    return Math.round((totalScore / 25) * 100);
  };

  const ideaConfidence = calculateSectionConfidence('idea');
  const personaConfidence = calculateSectionConfidence('persona');
  const networkConfidence = calculateSectionConfidence('network');
  const financialConfidence = calculateSectionConfidence('financial');
  const overallConfidence = Math.round((ideaConfidence + personaConfidence + networkConfidence + financialConfidence) / 4);

  // Interpretations
  const getInterpretation = (score: number) => {
    if (score >= 80) return { label: 'High Confidence', color: 'text-green-600' };
    if (score >= 50) return { label: 'Medium Confidence', color: 'text-yellow-600' };
    return { label: 'Low Confidence', color: 'text-red-600' };
  };

  // Check if current section is complete
  const isSectionComplete = (sectionKey: keyof typeof VALIDATION_QUESTIONS) => {
    return VALIDATION_QUESTIONS[sectionKey].every(q => answers[q.id]);
  };

  // Check if all sections are complete
  const allSectionsComplete = Object.keys(VALIDATION_QUESTIONS).every(section =>
    isSectionComplete(section as keyof typeof VALIDATION_QUESTIONS)
  );

  const handleAnswerChange = (questionId: string, value: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }));
  };

  const handleSubmitValidation = async () => {
    if (overallConfidence < 76) {
      alert('Overall confidence score must be at least 76% to proceed.');
      return;
    }

    setIsValidating(true);

    try {
      // Build validation questions payload
      const validationQuestions = {
        idea: VALIDATION_QUESTIONS.idea.map(q => ({
          question_id: q.id,
          question: q.question,
          answer: q.options.find(opt => opt.value === answers[q.id])?.label || ''
        })),
        persona: VALIDATION_QUESTIONS.persona.map(q => ({
          question_id: q.id,
          question: q.question,
          answer: q.options.find(opt => opt.value === answers[q.id])?.label || ''
        })),
        financial: VALIDATION_QUESTIONS.financial.map(q => ({
          question_id: q.id,
          question: q.question,
          answer: q.options.find(opt => opt.value === answers[q.id])?.label || ''
        })),
        network: VALIDATION_QUESTIONS.network.map(q => ({
          question_id: q.id,
          question: q.question,
          answer: q.options.find(opt => opt.value === answers[q.id])?.label || ''
        }))
      };

      const payload = {
        idea_id: ideaId,
        idea_detailed_description: detailedDescription,
        industry_category: industryCategory,
        domain: domain,
        confirmed_company_name: companyName,
        validation_questions: validationQuestions,
        meta: {
          submitted_on: new Date().toISOString(),
          version: '1.0'
        }
      };

      const response = await ideaAnalysisApi.validateIdea(payload);
      setValidationResponse(response);
      onValidationResponse?.(response);
      
      // Show follow-up questions dialog
      setShowFollowupDialog(true);
    } catch (error: any) {
      console.error('Validation error:', error);
      if (error?.message?.toLowerCase().includes('unauthorized')) {
        alert('Session expired or unauthorized. Please login again to continue.');
      } else {
        alert('Failed to validate idea. Please try again.');
      }
    } finally {
      setIsValidating(false);
    }
  };

  const handleFollowupComplete = () => {
    setShowFollowupDialog(false);
    onComplete(validationResponse, overallConfidence);
  };

  const sections = [
    { key: 'idea', title: 'Idea Validation', icon: '💡' },
    { key: 'persona', title: 'Persona Validation', icon: '👤' },
    { key: 'network', title: 'Network Validation', icon: '🤝' },
    { key: 'financial', title: 'Financial Validation', icon: '💰' }
  ];

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Idea Validation</h1>
        <p className="text-gray-600">Answer all questions to validate your business idea</p>
      </div>

      {/* Overall Confidence Score */}
      <Card className="mb-6 border-blue-200 bg-blue-50">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Overall Confidence Score</span>
            <span className={`text-2xl font-bold ${overallConfidence >= 76 ? 'text-green-600' : 'text-orange-600'}`}>
              {overallConfidence}%
            </span>
          </div>
          <Progress value={overallConfidence} className="h-3" />
          <p className="text-xs text-gray-600 mt-2">
            {overallConfidence >= 76 ? (
              <span className="flex items-center gap-1 text-green-600">
                <CheckCircle2 className="w-4 h-4" />
                Ready to submit! Your confidence score meets the minimum requirement.
              </span>
            ) : (
              <span className="flex items-center gap-1 text-orange-600">
                <AlertCircle className="w-4 h-4" />
                Need {76 - overallConfidence}% more to reach minimum 76% confidence score
              </span>
            )}
          </p>
          {/* Per-Section Scores */}
          <div className="grid grid-cols-4 gap-2 mt-4">
            <div className="text-center p-2 bg-white rounded">
              <div className="text-xs text-gray-600">Idea</div>
              <div className={`text-sm font-bold ${getInterpretation(ideaConfidence).color}`}>{ideaConfidence}%</div>
            </div>
            <div className="text-center p-2 bg-white rounded">
              <div className="text-xs text-gray-600">Persona</div>
              <div className={`text-sm font-bold ${getInterpretation(personaConfidence).color}`}>{personaConfidence}%</div>
            </div>
            <div className="text-center p-2 bg-white rounded">
              <div className="text-xs text-gray-600">Financial</div>
              <div className={`text-sm font-bold ${getInterpretation(financialConfidence).color}`}>{financialConfidence}%</div>
            </div>
            <div className="text-center p-2 bg-white rounded">
              <div className="text-xs text-gray-600">Network</div>
              <div className={`text-sm font-bold ${getInterpretation(networkConfidence).color}`}>{networkConfidence}%</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Section Tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto">
        {sections.map((section) => (
          <button
            key={section.key}
            onClick={() => setCurrentSection(section.key as any)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg border-2 transition-all whitespace-nowrap ${
              currentSection === section.key
                ? 'border-blue-500 bg-blue-50 text-blue-700'
                : isSectionComplete(section.key as any)
                ? 'border-green-500 bg-green-50 text-green-700'
                : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
            }`}
          >
            <span className="text-xl">{section.icon}</span>
            <span className="font-medium">{section.title}</span>
            {isSectionComplete(section.key as any) && (
              <CheckCircle2 className="w-5 h-5 text-green-600" />
            )}
          </button>
        ))}
      </div>

      {/* Questions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span className="text-2xl">
              {sections.find(s => s.key === currentSection)?.icon}
            </span>
            {sections.find(s => s.key === currentSection)?.title}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {VALIDATION_QUESTIONS[currentSection].map((question, index) => (
            <div key={question.id} className="space-y-3">
              <Label className="text-base font-medium text-gray-900">
                {index + 1}. {question.question}
              </Label>
              <RadioGroup
                value={answers[question.id] || ''}
                onValueChange={(value) => handleAnswerChange(question.id, value)}
              >
                {question.options.map((option) => (
                  <div key={option.value} className="flex items-center space-x-2">
                    <RadioGroupItem value={option.value} id={`${question.id}-${option.value}`} />
                    <Label
                      htmlFor={`${question.id}-${option.value}`}
                      className="font-normal cursor-pointer"
                    >
                      {option.label}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between mt-6">
        <Button
          variant="outline"
          onClick={() => {
            const currentIndex = sections.findIndex(s => s.key === currentSection);
            if (currentIndex > 0) {
              setCurrentSection(sections[currentIndex - 1].key as any);
            }
          }}
          disabled={currentSection === 'idea'}
        >
          Previous Section
        </Button>

        {currentSection === 'financial' ? (
          <Button
            onClick={handleSubmitValidation}
            disabled={!allSectionsComplete || overallConfidence < 76 || isValidating}
            className="bg-green-600 hover:bg-green-700"
          >
            {isValidating ? 'Validating...' : 'Submit Validation'}
          </Button>
        ) : (
          <Button
            onClick={() => {
              const currentIndex = sections.findIndex(s => s.key === currentSection);
              if (currentIndex < sections.length - 1) {
                setCurrentSection(sections[currentIndex + 1].key as any);
              }
            }}
          >
            Next Section
          </Button>
        )}
      </div>

      {/* Analyzing Dialog */}
      <AnalyzingDialog open={isValidating} />

      {/* Follow-up Questions Dialog */}
      {validationResponse && (
        <AIFollowupQuestionsDialog
          open={showFollowupDialog}
          questions={validationResponse.final_output.ai_followup_questions}
          onComplete={handleFollowupComplete}
        />
      )}
    </div>
  );
}
