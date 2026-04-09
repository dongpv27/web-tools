import CopyButton from '@/components/ui/CopyButton';

interface ExampleOutputProps {
  input?: string;
  output: string;
  description?: string;
  textClassName?: string;
}

export default function ExampleOutput({ input, output, description, textClassName = 'text-green-400' }: ExampleOutputProps) {
  return (
    <div className="bg-blue-50 border border-blue-200 rounded-xl p-5 mt-6">
      <h3 className="text-sm font-semibold text-blue-900 mb-3 flex items-center gap-2">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
        Example Output
      </h3>

      {description && (
        <p className="text-sm text-blue-700 mb-3">{description}</p>
      )}

      {input && (
        <div className="mb-3">
          <label className="text-xs font-medium text-blue-600 uppercase tracking-wide">Input</label>
          <div className="mt-1 px-3 py-2 bg-white border border-blue-200 rounded-lg text-sm font-mono text-gray-700">
            {input}
          </div>
        </div>
      )}

      <div>
        <div className="flex items-center justify-between mb-1">
          <label className="text-xs font-medium text-blue-600 uppercase tracking-wide">Output</label>
          <CopyButton text={output} className="text-xs" />
        </div>
        <div className={`px-3 py-2 bg-gray-900 rounded-lg text-sm font-mono ${textClassName} overflow-x-auto`}>
          <pre className="whitespace-pre-wrap break-all">{output}</pre>
        </div>
      </div>
    </div>
  );
}
