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

// Industry-Category mapping with subcategories
const INDUSTRY_DATA = [
  {
    "Industry": "Food & Beverages",
    "Domain": "Food Business",
    "Subcategories": [
      "Juice shops",
      "Panipuri stalls",
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
    "Industry": "Agriculture",
    "Domain": "Farming & Distribution",
    "Subcategories": [
      "Crop Farming",
      "Dairy",
      "Poultry",
      "Fisheries",
      "Seed Suppliers",
      "Fertilizer Dealers",
      "Farm Equipment"
    ]
  },
  {
    "Industry": "Manufacturing",
    "Domain": "Processed Goods",
    "Subcategories": [
      "Furniture",
      "Apparel",
      "Shoes",
      "Chemicals",
      "Paper",
      "Metals",
      "Plastics",
      "Electronics",
      "Machinery",
      "Home Appliances"
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
      "Rehabilitation"
    ]
  },
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
      "Taxi Services",
      "Logistics",
      "Courier",
      "Trucking",
      "Freight",
      "Public Transport",
      "Bike Rentals",
      "Shipping",
      "Warehousing"
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
    "Domain": "Media",
    "Subcategories": [
      "TV Channels",
      "Radio Stations",
      "Digital Content Creators",
      "Social Media Firms",
      "Newspapers",
      "PR Agencies",
      "Advertising",
      "Music Production"
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
    "Industry": "Consumer Goods",
    "Domain": "FMCG",
    "Subcategories": [
      "Packaged Foods",
      "Detergents",
      "Personal Care",
      "Cosmetics",
      "Stationery",
      "Beverages",
      "Snacks",
      "Tobacco"
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
      "Streaming Services"
    ]
  }
];

const INDUSTRIES = [...INDUSTRY_DATA.map(item => item.Industry), 'Others'];

export function IndustryCategoryDialog({ isOpen, onClose, onSubmit }: IndustryCategoryDialogProps) {
  const [industry, setIndustry] = useState('');
  const [category, setCategory] = useState('');
  const [customIndustry, setCustomIndustry] = useState('');
  const [customCategory, setCustomCategory] = useState('');
  const [showCustomIndustry, setShowCustomIndustry] = useState(false);
  const [showCustomCategory, setShowCustomCategory] = useState(false);

  // Get categories based on selected industry
  const getCategories = () => {
    if (!industry || industry === 'Others') {
      return ['Others'];
    }
    const selectedIndustry = INDUSTRY_DATA.find(item => item.Industry === industry);
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
            <Select 
              value={category} 
              onValueChange={handleCategoryChange}
              disabled={!industry}
            >
              <SelectTrigger id="category">
                <SelectValue placeholder={industry ? "Select category" : "Select industry first"} />
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
