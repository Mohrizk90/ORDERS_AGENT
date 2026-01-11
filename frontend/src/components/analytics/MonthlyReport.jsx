import { Calendar, TrendingUp, DollarSign, FileText, Receipt, Download } from 'lucide-react';
import { mockMonthlyData, formatCurrency } from '../../data/mockData';

export default function MonthlyReport() {
  // Calculate totals
  const totalOrders = mockMonthlyData.reduce((sum, m) => sum + m.orders, 0);
  const totalInvoices = mockMonthlyData.reduce((sum, m) => sum + m.invoices, 0);
  const avgOrders = totalOrders / mockMonthlyData.length;
  const avgInvoices = totalInvoices / mockMonthlyData.length;
  
  // Calculate growth (last month vs previous)
  const lastMonth = mockMonthlyData[mockMonthlyData.length - 1];
  const prevMonth = mockMonthlyData[mockMonthlyData.length - 2];
  const orderGrowth = ((lastMonth.orders - prevMonth.orders) / prevMonth.orders * 100).toFixed(1);
  const invoiceGrowth = ((lastMonth.invoices - prevMonth.invoices) / prevMonth.invoices * 100).toFixed(1);

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary-100 rounded-lg">
            <Calendar className="w-5 h-5 text-primary-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Monthly Report</h3>
            <p className="text-sm text-gray-500">2024 Summary</p>
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
          <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalOrders)}</p>
          <p className="text-sm text-green-600 mt-1 flex items-center gap-1">
            <TrendingUp className="w-3 h-3" />
            {orderGrowth}% vs last month
          </p>
        </div>

        <div className="p-4 bg-red-50 rounded-xl">
          <div className="flex items-center gap-2 text-red-600 mb-2">
            <Receipt className="w-4 h-4" />
            <span className="text-sm font-medium">Total Invoices</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalInvoices)}</p>
          <p className="text-sm text-green-600 mt-1 flex items-center gap-1">
            <TrendingUp className="w-3 h-3" />
            {invoiceGrowth}% vs last month
          </p>
        </div>

        <div className="p-4 bg-green-50 rounded-xl">
          <div className="flex items-center gap-2 text-green-600 mb-2">
            <DollarSign className="w-4 h-4" />
            <span className="text-sm font-medium">Avg. Orders</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">{formatCurrency(avgOrders)}</p>
          <p className="text-sm text-gray-500 mt-1">Per month</p>
        </div>

        <div className="p-4 bg-yellow-50 rounded-xl">
          <div className="flex items-center gap-2 text-yellow-600 mb-2">
            <DollarSign className="w-4 h-4" />
            <span className="text-sm font-medium">Avg. Invoices</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">{formatCurrency(avgInvoices)}</p>
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
            {mockMonthlyData.map((month, index) => {
              const total = month.orders + month.invoices;
              const ratio = (month.orders / month.invoices * 100).toFixed(0);
              
              return (
                <tr key={month.month} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">{month.month}</td>
                  <td className="px-4 py-3 text-sm text-right text-blue-600 font-medium">
                    {formatCurrency(month.orders)}
                  </td>
                  <td className="px-4 py-3 text-sm text-right text-red-600 font-medium">
                    {formatCurrency(month.invoices)}
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
                {formatCurrency(totalOrders)}
              </td>
              <td className="px-4 py-3 text-sm text-right text-red-600 font-bold">
                {formatCurrency(totalInvoices)}
              </td>
              <td className="px-4 py-3 text-sm text-right font-bold text-gray-900">
                {formatCurrency(totalOrders + totalInvoices)}
              </td>
              <td className="px-4 py-3 text-sm text-right font-bold">
                {(totalOrders / totalInvoices * 100).toFixed(0)}%
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}
