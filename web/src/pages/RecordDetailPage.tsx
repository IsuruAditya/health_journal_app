import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { healthRecordsApi } from '@/services/api';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
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
        
        // Load saved AI analysis if exists
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
      // Update record with new analysis
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
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error || !record) {
    return (
      <div className="text-center py-12">
        <div className="text-red-600 mb-4">{error || 'Record not found'}</div>
        <Button onClick={() => navigate('/records')}>Back to Records</Button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            onClick={() => navigate('/records')}
            className="flex items-center space-x-2"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Records</span>
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Health Record Details</h1>
            <div className="flex items-center space-x-4 text-sm text-gray-500 mt-1">
              <div className="flex items-center space-x-1">
                <Calendar className="h-4 w-4" />
                <span>{formatDate(record.record_date)}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Clock className="h-4 w-4" />
                <span>{formatTime(record.record_time)}</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            onClick={() => navigate(`/records/${record.id}/edit`)}
          >
            <Edit className="h-4 w-4" />
            <span>Edit</span>
          </Button>
          <Button
            variant="outline"
            onClick={() => setShowDeleteConfirm(true)}
            className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-300"
          >
            <Trash2 className="h-4 w-4" />
            <span>Delete</span>
          </Button>
          <Button
            onClick={handleAnalyze}
            loading={analysisLoading}
          >
            <Brain className="h-4 w-4" />
            <span>{analysis ? 'Regenerate Analysis' : 'AI Analysis'}</span>
          </Button>
        </div>
      </div>

      {/* Severity Badge */}
      {record.severity && (
        <div className="flex justify-center">
          <span className={`px-4 py-2 rounded-full text-sm font-medium ${getSeverityColor(record.severity)}`}>
            {getSeverityLabel(record.severity)} - {record.severity}/10
          </span>
        </div>
      )}

      {/* SOCRATES Framework */}
      <Card>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Symptom Assessment (SOCRATES)</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {record.site && (
            <div className="flex items-start space-x-2">
              <MapPin className="h-4 w-4 text-gray-400 mt-1" />
              <div>
                <span className="text-sm font-medium text-gray-700">Site: </span>
                <span className="text-sm text-gray-600">{record.site}</span>
              </div>
            </div>
          )}
          {record.onset && (
            <div>
              <span className="text-sm font-medium text-gray-700">Onset: </span>
              <span className="text-sm text-gray-600">{record.onset}</span>
            </div>
          )}
          {record.character && (
            <div>
              <span className="text-sm font-medium text-gray-700">Character: </span>
              <span className="text-sm text-gray-600">{record.character}</span>
            </div>
          )}
          {record.radiation && (
            <div>
              <span className="text-sm font-medium text-gray-700">Radiation: </span>
              <span className="text-sm text-gray-600">{record.radiation}</span>
            </div>
          )}
          {record.associations && (
            <div>
              <span className="text-sm font-medium text-gray-700">Associations: </span>
              <span className="text-sm text-gray-600">{record.associations}</span>
            </div>
          )}
          {record.time_course && (
            <div>
              <span className="text-sm font-medium text-gray-700">Time Course: </span>
              <span className="text-sm text-gray-600">{record.time_course}</span>
            </div>
          )}
          {record.exacerbating_factors && (
            <div>
              <span className="text-sm font-medium text-gray-700">Exacerbating: </span>
              <span className="text-sm text-gray-600">{record.exacerbating_factors}</span>
            </div>
          )}
          {record.palliating_factors && (
            <div>
              <span className="text-sm font-medium text-gray-700">Palliating: </span>
              <span className="text-sm text-gray-600">{record.palliating_factors}</span>
            </div>
          )}
        </div>
      </Card>

      {/* Additional Information */}
      <Card>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Additional Information</h2>
        <div className="space-y-3">
          {record.symptoms && (
            <div className="flex items-start space-x-2">
              <Activity className="h-4 w-4 text-gray-400 mt-1" />
              <div>
                <span className="text-sm font-medium text-gray-700">Symptoms: </span>
                <span className="text-sm text-gray-600">{record.symptoms}</span>
              </div>
            </div>
          )}
          {record.medications && (
            <div className="flex items-start space-x-2">
              <Pill className="h-4 w-4 text-gray-400 mt-1" />
              <div>
                <span className="text-sm font-medium text-gray-700">Medications: </span>
                <span className="text-sm text-gray-600">{record.medications}</span>
              </div>
            </div>
          )}
          {record.diet_notes && (
            <div>
              <span className="text-sm font-medium text-gray-700">Diet Notes: </span>
              <span className="text-sm text-gray-600">{record.diet_notes}</span>
            </div>
          )}
        </div>
      </Card>

      {/* Vital Signs */}
      {record.vital_signs && Object.values(record.vital_signs).some(v => v) && (
        <Card>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Vital Signs</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {record.vital_signs.blood_pressure && (
              <div className="text-center p-3 bg-gray-50 rounded-md">
                <div className="text-sm font-medium text-gray-700">Blood Pressure</div>
                <div className="text-lg font-semibold text-gray-900">{record.vital_signs.blood_pressure}</div>
              </div>
            )}
            {record.vital_signs.temperature && (
              <div className="text-center p-3 bg-gray-50 rounded-md">
                <div className="text-sm font-medium text-gray-700">Temperature</div>
                <div className="text-lg font-semibold text-gray-900">{record.vital_signs.temperature}°F</div>
              </div>
            )}
            {record.vital_signs.pulse && (
              <div className="text-center p-3 bg-gray-50 rounded-md">
                <div className="text-sm font-medium text-gray-700">Pulse</div>
                <div className="text-lg font-semibold text-gray-900">{record.vital_signs.pulse} bpm</div>
              </div>
            )}
            {record.vital_signs.weight && (
              <div className="text-center p-3 bg-gray-50 rounded-md">
                <div className="text-sm font-medium text-gray-700">Weight</div>
                <div className="text-lg font-semibold text-gray-900">{record.vital_signs.weight} lbs</div>
              </div>
            )}
          </div>
        </Card>
      )}

      {/* Personal Notes */}
      {record.personal_notes && (
        <Card>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Personal Notes</h2>
          <p className="text-sm text-gray-600 whitespace-pre-wrap">{record.personal_notes}</p>
        </Card>
      )}

      {/* AI Analysis Results */}
      {analysis && (
        <div className="space-y-6">
          {/* Differential Diagnosis - Most Important */}
          {analysis.differentialDiagnosis && analysis.differentialDiagnosis.length > 0 && (
            <Card className="border-l-4 border-l-blue-500">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Brain className="h-5 w-5 text-blue-600" />
                Differential Diagnosis
              </h2>
              <div className="space-y-3">
                {analysis.differentialDiagnosis.map((diagnosis, idx) => (
                  <div key={idx} className="text-sm text-gray-700 whitespace-pre-wrap bg-blue-50 p-3 rounded-lg">
                    {diagnosis}
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* Clinical Assessment & Recommendations */}
          <Card>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Clinical Assessment</h2>
            <div className="space-y-4">
              {analysis.symptomPattern.length > 0 && (
                <div>
                  <h3 className="font-medium text-gray-900 mb-2">Assessment</h3>
                  <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                    {analysis.symptomPattern.map((pattern, idx) => (
                      <li key={idx}>{pattern}</li>
                    ))}
                  </ul>
                </div>
              )}
              
              {analysis.riskFactors.length > 0 && (
                <div>
                  <h3 className="font-medium text-gray-900 mb-2">Clinical Reasoning</h3>
                  <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                    {analysis.riskFactors.map((risk, idx) => (
                      <li key={idx}>{risk}</li>
                    ))}
                  </ul>
                </div>
              )}

              <div>
                <h3 className="font-medium text-gray-900 mb-2">Recommended Actions</h3>
                <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                  {analysis.recommendations.map((rec, idx) => (
                    <li key={idx}>{rec}</li>
                  ))}
                </ul>
              </div>
              
              {analysis.redFlags.length > 0 && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <h3 className="font-medium text-red-700 mb-2 flex items-center gap-2">
                    <Activity className="h-4 w-4" />
                    Safety Information
                  </h3>
                  <ul className="list-disc list-inside text-sm text-red-700 space-y-1">
                    {analysis.redFlags.map((flag, idx) => (
                      <li key={idx}>{flag}</li>
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
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-red-100 rounded-lg">
                <Trash2 className="h-5 w-5 text-red-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Delete Health Record</h3>
            </div>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this health record? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <Button
                variant="outline"
                onClick={() => setShowDeleteConfirm(false)}
                disabled={deleteLoading}
              >
                Cancel
              </Button>
              <Button
                onClick={handleDelete}
                loading={deleteLoading}
                className="bg-red-600 hover:bg-red-700 focus:ring-red-500"
              >
                Delete Record
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RecordDetailPage;