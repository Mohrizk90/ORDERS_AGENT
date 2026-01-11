import { useState, useEffect } from 'react';
import { Receipt, Calendar, DollarSign, CreditCard, Percent, Download, Edit, Trash2 } from 'lucide-react';
import { getInvoiceItems } from '../../services/invoicesService';
import { formatCurrency, formatDate, formatDateTime, getStatusColor } from '../../utils/dataTransformers';
import { CardLoadingSpinner } from '../common/LoadingSpinner';

export default function InvoiceDetail({ invoice, onClose, onEdit, onDelete }) {
  const [invoiceItems, setInvoiceItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchItems = async () => {
      if (invoice?.id) {
        setLoading(true);
        const result = await getInvoiceItems(invoice.id);
        if (result.success) {
          setInvoiceItems(result.data || []);
        }
        setLoading(false);
      }
    };
    fetchItems();
  }, [invoice?.id]);

  if (!invoice) return null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between pb-4 border-b border-gray-200">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-green-100 rounded-xl">
            <Receipt className="w-6 h-6 text-green-600" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">{invoice.supplier}</h2>
            <p className="text-sm text-gray-500 font-mono mt-1">{invoice.id}</p>
            <span className={`${getStatusColor(invoice.status)} mt-2 inline-block`}>
              {invoice.status}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => onEdit?.(invoice)}
            className="btn btn-secondary btn-sm"
          >
            <Edit className="w-4 h-4 mr-1" />
            Edit
          </button>
          <button
            onClick={() => onDelete?.(invoice)}
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
            <span className="text-sm">Invoice Date</span>
          </div>
          <p className="font-semibold text-gray-900">{formatDate(invoice.invoice_date)}</p>
        </div>
        
        <div className="p-4 bg-gray-50 rounded-xl">
          <div className="flex items-center gap-2 text-gray-500 mb-1">
            <DollarSign className="w-4 h-4" />
            <span className="text-sm">Total Amount</span>
          </div>
          <p className="font-semibold text-gray-900">{formatCurrency(invoice.total_amount)}</p>
        </div>
        
        <div className="p-4 bg-gray-50 rounded-xl">
          <div className="flex items-center gap-2 text-gray-500 mb-1">
            <CreditCard className="w-4 h-4" />
            <span className="text-sm">Financing</span>
          </div>
          <p className="font-semibold text-gray-900">{invoice.financing_type}</p>
        </div>
        
        <div className="p-4 bg-gray-50 rounded-xl">
          <div className="flex items-center gap-2 text-gray-500 mb-1">
            <Percent className="w-4 h-4" />
            <span className="text-sm">Exchange Rate</span>
          </div>
          <p className="font-semibold text-gray-900">{invoice.exchange_rate}</p>
        </div>
      </div>

      {/* Amount Summary */}
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-xl">
        <div className="grid grid-cols-2 gap-6">
          <div>
            <p className="text-sm text-gray-600">Net Amount</p>
            <p className="text-2xl font-bold text-gray-900">{formatCurrency(invoice.net_amount)}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Tax Amount</p>
            <p className="text-2xl font-bold text-gray-900">
              {formatCurrency((invoice.total_amount || 0) - (invoice.net_amount || 0))}
            </p>
          </div>
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
        ) : invoiceItems.length > 0 ? (
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
                {invoiceItems.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <p className="text-sm font-medium text-gray-900">{item.description}</p>
                      {item.batch_number && (
                        <p className="text-xs text-gray-500">Batch: {item.batch_number}</p>
                      )}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600 font-mono">
                      {item.item_id}
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
                    {formatCurrency(invoiceItems.reduce((sum, item) => sum + (item.amount || 0), 0))}
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
        <p>Created: {formatDateTime(invoice.created_at)}</p>
      </div>
    </div>
  );
}
