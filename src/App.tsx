import { useState, useEffect } from 'react';
import { LandingPage } from './components/LandingPage';
import { Sidebar } from './components/Sidebar';
import { SuggestionsPanel } from './components/SuggestionsPanel';
import { IntroVideoPage } from './components/IntroVideoPage';
import { ProfileSetupPage } from './components/ProfileSetupPage';
import { ProfilePage } from './components/ProfilePage';
import { IdeaPage } from './components/IdeaPage';
import { ValidationPage } from './components/ValidationPage';
import { BusinessPlanPage } from './components/BusinessPlanPage';
import { PlannerPage } from './components/PlannerPage';
import { ImplementationPage } from './components/ImplementationPage';
import { OutcomesPage } from './components/OutcomesPage';
import { NotificationsPage } from './components/NotificationsPage';
import { CompanyNameDialog } from './components/CompanyNameDialog';
import { FloatingHomeButton } from './components/FloatingHomeButton';
import { authApi } from './services/authApi';

export interface Idea {
  id: string;
  summary: string;
  description: string;
  bulletPoints: string[];
  status: 'draft' | 'validated' | 'planning' | 'implementing' | 'active';
  validationScore?: number;
  validationData?: any;
  businessPlan?: any;
  createdAt: Date;
  isActive: boolean;
}

