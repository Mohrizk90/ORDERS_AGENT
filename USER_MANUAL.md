# 📘 FMC Operations Assistant - User Manual

## 🤖 Introduction

The FMC Operations Assistant is a Telegram bot that helps you manage orders and invoices through natural language conversations. You can create, view, update, delete, export, and analyze your data using simple chat commands.

---

## 🚀 Quick Start

1. Open Telegram and find **Order_DB_Bot**
2. Start a conversation by sending: `hi` or `hello`
3. Ask for help: `What can you do?` or `Show me commands`

---

## 📋 Table of Contents

1. [Viewing Records](#viewing-records)
2. [Creating Records](#creating-records)
3. [Updating Records](#updating-records)
4. [Deleting Records](#deleting-records)
5. [Searching Records](#searching-records)
6. [Pagination](#pagination)
7. [Filtering](#filtering)
8. [Exporting Data](#exporting-data)
9. [Charts & Analytics](#charts--analytics)
10. [Bulk Operations](#bulk-operations)
11. [Alerts](#alerts)
12. [Viewing Line Items](#viewing-line-items)
13. [Test Cases](#test-cases)

---

## 📖 Viewing Records

### View Orders

**Basic Commands:**
```
Show me orders
Show me the first 10 orders
List all orders
Display orders
```

**With Filters:**
```
Show me orders from supplier Acme
Show orders from January 2024
Show orders from 2024-01-01 to 2024-12-31
Show orders from supplier MegaDistributors created in the last month
```

**Count:**
```
How many orders do we have?
Count orders
Total number of orders
```

### View Invoices

**Basic Commands:**
```
Show me invoices
Display invoices
List invoices
View all invoices
```

**With Filters:**
```
Show invoices from supplier TechCorp
Show invoices from January 2024 to March 2024
Show invoices from 2024-01-01 to 2024-12-31
```

**Count:**
```
How many invoices are there?
Count invoices
Total invoices
```

---

## ➕ Creating Records

### Create Order

**Basic:**
```
Create a new order for supplier "Test Supplier" with total amount 30000, date 2024-12-15
```

**Full Details:**
```
Create order: supplier "Mega Corp", amount 45000, net amount 40500, date 2024-12-20, source channel email
```

**With Defaults (date = today, source = Chat):**
```
Create order for supplier "QuickSupply Co" with total amount 25000
```

### Create Invoice

**Basic:**
```
Create a new invoice for supplier "Test Supplier" with total amount 60000, date 2024-12-15, exchange rate 1.0, financing type Credit
```

**Full Details:**
```
Create invoice: supplier "Global Supplies", amount 75000, net amount 67500, date 2024-12-20, exchange rate 1.2, financing type Cash
```

**With Defaults:**
```
Create invoice for supplier "TechCorp Inc" with total amount 50000
```

**High-Value Test (Triggers Alert):**
```
Create a new order for supplier "Mega Corp" with total amount 150000, date 2024-12-15
Create a new invoice for supplier "Test Supplier" with total amount 75000, date 2024-12-15, exchange rate 1.0, financing type Credit
```

---

## ✏️ Updating Records

### Update Order

**Update Supplier:**
```
Update order [order-id] with supplier "Updated Supplier Name"
```

**Update Multiple Fields:**
```
Update order [order-id] with supplier "New Supplier", total amount 50000, date 2024-12-20
```

**Update Amount:**
```
Update order [order-id] total amount to 45000
Change order [order-id] amount to 55000
```

### Update Invoice

**Update Supplier:**
```
Update invoice [invoice-id] with supplier "Updated Supplier"
```

**Update Multiple Fields:**
```
Update invoice [invoice-id] with supplier "New Supplier", total amount 60000, exchange rate 1.1
```

**Update Amount:**
```
Update invoice [invoice-id] total amount to 55000
Change invoice [invoice-id] amount to 65000
```

---

## 🗑️ Deleting Records

### Delete Order

**Step 1: View the record**
```
Show me order [order-id]
Search for order with ID [order-id]
```

**Step 2: Confirm deletion**
```
Delete this order - Type YES to confirm
```

**Direct Delete (with confirmation):**
```
Delete order [order-id]
```

### Delete Invoice

**Step 1: View the record**
```
Show me invoice [invoice-id]
Search for invoice with ID [invoice-id]
```

**Step 2: Confirm deletion**
```
Delete this invoice - Type YES to confirm
```

**Direct Delete:**
```
Delete invoice [invoice-id]
```

---

## 🔍 Searching Records

### Search by ID

**Orders:**
```
Search for order with ID 559e3a6d-c6c2-4524-9b4d-061be438eeda
Find order 559e3a6d-c6c2-4524-9b4d-061be438eeda
Show order 559e3a6d-c6c2-4524-9b4d-061be438eeda
```

**Invoices:**
```
Search for invoice with ID 44ac2333-2c7d-424e-998f-91c2be8207b3
Find invoice 44ac2333-2c7d-424e-998f-91c2be8207b3
Show invoice 44ac2333-2c7d-424e-998f-91c2be8207b3
```

---

## 📄 Pagination

### Navigate Through Records

**First Page:**
```
Show me the first 10 orders
Show me orders
List orders
```

**Next Page:**
```
Show me the next 10 orders
Next
More orders
Show more
```

**Previous Page:**
```
Show me previous orders
Previous
Go back
Show previous invoices
```

**Note:** The bot remembers your position and will fetch the next/previous batch automatically.

---

## 🔎 Filtering

### Filter by Supplier

**Orders:**
```
Show me orders from supplier QuickSupply Co
Show orders from supplier "MegaDistributors"
List orders for supplier Acme
```

**Invoices:**
```
Show invoices from supplier Global Supplies Ltd
Show invoices for supplier TechCorp Inc
```

### Filter by Date Range

**Specific Dates:**
```
Show orders from 2024-01-01 to 2024-12-31
Show invoices from January 2024 to March 2024
```

**Natural Language:**
```
Show orders from last month
Show invoices from this year
Show orders from Q1 2024
Show invoices from the last 30 days
```

### Combined Filters

```
Show orders from supplier Acme from 2024-01-01 to 2024-12-31
Show invoices from supplier TechCorp from January 2024 to December 2024
Show orders from supplier MegaDistributors created in the last month
```

---

## 📥 Exporting Data

### Export Orders

**All Orders:**
```
Export all orders
Export orders to CSV
Generate orders export
```

**With Filters:**
```
Export orders from supplier Acme
Export orders from 2024-01-01 to 2024-12-31
Export orders from supplier Test from 2024-01-01 to 2024-12-31
```

**Direct Marker (Advanced):**
```
[EXPORT_ORDERS]
[EXPORT_ORDERS supplier=Acme from=2024-01-01 to=2024-12-31]
```

### Export Invoices

**All Invoices:**
```
Export all invoices
Export invoices to CSV
Generate invoices export
```

**With Filters:**
```
Export invoices from supplier TechCorp
Export invoices from January 2024 to December 2024
Export invoices from supplier Global Supplies from 2024-01-01 to 2024-12-31
```

**Direct Marker (Advanced):**
```
[EXPORT_INVOICES]
[EXPORT_INVOICES supplier=TechCorp from=2024-01-01 to=2024-12-31]
```

**Note:** The bot will send you a CSV file via Telegram with all the requested data.

---

## 📊 Charts & Analytics

### Monthly Totals

**Basic:**
```
Show me monthly totals for 2024
Get monthly analytics from January 2024 to December 2024
Monthly totals from 2023-01-01 to 2024-12-31
```

**Natural Language:**
```
Show monthly totals for last year
What are the monthly totals for 2024?
Get analytics for this year
```

### Charts

**Single Dataset (Orders):**
```
Create a bar chart of order totals for 2024
Show me a chart of monthly orders
Generate a chart for orders in 2024
```

**Single Dataset (Invoices):**
```
Create a bar chart of invoice totals for 2024
Show me a chart of monthly invoices
```

**Comparison Chart (Orders vs Invoices):**
```
Create a comparison chart of orders and invoices for 2024
Show monthly comparison for last year orders and invoices
Make a chart comparing orders and invoices
```

**Chart Types:**
```
Create a line chart of monthly totals
Show me a pie chart of order amounts by supplier
Generate a bar chart of monthly comparison
```

**Note:** Charts are sent as images via Telegram. Orders appear in **blue**, invoices in **red** for comparison charts.

---

## 📦 Bulk Operations

### Bulk Update

**Update Multiple Orders:**
```
Update orders [id1,id2,id3] with supplier "Bulk Updated Supplier"
Update orders [35711826-7d3c-4ca1-9dda-5ba61f092882,a2910330-4a3c-4c0f-8102-0dd53622efcc] with supplier "Bulk Updated"
```

**Update Multiple Invoices:**
```
Update invoices [id1,id2] with supplier "New Supplier Name"
Update invoices [id1,id2,id3] with total amount 50000
```

### Bulk Delete

**Step 1: Request deletion**
```
Delete orders [id1,id2,id3]
Delete invoices [id1,id2]
```

**Step 2: Confirm**
```
YES
```

**Note:** Bulk delete requires confirmation. Always type "YES" to confirm.

---

## 🚨 Alerts

### Check Alert Thresholds

```
What are the current alert thresholds?
Show me alert settings
Get alert configuration
```

### High-Value Transaction Alerts

**Automatic:** When you create an order or invoice with amount ≥ 50,000, you'll automatically receive an alert.

**Test High-Value Alert:**
```
Create a new order for supplier "Alert Test" with total amount 60000, date 2024-12-20
Create a new invoice for supplier "Alert Test" with total amount 75000, date 2024-12-20, exchange rate 1.0, financing type Credit
```

**Note:** Alerts are sent automatically to configured recipients when high-value transactions are created.

---

## 📋 Viewing Line Items

### Order Items

```
Get invoice items for invoice ID 44ac2333-2c7d-424e-998f-91c2be8207b3
Show order items for order [order-id]
Get line items for order [order-id]
```

### Invoice Items

```
Get invoice items for invoice ID 44ac2333-2c7d-424e-998f-91c2be8207b3
Show invoice items for invoice [invoice-id]
Get line items for invoice [invoice-id]
```

---

## 🧪 Test Cases

### Complete Test Suite

Copy and paste these messages one by one to test all features:

#### 1. Basic Viewing
```
Show me the first 10 orders
Count how many invoices we have
Show me invoices
```

#### 2. Filtering
```
Show me orders from supplier QuickSupply Co
Show invoices from January 2024 to March 2024
Show me orders from supplier MegaDistributors created in the last month
```

#### 3. Pagination
```
Show me the first 10 orders
next
previous
Show me the next 10 orders
```

#### 4. Search
```
Search for order with ID 559e3a6d-c6c2-4524-9b4d-061be438eeda
Search for invoice with ID 44ac2333-2c7d-424e-998f-91c2be8207b3
```

#### 5. Create (Low Value)
```
Create a new order for supplier "Test Supplier" with total amount 30000, date 2024-12-15
Create a new invoice for supplier "Test Supplier" with total amount 40000, date 2024-12-15, exchange rate 1.0, financing type Credit
```

#### 6. Create (High Value - Triggers Alert)
```
Create a new order for supplier "Mega Corp" with total amount 150000, date 2024-12-15
Create a new invoice for supplier "Alert Test" with total amount 75000, date 2024-12-15, exchange rate 1.0, financing type Credit
```

#### 7. Update
```
Update order [paste-order-id] with supplier "Updated Supplier"
Update invoice [paste-invoice-id] total amount to 45000
```

#### 8. Delete (with confirmation)
```
Show me order [paste-order-id]
Delete this order - Type YES to confirm
```

#### 9. Bulk Operations
```
Update orders [id1,id2] with supplier "Bulk Updated"
Delete orders [id1,id2]
YES
```

#### 10. Export
```
Export all orders to CSV
Export invoices from supplier Acme from 2024-01-01 to 2024-12-31
```

#### 11. Analytics
```
Show me monthly totals for 2024
Get monthly analytics from January 2024 to December 2024
```

#### 12. Charts
```
Create a bar chart of order totals for 2024
Create a comparison chart of orders and invoices for 2024
monthly comparison for last year orders and invoices chart
```

#### 13. Line Items
```
Get invoice items for invoice ID 44ac2333-2c7d-424e-998f-91c2be8207b3
Get order items for order [paste-order-id]
```

#### 14. Alert Thresholds
```
What are the current alert thresholds?
```

---

## 💡 Tips & Best Practices

### 1. Natural Language
The bot understands natural language. You don't need exact commands:
- ✅ "Show me orders" works
- ✅ "I want to see invoices" works
- ✅ "Can you list orders?" works

### 2. Date Formats
The bot accepts multiple date formats:
- ✅ `2024-12-15` (ISO format)
- ✅ `January 2024` (natural language)
- ✅ `last month` (relative)
- ✅ `Q1 2024` (quarter)

### 3. Amounts
- Use numbers with or without commas: `50000` or `50,000`
- The bot will format them properly in responses

### 4. Supplier Names
- Can be quoted or unquoted: `"Acme Corp"` or `Acme Corp`
- Case-insensitive matching

### 5. IDs
- Use full UUID format: `559e3a6d-c6c2-4524-9b4d-061be438eeda`
- Copy-paste from previous responses for accuracy

### 6. Pagination
- Always start with "Show me orders/invoices"
- Use "next" or "previous" to navigate
- The bot remembers your position

### 7. Deletions
- Always view the record first
- Confirm with "YES" (all caps)
- Bulk deletes require confirmation too

---

## ❓ Troubleshooting

### Issue: "No records found"
**Solution:** Check your filters. Try without filters first:
```
Show me orders
```

### Issue: "Bad request" or "chat not found"
**Solution:** This usually means invalid Telegram ID. Contact admin to update alert recipients.

### Issue: Chart not showing
**Solution:** Make sure the AI outputs the chart marker correctly. Try:
```
Create a bar chart of order totals for 2024
```

### Issue: Export not working
**Solution:** Check the export marker format. Use:
```
Export all orders
```
Not: "Generate export" or "Create export file"

### Issue: Alert not triggering
**Solution:** 
- Amount must be ≥ 50,000
- Must be a CREATE operation (not update)
- Check alert thresholds: `What are the current alert thresholds?`

### Issue: Bulk operation failing
**Solution:**
- Ensure all IDs are valid UUIDs
- Separate IDs with commas: `[id1,id2,id3]`
- For delete, confirm with "YES"

---

## 📞 Support

If you encounter issues:
1. Check this manual first
2. Try the command in a simpler format
3. Contact your system administrator

---

## 🎯 Quick Command Reference

| Action | Command Example |
|--------|----------------|
| **View** | `Show me orders` |
| **Create** | `Create order for supplier "X" with amount 30000` |
| **Update** | `Update order [id] with supplier "Y"` |
| **Delete** | `Delete order [id]` then `YES` |
| **Search** | `Search for order with ID [uuid]` |
| **Filter** | `Show orders from supplier X from date1 to date2` |
| **Export** | `Export all orders` |
| **Chart** | `Create a bar chart of orders for 2024` |
| **Analytics** | `Show monthly totals for 2024` |
| **Bulk Update** | `Update orders [id1,id2] with supplier "X"` |
| **Bulk Delete** | `Delete orders [id1,id2]` then `YES` |
| **Line Items** | `Get order items for order [id]` |
| **Alerts** | `What are the current alert thresholds?` |

---

## 📝 Notes

- All dates are in YYYY-MM-DD format internally
- Amounts are stored as numbers (no currency symbols)
- Supplier names are case-insensitive
- The bot maintains conversation context (memory)
- Charts are generated as PNG images
- Exports are sent as CSV files
- Alerts are sent automatically for high-value transactions

---

**Last Updated:** 2024-12-20  
**Version:** 2.0  
**Bot Name:** Order_DB_Bot

