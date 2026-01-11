import { useState } from 'react';
import { Eye, Edit, Trash2, Download, CreditCard, Banknote } from 'lucide-react';
import { mockInvoices, formatCurrency, formatDate, getStatusColor } from '../../data/mockData';
import Pagination from '../common/Pagination';

export default function InvoicesTable({ 
  filters = {}, 
  limit, 
  onView, 
  onEdit, 
  onDelete,
  showActions = true 
}) {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRows, setSelectedRows] = useState([]);
  const itemsPerPage = limit || 10;

  // Filter invoices
  let filteredInvoices = [...mockInvoices];
  
  if (filters.search) {
    const search = filters.search.toLowerCase();
    filteredInvoices = filteredInvoices.filter(invoice =>
      invoice.supplier.toLowerCase().includes(search) ||
      invoice.id.toLowerCase().includes(search)
    );
  }
  
  if (filters.supplier) {
    filteredInvoices = filteredInvoices.filter(invoice => 
      invoice.supplier === filters.supplier
    );
  }
  
  if (filters.status) {
    filteredInvoices = filteredInvoices.filter(invoice => 
      invoice.status === filters.status
    );
  }
  
  if (filters.dateFrom) {
    filteredInvoices = filteredInvoices.filter(invoice => 
      invoice.invoice_date >= filters.dateFrom
    );
  }
  
  if (filters.dateTo) {
    filteredInvoices = filteredInvoices.filter(invoice => 
      invoice.invoice_date <= filters.dateTo
    );
  }

  // Paginate
  const totalPages = Math.ceil(filteredInvoices.length / itemsPerPage);
  const paginatedInvoices = limit
    ? filteredInvoices.slice(0, limit)
    : filteredInvoices.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const toggleSelectAll = () => {
    if (selectedRows.length === paginatedInvoices.length) {
      setSelectedRows([]);
    } else {
      setSelectedRows(paginatedInvoices.map(i => i.id));
    }
  };

  const toggleSelectRow = (id) => {
    setSelectedRows(prev =>
      prev.includes(id) ? prev.filter(r => r !== id) : [...prev, id]
    );
  };

  return (
    <div>
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
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr>
              {showActions && (
                <th className="table-header w-10">
                  <input
                    type="checkbox"
                    checked={selectedRows.length === paginatedInvoices.length && paginatedInvoices.length > 0}
                    onChange={toggleSelectAll}
                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                </th>
              )}
              <th className="table-header">Supplier</th>
              <th className="table-header">Date</th>
              <th className="table-header">Amount</th>
              <th className="table-header">Financing</th>
              <th className="table-header">Status</th>
              {showActions && <th className="table-header text-right">Actions</th>}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {paginatedInvoices.map((invoice) => (
              <tr 
                key={invoice.id} 
                className={`hover:bg-gray-50 transition-colors ${
                  selectedRows.includes(invoice.id) ? 'bg-primary-50' : ''
                }`}
              >
                {showActions && (
                  <td className="table-cell">
                    <input
                      type="checkbox"
                      checked={selectedRows.includes(invoice.id)}
                      onChange={() => toggleSelectRow(invoice.id)}
                      className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                    />
                  </td>
                )}
                <td className="table-cell">
                  <div>
                    <p className="font-medium text-gray-900">{invoice.supplier}</p>
                    <p className="text-xs text-gray-500 font-mono">{invoice.id.slice(0, 8)}...</p>
                  </div>
                </td>
                <td className="table-cell text-gray-600">
                  {formatDate(invoice.invoice_date)}
                </td>
                <td className="table-cell">
                  <div>
                    <p className="font-semibold text-gray-900">{formatCurrency(invoice.total_amount)}</p>
                    <p className="text-xs text-gray-500">
                      Net: {formatCurrency(invoice.net_amount)} | Rate: {invoice.exchange_rate}
                    </p>
                  </div>
                </td>
                <td className="table-cell">
                  <div className="flex items-center gap-2">
                    {invoice.financing_type === 'Credit' ? (
                      <CreditCard className="w-4 h-4 text-blue-500" />
                    ) : (
                      <Banknote className="w-4 h-4 text-green-500" />
                    )}
                    <span className="text-gray-600">{invoice.financing_type}</span>
                  </div>
                </td>
                <td className="table-cell">
                  <span className={getStatusColor(invoice.status)}>
                    {invoice.status}
                  </span>
                </td>
                {showActions && (
                  <td className="table-cell text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => onView?.(invoice)}
                        className="p-2 text-gray-500 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                        title="View"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onEdit?.(invoice)}
                        className="p-2 text-gray-500 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                        title="Edit"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onDelete?.(invoice)}
                        className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {!limit && filteredInvoices.length > 0 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={filteredInvoices.length}
          itemsPerPage={itemsPerPage}
          onPageChange={setCurrentPage}
        />
      )}
    </div>
  );
}
