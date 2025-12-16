import React from 'react';
import { AlertTriangle, Phone } from 'lucide-react';

interface MedicalDisclaimerProps {
  variant?: 'banner' | 'card' | 'footer';
}

const MedicalDisclaimer: React.FC<MedicalDisclaimerProps> = ({ variant = 'card' }) => {
  if (variant === 'banner') {
    return (
      <div className="bg-red-500 text-white px-4 py-2 text-center text-sm font-medium flex items-center justify-center gap-2">
        <Phone className="h-4 w-4" />
        <span>🚨 Emergency? Call 911 immediately</span>
      </div>
    );
  }

  if (variant === 'footer') {
    return (
      <footer className="mt-8 pt-6 border-t border-border">
        <p className="text-xs text-muted-foreground text-center max-w-2xl mx-auto">
          <strong>Medical Disclaimer:</strong> This app is for tracking purposes only and is not a substitute for professional medical advice, diagnosis, or treatment. 
          Always seek the advice of your physician or other qualified health provider with any questions you may have regarding a medical condition. 
          Never disregard professional medical advice or delay in seeking it because of something you have read in this app.
        </p>
      </footer>
    );
  }

  return (
    <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-4">
      <div className="flex gap-3">
        <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
        <div className="text-sm space-y-2">
          <p className="font-semibold text-amber-900 dark:text-amber-100">
            Medical Disclaimer
          </p>
          <p className="text-amber-800 dark:text-amber-200">
            This app is for tracking purposes only. Always consult healthcare professionals for medical advice, diagnosis, or treatment.
          </p>
          <p className="text-amber-800 dark:text-amber-200 font-medium">
            In case of emergency, call 911 or your local emergency number immediately.
          </p>
        </div>
      </div>
    </div>
  );
};

export default MedicalDisclaimer;
