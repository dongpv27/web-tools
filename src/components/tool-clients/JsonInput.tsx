'use client';

import { memo, useMemo, useRef, useState, useCallback, useEffect } from 'react';

interface JsonInputProps {
  value: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  rows?: number;
  error?: string;
  readOnly?: boolean;
}

const JsonInput = memo(function JsonInput({
  value,
  onChange,
  placeholder,
  rows = 6,
  error,
  readOnly = false
}: JsonInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const displayRef = useRef<HTMLDivElement>(null);
  const [isFocused, setIsFocused] = useState(false);
  const [internalValue, setInternalValue] = useState('');

  // Sync internal state when value prop changes
  useEffect(() => {
    setInternalValue(value);
  }, [value]);

  // Highlight JSON with colors
  const highlightedJson = useMemo(() => {
    if (!internalValue?.trim()) return '';
    try {
      const parsed = JSON.parse(internalValue);
      const jsonString = JSON.stringify(parsed, null, 2);
      return jsonString
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"([^"]*)":/g, '<span class="text-purple-600">"$1"</span>:')
        .replace(/: "([^"]*)"/g, ': <span class="text-green-600">"$1"</span>')
        .replace(/: (\d+)/g, ': <span class="text-green-600">$1</span>')
        .replace(/: (true|false)/g, ': <span class="text-blue-600">$1</span>')
        .replace(/: (null)/g, ': <span class="text-gray-500">$1</span>');
    } catch {
      // Invalid JSON, just escape HTML
      return internalValue
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
    }
  }, [internalValue]);

  // Sync scroll between textarea and colored display
  const handleScroll = useCallback(() => {
    if (displayRef.current && textareaRef.current) {
      displayRef.current.scrollTop = textareaRef.current.scrollTop;
      displayRef.current.scrollLeft = textareaRef.current.scrollLeft;
    }
  }, []);

  // Handle focus
  const handleFocus = useCallback(() => {
    setIsFocused(true);
  }, []);

  const handleBlur = useCallback(() => {
    setIsFocused(false);
  }, []);

  // Handle composition events (for IME input like Vietnamese)
  const isComposingRef = useRef(false);

  const handleCompositionStart = useCallback(() => {
    isComposingRef.current = true;
  }, []);

  const handleCompositionEnd = useCallback(() => {
    isComposingRef.current = false;
  }, []);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (readOnly || isComposingRef.current) return;
    const newValue = e.target.value;
    setInternalValue(newValue);
    onChange?.(newValue);
  }, [readOnly, onChange]);

  return (
    <div className="relative">
      {/* Colored display - always visible for readOnly, visible when not focused for editable */}
      <div
        ref={displayRef}
        className={`px-3 py-2 pointer-events-none select-none ${
          readOnly
            ? 'overflow-hidden'
            : 'absolute inset-0 overflow-y-auto transition-opacity duration-150'
        }`}
        style={{
          opacity: readOnly ? 1 : (isFocused ? 0 : 1),
          ...(readOnly ? {} : { inset: 0 })
        }}
      >
        {highlightedJson ? (
          <pre className="text-sm font-mono whitespace-pre-wrap break-all">
            <span dangerouslySetInnerHTML={{ __html: highlightedJson }} />
          </pre>
        ) : (
          <span className="text-gray-400 text-sm">{placeholder}</span>
        )}
      </div>

      {/* Textarea - hidden for readOnly, visible for editable */}
      {!readOnly && (
        <textarea
          ref={textareaRef}
          value={internalValue}
          onChange={handleChange}
          onCompositionStart={handleCompositionStart}
          onCompositionEnd={handleCompositionEnd}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onScroll={handleScroll}
          placeholder={placeholder}
          rows={rows}
          className={`w-full px-3 py-2 text-sm font-mono bg-transparent resize-none overflow-y-auto border rounded-lg focus:outline-none focus:ring-2 ${
            error
              ? 'focus:ring-red-500 bg-red-50'
              : 'focus:ring-blue-500 bg-white'
          }`}
          style={{
            color: isFocused ? '#1f2937' : 'transparent',
            caretColor: '#1f2937',
            background: 'transparent'
          }}
        />
      )}

      {/* Edit indicator - only for editable mode */}
      {!readOnly && isFocused && (
        <div className="absolute bottom-2 right-2 px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-md">
          Editing mode
        </div>
      )}
    </div>
  );
});

export default JsonInput;
