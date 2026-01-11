import { 
  FileText, 
  Receipt, 
  CheckCircle, 
  AlertTriangle, 
  Download,
  ArrowRight
} from 'lucide-react';
import { mockRecentActivity, formatDateTime } from '../../data/mockData';

const activityIcons = {
  created: FileText,
  processed: Receipt,
  updated: CheckCircle,
  exported: Download,
  alert: AlertTriangle,
};

const activityColors = {
  created: 'bg-blue-100 text-blue-600',
  processed: 'bg-green-100 text-green-600',
  updated: 'bg-purple-100 text-purple-600',
  exported: 'bg-gray-100 text-gray-600',
  alert: 'bg-yellow-100 text-yellow-600',
};

export default function RecentActivity() {
  return (
    <div className="card">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
        <button className="text-sm text-primary-600 hover:text-primary-700 font-medium flex items-center gap-1">
          View all
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      <div className="space-y-4">
        {mockRecentActivity.map((activity) => {
          const Icon = activityIcons[activity.action] || FileText;
          const colorClass = activityColors[activity.action] || 'bg-gray-100 text-gray-600';
          
          return (
            <div
              key={activity.id}
              className="flex items-start gap-4 p-3 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className={`p-2 rounded-lg ${colorClass}`}>
                <Icon className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900">
                  {activity.description}
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs text-gray-500">{activity.user}</span>
                  <span className="text-gray-300">•</span>
                  <span className="text-xs text-gray-500">
                    {formatDateTime(activity.timestamp)}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
