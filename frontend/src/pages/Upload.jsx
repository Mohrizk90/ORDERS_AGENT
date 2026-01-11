import { useState } from 'react';
import { Upload as UploadIcon, FileText, X, CheckCircle, AlertCircle, Loader } from 'lucide-react';

export default function Upload() {
  const [files, setFiles] = useState([]);
  const [isDragging, setIsDragging] = useState(false);

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
    }));
    setFiles((prev) => [...prev, ...filesWithStatus]);
    
    // Simulate upload for each file
    filesWithStatus.forEach((fileItem) => {
      simulateUpload(fileItem.id);
    });
  };

  const simulateUpload = (fileId) => {
    // Set uploading status
    setFiles((prev) =>
      prev.map((f) => (f.id === fileId ? { ...f, status: 'uploading' } : f))
    );

    // Simulate progress
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 30;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        // Random success/error for demo
        const isSuccess = Math.random() > 0.2;
        setFiles((prev) =>
          prev.map((f) =>
            f.id === fileId
              ? { ...f, status: isSuccess ? 'success' : 'error', progress: 100 }
              : f
          )
        );
      } else {
        setFiles((prev) =>
          prev.map((f) => (f.id === fileId ? { ...f, progress } : f))
        );
      }
    }, 500);
  };

  const removeFile = (fileId) => {
    setFiles((prev) => prev.filter((f) => f.id !== fileId));
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
                    <p className="text-xs text-green-600 mt-1">
                      Document processed successfully
                    </p>
                  )}
                  {fileItem.status === 'error' && (
                    <p className="text-xs text-red-600 mt-1">
                      Failed to process document
                    </p>
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
