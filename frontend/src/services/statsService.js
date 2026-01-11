import supabase, { USE_MOCK_DATA } from '../lib/supabase';
import { mockStats, mockOrders, mockInvoices, mockAlerts, mockRecentActivity } from '../data/mockData';
import { createSuccessResult, createErrorResult } from '../utils/errorHandler';

/**
 * Safely execute a Supabase query and return result or default value
 * Handles errors gracefully
 */
const safeQuery = async (queryFn, defaultValue = null) => {
  try {
    const result = await queryFn();
    if (result.error) {
      const code = result.error.code;
      const status = result.error.status || result.error.statusCode;
      // Handle missing table or no rows gracefully
      if (status === 404 || code === 'PGRST205' || code === 'PGRST116') {
        return { data: defaultValue || [], count: 0, error: null };
      }
      // For other errors, log and return default
      console.warn('Query error:', result.error.message);
      return { data: defaultValue || [], count: 0, error: result.error };
    }
    return result;
  } catch (err) {
    console.warn('Query exception:', err.message);
    return { data: defaultValue || [], count: 0, error: err };
  }
};

/**
 * Get dashboard statistics
 */
export const getDashboardStats = async () => {
  if (USE_MOCK_DATA) {
    return createSuccessResult(mockStats);
  }

  // Check if Supabase is configured
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
  
  if (!supabaseUrl || !supabaseAnonKey || 
      supabaseUrl === 'https://placeholder.supabase.co' || 
      supabaseAnonKey === 'placeholder-key') {
    return createErrorResult(
      { message: 'Supabase not configured. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in .env.local' },
      'getDashboardStats'
    );
  }

  try {
    // Fetch all data needed for stats
    const [ordersResult, invoicesResult] = await Promise.all([
      safeQuery(() => supabase.from('orders').select('id, status, total_amount, supplier, created_at'), []),
      safeQuery(() => supabase.from('invoices').select('id, status, total_amount'), []),
    ]);

    const orders = ordersResult.data || [];
    const invoices = invoicesResult.data || [];

    // Calculate stats from the data
    const today = new Date().toISOString().split('T')[0];
    const pendingOrders = orders.filter(o => o.status === 'Pending').length;
    const pendingInvoices = invoices.filter(i => i.status === 'Pending').length;
    const overdueInvoices = invoices.filter(i => i.status === 'Overdue').length;
    const highValueTransactions = orders.filter(o => parseFloat(o.total_amount) >= 50000).length;
    const totalOrderAmount = orders.reduce((sum, o) => sum + (parseFloat(o.total_amount) || 0), 0);
    const totalInvoiceAmount = invoices.reduce((sum, i) => sum + (parseFloat(i.total_amount) || 0), 0);
    const processedToday = orders.filter(o => o.created_at && o.created_at.startsWith(today)).length;
    const uniqueSuppliers = new Set(orders.map(o => o.supplier).filter(Boolean));

    const stats = {
      totalOrders: orders.length,
      totalInvoices: invoices.length,
      totalOrderAmount,
      totalInvoiceAmount,
      pendingOrders,
      pendingInvoices,
      overdueInvoices,
      highValueTransactions,
      monthlyGrowth: 0,
      processedToday,
      activeSuppliers: uniqueSuppliers.size,
    };

    return createSuccessResult(stats);
  } catch (error) {
    return createErrorResult(error, 'getDashboardStats');
  }
};

/**
 * Get alerts
 */
