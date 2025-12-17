import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { healthRecordsApi } from '@/services/api';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import MarkdownText from '@/components/ui/MarkdownText';
import { ArrowLeft, Brain, Calendar, Clock, MapPin, Activity, Pill, Edit, Trash2 } from 'lucide-react';
import { formatDate, formatTime, getSeverityColor, getSeverityLabel } from '@/utils/formatters';
import type { HealthRecord, HealthAnalysis } from '@/types';

const RecordDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [record, setRecord] = useState<HealthRecord | null>(null);
  const [analysis, setAnalysis] = useState<HealthAnalysis | null>(null);
  const [loading, setLoading] = useState(true);
  const [analysisLoading, setAnalysisLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    const fetchRecord = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        const data = await healthRecordsApi.getRecord(parseInt(id));
        setRecord(data);
        
        if (data.ai_analysis) {
          setAnalysis(data.ai_analysis);
        }
      } catch (err) {
        setError('Failed to fetch record details');
        console.error('Error fetching record:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchRecord();
  }, [id]);

  const handleAnalyze = async () => {
    if (!record) return;
    
    setAnalysisLoading(true);
    setError(null);
    try {
      const result = await healthRecordsApi.getAnalysis(record.id);
      setAnalysis(result);
      setRecord(prev => prev ? { ...prev, ai_analysis: result } : null);
    } catch (err) {
      console.error('Analysis failed:', err);
      setError('Failed to generate AI analysis');
    } finally {
      setAnalysisLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!record) return;
    
    setDeleteLoading(true);
    try {
      await healthRecordsApi.deleteRecord(record.id);
      navigate('/records');
    } catch (err) {
      console.error('Delete failed:', err);
      setError('Failed to delete record');
    } finally {
      setDeleteLoading(false);
      setShowDeleteConfirm(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error || !record) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 text-center">
        <div className="text-destructive mb-4">{error || 'Record not found'}</div>
        <Button onClick={() => navigate('/records')}>Back to Records</Button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="space-y-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate('/records')}
          className="flex items-center gap-2 -ml-2 transition-transform hover:translate-x-1"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back</span>
        </Button>
        
        <div className="space-y-3">
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Record Details</h1>
          <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
            <div className="flex items-center gap-1.5 bg-muted px-2.5 py-1 rounded-md">
              <Calendar className="h-3.5 w-3.5" />
              <span>{formatDate(record.record_date)}</span>
            </div>
            <div className="flex items-center gap-1.5 bg-muted px-2.5 py-1 rounded-md">
              <Clock className="h-3.5 w-3.5" />
              <span>{formatTime(record.record_time)}</span>
            </div>
          </div>
        </div>
        
        {/* Action Buttons */}
        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate(`/records/${record.id}/edit`)}
            className="flex-1 sm:flex-none transition-all hover:scale-105"
          >
            <Edit className="h-4 w-4" />
            <span>Edit</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowDeleteConfirm(true)}
            className="flex-1 sm:flex-none text-destructive hover:text-destructive hover:bg-destructive/10 border-destructive/30 transition-all hover:scale-105"
          >
            <Trash2 className="h-4 w-4" />
            <span>Delete</span>
          </Button>
          <Button
            size="sm"
            onClick={handleAnalyze}
            loading={analysisLoading}
            className="w-full sm:w-auto transition-all hover:scale-105"
          >
            <Brain className="h-4 w-4" />
            <span>{analysis ? 'Regenerate' : 'Analyze'}</span>
          </Button>
        </div>
      </div>

      {/* Severity Badge */}
      {record.severity && (
        <div className="flex justify-center animate-in slide-in-from-top duration-500">
          <span className={`px-4 py-2 rounded-full text-sm font-medium transition-all hover:scale-105 ${getSeverityColor(record.severity)}`}>
            {getSeverityLabel(record.severity)} - {record.severity}/10
          </span>
        </div>
      )}

      {/* SOCRATES Framework */}
      <Card className="animate-in slide-in-from-bottom duration-500">
        <h2 className="text-lg font-semibold text-foreground mb-4">Symptom Assessment</h2>
        <div className="grid grid-cols-1 gap-3">
          {record.site && (
            <div className="flex items-start gap-2 p-2 rounded-lg hover:bg-muted/50 transition-colors">
              <MapPin className="h-4 w-4 text-muted-foreground mt-1 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <span className="text-sm font-medium text-foreground">Site: </span>
                <span className="text-sm text-muted-foreground">{record.site}</span>
              </div>
            </div>
          )}
          {record.onset && (
            <div className="p-2 rounded-lg hover:bg-muted/50 transition-colors">
              <span className="text-sm font-medium text-foreground">Onset: </span>
              <span className="text-sm text-muted-foreground">{record.onset}</span>
            </div>
          )}
          {record.character && (
            <div className="p-2 rounded-lg hover:bg-muted/50 transition-colors">
              <span className="text-sm font-medium text-foreground">Character: </span>
              <span className="text-sm text-muted-foreground">{record.character}</span>
            </div>
          )}
          {record.radiation && (
            <div className="p-2 rounded-lg hover:bg-muted/50 transition-colors">
              <span className="text-sm font-medium text-foreground">Radiation: </span>
              <span className="text-sm text-muted-foreground">{record.radiation}</span>
            </div>
          )}
          {record.associations && (
            <div className="p-2 rounded-lg hover:bg-muted/50 transition-colors">
              <span className="text-sm font-medium text-foreground">Associations: </span>
              <span className="text-sm text-muted-foreground">{record.associations}</span>
            </div>
          )}
          {record.time_course && (
            <div className="p-2 rounded-lg hover:bg-muted/50 transition-colors">
              <span className="text-sm font-medium text-foreground">Time Course: </span>
              <span className="text-sm text-muted-foreground">{record.time_course}</span>
            </div>
          )}
          {record.exacerbating_factors && (
            <div className="p-2 rounded-lg hover:bg-muted/50 transition-colors">
              <span className="text-sm font-medium text-foreground">Exacerbating: </span>
              <span className="text-sm text-muted-foreground">{record.exacerbating_factors}</span>
            </div>
          )}
          {record.palliating_factors && (
            <div className="p-2 rounded-lg hover:bg-muted/50 transition-colors">
              <span className="text-sm font-medium text-foreground">Palliating: </span>
              <span className="text-sm text-muted-foreground">{record.palliating_factors}</span>
            </div>
          )}
        </div>
      </Card>

      {/* Additional Information */}
      <Card className="animate-in slide-in-from-bottom duration-500 delay-100">
        <h2 className="text-lg font-semibold text-foreground mb-4">Additional Information</h2>
        <div className="space-y-3">
          {record.symptoms && (
            <div className="flex items-start gap-2 p-2 rounded-lg hover:bg-muted/50 transition-colors">
              <Activity className="h-4 w-4 text-muted-foreground mt-1 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <span className="text-sm font-medium text-foreground">Symptoms: </span>
                <span className="text-sm text-muted-foreground">{record.symptoms}</span>
              </div>
            </div>
          )}
          {record.medications && (
            <div className="flex items-start gap-2 p-2 rounded-lg hover:bg-muted/50 transition-colors">
              <Pill className="h-4 w-4 text-muted-foreground mt-1 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <span className="text-sm font-medium text-foreground">Medications: </span>
                <span className="text-sm text-muted-foreground">{record.medications}</span>
              </div>
            </div>
          )}
          {record.diet_notes && (
            <div className="p-2 rounded-lg hover:bg-muted/50 transition-colors">
              <span className="text-sm font-medium text-foreground">Diet Notes: </span>
              <span className="text-sm text-muted-foreground">{record.diet_notes}</span>
            </div>
          )}
        </div>
      </Card>

      {/* Vital Signs */}
      {record.vital_signs && Object.values(record.vital_signs).some(v => v) && (
        <Card className="animate-in slide-in-from-bottom duration-500 delay-150">
          <h2 className="text-lg font-semibold text-foreground mb-4">Vital Signs</h2>
          <div className="grid grid-cols-2 gap-3">
            {record.vital_signs.blood_pressure && (
              <div className="text-center p-3 bg-muted rounded-lg hover:bg-muted/80 transition-all hover:scale-105">
                <div className="text-xs font-medium text-muted-foreground">Blood Pressure</div>
                <div className="text-lg font-semibold text-foreground mt-1">{record.vital_signs.blood_pressure}</div>
              </div>
            )}
            {record.vital_signs.temperature && (
              <div className="text-center p-3 bg-muted rounded-lg hover:bg-muted/80 transition-all hover:scale-105">
                <div className="text-xs font-medium text-muted-foreground">Temperature</div>
                <div className="text-lg font-semibold text-foreground mt-1">{record.vital_signs.temperature}°F</div>
              </div>
            )}
            {record.vital_signs.pulse && (
              <div className="text-center p-3 bg-muted rounded-lg hover:bg-muted/80 transition-all hover:scale-105">
                <div className="text-xs font-medium text-muted-foreground">Pulse</div>
                <div className="text-lg font-semibold text-foreground mt-1">{record.vital_signs.pulse} bpm</div>
              </div>
            )}
            {record.vital_signs.weight && (
              <div className="text-center p-3 bg-muted rounded-lg hover:bg-muted/80 transition-all hover:scale-105">
                <div className="text-xs font-medium text-muted-foreground">Weight</div>
                <div className="text-lg font-semibold text-foreground mt-1">{record.vital_signs.weight} lbs</div>
              </div>
            )}
          </div>
        </Card>
      )}

      {/* Personal Notes */}
      {record.personal_notes && (
        <Card className="animate-in slide-in-from-bottom duration-500 delay-200">
          <h2 className="text-lg font-semibold text-foreground mb-4">Personal Notes</h2>
          <p className="text-sm text-muted-foreground whitespace-pre-wrap leading-relaxed">{record.personal_notes}</p>
        </Card>
      )}

      {/* AI Analysis Results */}
      {analysis && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom duration-700">
          <Card>
            <h2 className="text-lg font-semibold text-foreground mb-4">Clinical Assessment</h2>
            <div className="space-y-4">
              {analysis.symptomPattern.length > 0 && (
                <div>
                  <h3 className="font-medium text-foreground mb-2">Assessment</h3>
                  <ul className="space-y-2">
                    {analysis.symptomPattern.map((pattern, idx) => (
                      <li key={idx} className="flex items-start gap-2 p-2 rounded-lg hover:bg-muted/50 transition-colors">
                        <span className="text-primary mt-1">•</span>
                        <MarkdownText text={pattern} className="text-sm text-foreground flex-1" />
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              
              {analysis.riskFactors.length > 0 && (
                <div>
                  <h3 className="font-medium text-foreground mb-2">Clinical Reasoning</h3>
                  <ul className="space-y-2">
                    {analysis.riskFactors.map((risk, idx) => (
                      <li key={idx} className="flex items-start gap-2 p-2 rounded-lg hover:bg-muted/50 transition-colors">
                        <span className="text-primary mt-1">•</span>
                        <MarkdownText text={risk} className="text-sm text-foreground flex-1" />
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div>
                <h3 className="font-medium text-foreground mb-2">Recommended Actions</h3>
                <ul className="space-y-2">
                  {analysis.recommendations.map((rec, idx) => (
                    <li key={idx} className="flex items-start gap-2 p-2 rounded-lg hover:bg-muted/50 transition-colors">
                      <span className="text-primary mt-1">•</span>
                      <MarkdownText text={rec} className="text-sm text-foreground flex-1" />
                    </li>
                  ))}
                </ul>
              </div>
              
              {analysis.redFlags.length > 0 && (
                <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4 animate-pulse">
                  <h3 className="font-medium text-destructive mb-2 flex items-center gap-2">
                    <Activity className="h-4 w-4" />
                    Safety Information
                  </h3>
                  <ul className="space-y-2">
                    {analysis.redFlags.map((flag, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-destructive mt-1">•</span>
                        <MarkdownText text={flag} className="text-sm text-destructive flex-1" />
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </Card>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
          <div className="bg-card rounded-xl max-w-md w-full p-6 shadow-xl border border-border animate-in zoom-in-95 duration-300">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-destructive/10 rounded-lg">
                <Trash2 className="h-5 w-5 text-destructive" />
              </div>
              <h3 className="text-lg font-semibold text-foreground">Delete Health Record</h3>
            </div>
            <p className="text-muted-foreground mb-6">
              Are you sure you want to delete this health record? This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => setShowDeleteConfirm(false)}
                disabled={deleteLoading}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={handleDelete}
                loading={deleteLoading}
                className="flex-1 bg-destructive hover:bg-destructive/90 text-destructive-foreground"
              >
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RecordDetailPage;
