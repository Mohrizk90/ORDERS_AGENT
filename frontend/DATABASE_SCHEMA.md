# Expected Database Schema

This application expects the following tables and columns in your Supabase database.

## Required Tables

### `orders`
| Column | Type | Description |
|--------|------|-------------|
| id | uuid or text | Primary key |
| supplier | text | Supplier name |
| status | text | Order status (e.g., 'Pending', 'Completed', 'Cancelled') |
| order_date | date or timestamp | Date of order |
| total_amount | numeric | Total order amount |
| created_at | timestamp | Creation timestamp |

### `invoices`
| Column | Type | Description |
|--------|------|-------------|
| id | uuid or text | Primary key |
| supplier | text | Supplier name |
| status | text | Invoice status (e.g., 'Pending', 'Paid', 'Overdue') |
| invoice_date | date or timestamp | Date of invoice |
| total_amount | numeric | Total invoice amount |
| created_at | timestamp | Creation timestamp |

## Optional Tables

### `alerts` (optional)
| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Primary key |
| type | text | Alert type |
| message | text | Alert message |
| timestamp | timestamp | Alert timestamp |
| read | boolean | Whether alert is read |

### `activity` (optional)
| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Primary key |
| type | text | Activity type |
| description | text | Activity description |
| timestamp | timestamp | Activity timestamp |

## SQL to Create Tables

```sql
-- Orders table
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  supplier TEXT NOT NULL,
  status TEXT DEFAULT 'Pending',
  order_date DATE DEFAULT CURRENT_DATE,
  total_amount NUMERIC DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Invoices table
CREATE TABLE IF NOT EXISTS invoices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  supplier TEXT NOT NULL,
  status TEXT DEFAULT 'Pending',
  invoice_date DATE DEFAULT CURRENT_DATE,
  total_amount NUMERIC DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security (optional but recommended)
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;

-- Allow public read access (adjust based on your needs)
CREATE POLICY "Allow public read access on orders" ON orders FOR SELECT USING (true);
CREATE POLICY "Allow public read access on invoices" ON invoices FOR SELECT USING (true);
```

## Troubleshooting

### 400 Bad Request Errors
These occur when the app tries to filter/sort by a column that doesn't exist in your table.
- Check that your tables have all the required columns listed above
- Column names are case-sensitive

### 404 Not Found Errors
These occur when a table doesn't exist. The `alerts` and `activity` tables are optional.
