import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Textarea } from './ui/textarea';
import { Lightbulb, CheckCircle2 } from 'lucide-react';

interface FollowUpQuestion {
  id: string;
  label: string;
  type: 'multiple_choice' | 'long_text' | 'short_text';
  required: boolean;
  options?: string[];
  placeholder?: string;
  help?: string;
  validation?: {
    min_len?: number;
    max_len?: number;
  };
}

interface AIFollowUpDialogProps {
  isOpen: boolean;
  onClose: () => void;
  questions: FollowUpQuestion[];
  onSubmit: (answers: { question_id: string; question: string; answer: string }[]) => void;
  validationErrors?: Record<string, string>; // Field-specific errors from API
}

export function AIFollowUpDialog({ isOpen, onClose, questions, onSubmit, validationErrors = {} }: AIFollowUpDialogProps) {
  const [answers, setAnswers] = useState<Record<string, string>>({});

  const handleAnswerChange = (questionId: string, answer: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: answer }));
  };

  const handleSubmit = () => {
    // Validate all required questions are answered
    const unanswered = questions.filter(q => q.required && (!answers[q.id] || answers[q.id].trim() === ''));
    if (unanswered.length > 0) {
      alert(`Please answer all required questions. Missing: ${unanswered.length} question(s)`);
      return;
    }

    // Validate text length for long_text fields
    for (const q of questions) {
      if (q.type === 'long_text' && q.validation && answers[q.id]) {
        const answerLength = answers[q.id].trim().length;
        if (q.validation.min_len && answerLength < q.validation.min_len) {
          alert(`Answer for "${q.label}" must be at least ${q.validation.min_len} characters.`);
          return;
        }
        if (q.validation.max_len && answerLength > q.validation.max_len) {
          alert(`Answer for "${q.label}" must not exceed ${q.validation.max_len} characters.`);
          return;
        }
      }
    }

    // Format answers for API
    const formattedAnswers = questions.map(q => ({
      question_id: q.id,
      question: q.label,
      answer: answers[q.id]?.trim() || ''
    }));

    onSubmit(formattedAnswers);
  };

  const requiredQuestions = questions.filter(q => q.required);
  const allAnswered = requiredQuestions.every(q => answers[q.id] && answers[q.id].trim() !== '');
  const answeredCount = requiredQuestions.filter(q => answers[q.id] && answers[q.id].trim() !== '').length;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <Lightbulb className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <DialogTitle className="text-2xl">Idea Clarification Questions</DialogTitle>
              <p className="text-sm text-gray-500 mt-1">
                Help us understand your idea better by answering these questions
              </p>
            </div>
          </div>
        </DialogHeader>

        {/* Progress Indicator */}
        <div className="mt-4 mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">
              Progress: {answeredCount} of {requiredQuestions.length} answered
            </span>
            <span className="text-sm text-gray-500">
              {Math.round((answeredCount / requiredQuestions.length) * 100)}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(answeredCount / requiredQuestions.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Questions */}
        <div className="space-y-6">
          {questions.map((question, index) => (
            <div 
              key={question.id} 
              className={`p-4 rounded-lg border-2 transition-all ${
                answers[question.id] 
                  ? 'border-green-200 bg-green-50' 
                  : 'border-gray-200 bg-white'
              }`}
            >
              <div className="flex items-start gap-3 mb-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                  answers[question.id] 
                    ? 'bg-green-500 text-white' 
                    : 'bg-gray-200 text-gray-600'
                }`}>
                  {answers[question.id] ? (
                    <CheckCircle2 className="w-5 h-5" />
                  ) : (
                    <span className="font-semibold">{index + 1}</span>
                  )}
                </div>
                <div className="flex-1">
                  <Label className="text-base font-semibold text-gray-900">
                    {question.label}
                    {question.required && <span className="text-red-500 ml-1">*</span>}
                  </Label>
                  {question.help && (
                    <p className="text-sm text-gray-500 mt-1">{question.help}</p>
                  )}
                </div>
              </div>

              {/* Render based on question type */}
              {question.type === 'multiple_choice' && question.options ? (
                <RadioGroup
                  value={answers[question.id] || ''}
                  onValueChange={(value) => handleAnswerChange(question.id, value)}
                  className="ml-11 space-y-2"
                >
                  {question.options.map((option: string, optionIndex: number) => (
                    <div 
                      key={optionIndex} 
                      className={`flex items-center space-x-3 p-3 rounded-md border transition-all cursor-pointer ${
                        answers[question.id] === option
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
                      }`}
                    >
                      <RadioGroupItem value={option} id={`${question.id}-${optionIndex}`} />
                      <Label 
                        htmlFor={`${question.id}-${optionIndex}`}
                        className="flex-1 cursor-pointer font-normal"
                      >
                        {option}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              ) : (
                <div className="ml-11">
                  <Textarea
                    value={answers[question.id] || ''}
                    onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                    placeholder={question.placeholder || "Type your answer here..."}
                    className={`w-full min-h-[100px] p-3 border rounded-md focus:border-blue-500 focus:ring-1 focus:ring-blue-500 ${
                      validationErrors[question.id] ? 'border-red-500' : ''
                    }`}
                  />
                  {validationErrors[question.id] && (
                    <p className="text-sm text-red-600 mt-2 font-medium">
                      {validationErrors[question.id]}
                    </p>
                  )}
                  {question.validation && (
                    <p className="text-xs text-gray-500 mt-1">
                      {question.validation.min_len && `Min: ${question.validation.min_len} characters`}
                      {question.validation.min_len && question.validation.max_len && ' | '}
                      {question.validation.max_len && `Max: ${question.validation.max_len} characters`}
                      {answers[question.id] && ` (Current: ${answers[question.id].length})`}
                    </p>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Actions */}
        <div className="flex justify-between items-center mt-6 pt-4 border-t">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit}
            disabled={!allAnswered}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            {allAnswered ? (
              <>
                <CheckCircle2 className="w-4 h-4 mr-2" />
                Submit & Continue
              </>
            ) : (
              `Answer ${questions.length - answeredCount} more question${questions.length - answeredCount > 1 ? 's' : ''}`
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
