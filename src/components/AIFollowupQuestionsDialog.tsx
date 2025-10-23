import { useState } from 'react';
import { CheckCircle2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from './ui/dialog';
import { Button } from './ui/button';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Label } from './ui/label';
import { Progress } from './ui/progress';
import { AIFollowupQuestion } from '../services/ideaAnalysisApi';

interface AIFollowupQuestionsDialogProps {
  open: boolean;
  questions: AIFollowupQuestion[];
  onComplete: () => void;
}

export function AIFollowupQuestionsDialog({
  open,
  questions,
  onComplete
}: AIFollowupQuestionsDialogProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});

  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;
  const allAnswered = Object.keys(answers).length === questions.length;

  const handleAnswer = (answer: string) => {
    setAnswers(prev => ({ ...prev, [currentQuestionIndex]: answer }));
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const handleComplete = () => {
    console.log('[AIFollowupQuestions] Answers:', answers);
    onComplete();
  };

  if (!currentQuestion) return null;

  return (
    <Dialog open={open}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl">AI Follow-up Questions</DialogTitle>
          <DialogDescription>
            Please answer these additional questions to complete your validation
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Progress */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">
                Question {currentQuestionIndex + 1} of {questions.length}
              </span>
              <span className="text-sm font-medium text-blue-600">
                {Math.round(progress)}% Complete
              </span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          {/* Current Question */}
          <div className="space-y-4">
            <Label className="text-lg font-semibold text-gray-900">
              {currentQuestion.question}
            </Label>
            <RadioGroup
              value={answers[currentQuestionIndex] || ''}
              onValueChange={handleAnswer}
            >
              {currentQuestion.options.map((option, index) => (
                <div key={index} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                  <RadioGroupItem value={option} id={`option-${index}`} />
                  <Label
                    htmlFor={`option-${index}`}
                    className="font-normal cursor-pointer flex-1"
                  >
                    {option}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          {/* Navigation */}
          <div className="flex justify-between pt-4 border-t">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentQuestionIndex === 0}
            >
              Previous
            </Button>

            {currentQuestionIndex === questions.length - 1 ? (
              <Button
                onClick={handleComplete}
                disabled={!allAnswered}
                className="bg-green-600 hover:bg-green-700"
              >
                <CheckCircle2 className="w-4 h-4 mr-2" />
                Complete Validation
              </Button>
            ) : (
              <Button
                onClick={handleNext}
                disabled={!answers[currentQuestionIndex]}
              >
                Next Question
              </Button>
            )}
          </div>

          {/* Answer Summary */}
          <div className="flex gap-2 flex-wrap pt-2">
            {questions.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentQuestionIndex(index)}
                className={`w-8 h-8 rounded-full text-sm font-medium transition-all ${
                  index === currentQuestionIndex
                    ? 'bg-blue-600 text-white ring-2 ring-blue-300'
                    : answers[index]
                    ? 'bg-green-500 text-white'
                    : 'bg-gray-200 text-gray-600'
                }`}
              >
                {index + 1}
              </button>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
