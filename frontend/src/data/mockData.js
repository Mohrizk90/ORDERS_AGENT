// Mock data for FMC Operations Dashboard

export const mockOrders = [
  {
    id: '559e3a6d-c6c2-4524-9b4d-061be438eeda',
    supplier: 'TechCorp Inc',
    order_date: '2024-12-20',
    total_amount: 45000,
    net_amount: 40500,
    source_channel: 'Email',
    status: 'Active',
    created_at: '2024-12-20T10:30:00Z',
  },
  {
    id: 'a2910330-4a3c-4c0f-8102-0dd53622efcc',
    supplier: 'MegaDistributors',
    order_date: '2024-12-19',
    total_amount: 75000,
    net_amount: 67500,
    source_channel: 'Telegram',
    status: 'Active',
    created_at: '2024-12-19T14:45:00Z',
  },
  {
    id: '35711826-7d3c-4ca1-9dda-5ba61f092882',
    supplier: 'QuickSupply Co',
    order_date: '2024-12-18',
    total_amount: 30000,
    net_amount: 27000,
    source_channel: 'Chat',
    status: 'Completed',
    created_at: '2024-12-18T09:15:00Z',
  },
  {
    id: 'b4e5f678-9a1b-2c3d-4e5f-6789abcdef01',
    supplier: 'Global Supplies Ltd',
    order_date: '2024-12-17',
    total_amount: 120000,
    net_amount: 108000,
    source_channel: 'Email',
    status: 'Active',
    created_at: '2024-12-17T16:20:00Z',
  },
  {
    id: 'c5f6g789-0b1c-2d3e-4f5a-6789bcdef012',
    supplier: 'Acme Corporation',
    order_date: '2024-12-16',
    total_amount: 55000,
    net_amount: 49500,
    source_channel: 'Telegram',
    status: 'Pending',
    created_at: '2024-12-16T11:00:00Z',
  },
  {
    id: 'd6e7f890-1c2d-3e4f-5a6b-7890cdef1234',
    supplier: 'Prime Vendors',
    order_date: '2024-12-15',
    total_amount: 88000,
    net_amount: 79200,
    source_channel: 'Email',
    status: 'Active',
    created_at: '2024-12-15T08:30:00Z',
  },
  {
    id: 'e7f8g901-2d3e-4f5a-6b7c-8901def2345',
    supplier: 'FastTrack Solutions',
    order_date: '2024-12-14',
    total_amount: 42000,
    net_amount: 37800,
    source_channel: 'Chat',
    status: 'Completed',
    created_at: '2024-12-14T13:45:00Z',
  },
  {
    id: 'f8g9h012-3e4f-5a6b-7c8d-9012ef3456',
    supplier: 'ValueFirst Inc',
    order_date: '2024-12-13',
    total_amount: 65000,
    net_amount: 58500,
    source_channel: 'Telegram',
    status: 'Pending',
    created_at: '2024-12-13T15:10:00Z',
  },
];

