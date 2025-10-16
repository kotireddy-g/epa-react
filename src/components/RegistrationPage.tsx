import { useState } from 'react';
import { UserPlus, ArrowRight, ArrowLeft, Linkedin } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { authApi, RegisterData } from '../services/authApi';

interface RegistrationPageProps {
  onSuccess: (email: string) => void;
  onBackToLogin: () => void;
}

export function RegistrationPage({ onSuccess, onBackToLogin }: RegistrationPageProps) {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirm_password: '',
    first_name: '',
    last_name: '',
    phone_number: '',
    linkedin_profile: '',
    fullname: '',
    date_of_birth: '',
    gender: 'male',
    professional_title: '',
    company: '',
    industry: '',
    years_of_experience: '',
    businessType: '',
    companySize: '',
    fundingStage: '',
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setError('');
  };

  const validateStep1 = () => {
    if (!formData.email || !formData.password || !formData.confirm_password) {
      setError('Please fill in all required fields');
      return false;
    }
    if (formData.password !== formData.confirm_password) {
      setError('Passwords do not match');
      return false;
    }
    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters long');
      return false;
    }
    return true;
  };

  const validateStep2 = () => {
    if (!formData.first_name || !formData.last_name || !formData.phone_number || !formData.linkedin_profile) {
      setError('Please fill in all required fields');
      return false;
    }
    return true;
  };

  const validateStep3 = () => {
    if (!formData.fullname || !formData.date_of_birth || !formData.professional_title || 
        !formData.company || !formData.industry || !formData.years_of_experience) {
      setError('Please fill in all required fields');
      return false;
    }
    return true;
  };

  const validateStep4 = () => {
    if (!formData.businessType || !formData.companySize || !formData.fundingStage) {
      setError('Please fill in all required fields');
      return false;
    }
    return true;
  };

  const handleNext = () => {
    let isValid = false;
    
    switch (step) {
      case 1:
        isValid = validateStep1();
        break;
      case 2:
        isValid = validateStep2();
        break;
      case 3:
        isValid = validateStep3();
        break;
      case 4:
        isValid = validateStep4();
        break;
    }

    if (isValid) {
      if (step < 4) {
        setStep(step + 1);
      } else {
        handleSubmit();
      }
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError('');

    try {
      const registerData: RegisterData = {
        email: formData.email,
        password: formData.password,
        confirm_password: formData.confirm_password,
        first_name: formData.first_name,
        last_name: formData.last_name,
        phone_number: formData.phone_number,
        linkedin_profile: formData.linkedin_profile,
        profile: {
          fullname: formData.fullname,
          date_of_birth: formData.date_of_birth,
          gender: formData.gender,
          professional_title: formData.professional_title,
          company: formData.company,
          industry: formData.industry,
          years_of_experience: parseInt(formData.years_of_experience),
          businessType: formData.businessType,
          companySize: formData.companySize,
          fundingStage: formData.fundingStage,
        },
      };

      const response = await authApi.register(registerData);
      
      if (response.status === 'Error') {
        setError(response.message || 'Registration failed');
      } else {
        onSuccess(formData.email);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center">
          <div className="mx-auto w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mb-4">
            <UserPlus className="w-6 h-6 text-white" />
          </div>
          <CardTitle>Create Your Account</CardTitle>
          <CardDescription>
            Step {step} of 4: {
              step === 1 ? 'Account Credentials' :
              step === 2 ? 'Personal Information' :
              step === 3 ? 'Professional Details' :
              'Business Information'
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {step === 1 && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address *</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="your.email@example.com"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password *</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="At least 8 characters"
                    value={formData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirm_password">Confirm Password *</Label>
                  <Input
                    id="confirm_password"
                    type="password"
                    placeholder="Re-enter your password"
                    value={formData.confirm_password}
                    onChange={(e) => handleInputChange('confirm_password', e.target.value)}
                    required
                  />
                </div>
              </>
            )}

            {step === 2 && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="first_name">First Name *</Label>
                    <Input
                      id="first_name"
                      placeholder="John"
                      value={formData.first_name}
                      onChange={(e) => handleInputChange('first_name', e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="last_name">Last Name *</Label>
                    <Input
                      id="last_name"
                      placeholder="Doe"
                      value={formData.last_name}
                      onChange={(e) => handleInputChange('last_name', e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone_number">Phone Number *</Label>
                  <Input
                    id="phone_number"
                    type="tel"
                    placeholder="+1234567890"
                    value={formData.phone_number}
                    onChange={(e) => handleInputChange('phone_number', e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="linkedin_profile">LinkedIn Profile *</Label>
                  <div className="relative">
                    <Linkedin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="linkedin_profile"
                      type="url"
                      className="pl-10"
                      placeholder="https://www.linkedin.com/in/yourprofile"
                      value={formData.linkedin_profile}
                      onChange={(e) => handleInputChange('linkedin_profile', e.target.value)}
                      required
                    />
                  </div>
                </div>
              </>
            )}

            {step === 3 && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="fullname">Full Name *</Label>
                  <Input
                    id="fullname"
                    placeholder="John Doe"
                    value={formData.fullname}
                    onChange={(e) => handleInputChange('fullname', e.target.value)}
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="date_of_birth">Date of Birth *</Label>
                    <Input
                      id="date_of_birth"
                      type="date"
                      value={formData.date_of_birth}
                      onChange={(e) => handleInputChange('date_of_birth', e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="gender">Gender *</Label>
                    <select
                      id="gender"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      value={formData.gender}
                      onChange={(e) => handleInputChange('gender', e.target.value)}
                    >
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="professional_title">Current Role *</Label>
                  <Input
                    id="professional_title"
                    placeholder="Software Engineer, CEO, etc."
                    value={formData.professional_title}
                    onChange={(e) => handleInputChange('professional_title', e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="company">Company Website *</Label>
                  <Input
                    id="company"
                    type="url"
                    placeholder="https://yourcompany.com"
                    value={formData.company}
                    onChange={(e) => handleInputChange('company', e.target.value)}
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="industry">Industry *</Label>
                    <Input
                      id="industry"
                      placeholder="Technology, Healthcare, etc."
                      value={formData.industry}
                      onChange={(e) => handleInputChange('industry', e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="years_of_experience">Years of Experience *</Label>
                    <Input
                      id="years_of_experience"
                      type="number"
                      placeholder="5"
                      value={formData.years_of_experience}
                      onChange={(e) => handleInputChange('years_of_experience', e.target.value)}
                      required
                    />
                  </div>
                </div>
              </>
            )}

            {step === 4 && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="businessType">Business Type *</Label>
                  <Input
                    id="businessType"
                    placeholder="SaaS, E-commerce, Consulting, etc."
                    value={formData.businessType}
                    onChange={(e) => handleInputChange('businessType', e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="companySize">Company Size *</Label>
                  <select
                    id="companySize"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    value={formData.companySize}
                    onChange={(e) => handleInputChange('companySize', e.target.value)}
                  >
                    <option value="">Select company size</option>
                    <option value="1-10">1-10 employees</option>
                    <option value="11-50">11-50 employees</option>
                    <option value="51-200">51-200 employees</option>
                    <option value="201-500">201-500 employees</option>
                    <option value="500+">500+ employees</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="fundingStage">Funding Stage *</Label>
                  <select
                    id="fundingStage"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    value={formData.fundingStage}
                    onChange={(e) => handleInputChange('fundingStage', e.target.value)}
                  >
                    <option value="">Select funding stage</option>
                    <option value="Bootstrapped">Bootstrapped</option>
                    <option value="Pre-Seed">Pre-Seed</option>
                    <option value="Seed">Seed</option>
                    <option value="Series A">Series A</option>
                    <option value="Series B">Series B</option>
                    <option value="Series C+">Series C+</option>
                  </select>
                </div>
              </>
            )}

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            <div className="flex gap-3 pt-4">
              {step > 1 && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setStep(step - 1)}
                  disabled={loading}
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back
                </Button>
              )}

              <Button
                type="button"
                className="flex-1"
                onClick={handleNext}
                disabled={loading}
              >
                {loading ? 'Processing...' : step === 4 ? 'Create Account' : 'Next'}
                {!loading && step < 4 && <ArrowRight className="w-4 h-4 ml-2" />}
              </Button>
            </div>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-500">
                Already have an account?{' '}
                <button
                  type="button"
                  className="text-blue-600 hover:underline"
                  onClick={onBackToLogin}
                >
                  Sign in
                </button>
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
