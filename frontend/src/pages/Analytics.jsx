import { useState } from 'react';
import { Download } from 'lucide-react';
import Charts from '../components/analytics/Charts';
import MonthlyReport from '../components/analytics/MonthlyReport';

export default function Analytics() {
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 5 }, (_, i) => currentYear - i);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
          <p className="text-gray-500 mt-1">Visualize your data and track performance</p>
        </div>
        <div className="flex items-center gap-3">
          <select 
            className="input max-w-[200px]"
            value={selectedYear}
            onChange={(e) => setSelectedYear(parseInt(e.target.value))}
          >
            {years.map(year => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
          <button className="btn btn-secondary">
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </button>
        </div>
      </div>

      {/* Charts */}
      <Charts year={selectedYear} />

      {/* Monthly Report Table */}
      <MonthlyReport year={selectedYear} />
    </div>
  );
}
