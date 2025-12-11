import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { healthRecordsApi } from '@/services/api';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Card from '@/components/ui/Card';
import { ArrowLeft, Save } from 'lucide-react';
import type { CreateHealthRecordData } from '@/types';

const EditRecordPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<CreateHealthRecordData>({
    record_date: '',
    record_time: '',
    site: '',
    onset: '',
    character: '',
    radiation: '',
    associations: '',
    time_course: '',
    exacerbating_factors: '',
    severity: 1,
    palliating_factors: '',
    quality: '',
    region: '',
    symptoms: '',
    medications: '',
    diet_notes: '',
    vital_signs: {
      blood_pressure: '',
      temperature: '',
      pulse: '',
      weight: ''
    },
    personal_notes: ''
  });

  useEffect(() => {
    const fetchRecord = async () => {
      if (!id) return;
      
      try {
        setFetchLoading(true);
        const record = await healthRecordsApi.getRecord(parseInt(id));
        setFormData({
          record_date: record.record_date,
          record_time: record.record_time,
          site: record.site || '',
          onset: record.onset || '',
          character: record.character || '',
          radiation: record.radiation || '',
          associations: record.associations || '',
          time_course: record.time_course || '',
          exacerbating_factors: record.exacerbating_factors || '',
          severity: record.severity || 1,
          palliating_factors: record.palliating_factors || '',
          quality: record.quality || '',
          region: record.region || '',
          symptoms: record.symptoms || '',
          medications: record.medications || '',
          diet_notes: record.diet_notes || '',
          vital_signs: record.vital_signs || {
            blood_pressure: '',
            temperature: '',
            pulse: '',
            weight: ''
          },
          personal_notes: record.personal_notes || ''
        });
      } catch (err) {
        setError('Failed to fetch record details');
        console.error('Error fetching record:', err);
      } finally {
        setFetchLoading(false);
      }
    };

    fetchRecord();
  }, [id]);

  const handleInputChange = (field: keyof CreateHealthRecordData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // const handleVitalSignChange = (field: string, value: string) => {
  //   setFormData(prev => ({
  //     ...prev,
  //     vital_signs: { ...prev.vital_signs, [field]: value }
  //   }));
  // };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;
    
    setLoading(true);
    setError(null);
    
    try {
      // Note: This would require implementing updateRecord in the API service
      // await healthRecordsApi.updateRecord(parseInt(id), formData);
      navigate(`/records/${id}`);
    } catch (error: any) {
      console.error('Failed to update record:', error);
      setError(error.response?.data?.error || 'Failed to update health record. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (fetchLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center space-x-4">
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="flex items-center space-x-2"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back</span>
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Edit Health Record</h1>
          <p className="text-gray-600 mt-1">Update your health information</p>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <Card>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Date"
              type="date"
              value={formData.record_date}
              onChange={(e) => handleInputChange('record_date', e.target.value)}
              required
            />
            <Input
              label="Time"
              type="time"
              value={formData.record_time}
              onChange={(e) => handleInputChange('record_time', e.target.value)}
              required
            />
          </div>
        </Card>

        {/* SOCRATES Framework */}
        <Card>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Symptom Details (SOCRATES)</h2>
          <div className="space-y-4">
            <Input
              label="Site (Where is the problem?)"
              value={formData.site || ''}
              onChange={(e) => handleInputChange('site', e.target.value)}
              placeholder="e.g., chest, abdomen, head"
            />
            <Input
              label="Onset (When did it start?)"
              value={formData.onset || ''}
              onChange={(e) => handleInputChange('onset', e.target.value)}
              placeholder="e.g., sudden, gradual, 2 hours ago"
            />
            <Input
              label="Character (What does it feel like?)"
              value={formData.character || ''}
              onChange={(e) => handleInputChange('character', e.target.value)}
              placeholder="e.g., sharp, dull, burning, cramping"
            />
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Severity (1-10 scale)
              </label>
              <input
                type="range"
                min="1"
                max="10"
                value={formData.severity}
                onChange={(e) => handleInputChange('severity', parseInt(e.target.value))}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>1 (Mild)</span>
                <span className="font-medium">{formData.severity}/10</span>
                <span>10 (Severe)</span>
              </div>
            </div>
          </div>
        </Card>

        {/* Submit Button */}
        <div className="flex justify-end space-x-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate(-1)}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            loading={loading}
            className="flex items-center space-x-2"
          >
            <Save className="h-4 w-4" />
            <span>Update Record</span>
          </Button>
        </div>
      </form>
    </div>
  );
};

export default EditRecordPage;