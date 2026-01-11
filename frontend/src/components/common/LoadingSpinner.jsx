import { Loader } from 'lucide-react';

export default function LoadingSpinner({ 
  size = 'md', 
  text = '', 
  fullPage = false,
  className = '' 
}) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16',
  };

  const spinner = (
    <div className={`flex flex-col items-center justify-center gap-3 ${className}`}>
      <Loader className={`${sizeClasses[size]} text-primary-600 animate-spin`} />
      {text && <p className="text-sm text-gray-500">{text}</p>}
    </div>
  );

  if (fullPage) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white/80 backdrop-blur-sm z-50">
        {spinner}
      </div>
    );
  }

  return spinner;
}

export function TableLoadingSpinner() {
  return (
    <div className="flex items-center justify-center py-12">
      <LoadingSpinner size="md" text="Loading data..." />
    </div>
  );
}

export function CardLoadingSpinner() {
  return (
    <div className="flex items-center justify-center py-8">
      <LoadingSpinner size="sm" />
    </div>
  );
}

export function ButtonLoadingSpinner() {
  return <Loader className="w-4 h-4 animate-spin" />;
}
