import React from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { formatDate, formatTime, getSeverityColor, getSeverityLabel } from '@/utils/formatters';
import { Calendar, Clock, MapPin, Activity, Pill, Brain, CheckCircle } from 'lucide-react';
import type { HealthRecord } from '@/types';

interface HealthRecordCardProps {
  record: HealthRecord;
  onAnalyze?: (recordId: number) => void;
}

const HealthRecordCard: React.FC<HealthRecordCardProps> = ({ record, onAnalyze }) => {
  const navigate = useNavigate();
  
  const handleCardClick = (e: React.MouseEvent) => {
    // Prevent navigation if clicking on interactive elements
    const target = e.target as HTMLElement;
    if (target.closest('button') || target.closest('a') || target.closest('[role="button"]')) {
      return;
    }
    e.preventDefault();
    e.stopPropagation();
    console.log('Navigating to record:', record.id);
    navigate(`/dashboard/records/${record.id}`);
  };
  
  return (
    <Card hover className="cursor-pointer" onClick={handleCardClick}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-4">
        <div className="flex flex-wrap items-center gap-2">
          <div className="inline-flex items-center gap-1.5 text-xs text-muted-foreground bg-muted px-2.5 py-1 rounded-md">
            <Calendar className="h-3.5 w-3.5" />
            <span className="font-medium">{formatDate(record.record_date)}</span>
          </div>
          <div className="inline-flex items-center gap-1.5 text-xs text-muted-foreground bg-muted px-2.5 py-1 rounded-md">
            <Clock className="h-3.5 w-3.5" />
            <span className="font-medium">{formatTime(record.record_time)}</span>
          </div>
          {record.ai_analysis && (
            <div className="inline-flex items-center gap-1 text-xs text-green-600 dark:text-green-400 bg-green-500/10 px-2.5 py-1 rounded-md">
              <CheckCircle className="h-3.5 w-3.5" />
              <span className="font-medium">Analyzed</span>
            </div>
          )}
        </div>
        
        {record.severity && (
          <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${getSeverityColor(record.severity)}`}>
            {getSeverityLabel(record.severity)} {record.severity}/10
          </span>
        )}
      </div>

      {/* Content */}
      <div className="space-y-2.5">
        {record.site && (
          <div className="flex items-start gap-2">
            <MapPin className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <span className="text-sm font-medium text-foreground">Location: </span>
              <span className="text-sm text-muted-foreground">{record.site}</span>
            </div>
          </div>
        )}

        {record.character && (
          <div className="flex items-start gap-2">
            <Activity className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <span className="text-sm font-medium text-foreground">Description: </span>
              <span className="text-sm text-muted-foreground">{record.character}</span>
            </div>
          </div>
        )}

        {record.symptoms && (
          <div className="flex items-start gap-2">
            <Activity className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <span className="text-sm font-medium text-foreground">Symptoms: </span>
              <span className="text-sm text-muted-foreground line-clamp-2">{record.symptoms}</span>
            </div>
          </div>
        )}

        {record.medications && (
          <div className="flex items-start gap-2">
            <Pill className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <span className="text-sm font-medium text-foreground">Medications: </span>
              <span className="text-sm text-muted-foreground">{record.medications}</span>
            </div>
          </div>
        )}

        {record.vital_signs && Object.values(record.vital_signs).some(v => v) && (
          <div className="mt-3 bg-primary/5 p-3 rounded-lg border border-primary/10">
            <h4 className="text-xs font-semibold text-foreground mb-2 flex items-center gap-1.5">
              <Activity className="h-3.5 w-3.5 text-primary" />
              Vital Signs
            </h4>
            <div className="grid grid-cols-2 gap-2 text-xs">
              {record.vital_signs.blood_pressure && (
                <div className="bg-background/60 px-2 py-1.5 rounded">
                  <span className="text-muted-foreground">BP:</span>
                  <span className="ml-1 font-medium text-foreground">{record.vital_signs.blood_pressure}</span>
                </div>
              )}
              {record.vital_signs.temperature && (
                <div className="bg-background/60 px-2 py-1.5 rounded">
                  <span className="text-muted-foreground">Temp:</span>
                  <span className="ml-1 font-medium text-foreground">{record.vital_signs.temperature}°F</span>
                </div>
              )}
              {record.vital_signs.pulse && (
                <div className="bg-background/60 px-2 py-1.5 rounded">
                  <span className="text-muted-foreground">Pulse:</span>
                  <span className="ml-1 font-medium text-foreground">{record.vital_signs.pulse} bpm</span>
                </div>
              )}
              {record.vital_signs.weight && (
                <div className="bg-background/60 px-2 py-1.5 rounded">
                  <span className="text-muted-foreground">Weight:</span>
                  <span className="ml-1 font-medium text-foreground">{record.vital_signs.weight} lbs</span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Actions */}
      {onAnalyze && (
        <div className="flex items-center justify-end gap-2 mt-4 pt-3 border-t border-border">
          <Button
            variant="outline"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onAnalyze(record.id);
            }}
            className="w-full sm:w-auto"
          >
            <Brain className="h-4 w-4" />
            <span>{record.ai_analysis ? 'Re-analyze' : 'Analyze'}</span>
          </Button>
        </div>
      )}
    </Card>
  );
};

export default HealthRecordCard;