import { useState, useEffect } from 'react';
import { Calendar, TrendingUp, TrendingDown, DollarSign, FileText, Receipt, Download } from 'lucide-react';
import { getMonthlyReport } from '../../services/analyticsService';
import { formatCurrency } from '../../utils/dataTransformers';
import { CardLoadingSpinner } from '../common/LoadingSpinner';

export default function MonthlyReport({ year = new Date().getFullYear() }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const result = await getMonthlyReport(year);
      if (result.success) {
        setData(result.data || []);
      }
      setLoading(false);
    };
    fetchData();
  }, [year]);

  if (loading) {
    return (
      <div className="card">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-primary-100 rounded-lg">
            <Calendar className="w-5 h-5 text-primary-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Monthly Report</h3>
            <p className="text-sm text-gray-500">{year} Summary</p>
          </div>
        </div>
        <CardLoadingSpinner />
      </div>
    );
  }

  // Calculate totals
  const totalOrderAmount = data.reduce((sum, m) => sum + (m.orderAmount || 0), 0);
  const totalInvoiceAmount = data.reduce((sum, m) => sum + (m.invoiceAmount || 0), 0);
  const avgOrderAmount = data.length > 0 ? totalOrderAmount / data.length : 0;
  const avgInvoiceAmount = data.length > 0 ? totalInvoiceAmount / data.length : 0;
  
  // Calculate growth (last month vs previous)
  const lastMonth = data[data.length - 1];
  const prevMonth = data[data.length - 2];
  const orderGrowth = prevMonth?.orderAmount 
    ? ((lastMonth?.orderAmount - prevMonth.orderAmount) / prevMonth.orderAmount * 100).toFixed(1)
    : 0;
  const invoiceGrowth = prevMonth?.invoiceAmount 
    ? ((lastMonth?.invoiceAmount - prevMonth.invoiceAmount) / prevMonth.invoiceAmount * 100).toFixed(1)
    : 0;

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary-100 rounded-lg">
            <Calendar className="w-5 h-5 text-primary-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Monthly Report</h3>
            <p className="text-sm text-gray-500">{year} Summary</p>
          </div>
        </div>
        <button className="btn btn-secondary btn-sm">
          <Download className="w-4 h-4 mr-1" />
          Export
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="p-4 bg-blue-50 rounded-xl">
          <div className="flex items-center gap-2 text-blue-600 mb-2">
            <FileText className="w-4 h-4" />
            <span className="text-sm font-medium">Total Orders</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalOrderAmount)}</p>
          <p className={`text-sm mt-1 flex items-center gap-1 ${parseFloat(orderGrowth) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {parseFloat(orderGrowth) >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
            {orderGrowth}% vs last month
          </p>
        </div>

        <div className="p-4 bg-red-50 rounded-xl">
          <div className="flex items-center gap-2 text-red-600 mb-2">
            <Receipt className="w-4 h-4" />
            <span className="text-sm font-medium">Total Invoices</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalInvoiceAmount)}</p>
          <p className={`text-sm mt-1 flex items-center gap-1 ${parseFloat(invoiceGrowth) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {parseFloat(invoiceGrowth) >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
            {invoiceGrowth}% vs last month
          </p>
        </div>

        <div className="p-4 bg-green-50 rounded-xl">
          <div className="flex items-center gap-2 text-green-600 mb-2">
            <DollarSign className="w-4 h-4" />
            <span className="text-sm font-medium">Avg. Orders</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">{formatCurrency(avgOrderAmount)}</p>
          <p className="text-sm text-gray-500 mt-1">Per month</p>
        </div>

        <div className="p-4 bg-yellow-50 rounded-xl">
          <div className="flex items-center gap-2 text-yellow-600 mb-2">
            <DollarSign className="w-4 h-4" />
            <span className="text-sm font-medium">Avg. Invoices</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">{formatCurrency(avgInvoiceAmount)}</p>
          <p className="text-sm text-gray-500 mt-1">Per month</p>
        </div>
      </div>

      {/* Monthly Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Month</th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase">Orders</th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase">Invoices</th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase">Total</th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase">Ratio</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {data.map((month) => {
              const total = (month.orderAmount || 0) + (month.invoiceAmount || 0);
              const ratio = month.invoiceAmount > 0 
                ? ((month.orderAmount / month.invoiceAmount) * 100).toFixed(0)
                : 0;
              
              return (
                <tr key={month.month} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">{month.month}</td>
                  <td className="px-4 py-3 text-sm text-right text-blue-600 font-medium">
                    {formatCurrency(month.orderAmount || 0)}
                  </td>
                  <td className="px-4 py-3 text-sm text-right text-red-600 font-medium">
                    {formatCurrency(month.invoiceAmount || 0)}
                  </td>
                  <td className="px-4 py-3 text-sm text-right font-semibold text-gray-900">
                    {formatCurrency(total)}
                  </td>
                  <td className="px-4 py-3 text-sm text-right">
                    <span className="px-2 py-1 bg-gray-100 rounded text-gray-700">
                      {ratio}%
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
          <tfoot className="bg-gray-100">
            <tr>
              <td className="px-4 py-3 text-sm font-bold text-gray-900">Total</td>
              <td className="px-4 py-3 text-sm text-right text-blue-600 font-bold">
                {formatCurrency(totalOrderAmount)}
              </td>
              <td className="px-4 py-3 text-sm text-right text-red-600 font-bold">
                {formatCurrency(totalInvoiceAmount)}
              </td>
              <td className="px-4 py-3 text-sm text-right font-bold text-gray-900">
                {formatCurrency(totalOrderAmount + totalInvoiceAmount)}
              </td>
              <td className="px-4 py-3 text-sm text-right font-bold">
                {totalInvoiceAmount > 0 ? ((totalOrderAmount / totalInvoiceAmount) * 100).toFixed(0) : 0}%
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}