export const mockInvoices = [
  {
    id: '44ac2333-2c7d-424e-998f-91c2be8207b3',
    supplier: 'TOKYO-YA, S.A.',
    invoice_date: '2024-12-20',
    total_amount: 62192,
    net_amount: 56538,
    exchange_rate: 1.0,
    financing_type: 'Credit',
    status: 'Paid',
    created_at: '2024-12-20T09:00:00Z',
  },
  {
    id: 'a1b2c3d4-5e6f-7a8b-9c0d-1e2f3a4b5c6d',
    supplier: 'TechCorp Inc',
    invoice_date: '2024-12-19',
    total_amount: 85000,
    net_amount: 76500,
    exchange_rate: 1.2,
    financing_type: 'Cash',
    status: 'Pending',
    created_at: '2024-12-19T11:30:00Z',
  },
  {
    id: 'b2c3d4e5-6f7a-8b9c-0d1e-2f3a4b5c6d7e',
    supplier: 'MegaDistributors',
    invoice_date: '2024-12-18',
    total_amount: 95000,
    net_amount: 85500,
    exchange_rate: 1.0,
    financing_type: 'Credit',
    status: 'Paid',
    created_at: '2024-12-18T14:20:00Z',
  },
  {
    id: 'c3d4e5f6-7a8b-9c0d-1e2f-3a4b5c6d7e8f',
    supplier: 'Global Supplies Ltd',
    invoice_date: '2024-12-17',
    total_amount: 110000,
    net_amount: 99000,
    exchange_rate: 1.1,
    financing_type: 'Credit',
    status: 'Overdue',
    created_at: '2024-12-17T10:45:00Z',
  },
  {
    id: 'd4e5f6a7-8b9c-0d1e-2f3a-4b5c6d7e8f9a',
    supplier: 'Acme Corporation',
    invoice_date: '2024-12-16',
    total_amount: 72000,
    net_amount: 64800,
    exchange_rate: 1.0,
    financing_type: 'Cash',
    status: 'Paid',
    created_at: '2024-12-16T16:00:00Z',
  },
  {
    id: 'e5f6a7b8-9c0d-1e2f-3a4b-5c6d7e8f9a0b',
    supplier: 'Prime Vendors',
    invoice_date: '2024-12-15',
    total_amount: 58000,
    net_amount: 52200,
    exchange_rate: 1.15,
    financing_type: 'Credit',
    status: 'Pending',
    created_at: '2024-12-15T12:30:00Z',
  },
];

export const mockOrderItems = [
  {
    id: 'item-001',
    order_id: '559e3a6d-c6c2-4524-9b4d-061be438eeda',
    product_code: '0305',
    description: 'Kikkoman Shoyu (1L) NL',
    units: 60,
    unit_price: 4.40,
    batch_number: 'B2024-001',
    amount: 264.00,
  },
  {
    id: 'item-002',
    order_id: '559e3a6d-c6c2-4524-9b4d-061be438eeda',
    product_code: '0333',
    description: 'Kikkoman Gluten Free Shoyu (1L)',
    units: 30,
    unit_price: 5.02,
    batch_number: 'B2024-002',
    amount: 150.60,
  },
  {
    id: 'item-003',
    order_id: '559e3a6d-c6c2-4524-9b4d-061be438eeda',
    product_code: '0390',
    description: 'Kikkoman Shoyu (250ml) NL',
    units: 48,
    unit_price: 2.20,
    batch_number: 'B2024-003',
    amount: 105.60,
  },
];

export const mockInvoiceItems = [
  {
    id: 'inv-item-001',
    invoice_id: '44ac2333-2c7d-424e-998f-91c2be8207b3',
    item_id: '0305',
    description: 'Kikkoman Shoyu (1L) NL',
    units: 60,
    unit_price: 4.40,
    batch_number: 'B2024-001',
    amount: 264.00,
  },
  {
    id: 'inv-item-002',
    invoice_id: '44ac2333-2c7d-424e-998f-91c2be8207b3',
    item_id: '0333',
    description: 'Kikkoman Gluten Free Shoyu (1L)',
    units: 30,
    unit_price: 5.02,
    batch_number: 'B2024-002',
    amount: 150.60,
  },
];

export const mockStats = {
  totalOrders: 127,
  totalInvoices: 89,
  totalOrderAmount: 2450000,
  totalInvoiceAmount: 1890000,
  pendingOrders: 12,
  pendingInvoices: 8,
  overdueInvoices: 3,
  highValueTransactions: 5,
  monthlyGrowth: 12.5,
  processedToday: 8,
  activeSuppliers: 24,
};

