import { useState } from 'react';
import { CheckCircle2, Loader2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from './ui/dialog';
import { Button } from './ui/button';
import { Checkbox } from './ui/checkbox';
import { Label } from './ui/label';
import { Progress } from './ui/progress';
import { Textarea } from './ui/textarea';
import { AIFollowupQuestion, ideaAnalysisApi, PlanResponse } from '../services/ideaAnalysisApi';
import { AnalyzingDialog } from './AnalyzingDialog';

interface AIFollowupQuestionsDialogProps {
  open: boolean;
  questions: AIFollowupQuestion[];
  ideaId: string;
  onComplete: (planResponse: PlanResponse) => void;
}

export function AIFollowupQuestionsDialog({
  open,
  questions,
  ideaId,
  onComplete
}: AIFollowupQuestionsDialogProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string | string[]>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Safety check for empty questions array
  if (!questions || questions.length === 0) {
    console.warn('[AIFollowupQuestions] No questions provided');
    return null;
  }

  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  const hasAnswer = (index: number): boolean => {
    const answer = answers[index];
    if (Array.isArray(answer)) {
      return answer.length > 0;
    }
    return Boolean(answer && answer.trim().length > 0);
  };

  const allAnswered = questions.every((_, index) => hasAnswer(index));

  const currentAnswered = () => hasAnswer(currentQuestionIndex);

  const handleAnswer = (answer: string) => {
    // Store the answer as-is, validation happens on navigation/submit
    setAnswers(prev => ({ ...prev, [currentQuestionIndex]: answer }));
  };

  // Handle checkbox toggle for multiple selection
  const handleCheckboxToggle = (option: string, checked: boolean) => {
    setAnswers(prev => {
      const previous = prev[currentQuestionIndex];
      const selectedOptions = Array.isArray(previous) ? [...previous] : [];

      let updatedOptions: string[];
      if (checked) {
        updatedOptions = selectedOptions.includes(option)
          ? selectedOptions
          : [...selectedOptions, option];
      } else {
        updatedOptions = selectedOptions.filter(o => o !== option);
      }

      return {
        ...prev,
        [currentQuestionIndex]: updatedOptions,
      };
    });
  };

  // Check if an option is selected
  const isOptionSelected = (option: string) => {
    const currentAnswer = answers[currentQuestionIndex];
    return Array.isArray(currentAnswer) ? currentAnswer.includes(option) : false;
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

  const handleComplete = async () => {
    setError('');
    setIsSubmitting(true);

    try {
      // Build the payload
      const ai_followup_questions = questions.map((q, index) => {
        const answer = answers[index];
        const formattedAnswer = Array.isArray(answer) ? answer.join(', ') : (answer || '');

        return {
        question: q.question,
        answer: formattedAnswer
        };
      });

      const payload = {
        idea_id: ideaId,
        ai_followup_questions,
        meta: {
          submitted_on: new Date().toISOString(),
          version: 'EPA-AI-v2.0'
        }
      };

      console.log('[AIFollowupQuestions] Submitting answers:', payload);

      // Call the API
      const planResponse = await ideaAnalysisApi.submitPlan(payload);
      
      console.log('[AIFollowupQuestions] Plan response received:', planResponse);
      
      // Insert plan data to database (non-blocking)
      const userId = ideaAnalysisApi.getUserId();
      if (userId && planResponse.idea_id) {
        console.log('[AIFollowupQuestions] Persisting plan data to database...');
        ideaAnalysisApi.insertIdeaPlanData({
          userId,
          stage: 'Implementation',
          idea_id: planResponse.idea_id,
          final_output: planResponse.final_output || {},
          live_references: planResponse.live_references || {}
        }).then(result => {
          if (result.success) {
            console.log('[AIFollowupQuestions] Plan data persisted successfully');
          } else {
            console.error('[AIFollowupQuestions] Failed to persist plan data:', result.error);
          }
        }).catch(err => {
          console.error('[AIFollowupQuestions] Error persisting plan data:', err);
        });
      }
      
      // Pass the response to parent
      onComplete(planResponse);
    } catch (err: any) {
      console.error('[AIFollowupQuestions] Error submitting plan:', err);
      setError(err.message || 'Failed to submit answers. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!currentQuestion) return null;

  return (
    <>
      {/* Loading Dialog with Tips */}
      <AnalyzingDialog open={isSubmitting} />
      
      {/* Questions Dialog */}
      <Dialog open={open && !isSubmitting}>
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
            <div>
              <Label className="text-lg font-semibold text-gray-900">
                {currentQuestion.question}
              </Label>
              {currentQuestion.category && (
                <p className="text-sm text-gray-500 mt-1">Category: {currentQuestion.category}</p>
              )}
              {currentQuestion.why_important && (
                <p className="text-sm text-blue-600 mt-1">Why important: {currentQuestion.why_important}</p>
              )}
            </div>

            {/* DYNAMIC: Show checkboxes if options exist, otherwise show text input */}
            {currentQuestion.options && currentQuestion.options.length > 0 ? (
              <div className="space-y-3">
                <p className="text-sm text-gray-600">Select all that apply: *</p>
                {currentQuestion.options.map((option, index) => (
                  <div key={index} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                    <Checkbox
                      id={`option-${index}`}
                      checked={isOptionSelected(option)}
                      onCheckedChange={(checked) => handleCheckboxToggle(option, Boolean(checked))}
                    />
                    <Label
                      htmlFor={`option-${index}`}
                      className="font-normal cursor-pointer flex-1"
                    >
                      {option}
                    </Label>
                  </div>
                ))}
                {answers[currentQuestionIndex] !== undefined && !currentAnswered() && (
                  <p className="text-sm text-red-600 mt-1">* Please select at least one option</p>
                )}
              </div>
            ) : (
              <div>
                <Textarea
                  placeholder="Type your answer here... *"
                  value={typeof answers[currentQuestionIndex] === 'string' ? (answers[currentQuestionIndex] as string) : ''}
                  onChange={(e) => handleAnswer(e.target.value)}
                  className="min-h-[100px]"
                  required
                />
                {answers[currentQuestionIndex] !== undefined && !currentAnswered() && (
                  <p className="text-sm text-red-600 mt-1">* This field is required and cannot be empty or just spaces</p>
                )}
              </div>
            )}
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          {/* Navigation */}
          <div className="flex justify-between pt-4 border-t">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentQuestionIndex === 0 || isSubmitting}
            >
              Previous
            </Button>

            {currentQuestionIndex === questions.length - 1 ? (
              <Button
                onClick={handleComplete}
                disabled={!allAnswered || isSubmitting}
                className="bg-green-600 hover:bg-green-700"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4 mr-2" />
                    Complete Validation
                  </>
                )}
              </Button>
            ) : (
              <Button
                onClick={handleNext}
                disabled={!currentAnswered() || isSubmitting}
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
                    : hasAnswer(index)
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
    </>
  );
}
