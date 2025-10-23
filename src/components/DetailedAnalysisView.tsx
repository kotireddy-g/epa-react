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
              <KeyPointItem 
                icon={Lightbulb} 
                label="Core Concept" 
                value={key_points_summary.core_concept} 
              />
              <KeyPointItem 
                icon={Target} 
                label="Target Market" 
                value={key_points_summary.target_market} 
              />
              <KeyPointItem 
                icon={Rocket} 
                label="Unique Value Proposition" 
                value={key_points_summary.unique_value_proposition} 
              />
              <KeyPointItem 
                icon={DollarSign} 
                label="Revenue Model" 
                value={key_points_summary.revenue_model} 
              />
              <KeyPointItem 
                icon={Trophy} 
                label="Competitive Advantages" 
                value={key_points_summary.competitive_advantage} 
              />
              <KeyPointItem 
                icon={TrendingUp} 
                label="Growth Potential" 
                value={key_points_summary.growth_potential} 
              />
              <KeyPointItem 
                icon={Clock} 
                label="Implementation Timeline" 
                value={key_points_summary.implementation_timeline} 
              />
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
              <AttributeBadge icon={Target} label="Category" value={market_attributes.category} />
              <AttributeBadge icon={Package} label="Domain" value={market_attributes.domain} />
              <AttributeBadge icon={Users} label="Industry" value={market_attributes.industry} />
              <AttributeBadge icon={DollarSign} label="Budget" value={market_attributes.budget} />
              <AttributeBadge icon={MapPin} label="Location" value={market_attributes.location} />
              <AttributeBadge icon={Clock} label="Timeline" value={market_attributes.timeline} />
              <AttributeBadge icon={Rocket} label="Scalability" value={market_attributes.scalability} />
              <AttributeBadge icon={CheckCircle} label="Validation" value={market_attributes.validation} />
              <AttributeBadge icon={BarChart3} label="Metrics" value={market_attributes.metrics} />
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
              {stats_summary.TAM && (
                <StatCard label="Total Addressable Market (TAM)" value={stats_summary.TAM} color="blue" />
              )}
              {stats_summary.SAM && (
                <StatCard label="Serviceable Available Market (SAM)" value={stats_summary.SAM} color="purple" />
              )}
              {stats_summary.SOM && (
                <StatCard label="Serviceable Obtainable Market (SOM)" value={stats_summary.SOM} color="green" />
              )}
              {stats_summary.CAGR && (
                <StatCard label="CAGR" value={stats_summary.CAGR} color="orange" />
              )}
              {stats_summary.adoption_curves && (
                <StatCard label="Adoption Curve" value={stats_summary.adoption_curves} color="pink" />
              )}
            </div>
            
            {stats_summary.price_bands && (
              <div className="mt-6">
                <h4 className="font-semibold mb-3">Price Bands</h4>
                <div className="grid grid-cols-3 gap-3">
                  <PriceBand label="Entry" value={stats_summary.price_bands.entry} />
                  <PriceBand label="Medium" value={stats_summary.price_bands.medium} />
                  <PriceBand label="Premium" value={stats_summary.price_bands.premium} />
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
                    <th className="px-4 py-3 text-left font-semibold">City</th>
                    <th className="px-4 py-3 text-left font-semibold">Daily OPD</th>
                    <th className="px-4 py-3 text-left font-semibold">Footfall</th>
                    <th className="px-4 py-3 text-left font-semibold">Peak Ratio</th>
                    <th className="px-4 py-3 text-left font-semibold">Notes</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {population_access_table.map((row: any, idx: number) => (
                    <tr key={idx} className="hover:bg-gray-50">
                      <td className="px-4 py-3 font-medium">{row.city}</td>
                      <td className="px-4 py-3">{row.daily_OPD?.toLocaleString()}</td>
                      <td className="px-4 py-3">{row.footfall?.toLocaleString()}</td>
                      <td className="px-4 py-3">
                        <Badge variant="outline">{(row.peak_ratio * 100).toFixed(0)}%</Badge>
                      </td>
                      <td className="px-4 py-3 text-gray-600">{row.notes}</td>
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
              {technology_development_strategy_table.map((month: any, idx: number) => (
                <div key={idx} className="border-l-4 border-blue-500 pl-4 py-2">
                  <div className="flex items-center space-x-2 mb-2">
                    <Badge>Month {month.month}</Badge>
                    <h4 className="font-semibold">{month.deliverables}</h4>
                  </div>
                  <div className="space-y-2 text-sm">
                    <p><span className="font-medium">Objectives:</span> {month.objectives}</p>
                    <p><span className="font-medium">Dependencies:</span> {month.dependencies}</p>
                    <p className="text-red-600"><span className="font-medium">Risks:</span> {month.risks}</p>
                    <p className="text-green-600"><span className="font-medium">Mitigations:</span> {month.mitigations}</p>
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
              {gtm_customer_strategy_table.map((strategy: any, idx: number) => (
                <div key={idx} className="bg-purple-50 rounded-lg p-4">
                  <h4 className="font-semibold mb-3">Ideal Customer Profile</h4>
                  <div className="space-y-2 text-sm">
                    <p><span className="font-medium">Target:</span> {strategy.ICP}</p>
                    <p><span className="font-medium">Channels:</span> {strategy.channels}</p>
                    <p><span className="font-medium">Pilot Plan:</span> {strategy.pilot_plan}</p>
                    <p><span className="font-medium">KPIs:</span> {strategy.KPIs}</p>
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
                    <th className="px-4 py-3 text-left font-semibold">Competitor</th>
                    <th className="px-4 py-3 text-left font-semibold">Gap</th>
                    <th className="px-4 py-3 text-left font-semibold">Your Differentiator</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {competitor_gap_table.map((row: any, idx: number) => (
                    <tr key={idx} className="hover:bg-gray-50">
                      <td className="px-4 py-3 font-medium">{row.competitor}</td>
                      <td className="px-4 py-3 text-red-600">{row.gap}</td>
                      <td className="px-4 py-3 text-green-600">{row.differentiator}</td>
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
                    <th className="px-4 py-3 text-left font-semibold">Metric</th>
                    <th className="px-4 py-3 text-left font-semibold">Baseline</th>
                    <th className="px-4 py-3 text-left font-semibold">Target</th>
                    <th className="px-4 py-3 text-left font-semibold">Pilot Evidence</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {market_product_fit_table.map((row: any, idx: number) => (
                    <tr key={idx} className="hover:bg-gray-50">
                      <td className="px-4 py-3 font-medium">{row.metric}</td>
                      <td className="px-4 py-3">{row.baseline}</td>
                      <td className="px-4 py-3 text-green-600 font-semibold">{row.target}</td>
                      <td className="px-4 py-3 text-gray-600">{row.pilot_evidence}</td>
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
        <p className="text-sm font-medium text-gray-900 truncate">{value}</p>
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
