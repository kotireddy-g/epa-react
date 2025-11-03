import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Card } from './ui/card';
import { Textarea } from './ui/textarea';
import { TrendingUp, AlertCircle, CheckCircle, XCircle, Edit2, Shield } from 'lucide-react';

interface MarketAnalysisDialogProps {
  isOpen: boolean;
  onClose: () => void;
  category: 'strength' | 'quality' | 'customers';
  matchType: 'large' | 'medium' | 'small';
  ideaKeywords: { [key: string]: string };
  onApplyRecommendations: (updatedKeywords: { [key: string]: string }) => void;
  analysisScores?: {
    strength: { large: number; medium: number; small: number; total: number };
    quality: { large: number; medium: number; small: number; total: number };
    customers: { large: number; medium: number; small: number; total: number };
  };
}

export function MarketAnalysisDialog({ isOpen, onClose, category, matchType, ideaKeywords, onApplyRecommendations, analysisScores }: MarketAnalysisDialogProps) {
  const [editedKeywords, setEditedKeywords] = useState<{ [key: string]: string }>(ideaKeywords);
  const [editingField, setEditingField] = useState<string | null>(null);

  // Reset edited keywords when dialog opens
  useEffect(() => {
    if (isOpen) {
      setEditedKeywords(ideaKeywords);
      setEditingField(null);
    }
  }, [isOpen, ideaKeywords]);
  // Simulate market analysis based on category and match type
  const getMarketAnalysis = () => {
    const categoryData = {
      strength: {
        title: 'Strength & Strategic Analysis',
        icon: Shield,
        color: 'blue',
        marketStandards: {
          location: 'Global market presence with local adaptation',
          budget: '$500K - $2M seed funding recommended',
          category: 'SaaS/Technology sector growth rate 25% YoY',
          industry: 'Tech industry standards: Cloud-first, Mobile-ready',
          domain: 'Digital transformation and AI integration',
          timeline: '18-24 months to market leadership',
          scalability: 'Multi-region expansion capability'
        }
      },
      quality: {
        title: 'Quality & Standards Analysis',
        icon: CheckCircle,
        color: 'green',
        marketStandards: {
          location: 'Tier-1 city presence for talent acquisition',
          budget: 'Cost-efficient lean startup approach',
          category: 'Premium positioning with value delivery',
          industry: 'ISO/Industry compliance requirements',
          domain: 'Best-in-class user experience standards',
          validation: 'Customer satisfaction score >8/10',
          metrics: 'Data-driven decision making framework'
        }
      },
      customers: {
        title: 'Customer & Market Fit Analysis',
        icon: AlertCircle,
        color: 'purple',
        marketStandards: {
          location: 'Target demographic concentration areas',
          budget: 'Customer acquisition cost optimization',
          category: 'Clear customer segment definition',
          industry: 'Market pain point alignment',
          domain: 'Customer retention strategy',
          engagement: 'Multi-channel customer touchpoints',
          growth: 'Viral coefficient >1.2 for organic growth'
        }
      }
    };

    return categoryData[category];
  };

  const analysis = getMarketAnalysis();
  const Icon = analysis.icon;

  // Compare idea keywords with market standards (OLD format)
  const compareKeywords = () => {
    const comparisons = [];
    
    for (const [key, marketValue] of Object.entries(analysis.marketStandards)) {
      const ideaValue = editedKeywords[key] || '';
      const hasMatch = ideaValue.toLowerCase().includes(key) || ideaValue.length > 0;
      
      comparisons.push({
        aspect: key.charAt(0).toUpperCase() + key.slice(1),
        aspectKey: key,
        ideaValue: ideaValue || 'Not specified',
        marketStandard: marketValue,
        status: hasMatch ? 
          (matchType === 'large' ? 'match' : matchType === 'medium' ? 'partial' : 'mismatch') :
          'missing',
        recommendation: '',
        color: 'gray'
      });
    }
    
    return comparisons;
  };

  const comparisons = compareKeywords();

  const handleUpdateIdeaValue = (aspectKey: string, value: string) => {
    setEditedKeywords(prev => ({
      ...prev,
      [aspectKey]: value
    }));
  };

  const handleApplyRecommendations = () => {
    onApplyRecommendations(editedKeywords);
    onClose();
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'match':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'partial':
        return <AlertCircle className="w-5 h-5 text-yellow-600" />;
      default:
        return <XCircle className="w-5 h-5 text-red-600" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      match: 'bg-green-100 text-green-800 border-green-300',
      partial: 'bg-yellow-100 text-yellow-800 border-yellow-300',
      mismatch: 'bg-orange-100 text-orange-800 border-orange-300',
      missing: 'bg-red-100 text-red-800 border-red-300'
    };
    
    const labels = {
      match: 'Strong Match',
      partial: 'Partial Match',
      mismatch: 'Needs Improvement',
      missing: 'Missing Information'
    };
    
    return (
      <Badge variant="outline" className={styles[status as keyof typeof styles]}>
        {labels[status as keyof typeof labels]}
      </Badge>
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="!w-[1200px] !h-[700px] !max-w-[90vw] max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Icon className={`w-6 h-6 text-${analysis.color}-600`} />
            {analysis.title}
          </DialogTitle>
          <DialogDescription>
            AI-powered comparison of your idea against market standards and best practices
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto pr-4">
          <div className="space-y-4 pb-4">
            {analysisScores && (
              <div className="grid grid-cols-3 gap-3">
                {(['strength','quality','customers'] as const).map((k) => (
                  <div key={k} className="p-3 rounded-lg border bg-white">
                    <div className="text-xs text-gray-600 capitalize">{k}</div>
                    <div className="text-sm text-gray-900">{analysisScores[k].large + analysisScores[k].medium + analysisScores[k].small}/{analysisScores[k].total}</div>
                  </div>
                ))}
              </div>
            )}
            {/* Match Type Indicator */}
            <Card className={`p-4 ${
              matchType === 'large' ? 'bg-green-50 border-green-300' :
              matchType === 'medium' ? 'bg-yellow-50 border-yellow-300' :
              'bg-red-50 border-red-300'
            }`}>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg text-black mb-1">
                    {matchType === 'large' ? 'Strong Match' : 
                     matchType === 'medium' ? 'Moderate Match' : 
                     'Needs Improvement'}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {matchType === 'large' ? 'Your idea aligns well with market standards' :
                     matchType === 'medium' ? 'Your idea has potential with some refinements' :
                     'Consider these improvements to strengthen your idea'}
                  </p>
                </div>
                <div className={`text-4xl ${
                  matchType === 'large' ? 'text-green-600' :
                  matchType === 'medium' ? 'text-yellow-600' :
                  'text-red-600'
                }`}>
                  {matchType === 'large' ? '✓' : matchType === 'medium' ? '◐' : '!'}
                </div>
              </div>
            </Card>

            {/* Detailed Comparison */}
            <div className="space-y-3">
              <h3 className="text-black">Market vs Idea Comparison</h3>
              
              {comparisons.map((comparison, index) => (
                <Card key={index} className="p-4 hover:shadow-md transition-shadow">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(comparison.status)}
                        <h4 className="text-black">{comparison.aspect}</h4>
                      </div>
                      {getStatusBadge(comparison.status)}
                    </div>
                    
                    <div className="grid md:grid-cols-2 gap-4">
                      {/* Your Idea - Editable */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="text-sm text-gray-600">Your Idea</div>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => setEditingField(editingField === comparison.aspectKey ? null : comparison.aspectKey)}
                            className="h-6 text-xs gap-1"
                          >
                            <Edit2 className="w-3 h-3" />
                            {editingField === comparison.aspectKey ? 'Done' : 'Edit'}
                          </Button>
                        </div>
                        {editingField === comparison.aspectKey ? (
                          <Textarea
                            value={editedKeywords[comparison.aspectKey] || ''}
                            onChange={(e) => handleUpdateIdeaValue(comparison.aspectKey, e.target.value)}
                            className="min-h-[80px] text-sm"
                            placeholder={`Enter your ${comparison.aspect.toLowerCase()}...`}
                          />
                        ) : (
                          <div className={`p-3 rounded-lg border-2 cursor-pointer hover:shadow-sm transition-shadow ${
                            comparison.status === 'match' ? 'bg-green-50 border-green-200' :
                            comparison.status === 'partial' ? 'bg-yellow-50 border-yellow-200' :
                            'bg-red-50 border-red-200'
                          }`}
                          onClick={() => setEditingField(comparison.aspectKey)}
                          >
                            <p className="text-sm text-gray-900">
                              {comparison.ideaValue}
                            </p>
                          </div>
                        )}
                      </div>
                      
                      {/* Market Standard */}
                      <div className="space-y-2">
                        <div className="text-sm text-gray-600">Market Standard</div>
                        <div className="p-3 rounded-lg border-2 bg-blue-50 border-blue-200">
                          <p className="text-sm text-gray-900">
                            {comparison.marketStandard}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* AI Recommendation - Dynamic from API or fallback */}
                    {(comparison.recommendation || comparison.status !== 'match') && (
                      <div className="mt-2 p-3 bg-gray-50 rounded-lg border border-gray-200">
                        <p className="text-xs text-gray-600 mb-1">💡 AI Recommendation:</p>
                        <p className="text-sm text-gray-800">
                          {comparison.recommendation || 
                           (comparison.status === 'missing' ? 
                            `Add ${comparison.aspect.toLowerCase()} information to strengthen your idea. ${comparison.marketStandard}` :
                            `Consider aligning your ${comparison.aspect.toLowerCase()} with market standards: ${comparison.marketStandard}`)
                          }
                        </p>
                      </div>
                    )}
                  </div>
                </Card>
              ))}
            </div>

            {/* Summary Recommendations */}
            <Card className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-200">
              <h3 className="text-black mb-3 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-blue-600" />
                Key Recommendations
              </h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-1">•</span>
                  <span>Fill in missing keyword information to improve market alignment</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-1">•</span>
                  <span>Review market standards and adjust your approach accordingly</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-1">•</span>
                  <span>Focus on areas marked as "Needs Improvement" for better validation</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-1">•</span>
                  <span>Maintain and strengthen areas with "Strong Match" status</span>
                </li>
              </ul>
            </Card>
          </div>
        </div>

        <div className="flex justify-between items-center pt-4 border-t mt-4">
          <div className="text-sm text-gray-600">
            Click "Apply" to update your idea with the changes
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button 
              onClick={handleApplyRecommendations}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              Apply Recommendations
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
