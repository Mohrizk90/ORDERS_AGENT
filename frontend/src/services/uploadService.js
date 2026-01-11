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

    // Create form data
    const formData = new FormData();
    formData.append('file', file);
    formData.append('filename', file.name);
    formData.append('source', 'web_upload');

    // Upload with XMLHttpRequest for progress tracking
    const response = await new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();

      xhr.upload.addEventListener('progress', (event) => {
        if (event.lengthComputable) {
          const percentComplete = (event.loaded / event.total) * 100;
          onProgress(percentComplete);
        }
      });

      xhr.addEventListener('load', () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          try {
            const data = JSON.parse(xhr.responseText);
            resolve(data);
          } catch {
            resolve({ status: 'received', message: 'Document received for processing' });
          }
        } else {
          reject(new Error(`Upload failed with status ${xhr.status}`));
        }
      });

      xhr.addEventListener('error', () => {
        reject(new Error('Network error during upload'));
      });

      xhr.addEventListener('abort', () => {
        reject(new Error('Upload aborted'));
      });

      xhr.open('POST', N8N_WEBHOOK_URL);
      xhr.send(formData);
    });

    return createSuccessResult({
      documentId: response.id || response.documentId || crypto.randomUUID(),
      status: response.status || 'processing',
      message: response.message || 'Document submitted for processing',
      sheetUrl: response.sheetUrl || null,
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
