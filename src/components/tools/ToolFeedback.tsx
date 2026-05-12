'use client';

import { AlertCircle, Info, FileQuestion } from 'lucide-react';

/**
 * Compact, accessible inline error block for tool failures.
 * Use immediately under the input/output area to surface validation errors.
 */
export function ToolError({ message, hint }: { message: string; hint?: string }) {
  return (
    <div
      role="alert"
      aria-live="polite"
      className="flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 p-3 text-sm"
    >
      <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-red-600" aria-hidden="true" />
      <div>
        <p className="font-medium text-red-700">{message}</p>
        {hint && <p className="mt-1 text-red-600/80">{hint}</p>}
      </div>
    </div>
  );
}

/** Placeholder shown when output area is empty (before user clicks the action). */
export function ToolEmpty({
  message = 'Output will appear here.',
  hint,
}: {
  message?: string;
  hint?: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-gray-200 bg-gray-50 p-8 text-center">
      <FileQuestion className="mb-2 h-6 w-6 text-gray-400" aria-hidden="true" />
      <p className="text-sm text-gray-600">{message}</p>
      {hint && <p className="mt-1 text-xs text-gray-400">{hint}</p>}
    </div>
  );
}

/** Soft informational note — non-error guidance (size warnings, format tips). */
export function ToolHint({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-2 rounded-lg border border-blue-100 bg-blue-50 p-3 text-xs text-blue-700">
      <Info className="mt-0.5 h-3.5 w-3.5 flex-shrink-0" aria-hidden="true" />
      <span>{children}</span>
    </div>
  );
}
