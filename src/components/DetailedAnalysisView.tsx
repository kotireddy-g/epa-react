import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { 
  Lightbulb, Target, TrendingUp, DollarSign, Users, 
  MapPin, Clock, Rocket, CheckCircle, BarChart3, Trophy, Package
} from 'lucide-react';
import { FinalOutput } from '../services/ideaAnalysisApi';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';

interface DetailedAnalysisViewProps {
  data: FinalOutput;
  additionalInfo?: any; // Additional information from API (dynamic structure)
}

// Colors for budget bifurcation pie chart
const BUDGET_COLORS = [
  '#10b981', // green
  '#3b82f6', // blue
  '#f59e0b', // amber
  '#8b5cf6', // purple
  '#ef4444', // red
  '#06b6d4', // cyan
  '#ec4899', // pink
  '#84cc16', // lime
];

export function DetailedAnalysisView({ data, additionalInfo }: DetailedAnalysisViewProps) {
  const { 
    key_points_summary, 
    market_attributes,
    stats_summary,
    population_access_table,
    budget_fit_tiers_table,
    technology_development_strategy_table,
    gtm_customer_strategy_table,
    competitor_gap_table,
    market_product_fit_table,
    budget_bifurcation_percent,
    real_time_stats,
    verdict
  } = data;
  
  // Extract additional information if available
  const extraFields = additionalInfo?.extra_fields || {};

  return (
    <div className="space-y-6">
      {/* Success Banner */}
      <Card className="border-green-200 bg-green-50">
        <CardContent className="pt-6">
          <div className="flex items-center space-x-3">
            <CheckCircle className="w-6 h-6 text-green-600" />
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-green-900">
                Great match! Your idea is ready for detailed description.
              </h3>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Key Points Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Lightbulb className="w-5 h-5 text-blue-600" />
            <span>Key Points Summary</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {key_points_summary && (
            <>
              {/* DYNAMIC RENDERING - handles any field names from API */}
              {Object.entries(key_points_summary).map(([key, value]) => {
                // Map field names to icons and labels
                const fieldConfig: Record<string, { icon: any; label: string }> = {
                  core_concept: { icon: Lightbulb, label: 'Core Concept' },
                  coreConcept: { icon: Lightbulb, label: 'Core Concept' },
                  target_market: { icon: Target, label: 'Target Market' },
                  targetMarket: { icon: Target, label: 'Target Market' },
                  unique_value_proposition: { icon: Rocket, label: 'Unique Value Proposition' },
                  valueProposition: { icon: Rocket, label: 'Value Proposition' },
                  revenue_model: { icon: DollarSign, label: 'Revenue Model' },
                  revenueModel: { icon: DollarSign, label: 'Revenue Model' },
                  competitive_advantage: { icon: Trophy, label: 'Competitive Advantages' },
                  competitiveAdvantages: { icon: Trophy, label: 'Competitive Advantages' },
                  growth_potential: { icon: TrendingUp, label: 'Growth Potential' },
                  growthPotential: { icon: TrendingUp, label: 'Growth Potential' },
                  implementation_timeline: { icon: Clock, label: 'Implementation Timeline' },
                  implementationTimeline: { icon: Clock, label: 'Implementation Timeline' },
                };
                
                const config = fieldConfig[key] || { 
                  icon: Lightbulb, 
                  label: key.replace(/_/g, ' ').replace(/([A-Z])/g, ' $1').trim()
                    .split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
                };
                
                return (
                  <KeyPointItem 
                    key={key}
                    icon={config.icon} 
                    label={config.label} 
                    value={String(value || 'Not specified')} 
                  />
                );
              })}
            </>
          )}
        </CardContent>
      </Card>

      {/* Market Attributes */}
      {market_attributes && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <BarChart3 className="w-5 h-5 text-purple-600" />
              <span>Market Attributes</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {/* DYNAMIC RENDERING - handles any field names from API */}
              {Object.entries(market_attributes).map(([key, value]) => {
                const iconMap: Record<string, any> = {
                  category: Target,
                  domain: Package,
                  industry: Users,
                  budget: DollarSign,
                  location: MapPin,
                  timeline: Clock,
                  scalability: Rocket,
                  validation: CheckCircle,
                  metrics: BarChart3,
                };
                
                const icon = iconMap[key] || Target;
                const label = key.replace(/_/g, ' ').replace(/([A-Z])/g, ' $1').trim()
                  .split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
                
                return (
                  <AttributeBadge 
                    key={key}
                    icon={icon} 
                    label={label} 
                    value={String(value || 'Not specified')} 
                  />
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Stats Summary */}
      {stats_summary && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="w-5 h-5 text-green-600" />
              <span>Market Statistics</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* DYNAMIC RENDERING - handles any field names from API */}
              {Object.entries(stats_summary)
                .filter(([key]) => key !== 'price_bands') // price_bands handled separately below
                .map(([key, value], index) => {
                  // Map known fields to friendly labels
                  const labelMap: Record<string, string> = {
                    TAM: 'Total Addressable Market (TAM)',
                    SAM: 'Serviceable Available Market (SAM)',
                    SOM: 'Serviceable Obtainable Market (SOM)',
                    CAGR: 'CAGR',
                    adoption_curves: 'Adoption Curve',
                    adoptionCurves: 'Adoption Curve',
                  };
                  
                  const label = labelMap[key] || key.replace(/_/g, ' ').replace(/([A-Z])/g, ' $1').trim()
                    .split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
                  
                  // Cycle through colors
                  const colors = ['blue', 'purple', 'green', 'orange', 'pink', 'indigo', 'red', 'yellow'];
                  const color = colors[index % colors.length];
                  
                  return (
                    <StatCard key={key} label={label} value={String(value || '-')} color={color} />
                  );
                })}
            </div>

            {/* Pie Chart for TAM, SAM, SOM */}
            {(stats_summary.TAM || stats_summary.SAM || stats_summary.SOM) && (
              <div className="mt-6">
                <h4 className="font-semibold mb-3">Market Size Distribution</h4>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={[
                        { name: 'TAM', value: parseFloat(String(stats_summary.TAM || '0').replace(/[^0-9.]/g, '')) || 100000 },
                        { name: 'SAM', value: parseFloat(String(stats_summary.SAM || '0').replace(/[^0-9.]/g, '')) || 20000 },
                        { name: 'SOM', value: parseFloat(String(stats_summary.SOM || '0').replace(/[^0-9.]/g, '')) || 2000 },
                      ]}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      <Cell fill="#3b82f6" />
                      <Cell fill="#8b5cf6" />
                      <Cell fill="#10b981" />
                    </Pie>
                    <Tooltip formatter={(value: any) => `₹${value} Crores`} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            )}
            
            {stats_summary.price_bands && (
              <div className="mt-6">
                <h4 className="font-semibold mb-3">Price Bands</h4>
                <div className="grid grid-cols-3 gap-3">
                  {/* DYNAMIC RENDERING - handles any field names from API */}
                  {Object.entries(stats_summary.price_bands).map(([key, value]) => {
                    const label = key.replace(/_/g, ' ').replace(/([A-Z])/g, ' $1').trim()
                      .split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
                    return (
                      <PriceBand key={key} label={label} value={String(value || '-')} />
                    );
                  })}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Population Access Table */}
      {population_access_table && population_access_table.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Users className="w-5 h-5 text-indigo-600" />
              <span>Population & Access Analysis</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    {/* DYNAMIC HEADERS - automatically generated from first row */}
                    {Object.keys(population_access_table[0] || {}).map((key) => (
                      <th key={key} className="px-4 py-3 text-left font-semibold">
                        {key.replace(/_/g, ' ').replace(/([A-Z])/g, ' $1').trim()
                          .split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {population_access_table.map((row: any, idx: number) => (
                    <tr key={idx} className="hover:bg-gray-50">
                      {/* DYNAMIC CELLS - render all values */}
                      {Object.entries(row).map(([key, value]: [string, any]) => (
                        <td key={key} className="px-4 py-3">
                          {typeof value === 'number' && key.includes('ratio') ? (
                            <Badge variant="outline">{(value * 100).toFixed(0)}%</Badge>
                          ) : typeof value === 'number' ? (
                            value.toLocaleString()
                          ) : (
                            String(value || '-')
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Budget Fit Tiers */}
      {budget_fit_tiers_table && budget_fit_tiers_table.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <DollarSign className="w-5 h-5 text-green-600" />
              <span>Budget Fit Analysis</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {budget_fit_tiers_table.map((tier: any, idx: number) => (
                <div key={idx} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-lg font-semibold">
                      {tier.tier ? tier.tier.charAt(0).toUpperCase() + tier.tier.slice(1) : ''} Tier
                    </h4>
                    <Badge className="text-lg">{tier.cap}</Badge>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm">
                    <InfoItem label="Fit" value={tier.fit} />
                    <InfoItem label="Approach" value={tier.approach} />
                    <InfoItem label="Scope" value={tier.scope} />
                    <InfoItem label="Team Size" value={tier.team} />
                    <InfoItem label="Infrastructure" value={tier.infra} />
                    <InfoItem label="Compliance" value={tier.compliance} />
                    <InfoItem label="Metrics" value={tier.metrics} />
                    <InfoItem label="Risks" value={tier.risks} />
                  </div>
                  {tier.notes && (
                    <p className="mt-3 text-sm text-gray-600 italic">{tier.notes}</p>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Technology Development Strategy */}
      {technology_development_strategy_table && technology_development_strategy_table.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Rocket className="w-5 h-5 text-blue-600" />
              <span>Technology Development Strategy</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* DYNAMIC RENDERING - handles any fields */}
              {technology_development_strategy_table.map((item: any, idx: number) => (
                <div key={idx} className="border-l-4 border-blue-500 pl-4 py-2">
                  <div className="flex items-center space-x-2 mb-2">
                    {item.month && <Badge>Month {item.month}</Badge>}
                    <h4 className="font-semibold">{item.deliverables || item.title || `Item ${idx + 1}`}</h4>
                  </div>
                  <div className="space-y-2 text-sm">
                    {/* Dynamically render all fields except month and deliverables */}
                    {Object.entries(item).map(([key, value]) => {
                      if (key === 'month' || key === 'deliverables' || key === 'title') return null;
                      const label = key.replace(/_/g, ' ').replace(/([A-Z])/g, ' $1').trim()
                        .split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
                      const colorClass = key.includes('risk') ? 'text-red-600' : 
                                        key.includes('mitigation') ? 'text-green-600' : '';
                      return (
                        <p key={key} className={colorClass}>
                          <span className="font-medium">{label}:</span> {String(value || '-')}
                        </p>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* GTM & Customer Strategy */}
      {gtm_customer_strategy_table && gtm_customer_strategy_table.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Target className="w-5 h-5 text-purple-600" />
              <span>Go-To-Market & Customer Strategy</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* DYNAMIC RENDERING - handles any fields */}
              {gtm_customer_strategy_table.map((strategy: any, idx: number) => (
                <div key={idx} className="bg-purple-50 rounded-lg p-4">
                  <h4 className="font-semibold mb-3">Strategy {idx + 1}</h4>
                  <div className="space-y-2 text-sm">
                    {/* Dynamically render all fields */}
                    {Object.entries(strategy).map(([key, value]) => {
                      const label = key.replace(/_/g, ' ').replace(/([A-Z])/g, ' $1').trim()
                        .split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
                      return (
                        <p key={key}>
                          <span className="font-medium">{label}:</span> {String(value || '-')}
                        </p>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Competitor Gap Analysis */}
      {competitor_gap_table && competitor_gap_table.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Trophy className="w-5 h-5 text-yellow-600" />
              <span>Competitive Gap Analysis</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    {/* DYNAMIC HEADERS */}
                    {Object.keys(competitor_gap_table[0] || {}).map((key) => (
                      <th key={key} className="px-4 py-3 text-left font-semibold">
                        {key.replace(/_/g, ' ').replace(/([A-Z])/g, ' $1').trim()
                          .split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {competitor_gap_table.map((row: any, idx: number) => (
                    <tr key={idx} className="hover:bg-gray-50">
                      {/* DYNAMIC CELLS */}
                      {Object.entries(row).map(([key, value]: [string, any], cellIdx) => (
                        <td key={key} className={`px-4 py-3 ${cellIdx === 0 ? 'font-medium' : ''}`}>
                          {String(value || '-')}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Bar Chart for Competitor Gaps */}
            <div className="mt-6">
              <h4 className="font-semibold mb-3">Competitive Advantage Visualization</h4>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={competitor_gap_table.map((item: any) => ({
                  name: item.competitor || item.name || 'Competitor',
                  gap: item.gap?.length || 10,
                  differentiator: item.differentiator?.length || 10,
                }))}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="gap" fill="#f59e0b" name="Gap Identified" />
                  <Bar dataKey="differentiator" fill="#10b981" name="Our Differentiator" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Market Product Fit */}
      {market_product_fit_table && market_product_fit_table.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <span>Market-Product Fit</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    {/* DYNAMIC HEADERS */}
                    {Object.keys(market_product_fit_table[0] || {}).map((key) => (
                      <th key={key} className="px-4 py-3 text-left font-semibold">
                        {key.replace(/_/g, ' ').replace(/([A-Z])/g, ' $1').trim()
                          .split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {market_product_fit_table.map((row: any, idx: number) => (
                    <tr key={idx} className="hover:bg-gray-50">
                      {/* DYNAMIC CELLS */}
                      {Object.entries(row).map(([key, value]: [string, any], cellIdx) => (
                        <td key={key} className={`px-4 py-3 ${cellIdx === 0 ? 'font-medium' : ''}`}>
                          {String(value || '-')}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Budget Bifurcation Chart */}
      {budget_bifurcation_percent && Object.keys(budget_bifurcation_percent).length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <DollarSign className="w-5 h-5 text-green-600" />
              <span>Budget Bifurcation</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Pie Chart */}
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={Object.entries(budget_bifurcation_percent).map(([key, value]) => ({
                        name: key.replace(/_percent$/, '').replace(/_/g, ' ').split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
                        value: Number(value) || 0,
                        percentage: Number(value) || 0
                      }))}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percentage }) => `${name}: ${percentage}%`}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {Object.keys(budget_bifurcation_percent).map((_, index) => (
                        <Cell key={`cell-${index}`} fill={BUDGET_COLORS[index % BUDGET_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value: any) => `${value}%`} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* Budget Breakdown List */}
              <div className="space-y-3">
                <h4 className="font-semibold text-gray-900 mb-4">Budget Allocation</h4>
                {Object.entries(budget_bifurcation_percent).map(([key, value], index) => {
                  const label = key.replace(/_percent$/, '').replace(/_/g, ' ').split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
                  return (
                    <div key={key} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div 
                          className="w-4 h-4 rounded" 
                          style={{ backgroundColor: BUDGET_COLORS[index % BUDGET_COLORS.length] }}
                        />
                        <span className="text-sm font-medium text-gray-700">{label}</span>
                      </div>
                      <span className="text-sm font-bold text-gray-900">{String(value)}%</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Real-time Stats */}
      {real_time_stats && real_time_stats.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="w-5 h-5 text-orange-600" />
              <span>Real-time Market Statistics</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {real_time_stats.map((stat: any, index: number) => (
                <div key={index} className="p-4 bg-gradient-to-br from-orange-50 to-yellow-50 rounded-lg border border-orange-200">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="text-sm font-semibold text-gray-900">{stat.stat_name}</h4>
                    <TrendingUp className="w-4 h-4 text-orange-600" />
                  </div>
                  <p className="text-2xl font-bold text-orange-700 mb-1">
                    {typeof stat.value === 'number' && stat.value > 1000000 
                      ? `₹${(stat.value / 10000000).toFixed(2)} Cr`
                      : stat.value
                    }
                    {stat.unit === 'percent' && '%'}
                  </p>
                  {stat.source_domain && (
                    <p className="text-xs text-gray-500 mt-2">
                      Source: {stat.source_domain}
                    </p>
                  )}
                  {stat.observed_on && (
                    <p className="text-xs text-gray-400 mt-1">
                      As of: {new Date(stat.observed_on).toLocaleDateString()}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* References moved to right sidebar */}

      {/* Verdict - Dynamic rendering */}
      {verdict && (
        <Card className="border-blue-200 bg-gradient-to-br from-blue-50 to-purple-50">
          <CardContent className="pt-6">
            <div className="space-y-3">
              {verdict.label && (
                <Badge className="mb-2 bg-blue-600 text-white">
                  {verdict.label}
                </Badge>
              )}
              {verdict.text && (
                <h3 className="text-xl font-bold text-blue-900">{verdict.text}</h3>
              )}
              {verdict.rationale && (
                <p className="text-gray-700">{verdict.rationale}</p>
              )}
              {verdict.sub_text && (
                <p className="text-gray-700">{verdict.sub_text}</p>
              )}
              {verdict.tip && (
                <div className="bg-white rounded-lg p-4 border-l-4 border-blue-500 mt-4">
                  <p className="text-sm font-medium text-blue-900">💡 Pro Tip: {verdict.tip}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Additional Information from API - Dynamic rendering */}
      {extraFields && Object.keys(extraFields).length > 0 && (
        <AdditionalInformationSection data={extraFields} />
      )}
    </div>
  );
}

// Helper Components
function KeyPointItem({ icon: Icon, label, value }: { icon: any, label: string, value: string }) {
  return (
    <div className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
      <Icon className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-900">{label}</p>
        <p className="text-sm text-gray-600 mt-1">{value}</p>
      </div>
    </div>
  );
}

function AttributeBadge({ icon: Icon, label, value }: { icon: any, label: string, value: string }) {
  return (
    <div className="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg">
      <Icon className="w-4 h-4 text-purple-600 flex-shrink-0" />
      <div className="min-w-0 flex-1">
        <p className="text-xs text-gray-500">{label}</p>
        <p className="text-sm font-medium text-gray-900 truncate" title={value}>{value}</p>
      </div>
    </div>
  );
}

function StatCard({ label, value, color }: { label: string, value: string, color: string }) {
  const colorClasses: Record<string, string> = {
    blue: 'bg-blue-50 text-blue-700 border-blue-200',
    purple: 'bg-purple-50 text-purple-700 border-purple-200',
    green: 'bg-green-50 text-green-700 border-green-200',
    orange: 'bg-orange-50 text-orange-700 border-orange-200',
    pink: 'bg-pink-50 text-pink-700 border-pink-200',
  };

  return (
    <div className={`p-4 rounded-lg border ${colorClasses[color] || colorClasses.blue}`}>
      <p className="text-xs font-medium opacity-75 mb-1">{label}</p>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  );
}

function PriceBand({ label, value }: { label: string, value: string }) {
  return (
    <div className="bg-gray-50 p-3 rounded-lg text-center">
      <p className="text-xs text-gray-500 mb-1">{label}</p>
      <p className="text-sm font-semibold text-gray-900">{value}</p>
    </div>
  );
}

function InfoItem({ label, value }: { label: string, value: string }) {
  return (
    <div>
      <p className="text-xs text-gray-500">{label}</p>
      <p className="text-sm font-medium text-gray-900">{value}</p>
    </div>
  );
}

// Additional Information Section - Dynamically renders all extra fields from API
function AdditionalInformationSection({ data }: { data: any }) {
  if (!data || Object.keys(data).length === 0) return null;

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">📊 Detailed Analysis</h2>
      
      {/* Executive Summary */}
      {data.executive_summary && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-blue-600" />
              Executive Summary
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {data.executive_summary.idea_title && (
              <div>
                <p className="text-sm font-semibold text-gray-700">Idea Title</p>
                <p className="text-lg font-bold text-gray-900">{data.executive_summary.idea_title}</p>
              </div>
            )}
            {data.executive_summary.one_line_pitch && (
              <div className="p-4 bg-blue-50 rounded-lg border-l-4 border-blue-500">
                <p className="text-gray-900">{data.executive_summary.one_line_pitch}</p>
              </div>
            )}
            {data.executive_summary.viability_score !== undefined && (
              <div className="flex items-center gap-4">
                <div>
                  <p className="text-sm text-gray-600">Viability Score</p>
                  <p className="text-3xl font-bold text-blue-600">{data.executive_summary.viability_score}%</p>
                </div>
                {data.executive_summary.viability_label && (
                  <Badge className="bg-blue-600 text-white">{data.executive_summary.viability_label}</Badge>
                )}
              </div>
            )}
            
            {data.executive_summary.key_strengths && data.executive_summary.key_strengths.length > 0 && (
              <div>
                <p className="text-sm font-semibold text-gray-700 mb-2">✅ Key Strengths</p>
                <ul className="space-y-2">
                  {data.executive_summary.key_strengths.map((strength: string, idx: number) => (
                    <li key={idx} className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-gray-700">{strength}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            
            {data.executive_summary.key_risks && data.executive_summary.key_risks.length > 0 && (
              <div>
                <p className="text-sm font-semibold text-gray-700 mb-2">⚠️ Key Risks</p>
                <ul className="space-y-2">
                  {data.executive_summary.key_risks.map((risk: string, idx: number) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-red-600 mt-0.5">•</span>
                      <span className="text-sm text-gray-700">{risk}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            
            {data.executive_summary.critical_assumptions && data.executive_summary.critical_assumptions.length > 0 && (
              <div>
                <p className="text-sm font-semibold text-gray-700 mb-2">🎯 Critical Assumptions</p>
                <ul className="space-y-2">
                  {data.executive_summary.critical_assumptions.map((assumption: string, idx: number) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-blue-600 mt-0.5">→</span>
                      <span className="text-sm text-gray-700">{assumption}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Market Analysis */}
      {data.market_analysis && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-purple-600" />
              Market Analysis
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Market Size India */}
            {data.market_analysis.market_size_india && (
              <div className="p-3 bg-purple-50 rounded-lg">
                <p className="text-xs text-purple-900 font-semibold">Market Size (India)</p>
                <p className="text-sm text-gray-900 mt-1">{data.market_analysis.market_size_india}</p>
              </div>
            )}
            
            {/* Market Size Local */}
            {data.market_analysis.market_size_local && (
              <div className="p-3 bg-blue-50 rounded-lg">
                <p className="text-xs text-blue-900 font-semibold">Local Market Size</p>
                <p className="text-sm text-gray-900 mt-1">{data.market_analysis.market_size_local}</p>
              </div>
            )}
            
            {/* Target Segment */}
            {data.market_analysis.target_segment && (
              <div className="p-3 bg-green-50 rounded-lg">
                <p className="text-xs text-green-900 font-semibold">Target Segment</p>
                <p className="text-sm text-gray-900 mt-1">{data.market_analysis.target_segment}</p>
              </div>
            )}
            
            {/* Competition Landscape */}
            {data.market_analysis.competition_landscape && (
              <div className="p-3 bg-orange-50 rounded-lg">
                <p className="text-xs text-orange-900 font-semibold">Competition Landscape</p>
                <p className="text-sm text-gray-900 mt-1">{data.market_analysis.competition_landscape}</p>
              </div>
            )}
            
            {/* Market Trends */}
            {data.market_analysis.market_trends && data.market_analysis.market_trends.length > 0 && (
              <div>
                <p className="text-sm font-semibold text-gray-700 mb-2">📈 Market Trends</p>
                <ul className="space-y-2">
                  {data.market_analysis.market_trends.map((trend: string, idx: number) => (
                    <li key={idx} className="flex items-start gap-2 p-2 bg-gray-50 rounded">
                      <span className="text-purple-600 mt-0.5">→</span>
                      <span className="text-sm text-gray-700">{trend}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            
            {/* Regulatory Requirements */}
            {data.market_analysis.regulatory_requirements && data.market_analysis.regulatory_requirements.length > 0 && (
              <div>
                <p className="text-sm font-semibold text-gray-700 mb-2">📋 Regulatory Requirements</p>
                <ul className="space-y-2">
                  {data.market_analysis.regulatory_requirements.map((req: string, idx: number) => (
                    <li key={idx} className="flex items-start gap-2 p-2 bg-yellow-50 rounded border-l-2 border-yellow-400">
                      <span className="text-yellow-700 mt-0.5">⚠</span>
                      <span className="text-sm text-gray-700">{req}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            
            {/* Market Gap (old format) */}
            {data.market_analysis.market_gap && (
              <div className="p-4 bg-purple-50 rounded-lg">
                <p className="text-sm font-semibold text-purple-900 mb-1">Market Gap Identified</p>
                <p className="text-sm text-gray-700">{data.market_analysis.market_gap}</p>
              </div>
            )}
            
            {/* Target Audience (old format) */}
            {data.market_analysis.target_audience && (
              <div className="space-y-2">
                <p className="text-sm font-semibold text-gray-700">Target Audience</p>
                {data.market_analysis.target_audience.primary_persona && (
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-xs text-gray-600">Primary Persona</p>
                    <p className="text-sm text-gray-900">{data.market_analysis.target_audience.primary_persona}</p>
                  </div>
                )}
                {data.market_analysis.target_audience.geographic_focus && (
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-xs text-gray-600">Geographic Focus</p>
                    <p className="text-sm text-gray-900">{data.market_analysis.target_audience.geographic_focus}</p>
                  </div>
                )}
              </div>
            )}
            
            {/* References */}
            {data.market_analysis.references && (
              <div className="space-y-3 mt-4">
                <p className="text-sm font-semibold text-gray-700">📚 References & Resources</p>
                
                {/* Videos */}
                {data.market_analysis.references.videos && data.market_analysis.references.videos.length > 0 && (
                  <div>
                    <p className="text-xs text-gray-600 mb-2">🎥 Videos</p>
                    <div className="space-y-1">
                      {data.market_analysis.references.videos.map((video: any, idx: number) => (
                        <a key={idx} href={video.link} target="_blank" rel="noopener noreferrer" 
                           className="block p-2 bg-gray-50 rounded hover:bg-gray-100 transition">
                          <p className="text-sm text-blue-600 hover:underline">{video.title}</p>
                          <p className="text-xs text-gray-500">{video.author}</p>
                        </a>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Articles */}
                {data.market_analysis.references.articles && data.market_analysis.references.articles.length > 0 && (
                  <div>
                    <p className="text-xs text-gray-600 mb-2">📄 Articles</p>
                    <div className="space-y-1">
                      {data.market_analysis.references.articles.map((article: any, idx: number) => (
                        <a key={idx} href={article.link} target="_blank" rel="noopener noreferrer"
                           className="block p-2 bg-gray-50 rounded hover:bg-gray-100 transition">
                          <p className="text-sm text-blue-600 hover:underline">{article.title}</p>
                          <p className="text-xs text-gray-500">{article.author}</p>
                        </a>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Case Studies */}
                {data.market_analysis.references.case_studies && data.market_analysis.references.case_studies.length > 0 && (
                  <div>
                    <p className="text-xs text-gray-600 mb-2">📊 Case Studies</p>
                    <div className="space-y-1">
                      {data.market_analysis.references.case_studies.map((study: any, idx: number) => (
                        <a key={idx} href={study.link} target="_blank" rel="noopener noreferrer"
                           className="block p-2 bg-gray-50 rounded hover:bg-gray-100 transition">
                          <p className="text-sm text-blue-600 hover:underline">{study.title}</p>
                          <p className="text-xs text-gray-500">{study.author}</p>
                        </a>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Success Stories */}
                {data.market_analysis.references.success_stories && data.market_analysis.references.success_stories.length > 0 && (
                  <div>
                    <p className="text-xs text-gray-600 mb-2">✅ Success Stories</p>
                    <div className="space-y-1">
                      {data.market_analysis.references.success_stories.map((story: any, idx: number) => (
                        <a key={idx} href={story.link} target="_blank" rel="noopener noreferrer"
                           className="block p-2 bg-green-50 rounded hover:bg-green-100 transition">
                          <p className="text-sm text-green-700 hover:underline">{story.title}</p>
                          <p className="text-xs text-gray-500">{story.author}</p>
                        </a>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Failure Stories */}
                {data.market_analysis.references.failure_stories && data.market_analysis.references.failure_stories.length > 0 && (
                  <div>
                    <p className="text-xs text-gray-600 mb-2">⚠️ Failure Stories & Lessons</p>
                    <div className="space-y-1">
                      {data.market_analysis.references.failure_stories.map((story: any, idx: number) => (
                        <a key={idx} href={story.link} target="_blank" rel="noopener noreferrer"
                           className="block p-2 bg-red-50 rounded hover:bg-red-100 transition">
                          <p className="text-sm text-red-700 hover:underline">{story.title}</p>
                          <p className="text-xs text-gray-500">{story.author}</p>
                        </a>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Vendors */}
                {data.market_analysis.references.vendors && data.market_analysis.references.vendors.length > 0 && (
                  <div>
                    <p className="text-xs text-gray-600 mb-2">🏪 Vendors & Suppliers</p>
                    <div className="space-y-1">
                      {data.market_analysis.references.vendors.map((vendor: any, idx: number) => (
                        <a key={idx} href={vendor.link} target="_blank" rel="noopener noreferrer"
                           className="block p-2 bg-gray-50 rounded hover:bg-gray-100 transition">
                          <p className="text-sm text-blue-600 hover:underline">{vendor.title}</p>
                          <p className="text-xs text-gray-500">{vendor.author}</p>
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Financial Feasibility */}
      {data.financial_feasibility && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-green-600" />
              Financial Feasibility
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {data.financial_feasibility.total_initial_investment_inr && (
              <div className="p-4 bg-green-50 rounded-lg">
                <p className="text-sm text-gray-600">Total Initial Investment</p>
                <p className="text-2xl font-bold text-green-700">₹{(data.financial_feasibility.total_initial_investment_inr / 100000).toFixed(1)}L</p>
              </div>
            )}
            
            {data.financial_feasibility.initial_investment_breakdown && (
              <div>
                <p className="text-sm font-semibold text-gray-700 mb-3">Investment Breakdown</p>
                <div className="space-y-2">
                  {data.financial_feasibility.initial_investment_breakdown.map((item: any, idx: number) => (
                    <div key={idx} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                      <span className="text-sm text-gray-700">{item.category}</span>
                      <span className="text-sm font-semibold text-gray-900">
                        ₹{(item.amount_inr / 100000).toFixed(1)}L ({item.percentage}%)
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {data.financial_feasibility.break_even_analysis && (
              <div className="p-4 bg-blue-50 rounded-lg">
                <p className="text-sm font-semibold text-blue-900 mb-2">Break-Even Analysis</p>
                {data.financial_feasibility.break_even_analysis.break_even_month && (
                  <p className="text-sm text-gray-700">Expected in <strong>{data.financial_feasibility.break_even_analysis.break_even_month} months</strong></p>
                )}
                {data.financial_feasibility.break_even_analysis.notes && (
                  <p className="text-xs text-gray-600 mt-2">{data.financial_feasibility.break_even_analysis.notes}</p>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Go-to-Market Strategy */}
      {data.go_to_market_strategy && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Rocket className="w-5 h-5 text-orange-600" />
              Go-to-Market Strategy
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {data.go_to_market_strategy.positioning_statement && (
              <div className="p-4 bg-orange-50 rounded-lg border-l-4 border-orange-500">
                <p className="text-sm font-semibold text-orange-900 mb-1">Positioning Statement</p>
                <p className="text-sm text-gray-700">{data.go_to_market_strategy.positioning_statement}</p>
              </div>
            )}
            
            {data.go_to_market_strategy.pricing_strategy && (
              <div>
                <p className="text-sm font-semibold text-gray-700 mb-2">Pricing Strategy</p>
                {data.go_to_market_strategy.pricing_strategy.price_points && (
                  <p className="text-sm text-gray-700">{data.go_to_market_strategy.pricing_strategy.price_points}</p>
                )}
                {data.go_to_market_strategy.pricing_strategy.rationale && (
                  <p className="text-xs text-gray-600 mt-1">{data.go_to_market_strategy.pricing_strategy.rationale}</p>
                )}
              </div>
            )}
            
            {data.go_to_market_strategy.marketing_tactics && data.go_to_market_strategy.marketing_tactics.length > 0 && (
              <div>
                <p className="text-sm font-semibold text-gray-700 mb-2">Marketing Tactics</p>
                <div className="grid gap-3">
                  {data.go_to_market_strategy.marketing_tactics.map((tactic: any, idx: number) => (
                    <div key={idx} className="p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm font-semibold text-gray-900">{tactic.title}</p>
                      <p className="text-xs text-gray-600 mt-1">{tactic.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* Distribution Channels */}
            {data.go_to_market_strategy.distribution_channels && data.go_to_market_strategy.distribution_channels.length > 0 && (
              <div>
                <p className="text-sm font-semibold text-gray-700 mb-2">Distribution Channels</p>
                <div className="space-y-2">
                  {data.go_to_market_strategy.distribution_channels.map((channel: any, idx: number) => (
                    <div key={idx} className="p-3 bg-gray-50 rounded-lg">
                      <div className="flex justify-between items-start mb-1">
                        <p className="text-sm font-semibold text-gray-900">{channel.channel}</p>
                        <Badge className="text-xs">{channel.priority}</Badge>
                      </div>
                      <p className="text-xs text-gray-600">{channel.notes}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Technical Feasibility */}
      {data.technical_feasibility && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="w-5 h-5 text-blue-600" />
              Technical Feasibility
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {data.technical_feasibility.technical_complexity && (
              <div className="p-3 bg-blue-50 rounded-lg">
                <p className="text-xs text-gray-600">Technical Complexity</p>
                <p className="text-sm font-semibold text-gray-900">{data.technical_feasibility.technical_complexity}</p>
              </div>
            )}
            
            {data.technical_feasibility.core_capabilities_required && data.technical_feasibility.core_capabilities_required.length > 0 && (
              <div>
                <p className="text-sm font-semibold text-gray-700 mb-2">Core Capabilities Required</p>
                <ul className="space-y-1">
                  {data.technical_feasibility.core_capabilities_required.map((cap: string, idx: number) => (
                    <li key={idx} className="text-sm text-gray-700 flex items-start gap-2">
                      <span className="text-blue-600">•</span>
                      <span>{cap}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            
            {data.technical_feasibility.technology_stack && data.technical_feasibility.technology_stack.length > 0 && (
              <div>
                <p className="text-sm font-semibold text-gray-700 mb-2">Technology Stack</p>
                <div className="space-y-2">
                  {data.technical_feasibility.technology_stack.map((tech: any, idx: number) => (
                    <div key={idx} className="p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm font-semibold text-gray-900">{tech.component}</p>
                      <p className="text-xs text-gray-600 mt-1">{tech.options}</p>
                      <Badge className="text-xs mt-1">{tech.complexity}</Badge>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {data.technical_feasibility.scalability_potential && (
              <div className="p-4 bg-green-50 rounded-lg">
                <p className="text-sm font-semibold text-green-900 mb-1">Scalability Potential</p>
                <p className="text-sm text-gray-700">{data.technical_feasibility.scalability_potential}</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Market Analysis - Competition & Demand */}
      {data.market_analysis && (data.market_analysis.competition_landscape || data.market_analysis.demand_validation) && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="w-5 h-5 text-yellow-600" />
              Competition & Demand Analysis
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Direct Competitors */}
            {data.market_analysis.competition_landscape?.direct_competitors && (
              <div>
                <p className="text-sm font-semibold text-gray-700 mb-2">Direct Competitors</p>
                <div className="space-y-2">
                  {data.market_analysis.competition_landscape.direct_competitors.map((comp: any, idx: number) => (
                    <div key={idx} className="p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm font-semibold text-gray-900">{comp.name}</p>
                      <div className="grid grid-cols-2 gap-2 mt-2">
                        <div>
                          <p className="text-xs text-green-700">✓ Strength</p>
                          <p className="text-xs text-gray-600">{comp.strength}</p>
                        </div>
                        <div>
                          <p className="text-xs text-red-700">✗ Weakness</p>
                          <p className="text-xs text-gray-600">{comp.weakness}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* Market Gap */}
            {data.market_analysis.competition_landscape?.market_gap && (
              <div className="p-4 bg-yellow-50 rounded-lg border-l-4 border-yellow-500">
                <p className="text-sm font-semibold text-yellow-900 mb-1">Market Gap Opportunity</p>
                <p className="text-sm text-gray-700">{data.market_analysis.competition_landscape.market_gap}</p>
              </div>
            )}
            
            {/* Demand Validation */}
            {data.market_analysis.demand_validation && (
              <div>
                <p className="text-sm font-semibold text-gray-700 mb-2">Demand Validation</p>
                {data.market_analysis.demand_validation.search_trends && (
                  <div className="p-3 bg-gray-50 rounded-lg mb-2">
                    <p className="text-xs text-gray-600">Search Trends</p>
                    <p className="text-sm text-gray-900">{data.market_analysis.demand_validation.search_trends}</p>
                  </div>
                )}
                {data.market_analysis.demand_validation.social_proof && (
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-xs text-gray-600">Social Proof</p>
                    <p className="text-sm text-gray-900">{data.market_analysis.demand_validation.social_proof}</p>
                  </div>
                )}
              </div>
            )}
            
            {/* Regulatory Considerations */}
            {data.market_analysis.regulatory_considerations && data.market_analysis.regulatory_considerations.length > 0 && (
              <div>
                <p className="text-sm font-semibold text-gray-700 mb-2">Regulatory Considerations</p>
                <ul className="space-y-1">
                  {data.market_analysis.regulatory_considerations.map((reg: string, idx: number) => (
                    <li key={idx} className="text-sm text-gray-700 flex items-start gap-2">
                      <span className="text-yellow-600">⚠</span>
                      <span>{reg}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Financial Details - Revenue & Costs */}
      {data.financial_feasibility && (data.financial_feasibility.revenue_projections || data.financial_feasibility.monthly_operating_costs) && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-green-600" />
              Revenue Projections & Operating Costs
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Revenue Projections */}
            {data.financial_feasibility.revenue_projections && (
              <div>
                <p className="text-sm font-semibold text-gray-700 mb-3">Revenue Projections</p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {data.financial_feasibility.revenue_projections.month_1_inr && (
                    <div className="p-3 bg-green-50 rounded-lg text-center">
                      <p className="text-xs text-gray-600">Month 1</p>
                      <p className="text-lg font-bold text-green-700">₹{(data.financial_feasibility.revenue_projections.month_1_inr / 100000).toFixed(1)}L</p>
                    </div>
                  )}
                  {data.financial_feasibility.revenue_projections.month_3_inr && (
                    <div className="p-3 bg-green-50 rounded-lg text-center">
                      <p className="text-xs text-gray-600">Month 3</p>
                      <p className="text-lg font-bold text-green-700">₹{(data.financial_feasibility.revenue_projections.month_3_inr / 100000).toFixed(1)}L</p>
                    </div>
                  )}
                  {data.financial_feasibility.revenue_projections.month_6_inr && (
                    <div className="p-3 bg-green-50 rounded-lg text-center">
                      <p className="text-xs text-gray-600">Month 6</p>
                      <p className="text-lg font-bold text-green-700">₹{(data.financial_feasibility.revenue_projections.month_6_inr / 100000).toFixed(1)}L</p>
                    </div>
                  )}
                  {data.financial_feasibility.revenue_projections.month_12_inr && (
                    <div className="p-3 bg-green-50 rounded-lg text-center">
                      <p className="text-xs text-gray-600">Month 12</p>
                      <p className="text-lg font-bold text-green-700">₹{(data.financial_feasibility.revenue_projections.month_12_inr / 100000).toFixed(1)}L</p>
                    </div>
                  )}
                </div>
                {data.financial_feasibility.revenue_projections.assumptions && (
                  <p className="text-xs text-gray-600 mt-2">{data.financial_feasibility.revenue_projections.assumptions}</p>
                )}
              </div>
            )}
            
            {/* Monthly Operating Costs */}
            {data.financial_feasibility.monthly_operating_costs && data.financial_feasibility.monthly_operating_costs.length > 0 && (
              <div>
                <p className="text-sm font-semibold text-gray-700 mb-3">Monthly Operating Costs</p>
                <div className="space-y-2">
                  {data.financial_feasibility.monthly_operating_costs.map((cost: any, idx: number) => (
                    <div key={idx} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                      <div className="flex-1">
                        <p className="text-sm text-gray-900">{cost.category}</p>
                        {cost.notes && <p className="text-xs text-gray-600">{cost.notes}</p>}
                      </div>
                      <p className="text-sm font-semibold text-gray-900">₹{(cost.amount_inr / 1000).toFixed(0)}K</p>
                    </div>
                  ))}
                </div>
                {data.financial_feasibility.total_monthly_cost_inr && (
                  <div className="mt-3 p-3 bg-red-50 rounded-lg">
                    <div className="flex justify-between items-center">
                      <p className="text-sm font-semibold text-red-900">Total Monthly Cost</p>
                      <p className="text-lg font-bold text-red-700">₹{(data.financial_feasibility.total_monthly_cost_inr / 100000).toFixed(2)}L</p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