export const getAlerts = async ({ unreadOnly = false } = {}) => {
  if (USE_MOCK_DATA) {
    let alerts = [...mockAlerts];
    if (unreadOnly) {
      alerts = alerts.filter(a => !a.read);
    }
    return createSuccessResult(alerts);
  }

  try {
    let query = supabase
      .from('alerts')
      .select('*')
      .order('timestamp', { ascending: false })
      .limit(20);

    if (unreadOnly) {
      query = query.eq('read', false);
    }

    const { data, error } = await query;

    if (error) {
      // If alerts table doesn't exist, return empty array
      // Check for various error codes and messages that indicate missing table
      const isMissingTable = 
        error.code === 'PGRST116' || 
        error.code === 'PGRST205' || 
        error.status === 404 ||
        error.statusCode === 404 ||
        error.message?.includes('does not exist') || 
        error.message?.includes('Could not find the table') ||
        error.message?.includes('relation') ||
        error.message?.includes('not found') ||
        error.hint?.includes('table') ||
        (error.message && error.message.toLowerCase().includes('alerts'));
      
      if (isMissingTable) {
        return createSuccessResult([]);
      }
      throw error;
    }

    return createSuccessResult(data || []);
  } catch (error) {
    return createErrorResult(error, 'getAlerts');
  }
};

/**
 * Mark alert as read
 */
export const markAlertRead = async (alertId) => {
  if (USE_MOCK_DATA) {
    const alert = mockAlerts.find(a => a.id === alertId);
    if (alert) alert.read = true;
    return createSuccessResult({ id: alertId });
  }

  try {
    const { error } = await supabase
      .from('alerts')
      .update({ read: true })
      .eq('id', alertId);

    if (error) {
      // If alerts table doesn't exist, return success anyway (silent fail)
      // Check for various error codes and messages that indicate missing table
      if (
        error.code === 'PGRST116' || 
        error.code === 'PGRST205' || 
        error.status === 404 ||
        error.message?.includes('does not exist') || 
        error.message?.includes('Could not find the table') ||
        error.message?.includes('relation') ||
        error.hint?.includes('table')
      ) {
        return createSuccessResult({ id: alertId });
      }
      throw error;
    }

    return createSuccessResult({ id: alertId });
  } catch (error) {
    return createErrorResult(error, 'markAlertRead');
  }
};

/**
 * Get recent activity
 */
export const getRecentActivity = async ({ limit = 10 } = {}) => {
  if (USE_MOCK_DATA) {
    return createSuccessResult(mockRecentActivity.slice(0, limit));
  }

  try {
    const { data, error } = await supabase
      .from('activity')
      .select('*')
      .order('timestamp', { ascending: false })
      .limit(limit);

    if (error) {
      // If activity table doesn't exist, return empty array
      // Check for various error codes and messages that indicate missing table
      const isMissingTable = 
        error.code === 'PGRST116' || 
        error.code === 'PGRST205' || 
        error.status === 404 ||
        error.statusCode === 404 ||
        error.message?.includes('does not exist') || 
        error.message?.includes('Could not find the table') ||
        error.message?.includes('relation') ||
        error.message?.includes('not found') ||
        error.hint?.includes('table') ||
        (error.message && error.message.toLowerCase().includes('activity'));
      
      if (isMissingTable) {
        return createSuccessResult([]);
      }
      throw error;
    }

    return createSuccessResult(data || []);
  } catch (error) {
    return createErrorResult(error, 'getRecentActivity');
  }
};

/**
 * Get unique suppliers from both orders and invoices
 */
export const getAllSuppliers = async () => {
  if (USE_MOCK_DATA) {
    const orderSuppliers = mockOrders.map(o => o.supplier);
    const invoiceSuppliers = mockInvoices.map(i => i.supplier);
    const allSuppliers = [...new Set([...orderSuppliers, ...invoiceSuppliers])].sort();
    return createSuccessResult(allSuppliers);
  }

  try {
    const [ordersResult, invoicesResult] = await Promise.all([
      supabase.from('orders').select('supplier'),
      supabase.from('invoices').select('supplier'),
    ]);

    const orderSuppliers = ordersResult.data?.map(o => o.supplier) || [];
    const invoiceSuppliers = invoicesResult.data?.map(i => i.supplier) || [];
    const allSuppliers = [...new Set([...orderSuppliers, ...invoiceSuppliers])].sort();

    return createSuccessResult(allSuppliers);
  } catch (error) {
    return createErrorResult(error, 'getAllSuppliers');
  }
};
