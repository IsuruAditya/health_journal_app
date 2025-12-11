import React from 'react'
import { ErrorBoundary as ReactErrorBoundary } from 'react-error-boundary'
import { AlertTriangle, RefreshCw } from 'lucide-react'
import Button from '@/components/ui/Button'

interface ErrorFallbackProps {
  error: Error
  resetErrorBoundary: () => void
}

function ErrorFallback({ error, resetErrorBoundary }: ErrorFallbackProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-6 text-center">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <AlertTriangle className="w-8 h-8 text-red-600" />
        </div>
        
        <h1 className="text-xl font-semibold text-gray-900 mb-2">
          Something went wrong
        </h1>
        
        <p className="text-gray-600 mb-6">
          We encountered an unexpected error. Please try refreshing the page.
        </p>
        
        <div className="space-y-3">
          <Button onClick={resetErrorBoundary} className="w-full">
            <RefreshCw className="w-4 h-4 mr-2" />
            Try again
          </Button>
          
          <details className="text-left">
            <summary className="text-sm text-gray-500 cursor-pointer hover:text-gray-700">
              Error details
            </summary>
            <pre className="mt-2 text-xs text-red-600 bg-red-50 p-2 rounded border overflow-auto">
              {error.message}
            </pre>
          </details>
        </div>
      </div>
    </div>
  )
}

interface ErrorBoundaryProps {
  children: React.ReactNode
}

export function ErrorBoundary({ children }: ErrorBoundaryProps) {
  return (
    <ReactErrorBoundary
      FallbackComponent={ErrorFallback}
      onError={(error, errorInfo) => {
        console.error('Error caught by boundary:', error, errorInfo)
      }}
    >
      {children}
    </ReactErrorBoundary>
  )
}