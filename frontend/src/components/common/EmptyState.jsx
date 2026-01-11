import { FileText, Search, Plus } from 'lucide-react';

export default function EmptyState({ 
  icon: Icon = FileText, 
  title, 
  description, 
  action,
  actionLabel,
  onAction 
}) {
  return (
    <div className="text-center py-12 px-4">
      <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
        <Icon className="w-8 h-8 text-gray-400" />
      </div>
      <h3 className="text-lg font-medium text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-500 max-w-sm mx-auto mb-6">{description}</p>
      {action && (
        <button onClick={onAction} className="btn btn-primary">
          <Plus className="w-4 h-4 mr-2" />
          {actionLabel}
        </button>
      )}
    </div>
  );
}
