import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useHealthRecords } from '@/hooks/useHealthRecords';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Card from '@/components/ui/Card';
import { ArrowLeft, Save } from 'lucide-react';
import type { CreateHealthRecordData } from '@/types';

const NewRecordPage: React.FC = () => {
  console.log('NewRecordPage rendered');
  const navigate = useNavigate();
  const { createRecord } = useHealthRecords();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<CreateHealthRecordData>({
    record_date: new Date().toISOString().split('T')[0],
    record_time: new Date().toTimeString().slice(0, 5),
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

  const handleInputChange = (field: keyof CreateHealthRecordData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleVitalSignChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      vital_signs: { ...prev.vital_signs, [field]: value }
    }));
  };

  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      await createRecord(formData);
      
      // Show success toast
      if (typeof window !== 'undefined') {
        // Simple success notification without importing toast here
        console.log('Health record created successfully');
      }
      
      navigate('/records');
    } catch (error: any) {
      console.error('Failed to create record:', error);
      setError(error.response?.data?.error || 'Failed to create health record. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-20">
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
          <h1 className="text-3xl font-bold text-foreground">New Health Record</h1>
          <p className="text-muted-foreground mt-1">Record your health information</p>
        </div>
      </div>

      {error && (
        <div className="bg-destructive/10 border border-destructive/20 text-destructive px-4 py-3 rounded-lg flex items-center gap-2">
          <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <Card>
          <h2 className="text-lg font-semibold text-foreground mb-4">Basic Information</h2>
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
          <h2 className="text-lg font-semibold text-foreground mb-4">Symptom Details (SOCRATES)</h2>
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
            <Input
              label="Radiation (Does it spread anywhere?)"
              value={formData.radiation || ''}
              onChange={(e) => handleInputChange('radiation', e.target.value)}
              placeholder="e.g., to arm, back, jaw"
            />
            <Input
              label="Associations (Any other symptoms?)"
              value={formData.associations || ''}
              onChange={(e) => handleInputChange('associations', e.target.value)}
              placeholder="e.g., nausea, sweating, shortness of breath"
            />
            <Input
              label="Time Course (How has it changed?)"
              value={formData.time_course || ''}
              onChange={(e) => handleInputChange('time_course', e.target.value)}
              placeholder="e.g., constant, intermittent, getting worse"
            />
            <Input
              label="Exacerbating Factors (What makes it worse?)"
              value={formData.exacerbating_factors || ''}
              onChange={(e) => handleInputChange('exacerbating_factors', e.target.value)}
              placeholder="e.g., movement, eating, stress"
            />
            <div className="space-y-3">
              <label className="block text-sm font-medium text-foreground">
                Severity (1-10 scale)
              </label>
              <div className="px-4 py-3 bg-muted rounded-lg">
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={formData.severity}
                  onChange={(e) => handleInputChange('severity', parseInt(e.target.value))}
                  className="w-full h-2 bg-muted-foreground/20 rounded-lg appearance-none cursor-pointer slider"
                />
                <div className="flex justify-between text-xs text-muted-foreground mt-2">
                  <span>1 (Mild)</span>
                  <span className={`font-semibold px-2 py-1 rounded-full text-xs ${
                    (formData.severity || 0) >= 8 ? 'bg-destructive/10 text-destructive' :
                    (formData.severity || 0) >= 6 ? 'bg-orange-500/10 text-orange-700 dark:text-orange-400' :
                    (formData.severity || 0) >= 4 ? 'bg-yellow-500/10 text-yellow-700 dark:text-yellow-400' :
                    'bg-green-500/10 text-green-700 dark:text-green-400'
                  }`}>
                    {formData.severity || 0}/10
                  </span>
                  <span>10 (Severe)</span>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Additional Information */}
        <Card>
          <h2 className="text-lg font-semibold text-foreground mb-4">Additional Information</h2>
          <div className="space-y-4">
            <Input
              label="Palliating Factors (What makes it better?)"
              value={formData.palliating_factors || ''}
              onChange={(e) => handleInputChange('palliating_factors', e.target.value)}
              placeholder="e.g., rest, medication, heat"
            />
            <Input
              label="General Symptoms"
              value={formData.symptoms || ''}
              onChange={(e) => handleInputChange('symptoms', e.target.value)}
              placeholder="Describe any other symptoms"
            />
            <Input
              label="Current Medications"
              value={formData.medications || ''}
              onChange={(e) => handleInputChange('medications', e.target.value)}
              placeholder="List any medications you're taking"
            />
            <Input
              label="Diet Notes"
              value={formData.diet_notes || ''}
              onChange={(e) => handleInputChange('diet_notes', e.target.value)}
              placeholder="Any relevant dietary information"
            />
          </div>
        </Card>

        {/* Vital Signs */}
        <Card>
          <h2 className="text-lg font-semibold text-foreground mb-4">Vital Signs</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Blood Pressure"
              value={formData.vital_signs?.blood_pressure || ''}
              onChange={(e) => handleVitalSignChange('blood_pressure', e.target.value)}
              placeholder="e.g., 120/80"
            />
            <Input
              label="Temperature (°F)"
              value={formData.vital_signs?.temperature || ''}
              onChange={(e) => handleVitalSignChange('temperature', e.target.value)}
              placeholder="e.g., 98.6"
            />
            <Input
              label="Pulse (bpm)"
              value={formData.vital_signs?.pulse || ''}
              onChange={(e) => handleVitalSignChange('pulse', e.target.value)}
              placeholder="e.g., 72"
            />
            <Input
              label="Weight (lbs)"
              value={formData.vital_signs?.weight || ''}
              onChange={(e) => handleVitalSignChange('weight', e.target.value)}
              placeholder="e.g., 150"
            />
          </div>
        </Card>

        {/* Personal Notes */}
        <Card>
          <h2 className="text-lg font-semibold text-foreground mb-4">Personal Notes</h2>
          <textarea
            className="w-full px-3 py-2.5 bg-background text-foreground border border-input rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-ring focus:border-ring transition-colors placeholder:text-muted-foreground resize-none"
            rows={4}
            value={formData.personal_notes || ''}
            onChange={(e) => handleInputChange('personal_notes', e.target.value)}
            placeholder="Any additional notes or observations..."
          />
        </Card>

        {/* Submit Button */}
        <div className="sticky bottom-0 bg-card border-t border-border p-6 -mx-6 -mb-6 rounded-b-xl">
          <div className="flex justify-end space-x-4">
            <Button
              type="button"
              variant="secondary"
              onClick={() => navigate(-1)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              loading={loading}
              className="min-w-[120px]"
            >
              <Save className="h-4 w-4" />
              <span>Save Record</span>
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default NewRecordPage;