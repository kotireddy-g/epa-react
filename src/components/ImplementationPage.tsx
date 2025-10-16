import { useState } from 'react';
import { User, Calendar as CalendarIcon, ListTodo, Users, Wrench, DollarSign, Target, Briefcase, LayoutList, CalendarDays, Edit3, ChevronLeft, ChevronRight, Map } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Progress } from './ui/progress';
import { Badge } from './ui/badge';
import { FeedbackButton } from './FeedbackButton';
import { NotesButton } from './NotesButton';
import { UpdateProgressDialog, UpdateData } from './UpdateProgressDialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { JourneyMapView } from './JourneyMapView';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Idea } from '../App';

interface ImplementationPageProps {
  idea: Idea;
  itemType: string;
}

interface GanttItem {
  id: string;
  name: string;
  owner: string;
  startDate: string;
  endDate: string;
  completionPercentage: number;
  status: 'not-started' | 'in-progress' | 'completed' | 'blocked';
  dependencies?: string[];
}

interface PlannerItem {
  id: string;
  label: string;
  icon: any;
  color: string;
}

export function ImplementationPage({ idea, itemType: initialItemType }: ImplementationPageProps) {
  const [selectedItemType, setSelectedItemType] = useState(initialItemType);
  const [viewMode, setViewMode] = useState<'timeline' | 'calendar' | 'journey'>('timeline');
  const [showUpdateDialog, setShowUpdateDialog] = useState(false);
  const [selectedItem, setSelectedItem] = useState<GanttItem | null>(null);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [calendarView, setCalendarView] = useState<'month' | 'year'>('month');

  const plannerItems: PlannerItem[] = [
    { id: 'tasks', label: 'Tasks', icon: ListTodo, color: 'blue' },
    { id: 'resources', label: 'Resources', icon: Users, color: 'green' },
    { id: 'hardware', label: 'Hardware', icon: Wrench, color: 'orange' },
    { id: 'budget', label: 'Budget', icon: DollarSign, color: 'purple' },
    { id: 'timeline', label: 'Timeline', icon: CalendarIcon, color: 'red' },
    { id: 'goals', label: 'Goals', icon: Target, color: 'indigo' },
    { id: 'partnerships', label: 'Partnerships', icon: Briefcase, color: 'teal' },
  ];

  // Mock data for Gantt chart
  const getItemsForType = (type: string): GanttItem[] => {
    const baseDate = new Date();
    const items: Record<string, GanttItem[]> = {
      tasks: [
        {
          id: '1',
          name: 'Market Research & Analysis',
          owner: 'Sarah Johnson',
          startDate: new Date(baseDate.getFullYear(), baseDate.getMonth(), 1).toISOString(),
          endDate: new Date(baseDate.getFullYear(), baseDate.getMonth(), 14).toISOString(),
          completionPercentage: 85,
          status: 'in-progress',
        },
        {
          id: '2',
          name: 'Product Design & Wireframing',
          owner: 'Mike Chen',
          startDate: new Date(baseDate.getFullYear(), baseDate.getMonth(), 8).toISOString(),
          endDate: new Date(baseDate.getFullYear(), baseDate.getMonth(), 21).toISOString(),
          completionPercentage: 60,
          status: 'in-progress',
        },
        {
          id: '3',
          name: 'MVP Development',
          owner: 'Dev Team',
          startDate: new Date(baseDate.getFullYear(), baseDate.getMonth(), 15).toISOString(),
          endDate: new Date(baseDate.getFullYear(), baseDate.getMonth() + 1, 30).toISOString(),
          completionPercentage: 30,
          status: 'in-progress',
        },
        {
          id: '4',
          name: 'Beta Testing',
          owner: 'QA Team',
          startDate: new Date(baseDate.getFullYear(), baseDate.getMonth() + 2, 1).toISOString(),
          endDate: new Date(baseDate.getFullYear(), baseDate.getMonth() + 2, 14).toISOString(),
          completionPercentage: 0,
          status: 'not-started',
        },
        {
          id: '5',
          name: 'Launch Preparation',
          owner: 'Marketing Team',
          startDate: new Date(baseDate.getFullYear(), baseDate.getMonth() + 2, 10).toISOString(),
          endDate: new Date(baseDate.getFullYear(), baseDate.getMonth() + 2, 28).toISOString(),
          completionPercentage: 0,
          status: 'not-started',
        },
      ],
      resources: [
        {
          id: 'r1',
          name: 'Hire Senior Developer',
          owner: 'HR Department',
          startDate: new Date(baseDate.getFullYear(), baseDate.getMonth(), 1).toISOString(),
          endDate: new Date(baseDate.getFullYear(), baseDate.getMonth(), 30).toISOString(),
          completionPercentage: 70,
          status: 'in-progress',
        },
        {
          id: 'r2',
          name: 'Onboard Design Team',
          owner: 'HR Department',
          startDate: new Date(baseDate.getFullYear(), baseDate.getMonth(), 15).toISOString(),
          endDate: new Date(baseDate.getFullYear(), baseDate.getMonth() + 1, 5).toISOString(),
          completionPercentage: 40,
          status: 'in-progress',
        },
      ],
      hardware: [
        {
          id: 'h1',
          name: 'Purchase Development Servers',
          owner: 'IT Department',
          startDate: new Date(baseDate.getFullYear(), baseDate.getMonth(), 1).toISOString(),
          endDate: new Date(baseDate.getFullYear(), baseDate.getMonth(), 7).toISOString(),
          completionPercentage: 100,
          status: 'completed',
        },
        {
          id: 'h2',
          name: 'Setup Cloud Infrastructure',
          owner: 'DevOps Team',
          startDate: new Date(baseDate.getFullYear(), baseDate.getMonth(), 5).toISOString(),
          endDate: new Date(baseDate.getFullYear(), baseDate.getMonth(), 20).toISOString(),
          completionPercentage: 55,
          status: 'in-progress',
        },
      ],
      budget: [
        {
          id: 'b1',
          name: 'Allocate Development Budget',
          owner: 'Finance Team',
          startDate: new Date(baseDate.getFullYear(), baseDate.getMonth(), 1).toISOString(),
          endDate: new Date(baseDate.getFullYear(), baseDate.getMonth(), 3).toISOString(),
          completionPercentage: 100,
          status: 'completed',
        },
        {
          id: 'b2',
          name: 'Marketing Budget Planning',
          owner: 'CFO',
          startDate: new Date(baseDate.getFullYear(), baseDate.getMonth() + 1, 1).toISOString(),
          endDate: new Date(baseDate.getFullYear(), baseDate.getMonth() + 1, 15).toISOString(),
          completionPercentage: 20,
          status: 'in-progress',
        },
      ],
    };

    return items[type] || items.tasks;
  };

  const items = getItemsForType(selectedItemType);

  const getStatusColor = (status: string) => {
    const colors = {
      'not-started': 'bg-gray-400',
      'in-progress': 'bg-blue-500',
      'completed': 'bg-green-500',
      'blocked': 'bg-red-500',
    };
    return colors[status as keyof typeof colors] || colors['not-started'];
  };

  const getStatusBadgeVariant = (status: string): "default" | "secondary" | "destructive" | "outline" => {
    const variants = {
      'not-started': 'secondary' as const,
      'in-progress': 'default' as const,
      'completed': 'outline' as const,
      'blocked': 'destructive' as const,
    };
    return variants[status as keyof typeof variants] || 'secondary';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const handleUpdateClick = (item: GanttItem) => {
    setSelectedItem(item);
    setShowUpdateDialog(true);
  };

  const handleUpdateSave = (updateData: UpdateData) => {
    console.log('Update saved for item:', selectedItem, updateData);
    // In a real app, this would save to backend
  };

  const getColorClass = (color: string) => {
    const colorMap: Record<string, string> = {
      blue: 'bg-blue-100 text-blue-700 border-blue-300',
      green: 'bg-green-100 text-green-700 border-green-300',
      orange: 'bg-orange-100 text-orange-700 border-orange-300',
      purple: 'bg-purple-100 text-purple-700 border-purple-300',
      red: 'bg-red-100 text-red-700 border-red-300',
      indigo: 'bg-indigo-100 text-indigo-700 border-indigo-300',
      teal: 'bg-teal-100 text-teal-700 border-teal-300',
    };
    return colorMap[color] || colorMap.blue;
  };

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-gray-900 mb-2">Implementation Tracking</h1>
        <p className="text-gray-600">Monitor progress and manage your implementation timeline for: {idea.summary}</p>
      </div>

      {/* Planner Item Selector */}
      <div className="mb-6">
        <h3 className="text-sm text-gray-700 mb-3">Select Plan Category:</h3>
        <div className="flex flex-wrap gap-3">
          {plannerItems.map((item) => {
            const Icon = item.icon;
            const isSelected = selectedItemType === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setSelectedItemType(item.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg border-2 transition-all ${
                  isSelected
                    ? getColorClass(item.color) + ' border-current shadow-md scale-105'
                    : 'bg-white text-gray-700 border-gray-300 hover:border-gray-400'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="text-sm">{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* View Mode Tabs */}
      <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as 'timeline' | 'calendar' | 'journey')} className="mb-6">
        <TabsList>
          <TabsTrigger value="timeline" className="gap-2">
            <LayoutList className="w-4 h-4" />
            Timeline View
          </TabsTrigger>
          <TabsTrigger value="calendar" className="gap-2">
            <CalendarDays className="w-4 h-4" />
            Calendar View
          </TabsTrigger>
          <TabsTrigger value="journey" className="gap-2">
            <Map className="w-4 h-4" />
            Journey
          </TabsTrigger>
        </TabsList>

        <TabsContent value="timeline" className="mt-6">
          {/* Timeline View */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {items.map((item) => (
              <Card key={item.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-base mb-2">{item.name}</CardTitle>
                      <div className="flex items-center gap-3 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <User className="w-4 h-4" />
                          <span>{item.owner}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <CalendarIcon className="w-4 h-4" />
                          <span>
                            {formatDate(item.startDate)} - {formatDate(item.endDate)}
                          </span>
                        </div>
                        <Badge variant={getStatusBadgeVariant(item.status)}>
                          {item.status.replace('-', ' ')}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleUpdateClick(item)}
                        className="gap-2"
                      >
                        <Edit3 className="w-4 h-4" />
                        Update
                      </Button>
                      <FeedbackButton itemId={item.id} itemType={item.name} />
                      <NotesButton itemId={item.id} itemType={item.name} />
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Progress</span>
                      <span className="text-gray-900">{item.completionPercentage}%</span>
                    </div>
                    <Progress value={item.completionPercentage} className="h-2" />
                  </div>

                  {/* Visual Timeline Bar */}
                  <div className="mt-4">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-gray-600">Timeline</span>
                    </div>
                    <div className="relative">
                      {/* Background track */}
                      <div className="h-10 bg-gradient-to-r from-gray-100 to-gray-200 rounded-lg shadow-inner border border-gray-300 relative overflow-hidden">
                        {/* Progress fill */}
                        <div
                          className={`absolute top-0 left-0 h-full ${getStatusColor(item.status)} transition-all duration-500`}
                          style={{ width: `${item.completionPercentage}%` }}
                        >
                          <div className="absolute inset-0 bg-gradient-to-r from-transparent to-white/20"></div>
                        </div>
                        {/* Date labels */}
                        <div className="absolute inset-0 flex items-center justify-between px-3">
                          <span className="text-xs text-gray-700 bg-white/80 px-2 py-0.5 rounded">
                            {formatDate(item.startDate)}
                          </span>
                          <span className="text-xs text-gray-700 bg-white/80 px-2 py-0.5 rounded">
                            {formatDate(item.endDate)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="calendar" className="mt-6">
          {/* Calendar View */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Calendar View</CardTitle>
                <div className="flex items-center gap-3">
                  {/* View Type Selector */}
                  <Select value={calendarView} onValueChange={(v) => setCalendarView(v as 'month' | 'year')}>
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="month">Month</SelectItem>
                      <SelectItem value="year">Year</SelectItem>
                    </SelectContent>
                  </Select>

                  {/* Month/Year Navigation */}
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const newDate = new Date(currentMonth);
                        if (calendarView === 'month') {
                          newDate.setMonth(newDate.getMonth() - 1);
                        } else {
                          newDate.setFullYear(newDate.getFullYear() - 1);
                        }
                        setCurrentMonth(newDate);
                      }}
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </Button>
                    <div className="min-w-[150px] text-center">
                      {calendarView === 'month' 
                        ? currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
                        : currentMonth.getFullYear()
                      }
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const newDate = new Date(currentMonth);
                        if (calendarView === 'month') {
                          newDate.setMonth(newDate.getMonth() + 1);
                        } else {
                          newDate.setFullYear(newDate.getFullYear() + 1);
                        }
                        setCurrentMonth(newDate);
                      }}
                    >
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setCurrentMonth(new Date())}
                    >
                      Today
                    </Button>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {calendarView === 'month' ? (
                <>
                  {/* Month View */}
                  <div className="grid grid-cols-7 gap-2 mb-4">
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                      <div key={day} className="text-center text-sm text-gray-600 p-2">
                        {day}
                      </div>
                    ))}
                  </div>
                  
                  <div className="grid grid-cols-7 gap-2">
                    {Array.from({ length: 35 }, (_, i) => {
                      const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
                      date.setDate(date.getDate() - date.getDay() + i);
                      const dateStr = date.toISOString().split('T')[0];
                      const isCurrentMonth = date.getMonth() === currentMonth.getMonth();
                      const isToday = dateStr === new Date().toISOString().split('T')[0];
                      
                      // Check if any item falls on this date
                      const itemsOnDate = items.filter(item => {
                        const start = new Date(item.startDate).toISOString().split('T')[0];
                        const end = new Date(item.endDate).toISOString().split('T')[0];
                        return dateStr >= start && dateStr <= end;
                      });

                      return (
                        <div
                          key={i}
                          className={`min-h-[90px] p-2 rounded-lg border transition-colors ${
                            isToday 
                              ? 'bg-blue-100 border-blue-400 ring-2 ring-blue-400' 
                              : itemsOnDate.length > 0 
                                ? 'bg-blue-50 border-blue-200' 
                                : 'bg-white border-gray-200'
                          } ${!isCurrentMonth ? 'opacity-50' : ''}`}
                        >
                          <div className={`text-sm mb-1 ${isToday ? 'text-blue-700' : 'text-gray-600'}`}>
                            {date.getDate()}
                          </div>
                          {itemsOnDate.slice(0, 2).map((item, idx) => (
                            <div
                              key={idx}
                              className={`text-xs p-1 rounded mb-1 ${getStatusColor(item.status)} text-white truncate cursor-pointer hover:opacity-80`}
                              title={item.name}
                              onClick={() => handleUpdateClick(item)}
                            >
                              {item.name.substring(0, 12)}...
                            </div>
                          ))}
                          {itemsOnDate.length > 2 && (
                            <div className="text-xs text-gray-500">+{itemsOnDate.length - 2} more</div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </>
              ) : (
                <>
                  {/* Year View */}
                  <div className="grid grid-cols-3 gap-6">
                    {Array.from({ length: 12 }, (_, monthIndex) => {
                      const monthDate = new Date(currentMonth.getFullYear(), monthIndex, 1);
                      const monthName = monthDate.toLocaleDateString('en-US', { month: 'short' });
                      
                      // Count items in this month
                      const itemsInMonth = items.filter(item => {
                        const startMonth = new Date(item.startDate).getMonth();
                        const endMonth = new Date(item.endDate).getMonth();
                        const startYear = new Date(item.startDate).getFullYear();
                        const endYear = new Date(item.endDate).getFullYear();
                        
                        return (
                          (startYear === currentMonth.getFullYear() && startMonth === monthIndex) ||
                          (endYear === currentMonth.getFullYear() && endMonth === monthIndex) ||
                          (startYear <= currentMonth.getFullYear() && endYear >= currentMonth.getFullYear() && startMonth <= monthIndex && endMonth >= monthIndex)
                        );
                      });

                      const isCurrentMonth = monthIndex === new Date().getMonth() && currentMonth.getFullYear() === new Date().getFullYear();

                      return (
                        <Card 
                          key={monthIndex} 
                          className={`cursor-pointer hover:shadow-md transition-all ${
                            isCurrentMonth ? 'border-2 border-blue-400 bg-blue-50' : ''
                          }`}
                          onClick={() => {
                            setCurrentMonth(monthDate);
                            setCalendarView('month');
                          }}
                        >
                          <CardContent className="pt-4 pb-3">
                            <h4 className="text-gray-900 mb-2">{monthName}</h4>
                            <div className="text-sm text-gray-600">
                              {itemsInMonth.length} {itemsInMonth.length === 1 ? 'task' : 'tasks'}
                            </div>
                            {itemsInMonth.length > 0 && (
                              <div className="mt-2 space-y-1">
                                {itemsInMonth.slice(0, 3).map((item, idx) => (
                                  <div key={idx} className="text-xs text-gray-700 truncate">
                                    • {item.name.substring(0, 20)}...
                                  </div>
                                ))}
                              </div>
                            )}
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="journey" className="mt-6">
          {/* Journey Map View */}
          <JourneyMapView />
        </TabsContent>
      </Tabs>

      {/* Update Progress Dialog */}
      {selectedItem && (
        <UpdateProgressDialog
          isOpen={showUpdateDialog}
          onClose={() => {
            setShowUpdateDialog(false);
            setSelectedItem(null);
          }}
          itemName={selectedItem.name}
          onSave={handleUpdateSave}
        />
      )}
    </div>
  );
}
