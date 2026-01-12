import { useEffect, useRef, useCallback } from 'react';
import { subscribeToOrders, subscribeToInvoices, subscribeToAlerts, isRealtimeEnabled } from '../services/realtimeService';

/**
 * Hook to subscribe to real-time order updates
 */
export const useOrdersRealtime = (onUpdate) => {
  const callbackRef = useRef(onUpdate);
  callbackRef.current = onUpdate;

  useEffect(() => {
    if (!isRealtimeEnabled()) return;

    const unsubscribe = subscribeToOrders((change) => {
      callbackRef.current?.(change);
    });

    return unsubscribe;
  }, []);
};

/**
 * Hook to subscribe to real-time invoice updates
 */
export const useInvoicesRealtime = (onUpdate) => {
  const callbackRef = useRef(onUpdate);
  callbackRef.current = onUpdate;

  useEffect(() => {
    if (!isRealtimeEnabled()) return;

    const unsubscribe = subscribeToInvoices((change) => {
      callbackRef.current?.(change);
    });

    return unsubscribe;
  }, []);
};

/**
 * Hook to subscribe to real-time alert updates
 */
export const useAlertsRealtime = (onUpdate) => {
  const callbackRef = useRef(onUpdate);
  callbackRef.current = onUpdate;

  useEffect(() => {
    if (!isRealtimeEnabled()) return;

    const unsubscribe = subscribeToAlerts((change) => {
      callbackRef.current?.(change);
    });

    return unsubscribe;
  }, []);
};

/**
 * Generic hook to subscribe to real-time updates with refetch capability
 */
export const useRealtimeRefresh = (table, refetchFn) => {
  const refetchRef = useRef(refetchFn);
  refetchRef.current = refetchFn;

  useEffect(() => {
    if (!isRealtimeEnabled()) return;

    let unsubscribe;

    switch (table) {
      case 'orders':
        unsubscribe = subscribeToOrders(() => {
          refetchRef.current?.();
        });
        break;
      case 'invoices':
        unsubscribe = subscribeToInvoices(() => {
          refetchRef.current?.();
        });
        break;
      case 'alerts':
        unsubscribe = subscribeToAlerts(() => {
          refetchRef.current?.();
        });
        break;
      default:
        return;
    }

    return unsubscribe;
  }, [table]);
};

/**
 * Hook that returns real-time status
 */
export const useRealtimeStatus = () => {
  return {
    enabled: isRealtimeEnabled(),
  };
};
