import { useState } from 'react';
import { ChevronRight, CheckCircle2 } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Progress } from './ui/progress';
import { FeedbackButton } from './FeedbackButton';
import { NotesButton } from './NotesButton';
import { Idea } from '../App';

interface ValidationPageProps {
  idea: Idea;
  onComplete: (validationData: any, score: number) => void;
}

interface Question {
  id: string;
  question: string;
  type: 'radio' | 'text' | 'textarea';
  options?: string[];
  subQuestions?: Question[];
}

export function ValidationPage({ idea, onComplete }: ValidationPageProps) {
  const [activeTab, setActiveTab] = useState('idea');
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [completedTabs, setCompletedTabs] = useState<string[]>([]);

  const validationSections = {
    idea: {
      title: 'IDEA Validation',
      questions: [
        {
          id: 'problem-clarity',
          question: 'How clearly defined is the problem you are solving?',
          type: 'radio',
          options: ['Very Clear', 'Somewhat Clear', 'Unclear', 'Not Defined'],
        },
        {
          id: 'market-size',
          question: 'What is the estimated market size?',
          type: 'radio',
          options: ['Large (>$1B)', 'Medium ($100M-$1B)', 'Small (<$100M)', 'Unknown'],
          subQuestions: [
            {
              id: 'market-size-source',
              question: 'What is your source for this market size estimate?',
              type: 'text',
            },
          ],
        },
        {
          id: 'competitors',
          question: 'How many direct competitors exist?',
          type: 'radio',
          options: ['None', '1-3', '4-10', 'More than 10'],
        },
        {
          id: 'differentiation',
          question: 'What makes your solution unique?',
          type: 'textarea',
        },
        {
          id: 'customer-validation',
          question: 'Have you spoken with potential customers?',
          type: 'radio',
          options: ['Yes, 10+', 'Yes, 5-10', 'Yes, 1-5', 'Not yet'],
        },
      ] as Question[],
    },
    persona: {
      title: 'Persona Validation',
      questions: [
        {
          id: 'years-experience',
          question: 'Years of professional experience',
          type: 'radio',
          options: ['10+ years', '5-10 years', '2-5 years', 'Less than 2 years'],
        },
        {
          id: 'domain-knowledge',
          question: 'Domain expertise in this industry',
          type: 'radio',
          options: ['Expert', 'Advanced', 'Intermediate', 'Beginner'],
        },
        {
          id: 'previous-startups',
          question: 'Have you founded or co-founded a startup before?',
          type: 'radio',
          options: ['Yes, successfully exited', 'Yes, still running', 'Yes, but failed', 'No'],
        },
        {
          id: 'technical-skills',
          question: 'Technical skills relevant to this idea',
          type: 'radio',
          options: ['Highly skilled', 'Moderately skilled', 'Limited skills', 'No technical skills'],
        },
        {
          id: 'time-commitment',
          question: 'Time you can commit to this idea',
          type: 'radio',
          options: ['Full-time', 'Part-time (20+ hrs/week)', 'Part-time (<20 hrs/week)', 'Weekends only'],
        },
      ] as Question[],
    },
    financial: {
      title: 'Financial Validation',
      questions: [
        {
          id: 'initial-budget',
          question: 'What is your initial budget?',
          type: 'radio',
          options: ['$100k+', '$50k-$100k', '$10k-$50k', 'Less than $10k'],
        },
        {
          id: 'funding-source',
          question: 'Primary funding source',
          type: 'radio',
          options: ['Personal savings', 'Friends & Family', 'Angel investors', 'VC funding', 'Bootstrapped'],
        },
        {
          id: 'revenue-timeline',
          question: 'Expected time to first revenue',
          type: 'radio',
          options: ['0-3 months', '3-6 months', '6-12 months', '12+ months'],
        },
        {
          id: 'break-even',
          question: 'Expected time to break-even',
          type: 'radio',
          options: ['Less than 1 year', '1-2 years', '2-3 years', '3+ years'],
        },
        {
          id: 'pricing-model',
          question: 'What is your pricing model?',
          type: 'textarea',
        },
      ] as Question[],
    },
    network: {
      title: 'Network Validation',
      questions: [
        {
          id: 'linkedin-connections',
          question: 'Number of LinkedIn connections',
          type: 'radio',
          options: ['1000+', '500-1000', '100-500', 'Less than 100'],
        },
        {
          id: 'industry-network',
          question: 'Do you have connections in your target industry?',
          type: 'radio',
          options: ['Many (20+)', 'Some (10-20)', 'Few (5-10)', 'None'],
        },
        {
          id: 'mentors',
          question: 'Do you have mentors or advisors?',
          type: 'radio',
          options: ['Yes, 3+', 'Yes, 1-2', 'No, but seeking', 'No'],
        },
        {
          id: 'social-presence',
          question: 'Social media presence',
          type: 'radio',
          options: ['Strong (10k+ followers)', 'Moderate (1k-10k)', 'Small (<1k)', 'None'],
        },
        {
          id: 'potential-partners',
          question: 'Potential business partners or collaborators',
          type: 'radio',
          options: ['Already identified', 'Some leads', 'Actively searching', 'None yet'],
        },
      ] as Question[],
    },
  };

  const handleAnswerChange = (questionId: string, value: any) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }));
  };

  const calculateTabScore = (tabKey: string): number => {
    const section = validationSections[tabKey as keyof typeof validationSections];
    const tabAnswers = section.questions.filter(q => answers[q.id]);
    return (tabAnswers.length / section.questions.length) * 100;
  };

  const calculateOverallScore = (): number => {
    const weights = {
      idea: 0.35,
      persona: 0.25,
      financial: 0.25,
      network: 0.15,
    };

    let totalScore = 0;
    Object.keys(validationSections).forEach(key => {
      const tabScore = calculateTabScore(key);
      totalScore += tabScore * weights[key as keyof typeof weights];
    });

    return Math.round(totalScore);
  };

  const handleTabComplete = (tabKey: string) => {
    if (!completedTabs.includes(tabKey)) {
      setCompletedTabs(prev => [...prev, tabKey]);
    }
  };

  const handleSubmit = () => {
    const score = calculateOverallScore();
    if (score >= 80) {
      onComplete(answers, score);
    } else {
      alert(`Your confidence score is ${score}%. Please complete more validations to reach 80% or higher.`);
    }
  };

  const renderQuestion = (question: Question, level: number = 0) => {
    const answer = answers[question.id];

    return (
      <div key={question.id} className={`space-y-3 ${level > 0 ? 'ml-6 mt-4 pl-4 border-l-2 border-gray-200' : ''}`}>
        <Label className="text-gray-900">{question.question}</Label>
        
        {question.type === 'radio' && question.options && (
          <RadioGroup value={answer} onValueChange={(value) => handleAnswerChange(question.id, value)}>
            {question.options.map((option) => (
              <div key={option} className="flex items-center space-x-2">
                <RadioGroupItem value={option} id={`${question.id}-${option}`} />
                <Label htmlFor={`${question.id}-${option}`} className="cursor-pointer">
                  {option}
                </Label>
              </div>
            ))}
          </RadioGroup>
        )}
        
        {question.type === 'text' && (
          <Input
            value={answer || ''}
            onChange={(e) => handleAnswerChange(question.id, e.target.value)}
            placeholder="Enter your answer..."
          />
        )}
        
        {question.type === 'textarea' && (
          <Textarea
            value={answer || ''}
            onChange={(e) => handleAnswerChange(question.id, e.target.value)}
            placeholder="Enter your answer..."
            className="min-h-[100px]"
          />
        )}

        {question.subQuestions && answer && (
          <div className="space-y-4">
            {question.subQuestions.map(subQ => renderQuestion(subQ, level + 1))}
          </div>
        )}
      </div>
    );
  };

  const overallScore = calculateOverallScore();

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-gray-900 mb-2">Idea Validation</h1>
        <p className="text-gray-600 mb-4">Validate your idea: {idea.summary}</p>
        
        {/* Confidence Meter */}
        <Card className="bg-gradient-to-r from-blue-50 to-purple-50">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-700">Confidence Score</span>
              <span className={`${overallScore >= 80 ? 'text-green-600' : 'text-blue-600'}`}>
                {overallScore}%
              </span>
            </div>
            <Progress value={overallScore} className="h-3" />
            <p className="text-sm text-gray-600 mt-2">
              {overallScore >= 80 ? (
                <span className="text-green-600">Great! You can submit your idea.</span>
              ) : (
                <span>Complete validations to reach 80% confidence score</span>
              )}
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4 mb-8">
          {Object.entries(validationSections).map(([key, section]) => (
            <TabsTrigger key={key} value={key} className="relative">
              {completedTabs.includes(key) && (
                <CheckCircle2 className="w-4 h-4 text-green-600 absolute top-2 right-2" />
              )}
              {section.title}
            </TabsTrigger>
          ))}
        </TabsList>

        {Object.entries(validationSections).map(([key, section]) => (
          <TabsContent key={key} value={key}>
            <Card>
              <CardHeader>
                <CardTitle>{section.title}</CardTitle>
                <div className="flex items-center gap-2">
                  <Progress value={calculateTabScore(key)} className="flex-1" />
                  <span className="text-sm text-gray-600">
                    {Math.round(calculateTabScore(key))}%
                  </span>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {section.questions.map(question => renderQuestion(question))}
                
                <div className="flex items-center gap-3 pt-6 border-t border-gray-200">
                  <Button onClick={() => handleTabComplete(key)}>
                    Mark as Complete
                  </Button>
                  <div className="flex gap-2">
                    <FeedbackButton itemId={`validation-${key}`} itemType={section.title} />
                    <NotesButton itemId={`validation-${key}`} itemType={section.title} />
                  </div>
                  
                  {Object.keys(validationSections).indexOf(key) < Object.keys(validationSections).length - 1 && (
                    <Button
                      variant="outline"
                      onClick={() => {
                        const keys = Object.keys(validationSections);
                        const currentIndex = keys.indexOf(key);
                        setActiveTab(keys[currentIndex + 1]);
                      }}
                      className="ml-auto gap-2"
                    >
                      Next Section
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>

      <div className="mt-8 flex justify-end">
        <Button 
          onClick={handleSubmit}
          size="lg"
          disabled={overallScore < 80}
        >
          Submit Validation (Score: {overallScore}%)
        </Button>
      </div>
    </div>
  );
}
