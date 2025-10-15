import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { TrendingUp, TrendingDown, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';

interface OutcomeDetailDialogProps {
  isOpen: boolean;
  onClose: () => void;
  outcome: OutcomeTask;
}

export interface OutcomeTask {
  id: string;
  title: string;
  category: string;
  status: 'exceeded' | 'met' | 'below' | 'failed';
  plannedValue: string;
  actualValue: string;
  variance: number;
  positiveImpacts: string[];
  negativeImpacts: string[];
  reasons: {
    positive: string[];
    negative: string[];
  };
  recommendations: string[];
  lastUpdated: string;
}

export function OutcomeDetailDialog({ isOpen, onClose, outcome }: OutcomeDetailDialogProps) {
  const getStatusIcon = () => {
    switch (outcome.status) {
      case 'exceeded':
        return <TrendingUp className="w-6 h-6 text-green-600" />;
      case 'met':
        return <CheckCircle className="w-6 h-6 text-blue-600" />;
      case 'below':
        return <TrendingDown className="w-6 h-6 text-orange-600" />;
      case 'failed':
        return <XCircle className="w-6 h-6 text-red-600" />;
    }
  };

  const getStatusColor = () => {
    switch (outcome.status) {
      case 'exceeded':
        return 'bg-green-50 border-green-200 text-green-900';
      case 'met':
        return 'bg-blue-50 border-blue-200 text-blue-900';
      case 'below':
        return 'bg-orange-50 border-orange-200 text-orange-900';
      case 'failed':
        return 'bg-red-50 border-red-200 text-red-900';
    }
  };

  const getStatusLabel = () => {
    switch (outcome.status) {
      case 'exceeded':
        return 'Exceeded Expectations';
      case 'met':
        return 'Met Expectations';
      case 'below':
        return 'Below Expectations';
      case 'failed':
        return 'Did Not Meet Goals';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="!w-[1400px] !h-[800px] !max-w-[1400px] max-h-[95vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            {getStatusIcon()}
            {outcome.title}
          </DialogTitle>
          <DialogDescription>
            Detailed breakdown of plan vs implementation results
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto pr-4">
          <div className="space-y-6 pb-4">
          {/* Status Overview */}
          <Card className={`${getStatusColor()} border-2`}>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="mb-1">Overall Status</h3>
                  <p className="text-sm opacity-80">{getStatusLabel()}</p>
                </div>
                <Badge className={getStatusColor()} variant="outline">
                  {outcome.variance > 0 ? '+' : ''}{outcome.variance}%
                </Badge>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mt-4">
                <div>
                  <p className="text-sm opacity-70 mb-1">Planned</p>
                  <p className="text-lg">{outcome.plannedValue}</p>
                </div>
                <div>
                  <p className="text-sm opacity-70 mb-1">Actual</p>
                  <p className="text-lg">{outcome.actualValue}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Plan vs Implementation Comparison */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Plan vs Implementation</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Expected Performance</span>
                  <span>100%</span>
                </div>
                <Progress value={100} className="h-2 bg-gray-200" />
              </div>
              
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Actual Performance</span>
                  <span>{100 + outcome.variance}%</span>
                </div>
                <Progress 
                  value={100 + outcome.variance} 
                  className={`h-2 ${
                    outcome.variance >= 0 ? 'bg-green-100' : 'bg-red-100'
                  }`}
                />
              </div>
            </CardContent>
          </Card>

          {/* Positive Impacts */}
          <Card className="border-green-200 bg-green-50/50">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2 text-green-900">
                <TrendingUp className="w-5 h-5" />
                Positive Impacts
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="text-sm text-green-800 mb-2">What went well:</h4>
                <ul className="space-y-2">
                  {outcome.positiveImpacts.map((impact, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm text-green-900">
                      <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                      <span>{impact}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="text-sm text-green-800 mb-2">Reasons for success:</h4>
                <ul className="space-y-1">
                  {outcome.reasons.positive.map((reason, index) => (
                    <li key={index} className="text-sm text-green-900 ml-4">
                      • {reason}
                    </li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Negative Impacts */}
          <Card className="border-orange-200 bg-orange-50/50">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2 text-orange-900">
                <AlertTriangle className="w-5 h-5" />
                Challenges & Areas for Improvement
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="text-sm text-orange-800 mb-2">What didn't go as planned:</h4>
                <ul className="space-y-2">
                  {outcome.negativeImpacts.map((impact, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm text-orange-900">
                      <XCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                      <span>{impact}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="text-sm text-orange-800 mb-2">Root causes:</h4>
                <ul className="space-y-1">
                  {outcome.reasons.negative.map((reason, index) => (
                    <li key={index} className="text-sm text-orange-900 ml-4">
                      • {reason}
                    </li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Recommendations */}
          <Card className="border-blue-200 bg-blue-50/50">
            <CardHeader>
              <CardTitle className="text-base text-blue-900">Recommendations for Future</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {outcome.recommendations.map((recommendation, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm text-blue-900">
                    <span className="text-blue-600 flex-shrink-0">{index + 1}.</span>
                    <span>{recommendation}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
          </div>
        </div>

        <div className="flex justify-end pt-4 border-t mt-4">
          <Button onClick={onClose}>Close</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
