import { useState, useEffect, useCallback } from 'react';
import { Plus, Download } from 'lucide-react';
import InvoicesTable from '../components/invoices/InvoicesTable';
import InvoiceDetail from '../components/invoices/InvoiceDetail';
import InvoiceForm from '../components/invoices/InvoiceForm';
import Filters from '../components/common/Filters';
import Modal from '../components/common/Modal';
import { CardLoadingSpinner } from '../components/common/LoadingSpinner';
import { getDashboardStats } from '../services/statsService';
import { createInvoice, updateInvoice, deleteInvoice } from '../services/invoicesService';
import { formatCurrency } from '../utils/dataTransformers';
import { useToast } from '../components/common/Toast';

export default function Invoices() {
  const [filters, setFilters] = useState({
    search: '',
    supplier: '',
    status: '',
    dateFrom: '',
    dateTo: '',
  });

  const [stats, setStats] = useState(null);
  const [loadingStats, setLoadingStats] = useState(true);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
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

  const handleView = (invoice) => {
    setSelectedInvoice(invoice);
    setModalMode('view');
  };

  const handleEdit = (invoice) => {
    setSelectedInvoice(invoice);
    setModalMode('edit');
  };

  const handleDelete = (invoice) => {
    setSelectedInvoice(invoice);
    setModalMode('delete');
  };

  const handleCreate = () => {
    setSelectedInvoice(null);
    setModalMode('create');
  };

  const closeModal = () => {
    setSelectedInvoice(null);
    setModalMode(null);
  };

  const handleFormSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      if (modalMode === 'create') {
        const result = await createInvoice(data);
        if (!result.success) {
          throw new Error(result.error || 'Failed to create invoice');
        }
        toast.success('Invoice created successfully');
      } else if (modalMode === 'edit') {
        const result = await updateInvoice(selectedInvoice.id, data);
        if (!result.success) {
          throw new Error(result.error || 'Failed to update invoice');
        }
        toast.success('Invoice updated successfully');
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
      const result = await deleteInvoice(selectedInvoice.id);
      if (!result.success) {
        throw new Error(result.error || 'Failed to delete invoice');
      }
      toast.success('Invoice deleted successfully');
      closeModal();
      setRefreshKey(prev => prev + 1);
    } catch (err) {
      toast.error(err.message || 'Failed to delete invoice');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Invoices</h1>
          <p className="text-gray-500 mt-1">Manage and track all your invoices</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="btn btn-secondary">
            <Download className="w-4 h-4 mr-2" />
            Export
          </button>
          <button onClick={handleCreate} className="btn btn-primary">
            <Plus className="w-4 h-4 mr-2" />
            New Invoice
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
              <p className="text-sm text-gray-500">Total Invoices</p>
              <p className="text-2xl font-bold text-gray-900">{stats?.totalInvoices || 0}</p>
            </div>
            <div className="card-flat">
              <p className="text-sm text-gray-500">Pending</p>
              <p className="text-2xl font-bold text-yellow-600">{stats?.pendingInvoices || 0}</p>
            </div>
            <div className="card-flat">
              <p className="text-sm text-gray-500">Overdue</p>
              <p className="text-2xl font-bold text-red-600">{stats?.overdueInvoices || 0}</p>
            </div>
            <div className="card-flat">
              <p className="text-sm text-gray-500">Total Value</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(stats?.totalInvoiceAmount || 0)}</p>
            </div>
          </>
        )}
      </div>

      {/* Filters */}
      <Filters filters={filters} setFilters={setFilters} type="invoices" />

      {/* Table */}
      <div className="card">
        <InvoicesTable
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
        title="Invoice Details"
        size="lg"
      >
        <InvoiceDetail
          invoice={selectedInvoice}
          onClose={closeModal}
          onEdit={() => setModalMode('edit')}
          onDelete={() => setModalMode('delete')}
        />
      </Modal>

      {/* Create/Edit Modal */}
      <Modal
        isOpen={modalMode === 'create' || modalMode === 'edit'}
        onClose={closeModal}
        title={modalMode === 'create' ? 'Create New Invoice' : 'Edit Invoice'}
        size="lg"
      >
        <InvoiceForm
          invoice={modalMode === 'edit' ? selectedInvoice : null}
          onSubmit={handleFormSubmit}
          onCancel={closeModal}
          isSubmitting={isSubmitting}
        />
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={modalMode === 'delete'}
        onClose={closeModal}
        title="Delete Invoice"
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-gray-600">
            Are you sure you want to delete this invoice from <strong>{selectedInvoice?.supplier}</strong>?
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
              {isSubmitting ? 'Deleting...' : 'Delete Invoice'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
