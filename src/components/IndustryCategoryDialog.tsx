import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Input } from './ui/input';

interface IndustryCategoryDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (industry: string, category: string) => void;
}

const INDUSTRIES = [
  'Technology',
  'Healthcare',
  'Finance',
  'Education',
  'Retail',
  'Manufacturing',
  'Hospitality',
  'Real Estate',
  'Transportation',
  'Agriculture',
  'Energy',
  'Media & Entertainment',
  'Telecommunications',
  'Construction',
  'Automotive',
  'Fashion & Retail',
  'Food & Beverage',
  'Consulting',
  'Legal Services',
  'Marketing & Advertising',
  'Others'
];

const CATEGORIES = [
  'SaaS',
  'E-commerce',
  'Fintech',
  'Edtech',
  'Healthtech',
  'Foodtech',
  'Agritech',
  'Proptech',
  'Logistics',
  'B2B Services',
  'B2C Services',
  'Marketplace',
  'Social Media',
  'Gaming',
  'AI/ML',
  'Blockchain',
  'IoT',
  'Cybersecurity',
  'Cloud Services',
  'Mobile Apps',
  'Web Development',
  'Consulting',
  'Manufacturing',
  'Retail',
  'Restaurant',
  'Hotel',
  'Travel',
  'Fashion',
  'Beauty & Wellness',
  'Sports & Fitness',
  'Entertainment',
  'Sustainable Fashion',
  'Quick Service Restaurant',
  'Others'
];

export function IndustryCategoryDialog({ isOpen, onClose, onSubmit }: IndustryCategoryDialogProps) {
  const [industry, setIndustry] = useState('');
  const [category, setCategory] = useState('');
  const [customIndustry, setCustomIndustry] = useState('');
  const [customCategory, setCustomCategory] = useState('');
  const [showCustomIndustry, setShowCustomIndustry] = useState(false);
  const [showCustomCategory, setShowCustomCategory] = useState(false);

  const handleIndustryChange = (value: string) => {
    setIndustry(value);
    if (value === 'Others') {
      setShowCustomIndustry(true);
    } else {
      setShowCustomIndustry(false);
      setCustomIndustry('');
    }
  };

  const handleCategoryChange = (value: string) => {
    setCategory(value);
    if (value === 'Others') {
      setShowCustomCategory(true);
    } else {
      setShowCustomCategory(false);
      setCustomCategory('');
    }
  };

  const handleSubmit = () => {
    const finalIndustry = showCustomIndustry ? customIndustry : industry;
    const finalCategory = showCustomCategory ? customCategory : category;

    if (!finalIndustry || !finalCategory) {
      alert('Please select both Industry and Category');
      return;
    }

    onSubmit(finalIndustry, finalCategory);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Select Industry & Category</DialogTitle>
          <DialogDescription>
            Please select the industry and category for your business idea to get better AI analysis.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Industry Selection */}
          <div className="space-y-2">
            <Label htmlFor="industry">Industry *</Label>
            <Select value={industry} onValueChange={handleIndustryChange}>
              <SelectTrigger id="industry">
                <SelectValue placeholder="Select industry" />
              </SelectTrigger>
              <SelectContent className="max-h-[300px]">
                {INDUSTRIES.map((ind) => (
                  <SelectItem key={ind} value={ind}>
                    {ind}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {showCustomIndustry && (
              <Input
                placeholder="Enter your industry"
                value={customIndustry}
                onChange={(e) => setCustomIndustry(e.target.value)}
                className="mt-2"
              />
            )}
          </div>

          {/* Category Selection */}
          <div className="space-y-2">
            <Label htmlFor="category">Category *</Label>
            <Select value={category} onValueChange={handleCategoryChange}>
              <SelectTrigger id="category">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent className="max-h-[300px]">
                {CATEGORIES.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {showCustomCategory && (
              <Input
                placeholder="Enter your category"
                value={customCategory}
                onChange={(e) => setCustomCategory(e.target.value)}
                className="mt-2"
              />
            )}
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit}
            className="bg-red-600 hover:bg-red-700"
          >
            Continue to Analysis
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