export const mockMonthlyData = [
  { month: 'Jan', orders: 386000, invoices: 542000 },
  { month: 'Feb', orders: 420000, invoices: 580000 },
  { month: 'Mar', orders: 450000, invoices: 620000 },
  { month: 'Apr', orders: 480000, invoices: 650000 },
  { month: 'May', orders: 510000, invoices: 680000 },
  { month: 'Jun', orders: 540000, invoices: 710000 },
  { month: 'Jul', orders: 570000, invoices: 740000 },
  { month: 'Aug', orders: 600000, invoices: 770000 },
  { month: 'Sep', orders: 630000, invoices: 800000 },
  { month: 'Oct', orders: 660000, invoices: 830000 },
  { month: 'Nov', orders: 690000, invoices: 860000 },
  { month: 'Dec', orders: 720000, invoices: 890000 },
];

export const mockAlerts = [
  {
    id: 'alert-001',
    type: 'high_value',
    title: 'High-Value Transaction',
    message: 'Order #559e3a6d from TechCorp Inc exceeds $50,000 threshold',
    amount: 120000,
    timestamp: '2024-12-20T10:30:00Z',
    read: false,
  },
  {
    id: 'alert-002',
    type: 'high_value',
    title: 'High-Value Transaction',
    message: 'Invoice #c3d4e5f6 from Global Supplies Ltd exceeds threshold',
    amount: 110000,
    timestamp: '2024-12-17T10:45:00Z',
    read: false,
  },
  {
    id: 'alert-003',
    type: 'overdue',
    title: 'Overdue Invoice',
    message: 'Invoice #c3d4e5f6 from Global Supplies Ltd is overdue',
    amount: 110000,
    timestamp: '2024-12-19T09:00:00Z',
    read: true,
  },
  {
    id: 'alert-004',
    type: 'processed',
    title: 'Document Processed',
    message: 'New invoice from TOKYO-YA, S.A. processed successfully',
    amount: 62192,
    timestamp: '2024-12-20T09:00:00Z',
    read: true,
  },
];

export const mockRecentActivity = [
  {
    id: 'act-001',
    action: 'created',
    type: 'order',
    description: 'New order created for TechCorp Inc',
    user: 'System',
    timestamp: '2024-12-20T10:30:00Z',
  },
  {
    id: 'act-002',
    action: 'processed',
    type: 'invoice',
    description: 'Invoice from TOKYO-YA processed via Email',
    user: 'Auto-Process',
    timestamp: '2024-12-20T09:00:00Z',
  },
  {
    id: 'act-003',
    action: 'updated',
    type: 'order',
    description: 'Order #35711826 marked as completed',
    user: 'Admin',
    timestamp: '2024-12-19T16:45:00Z',
  },
  {
    id: 'act-004',
    action: 'exported',
    type: 'report',
    description: 'Monthly orders report exported',
    user: 'Admin',
    timestamp: '2024-12-19T14:30:00Z',
  },
  {
    id: 'act-005',
    action: 'alert',
    type: 'notification',
    description: 'High-value transaction alert triggered',
    user: 'System',
    timestamp: '2024-12-17T10:45:00Z',
  },
];

export const mockSuppliers = [
  'TechCorp Inc',
  'MegaDistributors',
  'QuickSupply Co',
  'Global Supplies Ltd',
  'Acme Corporation',
  'Prime Vendors',
  'FastTrack Solutions',
  'ValueFirst Inc',
  'TOKYO-YA, S.A.',
];

// Helper functions
export const formatCurrency = (amount, currency = 'USD') => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

export const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

export const formatDateTime = (date) => {
  return new Date(date).toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const getStatusColor = (status) => {
  const colors = {
    Active: 'badge-blue',
    Completed: 'badge-green',
    Pending: 'badge-yellow',
    Paid: 'badge-green',
    Overdue: 'badge-red',
    Cancelled: 'badge-gray',
  };
  return colors[status] || 'badge-gray';
};

export const getSourceIcon = (source) => {
  const icons = {
    Email: 'mail',
    Telegram: 'send',
    Chat: 'message-circle',
    Web: 'globe',
  };
  return icons[source] || 'file';
};
