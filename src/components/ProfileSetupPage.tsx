import { useState, useEffect } from 'react';
import { User, Briefcase, Building2, Users, Check } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { cn } from './ui/utils';

interface ProfileSetupPageProps {
  onComplete: (profileData: any) => void;
}

type UserType = 'startup' | 'leader' | 'professional' | 'business';

export function ProfileSetupPage({ onComplete }: ProfileSetupPageProps) {
  const [step, setStep] = useState<'select' | 'form'>('select');
  const [selectedType, setSelectedType] = useState<UserType | null>(null);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    address: '',
    companyLink: '',
    currentRole: '',
    currentIndustry: '',
    businessType: '',
    linkedinProfile: '',
    yearsOfExperience: '',
    companySize: '',
    fundingStage: '',
  });

  // Load saved profile data from localStorage
  useEffect(() => {
    const sessionData = localStorage.getItem('executionPlannerSession');
    if (sessionData) {
      try {
        const session = JSON.parse(sessionData);
        const profileData = session.userProfile;
        if (profileData) {
          setFormData({
            fullName: profileData.fullName || '',
            email: profileData.email || '',
            address: profileData.address || '',
            companyLink: profileData.companyLink || '',
            currentRole: profileData.currentRole || '',
            currentIndustry: profileData.currentIndustry || '',
            businessType: profileData.businessType || '',
            linkedinProfile: profileData.linkedinProfile || '',
            yearsOfExperience: profileData.yearsOfExperience || '',
            companySize: profileData.companySize || '',
            fundingStage: profileData.fundingStage || '',
          });
          if (profileData.userType) {
            setSelectedType(profileData.userType);
          }
        }
      } catch (error) {
        console.error('Error loading profile data:', error);
      }
    }
  }, []);

  const userTypes = [
    {
      id: 'startup' as UserType,
      label: 'Start Up Owner',
      description: 'Building and scaling your startup',
      icon: Briefcase,
      enabled: true,
    },
    {
      id: 'leader' as UserType,
      label: 'Leader',
      description: 'Leading teams and organizations',
      icon: Users,
      enabled: false,
    },
    {
      id: 'professional' as UserType,
      label: 'Professional',
      description: 'Growing your professional career',
      icon: User,
      enabled: false,
    },
    {
      id: 'business' as UserType,
      label: 'Business Owner',
      description: 'Managing established business',
      icon: Building2,
      enabled: false,
    },
  ];

  const handleTypeSelect = (type: UserType, enabled: boolean) => {
    if (!enabled) return;
    setSelectedType(type);
    setStep('form');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Require all fields except optional companyLink and linkedinProfile
    const required = ['fullName','email','currentRole','currentIndustry','businessType','yearsOfExperience','companySize','fundingStage','address'];
    for (const k of required) {
      if (!(formData as any)[k] || String((formData as any)[k]).trim() === '') {
        alert('Please complete all required fields before continuing.');
        return;
      }
    }
    onComplete({
      userType: selectedType,
      ...formData,
    });
  };

  // removed demo skip per requirements

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  if (step === 'select') {
    return (
      <div className="flex-1 bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-8 overflow-auto">
        <div className="w-full max-w-7xl">
          <div className="text-center mb-12">
            <div className="inline-block relative mb-4">
              <h1 className="text-gray-900 relative z-10">Define Yourself</h1>
              <div className="absolute -inset-4 bg-yellow-200 opacity-30 rounded-lg -z-0"></div>
            </div>
            <p className="text-gray-600 text-lg">Choose the option that best describes you</p>
          </div>

          <div className="grid grid-cols-4 gap-4 mx-auto">
            {userTypes.map((type) => {
              const Icon = type.icon;
              return (
                <Card
                  key={type.id}
                  className={cn(
                    "cursor-pointer transition-all",
                    type.enabled
                      ? "hover:shadow-lg hover:border-blue-500 hover:scale-105"
                      : "opacity-50 cursor-not-allowed",
                  )}
                  onClick={() => handleTypeSelect(type.id, type.enabled)}
                >
                  <CardHeader className="text-center">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Icon className="w-8 h-8 text-blue-600" />
                    </div>
                    {!type.enabled && (
                      <span className="absolute top-4 right-4 text-xs bg-gray-200 text-gray-600 px-3 py-1 rounded-full">
                        Coming Soon
                      </span>
                    )}
                    <CardTitle className="mb-2">{type.label}</CardTitle>
                    <CardDescription>{type.description}</CardDescription>
                  </CardHeader>
                </Card>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-8 overflow-auto">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle>Complete Your Profile</CardTitle>
          <CardDescription>
            Tell us more about yourself to get personalized recommendations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Full Name */}
              <div className="space-y-2">
                <Label htmlFor="fullName">
                  Full Name
                </Label>
                <Input
                  id="fullName"
                  placeholder="John Doe"
                  value={formData.fullName}
                  onChange={(e) => handleInputChange('fullName', e.target.value)}
                />
              </div>

              {/* Official Email */}
              <div className="space-y-2">
                <Label htmlFor="email">
                  Official Email ID
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="john@company.com"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                />
              </div>

              {/* Current Role */}
              <div className="space-y-2">
                <Label htmlFor="currentRole">
                  Current Role
                </Label>
                <Input
                  id="currentRole"
                  placeholder="Founder & CEO"
                  value={formData.currentRole}
                  onChange={(e) => handleInputChange('currentRole', e.target.value)}
                />
              </div>

              {/* Current Industry */}
              <div className="space-y-2">
                <Label htmlFor="currentIndustry">
                  Current Industry
                </Label>
                <Input
                  id="currentIndustry"
                  placeholder="Technology, Healthcare, etc."
                  value={formData.currentIndustry}
                  onChange={(e) => handleInputChange('currentIndustry', e.target.value)}
                />
              </div>

              {/* Address */}
              <div className="space-y-2">
                <Label htmlFor="address">
                  Address / Location
                </Label>
                <Input
                  id="address"
                  placeholder="City, Country or full address"
                  value={formData.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                />
              </div>

              {/* Business Type */}
              <div className="space-y-2">
                <Label htmlFor="businessType">
                  Business Type
                </Label>
                <Input
                  id="businessType"
                  placeholder="SaaS, E-commerce, Consulting, etc."
                  value={formData.businessType}
                  onChange={(e) => handleInputChange('businessType', e.target.value)}
                />
              </div>

              {/* Years of Experience */}
              <div className="space-y-2">
                <Label htmlFor="yearsOfExperience">
                  Years of Experience
                </Label>
                <Input
                  id="yearsOfExperience"
                  type="number"
                  placeholder="5"
                  value={formData.yearsOfExperience}
                  onChange={(e) => handleInputChange('yearsOfExperience', e.target.value)}
                />
              </div>

              {/* Company Size */}
              <div className="space-y-2">
                <Label htmlFor="companySize">
                  Company Size
                </Label>
                <Input
                  id="companySize"
                  placeholder="1-10, 11-50, 51-200, etc."
                  value={formData.companySize}
                  onChange={(e) => handleInputChange('companySize', e.target.value)}
                />
              </div>

              {/* Funding Stage */}
              <div className="space-y-2">
                <Label htmlFor="fundingStage">
                  Funding Stage
                </Label>
                <Input
                  id="fundingStage"
                  placeholder="Bootstrapped, Seed, Series A, etc."
                  value={formData.fundingStage}
                  onChange={(e) => handleInputChange('fundingStage', e.target.value)}
                />
              </div>
            </div>

            {/* Full Width Fields */}
            <div className="space-y-4">
              {/* Company Link */}
              <div className="space-y-2">
                <Label htmlFor="companyLink">
                  Company Website <span className="text-gray-500">(Optional)</span>
                </Label>
                <Input
                  id="companyLink"
                  type="url"
                  placeholder="https://yourcompany.com"
                  value={formData.companyLink}
                  onChange={(e) => handleInputChange('companyLink', e.target.value)}
                />
              </div>

              {/* LinkedIn Profile */}
              <div className="space-y-2">
                <Label htmlFor="linkedinProfile">
                  LinkedIn Profile
                </Label>
                <Input
                  id="linkedinProfile"
                  type="url"
                  placeholder="https://linkedin.com/in/yourprofile"
                  value={formData.linkedinProfile}
                  onChange={(e) => handleInputChange('linkedinProfile', e.target.value)}
                />
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setStep('select')}
              >
                Back
              </Button>
              <Button type="submit" className="flex-1 gap-2">
                <Check className="w-4 h-4" />
                Complete Profile & Continue
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
