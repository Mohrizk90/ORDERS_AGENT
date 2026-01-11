import { FileText, Receipt, DollarSign, AlertTriangle, TrendingUp, Users } from 'lucide-react';
import StatsCard from '../components/dashboard/StatsCard';
import RecentActivity from '../components/dashboard/RecentActivity';
import QuickActions from '../components/dashboard/QuickActions';
import AlertsPanel from '../components/dashboard/AlertsPanel';
import { ComparisonChart } from '../components/analytics/Charts';
import OrdersTable from '../components/orders/OrdersTable';
import InvoicesTable from '../components/invoices/InvoicesTable';
import { mockStats, formatCurrency } from '../data/mockData';

export default function Dashboard() {
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Alerts */}
      <AlertsPanel />

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Orders"
          value={mockStats.totalOrders}
          subtitle="this month"
          icon={FileText}
          trend="+12.5%"
          trendDirection="up"
          color="blue"
        />
        <StatsCard
          title="Total Invoices"
          value={mockStats.totalInvoices}
          subtitle="this month"
          icon={Receipt}
          trend="+8.3%"
          trendDirection="up"
          color="green"
        />
        <StatsCard
          title="Order Amount"
          value={formatCurrency(mockStats.totalOrderAmount)}
          subtitle="total value"
          icon={DollarSign}
          color="yellow"
        />
        <StatsCard
          title="High-Value Alerts"
          value={mockStats.highValueTransactions}
          subtitle="≥ $50,000"
          icon={AlertTriangle}
          color="red"
        />
      </div>

      {/* Quick Actions and Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <QuickActions />
        </div>
        <div className="lg:col-span-2">
          <RecentActivity />
        </div>
      </div>

      {/* Chart */}
      <ComparisonChart />

      {/* Recent Tables */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Recent Orders</h3>
            <a href="/orders" className="text-sm text-primary-600 hover:text-primary-700 font-medium">
              View all →
            </a>
          </div>
          <OrdersTable limit={5} showActions={false} />
        </div>

        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Recent Invoices</h3>
            <a href="/invoices" className="text-sm text-primary-600 hover:text-primary-700 font-medium">
              View all →
            </a>
          </div>
          <InvoicesTable limit={5} showActions={false} />
        </div>
      </div>
    </div>
  );
}
