import supabase, { USE_MOCK_DATA } from '../lib/supabase';
import { mockInvoices, mockInvoiceItems } from '../data/mockData';
import { transformInvoice, transformInvoiceItem } from '../utils/dataTransformers';
import { createSuccessResult, createErrorResult } from '../utils/errorHandler';

/**
 * Get invoices with optional filtering and pagination
 */
export const getInvoices = async ({ 
  page = 1, 
  limit = 10, 
  search = '', 
  supplier = '', 
  status = '',
  dateFrom = '',
  dateTo = '',
  sortBy = 'invoice_date',
  sortOrder = 'desc'
} = {}) => {
  if (USE_MOCK_DATA) {
    let filtered = [...mockInvoices];
    
    if (search) {
      const searchLower = search.toLowerCase();
      filtered = filtered.filter(i => 
        i.supplier.toLowerCase().includes(searchLower) ||
        i.id.toLowerCase().includes(searchLower)
      );
    }
    if (supplier) {
      filtered = filtered.filter(i => i.supplier === supplier);
    }
    if (status) {
      filtered = filtered.filter(i => i.status === status);
    }
    if (dateFrom) {
      filtered = filtered.filter(i => i.invoice_date >= dateFrom);
    }
    if (dateTo) {
      filtered = filtered.filter(i => i.invoice_date <= dateTo);
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
      .from('invoices')
      .select('*', { count: 'exact' });

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
      query = query.gte('invoice_date', dateFrom);
    }
    if (dateTo) {
      query = query.lte('invoice_date', dateTo);
    }

    query = query.order(sortBy, { ascending: sortOrder === 'asc' });

    const from = (page - 1) * limit;
    const to = from + limit - 1;
    query = query.range(from, to);

    const { data, error, count } = await query;

    if (error) throw error;

    return createSuccessResult({
      data: data?.map(transformInvoice) || [],
      total: count || 0,
      page,
      limit,
    });
  } catch (error) {
    return createErrorResult(error, 'getInvoices');
  }
};

/**
 * Get a single invoice by ID
 */
export const getInvoiceById = async (id) => {
  if (USE_MOCK_DATA) {
    const invoice = mockInvoices.find(i => i.id === id);
    return invoice 
      ? createSuccessResult(invoice)
      : createErrorResult({ message: 'Invoice not found' }, 'getInvoiceById');
  }

  try {
    const { data, error } = await supabase
      .from('invoices')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;

    return createSuccessResult(transformInvoice(data));
  } catch (error) {
    return createErrorResult(error, 'getInvoiceById');
  }
};

/**
 * Create a new invoice
 */
export const createInvoice = async (invoiceData) => {
  if (USE_MOCK_DATA) {
    const newInvoice = {
      id: crypto.randomUUID(),
      ...invoiceData,
      created_at: new Date().toISOString(),
    };
    mockInvoices.unshift(newInvoice);
    return createSuccessResult(newInvoice);
  }

  try {
    const insertData = {
      supplier: invoiceData.supplier,
      invoice_date: invoiceData.invoice_date,
      total_amount: invoiceData.total_amount,
      exchange_rate: invoiceData.exchange_rate || 1.0,
      financing_type: invoiceData.financing_type || 'Credit',
      status: invoiceData.status || 'Pending',
    };
    
    // Only include net_amount if it's provided and not null/undefined
    if (invoiceData.net_amount != null) {
      insertData.net_amount = invoiceData.net_amount;
    }

    const { data, error } = await supabase
      .from('invoices')
      .insert([insertData])
      .select()
      .single();

    if (error) throw error;

    return createSuccessResult(transformInvoice(data));
  } catch (error) {
    return createErrorResult(error, 'createInvoice');
  }
};

/**
 * Update an existing invoice
 */
