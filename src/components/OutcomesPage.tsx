import { useState } from 'react';
import { TrendingUp, TrendingDown, Target, CheckCircle, XCircle, AlertTriangle, ArrowUpRight, ArrowDownRight, History } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Progress } from './ui/progress';
import { Badge } from './ui/badge';
import { FeedbackButton } from './FeedbackButton';
import { NotesButton } from './NotesButton';
import { OutcomeDetailDialog, OutcomeTask } from './OutcomeDetailDialog';
import { IdeaJourneyTimeline } from './IdeaJourneyTimeline';
import { Separator } from './ui/separator';
import { Idea } from '../App';

interface OutcomesPageProps {
  idea: Idea;
  onTaskClick?: (taskId: string) => void;
}

export function OutcomesPage({ idea }: OutcomesPageProps) {
  const [selectedOutcome, setSelectedOutcome] = useState<OutcomeTask | null>(null);
  const [showDetailDialog, setShowDetailDialog] = useState(false);

  // Mock data for previous idea journeys
  const previousJourneys = [
    {
      id: '1',
      ideaName: 'AI-Powered Task Manager',
      companyName: 'TaskMaster AI',
      startDate: 'Jan 2024',
      endDate: 'Aug 2024',
      overallStatus: 'success' as const,
      finalOutcome: 'Successfully launched and acquired by major productivity company for $2.5M. Achieved 10,000+ active users with $25K MRR before acquisition.',
      lessonsLearned: [
        'Early customer validation saved 3 months of development on features nobody wanted',
        'Focusing on one specific use case (project managers) was key to initial traction',
        'Building in public on social media generated 40% of early adopters',
        'Pricing too low initially - should have charged 2x from the start',
        'Partnership with complementary tools drove significant growth in months 4-6',
      ],
      stages: [
        {
          stage: 'idea' as const,
          name: 'Initial Idea',
          icon: 'Lightbulb',
          status: 'completed' as const,
          completedDate: 'Jan 15, 2024',
          score: 100,
          summary: 'Conceived AI-powered task management solution targeting overwhelmed project managers',
          details: [
            { key: 'Problem Identified', value: 'Manual task prioritization wasting 2+ hours daily' },
            { key: 'Target Market', value: 'Project Managers in tech companies' },
            { key: 'Initial Hypothesis', value: 'AI can reduce task management time by 70%' },
          ],
        },
        {
          stage: 'validation' as const,
          name: 'Market Validation',
          icon: 'CheckCircle',
          status: 'completed' as const,
          completedDate: 'Feb 10, 2024',
          score: 87,
          summary: 'Validated with 50 potential customers, 42 showed strong interest',
          details: [
            { key: 'Interviews Conducted', value: '50 project managers' },
            { key: 'Willingness to Pay', value: '84% ($29-49/month)' },
            { key: 'Key Pain Point', value: 'Context switching between tools' },
            { key: 'Competitive Advantage', value: 'AI auto-prioritization' },
          ],
        },
        {
          stage: 'business-plan' as const,
          name: 'Business Plan',
          icon: 'FileText',
          status: 'completed' as const,
          completedDate: 'Feb 28, 2024',
          score: 92,
          summary: 'Created comprehensive SaaS business plan with 18-month runway',
          details: [
            { key: 'Initial Budget', value: '$75,000' },
            { key: 'Revenue Model', value: 'Subscription ($39/month)' },
            { key: 'Break-even Timeline', value: 'Month 8' },
            { key: 'Team Size', value: '3 founders + 2 contractors' },
          ],
        },
        {
          stage: 'planner' as const,
          name: 'Planning & Resources',
          icon: 'Calendar',
          status: 'completed' as const,
          completedDate: 'Mar 15, 2024',
          score: 88,
          summary: 'Allocated resources, hired key team members, set up infrastructure',
          details: [
            { key: 'Development Team', value: '2 full-stack developers hired' },
            { key: 'Infrastructure', value: 'AWS, Stripe, OpenAI API' },
            { key: 'Timeline', value: '12 weeks to MVP' },
            { key: 'Marketing Budget', value: '$15,000 allocated' },
          ],
        },
        {
          stage: 'implementation' as const,
          name: 'Implementation',
          icon: 'Kanban',
          status: 'completed' as const,
          completedDate: 'May 30, 2024',
          score: 85,
          summary: 'Built and launched MVP, onboarded first 100 customers',
          details: [
            { key: 'MVP Launch', value: 'May 1, 2024' },
            { key: 'Initial Users', value: '100 in first month' },
            { key: 'Feature Completion', value: '78% of planned features' },
            { key: 'Technical Debt', value: 'Moderate, planned refactor Q3' },
          ],
        },
        {
          stage: 'outcomes' as const,
          name: 'Final Outcomes',
          icon: 'Target',
          status: 'completed' as const,
          completedDate: 'Aug 20, 2024',
          score: 95,
          summary: 'Exceeded growth targets, acquired by ProductivityCo',
          details: [
            { key: 'Active Users', value: '10,247' },
            { key: 'MRR at Exit', value: '$25,400' },
            { key: 'User Retention', value: '89%' },
            { key: 'Exit Value', value: '$2.5M acquisition' },
          ],
        },
      ],
    },
    {
      id: '2',
      ideaName: 'Fitness Meal Planning App',
      companyName: 'FitMeal Pro',
      startDate: 'Mar 2023',
      endDate: 'Sep 2023',
      overallStatus: 'failed' as const,
      finalOutcome: 'Pivoted after 6 months due to high customer acquisition costs and low retention. Learned valuable lessons about market fit and pricing.',
      lessonsLearned: [
        'Market was too saturated with free alternatives - differentiation was insufficient',
        'Should have validated willingness to pay before building expensive features',
        'Underestimated the importance of having a nutritionist co-founder for credibility',
        'Customer acquisition cost ($45) exceeded lifetime value ($38) - unsustainable',
        'Pivoted learnings into new B2B opportunity serving gyms directly',
      ],
      stages: [
        {
          stage: 'idea' as const,
          name: 'Initial Idea',
          icon: 'Lightbulb',
          status: 'completed' as const,
          completedDate: 'Mar 5, 2023',
          score: 100,
          summary: 'Personalized meal planning app for fitness enthusiasts',
          details: [
            { key: 'Problem Identified', value: 'Difficult to plan meals aligned with fitness goals' },
            { key: 'Target Market', value: 'Gym goers and fitness enthusiasts' },
            { key: 'Initial Hypothesis', value: 'People will pay $15/month for meal plans' },
          ],
        },
        {
          stage: 'validation' as const,
          name: 'Market Validation',
          icon: 'CheckCircle',
          status: 'completed' as const,
          completedDate: 'Apr 2, 2023',
          score: 65,
          summary: 'Mixed validation results - interest high but willingness to pay low',
          details: [
            { key: 'Survey Responses', value: '200 fitness enthusiasts' },
            { key: 'Willingness to Pay', value: 'Only 23% willing to pay $15/month' },
            { key: 'Key Concern', value: 'Many free alternatives available' },
            { key: 'Positive Signal', value: 'B2B interest from gym owners' },
          ],
        },
        {
          stage: 'business-plan' as const,
          name: 'Business Plan',
          icon: 'FileText',
          status: 'completed' as const,
          completedDate: 'Apr 20, 2023',
          score: 70,
          summary: 'Created plan but assumptions on conversion rates were too optimistic',
          details: [
            { key: 'Initial Budget', value: '$40,000' },
            { key: 'Revenue Model', value: 'Freemium + $14.99/month premium' },
            { key: 'Projected Break-even', value: 'Month 10 (unrealistic)' },
            { key: 'Team Size', value: '2 founders' },
          ],
        },
        {
          stage: 'planner' as const,
          name: 'Planning & Resources',
          icon: 'Calendar',
          status: 'completed' as const,
          completedDate: 'May 5, 2023',
          score: 75,
          summary: 'Planned execution but should have allocated more to marketing',
          details: [
            { key: 'Development', value: '1 developer (founder)' },
            { key: 'Content Creation', value: 'Contracted nutritionist' },
            { key: 'Marketing Budget', value: '$8,000 (insufficient)' },
            { key: 'Timeline', value: '8 weeks to MVP' },
          ],
        },
        {
          stage: 'implementation' as const,
          name: 'Implementation',
          icon: 'Kanban',
          status: 'completed' as const,
          completedDate: 'Jul 15, 2023',
          score: 60,
          summary: 'Launched MVP but struggled with user acquisition and retention',
          details: [
            { key: 'MVP Launch', value: 'June 20, 2023' },
            { key: 'Month 1 Users', value: '247 signups, 18 paid' },
            { key: 'Conversion Rate', value: '7.3% (target was 15%)' },
            { key: 'Churn Rate', value: '45% monthly (unsustainable)' },
          ],
        },
        {
          stage: 'outcomes' as const,
          name: 'Final Outcomes',
          icon: 'Target',
          status: 'completed' as const,
          completedDate: 'Sep 10, 2023',
          score: 40,
          summary: 'Decided to pivot - valuable learnings but financially unsuccessful',
          details: [
            { key: 'Peak Users', value: '892 free, 67 paid' },
            { key: 'Peak MRR', value: '$1,004' },
            { key: 'Total Spent', value: '$38,500' },
            { key: 'Decision', value: 'Pivot to B2B gym solution' },
          ],
        },
      ],
    },
    {
      id: '3',
      ideaName: 'Local Service Marketplace',
      companyName: 'SkillConnect',
      startDate: 'Aug 2023',
      endDate: 'Present',
      overallStatus: 'ongoing' as const,
      finalOutcome: 'Currently in implementation phase with strong early traction. 450+ service providers onboarded, processing $15K in monthly transactions.',
      lessonsLearned: [
        'Two-sided marketplaces are harder than anticipated - chicken and egg problem',
        'Geographic focus (starting with one city) was the right call',
        'Manual onboarding of first 50 providers was time-consuming but valuable',
        'Quality control is critical - implemented rating system early',
        'Need to reach critical mass in each category before expanding to new services',
      ],
      stages: [
        {
          stage: 'idea' as const,
          name: 'Initial Idea',
          icon: 'Lightbulb',
          status: 'completed' as const,
          completedDate: 'Aug 10, 2023',
          score: 100,
          summary: 'Marketplace connecting local service providers with customers',
          details: [
            { key: 'Problem Identified', value: 'Hard to find reliable local service providers' },
            { key: 'Target Market', value: 'Homeowners & service professionals' },
            { key: 'Initial Hypothesis', value: '10% transaction fee sustainable' },
          ],
        },
        {
          stage: 'validation' as const,
          name: 'Market Validation',
          icon: 'CheckCircle',
          status: 'completed' as const,
          completedDate: 'Sep 15, 2023',
          score: 78,
          summary: 'Strong validation from both providers and customers',
          details: [
            { key: 'Provider Interviews', value: '80 service professionals' },
            { key: 'Customer Surveys', value: '150 homeowners' },
            { key: 'Interest Level', value: '68% providers, 82% customers' },
            { key: 'Fee Acceptance', value: '75% okay with 10-15% commission' },
          ],
        },
        {
          stage: 'business-plan' as const,
          name: 'Business Plan',
          icon: 'FileText',
          status: 'completed' as const,
          completedDate: 'Oct 5, 2023',
          score: 85,
          summary: 'Detailed marketplace plan with phased rollout strategy',
          details: [
            { key: 'Seed Funding', value: '$120,000' },
            { key: 'Revenue Model', value: '12% transaction fee' },
            { key: 'Phase 1', value: 'Single city focus (Austin)' },
            { key: 'Team', value: '3 co-founders + 2 part-time' },
          ],
        },
        {
          stage: 'planner' as const,
          name: 'Planning & Resources',
          icon: 'Calendar',
          status: 'completed' as const,
          completedDate: 'Oct 25, 2023',
          score: 82,
          summary: 'Resource allocation complete, team assembled',
          details: [
            { key: 'Tech Team', value: '2 developers hired' },
            { key: 'Operations', value: '1 ops manager for provider onboarding' },
            { key: 'Marketing', value: '$25,000 local marketing budget' },
            { key: 'Launch Timeline', value: '16 weeks to beta' },
          ],
        },
        {
          stage: 'implementation' as const,
          name: 'Implementation',
          icon: 'Kanban',
          status: 'in-progress' as const,
          completedDate: 'Dec 15, 2023',
          score: 75,
          summary: 'Platform live with growing provider and customer base',
          details: [
            { key: 'Launch Date', value: 'Nov 20, 2023' },
            { key: 'Providers Onboarded', value: '456' },
            { key: 'Completed Jobs', value: '1,247' },
            { key: 'Monthly GMV', value: '$127,000 (growing 25%/month)' },
          ],
        },
        {
          stage: 'outcomes' as const,
          name: 'Outcomes',
          icon: 'Target',
          status: 'in-progress' as const,
          score: 72,
          summary: 'Strong early metrics, on track for Series A in Q2 2024',
          details: [
            { key: 'Current MRR', value: '$15,240 (transaction fees)' },
            { key: 'Provider Retention', value: '87%' },
            { key: 'Customer Rating', value: '4.7/5 average' },
            { key: 'Next Milestone', value: 'Expand to Dallas by Q2' },
          ],
        },
      ],
    },
  ];

  // Mock outcome data with detailed information
  const outcomes: OutcomeTask[] = [
    {
      id: '1',
      title: 'Customer Acquisition Target',
      category: 'Marketing',
      status: 'exceeded',
      plannedValue: '1,000 customers',
      actualValue: '1,350 customers',
      variance: 35,
      positiveImpacts: [
        'Exceeded initial target by 35%, bringing in 350 more customers than planned',
        'Strong viral growth through referral program contributed to 40% of new signups',
        'Social media campaign performed 50% better than industry benchmarks',
        'Customer retention rate improved to 85% from projected 70%',
      ],
      negativeImpacts: [
        'Customer acquisition cost (CAC) was 20% higher than budgeted',
        'Support team overwhelmed with 30% more inquiries than capacity',
        'Onboarding completion rate only 65% vs targeted 85%',
      ],
      reasons: {
        positive: [
          'Referral program incentives resonated well with early adopters',
          'Product-market fit stronger than initially assessed',
          'Timing aligned with market trend shift in our favor',
          'Strategic partnerships brought quality leads',
        ],
        negative: [
          'Premium ad placements drove up costs without proportional quality',
          'Support infrastructure not scaled in time',
          'Onboarding process too complex for new user segment',
          'Technical issues during first week impacted user experience',
        ],
      },
      recommendations: [
        'Reallocate budget from premium ads to referral program expansion',
        'Hire 2 additional support team members immediately',
        'Simplify onboarding flow based on user feedback',
        'Implement better technical monitoring and rollback procedures',
      ],
      lastUpdated: '2 hours ago',
    },
    {
      id: '2',
      title: 'Revenue Target Q1',
      category: 'Finance',
      status: 'met',
      plannedValue: '$50,000 MRR',
      actualValue: '$51,200 MRR',
      variance: 2.4,
      positiveImpacts: [
        'Met revenue target with slight overperformance',
        'Pricing strategy validated by market acceptance',
        'Enterprise tier adoption exceeded expectations by 25%',
      ],
      negativeImpacts: [
        'Churn rate higher than projected at 8% vs 5%',
        'Upsell conversion lower than expected at 12% vs 20%',
      ],
      reasons: {
        positive: [
          'Enterprise features attracted larger customers',
          'Annual payment discount drove higher commitment',
          'Market timing favorable for budget allocation',
        ],
        negative: [
          'Product gaps for mid-market segment causing churn',
          'Sales team needs better training on upsell strategies',
          'Lack of usage analytics to identify upsell opportunities',
        ],
      },
      recommendations: [
        'Develop mid-market retention program',
        'Implement customer success automation',
        'Train sales team on consultative selling',
        'Build product analytics dashboard for customers',
      ],
      lastUpdated: '5 hours ago',
    },
    {
      id: '3',
      title: 'Product Feature Delivery',
      category: 'Development',
      status: 'below',
      plannedValue: '15 features',
      actualValue: '11 features',
      variance: -26.7,
      positiveImpacts: [
        'Quality of delivered features higher than typical releases',
        'Zero critical bugs in production for delivered features',
        'User satisfaction scores increased by 15 points',
      ],
      negativeImpacts: [
        'Delivered 4 fewer features than planned (73% of target)',
        'Timeline slipped by 3 weeks on average per feature',
        'Engineering team morale impacted by perceived underdelivery',
        'Sales team handicapped without promised integration features',
      ],
      reasons: {
        positive: [
          'Increased focus on testing and quality assurance',
          'Better architectural decisions reducing technical debt',
          'Improved code review process catching issues early',
        ],
        negative: [
          'Original estimates too optimistic, lacked buffer for unknowns',
          'Two senior developers left mid-quarter',
          'Underestimated complexity of third-party integrations',
          'Scope creep on 3 major features added 30% more work',
        ],
      },
      recommendations: [
        'Revise estimation process to include 25% buffer',
        'Fast-track hiring to backfill senior positions',
        'Implement stricter scope management and change control',
        'Break down large features into smaller deliverables',
        'Increase collaboration between product and engineering',
      ],
      lastUpdated: '1 day ago',
    },
    {
      id: '4',
      title: 'Team Growth Target',
      category: 'HR',
      status: 'below',
      plannedValue: '10 new hires',
      actualValue: '7 new hires',
      variance: -30,
      positiveImpacts: [
        'Quality of hires better than previous quarters',
        'All hired candidates still with company (0% turnover)',
        'New team members ramped up 40% faster',
      ],
      negativeImpacts: [
        'Missed hiring target by 30%',
        'Key leadership role still vacant after 4 months',
        'Existing team experiencing burnout from higher workload',
      ],
      reasons: {
        positive: [
          'More rigorous screening process',
          'Improved onboarding program',
          'Better job descriptions attracting right candidates',
        ],
        negative: [
          'Competitive market with salary expectations 20% higher',
          'Company brand recognition still developing',
          'Interview process taking too long (average 6 weeks)',
          'Limited HR bandwidth for recruitment',
        ],
      },
      recommendations: [
        'Revise compensation packages to market rate',
        'Partner with specialized recruiters for hard-to-fill roles',
        'Streamline interview process to 3 weeks maximum',
        'Invest in employer branding and content marketing',
      ],
      lastUpdated: '3 hours ago',
    },
    {
      id: '5',
      title: 'Customer Satisfaction Score',
      category: 'Product',
      status: 'exceeded',
      plannedValue: 'NPS 40',
      actualValue: 'NPS 58',
      variance: 45,
      positiveImpacts: [
        'NPS score exceeded target by 45% (58 vs 40)',
        'Customer testimonials increased 3x',
        'Word-of-mouth referrals driving 35% of new business',
        '92% of customers would recommend us',
      ],
      negativeImpacts: [
        'Detractor feedback not systematically addressed',
        'Response time to feedback averaging 48 hours',
      ],
      reasons: {
        positive: [
          'Product reliability improved significantly',
          'Customer support team highly responsive and helpful',
          'Regular feature updates based on user feedback',
          'Strong community engagement and user education',
        ],
        negative: [
          'No formal process for closing feedback loop',
          'Support team sometimes lacking product knowledge',
        ],
      },
      recommendations: [
        'Implement closed-loop feedback system',
        'Create dedicated customer success team',
        'Develop comprehensive product training for support',
        'Launch customer advisory board',
      ],
      lastUpdated: '30 minutes ago',
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'exceeded':
        return 'text-green-600 bg-green-100';
      case 'met':
        return 'text-blue-600 bg-blue-100';
      case 'below':
        return 'text-orange-600 bg-orange-100';
      case 'failed':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'exceeded':
        return <TrendingUp className="w-5 h-5 text-green-600" />;
      case 'met':
        return <CheckCircle className="w-5 h-5 text-blue-600" />;
      case 'below':
        return <TrendingDown className="w-5 h-5 text-orange-600" />;
      case 'failed':
        return <XCircle className="w-5 h-5 text-red-600" />;
      default:
        return <Target className="w-5 h-5 text-gray-600" />;
    }
  };

  const getVarianceDisplay = (variance: number) => {
    const color = variance >= 0 ? 'text-green-600' : 'text-red-600';
    const icon = variance >= 0 ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />;
    return (
      <div className={`flex items-center gap-1 ${color}`}>
        {icon}
        <span className="text-sm">{variance > 0 ? '+' : ''}{variance.toFixed(1)}%</span>
      </div>
    );
  };

  const handleOutcomeClick = (outcome: OutcomeTask) => {
    setSelectedOutcome(outcome);
    setShowDetailDialog(true);
  };

  // Calculate overall metrics
  const totalOutcomes = outcomes.length;
  const exceededCount = outcomes.filter(o => o.status === 'exceeded').length;
  const metCount = outcomes.filter(o => o.status === 'met').length;
  const belowCount = outcomes.filter(o => o.status === 'below').length;
  const overallSuccess = ((exceededCount + metCount) / totalOutcomes) * 100;

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-gray-900 mb-2">Outcomes & Results</h1>
        <p className="text-gray-600">Track and analyze the results of your implementation for: {idea.summary}</p>
      </div>

      {/* Overall Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">Overall Success</span>
              <Target className="w-5 h-5 text-blue-600" />
            </div>
            <div className="text-2xl text-gray-900 mb-1">{overallSuccess.toFixed(0)}%</div>
            <Progress value={overallSuccess} className="h-2" />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">Exceeded</span>
              <TrendingUp className="w-5 h-5 text-green-600" />
            </div>
            <div className="text-2xl text-green-600">{exceededCount}</div>
            <p className="text-xs text-gray-500">targets surpassed</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">Met Target</span>
              <CheckCircle className="w-5 h-5 text-blue-600" />
            </div>
            <div className="text-2xl text-blue-600">{metCount}</div>
            <p className="text-xs text-gray-500">goals achieved</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">Needs Attention</span>
              <AlertTriangle className="w-5 h-5 text-orange-600" />
            </div>
            <div className="text-2xl text-orange-600">{belowCount}</div>
            <p className="text-xs text-gray-500">below target</p>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Outcomes */}
      <div>
        <h2 className="text-gray-900 mb-4">Detailed Results</h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {outcomes.map((outcome) => (
          <Card 
            key={outcome.id}
            className="hover:shadow-lg transition-all cursor-pointer border-l-4"
            style={{
              borderLeftColor: 
                outcome.status === 'exceeded' ? '#16a34a' :
                outcome.status === 'met' ? '#2563eb' :
                outcome.status === 'below' ? '#ea580c' : '#dc2626'
            }}
            onClick={() => handleOutcomeClick(outcome)}
          >
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    {getStatusIcon(outcome.status)}
                    <CardTitle className="text-lg">{outcome.title}</CardTitle>
                    <Badge variant="outline">{outcome.category}</Badge>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-6 mt-4">
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Planned</p>
                      <p className="text-sm text-gray-900">{outcome.plannedValue}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Actual</p>
                      <p className="text-sm text-gray-900">{outcome.actualValue}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Variance</p>
                      {getVarianceDisplay(outcome.variance)}
                    </div>
                  </div>
                </div>

                <Badge className={`${getStatusColor(outcome.status)} px-3 py-1`}>
                  {outcome.status.toUpperCase()}
                </Badge>
              </div>
            </CardHeader>

            <CardContent>
              {/* Quick Impact Summary */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="bg-green-50 p-3 rounded-lg border border-green-200">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span className="text-xs text-green-800">Positive Impacts</span>
                  </div>
                  <p className="text-sm text-green-900">{outcome.positiveImpacts.length} highlights</p>
                </div>

                <div className="bg-orange-50 p-3 rounded-lg border border-orange-200">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle className="w-4 h-4 text-orange-600" />
                    <span className="text-xs text-orange-800">Challenges</span>
                  </div>
                  <p className="text-sm text-orange-900">{outcome.negativeImpacts.length} areas to improve</p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t">
                <p className="text-xs text-gray-500">Updated {outcome.lastUpdated}</p>
                <div onClick={(e) => e.stopPropagation()} className="flex gap-2">
                  <FeedbackButton itemId={outcome.id} itemType="outcome" />
                  <NotesButton itemId={outcome.id} itemType="outcome" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
        </div>
      </div>

      {/* Detail Dialog */}
      {selectedOutcome && (
        <OutcomeDetailDialog
          isOpen={showDetailDialog}
          onClose={() => {
            setShowDetailDialog(false);
            setSelectedOutcome(null);
          }}
          outcome={selectedOutcome}
        />
      )}

      {/* Separator */}
      <Separator className="my-12" />

      {/* Previous Ideas Journey Section */}
      <div className="mt-12">
        <div className="flex items-center gap-3 mb-6">
          <History className="w-6 h-6 text-blue-600" />
          <h2 className="text-gray-900">Previous Ideas Journey</h2>
        </div>
        <p className="text-gray-600 mb-6">
          Explore the complete journey of your previous ideas from inception to outcome, with detailed analysis at each stage.
        </p>

        <div className="space-y-6">
          {previousJourneys.map((journey) => (
            <IdeaJourneyTimeline key={journey.id} journey={journey} />
          ))}
        </div>
      </div>
    </div>
  );
}
