import React, { useEffect, useState } from 'react';
import { healthRecordsApi } from '@/services/api';
import { Activity, TrendingUp, TrendingDown, Minus, AlertCircle } from 'lucide-react';
import Button from './ui/Button';

interface OverallHealthSummaryProps {
  onViewDetails: () => void;
}

const OverallHealthSummary: React.FC<OverallHealthSummaryProps> = ({ onViewDetails }) => {
  const [summary, setSummary] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSummary();
  }, []);

  const loadSummary = async () => {
    try {
      const data = await healthRecordsApi.getOverallAnalysis();
      setSummary(data);
    } catch (error) {
      console.error('Failed to load overall analysis:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100 shadow-sm">
        <div className="animate-pulse space-y-4">
          <div className="h-6 w-48 bg-blue-200 rounded"></div>
          <div className="h-4 w-full bg-blue-200 rounded"></div>
          <div className="h-4 w-3/4 bg-blue-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (!summary || summary.totalRecords === 0) {
    return null;
  }

  const getTrendIcon = (trend: string) => {
    if (trend === 'improving' || trend === 'decreasing') return <TrendingDown className="h-5 w-5 text-green-600" />;
    if (trend === 'worsening' || trend === 'increasing') return <TrendingUp className="h-5 w-5 text-red-600" />;
    return <Minus className="h-5 w-5 text-gray-600" />;
  };

  const getTrendColor = (trend: string) => {
    if (trend === 'improving' || trend === 'decreasing') return 'text-green-700 bg-green-50';
    if (trend === 'worsening' || trend === 'increasing') return 'text-red-700 bg-red-50';
    return 'text-gray-700 bg-gray-50';
  };

  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100 shadow-sm">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <Activity className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Overall Health Summary</h3>
            <p className="text-sm text-gray-600">{summary.totalRecords} records analyzed</p>
          </div>
        </div>
      </div>

      {/* Trends */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className={`p-3 rounded-lg ${getTrendColor(summary.trends?.severityTrend)}`}>
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Severity Trend</span>
            {getTrendIcon(summary.trends?.severityTrend)}
          </div>
          <p className="text-xs mt-1 capitalize">{summary.trends?.severityTrend || 'N/A'}</p>
        </div>
        <div className={`p-3 rounded-lg ${getTrendColor(summary.trends?.frequencyTrend)}`}>
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Frequency Trend</span>
            {getTrendIcon(summary.trends?.frequencyTrend)}
          </div>
          <p className="text-xs mt-1 capitalize">{summary.trends?.frequencyTrend || 'N/A'}</p>
        </div>
      </div>

      {/* Key Insights */}
      {summary.recommendations && summary.recommendations.length > 0 && (
        <div className="mb-4">
          <h4 className="text-sm font-semibold text-gray-900 mb-2">Key Recommendations</h4>
          <ul className="space-y-1">
            {summary.recommendations.slice(0, 3).map((rec: string, idx: number) => (
              <li key={idx} className="text-sm text-gray-700 flex items-start">
                <span className="text-blue-600 mr-2">•</span>
                <span className="flex-1">{rec}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Red Flags */}
      {summary.redFlags && summary.redFlags.length > 0 && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-start space-x-2">
            <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-semibold text-red-900 mb-1">Attention Required</h4>
              <ul className="space-y-1">
                {summary.redFlags.slice(0, 2).map((flag: string, idx: number) => (
                  <li key={idx} className="text-sm text-red-700">{flag}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      <Button 
        variant="outline" 
        size="sm" 
        className="w-full"
        onClick={onViewDetails}
      >
        View Detailed Analysis
      </Button>
    </div>
  );
};

export default OverallHealthSummary;
