import { Bell, CheckCircle, AlertTriangle, DollarSign, Clock, Trash2 } from 'lucide-react';
import { mockAlerts, formatCurrency, formatDateTime } from '../data/mockData';

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
  return (
    <div className="space-y-6 animate-fade-in max-w-4xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
          <p className="text-gray-500 mt-1">Stay updated with alerts and activity</p>
        </div>
        <button className="btn btn-secondary">
          Mark all as read
        </button>
      </div>

      {/* Notification List */}
      <div className="card">
        <div className="space-y-1">
          {mockAlerts.map((alert, index) => {
            const Icon = alertIcons[alert.type] || Bell;
            const colorClass = alertColors[alert.type] || 'bg-gray-100 text-gray-600';

            return (
              <div
                key={alert.id}
                className={`flex items-start gap-4 p-4 rounded-lg transition-colors hover:bg-gray-50 ${
                  !alert.read ? 'bg-primary-50' : ''
                }`}
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
                    <button className="p-2 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50">
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
      </div>
    </div>
  );
}
