import { TrendingUp, TrendingDown } from 'lucide-react';

export default function StatsCard({ 
  title, 
  value, 
  subtitle, 
  icon: Icon, 
  trend, 
  trendDirection = 'up',
  color = 'blue' 
}) {
  const colorClasses = {
    blue: {
      bg: 'bg-blue-50',
      icon: 'text-blue-600',
      iconBg: 'bg-blue-100',
    },
    green: {
      bg: 'bg-green-50',
      icon: 'text-green-600',
      iconBg: 'bg-green-100',
    },
    yellow: {
      bg: 'bg-yellow-50',
      icon: 'text-yellow-600',
      iconBg: 'bg-yellow-100',
    },
    red: {
      bg: 'bg-red-50',
      icon: 'text-red-600',
      iconBg: 'bg-red-100',
    },
    purple: {
      bg: 'bg-purple-50',
      icon: 'text-purple-600',
      iconBg: 'bg-purple-100',
    },
  };

  const colors = colorClasses[color];

  return (
    <div className="card group">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-2">{value}</p>
          
          <div className="flex items-center gap-2 mt-2">
            {trend && (
              <span className={`inline-flex items-center text-sm font-medium ${
                trendDirection === 'up' ? 'text-green-600' : 'text-red-600'
              }`}>
                {trendDirection === 'up' ? (
                  <TrendingUp className="w-4 h-4 mr-1" />
                ) : (
                  <TrendingDown className="w-4 h-4 mr-1" />
                )}
                {trend}
              </span>
            )}
            {subtitle && (
              <span className="text-sm text-gray-500">{subtitle}</span>
            )}
          </div>
        </div>
        
        {Icon && (
          <div className={`p-3 rounded-xl ${colors.iconBg} ${colors.icon} group-hover:scale-110 transition-transform`}>
            <Icon className="w-6 h-6" />
          </div>
        )}
      </div>
    </div>
  );
}
