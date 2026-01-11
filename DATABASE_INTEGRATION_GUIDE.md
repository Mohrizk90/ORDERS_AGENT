# Database Integration Guide

This guide explains how to run and test the Supabase database integration for the Orders Agent application.

## Quick Start

### Option 1: Run with Mock Data (No Database Setup Required)

This is the easiest way to test the application without setting up Supabase:

1. **Navigate to the frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install dependencies (if not already installed):**
   ```bash
   npm install
   ```

3. **Create `.env.local` file:**
   ```bash
   # Copy the example file
   cp .env.example .env.local
   ```

4. **Edit `.env.local` and set:**
   ```env
   VITE_USE_MOCK_DATA=true
   ```

5. **Start the development server:**
   ```bash
   npm run dev
   ```

6. **Open your browser:**
   Navigate to `http://localhost:5173`

The app will run with mock data, and you can test all features without a database connection.

---

### Option 2: Run with Real Supabase Database

To test the actual database integration:

#### Step 1: Set Up Supabase Project

1. **Create a Supabase account** (if you don't have one):
   - Go to https://supabase.com
   - Sign up for a free account

2. **Create a new project:**
   - Click "New Project"
   - Choose a name and database password
   - Select a region
   - Wait for the project to be created

3. **Get your API credentials:**
   - Go to Project Settings → API
   - Copy the "Project URL" and "anon public" key

#### Step 2: Set Up Database Schema

Run these SQL commands in the Supabase SQL Editor:

```sql
-- Create orders table
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  supplier TEXT NOT NULL,
  order_date DATE NOT NULL,
  total_amount DECIMAL(10, 2) NOT NULL,
  net_amount DECIMAL(10, 2) NOT NULL,
  source_channel TEXT DEFAULT 'Web',
  status TEXT DEFAULT 'Pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create order_items table
CREATE TABLE order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  product_code TEXT,
  description TEXT,
  units INTEGER,
  unit_price DECIMAL(10, 2),
  batch_number TEXT,
  amount DECIMAL(10, 2),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create invoices table
CREATE TABLE invoices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  supplier TEXT NOT NULL,
  invoice_date DATE NOT NULL,
  total_amount DECIMAL(10, 2) NOT NULL,
  net_amount DECIMAL(10, 2) NOT NULL,
  exchange_rate DECIMAL(10, 4),
  financing_type TEXT,
  status TEXT DEFAULT 'Pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create invoice_items table
CREATE TABLE invoice_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_id UUID REFERENCES invoices(id) ON DELETE CASCADE,
  item_id TEXT,
  description TEXT,
  units INTEGER,
  unit_price DECIMAL(10, 2),
  batch_number TEXT,
  amount DECIMAL(10, 2),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security (RLS) - Optional but recommended
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoice_items ENABLE ROW LEVEL SECURITY;

-- Create policies to allow all operations (adjust based on your security needs)
CREATE POLICY "Allow all operations on orders" ON orders FOR ALL USING (true);
CREATE POLICY "Allow all operations on order_items" ON order_items FOR ALL USING (true);
CREATE POLICY "Allow all operations on invoices" ON invoices FOR ALL USING (true);
CREATE POLICY "Allow all operations on invoice_items" ON invoice_items FOR ALL USING (true);
```

#### Step 3: Configure Environment Variables

1. **Create `.env.local` file in the `frontend` directory:**
   ```bash
   cd frontend
   cp .env.example .env.local
   ```

2. **Edit `.env.local` with your Supabase credentials:**
   ```env
   VITE_SUPABASE_URL=https://your-project-id.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key-here
   VITE_USE_MOCK_DATA=false
   VITE_ENABLE_REALTIME=false
   VITE_N8N_WEBHOOK_URL=https://your-n8n-instance.com/webhook/upload
   ```

   Replace:
   - `your-project-id` with your actual Supabase project ID
   - `your-anon-key-here` with your actual anon key

#### Step 4: Run the Application

1. **Install dependencies (if not already done):**
   ```bash
   npm install
   ```

2. **Start the development server:**
   ```bash
   npm run dev
   ```

3. **Open your browser:**
   Navigate to `http://localhost:5173`

---

## Testing the Integration

### 1. Test Dashboard

- Open the Dashboard page
- Check if stats cards load (Total Orders, Total Invoices, etc.)
- Verify the data is coming from Supabase (check browser console for any errors)

### 2. Test Orders Management

- Navigate to **Orders** page
- **View Orders**: Should display orders from your database
- **Create Order**: Click "New Order", fill the form, and submit
  - Check Supabase dashboard to verify the order was created
- **Edit Order**: Click on an order, modify it, and save
  - Verify changes in Supabase
- **Delete Order**: Delete an order and verify it's removed from database
- **Filter/Search**: Test filtering by supplier, status, date range

### 3. Test Invoices Management

- Navigate to **Invoices** page
- Perform the same CRUD operations as Orders
- Verify data persistence in Supabase

### 4. Test Analytics

- Navigate to **Analytics** page
- Check if charts load with real data
- Verify monthly reports show actual data

### 5. Test Real-time Updates (Optional)

1. **Enable Realtime in Supabase:**
   - Go to Database → Replication
   - Enable replication for `orders` and `invoices` tables

2. **Update `.env.local`:**
   ```env
   VITE_ENABLE_REALTIME=true
   ```

3. **Restart the dev server:**
   ```bash
   npm run dev
   ```

4. **Test:**
   - Open the app in two browser windows
   - Create/update an order in one window
   - The other window should update automatically

### 6. Test Document Upload (n8n Integration)

1. **Set up n8n webhook** (if you have n8n configured)
2. **Update `.env.local`** with your n8n webhook URL
3. **Navigate to Upload page**
4. **Upload a PDF document**
5. **Verify the webhook is called** (check n8n workflow execution)

---

## Troubleshooting

### Issue: "Supabase credentials not configured" warning

**Solution:** Make sure `.env.local` exists and contains valid Supabase credentials.

### Issue: "Failed to fetch" or network errors

**Solutions:**
- Check if your Supabase URL and key are correct
- Verify Row Level Security (RLS) policies allow your operations
- Check browser console for specific error messages
- Ensure your Supabase project is active

### Issue: No data showing

**Solutions:**
- Check if tables exist in Supabase
- Verify tables have data (insert some test data via Supabase dashboard)
- Check browser console for errors
- Verify RLS policies allow SELECT operations

### Issue: Real-time not working

**Solutions:**
- Ensure Realtime is enabled in Supabase (Database → Replication)
- Check that `VITE_ENABLE_REALTIME=true` in `.env.local`
- Restart the dev server after changing env variables
- Check browser console for subscription errors

### Issue: Can't create/update/delete records

**Solutions:**
- Check RLS policies allow INSERT/UPDATE/DELETE
- Verify your anon key has the correct permissions
- Check browser console for specific error messages

---

## Verifying Database Connection

### Method 1: Browser Console

1. Open browser DevTools (F12)
2. Go to Console tab
3. Look for any Supabase-related errors
4. Check Network tab for API calls to Supabase

### Method 2: Supabase Dashboard

1. Go to your Supabase project dashboard
2. Navigate to **Table Editor**
3. Check if data appears when you create records in the app
4. Check **Logs** section for any errors

### Method 3: Test Connection Script

Create a test file `frontend/test-connection.js`:

```javascript
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'YOUR_SUPABASE_URL';
const supabaseKey = 'YOUR_SUPABASE_ANON_KEY';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testConnection() {
  console.log('Testing Supabase connection...');
  
  const { data, error } = await supabase
    .from('orders')
    .select('count');
  
  if (error) {
    console.error('Connection failed:', error);
  } else {
    console.log('Connection successful!', data);
  }
}

testConnection();
```

---

## Next Steps

Once the integration is working:

1. **Add more data** to test pagination and filtering
2. **Set up proper RLS policies** for production security
3. **Configure n8n workflows** for document processing
4. **Enable real-time subscriptions** for live updates
5. **Set up error monitoring** and logging

---

## Environment Variables Reference

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `VITE_SUPABASE_URL` | Your Supabase project URL | Yes* | - |
| `VITE_SUPABASE_ANON_KEY` | Your Supabase anonymous key | Yes* | - |
| `VITE_USE_MOCK_DATA` | Use mock data instead of Supabase | No | `false` |
| `VITE_ENABLE_REALTIME` | Enable real-time subscriptions | No | `false` |
| `VITE_N8N_WEBHOOK_URL` | n8n webhook URL for uploads | No | - |

*Required only if `VITE_USE_MOCK_DATA=false`

---

## Support

If you encounter issues:
1. Check the browser console for errors
2. Check Supabase dashboard logs
3. Verify environment variables are set correctly
4. Ensure database schema matches the expected structure
