import { useState, useEffect, useCallback } from 'react';
import { getAllSuppliers } from '../../services/statsService';
import { ButtonLoadingSpinner } from '../common/LoadingSpinner';

export default function InvoiceForm({ invoice, onSubmit, onCancel, isSubmitting = false }) {
  const [suppliers, setSuppliers] = useState([]);
  const [formData, setFormData] = useState({
    supplier: invoice?.supplier || '',
    invoice_date: invoice?.invoice_date || new Date().toISOString().split('T')[0],
    total_amount: invoice?.total_amount || '',
    net_amount: invoice?.net_amount || '',
    exchange_rate: invoice?.exchange_rate || 1.0,
    financing_type: invoice?.financing_type || 'Credit',
    status: invoice?.status || 'Pending',
  });
  const [errors, setErrors] = useState({});

  const fetchSuppliers = useCallback(async () => {
    const result = await getAllSuppliers();
    if (result.success) {
      setSuppliers(result.data || []);
    }
  }, []);

  useEffect(() => {
    fetchSuppliers();
  }, [fetchSuppliers]);

  const validate = () => {
    const newErrors = {};
    if (!formData.supplier) newErrors.supplier = 'Supplier is required';
    if (!formData.invoice_date) newErrors.invoice_date = 'Date is required';
    if (!formData.total_amount) newErrors.total_amount = 'Amount is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      onSubmit?.({
        ...formData,
        total_amount: parseFloat(formData.total_amount) || 0,
        net_amount: parseFloat(formData.net_amount) || 0,
        exchange_rate: parseFloat(formData.exchange_rate) || 1.0,
      });
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
            disabled={isSubmitting}
          >
            <option value="">Select a supplier</option>
            {suppliers.map((supplier) => (
              <option key={supplier} value={supplier}>
                {supplier}
              </option>
            ))}
          </select>
          <p className="text-xs text-gray-500 mt-1">
            Or type a new supplier name:
          </p>
          <input
            type="text"
            value={formData.supplier}
            onChange={(e) => handleChange('supplier', e.target.value)}
            className={`input mt-2 ${errors.supplier ? 'input-error' : ''}`}
            placeholder="Enter supplier name"
            disabled={isSubmitting}
          />
          {errors.supplier && (
            <p className="text-sm text-red-500 mt-1">{errors.supplier}</p>
          )}
        </div>

        {/* Invoice Date */}
        <div>
          <label className="label">Invoice Date *</label>
          <input
            type="date"
            value={formData.invoice_date}
            onChange={(e) => handleChange('invoice_date', e.target.value)}
            className={`input ${errors.invoice_date ? 'input-error' : ''}`}
            disabled={isSubmitting}
          />
          {errors.invoice_date && (
            <p className="text-sm text-red-500 mt-1">{errors.invoice_date}</p>
          )}
        </div>

        {/* Financing Type */}
        <div>
          <label className="label">Financing Type</label>
          <select
            value={formData.financing_type}
            onChange={(e) => handleChange('financing_type', e.target.value)}
            className="input"
            disabled={isSubmitting}
          >
            <option value="Credit">Credit</option>
            <option value="Cash">Cash</option>
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
              disabled={isSubmitting}
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
              disabled={isSubmitting}
            />
          </div>
        </div>

        {/* Exchange Rate */}
        <div>
          <label className="label">Exchange Rate</label>
          <input
            type="number"
            step="0.01"
            value={formData.exchange_rate}
            onChange={(e) => handleChange('exchange_rate', e.target.value)}
            className="input"
            disabled={isSubmitting}
          />
        </div>

        {/* Status */}
        <div>
          <label className="label">Status</label>
          <select
            value={formData.status}
            onChange={(e) => handleChange('status', e.target.value)}
            className="input"
            disabled={isSubmitting}
          >
            <option value="Pending">Pending</option>
            <option value="Paid">Paid</option>
            <option value="Overdue">Overdue</option>
          </select>
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-3 pt-6 border-t border-gray-200">
        <button 
          type="button" 
          onClick={onCancel} 
          className="btn btn-secondary"
          disabled={isSubmitting}
        >
          Cancel
        </button>
        <button 
          type="submit" 
          className="btn btn-primary"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <ButtonLoadingSpinner />
              <span className="ml-2">Saving...</span>
            </>
          ) : (
            invoice ? 'Update Invoice' : 'Create Invoice'
          )}
        </button>
      </div>
    </form>
  );
}
