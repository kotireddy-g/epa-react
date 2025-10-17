import { User, Mail, Briefcase, Building2, Link as LinkIcon, Linkedin, Calendar, Users, TrendingUp, Edit } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';

interface ProfilePageProps {
  userProfile: any;
  onEdit?: () => void;
}

export function ProfilePage({ userProfile, onEdit }: ProfilePageProps) {
  if (!userProfile) {
    return (
      <div className="p-8 max-w-6xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>No Profile Data</CardTitle>
            <CardDescription>Please complete your profile setup to view your information.</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  const getUserTypeLabel = (type: string) => {
    const types: Record<string, string> = {
      startup: 'Start Up Owner',
      leader: 'Leader',
      professional: 'Professional',
      business: 'Business Owner',
    };
    return types[type] || type;
  };

  const getUserTypeBadgeColor = (type: string) => {
    const colors: Record<string, string> = {
      startup: 'bg-blue-100 text-blue-700',
      leader: 'bg-purple-100 text-purple-700',
      professional: 'bg-green-100 text-green-700',
      business: 'bg-orange-100 text-orange-700',
    };
    return colors[type] || 'bg-gray-100 text-gray-700';
  };

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-gray-900 mb-2">Profile</h1>
          <p className="text-gray-600">View and manage your profile information</p>
        </div>
        {onEdit && (
          <Button variant="outline" onClick={onEdit}>
            <Edit className="w-4 h-4 mr-2" />
            Edit Profile
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Profile Card */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 bg-gradient-to-br from-gray-700 to-gray-900 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                  {userProfile.fullName?.charAt(0)?.toUpperCase() || 'U'}
                </div>
                <div className="flex-1">
                  <CardTitle className="text-2xl">{userProfile.fullName || 'User'}</CardTitle>
                  <CardDescription className="text-base mt-1">
                    {userProfile.currentRole || 'Role not specified'}
                  </CardDescription>
                  <div className="mt-2">
                    <Badge className={getUserTypeBadgeColor(userProfile.userType)}>
                      {getUserTypeLabel(userProfile.userType)}
                    </Badge>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Contact Information */}
              <div>
                <h3 className="text-sm font-semibold text-gray-500 uppercase mb-3">Contact Information</h3>
                <div className="space-y-3">
                  {userProfile.email && (
                    <div className="flex items-center gap-3">
                      <Mail className="w-5 h-5 text-gray-400" />
                      <span className="text-gray-700">{userProfile.email}</span>
                    </div>
                  )}
                  {userProfile.linkedinProfile && (
                    <div className="flex items-center gap-3">
                      <Linkedin className="w-5 h-5 text-gray-400" />
                      <a 
                        href={userProfile.linkedinProfile} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        LinkedIn Profile
                      </a>
                    </div>
                  )}
                  {userProfile.companyLink && (
                    <div className="flex items-center gap-3">
                      <LinkIcon className="w-5 h-5 text-gray-400" />
                      <a 
                        href={userProfile.companyLink} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        Company Website
                      </a>
                    </div>
                  )}
                </div>
              </div>

              {/* Professional Details */}
              <div>
                <h3 className="text-sm font-semibold text-gray-500 uppercase mb-3">Professional Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {userProfile.currentIndustry && (
                    <div className="flex items-start gap-3">
                      <Building2 className="w-5 h-5 text-gray-400 mt-0.5" />
                      <div>
                        <div className="text-sm text-gray-500">Industry</div>
                        <div className="text-gray-900 font-medium">{userProfile.currentIndustry}</div>
                      </div>
                    </div>
                  )}
                  {userProfile.businessType && (
                    <div className="flex items-start gap-3">
                      <Briefcase className="w-5 h-5 text-gray-400 mt-0.5" />
                      <div>
                        <div className="text-sm text-gray-500">Business Type</div>
                        <div className="text-gray-900 font-medium">{userProfile.businessType}</div>
                      </div>
                    </div>
                  )}
                  {userProfile.yearsOfExperience && (
                    <div className="flex items-start gap-3">
                      <Calendar className="w-5 h-5 text-gray-400 mt-0.5" />
                      <div>
                        <div className="text-sm text-gray-500">Experience</div>
                        <div className="text-gray-900 font-medium">{userProfile.yearsOfExperience} years</div>
                      </div>
                    </div>
                  )}
                  {userProfile.companySize && (
                    <div className="flex items-start gap-3">
                      <Users className="w-5 h-5 text-gray-400 mt-0.5" />
                      <div>
                        <div className="text-sm text-gray-500">Company Size</div>
                        <div className="text-gray-900 font-medium">{userProfile.companySize} employees</div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Funding Information (if applicable) */}
              {userProfile.fundingStage && (
                <div>
                  <h3 className="text-sm font-semibold text-gray-500 uppercase mb-3">Funding</h3>
                  <div className="flex items-center gap-3">
                    <TrendingUp className="w-5 h-5 text-gray-400" />
                    <div>
                      <div className="text-sm text-gray-500">Funding Stage</div>
                      <div className="text-gray-900 font-medium">{userProfile.fundingStage}</div>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Stats Card */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Account Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Profile Completion</span>
                  <Badge className="bg-green-100 text-green-700">Complete</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Account Type</span>
                  <Badge className="bg-blue-100 text-blue-700">Active</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" className="w-full justify-start">
                <User className="w-4 h-4 mr-2" />
                Update Profile
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Mail className="w-4 h-4 mr-2" />
                Change Email
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
