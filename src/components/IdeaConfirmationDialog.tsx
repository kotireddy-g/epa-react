import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Check, TrendingUp, Lightbulb, ArrowRight } from 'lucide-react';
import { FeedbackButton } from './FeedbackButton';
import { NotesButton } from './NotesButton';

interface IdeaConfirmationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onAccept: () => void;
  ideaSummary: string;
  ideaDescription: string;
  keyPoints: {
    coreConcept: string;
    targetMarket: string;
    valueProposition: string;
    revenueModel: string;
    competitiveAdvantages: string;
    growthPotential: string;
    implementationTimeline: string;
  };
}

export function IdeaConfirmationDialog({
  isOpen,
  onClose,
  onAccept,
  ideaSummary,
  ideaDescription,
  keyPoints,
}: IdeaConfirmationDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="!w-[1200px] !h-[800px] !max-w-[90vw] max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl">
            <Lightbulb className="w-6 h-6 text-yellow-500" />
            Confirm Your Business Idea
          </DialogTitle>
          <DialogDescription>
            Review your complete idea before proceeding to validation
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto pr-4">
          <div className="space-y-6 pb-4">
            {/* Idea Summary */}
            <Card className="p-6 bg-gradient-to-r from-red-50 to-orange-50 border-2 border-red-200">
              <h3 className="text-lg text-black mb-3 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-red-600" />
                Idea Summary
              </h3>
              <p className="text-gray-800">{ideaSummary}</p>
            </Card>

            {/* Key Points Analysis */}
            <div>
              <h3 className="text-lg text-black mb-4">AI-Analyzed Key Points</h3>
              <div className="grid gap-4">
                {/* Core Concept */}
                <KeyPointCard
                  title="Core Concept"
                  content={keyPoints.coreConcept}
                  icon="💡"
                  color="blue"
                />

                {/* Target Market */}
                <KeyPointCard
                  title="Target Market"
                  content={keyPoints.targetMarket}
                  icon="🎯"
                  color="green"
                />

                {/* Unique Value Proposition */}
                <KeyPointCard
                  title="Unique Value Proposition"
                  content={keyPoints.valueProposition}
                  icon="⭐"
                  color="purple"
                />

                {/* Revenue Model */}
                <KeyPointCard
                  title="Revenue Model"
                  content={keyPoints.revenueModel}
                  icon="💰"
                  color="yellow"
                />

                {/* Competitive Advantages */}
                <KeyPointCard
                  title="Competitive Advantages"
                  content={keyPoints.competitiveAdvantages}
                  icon="🏆"
                  color="red"
                />

                {/* Growth Potential */}
                <KeyPointCard
                  title="Growth Potential"
                  content={keyPoints.growthPotential}
                  icon="📈"
                  color="teal"
                />

                {/* Implementation Timeline */}
                <KeyPointCard
                  title="Implementation Timeline"
                  content={keyPoints.implementationTimeline}
                  icon="⏱️"
                  color="indigo"
                />
              </div>
            </div>

            {/* Detailed Description */}
            <Card className="p-6 bg-blue-50 border-2 border-blue-200">
              <h3 className="text-lg text-black mb-3">Detailed Description</h3>
              <p className="text-gray-800 whitespace-pre-wrap">{ideaDescription}</p>
            </Card>

            {/* Confirmation Message */}
            <Card className="p-6 bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-300">
              <div className="flex items-start gap-4">
                <div className="bg-green-500 rounded-full p-2">
                  <Check className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg text-black mb-2">Ready for Validation</h3>
                  <p className="text-gray-700 mb-3">
                    Your business idea is comprehensive and ready to proceed to the validation phase. 
                    In validation, we'll test your assumptions and gather market feedback.
                  </p>
                  <p className="text-sm text-gray-600">
                    💡 Tip: Use the Feedback and Notes buttons below to make any final adjustments before proceeding.
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between pt-4 border-t mt-4">
          <div className="flex items-center gap-3">
            <FeedbackButton 
              itemId="current-idea" 
              itemType="idea" 
            />
            <NotesButton 
              itemId="current-idea" 
              itemType="idea" 
            />
          </div>
          
          <div className="flex gap-3">
            <Button variant="outline" onClick={onClose}>
              Review Again
            </Button>
            <Button 
              onClick={onAccept}
              className="bg-red-600 hover:bg-red-700 text-white gap-2"
              size="lg"
            >
              Accept & Continue to Validation
              <ArrowRight className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// Key Point Card Component
function KeyPointCard({ 
  title, 
  content, 
  icon, 
  color 
}: { 
  title: string; 
  content: string; 
  icon: string; 
  color: string;
}) {
  const colorClasses = {
    blue: 'bg-blue-50 border-blue-200',
    green: 'bg-green-50 border-green-200',
    purple: 'bg-purple-50 border-purple-200',
    yellow: 'bg-yellow-50 border-yellow-200',
    red: 'bg-red-50 border-red-200',
    teal: 'bg-teal-50 border-teal-200',
    indigo: 'bg-indigo-50 border-indigo-200',
  };

  return (
    <Card className={`p-4 ${colorClasses[color as keyof typeof colorClasses]} border-2`}>
      <div className="flex items-start gap-3">
        <span className="text-2xl flex-shrink-0">{icon}</span>
        <div className="flex-1">
          <h4 className="text-black mb-1">{title}</h4>
          <p className="text-sm text-gray-700">{content}</p>
        </div>
      </div>
    </Card>
  );
}
