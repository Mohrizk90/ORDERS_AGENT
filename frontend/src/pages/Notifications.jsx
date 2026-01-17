import { useState, useEffect, useCallback } from 'react';
import { Bell, CheckCircle, AlertTriangle, DollarSign, Clock, Trash2 } from 'lucide-react';
import { getAlerts, markAlertRead } from '../services/statsService';
import { formatCurrency, formatDateTime } from '../utils/dataTransformers';
import { CardLoadingSpinner } from '../components/common/LoadingSpinner';
import { useToast } from '../components/common/Toast';

const alertIcons = {
  high_value: DollarSign,
  overdue: Clock,
  processed: CheckCircle,
};

const alertColors = {
  high_value: 'bg-red-100 text-red-600',
  overdue: 'bg-yellow-100 text-yellow-600',
  processed: 'bg-green-100 text-green-600',
};

export default function Notifications() {
  // Temporarily disabled - alerts table not accessible
  const [alerts] = useState([]);
  const [loading] = useState(false);
  const toast = useToast();

  /* DISABLED - Enable when alerts table is accessible
  const fetchAlerts = useCallback(async () => {
    setLoading(true);
    const result = await getAlerts();
    if (result.success) {
      setAlerts(result.data || []);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchAlerts();
  }, [fetchAlerts]);
  */

  const handleMarkRead = async (alertId) => {
    const result = await markAlertRead(alertId);
    if (result.success) {
      setAlerts(prev => prev.map(a => 
        a.id === alertId ? { ...a, read: true } : a
      ));
    }
  };

  const handleMarkAllRead = async () => {
    const unreadAlerts = alerts.filter(a => !a.read);
    await Promise.all(unreadAlerts.map(a => markAlertRead(a.id)));
    setAlerts(prev => prev.map(a => ({ ...a, read: true })));
    toast.success('All notifications marked as read');
  };

  const handleDelete = (alertId) => {
    setAlerts(prev => prev.filter(a => a.id !== alertId));
    toast.success('Notification deleted');
  };

  if (loading) {
    return (
      <div className="space-y-6 animate-fade-in max-w-4xl">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
          <p className="text-gray-500 mt-1">Stay updated with alerts and activity</p>
        </div>
        <div className="card">
          <CardLoadingSpinner />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in max-w-4xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
          <p className="text-gray-500 mt-1">Stay updated with alerts and activity</p>
        </div>
        {alerts.some(a => !a.read) && (
          <button onClick={handleMarkAllRead} className="btn btn-secondary">
            Mark all as read
          </button>
        )}
      </div>

      {/* Notification List */}
      <div className="card">
        {alerts.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <Bell className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p>No notifications</p>
          </div>
        ) : (
          <div className="space-y-1">
            {alerts.map((alert) => {
              const Icon = alertIcons[alert.type] || Bell;
              const colorClass = alertColors[alert.type] || 'bg-gray-100 text-gray-600';

              return (
                <div
                  key={alert.id}
                  className={`flex items-start gap-4 p-4 rounded-lg transition-colors hover:bg-gray-50 ${
                    !alert.read ? 'bg-primary-50' : ''
                  }`}
                  onClick={() => !alert.read && handleMarkRead(alert.id)}
                >
                  <div className={`p-2 rounded-lg ${colorClass}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="font-medium text-gray-900">{alert.title}</p>
                        <p className="text-sm text-gray-600 mt-1">{alert.message}</p>
                        {alert.amount && (
                          <p className="text-sm font-semibold text-gray-900 mt-2">
                            Amount: {formatCurrency(alert.amount)}
                          </p>
                        )}
                      </div>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(alert.id);
                        }}
                        className="p-2 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <p className="text-xs text-gray-400 mt-2">
                      {formatDateTime(alert.timestamp)}
                    </p>
                  </div>
                  {!alert.read && (
                    <div className="w-2 h-2 bg-primary-600 rounded-full mt-2" />
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
