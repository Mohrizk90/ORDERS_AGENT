import supabase, { ENABLE_REALTIME, USE_MOCK_DATA } from '../lib/supabase';

// Store active subscriptions
const subscriptions = new Map();

/**
 * Subscribe to orders table changes
 */
export const subscribeToOrders = (callback) => {
  if (USE_MOCK_DATA || !ENABLE_REALTIME) {
    console.log('Realtime disabled or using mock data');
    return () => {};
  }

  const channel = supabase
    .channel('orders-changes')
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'orders',
      },
      (payload) => {
        callback({
          type: payload.eventType,
          new: payload.new,
          old: payload.old,
        });
      }
    )
    .subscribe();

  subscriptions.set('orders', channel);

  return () => {
    channel.unsubscribe();
    subscriptions.delete('orders');
  };
};

/**
 * Subscribe to invoices table changes
 */
export const subscribeToInvoices = (callback) => {
  if (USE_MOCK_DATA || !ENABLE_REALTIME) {
    console.log('Realtime disabled or using mock data');
    return () => {};
  }

  const channel = supabase
    .channel('invoices-changes')
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'invoices',
      },
      (payload) => {
        callback({
          type: payload.eventType,
          new: payload.new,
          old: payload.old,
        });
      }
    )
    .subscribe();

  subscriptions.set('invoices', channel);

  return () => {
    channel.unsubscribe();
    subscriptions.delete('invoices');
  };
};

/**
 * Subscribe to alerts table changes
 */
export const subscribeToAlerts = (callback) => {
  if (USE_MOCK_DATA || !ENABLE_REALTIME) {
    return () => {};
  }

  const channel = supabase
    .channel('alerts-changes')
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'alerts',
      },
      (payload) => {
        callback({
          type: 'INSERT',
          new: payload.new,
        });
      }
    )
    .subscribe();

  subscriptions.set('alerts', channel);

  return () => {
    channel.unsubscribe();
    subscriptions.delete('alerts');
  };
};

/**
 * Subscribe to multiple tables
 */
export const subscribeToAll = (callbacks = {}) => {
  const unsubscribers = [];

  if (callbacks.onOrderChange) {
    unsubscribers.push(subscribeToOrders(callbacks.onOrderChange));
  }

  if (callbacks.onInvoiceChange) {
    unsubscribers.push(subscribeToInvoices(callbacks.onInvoiceChange));
  }

  if (callbacks.onAlertChange) {
    unsubscribers.push(subscribeToAlerts(callbacks.onAlertChange));
  }

  return () => {
    unsubscribers.forEach(unsub => unsub());
  };
};

/**
 * Unsubscribe from all active subscriptions
 */
export const unsubscribeAll = () => {
  subscriptions.forEach((channel, key) => {
    channel.unsubscribe();
    subscriptions.delete(key);
  });
};

/**
 * Check if realtime is enabled
 */
export const isRealtimeEnabled = () => {
  return ENABLE_REALTIME && !USE_MOCK_DATA;
};
