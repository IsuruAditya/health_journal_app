import React, { useState } from 'react';
import { useHealthRecords } from '@/hooks/useHealthRecords';
import { healthRecordsApi } from '@/services/api';
import { useHealthStore } from '@/store/useHealthStore';
import HealthRecordCard from '@/components/HealthRecordCard';
import Button from '@/components/ui/Button';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, Activity } from 'lucide-react';
import { SkeletonCard } from '@/components/ui/Skeleton';
import { useToast } from '@/hooks/useToast';
import AnalysisModal from '@/components/AnalysisModal';
import { HealthMetrics } from '@/components/HealthMetrics';

const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { records, loading, error } = useHealthRecords();
  const { analysis, setAnalysis } = useHealthStore();
  const { toast } = useToast();
  const [, setAnalysisLoading] = useState<number | null>(null);

  const handleAnalyze = async (recordId: number) => {
    setAnalysisLoading(recordId);
    try {
      toast({
        title: "Analyzing Health Record",
        description: "AI is processing your health data...",
        variant: "default"
      });
      
      // Try direct AI analysis first, fallback to backend
      const record = records.find(r => r.id === recordId);
      const result = record ? 
        await healthRecordsApi.getAIAnalysis(record) : 
        await healthRecordsApi.getAnalysis(recordId);
      setAnalysis(result);
      
      toast({
        title: "Analysis Complete",
        description: "Your health analysis is ready to view.",
        variant: "success"
      });
    } catch (err: any) {
      console.error('Analysis failed:', err);
      toast({
        title: "Analysis Failed",
        description: err.response?.data?.error || "Unable to analyze health record. Please try again.",
        variant: "destructive"
      });
    } finally {
      setAnalysisLoading(null);
    }
  };

  const recentRecords = records.slice(0, 3);

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="flex justify-between items-center">
          <div>
            <div className="h-8 w-48 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-4 w-32 bg-gray-200 rounded animate-pulse mt-2"></div>
          </div>
          <div className="h-10 w-32 bg-gray-200 rounded-lg animate-pulse"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => (
            <div key={i} className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
              <div className="flex items-center">
                <div className="h-12 w-12 bg-gray-200 rounded-xl animate-pulse"></div>
                <div className="ml-4 space-y-2">
                  <div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-6 w-16 bg-gray-200 rounded animate-pulse"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="space-y-6">
          {[1, 2, 3].map(i => <SkeletonCard key={i} />)}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">Track your health journey</p>
        </div>
        <Button 
          className="flex items-center space-x-2"
          onClick={() => navigate('/records/new')}
        >
          <Plus className="h-4 w-4" />
          <span>New Record</span>
        </Button>
      </div>

      {/* Health Metrics */}
      <HealthMetrics records={records} />

      {/* Recent Records */}
      <div>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Recent Records</h2>
          <Link to="/records" className="text-blue-600 hover:text-blue-700 text-sm font-medium">
            View all →
          </Link>
        </div>
        
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md">
            {error}
          </div>
        )}
        
        {recentRecords.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl border border-gray-200 shadow-sm">
            <div className="p-4 bg-gray-100 rounded-full w-20 h-20 mx-auto flex items-center justify-center">
              <Activity className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="mt-6 text-lg font-semibold text-gray-900">No health records yet</h3>
            <p className="mt-2 text-gray-500 max-w-sm mx-auto">Start tracking your health journey by creating your first record.</p>
            <Button 
              className="mt-6"
              onClick={() => navigate('/records/new')}
            >
              <Plus className="h-4 w-4" />
              Create First Record
            </Button>
          </div>
        ) : (
          <div className="grid gap-6">
            {recentRecords.map((record) => (
              <HealthRecordCard
                key={record.id}
                record={record}
                onAnalyze={handleAnalyze}
              />
            ))}
          </div>
        )}
      </div>

      {/* AI Analysis Modal */}
      <AnalysisModal 
        analysis={analysis} 
        isOpen={!!analysis} 
        onClose={() => setAnalysis(null)} 
      />
    </div>
  );
};

export default DashboardPage;