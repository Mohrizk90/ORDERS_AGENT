import supabase, { USE_MOCK_DATA } from '../lib/supabase';
import { mockMonthlyData, mockOrders, mockInvoices } from '../data/mockData';
import { createSuccessResult, createErrorResult } from '../utils/errorHandler';

/**
 * Get monthly data for charts
 */
export const getMonthlyData = async (period = new Date().getFullYear()) => {
  if (USE_MOCK_DATA) {
    return createSuccessResult(mockMonthlyData);
  }

  try {
    let startDate, endDate, months;
    
    // Handle "last12months" or specific year
    if (period === 'last12months') {
      // Calculate last 12 months
      const now = new Date();
      const last12 = new Date(now.getFullYear(), now.getMonth() - 11, 1);
      startDate = last12.toISOString().split('T')[0];
      endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString().split('T')[0];
      
      // Generate month labels for last 12 months
      months = [];
      for (let i = 11; i >= 0; i--) {
        const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const monthName = date.toLocaleDateString('en-US', { month: 'short' });
        const year = date.getFullYear();
        months.push({ 
          label: `${monthName} ${year}`, 
          month: date.getMonth(), 
          year: year,
          orders: 0,
          invoices: 0
        });
      }
    } else {
      // Specific year
      const year = parseInt(period);
      startDate = `${year}-01-01`;
      endDate = `${year}-12-31`;
      
      const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      months = monthNames.map((month, index) => ({
        label: month,
        month: index,
        year: year,
        orders: 0,
        invoices: 0,
      }));
    }

    const [ordersResult, invoicesResult] = await Promise.all([
      supabase
        .from('orders')
        .select('order_date, total_amount')
        .gte('order_date', startDate)
        .lte('order_date', endDate),
      supabase
        .from('invoices')
        .select('invoice_date, total_amount')
        .gte('invoice_date', startDate)
        .lte('invoice_date', endDate),
    ]);

    if (ordersResult.error) throw ordersResult.error;
    if (invoicesResult.error) throw invoicesResult.error;

    // Aggregate orders
    ordersResult.data?.forEach(order => {
      const orderDate = new Date(order.order_date);
      const orderMonth = orderDate.getMonth();
      const orderYear = orderDate.getFullYear();
      
      const monthData = months.find(m => m.month === orderMonth && m.year === orderYear);
      if (monthData) {
        monthData.orders += order.total_amount || 0;
      }
    });

    // Aggregate invoices
    invoicesResult.data?.forEach(invoice => {
      const invoiceDate = new Date(invoice.invoice_date);
      const invoiceMonth = invoiceDate.getMonth();
      const invoiceYear = invoiceDate.getFullYear();
      
      const monthData = months.find(m => m.month === invoiceMonth && m.year === invoiceYear);
      if (monthData) {
        monthData.invoices += invoice.total_amount || 0;
      }
    });

    // Return formatted data with month labels
    const monthlyData = months.map(m => ({
      month: m.label,
      orders: m.orders,
      invoices: m.invoices,
    }));

    return createSuccessResult(monthlyData);
  } catch (error) {
    return createErrorResult(error, 'getMonthlyData');
  }
};

/**
 * Get status distribution for orders
 */
export const getOrderStatusDistribution = async () => {
  if (USE_MOCK_DATA) {
    const statusCounts = {};
    mockOrders.forEach(order => {
      statusCounts[order.status] = (statusCounts[order.status] || 0) + 1;
    });
    const data = Object.entries(statusCounts).map(([status, count]) => ({
      name: status,
      value: count,
    }));
    return createSuccessResult(data);
  }

  try {
    const { data, error } = await supabase
      .from('orders')
      .select('status');

    if (error) throw error;

    const statusCounts = {};
    data?.forEach(order => {
      statusCounts[order.status] = (statusCounts[order.status] || 0) + 1;
    });

    const distribution = Object.entries(statusCounts).map(([status, count]) => ({
      name: status,
      value: count,
    }));

    return createSuccessResult(distribution);
  } catch (error) {
    return createErrorResult(error, 'getOrderStatusDistribution');
  }
};

/**
 * Get status distribution for invoices
 */
export const getInvoiceStatusDistribution = async () => {
  if (USE_MOCK_DATA) {
    const statusCounts = {};
    mockInvoices.forEach(invoice => {
      statusCounts[invoice.status] = (statusCounts[invoice.status] || 0) + 1;
    });
    const data = Object.entries(statusCounts).map(([status, count]) => ({
      name: status,
      value: count,
    }));
    return createSuccessResult(data);
  }

  try {
    const { data, error } = await supabase
      .from('invoices')
      .select('status');

    if (error) throw error;

    const statusCounts = {};
    data?.forEach(invoice => {
      statusCounts[invoice.status] = (statusCounts[invoice.status] || 0) + 1;
    });

    const distribution = Object.entries(statusCounts).map(([status, count]) => ({
      name: status,
      value: count,
    }));

    return createSuccessResult(distribution);
  } catch (error) {
    return createErrorResult(error, 'getInvoiceStatusDistribution');
  }
};

/**
 * Get top suppliers by amount
 */