export const updateInvoice = async (id, updates) => {
  if (USE_MOCK_DATA) {
    const index = mockInvoices.findIndex(i => i.id === id);
    if (index === -1) {
      return createErrorResult({ message: 'Invoice not found' }, 'updateInvoice');
    }
    mockInvoices[index] = { ...mockInvoices[index], ...updates };
    return createSuccessResult(mockInvoices[index]);
  }

  try {
    const { data, error } = await supabase
      .from('invoices')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    return createSuccessResult(transformInvoice(data));
  } catch (error) {
    return createErrorResult(error, 'updateInvoice');
  }
};

/**
 * Delete an invoice
 */
export const deleteInvoice = async (id) => {
  if (USE_MOCK_DATA) {
    const index = mockInvoices.findIndex(i => i.id === id);
    if (index === -1) {
      return createErrorResult({ message: 'Invoice not found' }, 'deleteInvoice');
    }
    mockInvoices.splice(index, 1);
    return createSuccessResult({ id });
  }

  try {
    // First delete related invoice items
    await supabase
      .from('invoice_items')
      .delete()
      .eq('invoice_id', id);

    // Then delete the invoice
    const { error } = await supabase
      .from('invoices')
      .delete()
      .eq('id', id);

    if (error) throw error;

    return createSuccessResult({ id });
  } catch (error) {
    return createErrorResult(error, 'deleteInvoice');
  }
};

/**
 * Delete multiple invoices
 */
export const deleteInvoices = async (ids) => {
  if (!ids || ids.length === 0) {
    return createErrorResult({ message: 'No invoices selected' }, 'deleteInvoices');
  }

  if (USE_MOCK_DATA) {
    ids.forEach(id => {
      const index = mockInvoices.findIndex(i => i.id === id);
      if (index !== -1) {
        mockInvoices.splice(index, 1);
      }
    });
    return createSuccessResult({ deleted: ids.length });
  }

  try {
    // First delete related invoice items for all invoices
    await supabase
      .from('invoice_items')
      .delete()
      .in('invoice_id', ids);

    // Then delete the invoices
    const { error } = await supabase
      .from('invoices')
      .delete()
      .in('id', ids);

    if (error) throw error;

    return createSuccessResult({ deleted: ids.length });
  } catch (error) {
    return createErrorResult(error, 'deleteInvoices');
  }
};

/**
 * Get invoice items for a specific invoice
 */
export const getInvoiceItems = async (invoiceId) => {
  if (USE_MOCK_DATA) {
    const items = mockInvoiceItems.filter(i => i.invoice_id === invoiceId);
    return createSuccessResult(items);
  }

  try {
    const { data, error } = await supabase
      .from('invoice_items')
      .select('*')
      .eq('invoice_id', invoiceId)
      .order('id');

    if (error) throw error;

    return createSuccessResult(data?.map(transformInvoiceItem) || []);
  } catch (error) {
    return createErrorResult(error, 'getInvoiceItems');
  }
};

/**
 * Get unique suppliers from invoices
 */
export const getInvoiceSuppliers = async () => {
  if (USE_MOCK_DATA) {
    const suppliers = [...new Set(mockInvoices.map(i => i.supplier))];
    return createSuccessResult(suppliers);
  }

  try {
    const { data, error } = await supabase
      .from('invoices')
      .select('supplier')
      .order('supplier');

    if (error) throw error;

    const suppliers = [...new Set(data?.map(d => d.supplier) || [])];
    return createSuccessResult(suppliers);
  } catch (error) {
    return createErrorResult(error, 'getInvoiceSuppliers');
  }
};

/**
 * Get invoice count
 */
export const getInvoiceCount = async (filters = {}) => {
  if (USE_MOCK_DATA) {
    let filtered = mockInvoices;
    if (filters.status) {
      filtered = filtered.filter(i => i.status === filters.status);
    }
    return createSuccessResult(filtered.length);
  }

  try {
    let query = supabase
      .from('invoices')
      .select('*', { count: 'exact', head: true });

    if (filters.status) {
      query = query.eq('status', filters.status);
    }

    const { count, error } = await query;

    if (error) throw error;

    return createSuccessResult(count || 0);
  } catch (error) {
    return createErrorResult(error, 'getInvoiceCount');
  }
};
