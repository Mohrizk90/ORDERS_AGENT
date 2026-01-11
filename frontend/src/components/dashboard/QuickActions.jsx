import { 
  Plus, 
  Upload, 
  Download, 
  BarChart3, 
  FileText,
  Receipt,
  Search,
  MessageSquare
} from 'lucide-react';
import { Link } from 'react-router-dom';

const actions = [
  {
    name: 'AI Assistant',
    description: 'Chat with your data',
    icon: MessageSquare,
    color: 'bg-gradient-to-r from-primary-500 to-primary-600',
    href: '/assistant',
  },
  {
    name: 'New Order',
    description: 'Create a new order',
    icon: FileText,
    color: 'bg-blue-500',
    href: '/orders?action=new',
  },
  {
    name: 'Upload Document',
    description: 'Process PDF document',
    icon: Upload,
    color: 'bg-purple-500',
    href: '/upload',
  },
  {
    name: 'Export Data',
    description: 'Download CSV/Excel',
    icon: Download,
    color: 'bg-yellow-500',
    href: '/analytics?action=export',
  },
];

export default function QuickActions() {
  return (
    <div className="card">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
      
      <div className="grid grid-cols-2 gap-3">
        {actions.map((action) => (
          <Link
            key={action.name}
            to={action.href}
            className="flex items-center gap-3 p-4 rounded-xl border border-gray-200 hover:border-primary-300 hover:bg-primary-50 transition-all group"
          >
            <div className={`p-2 rounded-lg ${action.color} text-white group-hover:scale-110 transition-transform`}>
              <action.icon className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">{action.name}</p>
              <p className="text-xs text-gray-500">{action.description}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
