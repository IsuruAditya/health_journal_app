import React from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { formatDate, formatTime, getSeverityColor, getSeverityLabel } from '@/utils/formatters';
import { Calendar, Clock, MapPin, Activity, Pill, Brain } from 'lucide-react';
import type { HealthRecord } from '@/types';

interface HealthRecordCardProps {
  record: HealthRecord;
  onAnalyze?: (recordId: number) => void;
}

const HealthRecordCard: React.FC<HealthRecordCardProps> = ({ record, onAnalyze }) => {
  const navigate = useNavigate();
  return (
    <Card className="hover:shadow-lg transition-all duration-200 hover:border-blue-200">
      <div className="flex justify-between items-start mb-6">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 text-sm text-gray-500 bg-gray-50 px-3 py-1.5 rounded-lg">
            <Calendar className="h-4 w-4" />
            <span className="font-medium">{formatDate(record.record_date)}</span>
          </div>
          <div className="flex items-center space-x-2 text-sm text-gray-500 bg-gray-50 px-3 py-1.5 rounded-lg">
            <Clock className="h-4 w-4" />
            <span className="font-medium">{formatTime(record.record_time)}</span>
          </div>
        </div>
        
        {record.severity && (
          <span className={`px-3 py-1.5 rounded-full text-xs font-semibold ${getSeverityColor(record.severity)}`}>
            {getSeverityLabel(record.severity)} ({record.severity}/10)
          </span>
        )}
      </div>

      <div className="space-y-3">
        {record.site && (
          <div className="flex items-start space-x-2">
            <MapPin className="h-4 w-4 text-gray-400 mt-0.5" />
            <div>
              <span className="text-sm font-medium text-gray-700">Location: </span>
              <span className="text-sm text-gray-600">{record.site}</span>
            </div>
          </div>
        )}

        {record.character && (
          <div className="flex items-start space-x-2">
            <Activity className="h-4 w-4 text-gray-400 mt-0.5" />
            <div>
              <span className="text-sm font-medium text-gray-700">Description: </span>
              <span className="text-sm text-gray-600">{record.character}</span>
            </div>
          </div>
        )}

        {record.symptoms && (
          <div className="flex items-start space-x-2">
            <Activity className="h-4 w-4 text-gray-400 mt-0.5" />
            <div>
              <span className="text-sm font-medium text-gray-700">Symptoms: </span>
              <span className="text-sm text-gray-600">{record.symptoms}</span>
            </div>
          </div>
        )}

        {record.medications && (
          <div className="flex items-start space-x-2">
            <Pill className="h-4 w-4 text-gray-400 mt-0.5" />
            <div>
              <span className="text-sm font-medium text-gray-700">Medications: </span>
              <span className="text-sm text-gray-600">{record.medications}</span>
            </div>
          </div>
        )}

        {record.vital_signs && Object.values(record.vital_signs).some(v => v) && (
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-xl border border-blue-100">
            <h4 className="text-sm font-semibold text-gray-800 mb-3 flex items-center gap-2">
              <Activity className="h-4 w-4 text-blue-600" />
              Vital Signs
            </h4>
            <div className="grid grid-cols-2 gap-3 text-sm">
              {record.vital_signs.blood_pressure && (
                <div className="bg-white/60 px-2 py-1 rounded-lg">
                  <span className="font-medium text-gray-700">BP: {record.vital_signs.blood_pressure}</span>
                </div>
              )}
              {record.vital_signs.temperature && (
                <div className="bg-white/60 px-2 py-1 rounded-lg">
                  <span className="font-medium text-gray-700">Temp: {record.vital_signs.temperature}°F</span>
                </div>
              )}
              {record.vital_signs.pulse && (
                <div className="bg-white/60 px-2 py-1 rounded-lg">
                  <span className="font-medium text-gray-700">Pulse: {record.vital_signs.pulse} bpm</span>
                </div>
              )}
              {record.vital_signs.weight && (
                <div className="bg-white/60 px-2 py-1 rounded-lg">
                  <span className="font-medium text-gray-700">Weight: {record.vital_signs.weight} lbs</span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="flex justify-between items-center mt-6 pt-4 border-t border-gray-100">
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => navigate(`/records/${record.id}`)}
        >
          View Details
        </Button>
        
        {onAnalyze && (
          <Button
            size="sm"
            onClick={() => onAnalyze(record.id)}
            className="flex items-center space-x-1"
          >
            <Brain className="h-4 w-4" />
            <span>AI Analysis</span>
          </Button>
        )}
      </div>
    </Card>
  );
};

export default HealthRecordCard;