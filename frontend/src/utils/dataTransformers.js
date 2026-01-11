// Data transformation utilities for Supabase data

/**
 * Format currency value
 */
export const formatCurrency = (amount, currency = 'USD') => {
  if (amount === null || amount === undefined) return '$0';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

/**
 * Format date to readable string
 */
export const formatDate = (date) => {
  if (!date) return '';
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

/**
 * Format date and time
 */
export const formatDateTime = (date) => {
  if (!date) return '';
  return new Date(date).toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

/**
 * Get status badge color class
 */
export const getStatusColor = (status) => {
  const colors = {
    Active: 'badge-blue',
    Completed: 'badge-green',
    Pending: 'badge-yellow',
    Paid: 'badge-green',
    Overdue: 'badge-red',
    Cancelled: 'badge-gray',
  };
  return colors[status] || 'badge-gray';
};

/**
 * Get source channel icon name
 */
export const getSourceIcon = (source) => {
  const icons = {
    Email: 'mail',
    Telegram: 'send',
    Chat: 'message-circle',
    Web: 'globe',
  };
  return icons[source] || 'file';
};

/**
 * Transform order from database format to component format
 */
export const transformOrder = (dbOrder) => {
  if (!dbOrder) return null;
  return {
    id: dbOrder.id,
    supplier: dbOrder.supplier || '',
    order_date: dbOrder.order_date || '',
    total_amount: dbOrder.total_amount || 0,
    net_amount: dbOrder.net_amount || 0,
    source_channel: dbOrder.source_channel || 'Email',
    status: dbOrder.status || 'Pending',
    created_at: dbOrder.created_at || new Date().toISOString(),
  };
};

/**
 * Transform invoice from database format to component format
 */
export const transformInvoice = (dbInvoice) => {
  if (!dbInvoice) return null;
  return {
    id: dbInvoice.id,
    supplier: dbInvoice.supplier || '',
    invoice_date: dbInvoice.invoice_date || '',
    total_amount: dbInvoice.total_amount || 0,
    net_amount: dbInvoice.net_amount || 0,
    exchange_rate: dbInvoice.exchange_rate || 1.0,
    financing_type: dbInvoice.financing_type || 'Credit',
    status: dbInvoice.status || 'Pending',
    created_at: dbInvoice.created_at || new Date().toISOString(),
  };
};

/**
 * Transform order item from database format
 */
export const transformOrderItem = (dbItem) => {
  if (!dbItem) return null;
  return {
    id: dbItem.id,
    order_id: dbItem.order_id,
    product_code: dbItem.product_code || '',
    description: dbItem.description || '',
    units: dbItem.units || 0,
    unit_price: dbItem.unit_price || 0,
    batch_number: dbItem.batch_number || '',
    amount: dbItem.amount || 0,
  };
};

/**
 * Transform invoice item from database format
 */
export const transformInvoiceItem = (dbItem) => {
  if (!dbItem) return null;
  return {
    id: dbItem.id,
    invoice_id: dbItem.invoice_id,
    item_id: dbItem.item_id || '',
    description: dbItem.description || '',
    units: dbItem.units || 0,
    unit_price: dbItem.unit_price || 0,
    batch_number: dbItem.batch_number || '',
    amount: dbItem.amount || 0,
  };
};

/**
 * Transform alert from database format
 */
export const transformAlert = (dbAlert) => {
  if (!dbAlert) return null;
  return {
    id: dbAlert.id,
    type: dbAlert.type || 'info',
    title: dbAlert.title || '',
    message: dbAlert.message || '',
    amount: dbAlert.amount || 0,
    timestamp: dbAlert.timestamp || dbAlert.created_at || new Date().toISOString(),
    read: dbAlert.read || false,
  };
};

/**
 * Transform activity from database format
 */
export const transformActivity = (dbActivity) => {
  if (!dbActivity) return null;
  return {
    id: dbActivity.id,
    action: dbActivity.action || '',
    type: dbActivity.type || '',
    description: dbActivity.description || '',
    user: dbActivity.user || 'System',
    timestamp: dbActivity.timestamp || dbActivity.created_at || new Date().toISOString(),
  };
};

/**
 * Parse date string to ISO format for database
 */
export const toISODate = (dateString) => {
  if (!dateString) return null;
  const date = new Date(dateString);
  return date.toISOString().split('T')[0];
};

/**
 * Safely parse number
 */
export const parseNumber = (value, defaultValue = 0) => {
  const parsed = parseFloat(value);
  return isNaN(parsed) ? defaultValue : parsed;
};
