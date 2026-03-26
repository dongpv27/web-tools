'use client';

import { memo, useMemo, useRef, useState, useCallback, useEffect } from 'react';

const JwtTokenInput = memo(function JwtTokenInput({ input, onChange }: { input: string; onChange?: (value: string) => void }) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const displayRef = useRef<HTMLDivElement>(null);
  const [isFocused, setIsFocused] = useState(false);
  const [internalInput, setInternalInput] = useState('');

  // Sync internal state when input prop changes
  useEffect(() => {
    setInternalInput(input);
  }, [input]);

  // Parse JWT token for color display
  const tokenParts = useMemo(() => {
    if (!internalInput) return { header: '', payload: '', signature: '' };
    const parts = internalInput.split('.');
    return {
      header: parts[0] || '',
      payload: parts[1] || '',
      signature: parts[2] || '',
    };
  }, [internalInput]);

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

  const handleCompositionEnd = useCallback((e: React.CompositionEvent<HTMLTextAreaElement>) => {
    isComposingRef.current = false;
  }, []);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    // Don't update during composition (IME input)
    if (!isComposingRef.current) {
      const newValue = e.target.value;
      // Update internal state and let parent know
      setInternalInput(newValue);
      onChange?.(newValue);
    }
  }, [onChange]);

  return (
    <div className="relative">
      {/* Colored display - always visible but with different opacity based on focus */}
      <div
        ref={displayRef}
        className="absolute inset-0 px-3 py-2 pointer-events-none select-none overflow-y-auto transition-opacity duration-150"
        style={{
          opacity: isFocused ? 0 : 1,
        }}
      >
        <div className="text-sm font-mono whitespace-pre-wrap break-all">
          <span className="text-blue-600">{tokenParts.header}</span>
          <span className="text-purple-600">.{tokenParts.payload}</span>
          <span className="text-orange-600">.{tokenParts.signature}</span>
        </div>
      </div>

      {/* Textarea for editing - always visible with normal color when focused */}
      <textarea
        ref={textareaRef}
        value={internalInput}
        onChange={handleChange}
        onCompositionStart={handleCompositionStart}
        onCompositionEnd={handleCompositionEnd}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onScroll={handleScroll}
        placeholder="Paste your JWT token here..."
        rows={10}
        className="w-full px-3 py-2 text-sm font-mono bg-transparent resize-none overflow-y-auto"
        style={{
          border: 'none',
          outline: 'none',
          color: isFocused ? '#1f2937' : 'transparent',
          caretColor: '#1f2937',
          background: 'transparent'
        }}
      />

      {/* Edit indicator */}
      {isFocused && (
        <div className="absolute bottom-2 right-2 px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-md">
          Editing mode
        </div>
      )}
    </div>
  );
});

export default JwtTokenInput;
