import { useState } from 'react';
import { mockSuppliers } from '../../data/mockData';

export default function OrderForm({ order, onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    supplier: order?.supplier || '',
    order_date: order?.order_date || new Date().toISOString().split('T')[0],
    total_amount: order?.total_amount || '',
    net_amount: order?.net_amount || '',
    source_channel: order?.source_channel || 'Web',
    status: order?.status || 'Pending',
  });

  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    if (!formData.supplier) newErrors.supplier = 'Supplier is required';
    if (!formData.order_date) newErrors.order_date = 'Date is required';
    if (!formData.total_amount) newErrors.total_amount = 'Amount is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      onSubmit?.(formData);
    }
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Supplier */}
        <div className="md:col-span-2">
          <label className="label">Supplier *</label>
          <select
            value={formData.supplier}
            onChange={(e) => handleChange('supplier', e.target.value)}
            className={`input ${errors.supplier ? 'input-error' : ''}`}
          >
            <option value="">Select a supplier</option>
            {mockSuppliers.map((supplier) => (
              <option key={supplier} value={supplier}>
                {supplier}
              </option>
            ))}
          </select>
          {errors.supplier && (
            <p className="text-sm text-red-500 mt-1">{errors.supplier}</p>
          )}
        </div>

        {/* Order Date */}
        <div>
          <label className="label">Order Date *</label>
          <input
            type="date"
            value={formData.order_date}
            onChange={(e) => handleChange('order_date', e.target.value)}
            className={`input ${errors.order_date ? 'input-error' : ''}`}
          />
          {errors.order_date && (
            <p className="text-sm text-red-500 mt-1">{errors.order_date}</p>
          )}
        </div>

        {/* Source Channel */}
        <div>
          <label className="label">Source Channel</label>
          <select
            value={formData.source_channel}
            onChange={(e) => handleChange('source_channel', e.target.value)}
            className="input"
          >
            <option value="Web">Web</option>
            <option value="Email">Email</option>
            <option value="Telegram">Telegram</option>
            <option value="Chat">Chat</option>
          </select>
        </div>

        {/* Total Amount */}
        <div>
          <label className="label">Total Amount *</label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
            <input
              type="number"
              value={formData.total_amount}
              onChange={(e) => handleChange('total_amount', e.target.value)}
              className={`input pl-8 ${errors.total_amount ? 'input-error' : ''}`}
              placeholder="0.00"
            />
          </div>
          {errors.total_amount && (
            <p className="text-sm text-red-500 mt-1">{errors.total_amount}</p>
          )}
        </div>

        {/* Net Amount */}
        <div>
          <label className="label">Net Amount</label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
            <input
              type="number"
              value={formData.net_amount}
              onChange={(e) => handleChange('net_amount', e.target.value)}
              className="input pl-8"
              placeholder="0.00"
            />
          </div>
        </div>

        {/* Status */}
        <div>
          <label className="label">Status</label>
          <select
            value={formData.status}
            onChange={(e) => handleChange('status', e.target.value)}
            className="input"
          >
            <option value="Pending">Pending</option>
            <option value="Active">Active</option>
            <option value="Completed">Completed</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-3 pt-6 border-t border-gray-200">
        <button type="button" onClick={onCancel} className="btn btn-secondary">
          Cancel
        </button>
        <button type="submit" className="btn btn-primary">
          {order ? 'Update Order' : 'Create Order'}
        </button>
      </div>
    </form>
  );
}
