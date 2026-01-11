import { useState } from 'react';
import { Eye, Edit, Trash2, Download, Mail, MessageCircle, Globe, MoreVertical } from 'lucide-react';
import { mockOrders, formatCurrency, formatDate, getStatusColor } from '../../data/mockData';
import Pagination from '../common/Pagination';

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
  showActions = true 
}) {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRows, setSelectedRows] = useState([]);
  const itemsPerPage = limit || 10;

  // Filter orders
  let filteredOrders = [...mockOrders];
  
  if (filters.search) {
    const search = filters.search.toLowerCase();
    filteredOrders = filteredOrders.filter(order =>
      order.supplier.toLowerCase().includes(search) ||
      order.id.toLowerCase().includes(search)
    );
  }
  
  if (filters.supplier) {
    filteredOrders = filteredOrders.filter(order => 
      order.supplier === filters.supplier
    );
  }
  
  if (filters.status) {
    filteredOrders = filteredOrders.filter(order => 
      order.status === filters.status
    );
  }
  
  if (filters.dateFrom) {
    filteredOrders = filteredOrders.filter(order => 
      order.order_date >= filters.dateFrom
    );
  }
  
  if (filters.dateTo) {
    filteredOrders = filteredOrders.filter(order => 
      order.order_date <= filters.dateTo
    );
  }

  // Paginate
  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
  const paginatedOrders = limit
    ? filteredOrders.slice(0, limit)
    : filteredOrders.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const toggleSelectAll = () => {
    if (selectedRows.length === paginatedOrders.length) {
      setSelectedRows([]);
    } else {
      setSelectedRows(paginatedOrders.map(o => o.id));
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
                    checked={selectedRows.length === paginatedOrders.length && paginatedOrders.length > 0}
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
            {paginatedOrders.map((order) => {
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
      {!limit && filteredOrders.length > 0 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={filteredOrders.length}
          itemsPerPage={itemsPerPage}
          onPageChange={setCurrentPage}
        />
      )}
    </div>
  );
}
