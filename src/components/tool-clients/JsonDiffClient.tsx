'use client';

import { useState, useMemo, useRef, useCallback, useEffect } from 'react';
import { validateJSON } from '@/lib/utils';

interface DiffResult {
  path: string;
  type: 'added' | 'removed' | 'changed';
  oldValue?: unknown;
  newValue?: unknown;
}

interface JsonDiffInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  rows?: number;
  highlights: DiffResult[];
  side: 'original' | 'modified';
}

// Component for JSON input with diff highlighting
function JsonDiffInput({
  value,
  onChange,
  placeholder = '',
  rows = 8,
  highlights,
  side
}: JsonDiffInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const displayRef = useRef<HTMLDivElement>(null);
  const lineNumRef = useRef<HTMLDivElement>(null);
  const [isFocused, setIsFocused] = useState(false);

  const handleFocus = useCallback(() => setIsFocused(true), []);
  const handleBlur = useCallback(() => setIsFocused(false), []);
  const handleChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e.target.value);
  }, [onChange]);

  // Filter highlights based on side
  const relevantHighlights = useMemo(() => {
    if (side === 'original') {
      return highlights.filter(h => h.type === 'removed' || h.type === 'changed');
    }
    return highlights.filter(h => h.type === 'added' || h.type === 'changed');
  }, [highlights, side]);

  // Build a Set of paths to highlight for quick lookup
  const highlightPaths = useMemo(() => {
    return new Set(relevantHighlights.map(h => h.path));
  }, [relevantHighlights]);

  // Get the highlight type for a path
  const getHighlightType = useCallback((path: string): 'added' | 'removed' | 'changed' | null => {
    const highlight = relevantHighlights.find(h => h.path === path);
    return highlight ? highlight.type : null;
  }, [relevantHighlights]);

  // Check if any nested path of a given path is in the highlights
  const hasNestedHighlight = useCallback((basePath: string): 'added' | 'removed' | 'changed' | null => {
    for (const path of highlightPaths) {
      if (path.startsWith(basePath + '[') || path.startsWith(basePath + '.')) {
        return getHighlightType(path);
      }
    }
    return null;
  }, [highlightPaths, getHighlightType]);

  // Get highlighted HTML with diff markers
  const getHighlightedHtml = useCallback((text: string) => {
    if (!text?.trim()) return '';

    const lines = text.split('\n');
    const highlightedLines: string[] = [];

    // Track current path context
    // Stack contains { key: string, isArray: boolean, arrayIndex: number }
    const contextStack: { key: string; isArray: boolean; arrayIndex: number }[] = [];

    // Helper to get current path
    const getCurrentPath = (key?: string): string => {
      const parts: string[] = [];
      for (const ctx of contextStack) {
        parts.push(ctx.key);
      }
      if (key) {
        parts.push(key);
      }
      return parts.join('.').replace(/\.\[/g, '[');
    };

    // Helper to get parent path (for array items)
    const getParentPath = (): string => {
      const parts: string[] = [];
      for (const ctx of contextStack) {
        parts.push(ctx.key);
      }
      return parts.join('.');
    };

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const trimmed = line.trim();

      // Count leading spaces to determine indent level
      const leadingSpaces = line.match(/^(\s*)/)?.[1]?.length || 0;
      const indentLevel = Math.floor(leadingSpaces / 2);

      // Pop context stack if we've dedented
      while (contextStack.length > indentLevel) {
        contextStack.pop();
      }

      // Escape HTML
      let htmlLine = line
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');

      let highlightType: 'added' | 'removed' | 'changed' | null = null;

      // Parse the line to determine path
      // Pattern 1: "key": value (object property)
      const keyValueMatch = trimmed.match(/^"([^"]+)":\s*(.*)$/);
      if (keyValueMatch) {
        const key = keyValueMatch[1];
        const value = keyValueMatch[2];

        // Get full path for this key
        const fullPath = getCurrentPath(key);

        // Check for direct highlight
        highlightType = getHighlightType(fullPath);

        // If not directly highlighted, check if any nested path is highlighted
        // (for inline arrays/objects)
        if (!highlightType && (value.startsWith('[') || value.startsWith('{'))) {
          highlightType = hasNestedHighlight(fullPath);
        }

        // Highlight key
        htmlLine = htmlLine.replace(
          `"${key}":`,
          `<span style="color:#9333ea">"${key}"</span>:`
        );

        // Highlight value based on type
        if (value.startsWith('"')) {
          htmlLine = htmlLine.replace(/: (".*?")(,?)$/, ': <span style="color:#16a34a">$1</span>$2');
        } else if (/^-?\d/.test(value)) {
          htmlLine = htmlLine.replace(/:\s*(-?\d+\.?\d*)(,?)$/, ': <span style="color:#d97706">$1</span>$2');
        } else if (value.startsWith('true') || value.startsWith('false')) {
          htmlLine = htmlLine.replace(/:\s*(true|false)(,?)$/, ': <span style="color:#2563eb">$1</span>$2');
        } else if (value.startsWith('null')) {
          htmlLine = htmlLine.replace(/:\s*(null)(,?)$/, ': <span style="color:#6b7280">$1</span>$2');
        }

        // Push context for nested structures (only for multi-line arrays/objects)
        if (value === '[') {
          contextStack.push({ key, isArray: true, arrayIndex: 0 });
        } else if (value === '{') {
          contextStack.push({ key, isArray: false, arrayIndex: 0 });
        }
      }
      // Pattern 2: Array element - string
      else if (trimmed.match(/^"([^"]*)"(,?)$/)) {
        if (contextStack.length > 0) {
          const currentCtx = contextStack[contextStack.length - 1];
          if (currentCtx.isArray) {
            const fullPath = `${getParentPath()}[${currentCtx.arrayIndex}]`;
            highlightType = getHighlightType(fullPath);
            currentCtx.arrayIndex++;
          }
        }
      }
      // Pattern 3: Array element - number
      else if (trimmed.match(/^(-?\d+\.?\d*)(,?)$/)) {
        if (contextStack.length > 0) {
          const currentCtx = contextStack[contextStack.length - 1];
          if (currentCtx.isArray) {
            const fullPath = `${getParentPath()}[${currentCtx.arrayIndex}]`;
            highlightType = getHighlightType(fullPath);
            currentCtx.arrayIndex++;
          }
        }
      }
      // Pattern 4: Array element - boolean
      else if (trimmed.match(/^(true|false)(,?)$/)) {
        if (contextStack.length > 0) {
          const currentCtx = contextStack[contextStack.length - 1];
          if (currentCtx.isArray) {
            const fullPath = `${getParentPath()}[${currentCtx.arrayIndex}]`;
            highlightType = getHighlightType(fullPath);
            currentCtx.arrayIndex++;
          }
        }
      }
      // Pattern 5: Array element - null
      else if (trimmed.match(/^null(,?)$/)) {
        if (contextStack.length > 0) {
          const currentCtx = contextStack[contextStack.length - 1];
          if (currentCtx.isArray) {
            const fullPath = `${getParentPath()}[${currentCtx.arrayIndex}]`;
            highlightType = getHighlightType(fullPath);
            currentCtx.arrayIndex++;
          }
        }
      }
      // Pattern 6: Array element - nested object start
      else if (trimmed === '{' || trimmed === '{,') {
        if (contextStack.length > 0) {
          const currentCtx = contextStack[contextStack.length - 1];
          if (currentCtx.isArray) {
            // Object in array - use index as key
            const idx = currentCtx.arrayIndex;
            contextStack.push({ key: `[${idx}]`, isArray: false, arrayIndex: 0 });
            currentCtx.arrayIndex++;
          }
        }
      }
      // Pattern 7: Array element - nested array start
      else if (trimmed === '[' || trimmed === '[,') {
        if (contextStack.length > 0) {
          const currentCtx = contextStack[contextStack.length - 1];
          if (currentCtx.isArray) {
            // Array in array - use index as key
            const idx = currentCtx.arrayIndex;
            contextStack.push({ key: `[${idx}]`, isArray: true, arrayIndex: 0 });
            currentCtx.arrayIndex++;
          }
        }
      }

      // Apply background highlight
      if (highlightType) {
        const bgColor = highlightType === 'added'
          ? 'rgba(34, 197, 94, 0.25)'
          : highlightType === 'removed'
            ? 'rgba(239, 68, 68, 0.25)'
            : 'rgba(234, 179, 8, 0.25)';
        htmlLine = `<span style="background-color:${bgColor}">${htmlLine}</span>`;
      }

      highlightedLines.push(htmlLine);
    }

    return highlightedLines.join('\n');
  }, [getHighlightType, hasNestedHighlight]);

  // Line numbers content
  const lineCount = Math.max((value || '').split('\n').length, rows);

  const syncScroll = useCallback(() => {
    if (textareaRef.current && lineNumRef.current && displayRef.current) {
      const scrollTop = textareaRef.current.scrollTop;
      lineNumRef.current.scrollTop = scrollTop;
      displayRef.current.scrollTop = scrollTop;
    }
  }, []);

  useEffect(() => {
    syncScroll();
  }, [value, syncScroll]);

  return (
    <div className="relative border border-gray-300 rounded-lg focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent overflow-hidden">
      <div className="flex h-full">
        {/* Line numbers gutter */}
        <div
          ref={lineNumRef}
          className="flex-none pt-3 pb-3 pr-2 pl-3 text-right font-mono leading-5 text-gray-300 bg-gray-50 border-r border-gray-200 overflow-hidden select-none"
          aria-hidden="true"
          style={{ fontSize: '14px', minWidth: '40px' }}
        >
          {Array.from({ length: lineCount }, (_, i) => (
            <div key={i}>{i + 1}</div>
          ))}
        </div>

        {/* Main content area */}
        <div className="relative flex-1 min-w-0">
          {/* Colored display - visible when not focused */}
          <div
            ref={displayRef}
            className="absolute inset-0 w-full pointer-events-none select-none overflow-auto"
            style={{
              zIndex: isFocused ? 0 : 5,
              opacity: isFocused ? 0 : 1,
              backgroundColor: 'white',
              transition: 'opacity 0.1s'
            }}
          >
            <div className="px-4 py-3">
              {value ? (
                <pre className="text-sm font-mono leading-5 whitespace-pre m-0" style={{ fontSize: '14px' }}>
                  <span dangerouslySetInnerHTML={{ __html: getHighlightedHtml(value) }} />
                </pre>
              ) : (
                <span className="text-gray-400 text-sm font-mono leading-5" style={{ fontSize: '14px' }}>{placeholder}</span>
              )}
            </div>
          </div>

          {/* Textarea - always on top to receive clicks */}
          <textarea
            ref={textareaRef}
            value={value}
            onChange={handleChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onScroll={syncScroll}
            placeholder={placeholder}
            rows={rows}
            spellCheck={false}
            className="w-full px-4 py-3 font-mono leading-5 resize-y"
            style={{
              fontSize: '14px',
              zIndex: 10,
              color: isFocused ? '#1f2937' : 'transparent',
              caretColor: '#1f2937',
              backgroundColor: 'transparent',
              border: 'none',
              outline: 'none',
              minHeight: `${rows * 20 + 24}px`
            }}
          />

          {/* Editing indicator */}
          {isFocused && (
            <div
              className="absolute bottom-2 right-2 px-2 py-1 text-xs rounded-md"
              style={{ zIndex: 20, backgroundColor: '#dbeafe', color: '#1d4ed8' }}
            >
              Editing mode
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function JsonDiffClient() {
  const [json1, setJson1] = useState('');
  const [json2, setJson2] = useState('');
  const [error, setError] = useState('');

  const compareObjects = (obj1: unknown, obj2: unknown, path: string): DiffResult[] => {
    const results: DiffResult[] = [];

    if (typeof obj1 !== typeof obj2) {
      results.push({ path: path || 'root', type: 'changed', oldValue: obj1, newValue: obj2 });
      return results;
    }

    if (obj1 === null || obj2 === null) {
      if (obj1 !== obj2) {
        results.push({ path: path || 'root', type: 'changed', oldValue: obj1, newValue: obj2 });
      }
      return results;
    }

    if (typeof obj1 !== 'object') {
      if (obj1 !== obj2) {
        results.push({ path: path || 'root', type: 'changed', oldValue: obj1, newValue: obj2 });
      }
      return results;
    }

    if (Array.isArray(obj1) && Array.isArray(obj2)) {
      const maxLen = Math.max(obj1.length, obj2.length);
      for (let i = 0; i < maxLen; i++) {
        const newPath = `${path}[${i}]`;
        if (i >= obj1.length) {
          results.push({ path: newPath, type: 'added', newValue: obj2[i] });
        } else if (i >= obj2.length) {
          results.push({ path: newPath, type: 'removed', oldValue: obj1[i] });
        } else {
          results.push(...compareObjects(obj1[i], obj2[i], newPath));
        }
      }
      return results;
    }

    const keys1 = Object.keys(obj1 as Record<string, unknown>);
    const keys2 = Object.keys(obj2 as Record<string, unknown>);
    const allKeys = new Set([...keys1, ...keys2]);

    for (const key of allKeys) {
      const newPath = path ? `${path}.${key}` : key;

      if (!keys1.includes(key)) {
        results.push({ path: newPath, type: 'added', newValue: (obj2 as Record<string, unknown>)[key] });
      } else if (!keys2.includes(key)) {
        results.push({ path: newPath, type: 'removed', oldValue: (obj1 as Record<string, unknown>)[key] });
      } else {
        results.push(...compareObjects(
          (obj1 as Record<string, unknown>)[key],
          (obj2 as Record<string, unknown>)[key],
          newPath
        ));
      }
    }

    return results;
  };

  const diffResults = useMemo(() => {
    if (!json1.trim() || !json2.trim()) return [];

    const validation1 = validateJSON(json1);
    const validation2 = validateJSON(json2);

    if (!validation1.valid || !validation2.valid) {
      return [];
    }

    try {
      const obj1 = JSON.parse(json1);
      const obj2 = JSON.parse(json2);
      return compareObjects(obj1, obj2, '');
    } catch {
      return [];
    }
  }, [json1, json2]);

  const handleClear = () => {
    setJson1('');
    setJson2('');
    setError('');
  };

  const handleSample = () => {
    setJson1(JSON.stringify({
      name: "John",
      age: 30,
      city: "New York",
      hobbies: ["reading", "gaming"],
      active: true
    }, null, 2));
    setJson2(JSON.stringify({
      name: "John",
      age: 31,
      country: "USA",
      hobbies: ["reading", "coding"],
      active: false
    }, null, 2));
    setError('');
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'added': return 'text-green-600 bg-green-50 border-green-200';
      case 'removed': return 'text-red-600 bg-red-50 border-red-200';
      case 'changed': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <button
          onClick={handleSample}
          className="text-sm text-blue-600 hover:text-blue-700"
        >
          Load Sample Data
        </button>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <JsonDiffInput
          value={json1}
          onChange={setJson1}
          placeholder='{"key": "value"}'
          rows={8}
          highlights={diffResults}
          side="original"
        />
        <JsonDiffInput
          value={json2}
          onChange={setJson2}
          placeholder='{"key": "new value"}'
          rows={8}
          highlights={diffResults}
          side="modified"
        />
      </div>

      <div className="flex gap-2">
        <button
          onClick={handleClear}
          className="px-4 py-2 bg-gray-200 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-300 transition-colors"
        >
          Clear All
        </button>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {diffResults.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-gray-700">Differences Found</h3>
            <span className="text-sm text-gray-500">{diffResults.length} difference(s)</span>
          </div>

          <div className="space-y-2">
            {diffResults.map((diff, index) => (
              <div
                key={index}
                className={`p-3 border rounded-lg ${getTypeColor(diff.type)}`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-medium uppercase">{diff.type}</span>
                  <code className="text-xs font-mono">{diff.path}</code>
                </div>
                {diff.type === 'removed' && (
                  <p className="text-xs">Removed: <code className="font-mono">{JSON.stringify(diff.oldValue)}</code></p>
                )}
                {diff.type === 'added' && (
                  <p className="text-xs">Added: <code className="font-mono">{JSON.stringify(diff.newValue)}</code></p>
                )}
                {diff.type === 'changed' && (
                  <div className="text-xs space-y-1">
                    <p>From: <code className="font-mono">{JSON.stringify(diff.oldValue)}</code></p>
                    <p>To: <code className="font-mono">{JSON.stringify(diff.newValue)}</code></p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {json1.trim() && json2.trim() && diffResults.length === 0 && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-sm text-green-600">The JSON objects are identical!</p>
        </div>
      )}
    </div>
  );
}
