import { useState, useEffect } from 'react';
import { FileText, Calendar, DollarSign, Truck, Download, Edit, Trash2 } from 'lucide-react';
import { getOrderItems } from '../../services/ordersService';
import { formatCurrency, formatDate, formatDateTime, getStatusColor } from '../../utils/dataTransformers';
import { CardLoadingSpinner } from '../common/LoadingSpinner';

export default function OrderDetail({ order, onClose, onEdit, onDelete }) {
  const [orderItems, setOrderItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchItems = async () => {
      if (order?.id) {
        setLoading(true);
        const result = await getOrderItems(order.id);
        if (result.success) {
          setOrderItems(result.data || []);
        }
        setLoading(false);
      }
    };
    fetchItems();
  }, [order?.id]);

  if (!order) return null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between pb-4 border-b border-gray-200">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-blue-100 rounded-xl">
            <FileText className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">{order.supplier}</h2>
            <p className="text-sm text-gray-500 font-mono mt-1">{order.id}</p>
            <span className={`${getStatusColor(order.status)} mt-2 inline-block`}>
              {order.status}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => onEdit?.(order)}
            className="btn btn-secondary btn-sm"
          >
            <Edit className="w-4 h-4 mr-1" />
            Edit
          </button>
          <button
            onClick={() => onDelete?.(order)}
            className="btn btn-danger btn-sm"
          >
            <Trash2 className="w-4 h-4 mr-1" />
            Delete
          </button>
        </div>
      </div>

      {/* Details Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 bg-gray-50 rounded-xl">
          <div className="flex items-center gap-2 text-gray-500 mb-1">
            <Calendar className="w-4 h-4" />
            <span className="text-sm">Order Date</span>
          </div>
          <p className="font-semibold text-gray-900">{formatDate(order.order_date)}</p>
        </div>
        
        <div className="p-4 bg-gray-50 rounded-xl">
          <div className="flex items-center gap-2 text-gray-500 mb-1">
            <DollarSign className="w-4 h-4" />
            <span className="text-sm">Total Amount</span>
          </div>
          <p className="font-semibold text-gray-900">{formatCurrency(order.total_amount)}</p>
        </div>
        
        <div className="p-4 bg-gray-50 rounded-xl">
          <div className="flex items-center gap-2 text-gray-500 mb-1">
            <DollarSign className="w-4 h-4" />
            <span className="text-sm">Net Amount</span>
          </div>
          <p className="font-semibold text-gray-900">{formatCurrency(order.net_amount)}</p>
        </div>
        
        <div className="p-4 bg-gray-50 rounded-xl">
          <div className="flex items-center gap-2 text-gray-500 mb-1">
            <Truck className="w-4 h-4" />
            <span className="text-sm">Source</span>
          </div>
          <p className="font-semibold text-gray-900">{order.source_channel}</p>
        </div>
      </div>

      {/* Line Items */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Line Items</h3>
          <button className="btn btn-secondary btn-sm">
            <Download className="w-4 h-4 mr-1" />
            Export
          </button>
        </div>
        
        {loading ? (
          <CardLoadingSpinner />
        ) : orderItems.length > 0 ? (
          <div className="overflow-x-auto border border-gray-200 rounded-xl">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Product</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Code</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase">Units</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase">Price</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {orderItems.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <p className="text-sm font-medium text-gray-900">{item.description}</p>
                      {item.batch_number && (
                        <p className="text-xs text-gray-500">Batch: {item.batch_number}</p>
                      )}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600 font-mono">
                      {item.product_code}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600 text-right">
                      {item.units}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600 text-right">
                      {formatCurrency(item.unit_price)}
                    </td>
                    <td className="px-4 py-3 text-sm font-semibold text-gray-900 text-right">
                      {formatCurrency(item.amount)}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-gray-50">
                <tr>
                  <td colSpan="4" className="px-4 py-3 text-sm font-semibold text-gray-900 text-right">
                    Total
                  </td>
                  <td className="px-4 py-3 text-sm font-bold text-gray-900 text-right">
                    {formatCurrency(orderItems.reduce((sum, item) => sum + (item.amount || 0), 0))}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        ) : (
          <div className="text-center py-8 bg-gray-50 rounded-xl">
            <p className="text-gray-500">No line items available</p>
          </div>
        )}
      </div>

      {/* Metadata */}
      <div className="pt-4 border-t border-gray-200 text-sm text-gray-500">
        <p>Created: {formatDateTime(order.created_at)}</p>
      </div>
    </div>
  );
}
