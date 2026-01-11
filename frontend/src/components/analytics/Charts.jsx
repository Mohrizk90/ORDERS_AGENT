import { 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  PieChart,
  Pie,
  Cell,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  Area,
  AreaChart
} from 'recharts';
import { mockMonthlyData, mockOrders, mockInvoices, formatCurrency } from '../../data/mockData';

const COLORS = ['#3b82f6', '#ef4444', '#22c55e', '#f59e0b', '#8b5cf6', '#06b6d4'];

// Custom Tooltip
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 rounded-lg shadow-lg border border-gray-200">
        <p className="font-medium text-gray-900 mb-2">{label}</p>
        {payload.map((entry, index) => (
          <p key={index} style={{ color: entry.color }} className="text-sm">
            {entry.name}: {formatCurrency(entry.value)}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

// Comparison Bar Chart (Orders vs Invoices)
export function ComparisonChart() {
  return (
    <div className="card">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Orders vs Invoices (Monthly)</h3>
      <ResponsiveContainer width="100%" height={350}>
        <BarChart data={mockMonthlyData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis dataKey="month" tick={{ fontSize: 12 }} />
          <YAxis tick={{ fontSize: 12 }} tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`} />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <Bar dataKey="orders" fill="#3b82f6" name="Orders" radius={[4, 4, 0, 0]} />
          <Bar dataKey="invoices" fill="#ef4444" name="Invoices" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

// Trend Line Chart
export function TrendChart() {
  return (
    <div className="card">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Trend Analysis</h3>
      <ResponsiveContainer width="100%" height={350}>
        <LineChart data={mockMonthlyData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis dataKey="month" tick={{ fontSize: 12 }} />
          <YAxis tick={{ fontSize: 12 }} tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`} />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <Line 
            type="monotone" 
            dataKey="orders" 
            stroke="#3b82f6" 
            strokeWidth={3} 
            dot={{ fill: '#3b82f6', strokeWidth: 2 }}
            name="Orders"
          />
          <Line 
            type="monotone" 
            dataKey="invoices" 
            stroke="#ef4444" 
            strokeWidth={3}
            dot={{ fill: '#ef4444', strokeWidth: 2 }}
            name="Invoices"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

// Area Chart
export function AreaTrendChart() {
  return (
    <div className="card">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue Trend</h3>
      <ResponsiveContainer width="100%" height={350}>
        <AreaChart data={mockMonthlyData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <defs>
            <linearGradient id="colorOrders" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
            </linearGradient>
            <linearGradient id="colorInvoices" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis dataKey="month" tick={{ fontSize: 12 }} />
          <YAxis tick={{ fontSize: 12 }} tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`} />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <Area 
            type="monotone" 
            dataKey="orders" 
            stroke="#3b82f6" 
            fill="url(#colorOrders)"
            strokeWidth={2}
            name="Orders"
          />
          <Area 
            type="monotone" 
            dataKey="invoices" 
            stroke="#ef4444" 
            fill="url(#colorInvoices)"
            strokeWidth={2}
            name="Invoices"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

// Status Distribution Pie Chart
export function StatusDistributionChart({ type = 'orders' }) {
  const data = type === 'orders' ? mockOrders : mockInvoices;
  
  const statusCounts = data.reduce((acc, item) => {
    acc[item.status] = (acc[item.status] || 0) + 1;
    return acc;
  }, {});

  const pieData = Object.entries(statusCounts).map(([name, value]) => ({
    name,
    value,
  }));

  return (
    <div className="card">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        {type === 'orders' ? 'Order' : 'Invoice'} Status Distribution
      </h3>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={pieData}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={100}
            fill="#8884d8"
            paddingAngle={5}
            dataKey="value"
            label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
          >
            {pieData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

// Mini Spark Line Chart
export function SparkLineChart({ data, color = '#3b82f6', height = 60 }) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={data}>
        <Line 
          type="monotone" 
          dataKey="value" 
          stroke={color} 
          strokeWidth={2}
          dot={false}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}

// Default export with all charts
export default function Charts() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ComparisonChart />
        <TrendChart />
      </div>
      <AreaTrendChart />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <StatusDistributionChart type="orders" />
        <StatusDistributionChart type="invoices" />
      </div>
    </div>
  );
}
