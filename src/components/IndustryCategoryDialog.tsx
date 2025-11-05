import { useEffect, useMemo, useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Input } from './ui/input';
import { ideaAnalysisApi, type IndustryDomainCategory } from '../services/ideaAnalysisApi';

interface IndustryCategoryDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (industry: string, category: string) => void;
}

// Fallback Industry-Category mapping with subcategories (used if API fails)
const FALLBACK_INDUSTRY_DATA: IndustryDomainCategory[] = [
  {
    "Industry": "Information Technology",
    "Domain": "Software & Services",
    "Subcategories": [
      "Application Development",
      "SaaS",
      "IT Consulting",
      "Web Design",
      "Cybersecurity",
      "E-commerce Platforms",
      "AI & Machine Learning Solutions",
      "Managed IT"
    ]
  },
  {
    "Industry": "Education",
    "Domain": "Learning Solutions",
    "Subcategories": [
      "Schools",
      "Colleges",
      "EdTech Platforms",
      "Coaching Centers",
      "Skill Training",
      "Vocational Courses",
      "Language Schools",
      "Tutoring"
    ]
  },
  {
    "Industry": "Health Care",
    "Domain": "Medical Services",
    "Subcategories": [
      "Hospitals",
      "Clinics",
      "Pharmacies",
      "Diagnostic Labs",
      "Nursing Homes",
      "Ambulance Service",
      "Wellness Centers",
      "Telemedicine",
      "Rehabilitation",
      "Preventive Care & Nutrition"
    ]
  },
  {
    "Industry": "Financial Services",
    "Domain": "Banking",
    "Subcategories": [
      "Retail Banking",
      "Investment Banking",
      "Cooperative Banks",
      "Microfinance",
      "Wealth Management",
      "Payment Gateways",
      "Insurance Brokers",
      "NBFCs"
    ]
  },
  {
    "Industry": "Retail",
    "Domain": "Commerce",
    "Subcategories": [
      "Supermarkets",
      "Department Stores",
      "Online Marketplaces",
      "Convenience Stores",
      "Boutique Shops",
      "Malls",
      "Wholesalers",
      "Hypermarts"
    ]
  },
  {
    "Industry": "Food & Beverages",
    "Domain": "Food Business",
    "Subcategories": [
      "Juice shops",
      "Street Food Stalls",
      "Restaurants",
      "Cafes",
      "Bakeries",
      "Food Trucks",
      "Catering services",
      "Ice Cream Parlors",
      "Fast Food outlets",
      "Organic Stores",
      "Sweet shops",
      "Online Food Delivery",
      "Food Aggregators"
    ]
  },
  {
    "Industry": "Construction & Real Estate",
    "Domain": "Built Environment",
    "Subcategories": [
      "Residential Builders",
      "Commercial Developers",
      "Interior Designers",
      "Real Estate Brokers",
      "Property Management",
      "Construction Contractors"
    ]
  },
  {
    "Industry": "Transportation",
    "Domain": "Mobility Solutions",
    "Subcategories": [
      "Taxi & Ride-Sharing Services",
      "Logistics & Supply Chain",
      "Courier & Parcel Services",
      "Trucking & Freight",
      "Freight",
      "Public Transport",
      "Bike & Scooter Rentals",
      "Shipping Companies",
      "Warehousing"
    ]
  },
  {
    "Industry": "Agriculture",
    "Domain": "Farming & Distribution",
    "Subcategories": [
      "Crop Farming",
      "Dairy",
      "Poultry",
      "Fisheries",
      "Seed Suppliers",
      "Fertilizer Dealers",
      "Farm Equipment",
      "Packaged Foods",
      "Beverage Manufacturers",
      "Organic & Health Food Stores",
      "Dairy & Ice Cream Production"
    ]
  },
  {
    "Industry": "Manufacturing",
    "Domain": "Processed Goods",
    "Subcategories": [
      "Furniture",
      "Apparel & Textiles",
      "Footwear",
      "Chemicals",
      "Paper",
      "Metals",
      "Plastics",
      "Electronics",
      "Machinery",
      "Home Appliances",
      "Paper Goods",
      "Metals & Alloys",
      "Tools & Components"
    ]
  },
  {
    "Industry": "Hospitality & Tourism",
    "Domain": "Travel & Leisure",
    "Subcategories": [
      "Hotels",
      "Resorts",
      "Travel Agencies",
      "Tour Operators",
      "Homestays",
      "Car Rentals",
      "Cruise Lines",
      "Event Management",
      "Theme Parks"
    ]
  },
  {
    "Industry": "Communication Services",
    "Domain": "Media & Telecommunications",
    "Subcategories": [
      "TV Channels",
      "Radio Stations",
      "Digital Content Creators",
      "Social Media Firms",
      "Newspapers & Magazines",
      "PR Agencies",
      "Advertising",
      "Music Production",
      "Mobile Network Operators",
      "Internet Providers",
      "Cable & Satellite Services",
      "Music & Podcast Production"
    ]
  },
  {
    "Industry": "Pharmaceuticals",
    "Domain": "Drug & Biotech",
    "Subcategories": [
      "Medicine Manufacturers",
      "Pharma Distributors",
      "Biotechnology Firms",
      "Research Labs",
      "Vaccine Development",
      "Generic Medicine"
    ]
  },
  {
    "Industry": "Consumer Goods & Durables",
    "Domain": "FMCG",
    "Subcategories": [
      "Packaged Foods",
      "Detergents",
      "Personal Care",
      "Cosmetics",
      "Stationery",
      "Beverages",
      "Snacks",
      "Tobacco",
      "Electronics",
      "Home Appliances",
      "Furniture",
      "Kitchenware"
    ]
  },
  {
    "Industry": "Automotive",
    "Domain": "Vehicle Expertise",
    "Subcategories": [
      "Car Dealerships",
      "Auto Service Centers",
      "Spare Parts",
      "Manufacturing",
      "Bike Assemblers",
      "EV Charging Stations",
      "Ride-sharing Companies"
    ]
  },
  {
    "Industry": "Entertainment",
    "Domain": "Cultural Activities",
    "Subcategories": [
      "Cinema Halls",
      "Event Producers",
      "Artists",
      "Performers",
      "Gaming Zones",
      "Amusement Centers",
      "Film Studios",
      "Streaming Services",
      "Esports Organizations",
      "Influencer Networks",
      "Talent Management Agencies"
    ]
  },
  {
    "Industry": "Utilities",
    "Domain": "Infrastructure",
    "Subcategories": [
      "Electricity Providers",
      "Water Suppliers",
      "Renewable Energy Firms",
      "Gas Distribution",
      "Waste Management",
      "Recycling Plants"
    ]
  }
];

