import { useState } from 'react';
import { Upload as UploadIcon, FileText, X, CheckCircle, AlertCircle, Loader, ExternalLink } from 'lucide-react';
import { uploadDocument } from '../services/uploadService';
import { useToast } from '../components/common/Toast';

export default function Upload() {
  const [files, setFiles] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const toast = useToast();

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFiles = Array.from(e.dataTransfer.files).filter(
      (file) => file.type === 'application/pdf'
    );
    if (droppedFiles.length === 0) {
      toast.warning('Only PDF files are supported');
      return;
    }
    addFiles(droppedFiles);
  };

  const handleFileSelect = (e) => {
    const selectedFiles = Array.from(e.target.files);
    addFiles(selectedFiles);
  };

  const addFiles = (newFiles) => {
    const filesWithStatus = newFiles.map((file) => ({
      id: Math.random().toString(36).substr(2, 9),
      file,
      status: 'pending', // pending, uploading, success, error
      progress: 0,
      result: null,
    }));
    setFiles((prev) => [...prev, ...filesWithStatus]);
    
    // Start upload for each file
    filesWithStatus.forEach((fileItem) => {
      processFile(fileItem.id, fileItem.file);
    });
  };

  const processFile = async (fileId, file) => {
    // Set uploading status
    setFiles((prev) =>
      prev.map((f) => (f.id === fileId ? { ...f, status: 'uploading' } : f))
    );

    // Upload with progress tracking
    const result = await uploadDocument(file, (progress) => {
      setFiles((prev) =>
        prev.map((f) => (f.id === fileId ? { ...f, progress } : f))
      );
    });

    // Update status based on result
    setFiles((prev) =>
      prev.map((f) =>
        f.id === fileId
          ? {
              ...f,
              status: result.success ? 'success' : 'error',
              progress: 100,
              result: result.data || { error: result.error },
            }
          : f
      )
    );

    if (result.success) {
      toast.success(`${file.name} processed successfully`);
    } else {
      toast.error(`Failed to process ${file.name}: ${result.error}`);
    }
  };

  const removeFile = (fileId) => {
    setFiles((prev) => prev.filter((f) => f.id !== fileId));
  };

  const retryFile = (fileId) => {
    const fileItem = files.find(f => f.id === fileId);
    if (fileItem) {
      processFile(fileId, fileItem.file);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'uploading':
        return <Loader className="w-5 h-5 text-primary-600 animate-spin" />;
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'error':
        return <AlertCircle className="w-5 h-5 text-red-600" />;
      default:
        return <FileText className="w-5 h-5 text-gray-400" />;
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Upload Documents</h1>
        <p className="text-gray-500 mt-1">
          Upload PDF invoices or orders for automatic processing
        </p>
      </div>

      {/* Upload Area */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-xl p-12 text-center transition-colors ${
          isDragging
            ? 'border-primary-500 bg-primary-50'
            : 'border-gray-300 hover:border-gray-400'
        }`}
      >
        <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
          <UploadIcon className="w-8 h-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Drop your PDF files here
        </h3>
        <p className="text-gray-500 mb-4">or click to browse from your computer</p>
        <input
          type="file"
          id="file-upload"
          accept=".pdf"
          multiple
          onChange={handleFileSelect}
          className="hidden"
        />
        <label htmlFor="file-upload" className="btn btn-primary cursor-pointer">
          Select Files
        </label>
        <p className="text-xs text-gray-400 mt-4">
          Supported format: PDF (max 10MB per file)
        </p>
      </div>

      {/* File List */}
      {files.length > 0 && (
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Uploaded Files ({files.length})
          </h3>
          <div className="space-y-3">
            {files.map((fileItem) => (
              <div
                key={fileItem.id}
                className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg"
              >
                {getStatusIcon(fileItem.status)}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {fileItem.file.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    {(fileItem.file.size / 1024).toFixed(1)} KB
                  </p>
                  {fileItem.status === 'uploading' && (
                    <div className="mt-2 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary-600 transition-all duration-300"
                        style={{ width: `${fileItem.progress}%` }}
                      />
                    </div>
                  )}
                  {fileItem.status === 'success' && (
                    <div className="mt-1">
                      <p className="text-xs text-green-600">
                        Document processed successfully
                      </p>
                      {(fileItem.result?.spreadsheetUrl || fileItem.result?.sheetUrl) && (
                        <a 
                          href={fileItem.result.spreadsheetUrl || fileItem.result.sheetUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-xs text-primary-600 hover:underline inline-flex items-center gap-1 mt-1"
                        >
                          View in Google Sheets
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                      {fileItem.result?.type && (
                        <p className="text-xs text-gray-500 mt-1">
                          Type: {fileItem.result.type === 'order' ? 'Order' : 'Invoice'}
                          {fileItem.result.supplier && ` • ${fileItem.result.supplier}`}
                        </p>
                      )}
                    </div>
                  )}
                  {fileItem.status === 'error' && (
                    <div className="mt-1 flex items-center gap-2">
                      <p className="text-xs text-red-600">
                        {fileItem.result?.error || 'Failed to process document'}
                      </p>
                      <button 
                        onClick={() => retryFile(fileItem.id)}
                        className="text-xs text-primary-600 hover:underline"
                      >
                        Retry
                      </button>
                    </div>
                  )}
                </div>
                <button
                  onClick={() => removeFile(fileItem.id)}
                  className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-200"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Instructions */}
      <div className="card bg-blue-50 border-blue-200">
        <h3 className="text-lg font-semibold text-blue-900 mb-2">
          How it works
        </h3>
        <ul className="space-y-2 text-sm text-blue-800">
          <li className="flex items-start gap-2">
            <span className="font-bold">1.</span>
            Upload PDF invoices or order documents
          </li>
          <li className="flex items-start gap-2">
            <span className="font-bold">2.</span>
            AI automatically extracts data (supplier, amounts, line items)
          </li>
          <li className="flex items-start gap-2">
            <span className="font-bold">3.</span>
            Documents are classified as Invoice or Order
          </li>
          <li className="flex items-start gap-2">
            <span className="font-bold">4.</span>
            Data is stored and a Google Sheet is created
          </li>
        </ul>
      </div>
    </div>
  );
}
