import { useState, useEffect, useCallback } from 'react';
import { AlertTriangle, DollarSign, Clock, CheckCircle, X, ArrowRight } from 'lucide-react';
import { getAlerts, markAlertRead } from '../../services/statsService';
import { formatCurrency, formatDateTime } from '../../utils/dataTransformers';
import { useRealtimeRefresh } from '../../hooks/useRealtimeSubscription';
import { CardLoadingSpinner } from '../common/LoadingSpinner';

const alertIcons = {
  high_value: DollarSign,
  overdue: Clock,
  processed: CheckCircle,
};

const alertColors = {
  high_value: 'border-red-200 bg-red-50',
  overdue: 'border-yellow-200 bg-yellow-50',
  processed: 'border-green-200 bg-green-50',
};

const alertIconColors = {
  high_value: 'text-red-600 bg-red-100',
  overdue: 'text-yellow-600 bg-yellow-100',
  processed: 'text-green-600 bg-green-100',
};

export default function AlertsPanel() {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAlerts = useCallback(async () => {
    const result = await getAlerts({ unreadOnly: true });
    if (result.success) {
      setAlerts(result.data || []);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchAlerts();
  }, [fetchAlerts]);

  // Real-time subscription
  useRealtimeRefresh('alerts', fetchAlerts);

  const handleDismiss = async (alertId) => {
    await markAlertRead(alertId);
    setAlerts(prev => prev.filter(a => a.id !== alertId));
  };

  if (loading) {
    return (
      <div className="card">
        <CardLoadingSpinner />
      </div>
    );
  }

  if (alerts.length === 0) {
    return null;
  }

  return (
    <div className="card border-l-4 border-l-red-500">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-red-600" />
          <h3 className="text-lg font-semibold text-gray-900">Active Alerts</h3>
          <span className="bg-red-100 text-red-600 text-xs font-medium px-2 py-0.5 rounded-full">
            {alerts.length}
          </span>
        </div>
        <a 
          href="/notifications" 
          className="text-sm text-primary-600 hover:text-primary-700 font-medium flex items-center gap-1"
        >
          View all
          <ArrowRight className="w-4 h-4" />
        </a>
      </div>

      <div className="space-y-3">
        {alerts.slice(0, 3).map((alert) => {
          const Icon = alertIcons[alert.type] || AlertTriangle;
          const colorClass = alertColors[alert.type] || 'border-gray-200 bg-gray-50';
          const iconColorClass = alertIconColors[alert.type] || 'text-gray-600 bg-gray-100';
          
          return (
            <div
              key={alert.id}
              className={`flex items-start gap-3 p-4 rounded-xl border ${colorClass}`}
            >
              <div className={`p-2 rounded-lg ${iconColorClass}`}>
                <Icon className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {alert.title}
                    </p>
                    <p className="text-sm text-gray-600 mt-0.5">
                      {alert.message}
                    </p>
                    {alert.amount && (
                      <p className="text-sm font-semibold text-gray-900 mt-1">
                        {formatCurrency(alert.amount)}
                      </p>
                    )}
                  </div>
                  <button 
                    onClick={() => handleDismiss(alert.id)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  {formatDateTime(alert.timestamp)}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
