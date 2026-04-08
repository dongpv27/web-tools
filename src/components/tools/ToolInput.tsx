'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { Upload, X } from 'lucide-react';

interface ToolInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  label?: string;
  acceptFiles?: boolean;
  fileTypes?: string;
  rows?: number;
  className?: string;
  lineNumbers?: boolean;
}

export default function ToolInput({
  value,
  onChange,
  placeholder = 'Paste your content here...',
  label,
  acceptFiles = false,
  fileTypes = '*',
  rows = 10,
  className = '',
  lineNumbers = false,
}: ToolInputProps) {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const lineNumRef = useRef<HTMLDivElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    if (acceptFiles && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      readFile(file);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      readFile(file);
    }
  };

  const readFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      onChange(content);
    };
    reader.readAsText(file);
  };

  const handleClear = () => {
    onChange('');
  };

  const syncScroll = useCallback(() => {
    if (textareaRef.current && lineNumRef.current) {
      lineNumRef.current.scrollTop = textareaRef.current.scrollTop;
    }
  }, []);

  // Line numbers content
  const lineCount = Math.max((value || '').split('\n').length, rows);
  const lineNumbersHtml = Array.from({ length: lineCount }, (_, i) => i + 1).join('\n');

  // Sync scroll on value change (line count may change)
  useEffect(() => {
    syncScroll();
  }, [value, syncScroll]);

  return (
    <div className={className}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
        </label>
      )}
      <div
        className={`relative ${isDragging ? 'ring-2 ring-blue-500' : ''}`}
        onDragOver={acceptFiles ? handleDragOver : undefined}
        onDragLeave={acceptFiles ? handleDragLeave : undefined}
        onDrop={acceptFiles ? handleDrop : undefined}
      >
        {lineNumbers ? (
          <div className="flex border border-gray-300 rounded-lg focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent overflow-hidden">
            {/* Line numbers gutter */}
            <div
              ref={lineNumRef}
              className="flex-none pt-3 pb-3 pr-2 pl-3 text-right font-mono leading-5 text-gray-300 bg-gray-50 border-r border-gray-200 overflow-hidden select-none"
              aria-hidden="true"
              style={{ fontSize: '14px' }}
            >
              {lineNumbersHtml.split('\n').map((n, i) => (
                <div key={i}>{n}</div>
              ))}
            </div>
            {/* Textarea */}
            <textarea
              ref={textareaRef}
              value={value}
              onChange={(e) => onChange(e.target.value)}
              onScroll={syncScroll}
              placeholder={placeholder}
              rows={rows}
              className="flex-1 px-4 py-3 font-mono leading-5 border-0 rounded-r-lg focus:outline-none resize-y min-h-[200px]"
              style={{ fontSize: '14px' }}
            />
          </div>
        ) : (
          <textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            rows={rows}
            className="w-full px-4 py-3 text-sm font-mono border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-y min-h-[200px]"
          />
        )}
        {value && (
          <button
            onClick={handleClear}
            className="absolute top-2 right-2 p-1 text-gray-400 hover:text-gray-600 bg-white rounded"
            title="Clear"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {acceptFiles && (
        <div className="mt-2 flex items-center gap-2">
          <input
            ref={fileInputRef}
            type="file"
            accept={fileTypes}
            onChange={handleFileChange}
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-2 px-3 py-1.5 text-sm text-gray-600 hover:text-gray-800 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
          >
            <Upload className="w-4 h-4" />
            Upload File
          </button>
          <span className="text-xs text-gray-500">
            Drag and drop or click to upload
          </span>
        </div>
      )}
    </div>
  );
}
