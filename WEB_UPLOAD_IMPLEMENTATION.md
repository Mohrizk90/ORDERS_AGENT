# Web Upload Implementation Summary

## ✅ Completed Tasks

### n8n Workflow Changes
- ✅ Created new workflow file: `N8N_Workflows/workflow_web_upload.json`
- ✅ Added HTTP Request trigger node (`Webhook_Web_Upload`) at path `/upload-document`
- ✅ Added file extraction from multipart/form-data (`parse_pdf_data_extract_web`)
- ✅ Set `source_type` to `'web_upload'` in `Set_Source_Web_Upload` node
- ✅ Added switch nodes for web source routing (`Switch_Source_Order`, `Switch_Source_Invoice`)
- ✅ Created JSON response nodes:
  - `Respond_Web_Order` - Success response for orders
  - `Respond_Web_Invoice` - Success response for invoices
  - `Respond_Web_Error` - Error response (500 status)
- ✅ Updated `Insert_order` to store `source_channel` from `Set_Source`

### Frontend Changes
- ✅ Updated `uploadService.js` to handle workflow response format
- ✅ Updated response parsing to extract `data.spreadsheet_url`
- ✅ Added error handling for workflow failures
- ✅ Updated `Upload.jsx` to display spreadsheet URL and document type

## 📋 Next Steps

### 1. Import Workflow to n8n
1. Open your n8n instance
2. Go to **Workflows** → **Import from File**
3. Select `N8N_Workflows/workflow_web_upload.json`
4. Review and activate the workflow

### 2. Get Webhook URL
1. In n8n, open the imported workflow
2. Click on the **`Webhook_Web_Upload`** node
3. Copy the **Production URL** (it will look like: `https://your-n8n-instance.com/webhook/upload-document`)
4. **Important**: Make sure the workflow is **Active** for the webhook to work

### 3. Configure Environment Variable
1. Navigate to `frontend/` directory
2. Create or edit `.env.local` file:
   ```env
   VITE_N8N_WEBHOOK_URL=https://your-n8n-instance.com/webhook/upload-document
   ```
3. Replace `https://your-n8n-instance.com/webhook/upload-document` with your actual webhook URL from step 2

### 4. Test the Integration

#### Test Webhook Endpoint
```bash
# Using curl (replace with your actual webhook URL and file path)
curl -X POST https://your-n8n-instance.com/webhook/upload-document \
  -F "file=@/path/to/test-invoice.pdf" \
  -F "filename=test-invoice.pdf"
```

Expected response (Order):
```json
{
  "success": true,
  "message": "Order processed successfully",
  "data": {
    "type": "order",
    "order_id": "...",
    "supplier": "...",
    "order_date": "...",
    "spreadsheet_url": "https://docs.google.com/spreadsheets/d/..."
  }
}
```

Expected response (Invoice):
```json
{
  "success": true,
  "message": "Invoice processed successfully",
  "data": {
    "type": "invoice",
    "invoice_id": "...",
    "supplier": "...",
    "invoice_date": "...",
    "spreadsheet_url": "https://docs.google.com/spreadsheets/d/..."
  }
}
```

#### Test Frontend
1. Start the frontend dev server:
   ```bash
   cd frontend
   npm run dev
   ```
2. Navigate to the Upload page
3. Upload a test PDF file
4. Verify:
   - File uploads successfully
   - Progress bar shows upload progress
   - Success message appears
   - Spreadsheet URL link is displayed (if available)
   - Document type (Order/Invoice) is shown

## 🔍 Workflow Response Format

### Success Response
```json
{
  "success": true,
  "message": "Order/Invoice processed successfully",
  "data": {
    "type": "order" | "invoice",
    "order_id" | "invoice_id": "uuid",
    "supplier": "string",
    "order_date" | "invoice_date": "YYYY-MM-DD",
    "spreadsheet_url": "https://docs.google.com/spreadsheets/d/..."
  }
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error processing document",
  "error": "Error details"
}
```

## 📝 Notes

- The workflow expects the file field to be named `file` in the multipart/form-data
- The workflow automatically extracts PDF text and uses GPT-4o to analyze and classify documents
- Web uploads are tracked with `source_channel = 'web_upload'` in the orders table
- The workflow creates Google Sheets for both orders and invoices
- All existing Telegram and Gmail functionality remains unchanged

## 🐛 Troubleshooting

### Webhook not responding
- Check if workflow is **Active** in n8n
- Verify the webhook URL is correct
- Check n8n execution logs for errors

### File upload fails
- Verify `VITE_N8N_WEBHOOK_URL` is set in `.env.local`
- Check browser console for CORS errors
- Ensure file is PDF and under 10MB

### Response format mismatch
- Verify workflow is using the correct response nodes
- Check that `Respond_Web_Order` and `Respond_Web_Invoice` nodes are connected properly
- Review n8n execution data to see actual response format

## 📚 Related Files

- `N8N_Workflows/workflow_web_upload.json` - n8n workflow definition
- `frontend/src/services/uploadService.js` - Frontend upload service
- `frontend/src/pages/Upload.jsx` - Upload page component
- `frontend/src/lib/supabase.js` - Environment configuration
