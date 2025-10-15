import { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { SuggestionsPanel } from './components/SuggestionsPanel';
import { IntroVideoPage } from './components/IntroVideoPage';
import { LoginPage } from './components/LoginPage';
import { ProfileSetupPage } from './components/ProfileSetupPage';
import { IdeaPage } from './components/IdeaPage';
import { ValidationPage } from './components/ValidationPage';
import { BusinessPlanPage } from './components/BusinessPlanPage';
import { PlannerPage } from './components/PlannerPage';
import { ImplementationPage } from './components/ImplementationPage';
import { OutcomesPage } from './components/OutcomesPage';
import { NotificationsPage } from './components/NotificationsPage';
import { CompanyNameDialog } from './components/CompanyNameDialog';

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
  const [showIntro, setShowIntro] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isProfileComplete, setIsProfileComplete] = useState(false);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [currentPage, setCurrentPage] = useState<'idea' | 'validation' | 'business-plan' | 'planner' | 'implementation' | 'outcomes' | 'notifications'>('idea');
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [currentIdea, setCurrentIdea] = useState<Idea | null>(null);
  const [selectedPlannerItem, setSelectedPlannerItem] = useState<string | null>(null);
  const [showCompanyNameDialog, setShowCompanyNameDialog] = useState(false);
  const [companyName, setCompanyName] = useState<string>('');

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
  };

  const handleHomeClick = () => {
    setShowIntro(true);
    setIsAuthenticated(false);
    setIsProfileComplete(false);
    setCurrentIdea(null);
    setIdeas([]);
  };

  const handleLogin = (username: string) => {
    setIsAuthenticated(true);
  };

  const handleProfileComplete = (profileData: any) => {
    setUserProfile(profileData);
    setIsProfileComplete(true);
  };

  // Show intro video
  if (showIntro) {
    return <IntroVideoPage onComplete={() => setShowIntro(false)} />;
  }

  // Show login page if not authenticated
  if (!isAuthenticated) {
    return <LoginPage onLogin={handleLogin} />;
  }

  // Show profile setup if authenticated but profile not complete
  if (!isProfileComplete) {
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
      <Sidebar currentPage={currentPage} onNavigate={navigateToPage} onHome={handleHomeClick} />
      
      <main className="flex-1 overflow-auto">
        {currentPage === 'idea' && (
          <IdeaPage 
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
            onTaskClick={(taskId) => {
              setSelectedPlannerItem('tasks');
              setCurrentPage('implementation');
            }}
          />
        )}
        {currentPage === 'notifications' && (
          <NotificationsPage />
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