export default function App() {
  const [showLandingPage, setShowLandingPage] = useState(true);
  const [showIntro, setShowIntro] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isProfileComplete, setIsProfileComplete] = useState(false);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [currentPage, setCurrentPage] = useState<'idea' | 'validation' | 'business-plan' | 'planner' | 'implementation' | 'outcomes' | 'notifications' | 'profile'>('idea');
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [currentIdea, setCurrentIdea] = useState<Idea | null>(null);
  const [selectedPlannerItem, setSelectedPlannerItem] = useState<string | null>(null);
  const [showCompanyNameDialog, setShowCompanyNameDialog] = useState(false);
  const [, setCompanyName] = useState<string>('');
  const [ideaPageKey, setIdeaPageKey] = useState(0);

  // Load session from localStorage on mount
  useEffect(() => {
    const sessionData = localStorage.getItem('executionPlannerSession');
    if (sessionData) {
      try {
        const session = JSON.parse(sessionData);
        setShowLandingPage(false);
        setShowIntro(false);
        setIsAuthenticated(session.isAuthenticated || false);
        setIsProfileComplete(session.isProfileComplete || false);
        setUserProfile(session.userProfile || null);
      } catch (error) {
        console.error('Error loading session:', error);
      }
    }
  }, []);

  // Save session to localStorage whenever authentication state changes
  useEffect(() => {
    if (isAuthenticated || isProfileComplete) {
      // Get existing session data to preserve tokens
      const existingSession = localStorage.getItem('executionPlannerSession');
      let sessionData: any = {
        isAuthenticated,
        isProfileComplete,
        userProfile,
      };
      
      // Preserve tokens if they exist
      if (existingSession) {
        try {
          const existing = JSON.parse(existingSession);
          if (existing.tokens) {
            sessionData.tokens = existing.tokens;
          }
          if (existing.user) {
            sessionData.user = existing.user;
          }
        } catch (e) {
          // Ignore parse errors
        }
      }
      
      localStorage.setItem('executionPlannerSession', JSON.stringify(sessionData));
    }
  }, [isAuthenticated, isProfileComplete, userProfile]);

  const handleIdeaSubmit = (idea: Idea) => {
    setIdeas(prev => [...prev, idea]);
    setCurrentIdea(idea);
  };

  const handleIdeaAccept = (idea: Idea) => {
    setCurrentIdea(idea);
    setShowCompanyNameDialog(true);
  };

  const handleCompanyNameConfirm = (name: string) => {
    setCompanyName(name);
    setShowCompanyNameDialog(false);
    
    if (currentIdea) {
      const updatedIdea = {
        ...currentIdea,
        companyName: name,
      };
      setCurrentIdea(updatedIdea);
      setIdeas(prev => prev.map(i => i.id === updatedIdea.id ? updatedIdea : i));
      setCurrentPage('validation');
    }
  };

  const handleValidationComplete = (validationData: any, score: number) => {
    if (currentIdea) {
      const updatedIdea = {
        ...currentIdea,
        validationData,
        validationScore: score,
        status: 'validated' as const,
      };
      setCurrentIdea(updatedIdea);
      setIdeas(prev => prev.map(i => i.id === updatedIdea.id ? updatedIdea : i));
      setCurrentPage('business-plan');
    }
  };

  const handleBusinessPlanComplete = (businessPlan: any) => {
    if (currentIdea) {
      const updatedIdea = {
        ...currentIdea,
        businessPlan,
        status: 'planning' as const,
      };
      setCurrentIdea(updatedIdea);
      setIdeas(prev => prev.map(i => i.id === updatedIdea.id ? updatedIdea : i));
      setCurrentPage('planner');
    }
  };

  const handlePlannerItemClick = (itemType: string) => {
    setSelectedPlannerItem(itemType);
    setCurrentPage('implementation');
  };

  const navigateToPage = (page: typeof currentPage) => {
    setCurrentPage(page);
    // Reset idea page when navigating to it
    if (page === 'idea') {
      setIdeaPageKey(prev => prev + 1);
    }
  };

  const handleHomeClick = () => {
    // Navigate to Idea page and reset it
    setCurrentPage('idea');
    setIdeaPageKey(prev => prev + 1);
  };

  const handleLogout = () => {
    // Clear session and redirect to landing page
    authApi.logout(); // Clear tokens from authApi service
    localStorage.removeItem('executionPlannerSession');
    setShowLandingPage(true);
    setShowIntro(false);
    setIsAuthenticated(false);
    setIsProfileComplete(false);
    setUserProfile(null);
    setCurrentIdea(null);
    setIdeas([]);
  };

  const handleLandingLogin = () => {
    setShowLandingPage(false);
    setShowIntro(true);
  };

  const handleProfileComplete = (profileData: any) => {
    setUserProfile(profileData);
    setIsProfileComplete(true);
  };

  // Show landing page first (only if not logged in)
  if (showLandingPage && !isAuthenticated) {
    return <LandingPage onLogin={handleLandingLogin} />;
  }

  // Show intro video
  if (showIntro) {
    return <IntroVideoPage onComplete={() => {
      setShowIntro(false);
      setIsAuthenticated(true);
    }} />;
  }

  // Show profile setup if authenticated but profile not complete
  if (isAuthenticated && !isProfileComplete) {
    return (
      <div className="flex h-screen bg-gray-50">
        <ProfileSetupPage onComplete={handleProfileComplete} />
        <SuggestionsPanel currentPage="profile" currentIdea={null} isProfileSetup={true} />
      </div>
    );
  }

  // Show main application
  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar 
        currentPage={currentPage} 
        onNavigate={navigateToPage} 
        onHome={handleHomeClick}
        onLogout={handleLogout}
      />
      
      {/* Floating Home Button */}
      <FloatingHomeButton onClick={handleHomeClick} />
      
      <main className="flex-1 overflow-auto">
        {currentPage === 'idea' && (
          <IdeaPage 
            key={ideaPageKey}
            ideas={ideas} 
            onIdeaSubmit={handleIdeaSubmit}
            onIdeaAccept={handleIdeaAccept}
            onIdeaUpdate={(updatedIdea) => {
              setIdeas(prev => prev.map(i => i.id === updatedIdea.id ? updatedIdea : i));
            }}
          />
        )}
        {currentPage === 'validation' && currentIdea && (
          <ValidationPage 
            idea={currentIdea}
            onComplete={handleValidationComplete}
          />
        )}
        {currentPage === 'business-plan' && currentIdea && (
          <BusinessPlanPage 
            idea={currentIdea}
            onComplete={handleBusinessPlanComplete}
          />
        )}
        {currentPage === 'planner' && currentIdea && (
          <PlannerPage 
            idea={currentIdea}
            onItemClick={handlePlannerItemClick}
          />
        )}
        {currentPage === 'implementation' && currentIdea && (
          <ImplementationPage 
            idea={currentIdea}
            itemType={selectedPlannerItem || 'tasks'}
          />
        )}
        {currentPage === 'outcomes' && currentIdea && (
          <OutcomesPage 
            idea={currentIdea}
            onTaskClick={() => {
              setSelectedPlannerItem('tasks');
              setCurrentPage('implementation');
            }}
          />
        )}
        {currentPage === 'notifications' && (
          <NotificationsPage />
        )}
        {currentPage === 'profile' && (
          <ProfilePage userProfile={userProfile} />
        )}
      </main>

      <SuggestionsPanel currentPage={currentPage} currentIdea={currentIdea} />

      {/* Company Name Dialog */}
      {showCompanyNameDialog && currentIdea && (
        <CompanyNameDialog
          isOpen={showCompanyNameDialog}
          idea={currentIdea}
          onConfirm={handleCompanyNameConfirm}
        />
      )}
    </div>
  );
}
