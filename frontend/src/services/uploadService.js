import { N8N_WEBHOOK_URL, USE_MOCK_DATA } from '../lib/supabase';
import { createSuccessResult, createErrorResult } from '../utils/errorHandler';

/**
 * Upload a document to n8n for processing
 */
export const uploadDocument = async (file, onProgress = () => {}) => {
  if (USE_MOCK_DATA) {
    // Simulate upload with progress
    return new Promise((resolve) => {
      let progress = 0;
      const interval = setInterval(() => {
        progress += Math.random() * 30;
        if (progress >= 100) {
          progress = 100;
          clearInterval(interval);
          // Simulate random success/error
          const isSuccess = Math.random() > 0.2;
          if (isSuccess) {
            resolve(createSuccessResult({
              documentId: crypto.randomUUID(),
              status: 'processed',
              message: 'Document processed successfully',
            }));
          } else {
            resolve(createErrorResult(
              { message: 'Failed to process document' },
              'uploadDocument'
            ));
          }
        }
        onProgress(Math.min(progress, 100));
      }, 500);
    });
  }

  if (!N8N_WEBHOOK_URL) {
    return createErrorResult(
      { message: 'n8n webhook URL not configured. Set VITE_N8N_WEBHOOK_URL in .env.local' },
      'uploadDocument'
    );
  }

  // Validate and normalize URL
  let webhookUrl = N8N_WEBHOOK_URL.trim();
  // Remove trailing slash if present (n8n webhooks don't need it)
  if (webhookUrl.endsWith('/')) {
    webhookUrl = webhookUrl.slice(0, -1);
  }
  
  console.log('Webhook URL:', webhookUrl);

  try {
    // Validate file
    if (!file) {
      throw new Error('No file provided');
    }

    if (file.type !== 'application/pdf') {
      throw new Error('Only PDF files are supported');
    }

    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      throw new Error('File size exceeds 10MB limit');
    }

    // Create form data - ensure field name is 'file' to match n8n webhook expectation
    const formData = new FormData();
    formData.append('file', file, file.name); // Include filename in FormData
    formData.append('filename', file.name);
    formData.append('source', 'web_upload');

    // Log request details for debugging
    console.log('Upload request details:', {
      url: webhookUrl,
      method: 'POST',
      fileName: file.name,
      fileSize: file.size,
      fileType: file.type,
    });

    // Upload with XMLHttpRequest for progress tracking
    const response = await new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();

      // Track all state changes for debugging
      xhr.addEventListener('readystatechange', () => {
        console.log(`XHR readyState: ${xhr.readyState}, status: ${xhr.status}`);
        // 0=UNSENT, 1=OPENED, 2=HEADERS_RECEIVED, 3=LOADING, 4=DONE
      });

      xhr.upload.addEventListener('progress', (event) => {
        if (event.lengthComputable) {
          const percentComplete = (event.loaded / event.total) * 100;
          console.log(`Upload progress: ${percentComplete.toFixed(1)}%`);
          onProgress(percentComplete);
        }
      });

      xhr.addEventListener('load', () => {
        console.log('XHR load event - status:', xhr.status, 'response length:', xhr.responseText?.length);
        console.log('Response headers:', xhr.getAllResponseHeaders());
        
        if (xhr.status >= 200 && xhr.status < 300) {
          console.log('Success response:', xhr.responseText);
          try {
            const data = JSON.parse(xhr.responseText);
            // Handle workflow response format: { success, message, data: {...} }
            if (data.success && data.data) {
              resolve({
                success: true,
                message: data.message || 'Document processed successfully',
                data: {
                  type: data.data.type, // 'order' or 'invoice'
                  id: data.data.order_id || data.data.invoice_id,
                  supplier: data.data.supplier,
                  date: data.data.order_date || data.data.invoice_date,
                  spreadsheet_url: data.data.spreadsheet_url,
                }
              });
            } else {
              resolve(data);
            }
          } catch {
            resolve({ status: 'received', message: 'Document received for processing' });
          }
        } else {
          // Try to parse error response - log for debugging
          let errorMessage = `Upload failed with status ${xhr.status}`;
          console.error('Error response body:', xhr.responseText);
          try {
            const errorData = JSON.parse(xhr.responseText);
            errorMessage = errorData.error || errorData.message || errorMessage;
            console.error('Upload error response (parsed):', errorData);
          } catch (e) {
            console.error('Upload error - raw response text:', xhr.responseText);
          }
          reject(new Error(errorMessage));
        }
      });

      xhr.addEventListener('error', (event) => {
        console.error('XHR error event:', event);
        console.error('XHR status:', xhr.status);
        console.error('XHR statusText:', xhr.statusText);
        console.error('XHR response:', xhr.responseText);
        reject(new Error('Network error during upload'));
      });

      xhr.addEventListener('abort', () => {
        reject(new Error('Upload aborted'));
      });

      // Ensure we're using POST method (required for file uploads)
      // Note: GET requests cannot receive file uploads via multipart/form-data
      xhr.open('POST', webhookUrl);
      
      // Don't set Content-Type header - browser will set it automatically with boundary for multipart/form-data
      // This is important for file uploads
      // The browser will automatically set: Content-Type: multipart/form-data; boundary=----WebKitFormBoundary...
      
      // Log before sending
      console.log('Sending POST request to:', webhookUrl);
      console.log('FormData entries:', {
        file: file.name,
        filename: file.name,
        source: 'web_upload'
      });
      
      xhr.send(formData);
    });

    // Handle workflow response format
    if (response.success && response.data) {
      return createSuccessResult({
        documentId: response.data.id || crypto.randomUUID(),
        status: 'processed',
        message: response.message || 'Document processed successfully',
        type: response.data.type, // 'order' or 'invoice'
        supplier: response.data.supplier,
        date: response.data.date,
        spreadsheetUrl: response.data.spreadsheet_url || null,
      });
    }
    
    // Fallback for other response formats
    return createSuccessResult({
      documentId: response.id || response.documentId || crypto.randomUUID(),
      status: response.status || 'processing',
      message: response.message || 'Document submitted for processing',
      spreadsheetUrl: response.sheetUrl || response.spreadsheet_url || null,
    });
  } catch (error) {
    return createErrorResult(error, 'uploadDocument');
  }
};