export const getTopSuppliers = async ({ type = 'orders', limit = 10 } = {}) => {
  if (USE_MOCK_DATA) {
    const data = type === 'orders' ? mockOrders : mockInvoices;
    const supplierTotals = {};
    
    data.forEach(item => {
      supplierTotals[item.supplier] = (supplierTotals[item.supplier] || 0) + item.total_amount;
    });

    const sorted = Object.entries(supplierTotals)
      .map(([supplier, amount]) => ({ supplier, amount }))
      .sort((a, b) => b.amount - a.amount)
      .slice(0, limit);

    return createSuccessResult(sorted);
  }

  try {
    const table = type === 'orders' ? 'orders' : 'invoices';
    const { data, error } = await supabase
      .from(table)
      .select('supplier, total_amount');

    if (error) throw error;

    const supplierTotals = {};
    data?.forEach(item => {
      supplierTotals[item.supplier] = (supplierTotals[item.supplier] || 0) + item.total_amount;
    });

    const sorted = Object.entries(supplierTotals)
      .map(([supplier, amount]) => ({ supplier, amount }))
      .sort((a, b) => b.amount - a.amount)
      .slice(0, limit);

    return createSuccessResult(sorted);
  } catch (error) {
    return createErrorResult(error, 'getTopSuppliers');
  }
};

/**
 * Get monthly report data
 */
export const getMonthlyReport = async (period = new Date().getFullYear()) => {
  if (USE_MOCK_DATA) {
    const report = mockMonthlyData.map((month, index) => ({
      month: month.month,
      orderCount: Math.floor(Math.random() * 20) + 5,
      orderAmount: month.orders,
      invoiceCount: Math.floor(Math.random() * 15) + 3,
      invoiceAmount: month.invoices,
    }));
    return createSuccessResult(report);
  }

  try {
    let startDate, endDate, months;
    
    // Handle "last12months" or specific year
    if (period === 'last12months') {
      // Calculate last 12 months
      const now = new Date();
      const last12 = new Date(now.getFullYear(), now.getMonth() - 11, 1);
      startDate = last12.toISOString().split('T')[0];
      endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString().split('T')[0];
      
      // Generate month labels for last 12 months
      months = [];
      for (let i = 11; i >= 0; i--) {
        const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const monthName = date.toLocaleDateString('en-US', { month: 'short' });
        const year = date.getFullYear();
        months.push({ 
          label: `${monthName} ${year}`, 
          month: date.getMonth(), 
          year: year,
          orderCount: 0,
          orderAmount: 0,
          invoiceCount: 0,
          invoiceAmount: 0
        });
      }
    } else {
      // Specific year
      const year = parseInt(period);
      startDate = `${year}-01-01`;
      endDate = `${year}-12-31`;
      
      const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      months = monthNames.map((month, index) => ({
        label: month,
        month: index,
        year: year,
        orderCount: 0,
        orderAmount: 0,
        invoiceCount: 0,
        invoiceAmount: 0,
      }));
    }

    const [ordersResult, invoicesResult] = await Promise.all([
      supabase
        .from('orders')
        .select('order_date, total_amount')
        .gte('order_date', startDate)
        .lte('order_date', endDate),
      supabase
        .from('invoices')
        .select('invoice_date, total_amount')
        .gte('invoice_date', startDate)
        .lte('invoice_date', endDate),
    ]);

    if (ordersResult.error) throw ordersResult.error;
    if (invoicesResult.error) throw invoicesResult.error;

    ordersResult.data?.forEach(order => {
      const orderDate = new Date(order.order_date);
      const orderMonth = orderDate.getMonth();
      const orderYear = orderDate.getFullYear();
      
      const monthData = months.find(m => m.month === orderMonth && m.year === orderYear);
      if (monthData) {
        monthData.orderCount += 1;
        monthData.orderAmount += order.total_amount || 0;
      }
    });

    invoicesResult.data?.forEach(invoice => {
      const invoiceDate = new Date(invoice.invoice_date);
      const invoiceMonth = invoiceDate.getMonth();
      const invoiceYear = invoiceDate.getFullYear();
      
      const monthData = months.find(m => m.month === invoiceMonth && m.year === invoiceYear);
      if (monthData) {
        monthData.invoiceCount += 1;
        monthData.invoiceAmount += invoice.total_amount || 0;
      }
    });

    // Return formatted report with month labels
    const report = months.map(m => ({
      month: m.label,
      orderCount: m.orderCount,
      orderAmount: m.orderAmount,
      invoiceCount: m.invoiceCount,
      invoiceAmount: m.invoiceAmount,
    }));

    return createSuccessResult(report);
  } catch (error) {
    return createErrorResult(error, 'getMonthlyReport');
  }
};

/**
 * Get yearly comparison data
 */
export const getYearlyComparison = async () => {
  if (USE_MOCK_DATA) {
    const currentYear = new Date().getFullYear();
    return createSuccessResult([
      { year: currentYear - 1, orders: 5200000, invoices: 4800000 },
      { year: currentYear, orders: 6500000, invoices: 6100000 },
    ]);
  }

  try {
    const currentYear = new Date().getFullYear();
    const lastYear = currentYear - 1;

    const years = [lastYear, currentYear];
    const comparison = [];

    for (const year of years) {
      const startDate = `${year}-01-01`;
      const endDate = `${year}-12-31`;

      const [ordersResult, invoicesResult] = await Promise.all([
        supabase
          .from('orders')
          .select('total_amount')
          .gte('order_date', startDate)
          .lte('order_date', endDate),
        supabase
          .from('invoices')
          .select('total_amount')
          .gte('invoice_date', startDate)
          .lte('invoice_date', endDate),
      ]);

      const orderTotal = ordersResult.data?.reduce((sum, o) => sum + (o.total_amount || 0), 0) || 0;
      const invoiceTotal = invoicesResult.data?.reduce((sum, i) => sum + (i.total_amount || 0), 0) || 0;

      comparison.push({
        year,
        orders: orderTotal,
        invoices: invoiceTotal,
      });
    }

    return createSuccessResult(comparison);
  } catch (error) {
    return createErrorResult(error, 'getYearlyComparison');
  }
};
