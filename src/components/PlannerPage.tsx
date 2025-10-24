import { useState } from 'react';
import { ListTodo, Users, Wrench, DollarSign, Calendar, Target, Briefcase, TrendingUp, ChevronDown, ChevronUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { FeedbackButton } from './FeedbackButton';
import { NotesButton } from './NotesButton';
import { Separator } from './ui/separator';
import { Idea } from '../App';
import { PlanResponse } from '../services/ideaAnalysisApi';

interface PlannerPageProps {
  idea: Idea;
  onItemClick: (itemType: string) => void;
  planData?: PlanResponse | null;
}

interface PlannerTaskItem {
  id: string;
  name: string;
  description: string;
  assignedTo: string;
  status: 'pending' | 'in-progress' | 'completed';
  priority: 'low' | 'medium' | 'high';
}

interface PlannerCard {
  id: string;
  title: string;
  description: string;
  icon: any;
  color: string;
  items: number;
  implemented: number;
  succeed: number;
  pending: number;
}

export function PlannerPage({ idea, onItemClick, planData }: PlannerPageProps) {
  console.log('[PlannerPage] Received planData:', planData);
  
  // Extract planner data from nested structure
  const plannerData = planData?.final_output?.planner || planData?.planner;
  console.log('[PlannerPage] Extracted planner data:', plannerData);
  const [expandedCard, setExpandedCard] = useState<string | null>(null);

  // Map icon names to components
  const iconMap: Record<string, any> = {
    tasks: ListTodo,
    resources: Users,
    hardware: Wrench,
    budget: DollarSign,
    timeline: Calendar,
    goals: Target,
    partnerships: Briefcase,
    growth: TrendingUp,
  };

  // Map colors
  const colorMap = ['blue', 'green', 'orange', 'purple', 'red', 'indigo', 'teal', 'pink'];

  // Get tasks from API or use mock data
  const getTasksForCard = (cardId: string): PlannerTaskItem[] => {
    // Try to get tasks from API first
    const apiSection = plannerData?.summary?.find((s: any) => 
      (s.section_id || s.id) === cardId
    );
    
    if (apiSection?.items && apiSection.items.length > 0) {
      return apiSection.items.map((item: any) => ({
        id: item.id || '',
        name: item.title || item.name || '',
        description: item.description || '',
        assignedTo: item.assigned_to || item.assignedTo || 'Unassigned',
        status: (item.status || 'pending') as 'pending' | 'in-progress' | 'completed',
        priority: (item.priority || 'medium') as 'low' | 'medium' | 'high',
      }));
    }
    
    // Fallback to mock data
    const taskData: Record<string, PlannerTaskItem[]> = {
      tasks: [
        { id: 't1', name: 'Market Research', description: 'Conduct comprehensive market analysis', assignedTo: 'Sarah J.', status: 'completed', priority: 'high' },
        { id: 't2', name: 'Product Design', description: 'Create wireframes and mockups', assignedTo: 'Mike C.', status: 'in-progress', priority: 'high' },
        { id: 't3', name: 'MVP Development', description: 'Build minimum viable product', assignedTo: 'Dev Team', status: 'in-progress', priority: 'high' },
        { id: 't4', name: 'User Testing', description: 'Conduct beta testing', assignedTo: 'QA Team', status: 'pending', priority: 'medium' },
      ],
      resources: [
        { id: 'r1', name: 'Senior Developer', description: 'Full-stack developer with 5+ years exp', assignedTo: 'HR Dept', status: 'completed', priority: 'high' },
        { id: 'r2', name: 'UX Designer', description: 'Product designer specializing in SaaS', assignedTo: 'HR Dept', status: 'in-progress', priority: 'high' },
        { id: 'r3', name: 'Marketing Manager', description: 'Growth marketing specialist', assignedTo: 'HR Dept', status: 'pending', priority: 'medium' },
      ],
      hardware: [
        { id: 'h1', name: 'Development Servers', description: 'AWS EC2 instances', assignedTo: 'IT Team', status: 'completed', priority: 'high' },
        { id: 'h2', name: 'Office Equipment', description: 'Laptops and monitors', assignedTo: 'Admin', status: 'in-progress', priority: 'medium' },
        { id: 'h3', name: 'Testing Devices', description: 'Mobile devices for testing', assignedTo: 'QA Team', status: 'pending', priority: 'low' },
      ],
      budget: [
        { id: 'b1', name: 'Development Budget', description: '$50,000 allocated', assignedTo: 'Finance', status: 'completed', priority: 'high' },
        { id: 'b2', name: 'Marketing Budget', description: '$30,000 allocated', assignedTo: 'Finance', status: 'in-progress', priority: 'high' },
        { id: 'b3', name: 'Operations Budget', description: '$20,000 allocated', assignedTo: 'Finance', status: 'pending', priority: 'medium' },
      ],
      timeline: [
        { id: 'tl1', name: 'Q1 Launch Prep', description: 'Prepare for initial launch', assignedTo: 'Product Team', status: 'in-progress', priority: 'high' },
        { id: 'tl2', name: 'Q2 Growth Phase', description: 'Scale user acquisition', assignedTo: 'Growth Team', status: 'pending', priority: 'high' },
        { id: 'tl3', name: 'Q3 Expansion', description: 'Enter new markets', assignedTo: 'Strategy Team', status: 'pending', priority: 'medium' },
      ],
      goals: [
        { id: 'g1', name: '1000 Users', description: 'Reach 1000 active users', assignedTo: 'Growth Team', status: 'in-progress', priority: 'high' },
        { id: 'g2', name: '$10K MRR', description: 'Monthly recurring revenue target', assignedTo: 'Sales Team', status: 'in-progress', priority: 'high' },
        { id: 'g3', name: 'Product-Market Fit', description: 'Achieve strong PMF metrics', assignedTo: 'Product Team', status: 'pending', priority: 'high' },
      ],
      partnerships: [
        { id: 'p1', name: 'Tech Partner', description: 'Strategic technology partnership', assignedTo: 'BD Team', status: 'in-progress', priority: 'high' },
        { id: 'p2', name: 'Distribution Partner', description: 'Channel partnership', assignedTo: 'BD Team', status: 'pending', priority: 'medium' },
      ],
    };
    return taskData[cardId] || [];
  };

  const plannerCards: PlannerCard[] = [
    {
      id: 'tasks',
      title: 'Tasks',
      description: 'Actionable items and milestones to move your idea forward. Track progress, assign owners, and set deadlines.',
      icon: ListTodo,
      color: 'blue',
      items: 12,
      implemented: 65,
      succeed: 45,
      pending: 35,
    },
    {
      id: 'resources',
      title: 'Resources',
      description: 'Human resources, skills, and team members needed. Plan hiring, identify skill gaps, and allocate team responsibilities.',
      icon: Users,
      color: 'green',
      items: 5,
      implemented: 80,
      succeed: 60,
      pending: 20,
    },
    {
      id: 'hardware',
      title: 'Hardware',
      description: 'Physical equipment, infrastructure, and technology requirements. From computers to manufacturing equipment.',
      icon: Wrench,
      color: 'orange',
      items: 8,
      implemented: 50,
      succeed: 30,
      pending: 50,
    },
    {
      id: 'budget',
      title: 'Budget',
      description: 'Financial planning including costs, expenses, and revenue projections. Track spending and manage cash flow.',
      icon: DollarSign,
      color: 'purple',
      items: 6,
      implemented: 70,
      succeed: 55,
      pending: 30,
    },
    {
      id: 'timeline',
      title: 'Timeline',
      description: 'Project timeline with key milestones and deadlines. Visualize your path from idea to launch.',
      icon: Calendar,
      color: 'red',
      items: 10,
      implemented: 60,
      succeed: 40,
      pending: 40,
    },
    {
      id: 'goals',
      title: 'Goals & KPIs',
      description: 'Measurable objectives and key performance indicators. Define success metrics and track progress.',
      icon: Target,
      color: 'indigo',
      items: 7,
      implemented: 55,
      succeed: 35,
      pending: 45,
    },
    {
      id: 'partnerships',
      title: 'Partnerships',
      description: 'Strategic partnerships, vendors, and collaborators. Build your ecosystem of supporters and partners.',
      icon: Briefcase,
      color: 'teal',
      items: 4,
      implemented: 75,
      succeed: 50,
      pending: 25,
    },
    {
      id: 'marketing',
      title: 'Marketing & Sales',
      description: 'Go-to-market strategy, customer acquisition, and sales channels. Plan your marketing campaigns and sales process.',
      icon: TrendingUp,
      color: 'pink',
      items: 9,
      implemented: 75,
      succeed: 50,
      pending: 25,
    },
  ];

  // DYNAMIC: Generate planner cards from API data or use defaults
  const apiPlannerCards: PlannerCard[] = plannerData?.summary?.map((section: any, index: number) => {
    const sectionId = section.section_id || section.id || `section_${index}`;
    const iconKey = section.title?.toLowerCase() || 'tasks';
    
    return {
      id: sectionId,
      title: section.title || 'Section',
      description: section.description || '',
      icon: iconMap[iconKey] || ListTodo,
      color: colorMap[index % colorMap.length],
      items: section.total_items || 0,
      implemented: section.progress?.implemented || 0,
      succeed: section.progress?.succeed || 0,
      pending: section.progress?.pending || 0,
    };
  }) || [];

  // Use API cards if available, otherwise use defaults
  const displayCards = apiPlannerCards.length > 0 ? apiPlannerCards : plannerCards;
  console.log('[PlannerPage] Displaying cards:', displayCards);

  const getColorClasses = (color: string) => {
    const colorMap: Record<string, { bg: string; text: string; border: string }> = {
      blue: { bg: 'bg-blue-50', text: 'text-blue-600', border: 'border-blue-200' },
      green: { bg: 'bg-green-50', text: 'text-green-600', border: 'border-green-200' },
      orange: { bg: 'bg-orange-50', text: 'text-orange-600', border: 'border-orange-200' },
      purple: { bg: 'bg-purple-50', text: 'text-purple-600', border: 'border-purple-200' },
      red: { bg: 'bg-red-50', text: 'text-red-600', border: 'border-red-200' },
      indigo: { bg: 'bg-indigo-50', text: 'text-indigo-600', border: 'border-indigo-200' },
      teal: { bg: 'bg-teal-50', text: 'text-teal-600', border: 'border-teal-200' },
      pink: { bg: 'bg-pink-50', text: 'text-pink-600', border: 'border-pink-200' },
    };
    return colorMap[color] || colorMap.blue;
  };

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-gray-900 mb-2">Business Planner</h1>
        <p className="text-gray-600 mb-4">Organize and plan all aspects of your business: {idea.summary}</p>
        <div className="flex items-center gap-2">
          <Badge variant="default">Planning Phase</Badge>
          {idea.businessPlan && (
            <Badge variant="secondary">
              Template: {idea.businessPlan.templateName}
            </Badge>
          )}
        </div>
      </div>

      <div className="mb-6 bg-blue-50 p-4 rounded-lg border border-blue-200">
        <p className="text-gray-700">
          Click on any card below to view detailed implementation plans, timelines, and track progress.
        </p>
      </div>

      <div className="space-y-6">
        {displayCards.map((card) => {
          const Icon = card.icon;
          const colors = getColorClasses(card.color);
          const isExpanded = expandedCard === card.id;
          const cardTasks = getTasksForCard(card.id);
          
          return (
            <Card 
              key={card.id}
              className={`transition-all ${colors.border} ${isExpanded ? 'shadow-lg' : ''}`}
            >
              <CardHeader className={colors.bg}>
                <div 
                  className="flex items-start justify-between cursor-pointer"
                  onClick={() => setExpandedCard(isExpanded ? null : card.id)}
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <div className={`w-12 h-12 rounded-lg ${colors.bg} border ${colors.border} flex items-center justify-center`}>
                        <Icon className={`w-6 h-6 ${colors.text}`} />
                      </div>
                      <div>
                        <CardTitle className="text-base mb-1">{card.title}</CardTitle>
                        <Badge variant="secondary" className="text-xs">
                          {card.items} items
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <button className="p-2 hover:bg-white/50 rounded">
                    {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                  </button>
                </div>
              </CardHeader>
              <CardContent className="pt-4">
                {!isExpanded ? (
                  <>
                    <p className="text-sm text-gray-600 mb-4">{card.description}</p>
                    
                    {/* Progress Percentages */}
                    <div className="space-y-2 mb-4">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-600">Implemented</span>
                    <span className="text-blue-600">{card.implemented}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-1.5">
                    <div 
                      className="bg-blue-600 h-1.5 rounded-full" 
                      style={{ width: `${card.implemented}%` }}
                    />
                  </div>

                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-600">Succeed</span>
                    <span className="text-green-600">{card.succeed}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-1.5">
                    <div 
                      className="bg-green-600 h-1.5 rounded-full" 
                      style={{ width: `${card.succeed}%` }}
                    />
                  </div>

                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-600">Pending</span>
                    <span className="text-orange-600">{card.pending}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-1.5">
                    <div 
                      className="bg-orange-600 h-1.5 rounded-full" 
                      style={{ width: `${card.pending}%` }}
                    />
                  </div>
                </div>
                
                    <div className="flex items-center justify-end gap-2 pt-3 border-t border-gray-200">
                      <div onClick={(e) => e.stopPropagation()} className="flex gap-2">
                        <FeedbackButton itemId={card.id} itemType={card.title} />
                        <NotesButton itemId={card.id} itemType={card.title} />
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    {/* Expanded View - Show Tasks */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-gray-900">Items in {card.title}</h3>
                        <Badge>{cardTasks.length} total</Badge>
                      </div>

                      {cardTasks.map((task) => (
                        <Card key={task.id} className="border-l-4" style={{ borderLeftColor: 
                          task.status === 'completed' ? '#16a34a' :
                          task.status === 'in-progress' ? '#2563eb' : '#f59e0b'
                        }}>
                          <CardContent className="pt-4">
                            <div className="flex items-start justify-between mb-3">
                              <div className="flex-1">
                                <h4 className="text-gray-900 mb-1">{task.name}</h4>
                                <p className="text-sm text-gray-600">{task.description}</p>
                              </div>
                              <Badge variant={
                                task.priority === 'high' ? 'destructive' :
                                task.priority === 'medium' ? 'default' : 'secondary'
                              }>
                                {task.priority}
                              </Badge>
                            </div>

                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-4 text-sm text-gray-600">
                                <span>👤 {task.assignedTo}</span>
                                <Badge variant="outline" className="text-xs">
                                  {task.status.replace('-', ' ')}
                                </Badge>
                              </div>
                              <div onClick={(e) => e.stopPropagation()} className="flex gap-2">
                                <FeedbackButton itemId={task.id} itemType={task.name} />
                                <NotesButton itemId={task.id} itemType={task.name} />
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>

                    <Separator className="my-4" />

                    <div className="flex items-center justify-between">
                      <Button 
                        variant="outline"
                        onClick={() => onItemClick(card.id)}
                        className="gap-2"
                      >
                        View in Implementation
                      </Button>
                      <div onClick={(e) => e.stopPropagation()} className="flex gap-2">
                        <FeedbackButton itemId={card.id} itemType={card.title} />
                        <NotesButton itemId={card.id} itemType={card.title} />
                      </div>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="mt-8 p-6 bg-gray-50 rounded-lg border border-gray-200">
        <h2 className="text-gray-900 mb-3">Getting Started</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center flex-shrink-0">
              1
            </div>
            <div>
              <h3 className="text-gray-900 mb-1">Review Each Category</h3>
              <p className="text-sm text-gray-600">
                Click on each card to understand what's needed in that area
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center flex-shrink-0">
              2
            </div>
            <div>
              <h3 className="text-gray-900 mb-1">Add Implementation Details</h3>
              <p className="text-sm text-gray-600">
                Define specific tasks, timelines, and owners for each item
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center flex-shrink-0">
              3
            </div>
            <div>
              <h3 className="text-gray-900 mb-1">Track Progress</h3>
              <p className="text-sm text-gray-600">
                Use the Implementation view to monitor completion and adjust timelines
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center flex-shrink-0">
              4
            </div>
            <div>
              <h3 className="text-gray-900 mb-1">Measure Outcomes</h3>
              <p className="text-sm text-gray-600">
                Review key metrics and outcomes to ensure you're on track
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
