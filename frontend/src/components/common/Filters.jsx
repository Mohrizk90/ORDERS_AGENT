import { useState } from 'react';
import { Filter, X, ChevronDown, Search } from 'lucide-react';
import { mockSuppliers } from '../../data/mockData';

export default function Filters({ filters, setFilters, type = 'orders' }) {
  const [isOpen, setIsOpen] = useState(false);

  const hasActiveFilters = filters.supplier || filters.dateFrom || filters.dateTo || filters.status;

  const clearFilters = () => {
    setFilters({
      supplier: '',
      dateFrom: '',
      dateTo: '',
      status: '',
      search: filters.search || '',
    });
  };

  const statusOptions = type === 'orders' 
    ? ['Active', 'Pending', 'Completed', 'Cancelled']
    : ['Paid', 'Pending', 'Overdue'];

  return (
    <div className="space-y-4">
      {/* Search and Filter Toggle */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder={`Search ${type}...`}
            value={filters.search || ''}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            className="input pl-10"
          />
        </div>
        
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`btn ${hasActiveFilters ? 'btn-primary' : 'btn-secondary'} whitespace-nowrap`}
        >
          <Filter className="w-4 h-4 mr-2" />
          Filters
          {hasActiveFilters && (
            <span className="ml-2 bg-white/20 text-white px-1.5 py-0.5 rounded text-xs">
              Active
            </span>
          )}
          <ChevronDown className={`w-4 h-4 ml-2 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </button>
      </div>

      {/* Filter Panel */}
      {isOpen && (
        <div className="card-flat animate-fade-in">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-medium text-gray-900">Filter Options</h3>
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="text-sm text-red-600 hover:text-red-700 font-medium flex items-center gap-1"
              >
                <X className="w-4 h-4" />
                Clear filters
              </button>
            )}
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Supplier */}
            <div>
              <label className="label">Supplier</label>
              <select
                value={filters.supplier}
                onChange={(e) => setFilters({ ...filters, supplier: e.target.value })}
                className="input"
              >
                <option value="">All Suppliers</option>
                {mockSuppliers.map((supplier) => (
                  <option key={supplier} value={supplier}>
                    {supplier}
                  </option>
                ))}
              </select>
            </div>

            {/* Status */}
            <div>
              <label className="label">Status</label>
              <select
                value={filters.status}
                onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                className="input"
              >
                <option value="">All Statuses</option>
                {statusOptions.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>

            {/* Date From */}
            <div>
              <label className="label">From Date</label>
              <input
                type="date"
                value={filters.dateFrom}
                onChange={(e) => setFilters({ ...filters, dateFrom: e.target.value })}
                className="input"
              />
            </div>

            {/* Date To */}
            <div>
              <label className="label">To Date</label>
              <input
                type="date"
                value={filters.dateTo}
                onChange={(e) => setFilters({ ...filters, dateTo: e.target.value })}
                className="input"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-4 pt-4 border-t border-gray-100">
            <button
              onClick={() => setIsOpen(false)}
              className="btn btn-secondary"
            >
              Cancel
            </button>
            <button
              onClick={() => setIsOpen(false)}
              className="btn btn-primary"
            >
              Apply Filters
            </button>
          </div>
        </div>
      )}

      {/* Active Filter Tags */}
      {hasActiveFilters && !isOpen && (
        <div className="flex flex-wrap gap-2">
          {filters.supplier && (
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm">
              Supplier: {filters.supplier}
              <button onClick={() => setFilters({ ...filters, supplier: '' })}>
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          {filters.status && (
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm">
              Status: {filters.status}
              <button onClick={() => setFilters({ ...filters, status: '' })}>
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          {filters.dateFrom && (
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm">
              From: {filters.dateFrom}
              <button onClick={() => setFilters({ ...filters, dateFrom: '' })}>
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          {filters.dateTo && (
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm">
              To: {filters.dateTo}
              <button onClick={() => setFilters({ ...filters, dateTo: '' })}>
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
        </div>
      )}
    </div>
  );
}