export function IndustryCategoryDialog({ isOpen, onClose, onSubmit }: IndustryCategoryDialogProps) {
  const [industry, setIndustry] = useState('');
  const [category, setCategory] = useState('');
  const [customIndustry, setCustomIndustry] = useState('');
  const [customCategory, setCustomCategory] = useState('');
  const [showCustomIndustry, setShowCustomIndustry] = useState(false);
  const [showCustomCategory, setShowCustomCategory] = useState(false);
  const [industryData, setIndustryData] = useState<IndustryDomainCategory[]>(FALLBACK_INDUSTRY_DATA);
  const [isLoadingIndustries, setIsLoadingIndustries] = useState(false);
  const [fetchError, setFetchError] = useState('');

  useEffect(() => {
    let isMounted = true;

    const fetchIndustryData = async () => {
      setIsLoadingIndustries(true);
      setFetchError('');

      try {
        const data = await ideaAnalysisApi.getIndustryDomainSubcategories();
        if (isMounted && Array.isArray(data) && data.length > 0) {
          setIndustryData(data);
        }
      } catch (error: any) {
        console.error('[IndustryCategoryDialog] Failed to fetch industry metadata:', error);
        if (isMounted) {
          setFetchError(error?.message || 'Failed to load industry data. Using default list.');
        }
      } finally {
        if (isMounted) {
          setIsLoadingIndustries(false);
        }
      }
    };

    fetchIndustryData();

    return () => {
      isMounted = false;
    };
  }, []);

  const industryOptions = useMemo(() => {
    const unique = Array.from(new Set(industryData.map(item => item.Industry)));
    return [...unique, 'Others'];
  }, [industryData]);

  // Get categories based on selected industry
  const getCategories = () => {
    if (!industry || industry === 'Others') {
      return ['Others'];
    }
    const selectedIndustry = industryData.find(item => item.Industry === industry);
    return selectedIndustry ? [...selectedIndustry.Subcategories, 'Others'] : ['Others'];
  };

  const handleIndustryChange = (value: string) => {
    setIndustry(value);
    setCategory(''); // Reset category when industry changes
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
            <Select 
              value={industry} 
              onValueChange={handleIndustryChange}
              disabled={isLoadingIndustries}
            >
              <SelectTrigger id="industry">
                <SelectValue placeholder={isLoadingIndustries ? 'Loading industries...' : 'Select industry'} />
              </SelectTrigger>
              <SelectContent className="max-h-[300px]">
                {industryOptions.map((ind) => (
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
            <Select 
              value={category} 
              onValueChange={handleCategoryChange}
              disabled={!industry || isLoadingIndustries}
            >
              <SelectTrigger id="category">
                <SelectValue placeholder={industry ? (isLoadingIndustries ? 'Loading categories...' : 'Select category') : 'Select industry first'} />
              </SelectTrigger>
              <SelectContent className="max-h-[300px]">
                {getCategories().map((cat: string) => (
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

          {fetchError && (
            <p className="text-sm text-amber-600">
              {fetchError}
            </p>
          )}
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
