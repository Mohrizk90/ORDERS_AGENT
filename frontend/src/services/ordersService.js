import supabase, { USE_MOCK_DATA } from '../lib/supabase';
import { mockOrders, mockOrderItems } from '../data/mockData';
import { transformOrder, transformOrderItem } from '../utils/dataTransformers';
import { createSuccessResult, createErrorResult, logError } from '../utils/errorHandler';

/**
 * Get orders with optional filtering and pagination
 */
export const getOrders = async ({ 
  page = 1, 
  limit = 10, 
  search = '', 
  supplier = '', 
  status = '',
  dateFrom = '',
  dateTo = '',
  sortBy = 'order_date',
  sortOrder = 'desc'
} = {}) => {
  // Use mock data if configured
  if (USE_MOCK_DATA) {
    let filtered = [...mockOrders];
    
    if (search) {
      const searchLower = search.toLowerCase();
      filtered = filtered.filter(o => 
        o.supplier.toLowerCase().includes(searchLower) ||
        o.id.toLowerCase().includes(searchLower)
      );
    }
    if (supplier) {
      filtered = filtered.filter(o => o.supplier === supplier);
    }
    if (status) {
      filtered = filtered.filter(o => o.status === status);
    }
    if (dateFrom) {
      filtered = filtered.filter(o => o.order_date >= dateFrom);
    }
    if (dateTo) {
      filtered = filtered.filter(o => o.order_date <= dateTo);
    }
    
    const total = filtered.length;
    const start = (page - 1) * limit;
    const end = start + limit;
    const data = filtered.slice(start, end);
    
    return createSuccessResult({ data, total, page, limit });
  }

  try {
    // Check if Supabase is properly configured
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    if (!supabaseUrl || supabaseUrl === 'https://placeholder.supabase.co') {
      throw new Error('Supabase not configured. Please set VITE_SUPABASE_URL in .env.local');
    }

    let query = supabase
      .from('orders')
      .select('*', { count: 'exact' });

    // Apply filters
    if (search) {
      query = query.or(`supplier.ilike.%${search}%,id.ilike.%${search}%`);
    }
    if (supplier) {
      query = query.eq('supplier', supplier);
    }
    if (status) {
      query = query.eq('status', status);
    }
    if (dateFrom) {
      query = query.gte('order_date', dateFrom);
    }
    if (dateTo) {
      query = query.lte('order_date', dateTo);
    }

    // Apply sorting
    query = query.order(sortBy, { ascending: sortOrder === 'asc' });

    // Apply pagination
    const from = (page - 1) * limit;
    const to = from + limit - 1;
    query = query.range(from, to);

    const { data, error, count } = await query;

    if (error) throw error;

    return createSuccessResult({
      data: data?.map(transformOrder) || [],
      total: count || 0,
      page,
      limit,
    });
  } catch (error) {
    return createErrorResult(error, 'getOrders');
  }
};

/**
 * Get a single order by ID
 */
export const getOrderById = async (id) => {
  if (USE_MOCK_DATA) {
    const order = mockOrders.find(o => o.id === id);
    return order 
      ? createSuccessResult(order)
      : createErrorResult({ message: 'Order not found' }, 'getOrderById');
  }

  try {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;

    return createSuccessResult(transformOrder(data));
  } catch (error) {
    return createErrorResult(error, 'getOrderById');
  }
};

/**
 * Create a new order
 */
export const createOrder = async (orderData) => {
  if (USE_MOCK_DATA) {
    const newOrder = {
      id: crypto.randomUUID(),
      ...orderData,
      created_at: new Date().toISOString(),
    };
    mockOrders.unshift(newOrder);
    return createSuccessResult(newOrder);
  }

  try {
    const insertData = {
      supplier: orderData.supplier,
      order_date: orderData.order_date,
      total_amount: orderData.total_amount,
      source_channel: orderData.source_channel || 'Web',
      status: orderData.status || 'Pending',
    };
    
    // Only include net_amount if it's provided and not null/undefined
    if (orderData.net_amount != null) {
      insertData.net_amount = orderData.net_amount;
    }

    const { data, error } = await supabase
      .from('orders')
      .insert([insertData])
      .select()
      .single();

    if (error) throw error;

    return createSuccessResult(transformOrder(data));
  } catch (error) {
    return createErrorResult(error, 'createOrder');
  }
};

