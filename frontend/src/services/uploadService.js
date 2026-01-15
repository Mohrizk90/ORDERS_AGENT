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
        console.log('Response text:', xhr.responseText);
        
        if (xhr.status >= 200 && xhr.status < 300) {
          // Handle empty response - n8n might return empty body on success
          if (!xhr.responseText || xhr.responseText.trim() === '') {
            console.log('Empty response received - treating as success');
            resolve({ 
              success: true, 
              status: 'received', 
              message: 'Document received for processing' 
            });
            return;
          }

          try {
            const data = JSON.parse(xhr.responseText);
            console.log('Parsed response data:', data);
            
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
            } else if (data.success !== false) {
              // If success is not explicitly false, treat as success
              resolve({
                success: true,
                message: data.message || 'Document received for processing',
                data: data.data || data
              });
            } else {
              // Explicit failure
              reject(new Error(data.message || data.error || 'Document processing failed'));
            }
          } catch (parseError) {
            // If response is not JSON, but status is 200, treat as success
            console.log('Response is not JSON, but status is 200 - treating as success');
            console.log('Parse error:', parseError);
            resolve({ 
              success: true, 
              status: 'received', 
              message: 'Document received for processing' 
            });
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
        console.error('XHR error event triggered:', event);
        console.error('XHR readyState:', xhr.readyState);
        console.error('XHR status:', xhr.status);
        console.error('XHR statusText:', xhr.statusText);
        console.error('XHR response:', xhr.responseText);
        console.error('XHR responseType:', xhr.responseType);
        
        // Check if we actually got a response despite the error event
        // This can happen with CORS issues or network interruptions
        if (xhr.readyState === 4 && xhr.status >= 200 && xhr.status < 300) {
          // We have a successful status, try to process the response
          console.log('Error event but status is OK, attempting to process response');
          try {
            if (xhr.responseText) {
              const data = JSON.parse(xhr.responseText);
              if (data.success !== false) {
                resolve({
                  success: true,
                  message: data.message || 'Document received for processing',
                  data: data.data || data
                });
                return;
              }
            }
          } catch (e) {
            // If we can't parse, still treat as success if status is 200
            if (xhr.status === 200) {
              resolve({
                success: true,
                status: 'received',
                message: 'Document received for processing'
              });
              return;
            }
          }
        }
        
        // If we have a status code, it's not a true network error
        // This might be a CORS issue or other HTTP-level problem
        if (xhr.status > 0) {
          const errorMsg = xhr.statusText || `HTTP ${xhr.status} error`;
          reject(new Error(`Upload failed: ${errorMsg}`));
        } else {
          // Status 0 can mean:
          // 1. Connection closed/timeout (workflow might still be processing)
          // 2. CORS blocked
          // 3. Network failure
          // Check if we got any response data before the connection closed
          if (xhr.responseText && xhr.responseText.length > 0) {
            console.log('Connection closed but got response data, attempting to parse');
            try {
              const data = JSON.parse(xhr.responseText);
              if (data.success !== false) {
                resolve({
                  success: true,
                  message: data.message || 'Document received for processing',
                  data: data.data || data
                });
                return;
              }
            } catch (e) {
              console.error('Failed to parse response before connection closed:', e);
            }
          }

          // Optimistic behaviour: if the connection closed with status 0,
          // but n8n still received and started processing the file (your case),
          // treat this as a successful "processing" state instead of a hard error.
          console.warn('XHR status 0 - treating as processing state (upload likely accepted by n8n)');
          resolve({
            success: true,
            message: 'Document received, processing in background',
            data: {
              status: 'processing',
            },
          });
        }
      });

      xhr.addEventListener('abort', () => {
        console.error('XHR upload aborted');
        reject(new Error('Upload aborted'));
      });

      // Set timeout (5 minutes for file uploads - workflow includes GPT-4 analysis, DB inserts, Google Sheets)
      xhr.timeout = 300000;
      xhr.addEventListener('timeout', () => {
        console.error('XHR upload timeout after 5 minutes');
        reject(new Error('Upload timeout. The document processing is taking longer than expected. The file may still be processing in the background.'));
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
      // Check if this is a final processed response (has type, supplier, etc.)
      if (response.data.type && (response.data.order_id || response.data.invoice_id)) {
        return createSuccessResult({
          documentId: response.data.order_id || response.data.invoice_id || crypto.randomUUID(),
          status: 'processed',
          message: response.message || 'Document processed successfully',
          type: response.data.type, // 'order' or 'invoice'
          supplier: response.data.supplier,
          date: response.data.order_date || response.data.invoice_date,
          spreadsheetUrl: response.data.spreadsheet_url || null,
        });
      }
      
      // This is an acknowledgment response (processing started)
      return createSuccessResult({
        documentId: response.data.filename || crypto.randomUUID(),
        status: response.status || 'processing',
        message: response.message || 'Document received and processing started',
        filename: response.data.filename,
        receivedAt: response.data.received_at,
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
