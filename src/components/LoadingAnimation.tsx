import { useEffect, useState } from 'react';
import { Loader2, Brain, Database, Sparkles } from 'lucide-react';

export function LoadingAnimation() {
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    { icon: Brain, text: 'Analyzing your idea with AI models...', color: 'text-blue-600' },
    { icon: Database, text: 'Gathering insights from multiple sources...', color: 'text-purple-600' },
    { icon: Sparkles, text: 'Synthesizing comprehensive response...', color: 'text-green-600' },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStep((prev) => (prev + 1) % steps.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [steps.length]);

  return (
    <div className="flex flex-col items-center justify-center p-12 space-y-8">
      {/* Main Spinner */}
      <div className="relative">
        <Loader2 className="w-16 h-16 text-blue-600 animate-spin" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-12 h-12 bg-blue-100 rounded-full animate-pulse"></div>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="space-y-4 w-full max-w-md">
        {steps.map((step, index) => {
          const Icon = step.icon;
          const isActive = index === currentStep;
          const isPast = index < currentStep;

          return (
            <div
              key={index}
              className={`flex items-center gap-4 p-4 rounded-lg transition-all duration-500 ${
                isActive
                  ? 'bg-blue-50 border-2 border-blue-300 scale-105'
                  : isPast
                  ? 'bg-green-50 border border-green-200'
                  : 'bg-gray-50 border border-gray-200 opacity-50'
              }`}
            >
              <div
                className={`flex-shrink-0 ${
                  isActive ? 'animate-bounce' : ''
                }`}
              >
                <Icon
                  className={`w-6 h-6 ${
                    isActive
                      ? step.color
                      : isPast
                      ? 'text-green-600'
                      : 'text-gray-400'
                  }`}
                />
              </div>
              <p
                className={`text-sm font-medium ${
                  isActive
                    ? 'text-gray-900'
                    : isPast
                    ? 'text-green-700'
                    : 'text-gray-500'
                }`}
              >
                {step.text}
              </p>
              {isActive && (
                <Loader2 className="w-4 h-4 text-blue-600 animate-spin ml-auto" />
              )}
              {isPast && (
                <div className="w-5 h-5 bg-green-600 rounded-full flex items-center justify-center ml-auto">
                  <svg
                    className="w-3 h-3 text-white"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path d="M5 13l4 4L19 7"></path>
                  </svg>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Info Text */}
      <div className="text-center space-y-2">
        <p className="text-lg font-semibold text-gray-900">
          Processing Your Idea
        </p>
        <p className="text-sm text-gray-600">
          This may take up to 2 minutes. We're consulting multiple AI models to provide you with the best insights.
        </p>
      </div>

      {/* Animated Dots */}
      <div className="flex gap-2">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="w-3 h-3 bg-blue-600 rounded-full animate-pulse"
            style={{
              animationDelay: `${i * 0.2}s`,
            }}
          ></div>
        ))}
      </div>
    </div>
  );
}
