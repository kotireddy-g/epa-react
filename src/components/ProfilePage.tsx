import { useState } from 'react';
import { User, Mail, Briefcase, Building2, Link as LinkIcon, Linkedin, Calendar, Users, TrendingUp, Edit, CheckCircle, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { authApi } from '../services/authApi';

interface ProfilePageProps {
  userProfile: any;
  onEdit?: () => void;
}

export function ProfilePage({ userProfile, onEdit }: ProfilePageProps) {
  const [showVerifyModal, setShowVerifyModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [verifyError, setVerifyError] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResendingOTP, setIsResendingOTP] = useState(false);
  // Check email_verified from user_account object
  const user = authApi.getStoredUser();
  const [emailVerified, setEmailVerified] = useState(user?.user_account?.email_verified || false);
  const [isSaving, setIsSaving] = useState(false);
  const [editError, setEditError] = useState('');
  
  const [editFormData, setEditFormData] = useState({
    fullname: userProfile?.fullName || '',
    date_of_birth: userProfile?.dateOfBirth || '1990-01-01',
    gender: userProfile?.gender || 'male',
    professional_title: userProfile?.currentRole || '',
    company: userProfile?.company || '',
    industry: userProfile?.currentIndustry || '',
    years_of_experience: userProfile?.yearsOfExperience || 0,
    businessType: userProfile?.businessType || '',
    companySize: userProfile?.companySize || '',
    fundingStage: userProfile?.fundingStage || '',
    location: userProfile?.address || '',
  });

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

  const handleVerifyEmail = async () => {
    setVerifyError('');
    if (!otpCode || otpCode.length !== 6) {
      setVerifyError('Please enter a valid 6-digit OTP');
      return;
    }
    try {
      setIsVerifying(true);
      await authApi.verifyEmail({ email: userProfile.email, otp_code: otpCode });
      setEmailVerified(true);
      setShowVerifyModal(false);
      setOtpCode('');
      alert('Email verified successfully!');
    } catch (e: any) {
      setVerifyError(e.message || 'Verification failed. Please try again.');
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResendOTP = async () => {
    setVerifyError('');
    try {
      setIsResendingOTP(true);
      await authApi.resendOTP({ email: userProfile.email });
      alert('OTP has been resent to your email');
    } catch (e: any) {
      setVerifyError(e.message || 'Failed to resend OTP');
    } finally {
      setIsResendingOTP(false);
    }
  };

  const handleSaveProfile = async () => {
    setEditError('');
    try {
      setIsSaving(true);
      const currentUser = authApi.getStoredUser();
      if (!currentUser) {
        setEditError('User not found. Please login again.');
        return;
      }
      
      // Use user.id instead of user.user_account.id
      const response = await authApi.updateProfile(currentUser.id, editFormData);
      
      // Use the profile from the update response directly
      const sessionData = localStorage.getItem('executionPlannerSession');
      if (sessionData && response.profile) {
        const session = JSON.parse(sessionData);
        const profile = response.profile;
        
        // Update user.user_account.profile with new data
        if (session.user && session.user.user_account) {
          session.user.user_account.profile = profile;
        }
        
        // Update userProfile with new data
        session.userProfile = {
          ...session.userProfile,
          fullName: profile.fullname,
          currentRole: profile.professional_title,
          professionalTitle: profile.professional_title,
          company: profile.company,
          currentIndustry: profile.industry,
          industry: profile.industry,
          yearsOfExperience: profile.years_of_experience,
          businessType: profile.businessType,
          companySize: profile.companySize,
          fundingStage: profile.fundingStage,
          address: profile.location || '',
          location: profile.location || '',
          dateOfBirth: profile.date_of_birth,
          gender: profile.gender,
        };
        
        localStorage.setItem('executionPlannerSession', JSON.stringify(session));
      }
      
      setShowEditModal(false);
      alert('Profile updated successfully!');
      window.location.reload();
    } catch (e: any) {
      console.error('[ProfilePage] Error updating profile:', e);
      setEditError(e.message || 'Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  };

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
                    <div className="flex items-center gap-3 justify-between">
                      <div className="flex items-center gap-3">
                        <Mail className="w-5 h-5 text-gray-400" />
                        <span className="text-gray-700">{userProfile.email}</span>
                      </div>
                      {emailVerified ? (
                        <Badge className="bg-green-100 text-green-700 flex items-center gap-1">
                          <CheckCircle className="w-3 h-3" />
                          Verified
                        </Badge>
                      ) : (
                        <div className="flex items-center gap-2">
                          <Badge className="bg-yellow-100 text-yellow-700 flex items-center gap-1">
                            <AlertCircle className="w-3 h-3" />
                            Not Verified
                          </Badge>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => {
                              authApi.resendOTP({ email: userProfile.email });
                              setShowVerifyModal(true);
                            }}
                          >
                            Verify Now
                          </Button>
                        </div>
                      )}
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
              <Button variant="outline" className="w-full justify-start" onClick={() => setShowEditModal(true)}>
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

      {/* Email Verification Modal */}
      <Dialog open={showVerifyModal} onOpenChange={setShowVerifyModal}>
        <DialogContent className="!w-[450px] !max-w-[90vw]">
          <DialogHeader>
            <DialogTitle>Verify Your Email</DialogTitle>
            <DialogDescription>
              We've sent a 6-digit OTP to {userProfile.email}. Please enter it below to verify your account.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 mt-4">
            <div>
              <Label htmlFor="otp-code" className="mb-2 block">Enter OTP Code</Label>
              <Input 
                id="otp-code" 
                type="text" 
                placeholder="Enter 6-digit code" 
                value={otpCode} 
                onChange={e=>setOtpCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                maxLength={6}
                className="text-center text-2xl tracking-widest"
              />
            </div>
            {verifyError && <div className="text-sm text-red-600 bg-red-50 p-2 rounded">{verifyError}</div>}
            <Button 
              className="w-full bg-green-600 hover:bg-green-700 text-white" 
              onClick={handleVerifyEmail}
              disabled={isVerifying || otpCode.length !== 6}
            >
              {isVerifying ? 'Verifying...' : 'Verify Email'}
            </Button>
            <Button 
              variant="outline"
              className="w-full" 
              onClick={handleResendOTP}
              disabled={isResendingOTP}
            >
              {isResendingOTP ? 'Resending...' : 'Resend OTP'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Profile Modal */}
      <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
        <DialogContent className="!w-[600px] !max-w-[90vw] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Update Profile</DialogTitle>
            <DialogDescription>
              Update your profile information
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 mt-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Full Name</Label>
                <Input value={editFormData.fullname} onChange={e=>setEditFormData({...editFormData, fullname: e.target.value})} />
              </div>
              <div>
                <Label>Date of Birth</Label>
                <Input type="date" value={editFormData.date_of_birth} onChange={e=>setEditFormData({...editFormData, date_of_birth: e.target.value})} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Gender</Label>
                <select className="w-full border rounded-md p-2" value={editFormData.gender} onChange={e=>setEditFormData({...editFormData, gender: e.target.value})}>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div>
                <Label>Professional Title</Label>
                <Input value={editFormData.professional_title} onChange={e=>setEditFormData({...editFormData, professional_title: e.target.value})} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Company</Label>
                <Input value={editFormData.company} onChange={e=>setEditFormData({...editFormData, company: e.target.value})} />
              </div>
              <div>
                <Label>Industry</Label>
                <Input value={editFormData.industry} onChange={e=>setEditFormData({...editFormData, industry: e.target.value})} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Years of Experience</Label>
                <Input type="number" value={editFormData.years_of_experience} onChange={e=>setEditFormData({...editFormData, years_of_experience: parseInt(e.target.value) || 0})} />
              </div>
              <div>
                <Label>Business Type</Label>
                <Input value={editFormData.businessType} onChange={e=>setEditFormData({...editFormData, businessType: e.target.value})} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Company Size</Label>
                <select className="w-full border rounded-md p-2" value={editFormData.companySize} onChange={e=>setEditFormData({...editFormData, companySize: e.target.value})}>
                  <option value="1-10">1-10</option>
                  <option value="11-50">11-50</option>
                  <option value="51-200">51-200</option>
                  <option value="201-500">201-500</option>
                  <option value="500+">500+</option>
                </select>
              </div>
              <div>
                <Label>Funding Stage</Label>
                <Input value={editFormData.fundingStage} onChange={e=>setEditFormData({...editFormData, fundingStage: e.target.value})} />
              </div>
            </div>
            <div>
              <Label>Location</Label>
              <Input value={editFormData.location} onChange={e=>setEditFormData({...editFormData, location: e.target.value})} />
            </div>
            {editError && <div className="text-sm text-red-600 bg-red-50 p-2 rounded">{editError}</div>}
            <div className="flex gap-2">
              <Button 
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white" 
                onClick={handleSaveProfile}
                disabled={isSaving}
              >
                {isSaving ? 'Saving...' : 'Save Changes'}
              </Button>
              <Button 
                variant="outline"
                className="flex-1" 
                onClick={() => setShowEditModal(false)}
              >
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
