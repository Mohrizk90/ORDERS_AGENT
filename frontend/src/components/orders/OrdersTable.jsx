import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { Eye, Edit, Trash2, Download, Mail, MessageCircle, Globe } from 'lucide-react';
import { getOrders } from '../../services/ordersService';
import { formatCurrency, formatDate, getStatusColor } from '../../utils/dataTransformers';
import supabase from '../../lib/supabase';
import Pagination from '../common/Pagination';
import LoadingSpinner, { TableLoadingSpinner } from '../common/LoadingSpinner';
import { TableError } from '../common/ErrorMessage';

const sourceIcons = {
  Email: Mail,
  Telegram: MessageCircle,
  Chat: MessageCircle,
  Web: Globe,
};

export default function OrdersTable({ 
  filters = {}, 
  limit, 
  onView, 
  onEdit, 
  onDelete,
  showActions = true,
  disableRealtime = false
}) {
  const [orders, setOrders] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRows, setSelectedRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const isFetchingRef = useRef(false);
  
  const itemsPerPage = limit || 10;

  // Create a stable filter key to prevent unnecessary re-renders
  const filterKey = useMemo(() => {
    return JSON.stringify({
      supplier: filters.supplier || '',
      status: filters.status || '',
      dateFrom: filters.dateFrom || '',
      dateTo: filters.dateTo || '',
      search: filters.search || '',
    });
  }, [filters.supplier, filters.status, filters.dateFrom, filters.dateTo, filters.search]);

  // Track last fetch parameters to prevent duplicate requests
  const lastFetchParamsRef = useRef(null);

  const fetchOrders = useCallback(async () => {
    // Prevent concurrent fetches
    if (isFetchingRef.current) {
      return;
    }
    
    // Create a key for this fetch to prevent duplicate requests
    const fetchKey = `${currentPage}-${itemsPerPage}-${filterKey}`;
    if (lastFetchParamsRef.current === fetchKey) {
      return; // Already fetched with these exact parameters
    }
    
    isFetchingRef.current = true;
    lastFetchParamsRef.current = fetchKey;
    setLoading(true);
    setError(null);
    
    const filterObj = JSON.parse(filterKey);
    const result = await getOrders({
      page: currentPage,
      limit: itemsPerPage,
      supplier: filterObj.supplier,
      status: filterObj.status,
      dateFrom: filterObj.dateFrom,
      dateTo: filterObj.dateTo,
      search: filterObj.search,
    });
    
    if (result.success) {
      setOrders(result.data.data || []);
      setTotalCount(result.data.total || 0);
    } else {
      setError(result.error || 'Failed to load orders');
    }
    
    setLoading(false);
    isFetchingRef.current = false;
  }, [currentPage, itemsPerPage, filterKey]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  // Real-time subscription - refetch when data changes
  // Use a ref to prevent infinite loops and add debouncing
  const fetchOrdersRef = useRef(fetchOrders);
  fetchOrdersRef.current = fetchOrders;
  const debounceTimerRef = useRef(null);

  useEffect(() => {
    if (!disableRealtime && 
        import.meta.env.VITE_ENABLE_REALTIME === 'true' && 
        import.meta.env.VITE_USE_MOCK_DATA !== 'true') {
      const unsubscribe = supabase
        .channel('orders-table-updates')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, () => {
          // Debounce to prevent excessive requests
          if (debounceTimerRef.current) {
            clearTimeout(debounceTimerRef.current);
          }
          debounceTimerRef.current = setTimeout(() => {
            if (!isFetchingRef.current) {
              fetchOrdersRef.current();
            }
          }, 2000); // Wait 2 seconds before refetching
        })
        .subscribe();

      return () => {
        if (debounceTimerRef.current) {
          clearTimeout(debounceTimerRef.current);
        }
        unsubscribe.unsubscribe();
      };
    }
  }, [disableRealtime]);

  const totalPages = Math.ceil(totalCount / itemsPerPage);

  const toggleSelectAll = () => {
    if (selectedRows.length === orders.length) {
      setSelectedRows([]);
    } else {
      setSelectedRows(orders.map(o => o.id));
    }
  };

  const toggleSelectRow = (id) => {
    setSelectedRows(prev =>
      prev.includes(id) ? prev.filter(r => r !== id) : [...prev, id]
    );
  };

  if (loading && orders.length === 0) {
    return <TableLoadingSpinner />;
  }

  if (error) {
    return <TableError message={error} onRetry={fetchOrders} />;
  }

  if (orders.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        <p>No orders found</p>
      </div>
    );
  }

  return (
    <div>
      {/* Loading overlay for refetching */}
      {loading && orders.length > 0 && (
        <div className="absolute inset-0 bg-white/50 flex items-center justify-center z-10">
          <LoadingSpinner size="sm" />
        </div>
      )}

      {/* Bulk Actions */}
      {selectedRows.length > 0 && (
        <div className="mb-4 p-3 bg-primary-50 border border-primary-200 rounded-lg flex items-center justify-between animate-fade-in">
          <span className="text-sm text-primary-700 font-medium">
            {selectedRows.length} item{selectedRows.length > 1 ? 's' : ''} selected
          </span>
          <div className="flex items-center gap-2">
            <button className="btn btn-sm btn-secondary">
              <Download className="w-4 h-4 mr-1" />
              Export
            </button>
            <button className="btn btn-sm btn-danger">
              <Trash2 className="w-4 h-4 mr-1" />
              Delete
            </button>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto relative">
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr>
              {showActions && (
                <th className="table-header w-10">
                  <input
                    type="checkbox"
                    checked={selectedRows.length === orders.length && orders.length > 0}
                    onChange={toggleSelectAll}
                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                </th>
              )}
              <th className="table-header">Supplier</th>
              <th className="table-header">Date</th>
              <th className="table-header">Amount</th>
              <th className="table-header">Source</th>
              <th className="table-header">Status</th>
              {showActions && <th className="table-header text-right">Actions</th>}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {orders.map((order) => {
              const SourceIcon = sourceIcons[order.source_channel] || Globe;
              
              return (
                <tr 
                  key={order.id} 
                  className={`hover:bg-gray-50 transition-colors ${
                    selectedRows.includes(order.id) ? 'bg-primary-50' : ''
                  }`}
                >
                  {showActions && (
                    <td className="table-cell">
                      <input
                        type="checkbox"
                        checked={selectedRows.includes(order.id)}
                        onChange={() => toggleSelectRow(order.id)}
                        className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                      />
                    </td>
                  )}
                  <td className="table-cell">
                    <div>
                      <p className="font-medium text-gray-900">{order.supplier}</p>
                      <p className="text-xs text-gray-500 font-mono">{order.id.slice(0, 8)}...</p>
                    </div>
                  </td>
                  <td className="table-cell text-gray-600">
                    {formatDate(order.order_date)}
                  </td>
                  <td className="table-cell">
                    <div>
                      <p className="font-semibold text-gray-900">{formatCurrency(order.total_amount)}</p>
                      <p className="text-xs text-gray-500">Net: {formatCurrency(order.net_amount)}</p>
                    </div>
                  </td>
                  <td className="table-cell">
                    <div className="flex items-center gap-2">
                      <SourceIcon className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-600">{order.source_channel}</span>
                    </div>
                  </td>
                  <td className="table-cell">
                    <span className={getStatusColor(order.status)}>
                      {order.status}
                    </span>
                  </td>
                  {showActions && (
                    <td className="table-cell text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => onView?.(order)}
                          className="p-2 text-gray-500 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                          title="View"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => onEdit?.(order)}
                          className="p-2 text-gray-500 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => onDelete?.(order)}
                          className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {!limit && totalCount > 0 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={totalCount}
          itemsPerPage={itemsPerPage}
          onPageChange={setCurrentPage}
        />
      )}
    </div>
  );
}
