# FMC Operations Dashboard

A modern React dashboard for the FMC Operations Automation System. This frontend prototype showcases the UI for managing orders, invoices, analytics, and document processing.

## Features

- 📊 **Dashboard** - Overview with stats, charts, recent activity
- 📋 **Orders Management** - View, create, edit, delete orders
- 📑 **Invoices Management** - View, create, edit, delete invoices
- 📈 **Analytics** - Charts, trends, monthly reports
- 📤 **Document Upload** - Upload PDF for processing
- 🔔 **Notifications** - Alerts and activity feed
- ⚙️ **Settings** - Configure thresholds and preferences

## Tech Stack

- **React 18** - UI framework
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **React Router** - Navigation
- **Recharts** - Charts
- **Lucide React** - Icons

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at `http://localhost:5173`

### Build for Production

```bash
npm run build
```

## Project Structure

```
frontend/
├── public/
│   └── favicon.svg
├── src/
│   ├── components/
│   │   ├── analytics/       # Chart components
│   │   ├── common/          # Reusable components
│   │   ├── dashboard/       # Dashboard widgets
│   │   ├── invoices/        # Invoice components
│   │   ├── layout/          # Layout components
│   │   └── orders/          # Order components
│   ├── data/
│   │   └── mockData.js      # Mock data for prototype
│   ├── pages/
│   │   ├── Dashboard.jsx
│   │   ├── Orders.jsx
│   │   ├── Invoices.jsx
│   │   ├── Analytics.jsx
│   │   ├── Upload.jsx
│   │   ├── Notifications.jsx
│   │   ├── Settings.jsx
│   │   └── Help.jsx
│   ├── styles/
│   │   └── index.css        # Tailwind + custom styles
│   ├── App.jsx
│   └── main.jsx
├── index.html
├── package.json
├── tailwind.config.js
├── vite.config.js
└── README.md
```

## Screenshots

### Dashboard
- Stats cards showing orders, invoices, amounts
- Quick actions for common tasks
- Recent activity feed
- Comparison chart (Orders vs Invoices)

### Orders/Invoices
- Searchable, filterable tables
- Pagination
- Bulk selection and actions
- Detail view modal
- Create/Edit forms

### Analytics
- Monthly comparison charts (bar, line, area)
- Status distribution pie charts
- Monthly report table with totals

## Integration Ready

This prototype is designed to integrate with:

- **Supabase** - Replace mock data with real API calls
- **n8n Workflows** - Trigger document processing via webhooks
- **Real-time updates** - Add Supabase Realtime subscriptions

### Example Integration (Supabase)

```javascript
// Replace mockOrders with real data
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// Fetch orders
const { data: orders } = await supabase
  .from('orders')
  .select('*')
  .order('order_date', { ascending: false });
```

## Customization

### Colors
Edit `tailwind.config.js` to customize the color palette:

```javascript
theme: {
  extend: {
    colors: {
      primary: {
        // Your custom colors
      }
    }
  }
}
```

### Mock Data
Edit `src/data/mockData.js` to customize the sample data.

## License

MIT