/**
 * Update an existing order
 */
export const updateOrder = async (id, updates) => {
  if (USE_MOCK_DATA) {
    const index = mockOrders.findIndex(o => o.id === id);
    if (index === -1) {
      return createErrorResult({ message: 'Order not found' }, 'updateOrder');
    }
    mockOrders[index] = { ...mockOrders[index], ...updates };
    return createSuccessResult(mockOrders[index]);
  }

  try {
    const { data, error } = await supabase
      .from('orders')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    return createSuccessResult(transformOrder(data));
  } catch (error) {
    return createErrorResult(error, 'updateOrder');
  }
};

/**
 * Delete an order
 */
export const deleteOrder = async (id) => {
  if (USE_MOCK_DATA) {
    const index = mockOrders.findIndex(o => o.id === id);
    if (index === -1) {
      return createErrorResult({ message: 'Order not found' }, 'deleteOrder');
    }
    mockOrders.splice(index, 1);
    return createSuccessResult({ id });
  }

  try {
    // First delete related order items
    await supabase
      .from('order_items')
      .delete()
      .eq('order_id', id);

    // Then delete the order
    const { error } = await supabase
      .from('orders')
      .delete()
      .eq('id', id);

    if (error) throw error;

    return createSuccessResult({ id });
  } catch (error) {
    return createErrorResult(error, 'deleteOrder');
  }
};

/**
 * Delete multiple orders
 */
export const deleteOrders = async (ids) => {
  if (!ids || ids.length === 0) {
    return createErrorResult({ message: 'No orders selected' }, 'deleteOrders');
  }

  if (USE_MOCK_DATA) {
    ids.forEach(id => {
      const index = mockOrders.findIndex(o => o.id === id);
      if (index !== -1) {
        mockOrders.splice(index, 1);
      }
    });
    return createSuccessResult({ deleted: ids.length });
  }

  try {
    // First delete related order items for all orders
    await supabase
      .from('order_items')
      .delete()
      .in('order_id', ids);

    // Then delete the orders
    const { error } = await supabase
      .from('orders')
      .delete()
      .in('id', ids);

    if (error) throw error;

    return createSuccessResult({ deleted: ids.length });
  } catch (error) {
    return createErrorResult(error, 'deleteOrders');
  }
};

/**
 * Get order items for a specific order
 */
export const getOrderItems = async (orderId) => {
  if (USE_MOCK_DATA) {
    const items = mockOrderItems.filter(i => i.order_id === orderId);
    return createSuccessResult(items);
  }

  try {
    const { data, error } = await supabase
      .from('order_items')
      .select('*')
      .eq('order_id', orderId)
      .order('id');

    if (error) throw error;

    return createSuccessResult(data?.map(transformOrderItem) || []);
  } catch (error) {
    return createErrorResult(error, 'getOrderItems');
  }
};

/**
 * Get unique suppliers from orders
 */
export const getOrderSuppliers = async () => {
  if (USE_MOCK_DATA) {
    const suppliers = [...new Set(mockOrders.map(o => o.supplier))];
    return createSuccessResult(suppliers);
  }

  try {
    const { data, error } = await supabase
      .from('orders')
      .select('supplier')
      .order('supplier');

    if (error) throw error;

    const suppliers = [...new Set(data?.map(d => d.supplier) || [])];
    return createSuccessResult(suppliers);
  } catch (error) {
    return createErrorResult(error, 'getOrderSuppliers');
  }
};

/**
 * Get order count
 */
export const getOrderCount = async (filters = {}) => {
  if (USE_MOCK_DATA) {
    let filtered = mockOrders;
    if (filters.status) {
      filtered = filtered.filter(o => o.status === filters.status);
    }
    return createSuccessResult(filtered.length);
  }

  try {
    let query = supabase
      .from('orders')
      .select('*', { count: 'exact', head: true });

    if (filters.status) {
      query = query.eq('status', filters.status);
    }

    const { count, error } = await query;

    if (error) throw error;

    return createSuccessResult(count || 0);
  } catch (error) {
    return createErrorResult(error, 'getOrderCount');
  }
};
