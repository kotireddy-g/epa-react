import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { 
  Lightbulb, 
  CheckCircle, 
  FileText, 
  Calendar, 
  Kanban, 
  Target,
  ChevronDown,
  ChevronUp,
  Clock
} from 'lucide-react';

interface JourneyStage {
  stage: 'idea' | 'validation' | 'business-plan' | 'planner' | 'implementation' | 'outcomes';
  name: string;
  icon: any;
  status: 'completed' | 'in-progress' | 'not-started';
  completedDate?: string;
  score?: number;
  summary: string;
  details: {
    key: string;
    value: string;
  }[];
}

interface IdeaJourney {
  id: string;
  ideaName: string;
  companyName: string;
  startDate: string;
  endDate?: string;
  overallStatus: 'success' | 'partial-success' | 'failed' | 'ongoing';
  finalOutcome: string;
  lessonsLearned: string[];
  stages: JourneyStage[];
}

interface IdeaJourneyTimelineProps {
  journey: IdeaJourney;
}

export function IdeaJourneyTimeline({ journey }: IdeaJourneyTimelineProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success':
        return 'bg-green-500';
      case 'partial-success':
        return 'bg-blue-500';
      case 'failed':
        return 'bg-red-500';
      case 'ongoing':
        return 'bg-orange-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'success':
        return <Badge className="bg-green-600">Success</Badge>;
      case 'partial-success':
        return <Badge className="bg-blue-600">Partial Success</Badge>;
      case 'failed':
        return <Badge className="bg-red-600">Failed</Badge>;
      case 'ongoing':
        return <Badge className="bg-orange-600">Ongoing</Badge>;
      default:
        return <Badge variant="secondary">Unknown</Badge>;
    }
  };

  const getStageIcon = (stage: string) => {
    switch (stage) {
      case 'idea':
        return Lightbulb;
      case 'validation':
        return CheckCircle;
      case 'business-plan':
        return FileText;
      case 'planner':
        return Calendar;
      case 'implementation':
        return Kanban;
      case 'outcomes':
        return Target;
      default:
        return Lightbulb;
    }
  };

  return (
    <Card className="border-l-4" style={{ borderLeftColor: getStatusColor(journey.overallStatus).replace('bg-', '#') }}>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <Lightbulb className="w-5 h-5 text-yellow-600" />
              <CardTitle className="text-lg">{journey.ideaName}</CardTitle>
              {getStatusBadge(journey.overallStatus)}
            </div>
            <div className="flex items-center gap-4 text-sm text-gray-600 mt-2">
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {journey.startDate} {journey.endDate && `- ${journey.endDate}`}
              </span>
              {journey.companyName && (
                <Badge variant="outline">{journey.companyName}</Badge>
              )}
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </Button>
        </div>
      </CardHeader>

      <CardContent>
        {/* Timeline Overview */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Journey Progress</span>
            <span className="text-sm text-gray-900">
              {journey.stages.filter(s => s.status === 'completed').length} / {journey.stages.length} stages
            </span>
          </div>
          <div className="flex gap-2">
            {journey.stages.map((stage, index) => {
              const Icon = getStageIcon(stage.stage);
              return (
                <div
                  key={index}
                  className="flex-1 flex flex-col items-center gap-2"
                >
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      stage.status === 'completed'
                        ? 'bg-green-100 text-green-600'
                        : stage.status === 'in-progress'
                        ? 'bg-blue-100 text-blue-600'
                        : 'bg-gray-100 text-gray-400'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  {index < journey.stages.length - 1 && (
                    <div className="w-full h-1 bg-gray-200">
                      <div
                        className={`h-full ${
                          stage.status === 'completed' ? 'bg-green-500' : 'bg-gray-200'
                        }`}
                        style={{ width: stage.status === 'completed' ? '100%' : '0%' }}
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Final Outcome Summary */}
        <div className="bg-gray-50 p-4 rounded-lg mb-4">
          <h4 className="text-sm text-gray-700 mb-2">Final Outcome</h4>
          <p className="text-sm text-gray-900">{journey.finalOutcome}</p>
        </div>

        {/* Expanded Details */}
        {isExpanded && (
          <div className="space-y-6 mt-6">
            {/* Detailed Stage Analysis */}
            <div>
              <h3 className="text-gray-900 mb-4">Stage-by-Stage Analysis</h3>
              <div className="space-y-4">
                {journey.stages.map((stage, index) => {
                  const Icon = getStageIcon(stage.stage);
                  return (
                    <Card key={index} className="bg-gray-50">
                      <CardContent className="pt-4">
                        <div className="flex items-start gap-3 mb-3">
                          <div
                            className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                              stage.status === 'completed'
                                ? 'bg-green-100 text-green-600'
                                : stage.status === 'in-progress'
                                ? 'bg-blue-100 text-blue-600'
                                : 'bg-gray-100 text-gray-400'
                            }`}
                          >
                            <Icon className="w-5 h-5" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-1">
                              <h4 className="text-gray-900">{stage.name}</h4>
                              <div className="flex items-center gap-2">
                                {stage.score !== undefined && (
                                  <Badge variant="outline">{stage.score}%</Badge>
                                )}
                                <Badge
                                  variant={
                                    stage.status === 'completed'
                                      ? 'default'
                                      : stage.status === 'in-progress'
                                      ? 'secondary'
                                      : 'outline'
                                  }
                                >
                                  {stage.status.replace('-', ' ')}
                                </Badge>
                              </div>
                            </div>
                            {stage.completedDate && (
                              <p className="text-xs text-gray-500 mb-2">
                                Completed: {stage.completedDate}
                              </p>
                            )}
                            <p className="text-sm text-gray-700 mb-3">{stage.summary}</p>

                            {/* Stage Details */}
                            {stage.details.length > 0 && (
                              <div className="space-y-2 bg-white p-3 rounded">
                                {stage.details.map((detail, idx) => (
                                  <div key={idx} className="flex justify-between text-sm">
                                    <span className="text-gray-600">{detail.key}:</span>
                                    <span className="text-gray-900">{detail.value}</span>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>

            {/* Lessons Learned */}
            <Card className="bg-blue-50 border-blue-200">
              <CardHeader>
                <CardTitle className="text-base text-blue-900">Lessons Learned</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {journey.lessonsLearned.map((lesson, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm text-blue-900">
                      <span className="text-blue-600 flex-shrink-0 mt-1">•</span>
                      <span>{lesson}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
