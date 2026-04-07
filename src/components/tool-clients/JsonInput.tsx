'use client';

import { memo, useRef, useState, useCallback } from 'react';

interface JsonInputProps {
  value: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  rows?: number;
  error?: string;
  readOnly?: boolean;
  autoHeight?: boolean;
}

const JsonInput = memo(function JsonInput({
  value,
  onChange,
  placeholder,
  rows = 6,
  readOnly = false,
  autoHeight = false
}: JsonInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const displayRef = useRef<HTMLDivElement>(null);
  const [isFocused, setIsFocused] = useState(false);

  const handleFocus = useCallback(() => setIsFocused(true), []);
  const handleBlur = useCallback(() => setIsFocused(false), []);
  const handleChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange?.(e.target.value);
  }, [onChange]);

  // Highlight JSON - distinguish keys vs values
  const getHighlightedHtml = (text: string) => {
    if (!text?.trim()) return '';

    // Escape HTML first
    let html = text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');

    // Highlight keys (property names before colon)
    // Pattern: "key": - make key purple
    html = html.replace(/"([^"\\]*)":(\s*)/g, '<span style="color:#9333ea">"$1"</span>:$2');

    // Highlight string values (after colon, before comma or end)
    // Pattern: : "value" - make value green
    html = html.replace(/:\s*"([^"\\]*)"/g, ': <span style="color:#16a34a">"$1"</span>');

    // Highlight numbers (after colon)
    html = html.replace(/:\s*(\d+\.?\d*)/g, ': <span style="color:#d97706">$1</span>');

    // Highlight booleans
    html = html.replace(/:\s*(true|false)/g, ': <span style="color:#2563eb">$1</span>');

    // Highlight null
    html = html.replace(/:\s*null/g, ': <span style="color:#6b7280">null</span>');

    return html;
  };

  const fixedHeight = rows * 20 + 16;

  return (
    <div
      className="relative overflow-hidden"
      style={autoHeight ? undefined : { height: fixedHeight }}
    >
      {/* Auto-height: invisible spacer drives the container height */}
      {autoHeight && (
        <div
          className="invisible"
          aria-hidden="true"
          style={{ padding: '8px 12px' }}
        >
          <pre className="text-sm font-mono whitespace-pre-wrap break-all m-0">
            {value || placeholder}
          </pre>
        </div>
      )}

      {/* Colored display - visible when not focused */}
      <div
        ref={displayRef}
        className="absolute inset-0 w-full h-full px-3 py-2 pointer-events-none select-none overflow-hidden"
        style={{
          zIndex: isFocused ? 0 : 5,
          opacity: isFocused ? 0 : 1,
          backgroundColor: 'white',
          transition: 'opacity 0.1s'
        }}
      >
        {value ? (
          <pre className="text-sm font-mono whitespace-pre-wrap break-all m-0">
            <span dangerouslySetInnerHTML={{ __html: getHighlightedHtml(value) }} />
          </pre>
        ) : (
          <span className="text-gray-400 text-sm">{placeholder}</span>
        )}
      </div>

      {/* Textarea - always on top to receive clicks */}
      {!readOnly && (
        <textarea
          ref={textareaRef}
          value={value}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder={placeholder}
          spellCheck={false}
          className="absolute inset-0 w-full h-full px-3 py-2 text-sm font-mono resize-none overflow-hidden"
          style={{
            zIndex: 10,
            color: isFocused ? '#1f2937' : 'transparent',
            caretColor: '#1f2937',
            backgroundColor: 'transparent',
            border: 'none',
            outline: 'none',
          }}
        />
      )}

      {/* Focus ring */}
      {!readOnly && isFocused && (
        <div
          className="absolute inset-0 pointer-events-none rounded-lg"
          style={{ zIndex: 15, boxShadow: 'inset 0 0 0 2px #3b82f6' }}
        />
      )}

      {/* Editing indicator */}
      {!readOnly && isFocused && (
        <div
          className="absolute bottom-2 right-2 px-2 py-1 text-xs rounded-md"
          style={{ zIndex: 20, backgroundColor: '#dbeafe', color: '#1d4ed8' }}
        >
          Editing mode
        </div>
      )}
    </div>
  );
});

export default JsonInput;
