import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { FileText, Receipt, DollarSign, AlertTriangle } from 'lucide-react';
import StatsCard from '../components/dashboard/StatsCard';
import RecentActivity from '../components/dashboard/RecentActivity';
import QuickActions from '../components/dashboard/QuickActions';
import AlertsPanel from '../components/dashboard/AlertsPanel';
import { ComparisonChart } from '../components/analytics/Charts';
import OrdersTable from '../components/orders/OrdersTable';
import InvoicesTable from '../components/invoices/InvoicesTable';
import { getDashboardStats } from '../services/statsService';
import { formatCurrency } from '../utils/dataTransformers';
import supabase from '../lib/supabase';
import { CardLoadingSpinner } from '../components/common/LoadingSpinner';
import ErrorMessage from '../components/common/ErrorMessage';
import ConnectionStatus from '../components/common/ConnectionStatus';

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Memoize empty filters object to prevent unnecessary re-renders
  const emptyFilters = useMemo(() => ({}), []);

  const fetchStats = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    const result = await getDashboardStats();
    if (result.success) {
      setStats(result.data);
      setError(null);
    } else {
      setError(result.error || 'Failed to load dashboard statistics');
      // Set default stats on error so UI doesn't break
      setStats({
        totalOrders: 0,
        totalInvoices: 0,
        totalOrderAmount: 0,
        totalInvoiceAmount: 0,
        pendingOrders: 0,
        pendingInvoices: 0,
        overdueInvoices: 0,
        highValueTransactions: 0,
        monthlyGrowth: 0,
        processedToday: 0,
        activeSuppliers: 0,
      });
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  // Real-time subscription - refetch stats when data changes
  // Use a ref to prevent infinite loops and add debouncing
  const fetchStatsRef = useRef(fetchStats);
  fetchStatsRef.current = fetchStats;
  const debounceTimerRef = useRef(null);

  useEffect(() => {
    const handleRealtimeUpdate = () => {
      // Debounce to prevent excessive requests
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
      debounceTimerRef.current = setTimeout(() => {
        fetchStatsRef.current();
      }, 2000); // Wait 2 seconds before refetching stats
    };

    // Only subscribe if realtime is enabled
    if (import.meta.env.VITE_ENABLE_REALTIME === 'true' && 
        import.meta.env.VITE_USE_MOCK_DATA !== 'true') {
      const unsubscribeOrders = supabase
        .channel('dashboard-orders')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, handleRealtimeUpdate)
        .subscribe();
      
      const unsubscribeInvoices = supabase
        .channel('dashboard-invoices')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'invoices' }, handleRealtimeUpdate)
        .subscribe();

      return () => {
        if (debounceTimerRef.current) {
          clearTimeout(debounceTimerRef.current);
        }
        unsubscribeOrders.unsubscribe();
        unsubscribeInvoices.unsubscribe();
      };
    }
  }, []);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Connection Status */}
      <ConnectionStatus />

      {/* Error Banner */}
      {error && (
        <ErrorMessage
          message={error}
          onRetry={fetchStats}
          variant="banner"
        />
      )}

      {/* Alerts */}
      <AlertsPanel />

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {loading ? (
          <>
            <div className="card"><CardLoadingSpinner /></div>
            <div className="card"><CardLoadingSpinner /></div>
            <div className="card"><CardLoadingSpinner /></div>
            <div className="card"><CardLoadingSpinner /></div>
          </>
        ) : (
          <>
            <StatsCard
              title="Total Orders"
              value={stats?.totalOrders || 0}
              subtitle="this month"
              icon={FileText}
              trend="+12.5%"
              trendDirection="up"
              color="blue"
            />
            <StatsCard
              title="Total Invoices"
              value={stats?.totalInvoices || 0}
              subtitle="this month"
              icon={Receipt}
              trend="+8.3%"
              trendDirection="up"
              color="green"
            />
            <StatsCard
              title="Order Amount"
              value={formatCurrency(stats?.totalOrderAmount || 0)}
              subtitle="total value"
              icon={DollarSign}
              color="yellow"
            />
            <StatsCard
              title="High-Value Alerts"
              value={stats?.highValueTransactions || 0}
              subtitle="≥ $50,000"
              icon={AlertTriangle}
              color="red"
            />
          </>
        )}
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
          <OrdersTable limit={5} showActions={false} filters={emptyFilters} disableRealtime={true} />
        </div>

        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Recent Invoices</h3>
            <a href="/invoices" className="text-sm text-primary-600 hover:text-primary-700 font-medium">
              View all →
            </a>
          </div>
          <InvoicesTable limit={5} showActions={false} filters={emptyFilters} disableRealtime={true} />
        </div>
      </div>
    </div>
  );
}
