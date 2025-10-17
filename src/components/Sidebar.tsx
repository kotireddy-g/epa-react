import { Lightbulb, CheckCircle, FileText, Calendar, Kanban, Target, Bell, Home, LogOut, User } from 'lucide-react';
import { cn } from './ui/utils';

interface SidebarProps {
  currentPage: string;
  onNavigate: (page: 'idea' | 'validation' | 'business-plan' | 'planner' | 'implementation' | 'outcomes' | 'notifications' | 'profile') => void;
  onHome?: () => void;
  onLogout?: () => void;
}

export function Sidebar({ currentPage, onNavigate, onHome, onLogout }: SidebarProps) {
  const menuItems = [
    { id: 'idea', label: 'IDEA', icon: Lightbulb },
    { id: 'validation', label: 'Validation', icon: CheckCircle },
    { id: 'business-plan', label: 'Business Plan', icon: FileText },
    { id: 'planner', label: 'Planner', icon: Calendar },
    { id: 'implementation', label: 'Implementation', icon: Kanban },
    { id: 'outcomes', label: 'Outcomes', icon: Target },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  return (
    <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
      <div className="p-6 border-b border-gray-200">
        <h1 className="text-red-600 text-xl font-bold">Execution Planner</h1>
        <p className="text-sm text-gray-500 mt-1">The Best Way How</p>
      </div>

      {/* Home Button */}
      {onHome && (
        <div className="p-4 border-b border-gray-200">
          <button
            onClick={onHome}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors bg-gradient-to-r from-red-600 to-red-700 text-white hover:from-red-700 hover:to-red-800"
          >
            <Home className="w-5 h-5" />
            <span>Home</span>
          </button>
        </div>
      )}
      
      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPage === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id as any)}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors",
                isActive 
                  ? "bg-red-50 text-red-600" 
                  : "text-gray-700 hover:bg-gray-50"
              )}
            >
              <Icon className="w-5 h-5" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Logout Button */}
      {onLogout && (
        <div className="p-4 border-t border-gray-200">
          <button
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-gray-700 hover:bg-red-50 hover:text-red-600"
          >
            <LogOut className="w-5 h-5" />
            <span>Logout</span>
          </button>
        </div>
      )}
    </aside>
  );
}
