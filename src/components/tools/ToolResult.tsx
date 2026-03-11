import CopyButton from '@/components/ui/CopyButton';
import DownloadButton from '@/components/ui/DownloadButton';

interface ToolResultProps {
  value: string;
  label?: string;
  language?: string;
  className?: string;
  showCopy?: boolean;
  showDownload?: boolean;
  downloadFilename?: string;
}

export default function ToolResult({
  value,
  label = 'Result',
  language,
  className = '',
  showCopy = true,
  showDownload = false,
  downloadFilename = 'result.txt',
}: ToolResultProps) {
  if (!value) return null;

  return (
    <div className={className}>
      <div className="flex items-center justify-between mb-2">
        <label className="text-sm font-medium text-gray-700">{label}</label>
        <div className="flex gap-2">
          {showCopy && <CopyButton text={value} />}
          {showDownload && (
            <DownloadButton content={value} filename={downloadFilename} />
          )}
        </div>
      </div>
      <div className="relative">
        <pre
          className={`w-full px-4 py-3 text-sm font-mono bg-gray-900 text-gray-100 rounded-lg overflow-x-auto ${language ? `language-${language}` : ''}`}
        >
          <code>{value}</code>
        </pre>
      </div>
    </div>
  );
}
