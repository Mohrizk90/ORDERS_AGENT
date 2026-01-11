import supabase, { USE_MOCK_DATA } from '../lib/supabase';
import { mockMonthlyData, mockOrders, mockInvoices } from '../data/mockData';
import { createSuccessResult, createErrorResult } from '../utils/errorHandler';

/**
 * Get monthly data for charts
 */
export const getMonthlyData = async (year = new Date().getFullYear()) => {
  if (USE_MOCK_DATA) {
    return createSuccessResult(mockMonthlyData);
  }

  try {
    const startDate = `${year}-01-01`;
    const endDate = `${year}-12-31`;

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

    // Aggregate by month
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const monthlyData = monthNames.map((month, index) => ({
      month,
      orders: 0,
      invoices: 0,
    }));

    // Aggregate orders
    ordersResult.data?.forEach(order => {
      const monthIndex = new Date(order.order_date).getMonth();
      monthlyData[monthIndex].orders += order.total_amount || 0;
    });

    // Aggregate invoices
    invoicesResult.data?.forEach(invoice => {
      const monthIndex = new Date(invoice.invoice_date).getMonth();
      monthlyData[monthIndex].invoices += invoice.total_amount || 0;
    });

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
export const getMonthlyReport = async (year = new Date().getFullYear()) => {
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
    const startDate = `${year}-01-01`;
    const endDate = `${year}-12-31`;

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

    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const report = monthNames.map(month => ({
      month,
      orderCount: 0,
      orderAmount: 0,
      invoiceCount: 0,
      invoiceAmount: 0,
    }));

    ordersResult.data?.forEach(order => {
      const monthIndex = new Date(order.order_date).getMonth();
      report[monthIndex].orderCount += 1;
      report[monthIndex].orderAmount += order.total_amount || 0;
    });

    invoicesResult.data?.forEach(invoice => {
      const monthIndex = new Date(invoice.invoice_date).getMonth();
      report[monthIndex].invoiceCount += 1;
      report[monthIndex].invoiceAmount += invoice.total_amount || 0;
    });

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
