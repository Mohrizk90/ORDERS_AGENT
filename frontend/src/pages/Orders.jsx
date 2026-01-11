import { useState } from 'react';
import { Plus, Download } from 'lucide-react';
import OrdersTable from '../components/orders/OrdersTable';
import OrderDetail from '../components/orders/OrderDetail';
import OrderForm from '../components/orders/OrderForm';
import Filters from '../components/common/Filters';
import Modal from '../components/common/Modal';
import { mockStats, formatCurrency } from '../data/mockData';

export default function Orders() {
  const [filters, setFilters] = useState({
    search: '',
    supplier: '',
    status: '',
    dateFrom: '',
    dateTo: '',
  });

  const [selectedOrder, setSelectedOrder] = useState(null);
  const [modalMode, setModalMode] = useState(null); // 'view', 'edit', 'create', 'delete'

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

  const handleFormSubmit = (data) => {
    console.log('Form submitted:', data);
    // Here you would call the API to save the order
    closeModal();
  };

  const handleConfirmDelete = () => {
    console.log('Deleting order:', selectedOrder?.id);
    // Here you would call the API to delete the order
    closeModal();
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
        <div className="card-flat">
          <p className="text-sm text-gray-500">Total Orders</p>
          <p className="text-2xl font-bold text-gray-900">{mockStats.totalOrders}</p>
        </div>
        <div className="card-flat">
          <p className="text-sm text-gray-500">Pending</p>
          <p className="text-2xl font-bold text-yellow-600">{mockStats.pendingOrders}</p>
        </div>
        <div className="card-flat">
          <p className="text-sm text-gray-500">Total Value</p>
          <p className="text-2xl font-bold text-gray-900">{formatCurrency(mockStats.totalOrderAmount)}</p>
        </div>
        <div className="card-flat">
          <p className="text-sm text-gray-500">Processed Today</p>
          <p className="text-2xl font-bold text-green-600">{mockStats.processedToday}</p>
        </div>
      </div>

      {/* Filters */}
      <Filters filters={filters} setFilters={setFilters} type="orders" />

      {/* Table */}
      <div className="card">
        <OrdersTable
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
            <button onClick={closeModal} className="btn btn-secondary">
              Cancel
            </button>
            <button onClick={handleConfirmDelete} className="btn btn-danger">
              Delete Order
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
