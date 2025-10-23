import { useEffect, useState } from 'react';
import { Dialog, DialogContent } from './ui/dialog';
import { Lightbulb, TrendingUp, Users, Target, Zap, Brain } from 'lucide-react';

interface AnalyzingDialogProps {
  open: boolean;
}

const FACTS = [
  {
    icon: Lightbulb,
    title: "Did you know?",
    text: "90% of startups fail, but proper market analysis increases success rate by 70%"
  },
  {
    icon: TrendingUp,
    title: "Market Insight",
    text: "Companies that validate their ideas before launch are 2.5x more likely to succeed"
  },
  {
    icon: Users,
    title: "Customer Focus",
    text: "Understanding your target market can reduce customer acquisition costs by 50%"
  },
  {
    icon: Target,
    title: "Strategic Planning",
    text: "Businesses with a clear execution plan are 30% more likely to scale successfully"
  },
  {
    icon: Zap,
    title: "Quick Tip",
    text: "The best time to pivot is early - 70% of successful startups changed their original idea"
  },
  {
    icon: Brain,
    title: "AI Analysis",
    text: "Our AI analyzes 1000+ data points to give you actionable insights in minutes"
  }
];

export function AnalyzingDialog({ open }: AnalyzingDialogProps) {
  const [currentFactIndex, setCurrentFactIndex] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!open) {
      setProgress(0);
      setCurrentFactIndex(0);
      return;
    }

    // Rotate facts every 4 seconds
    const factInterval = setInterval(() => {
      setCurrentFactIndex((prev) => (prev + 1) % FACTS.length);
    }, 4000);

    // Simulate progress
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 95) return prev;
        return prev + Math.random() * 3;
      });
    }, 200);

    return () => {
      clearInterval(factInterval);
      clearInterval(progressInterval);
    };
  }, [open]);

  const currentFact = FACTS[currentFactIndex];
  const Icon = currentFact.icon;

  return (
    <Dialog open={open}>
      <DialogContent className="sm:max-w-md">
        <div className="flex flex-col items-center justify-center py-8 space-y-6">
          {/* Animated Icon */}
          <div className="relative">
            <div className="absolute inset-0 bg-blue-500/20 rounded-full animate-ping" />
            <div className="relative bg-gradient-to-br from-blue-500 to-purple-600 p-6 rounded-full">
              <Icon className="w-12 h-12 text-white animate-pulse" />
            </div>
          </div>

          {/* Title */}
          <div className="text-center space-y-2">
            <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Analyzing Your Idea
            </h3>
            <p className="text-sm text-gray-500">
              Our AI is processing your business concept...
            </p>
          </div>

          {/* Progress Bar */}
          <div className="w-full space-y-2">
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-blue-500 to-purple-600 transition-all duration-300 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-xs text-center text-gray-500">
              {Math.floor(progress)}% Complete
            </p>
          </div>

          {/* Rotating Facts */}
          <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg p-6 w-full min-h-[120px] transition-all duration-500">
            <div className="flex items-start space-x-3">
              <div className="bg-white p-2 rounded-lg shadow-sm">
                <Icon className="w-5 h-5 text-blue-600" />
              </div>
              <div className="flex-1 space-y-1">
                <h4 className="font-semibold text-gray-900">{currentFact.title}</h4>
                <p className="text-sm text-gray-600 leading-relaxed">{currentFact.text}</p>
              </div>
            </div>
          </div>

          {/* Loading Dots */}
          <div className="flex space-x-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
            <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
