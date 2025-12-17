import React, { useState } from 'react';
import { useHealthRecords } from '@/hooks/useHealthRecords';
import { healthRecordsApi } from '@/services/api';
import HealthRecordCard from '@/components/HealthRecordCard';
import Button from '@/components/ui/Button';
import { useNavigate } from 'react-router-dom';
import { Search, Plus } from 'lucide-react';
import type { HealthAnalysis } from '@/types';

const RecordsPage: React.FC = () => {
  const navigate = useNavigate();
  const { records, loading, error } = useHealthRecords();
  const [searchTerm, setSearchTerm] = useState('');
  const [, setAnalysisLoading] = useState<number | null>(null);
  const [analysis, setAnalysis] = useState<HealthAnalysis | null>(null);

  const handleAnalyze = async (recordId: number) => {
    setAnalysisLoading(recordId);
    try {
      const result = await healthRecordsApi.getAnalysis(recordId);
      setAnalysis(result);
    } catch (err) {
      console.error('Analysis failed:', err);
    } finally {
      setAnalysisLoading(null);
    }
  };

  const filteredRecords = records.filter(record =>
    record.symptoms?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    record.character?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    record.site?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="relative">
          <div className="h-12 w-12 rounded-full border-4 border-muted"></div>
          <div className="absolute top-0 left-0 h-12 w-12 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Health Records</h1>
          <p className="text-muted-foreground mt-1">View and manage your health history</p>
        </div>
        <Button
          onClick={() => navigate('/records/new')}
          className="hidden md:flex"
        >
          <Plus className="h-4 w-4" />
          <span>New Record</span>
        </Button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <input
          type="text"
          placeholder="Search records by symptoms, location, or description..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-3 bg-background text-foreground border border-input rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-ring focus:border-ring transition-colors placeholder:text-muted-foreground"
        />
        {searchTerm && (
          <button
            onClick={() => setSearchTerm('')}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        )}
      </div>

      {error && (
        <div className="bg-destructive/10 border border-destructive/20 text-destructive px-4 py-3 rounded-md">
          {error}
        </div>
      )}

      {/* Records List */}
      <div className="space-y-4">
        {filteredRecords.length === 0 ? (
          <div className="text-center py-12 bg-card rounded-lg border border-border">
            <div className="text-muted-foreground text-lg mb-4">No records found</div>
            <p className="text-muted-foreground mb-6">
              {searchTerm ? 'Try adjusting your search terms' : 'Start tracking your health by creating your first record'}
            </p>
            <Button onClick={() => navigate('/dashboard/records/new')}>
              Create First Record
            </Button>
          </div>
        ) : (
          filteredRecords.map((record) => (
            <HealthRecordCard
              key={record.id}
              record={record}
              onAnalyze={handleAnalyze}
            />
          ))
        )}
      </div>

      {/* AI Analysis Modal */}
      {analysis && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-card border border-border rounded-lg max-w-2xl w-full max-h-96 overflow-y-auto p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">AI Health Analysis</h3>
            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-foreground">Recommendations</h4>
                <ul className="list-disc list-inside text-sm text-muted-foreground mt-1">
                  {analysis.recommendations.map((rec, idx) => (
                    <li key={idx}>{rec}</li>
                  ))}
                </ul>
              </div>
              {analysis.redFlags.length > 0 && (
                <div>
                  <h4 className="font-medium text-destructive">Important Notes</h4>
                  <ul className="list-disc list-inside text-sm text-destructive mt-1">
                    {analysis.redFlags.map((flag, idx) => (
                      <li key={idx}>{flag}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
            <div className="mt-6 flex justify-end">
              <Button onClick={() => setAnalysis(null)}>Close</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RecordsPage;