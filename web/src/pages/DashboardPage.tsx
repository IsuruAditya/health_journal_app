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
import OverallHealthSummary from '@/components/OverallHealthSummary';
import EmptyState from '@/components/EmptyState';
import MedicalDisclaimer from '@/components/MedicalDisclaimer';

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
            <div className="h-8 w-48 bg-muted rounded animate-pulse"></div>
            <div className="h-4 w-32 bg-muted rounded animate-pulse mt-2"></div>
          </div>
          <div className="h-10 w-32 bg-muted rounded-lg animate-pulse"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => (
            <div key={i} className="bg-card p-6 rounded-xl border border-border shadow-sm">
              <div className="flex items-center">
                <div className="h-12 w-12 bg-muted rounded-xl animate-pulse"></div>
                <div className="ml-4 space-y-2">
                  <div className="h-4 w-24 bg-muted rounded animate-pulse"></div>
                  <div className="h-6 w-16 bg-muted rounded animate-pulse"></div>
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">Dashboard</h1>
          <p className="text-sm text-muted-foreground mt-1">Track your health journey</p>
        </div>
        <Button 
          size="lg"
          onClick={() => navigate('/records/new')}
        >
          <Plus className="h-5 w-5" />
          <span>New Record</span>
        </Button>
      </div>

      {/* Overall Health Summary */}
      {records.length > 0 && (
        <OverallHealthSummary onViewDetails={() => {/* TODO: Navigate to detailed analysis page */}} />
      )}

      {/* Health Metrics */}
      <HealthMetrics records={records} />

      {/* Recent Records */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg sm:text-xl font-semibold text-foreground">Recent Records</h2>
          <Link to="/records" className="text-sm font-medium text-primary hover:text-primary/80 transition-colors">
            View all →
          </Link>
        </div>
        
        {error && (
          <div className="bg-destructive/10 border border-destructive/20 text-destructive px-4 py-3 rounded-md">
            {error}
          </div>
        )}
        
        {recentRecords.length === 0 ? (
          <div className="bg-card rounded-xl border border-border shadow-sm">
            <EmptyState
              icon={Activity}
              title="No health records yet"
              description="Start tracking your health journey by creating your first record. Document symptoms, medications, and vital signs to get AI-powered insights."
              actionLabel="Create First Record"
              onAction={() => navigate('/records/new')}
            />
            <div className="px-6 pb-6">
              <MedicalDisclaimer variant="card" />
            </div>
          </div>
        ) : (
          <div className="space-y-4">
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