/**
 * Check the processing status of an uploaded document
 */
export const checkUploadStatus = async (documentId) => {
  if (USE_MOCK_DATA) {
    // Simulate status check
    const statuses = ['processing', 'completed', 'completed', 'completed'];
    const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
    
    return createSuccessResult({
      documentId,
      status: randomStatus,
      message: randomStatus === 'completed' 
        ? 'Document processed successfully' 
        : 'Document is being processed',
    });
  }

  if (!N8N_WEBHOOK_URL) {
    return createErrorResult(
      { message: 'n8n webhook URL not configured' },
      'checkUploadStatus'
    );
  }

  try {
    const response = await fetch(`${N8N_WEBHOOK_URL}/status/${documentId}`);
    
    if (!response.ok) {
      throw new Error(`Status check failed with status ${response.status}`);
    }

    const data = await response.json();

    return createSuccessResult({
      documentId,
      status: data.status || 'unknown',
      message: data.message || '',
      sheetUrl: data.sheetUrl || null,
    });
  } catch (error) {
    return createErrorResult(error, 'checkUploadStatus');
  }
};

/**
 * Get list of recently uploaded documents
 */
export const getRecentUploads = async ({ limit = 10 } = {}) => {
  if (USE_MOCK_DATA) {
    return createSuccessResult([
      {
        id: '1',
        filename: 'invoice_2024_001.pdf',
        status: 'completed',
        uploadedAt: new Date().toISOString(),
        type: 'invoice',
      },
      {
        id: '2',
        filename: 'order_2024_045.pdf',
        status: 'completed',
        uploadedAt: new Date(Date.now() - 3600000).toISOString(),
        type: 'order',
      },
    ]);
  }

  // This would typically query a documents/uploads table
  return createSuccessResult([]);
};
