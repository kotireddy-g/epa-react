import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { 
  Lightbulb, Target, TrendingUp, DollarSign, Users, 
  MapPin, Clock, Rocket, CheckCircle, BarChart3, Trophy, Package
} from 'lucide-react';
import { FinalOutput } from '../services/ideaAnalysisApi';

interface DetailedAnalysisViewProps {
  data: FinalOutput;
}

export function DetailedAnalysisView({ data }: DetailedAnalysisViewProps) {
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
    verdict
  } = data;

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
                    <h4 className="text-lg font-semibold">{tier.tier} Tier</h4>
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

      {/* References moved to right sidebar */}

      {/* Verdict */}
      {verdict && (
        <Card className="border-blue-200 bg-gradient-to-br from-blue-50 to-purple-50">
          <CardContent className="pt-6">
            <div className="space-y-3">
              <h3 className="text-xl font-bold text-blue-900">{verdict.text}</h3>
              <p className="text-gray-700">{verdict.sub_text}</p>
              <div className="bg-white rounded-lg p-4 border-l-4 border-blue-500">
                <p className="text-sm font-medium text-blue-900">💡 Pro Tip: {verdict.tip}</p>
              </div>
            </div>
          </CardContent>
        </Card>
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
