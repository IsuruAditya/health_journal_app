import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Brain, AlertTriangle, CheckCircle, Clock, TrendingUp } from 'lucide-react'
import Button from '@/components/ui/Button'
import type { HealthAnalysis } from '@/types'

interface AnalysisModalProps {
  analysis: HealthAnalysis | null
  isOpen: boolean
  onClose: () => void
}

const AnalysisModal: React.FC<AnalysisModalProps> = ({ analysis, isOpen, onClose }) => {
  if (!analysis) return null

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm"
            onClick={onClose}
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-xl">
                  <Brain className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">AI Health Analysis</h2>
                  <p className="text-sm text-gray-600">Record #{analysis.recordId}</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>

            {/* Content */}
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
              <div className="space-y-6">
                {/* Severity Overview */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-xl border border-blue-200">
                    <div className="flex items-center gap-2 mb-2">
                      <TrendingUp className="h-4 w-4 text-blue-600" />
                      <span className="text-sm font-medium text-blue-900">Severity Level</span>
                    </div>
                    <p className="text-2xl font-bold text-blue-700">{analysis.symptomSeverity}/10</p>
                  </div>
                  
                  <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-xl border border-green-200">
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="text-sm font-medium text-green-900">Analysis Date</span>
                    </div>
                    <p className="text-sm font-semibold text-green-700">
                      {new Date(analysis.analysisDate).toLocaleDateString()}
                    </p>
                  </div>
                  
                  <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-xl border border-purple-200">
                    <div className="flex items-center gap-2 mb-2">
                      <Clock className="h-4 w-4 text-purple-600" />
                      <span className="text-sm font-medium text-purple-900">Trends</span>
                    </div>
                    <p className="text-sm font-semibold text-purple-700 capitalize">
                      {analysis.trends.severityTrend}
                    </p>
                  </div>
                </div>

                {/* Red Flags */}
                {analysis.redFlags.length > 0 && (
                  <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <AlertTriangle className="h-5 w-5 text-red-600" />
                      <h3 className="font-semibold text-red-900">Important Alerts</h3>
                    </div>
                    <ul className="space-y-2">
                      {analysis.redFlags.map((flag, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-sm text-red-700">
                          <div className="w-1.5 h-1.5 bg-red-500 rounded-full mt-2 flex-shrink-0" />
                          {flag}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Symptom Patterns */}
                <div className="bg-white border border-gray-200 rounded-xl p-4">
                  <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full" />
                    Symptom Patterns
                  </h3>
                  <div className="grid gap-2">
                    {analysis.symptomPattern.map((pattern, idx) => (
                      <div key={idx} className="bg-gray-50 rounded-lg p-3 text-sm text-gray-700">
                        {pattern}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Risk Factors */}
                <div className="bg-white border border-gray-200 rounded-xl p-4">
                  <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <div className="w-2 h-2 bg-orange-500 rounded-full" />
                    Risk Factors
                  </h3>
                  <div className="grid gap-2">
                    {analysis.riskFactors.map((risk, idx) => (
                      <div key={idx} className="bg-orange-50 border border-orange-200 rounded-lg p-3 text-sm text-orange-800">
                        {risk}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recommendations */}
                <div className="bg-white border border-gray-200 rounded-xl p-4">
                  <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full" />
                    Recommendations
                  </h3>
                  <div className="space-y-3">
                    {analysis.recommendations.map((rec, idx) => (
                      <div key={idx} className="flex items-start gap-3 bg-green-50 border border-green-200 rounded-lg p-3">
                        <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-green-800">{rec}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Disclaimer */}
                <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
                  <p className="text-xs text-gray-600 leading-relaxed">
                    <strong>Medical Disclaimer:</strong> This AI analysis is for informational purposes only and should not replace professional medical advice, diagnosis, or treatment. Always consult with a qualified healthcare provider for medical concerns.
                  </p>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50">
              <Button variant="secondary" onClick={onClose}>
                Close
              </Button>
              <Button onClick={() => window.print()}>
                Export Report
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}

export default AnalysisModal