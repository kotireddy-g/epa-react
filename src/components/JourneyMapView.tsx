import { Lightbulb, CheckCircle, FileText, Calendar, Rocket, Target, MapPin, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Progress } from './ui/progress';
import { Badge } from './ui/badge';

interface JourneyStage {
  id: string;
  title: string;
  icon: any;
  status: 'completed' | 'current' | 'upcoming';
  progress: number;
  completedDate?: string;
  estimatedDate?: string;
  description: string;
  keyMetrics: {
    label: string;
    value: string;
  }[];
}

export function JourneyMapView() {
  const stages: JourneyStage[] = [
    {
      id: 'idea',
      title: 'Idea Creation',
      icon: Lightbulb,
      status: 'completed',
      progress: 100,
      completedDate: 'Sept 15, 2024',
      description: 'Business idea conceptualized and analyzed',
      keyMetrics: [
        { label: 'AI Analysis Score', value: '92/100' },
        { label: 'Goal Alignment', value: 'Excellent' },
        { label: 'Time Spent', value: '3 days' },
      ],
    },
    {
      id: 'validation',
      title: 'Validation',
      icon: CheckCircle,
      status: 'completed',
      progress: 100,
      completedDate: 'Sept 28, 2024',
      description: 'Market and financial validation completed',
      keyMetrics: [
        { label: 'Market Score', value: '85/100' },
        { label: 'Financial Viability', value: '78/100' },
        { label: 'Validation Phase', value: '13 days' },
      ],
    },
    {
      id: 'business-plan',
      title: 'Business Plan',
      icon: FileText,
      status: 'completed',
      progress: 100,
      completedDate: 'Oct 05, 2024',
      description: 'Comprehensive business plan created',
      keyMetrics: [
        { label: 'Canvas Completion', value: '100%' },
        { label: 'Revenue Streams', value: '4' },
        { label: 'Planning Duration', value: '7 days' },
      ],
    },
    {
      id: 'planner',
      title: 'Planning & Resources',
      icon: Calendar,
      status: 'completed',
      progress: 100,
      completedDate: 'Oct 11, 2024',
      description: 'Tasks, resources, and timeline defined',
      keyMetrics: [
        { label: 'Total Tasks', value: '47' },
        { label: 'Team Members', value: '12' },
        { label: 'Budget Allocated', value: '$150K' },
      ],
    },
    {
      id: 'implementation',
      title: 'Implementation',
      icon: Rocket,
      status: 'current',
      progress: 65,
      estimatedDate: 'Dec 15, 2024',
      description: 'Currently executing the business plan',
      keyMetrics: [
        { label: 'Tasks Completed', value: '31/47' },
        { label: 'On-Time Delivery', value: '89%' },
        { label: 'Days Elapsed', value: '45/90' },
      ],
    },
    {
      id: 'outcomes',
      title: 'Outcomes & Analysis',
      icon: Target,
      status: 'upcoming',
      progress: 0,
      estimatedDate: 'Jan 2025',
      description: 'Review results and capture learnings',
      keyMetrics: [
        { label: 'Target Revenue', value: '$50K MRR' },
        { label: 'User Goal', value: '5,000' },
        { label: 'Success Rate', value: 'TBD' },
      ],
    },
  ];

  const currentStageIndex = stages.findIndex(s => s.status === 'current');
  const overallProgress = ((stages.filter(s => s.status === 'completed').length + 
                             (stages[currentStageIndex]?.progress || 0) / 100) / stages.length) * 100;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-500';
      case 'current':
        return 'bg-blue-500';
      case 'upcoming':
        return 'bg-gray-300';
      default:
        return 'bg-gray-300';
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-600">Completed</Badge>;
      case 'current':
        return <Badge className="bg-blue-600">In Progress</Badge>;
      case 'upcoming':
        return <Badge variant="outline">Upcoming</Badge>;
      default:
        return <Badge variant="secondary">Unknown</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Overall Progress Header */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-200">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="flex items-center gap-2 text-blue-900">
                <MapPin className="w-5 h-5" />
                Your Business Journey Progress
              </CardTitle>
              <p className="text-sm text-blue-700 mt-1">
                Currently in Implementation Phase • {Math.round(overallProgress)}% Complete
              </p>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-green-600" />
                <span className="text-green-600">On Track</span>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Progress value={overallProgress} className="h-3" />
          <div className="flex items-center justify-between mt-2 text-sm text-gray-600">
            <span>Started: Sept 15, 2024</span>
            <span>Est. Completion: Jan 2025</span>
          </div>
        </CardContent>
      </Card>

      {/* Journey Map - Vertical Timeline */}
      <div className="relative">
        {/* Vertical Line */}
        <div className="absolute left-8 top-0 bottom-0 w-1 bg-gray-200" style={{ height: 'calc(100% - 60px)' }}></div>

        <div className="space-y-6">
          {stages.map((stage, index) => {
            const Icon = stage.icon;
            const isCurrent = stage.status === 'current';
            
            return (
              <div key={stage.id} className="relative">
                {/* Timeline Node */}
                <div className={`absolute left-0 w-16 h-16 rounded-full border-4 border-white shadow-lg flex items-center justify-center ${getStatusColor(stage.status)} ${isCurrent ? 'ring-4 ring-blue-200 animate-pulse' : ''}`}>
                  <Icon className="w-7 h-7 text-white" />
                </div>

                {/* Content Card */}
                <div className="ml-24">
                  <Card className={`${isCurrent ? 'border-2 border-blue-400 shadow-lg' : 'border'}`}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <CardTitle className="text-lg">{stage.title}</CardTitle>
                            {getStatusBadge(stage.status)}
                          </div>
                          <p className="text-sm text-gray-600">{stage.description}</p>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      {/* Progress Bar */}
                      {stage.progress > 0 && (
                        <div className="mb-4">
                          <div className="flex items-center justify-between text-sm mb-1">
                            <span className="text-gray-600">Progress</span>
                            <span className="text-gray-900">{stage.progress}%</span>
                          </div>
                          <Progress value={stage.progress} className="h-2" />
                        </div>
                      )}

                      {/* Date */}
                      <div className="mb-4">
                        {stage.completedDate && (
                          <div className="text-sm">
                            <span className="text-gray-600">Completed on: </span>
                            <span className="text-green-600">{stage.completedDate}</span>
                          </div>
                        )}
                        {stage.estimatedDate && !stage.completedDate && (
                          <div className="text-sm">
                            <span className="text-gray-600">Estimated: </span>
                            <span className="text-blue-600">{stage.estimatedDate}</span>
                          </div>
                        )}
                      </div>

                      {/* Key Metrics Grid */}
                      <div className="grid grid-cols-3 gap-4 bg-gray-50 p-4 rounded-lg">
                        {stage.keyMetrics.map((metric, idx) => (
                          <div key={idx} className="text-center">
                            <div className="text-xs text-gray-600 mb-1">{metric.label}</div>
                            <div className="text-gray-900">{metric.value}</div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
