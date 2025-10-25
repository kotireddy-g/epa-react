import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { Sparkles, Edit, Building2, Edit2, Check, X } from 'lucide-react';
import { Idea } from '../App';
import { AnalyseResponse } from '../services/ideaAnalysisApi';

interface CompanyNameDialogProps {
  isOpen: boolean;
  idea: Idea;
  onConfirm: (companyName: string, industry?: string, domain?: string) => void;
  apiResponse?: AnalyseResponse | null;
}

export function CompanyNameDialog({ isOpen, idea, onConfirm, apiResponse }: CompanyNameDialogProps) {
  const [selectedName, setSelectedName] = useState<string>('');
  const [customName, setCustomName] = useState('');
  const [isCustom, setIsCustom] = useState(false);
  
  // Industry Category & Domain
  const [aiCategory, setAiCategory] = useState('Technology');
  const [aiDomain, setAiDomain] = useState('SaaS & Cloud Solutions');
  const [isEditingCategory, setIsEditingCategory] = useState(false);
  const [customCategory, setCustomCategory] = useState('');
  const [customDomain, setCustomDomain] = useState('');

  // Generate company name suggestions based on the idea
  const generateSuggestions = () => {
    const keywords = idea.summary.split(' ').slice(0, 3);
    return [
      `${keywords[0]} Solutions`,
      `${keywords[0]} ${keywords[1] || 'Tech'}`,
      `${keywords[0]} Innovation`,
      `Next${keywords[0]}`,
      `${keywords[0]} Labs`,
    ].filter(name => name.length > 3);
  };

  const suggestions = generateSuggestions();

  // Analyze idea to determine category and domain
  const analyzeIdea = (description: string) => {
    if (description?.toLowerCase().includes('software') || description?.toLowerCase().includes('app')) {
      setAiCategory('Technology');
      setAiDomain('Software & Applications');
    } else if (description?.toLowerCase().includes('food') || description?.toLowerCase().includes('restaurant')) {
      setAiCategory('Food & Beverage');
      setAiDomain('Restaurant & Hospitality');
    } else if (description?.toLowerCase().includes('health') || description?.toLowerCase().includes('medical')) {
      setAiCategory('Healthcare');
      setAiDomain('Medical Technology');
    } else if (description?.toLowerCase().includes('education') || description?.toLowerCase().includes('learning')) {
      setAiCategory('Education');
      setAiDomain('EdTech & Online Learning');
    } else if (description?.toLowerCase().includes('finance') || description?.toLowerCase().includes('bank')) {
      setAiCategory('Finance');
      setAiDomain('FinTech & Banking');
    } else {
      setAiCategory('Technology');
      setAiDomain('SaaS & Cloud Solutions');
    }
  };

  const handleSaveCustomCategory = () => {
    if (customCategory.trim()) {
      setAiCategory(customCategory);
    }
    if (customDomain.trim()) {
      setAiDomain(customDomain);
    }
    setIsEditingCategory(false);
    setCustomCategory('');
    setCustomDomain('');
  };

  const handleCancelEdit = () => {
    setIsEditingCategory(false);
    setCustomCategory('');
    setCustomDomain('');
  };

  // Analyze idea when dialog opens - use API data if available
  useEffect(() => {
    // Priority 1: Use API response data
    if (apiResponse?.final_output?.market_attributes) {
      const attrs = apiResponse.final_output.market_attributes;
      if (attrs.category) {
        setAiCategory(String(attrs.category));
      }
      if (attrs.domain) {
        setAiDomain(String(attrs.domain));
      }
      console.log('[CompanyNameDialog] Using API data:', { category: attrs.category, domain: attrs.domain });
    } 
    // Priority 2: Fallback to analyzing description
    else if (idea?.description) {
      analyzeIdea(idea.description);
    }
  }, [idea, apiResponse]);

  const handleConfirm = () => {
    const finalName = isCustom ? customName : selectedName;
    if (finalName) {
      onConfirm(finalName, aiCategory, aiDomain);
    }
  };

  const handleSelectSuggestion = (name: string) => {
    setSelectedName(name);
    setIsCustom(false);
    setCustomName('');
  };

  const handleCustomNameChange = (value: string) => {
    setCustomName(value);
    setIsCustom(true);
    setSelectedName('');
  };

  return (
    <Dialog open={isOpen} onOpenChange={() => {}}>
      <DialogContent className="!w-[1400px] !h-[800px] !max-w-[1400px] max-h-[95vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-yellow-500" />
            Choose Your Company Name & Industry
          </DialogTitle>
          <DialogDescription>
            Based on your idea: "{idea.summary}", configure your business details
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto pr-4">
          <div className="space-y-6 pb-4">
            {/* Industry Category & Domain Section */}
            <Card className="bg-gradient-to-r from-purple-50 to-blue-50 border-2 border-purple-200">
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  <Building2 className="w-6 h-6 text-purple-600 flex-shrink-0 mt-1" />
                  <div className="flex-1">
                    <h3 className="text-gray-900 mb-2">AI-Identified Industry Category & Domain</h3>
                    <p className="text-sm text-gray-600 mb-4">
                      Based on your idea, we've identified the following category and domain. You can customize these if needed.
                    </p>

                    {!isEditingCategory ? (
                      <div className="space-y-3">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="bg-white p-4 rounded-lg border border-purple-200">
                            <div className="text-sm text-gray-600 mb-2">Industry Category</div>
                            <Badge className="bg-purple-600 text-base">{aiCategory}</Badge>
                          </div>
                          <div className="bg-white p-4 rounded-lg border border-purple-200">
                            <div className="text-sm text-gray-600 mb-2">Domain</div>
                            <Badge className="bg-blue-600 text-base">{aiDomain}</Badge>
                          </div>
                        </div>
                        <div className="flex justify-end">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setIsEditingCategory(true)}
                            className="gap-2"
                          >
                            <Edit2 className="w-4 h-4" />
                            Customize Category & Domain
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-3 bg-white p-4 rounded-lg border border-purple-200">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm text-gray-700 mb-2">
                              Custom Industry Category
                            </label>
                            <Input
                              placeholder="e.g., Healthcare, Finance, Retail..."
                              value={customCategory}
                              onChange={(e) => setCustomCategory(e.target.value)}
                              className="bg-white"
                            />
                          </div>
                          <div>
                            <label className="block text-sm text-gray-700 mb-2">
                              Custom Domain
                            </label>
                            <Input
                              placeholder="e.g., Medical Devices, Fintech, E-commerce..."
                              value={customDomain}
                              onChange={(e) => setCustomDomain(e.target.value)}
                              className="bg-white"
                            />
                          </div>
                        </div>
                        <div className="flex gap-2 justify-end">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={handleCancelEdit}
                            className="gap-2"
                          >
                            <X className="w-4 h-4" />
                            Cancel
                          </Button>
                          <Button
                            size="sm"
                            onClick={handleSaveCustomCategory}
                            className="gap-2"
                            disabled={!customCategory.trim() && !customDomain.trim()}
                          >
                            <Check className="w-4 h-4" />
                            Save
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Separator />
          {/* Suggested Names */}
          <div>
            <h3 className="text-sm text-gray-700 mb-3">Suggested Names</h3>
            <div className="grid grid-cols-2 gap-3">
              {suggestions.map((name, index) => (
                <Card
                  key={index}
                  className={`cursor-pointer transition-all ${
                    selectedName === name && !isCustom
                      ? 'border-blue-500 bg-blue-50'
                      : 'hover:border-gray-400'
                  }`}
                  onClick={() => handleSelectSuggestion(name)}
                >
                  <CardContent className="p-4">
                    <p className="text-center text-gray-900">{name}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Custom Name Input */}
          <div>
            <Label htmlFor="customName" className="flex items-center gap-2 mb-2">
              <Edit className="w-4 h-4" />
              Or Create Your Own
            </Label>
            <Input
              id="customName"
              placeholder="Enter your custom company name"
              value={customName}
              onChange={(e) => handleCustomNameChange(e.target.value)}
              className={isCustom ? 'border-blue-500' : ''}
            />
          </div>

          {/* Selected Name Preview */}
          {(selectedName || customName) && (
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">Your Company Name:</p>
              <p className="text-2xl text-gray-900">
                {isCustom ? customName : selectedName}
              </p>
            </div>
          )}

          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t mt-4">
          <Button
            onClick={handleConfirm}
            disabled={!selectedName && !customName}
            size="lg"
            className="gap-2"
          >
            Continue to Validation
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
