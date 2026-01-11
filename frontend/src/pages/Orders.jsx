import { useState, useEffect, useCallback } from 'react';
import { Plus, Download } from 'lucide-react';
import OrdersTable from '../components/orders/OrdersTable';
import OrderDetail from '../components/orders/OrderDetail';
import OrderForm from '../components/orders/OrderForm';
import Filters from '../components/common/Filters';
import Modal from '../components/common/Modal';
import { CardLoadingSpinner } from '../components/common/LoadingSpinner';
import { getDashboardStats } from '../services/statsService';
import { createOrder, updateOrder, deleteOrder } from '../services/ordersService';
import { formatCurrency } from '../utils/dataTransformers';
import { useToast } from '../components/common/Toast';

export default function Orders() {
  const [filters, setFilters] = useState({
    search: '',
    supplier: '',
    status: '',
    dateFrom: '',
    dateTo: '',
  });

  const [stats, setStats] = useState(null);
  const [loadingStats, setLoadingStats] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [modalMode, setModalMode] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const toast = useToast();

  const fetchStats = useCallback(async () => {
    const result = await getDashboardStats();
    if (result.success) {
      setStats(result.data);
    }
    setLoadingStats(false);
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats, refreshKey]);

  const handleView = (order) => {
    setSelectedOrder(order);
    setModalMode('view');
  };

  const handleEdit = (order) => {
    setSelectedOrder(order);
    setModalMode('edit');
  };

  const handleDelete = (order) => {
    setSelectedOrder(order);
    setModalMode('delete');
  };

  const handleCreate = () => {
    setSelectedOrder(null);
    setModalMode('create');
  };

  const closeModal = () => {
    setSelectedOrder(null);
    setModalMode(null);
  };

  const handleFormSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      if (modalMode === 'create') {
        const result = await createOrder(data);
        if (!result.success) {
          throw new Error(result.error || 'Failed to create order');
        }
        toast.success('Order created successfully');
      } else if (modalMode === 'edit') {
        const result = await updateOrder(selectedOrder.id, data);
        if (!result.success) {
          throw new Error(result.error || 'Failed to update order');
        }
        toast.success('Order updated successfully');
      }
      closeModal();
      setRefreshKey(prev => prev + 1);
    } catch (err) {
      toast.error(err.message || 'An error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleConfirmDelete = async () => {
    setIsSubmitting(true);
    try {
      const result = await deleteOrder(selectedOrder.id);
      if (!result.success) {
        throw new Error(result.error || 'Failed to delete order');
      }
      toast.success('Order deleted successfully');
      closeModal();
      setRefreshKey(prev => prev + 1);
    } catch (err) {
      toast.error(err.message || 'Failed to delete order');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Orders</h1>
          <p className="text-gray-500 mt-1">Manage and track all your orders</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="btn btn-secondary">
            <Download className="w-4 h-4 mr-2" />
            Export
          </button>
          <button onClick={handleCreate} className="btn btn-primary">
            <Plus className="w-4 h-4 mr-2" />
            New Order
          </button>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {loadingStats ? (
          <>
            <div className="card-flat"><CardLoadingSpinner /></div>
            <div className="card-flat"><CardLoadingSpinner /></div>
            <div className="card-flat"><CardLoadingSpinner /></div>
            <div className="card-flat"><CardLoadingSpinner /></div>
          </>
        ) : (
          <>
            <div className="card-flat">
              <p className="text-sm text-gray-500">Total Orders</p>
              <p className="text-2xl font-bold text-gray-900">{stats?.totalOrders || 0}</p>
            </div>
            <div className="card-flat">
              <p className="text-sm text-gray-500">Pending</p>
              <p className="text-2xl font-bold text-yellow-600">{stats?.pendingOrders || 0}</p>
            </div>
            <div className="card-flat">
              <p className="text-sm text-gray-500">Total Value</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(stats?.totalOrderAmount || 0)}</p>
            </div>
            <div className="card-flat">
              <p className="text-sm text-gray-500">Processed Today</p>
              <p className="text-2xl font-bold text-green-600">{stats?.processedToday || 0}</p>
            </div>
          </>
        )}
      </div>

      {/* Filters */}
      <Filters filters={filters} setFilters={setFilters} type="orders" />

      {/* Table */}
      <div className="card">
        <OrdersTable
          key={refreshKey}
          filters={filters}
          onView={handleView}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </div>

      {/* View Modal */}
      <Modal
        isOpen={modalMode === 'view'}
        onClose={closeModal}
        title="Order Details"
        size="lg"
      >
        <OrderDetail
          order={selectedOrder}
          onClose={closeModal}
          onEdit={() => setModalMode('edit')}
          onDelete={() => setModalMode('delete')}
        />
      </Modal>

      {/* Create/Edit Modal */}
      <Modal
        isOpen={modalMode === 'create' || modalMode === 'edit'}
        onClose={closeModal}
        title={modalMode === 'create' ? 'Create New Order' : 'Edit Order'}
        size="lg"
      >
        <OrderForm
          order={modalMode === 'edit' ? selectedOrder : null}
          onSubmit={handleFormSubmit}
          onCancel={closeModal}
          isSubmitting={isSubmitting}
        />
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={modalMode === 'delete'}
        onClose={closeModal}
        title="Delete Order"
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-gray-600">
            Are you sure you want to delete this order from <strong>{selectedOrder?.supplier}</strong>?
            This action cannot be undone.
          </p>
          <div className="flex justify-end gap-3">
            <button onClick={closeModal} className="btn btn-secondary" disabled={isSubmitting}>
              Cancel
            </button>
            <button 
              onClick={handleConfirmDelete} 
              className="btn btn-danger"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Deleting...' : 'Delete Order'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
