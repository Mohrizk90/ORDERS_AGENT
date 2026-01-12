import { useState, useEffect, createContext, useContext, useCallback } from 'react';
import { CheckCircle, AlertCircle, Info, X, AlertTriangle } from 'lucide-react';

// Toast context
const ToastContext = createContext(null);

// Toast types configuration
const toastConfig = {
  success: {
    icon: CheckCircle,
    className: 'bg-green-50 border-green-200 text-green-800',
    iconClass: 'text-green-500',
  },
  error: {
    icon: AlertCircle,
    className: 'bg-red-50 border-red-200 text-red-800',
    iconClass: 'text-red-500',
  },
  warning: {
    icon: AlertTriangle,
    className: 'bg-yellow-50 border-yellow-200 text-yellow-800',
    iconClass: 'text-yellow-500',
  },
  info: {
    icon: Info,
    className: 'bg-blue-50 border-blue-200 text-blue-800',
    iconClass: 'text-blue-500',
  },
};

// Individual Toast component
function Toast({ id, type = 'info', message, onDismiss, duration = 5000 }) {
  const config = toastConfig[type] || toastConfig.info;
  const Icon = config.icon;

  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        onDismiss(id);
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [id, duration, onDismiss]);

  return (
    <div
      className={`flex items-start gap-3 p-4 rounded-lg border shadow-lg animate-slide-in ${config.className}`}
      role="alert"
    >
      <Icon className={`w-5 h-5 flex-shrink-0 ${config.iconClass}`} />
      <p className="flex-1 text-sm">{message}</p>
      <button
        onClick={() => onDismiss(id)}
        className="flex-shrink-0 p-1 rounded hover:bg-black/10 transition-colors"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}

// Toast container component
function ToastContainer({ toasts, onDismiss }) {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm">
      {toasts.map((toast) => (
        <Toast key={toast.id} {...toast} onDismiss={onDismiss} />
      ))}
    </div>
  );
}

// Toast provider component
export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((type, message, duration = 5000) => {
    const id = Date.now().toString();
    setToasts((prev) => [...prev, { id, type, message, duration }]);
    return id;
  }, []);

  const dismissToast = useCallback((id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const toast = {
    success: (message, duration) => addToast('success', message, duration),
    error: (message, duration) => addToast('error', message, duration),
    warning: (message, duration) => addToast('warning', message, duration),
    info: (message, duration) => addToast('info', message, duration),
    dismiss: dismissToast,
    dismissAll: () => setToasts([]),
  };

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
    </ToastContext.Provider>
  );
}

// Hook to use toast
export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}

// Standalone toast functions for use outside of React components
let globalToast = null;

export function setGlobalToast(toastFn) {
  globalToast = toastFn;
}

export function showToast(type, message) {
  if (globalToast) {
    globalToast[type]?.(message);
  } else {
    console.warn('Toast not initialized. Wrap your app in ToastProvider.');
  }
}

export default Toast;
