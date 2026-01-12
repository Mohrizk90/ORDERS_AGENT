import { useState, useEffect } from 'react';
import { AlertCircle, X, RefreshCw, CheckCircle } from 'lucide-react';
import { isSupabaseConfigured } from '../../lib/supabase';
import { testSupabaseConnection } from '../../utils/testSupabaseConnection';

export default function ConnectionStatus() {
  const [isConfigured, setIsConfigured] = useState(true);
  const [connectionStatus, setConnectionStatus] = useState(null);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const configured = isSupabaseConfigured();
    setIsConfigured(configured);

    if (!configured && !dismissed) {
      // Auto-test connection if not configured
      testSupabaseConnection().then(result => {
        setConnectionStatus(result);
      });
    }
  }, [dismissed]);

  // Don't show if configured or dismissed
  if (isConfigured || dismissed || connectionStatus?.connected) {
    return null;
  }

  return (
    <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6 animate-fade-in">
      <div className="flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
        <div className="flex-1">
          <h3 className="text-sm font-semibold text-yellow-800 mb-1">
            Supabase Connection Not Configured
          </h3>
          <p className="text-sm text-yellow-700 mb-3">
            Please configure your Supabase credentials in <code className="bg-yellow-100 px-1 rounded">.env.local</code> or enable mock data mode.
          </p>
          <div className="flex items-center gap-2">
            <a
              href="/settings"
              className="text-sm text-yellow-800 hover:text-yellow-900 font-medium underline"
            >
              Go to Settings to test connection
            </a>
            <span className="text-yellow-600">•</span>
            <button
              onClick={() => setDismissed(true)}
              className="text-sm text-yellow-800 hover:text-yellow-900"
            >
              Dismiss
            </button>
          </div>
        </div>
        <button
          onClick={() => setDismissed(true)}
          className="text-yellow-600 hover:text-yellow-800"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
