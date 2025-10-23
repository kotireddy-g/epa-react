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
      question: 'How thoroughly have you researched the problem your idea addresses?',
      options: [
        { label: 'a) Not at all', value: 'a', score: 0 },
        { label: 'b) A little', value: 'b', score: 1 },
        { label: 'c) Somewhat thoroughly', value: 'c', score: 3 },
        { label: 'd) Extremely thoroughly', value: 'd', score: 5 }
      ]
    },
    {
      id: 'I2',
      question: 'Have you personally experienced the problem you are solving?',
      options: [
        { label: 'a) No', value: 'a', score: 0 },
        { label: 'b) Occasionally', value: 'b', score: 1 },
        { label: 'c) Often', value: 'c', score: 3 },
        { label: 'd) Yes, it\'s a major pain point', value: 'd', score: 5 }
      ]
    },
    {
      id: 'I3',
      question: 'How confident are you that a real market exists for this idea?',
      options: [
        { label: 'a) Not confident', value: 'a', score: 0 },
        { label: 'b) Somewhat confident', value: 'b', score: 1 },
        { label: 'c) Confident', value: 'c', score: 3 },
        { label: 'd) Very confident (have validation data)', value: 'd', score: 5 }
      ]
    },
    {
      id: 'I4',
      question: 'How do you know your idea is unique or differentiated?',
      options: [
        { label: 'a) Pure intuition', value: 'a', score: 0 },
        { label: 'b) Based on some online search', value: 'b', score: 1 },
        { label: 'c) User/interview feedback', value: 'c', score: 3 },
        { label: 'd) Strong evidence and competitor research', value: 'd', score: 5 }
      ]
    },
    {
      id: 'I5',
      question: 'How open are you to changing your idea based on feedback?',
      options: [
        { label: 'a) Not open', value: 'a', score: 0 },
        { label: 'b) Somewhat open', value: 'b', score: 1 },
        { label: 'c) Open to reasonable changes', value: 'c', score: 3 },
        { label: 'd) Will pivot based on data', value: 'd', score: 5 }
      ]
    }
  ],
  persona: [
    {
      id: 'P1',
      question: 'Have you ever tried to start a business or project before?',
      options: [
        { label: 'A. Yes, I have tried something similar', value: 'a', score: 5 },
        { label: 'B. I helped someone else with a project', value: 'b', score: 3 },
        { label: 'C. No, but I have ideas', value: 'c', score: 1 },
        { label: 'D. No experience at all', value: 'd', score: 0 }
      ]
    },
    {
      id: 'P2',
      question: 'Do you know anything about the field of this idea?',
      options: [
        { label: 'A. Yes, I have worked or studied something similar', value: 'a', score: 5 },
        { label: 'B. I know a little about it', value: 'b', score: 3 },
        { label: 'C. No, but I want to learn', value: 'c', score: 1 },
        { label: 'D. No, I don\'t know anything', value: 'd', score: 0 }
      ]
    },
    {
      id: 'P3',
      question: 'How confident are you about making this idea work?',
      options: [
        { label: 'A. Very confident', value: 'a', score: 5 },
        { label: 'B. Somewhat confident', value: 'b', score: 3 },
        { label: 'C. Not very confident', value: 'c', score: 1 },
        { label: 'D. Unsure', value: 'd', score: 0 }
      ]
    },
    {
      id: 'P4',
      question: 'How much time can you spend on this idea?',
      options: [
        { label: 'A. Full-time (most of my day)', value: 'a', score: 5 },
        { label: 'B. Part-time (a few hours a day)', value: 'b', score: 3 },
        { label: 'C. Occasionally (a few hours a week)', value: 'c', score: 1 },
        { label: 'D. Unsure', value: 'd', score: 0 }
      ]
    },
    {
      id: 'P5',
      question: 'How much money can you spend to start this idea?',
      options: [
        { label: 'A. Very little (less than $500)', value: 'a', score: 1 },
        { label: 'B. Some (around $500–$2,000)', value: 'b', score: 2 },
        { label: 'C. Moderate (around $2,000–$10,000)', value: 'c', score: 3 },
        { label: 'D. More than $10,000', value: 'd', score: 5 },
        { label: 'E. I don\'t have money to spend yet', value: 'e', score: 0 }
      ]
    }
  ],
  network: [
    {
      id: 'N1',
      question: 'Have you discussed your idea with industry experts?',
      options: [
        { label: 'a) Not at all', value: 'a', score: 0 },
        { label: 'b) Sent cold emails', value: 'b', score: 1 },
        { label: 'c) Informal conversations', value: 'c', score: 3 },
        { label: 'd) Multiple expert feedback sessions', value: 'd', score: 5 }
      ]
    },
    {
      id: 'N2',
      question: 'How confident are you in accessing mentorship for your startup?',
      options: [
        { label: 'a) No confidence', value: 'a', score: 0 },
        { label: 'b) Somewhat confident', value: 'b', score: 1 },
        { label: 'c) Confident', value: 'c', score: 3 },
        { label: 'd) Already have mentors', value: 'd', score: 5 }
      ]
    },
    {
      id: 'N3',
      question: 'Do you have any advisors or board members?',
      options: [
        { label: 'a) None', value: 'a', score: 0 },
        { label: 'b) Considering some', value: 'b', score: 1 },
        { label: 'c) 1-2 advisors', value: 'c', score: 3 },
        { label: 'd) Advisory board in place', value: 'd', score: 5 }
      ]
    },
    {
      id: 'N4',
      question: 'How much peer support do you have for launching your idea?',
      options: [
        { label: 'a) None', value: 'a', score: 0 },
        { label: 'b) A little', value: 'b', score: 1 },
        { label: 'c) Sufficient', value: 'c', score: 3 },
        { label: 'd) Strong, regular support', value: 'd', score: 5 }
      ]
    },
    {
      id: 'N5',
      question: 'Are you open to collaboration and partnerships within your network?',
      options: [
        { label: 'a) Not open', value: 'a', score: 0 },
        { label: 'b) Unsure', value: 'b', score: 1 },
        { label: 'c) Open to certain partnerships', value: 'c', score: 3 },
        { label: 'd) Very open, actively seeking', value: 'd', score: 5 }
      ]
    }
  ],
  financial: [
    {
      id: 'F1',
      question: 'Have you prepared a business budget for your idea?',
      options: [
        { label: 'a) Not yet', value: 'a', score: 0 },
        { label: 'b) Rough estimate', value: 'b', score: 1 },
        { label: 'c) Draft budget', value: 'c', score: 3 },
        { label: 'd) Detailed budget and cash flow', value: 'd', score: 5 }
      ]
    },
    {
      id: 'F2',
      question: 'How do you plan to fund your initial operations?',
      options: [
        { label: 'a) Personal savings', value: 'a', score: 3 },
        { label: 'b) Friends & family', value: 'b', score: 2 },
        { label: 'c) Bank loan/credit', value: 'c', score: 1 },
        { label: 'd) Grants/VC/Angel funding', value: 'd', score: 5 }
      ]
    },
    {
      id: 'F3',
      question: 'How familiar are you with startup costs in your industry?',
      options: [
        { label: 'a) Not familiar', value: 'a', score: 0 },
        { label: 'b) Somewhat familiar', value: 'b', score: 1 },
        { label: 'c) Well-researched', value: 'c', score: 3 },
        { label: 'd) Industry expert', value: 'd', score: 5 }
      ]
    },
    {
      id: 'F4',
      question: 'Do you have experience raising funds?',
      options: [
        { label: 'a) None', value: 'a', score: 0 },
        { label: 'b) Some attempts, no success', value: 'b', score: 1 },
        { label: 'c) Successfully raised before', value: 'c', score: 3 },
        { label: 'd) Multiple successful rounds', value: 'd', score: 5 }
      ]
    },
    {
      id: 'F5',
      question: 'Do you have contingency plans for financial emergencies?',
      options: [
        { label: 'a) No plans', value: 'a', score: 0 },
        { label: 'b) Some general ideas', value: 'b', score: 1 },
        { label: 'c) Draft contingency plan', value: 'c', score: 3 },
        { label: 'd) Detailed, actionable plans', value: 'd', score: 5 }
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

  // Calculate confidence score
  const calculateConfidence = () => {
    let totalScore = 0;
    let maxScore = 0;

    Object.entries(VALIDATION_QUESTIONS).forEach(([, questions]) => {
      questions.forEach((q) => {
        const answer = answers[q.id];
        if (answer) {
          const option = q.options.find(opt => opt.value === answer);
          if (option) {
            totalScore += option.score;
          }
        }
        // Max score is always 5 per question
        maxScore += 5;
      });
    });

    return maxScore > 0 ? Math.round((totalScore / maxScore) * 100) : 0;
  };

  const confidence = calculateConfidence();

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
    if (confidence < 76) {
      alert('Confidence score must be at least 76% to proceed.');
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
    } catch (error) {
      console.error('Validation error:', error);
      alert('Failed to validate idea. Please try again.');
    } finally {
      setIsValidating(false);
    }
  };

  const handleFollowupComplete = () => {
    setShowFollowupDialog(false);
    onComplete(validationResponse, confidence);
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

      {/* Confidence Score */}
      <Card className="mb-6 border-blue-200 bg-blue-50">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Confidence Score</span>
            <span className={`text-2xl font-bold ${confidence >= 76 ? 'text-green-600' : 'text-orange-600'}`}>
              {confidence}%
            </span>
          </div>
          <Progress value={confidence} className="h-3" />
          <p className="text-xs text-gray-600 mt-2">
            {confidence >= 76 ? (
              <span className="flex items-center gap-1 text-green-600">
                <CheckCircle2 className="w-4 h-4" />
                Ready to submit! Your confidence score meets the minimum requirement.
              </span>
            ) : (
              <span className="flex items-center gap-1 text-orange-600">
                <AlertCircle className="w-4 h-4" />
                Need {76 - confidence}% more to reach minimum 76% confidence score
              </span>
            )}
          </p>
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
            disabled={!allSectionsComplete || confidence < 76 || isValidating}
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
