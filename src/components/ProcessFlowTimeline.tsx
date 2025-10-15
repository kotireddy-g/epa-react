import { Lightbulb, CheckCircle, FileText, Calendar, Rocket, Target, ChevronRight } from 'lucide-react';
import { Card, CardContent } from './ui/card';

interface ProcessStage {
  id: string;
  title: string;
  icon: any;
  color: string;
  bgColor: string;
  bulletPoints: string[];
}

export function ProcessFlowTimeline() {
  const stages: ProcessStage[] = [
    {
      id: 'idea',
      title: 'Idea',
      icon: Lightbulb,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100',
      bulletPoints: [
        'AI-Powered Idea Analysis',
        'Goal Alignment Check',
        'Idea Agreement',
      ],
    },
    {
      id: 'validation',
      title: 'Validation',
      icon: CheckCircle,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
      bulletPoints: [
        'Market & Persona Validation',
        'Financial & Network Validation',
      ],
    },
    {
      id: 'business-plan',
      title: 'Business Plan',
      icon: FileText,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
      bulletPoints: [
        'Lean Canvas Auto Fill',
        'Modular Business Plan Builder',
      ],
    },
    {
      id: 'planner',
      title: 'Planner',
      icon: Calendar,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
      bulletPoints: [
        'Task Breakdown',
        'Progress Tracking',
        'Success Metrics',
      ],
    },
    {
      id: 'implementation',
      title: 'Implementation',
      icon: Rocket,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
      bulletPoints: [
        'Task Feedback Loops',
        'Outcome Dashboard',
        'AI Scenario Analysis',
      ],
    },
    {
      id: 'outcome',
      title: 'Outcome',
      icon: Target,
      color: 'text-red-600',
      bgColor: 'bg-red-100',
      bulletPoints: [
        'Positive/Negative Feedback Analysis',
        'Learning Repository',
        'Continuous Improvement Cycle',
      ],
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-gray-900 mb-2">Your Journey Through the Platform</h3>
        <p className="text-sm text-gray-600">
          Follow this comprehensive process to transform your idea into a successful business
        </p>
      </div>

      {/* Desktop View - Horizontal Flow */}
      <div className="hidden lg:block">
        <div className="flex items-start justify-between">
          {stages.map((stage, index) => {
            const Icon = stage.icon;
            return (
              <div key={stage.id} className="flex items-start flex-1">
                <Card className="w-full border-2 hover:shadow-lg transition-shadow">
                  <CardContent className="pt-6 px-4 pb-4">
                    <div className="flex flex-col items-center mb-4">
                      <div className={`w-14 h-14 rounded-full ${stage.bgColor} flex items-center justify-center mb-3`}>
                        <Icon className={`w-7 h-7 ${stage.color}`} />
                      </div>
                      <h4 className="text-gray-900 text-center">{stage.title}</h4>
                    </div>
                    <ul className="space-y-2">
                      {stage.bulletPoints.map((point, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-xs text-gray-700">
                          <span className={`${stage.color} flex-shrink-0 mt-0.5`}>•</span>
                          <span className="leading-tight">{point}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
                {index < stages.length - 1 && (
                  <div className="flex items-center justify-center px-2 pt-12">
                    <ChevronRight className="w-6 h-6 text-gray-400" />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Mobile View - Vertical Flow */}
      <div className="lg:hidden space-y-4">
        {stages.map((stage, index) => {
          const Icon = stage.icon;
          return (
            <div key={stage.id}>
              <Card className="border-2 hover:shadow-lg transition-shadow">
                <CardContent className="pt-6 px-4 pb-4">
                  <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 rounded-full ${stage.bgColor} flex items-center justify-center flex-shrink-0`}>
                      <Icon className={`w-6 h-6 ${stage.color}`} />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-gray-900 mb-3">{stage.title}</h4>
                      <ul className="space-y-2">
                        {stage.bulletPoints.map((point, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-sm text-gray-700">
                            <span className={`${stage.color} flex-shrink-0 mt-0.5`}>•</span>
                            <span>{point}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
              {index < stages.length - 1 && (
                <div className="flex justify-center py-2">
                  <div className="w-0.5 h-8 bg-gray-300"></div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
