import { AlertCircle, RefreshCw, X } from 'lucide-react';

export default function ErrorMessage({ 
  message = 'An error occurred', 
  onRetry = null,
  onDismiss = null,
  variant = 'inline', // 'inline', 'card', 'banner'
  className = '' 
}) {
  if (variant === 'banner') {
    return (
      <div className={`bg-red-50 border-l-4 border-red-500 p-4 ${className}`}>
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm text-red-700">{message}</p>
          </div>
          <div className="flex items-center gap-2">
            {onRetry && (
              <button
                onClick={onRetry}
                className="text-red-600 hover:text-red-800 p-1 rounded hover:bg-red-100"
                title="Retry"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            )}
            {onDismiss && (
              <button
                onClick={onDismiss}
                className="text-red-600 hover:text-red-800 p-1 rounded hover:bg-red-100"
                title="Dismiss"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (variant === 'card') {
    return (
      <div className={`card border-red-200 bg-red-50 ${className}`}>
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <AlertCircle className="w-12 h-12 text-red-400 mb-3" />
          <p className="text-gray-700 mb-4">{message}</p>
          {onRetry && (
            <button onClick={onRetry} className="btn btn-secondary">
              <RefreshCw className="w-4 h-4 mr-2" />
              Try Again
            </button>
          )}
        </div>
      </div>
    );
  }

  // Default inline variant
  return (
    <div className={`flex items-center gap-2 text-red-600 text-sm ${className}`}>
      <AlertCircle className="w-4 h-4 flex-shrink-0" />
      <span>{message}</span>
      {onRetry && (
        <button
          onClick={onRetry}
          className="ml-2 text-red-700 hover:text-red-800 underline"
        >
          Retry
        </button>
      )}
    </div>
  );
}

export function TableError({ message, onRetry }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <AlertCircle className="w-10 h-10 text-red-400 mb-3" />
      <p className="text-gray-600 mb-4">{message || 'Failed to load data'}</p>
      {onRetry && (
        <button onClick={onRetry} className="btn btn-secondary">
          <RefreshCw className="w-4 h-4 mr-2" />
          Retry
        </button>
      )}
    </div>
  );
}
