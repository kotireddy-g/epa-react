import { useState } from 'react';
import { FileText, Download, Printer, Eye, Edit, ChevronRight, Plus } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Input } from './ui/input';
import { FeedbackButton } from './FeedbackButton';
import { NotesButton } from './NotesButton';
import { Idea } from '../App';

interface BusinessPlanPageProps {
  idea: Idea;
  onComplete: (businessPlan: any) => void;
}

interface Template {
  id: string;
  name: string;
  description: string;
  category: string;
  sections: string[];
  recommended?: boolean;
}

interface TaskRow {
  id: string;
  task: string;
  resources: string;
  timeline: string;
  budget: string;
  vendors: string;
}

export function BusinessPlanPage({ idea, onComplete }: BusinessPlanPageProps) {
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [isTableExpanded, setIsTableExpanded] = useState(false);
  const [tasks, setTasks] = useState<TaskRow[]>([
    {
      id: '1',
      task: 'Market Research & Analysis',
      resources: '2 Research Analysts, Tools',
      timeline: '2 weeks',
      budget: '$5,000',
      vendors: 'Research firms, Survey tools',
    },
    {
      id: '2',
      task: 'Product Development',
      resources: '3 Developers, Designer',
      timeline: '3 months',
      budget: '$50,000',
      vendors: 'AWS, Development tools',
    },
    {
      id: '3',
      task: 'Marketing Strategy',
      resources: 'Marketing Manager, Content Creator',
      timeline: '1 month',
      budget: '$10,000',
      vendors: 'Ad platforms, Design tools',
    },
    {
      id: '4',
      task: 'Customer Acquisition',
      resources: 'Sales Team, CRM',
      timeline: 'Ongoing',
      budget: '$15,000/month',
      vendors: 'HubSpot, LinkedIn Ads',
    },
  ]);

  const templates: Template[] = [
    {
      id: 'lean-startup',
      name: 'Lean Startup Canvas',
      description: 'One-page business model focused on rapid iteration and customer feedback',
      category: 'Startup',
      sections: ['Problem', 'Solution', 'Key Metrics', 'Unique Value', 'Unfair Advantage', 'Channels', 'Customer Segments', 'Cost Structure', 'Revenue Streams'],
      recommended: true,
    },
    {
      id: 'traditional',
      name: 'Traditional Business Plan',
      description: 'Comprehensive business plan suitable for investors and bank loans',
      category: 'Traditional',
      sections: ['Executive Summary', 'Company Description', 'Market Analysis', 'Organization & Management', 'Products/Services', 'Marketing & Sales', 'Financial Projections', 'Appendix'],
    },
    {
      id: 'saas',
      name: 'SaaS Business Plan',
      description: 'Tailored for software-as-a-service businesses with focus on metrics',
      category: 'Tech',
      sections: ['Product Overview', 'Market Opportunity', 'Business Model', 'Go-to-Market Strategy', 'Technology Stack', 'Team', 'Financial Model', 'Key SaaS Metrics'],
      recommended: idea.summary.toLowerCase().includes('software') || idea.summary.toLowerCase().includes('app'),
    },
    {
      id: 'ecommerce',
      name: 'E-Commerce Plan',
      description: 'For online retail and marketplace businesses',
      category: 'E-Commerce',
      sections: ['Product Catalog', 'Target Market', 'Competitive Analysis', 'Platform & Technology', 'Logistics & Fulfillment', 'Marketing Strategy', 'Customer Acquisition', 'Financial Projections'],
      recommended: idea.summary.toLowerCase().includes('ecommerce') || idea.summary.toLowerCase().includes('shop'),
    },
    {
      id: 'social-enterprise',
      name: 'Social Enterprise Plan',
      description: 'For businesses with social or environmental mission',
      category: 'Impact',
      sections: ['Mission & Vision', 'Social Impact Goals', 'Theory of Change', 'Target Beneficiaries', 'Business Model', 'Impact Measurement', 'Financial Sustainability', 'Stakeholder Engagement'],
    },
    {
      id: 'franchise',
      name: 'Franchise Plan',
      description: 'For franchise development and expansion',
      category: 'Franchise',
      sections: ['Franchise Concept', 'Market Analysis', 'Franchise Model', 'Support Systems', 'Training Programs', 'Marketing Support', 'Financial Requirements', 'Legal Structure'],
    },
  ];

  const handleTemplateSelect = (template: Template) => {
    setSelectedTemplate(template);
  };

  const handleUseTemplate = () => {
    if (selectedTemplate) {
      onComplete({
        templateId: selectedTemplate.id,
        templateName: selectedTemplate.name,
        sections: selectedTemplate.sections,
        tasks: tasks,
        createdAt: new Date(),
      });
    }
  };

  const handleDownload = (template: Template) => {
    alert(`Downloading ${template.name}... In a real app, this would generate a PDF or Word document.`);
  };

  const handlePrint = (template: Template) => {
    alert(`Printing ${template.name}... In a real app, this would open the print dialog.`);
  };

  const handleView = (template: Template) => {
    alert(`Viewing ${template.name}... In a real app, this would show a preview of the template.`);
  };

  const addNewTask = () => {
    const newTask: TaskRow = {
      id: (tasks.length + 1).toString(),
      task: '',
      resources: '',
      timeline: '',
      budget: '',
      vendors: '',
    };
    setTasks([...tasks, newTask]);
  };

  const updateTask = (id: string, field: keyof TaskRow, value: string) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, [field]: value } : task
    ));
  };

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-gray-900 mb-2">Business Plan</h1>
        <p className="text-gray-600">Create a comprehensive plan for: {idea.summary}</p>
        {idea.validationScore && (
          <Badge className="mt-2" variant="default">
            Validation Score: {idea.validationScore}%
          </Badge>
        )}
      </div>

      {/* High-Level Overview Table - Collapsible */}
      {!isTableExpanded ? (
        <button
          onClick={() => setIsTableExpanded(true)}
          className="mb-8 p-4 bg-white rounded-lg border-2 border-dashed border-blue-300 hover:border-blue-500 transition-all w-full flex items-center justify-center gap-3 text-blue-600 hover:bg-blue-50"
        >
          <FileText className="w-6 h-6" />
          <span className="text-sm">Click to expand High-Level Business Overview Table</span>
        </button>
      ) : (
        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <CardTitle>High-Level Business Overview</CardTitle>
                <p className="text-sm text-gray-600 mt-1">
                  Define the key functional tasks, resources, timelines, budget, and vendors for your business
                </p>
              </div>
              <div className="flex gap-2">
                <Button onClick={addNewTask} size="sm" variant="outline" className="gap-2">
                  <Plus className="w-4 h-4" />
                  Add Task
                </Button>
                <Button 
                  onClick={() => setIsTableExpanded(false)} 
                  size="sm" 
                  variant="ghost"
                  className="gap-2"
                >
                  Minimize
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="min-w-[200px]">Micro/Functional Tasks</TableHead>
                  <TableHead className="min-w-[180px]">Resources</TableHead>
                  <TableHead className="min-w-[120px]">Timelines</TableHead>
                  <TableHead className="min-w-[120px]">Budget/Product</TableHead>
                  <TableHead className="min-w-[180px]">Vendors</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tasks.map((task) => (
                  <TableRow key={task.id}>
                    <TableCell>
                      <Input
                        value={task.task}
                        onChange={(e) => updateTask(task.id, 'task', e.target.value)}
                        placeholder="Enter task name"
                        className="border-0 focus-visible:ring-1"
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        value={task.resources}
                        onChange={(e) => updateTask(task.id, 'resources', e.target.value)}
                        placeholder="Resources needed"
                        className="border-0 focus-visible:ring-1"
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        value={task.timeline}
                        onChange={(e) => updateTask(task.id, 'timeline', e.target.value)}
                        placeholder="Timeline"
                        className="border-0 focus-visible:ring-1"
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        value={task.budget}
                        onChange={(e) => updateTask(task.id, 'budget', e.target.value)}
                        placeholder="Budget"
                        className="border-0 focus-visible:ring-1"
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        value={task.vendors}
                        onChange={(e) => updateTask(task.id, 'vendors', e.target.value)}
                        placeholder="Vendors/Tools"
                        className="border-0 focus-visible:ring-1"
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <div className="mt-4 flex justify-end gap-2">
            <FeedbackButton itemId="business-overview" itemType="business overview table" />
            <NotesButton itemId="business-overview" itemType="business overview table" />
          </div>
          </CardContent>
        </Card>
      )}

      {/* Templates Section */}
      {!selectedTemplate ? (
        <>
          <div className="mb-6">
            <h2 className="text-gray-900 mb-4">Recommended Templates</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {templates.filter(t => t.recommended).map((template) => (
                <Card 
                  key={template.id} 
                  className="border-blue-200 bg-blue-50 hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => handleTemplateSelect(template)}
                >
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-base mb-1">{template.name}</CardTitle>
                        <Badge variant="secondary" className="mb-2">{template.category}</Badge>
                        <p className="text-sm text-gray-600">{template.description}</p>
                      </div>
                      <FileText className="w-8 h-8 text-blue-600" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="mb-3">
                      <p className="text-sm text-gray-700 mb-2">Includes {template.sections.length} sections:</p>
                      <div className="flex flex-wrap gap-1">
                        {template.sections.slice(0, 4).map((section, idx) => (
                          <Badge key={idx} variant="outline" className="text-xs">
                            {section}
                          </Badge>
                        ))}
                        {template.sections.length > 4 && (
                          <Badge variant="outline" className="text-xs">
                            +{template.sections.length - 4} more
                          </Badge>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 pt-3 border-t border-blue-200">
                      <Button size="sm" onClick={(e) => { e.stopPropagation(); handleView(template); }}>
                        <Eye className="w-4 h-4 mr-2" />
                        View
                      </Button>
                      <Button size="sm" variant="outline" onClick={(e) => { e.stopPropagation(); handleDownload(template); }}>
                        <Download className="w-4 h-4 mr-2" />
                        Download
                      </Button>
                      <Button size="sm" variant="outline" onClick={(e) => { e.stopPropagation(); handlePrint(template); }}>
                        <Printer className="w-4 h-4 mr-2" />
                        Print
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-gray-900 mb-4">All Templates</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {templates.filter(t => !t.recommended).map((template) => (
                <Card 
                  key={template.id} 
                  className="hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => handleTemplateSelect(template)}
                >
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-base mb-1">{template.name}</CardTitle>
                        <Badge variant="secondary" className="mb-2">{template.category}</Badge>
                      </div>
                      <FileText className="w-6 h-6 text-gray-600" />
                    </div>
                    <p className="text-sm text-gray-600">{template.description}</p>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-700 mb-2">{template.sections.length} sections</p>
                    <div className="flex items-center gap-2">
                      <Button size="sm" variant="outline" onClick={(e) => { e.stopPropagation(); handleView(template); }}>
                        <Eye className="w-4 h-4 mr-2" />
                        View
                      </Button>
                      <Button size="sm" variant="outline" onClick={(e) => { e.stopPropagation(); handleDownload(template); }}>
                        <Download className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="outline" onClick={(e) => { e.stopPropagation(); handlePrint(template); }}>
                        <Printer className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </>
      ) : (
        <Card>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle>{selectedTemplate.name}</CardTitle>
                <Badge className="mt-2">{selectedTemplate.category}</Badge>
                <p className="text-gray-600 mt-2">{selectedTemplate.description}</p>
              </div>
              <Button variant="outline" onClick={() => setSelectedTemplate(null)}>
                Back to Templates
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="text-gray-900 mb-4">Template Sections</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {selectedTemplate.sections.map((section, idx) => (
                  <div key={idx} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center flex-shrink-0">
                      {idx + 1}
                    </div>
                    <span className="text-gray-900">{section}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="text-gray-900 mb-2">What happens next?</h3>
              <p className="text-gray-700 mb-4">
                You can either use this template as-is and continue, or edit it to customize the sections based on your specific needs.
              </p>
              <div className="flex items-center gap-3 flex-wrap">
                <Button onClick={handleUseTemplate} className="gap-2">
                  Use Template & Continue
                  <ChevronRight className="w-4 h-4" />
                </Button>
                <Button variant="outline" className="gap-2">
                  <Edit className="w-4 h-4" />
                  Edit Template
                </Button>
                <Button variant="outline" onClick={() => handleDownload(selectedTemplate)} className="gap-2">
                  <Download className="w-4 h-4" />
                  Download
                </Button>
                <Button variant="outline" onClick={() => handlePrint(selectedTemplate)} className="gap-2">
                  <Printer className="w-4 h-4" />
                  Print
                </Button>
                <div className="ml-auto flex gap-2">
                  <FeedbackButton itemId={selectedTemplate.id} itemType="business plan template" />
                  <NotesButton itemId={selectedTemplate.id} itemType="business plan template" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
