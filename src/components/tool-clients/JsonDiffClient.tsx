'use client';

import { useState, useMemo } from 'react';
import ToolInput from '@/components/tools/ToolInput';
import { validateJSON } from '@/lib/utils';

interface DiffResult {
  path: string;
  type: 'added' | 'removed' | 'changed';
  oldValue?: unknown;
  newValue?: unknown;
}

export default function JsonDiffClient() {
  const [json1, setJson1] = useState('');
  const [json2, setJson2] = useState('');
  const [error, setError] = useState('');

  const diffResults = useMemo(() => {
    if (!json1.trim() || !json2.trim()) return null;

    const validation1 = validateJSON(json1);
    const validation2 = validateJSON(json2);

    if (!validation1.valid || !validation2.valid) {
      return null;
    }

    try {
      const obj1 = JSON.parse(json1);
      const obj2 = JSON.parse(json2);
      return compareObjects(obj1, obj2, '');
    } catch {
      return null;
    }
  }, [json1, json2]);

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
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">JSON 1 (Original)</label>
          <ToolInput
            value={json1}
            onChange={setJson1}
            placeholder='{"key": "value"}'
            rows={8}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">JSON 2 (Modified)</label>
          <ToolInput
            value={json2}
            onChange={setJson2}
            placeholder='{"key": "new value"}'
            rows={8}
          />
        </div>
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

      {diffResults && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-gray-700">Differences Found</h3>
            <span className="text-sm text-gray-500">{diffResults.length} difference(s)</span>
          </div>

          {diffResults.length === 0 ? (
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-sm text-green-600">The JSON objects are identical!</p>
            </div>
          ) : (
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
          )}
        </div>
      )}
    </div>
  );
}
