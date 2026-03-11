'use client';

import { useState } from 'react';
import CopyButton from '@/components/ui/CopyButton';
import DownloadButton from '@/components/ui/DownloadButton';

export default function SecureTokenGeneratorClient() {
  const [tokens, setTokens] = useState<string[]>([]);
  const [length, setLength] = useState(32);
  const [count, setCount] = useState(5);
  const [tokenType, setTokenType] = useState<'hex' | 'base64' | 'alphanumeric'>('hex');

  const generateHexToken = (len: number): string => {
    const bytes = new Uint8Array(len / 2);
    crypto.getRandomValues(bytes);
    return Array.from(bytes).map(b => b.toString(16).padStart(2, '0')).join('');
  };

  const generateBase64Token = (len: number): string => {
    const bytes = new Uint8Array(len);
    crypto.getRandomValues(bytes);
    let binary = '';
    for (let i = 0; i < bytes.length; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
  };

  const generateAlphanumericToken = (len: number): string => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const bytes = new Uint8Array(len);
    crypto.getRandomValues(bytes);
    return Array.from(bytes).map(b => chars[b % chars.length]).join('');
  };

  const generateTokens = () => {
    const newTokens: string[] = [];
    for (let i = 0; i < count; i++) {
      let token = '';
      switch (tokenType) {
        case 'hex':
          token = generateHexToken(length);
          break;
        case 'base64':
          token = generateBase64Token(length);
          break;
        case 'alphanumeric':
          token = generateAlphanumericToken(length);
          break;
      }
      newTokens.push(token);
    }
    setTokens(newTokens);
  };

  const copyAll = async () => {
    await navigator.clipboard.writeText(tokens.join('\n'));
  };

  const clearAll = () => {
    setTokens([]);
  };

  return (
    <div className="space-y-6">
      {/* Options */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Length */}
        <div className="flex items-center gap-2">
          <label className="text-sm text-gray-600 w-20">Length:</label>
          <input
            type="number"
            min={16}
            max={256}
            value={length}
            onChange={(e) => setLength(Number(e.target.value))}
            className="flex-1 px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Count */}
        <div className="flex items-center gap-2">
          <label className="text-sm text-gray-600 w-20">Count:</label>
          <input
            type="number"
            min={1}
            max={100}
            value={count}
            onChange={(e) => setCount(Number(e.target.value))}
            className="flex-1 px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Type */}
        <div className="flex items-center gap-2">
          <label className="text-sm text-gray-600 w-20">Type:</label>
          <select
            value={tokenType}
            onChange={(e) => setTokenType(e.target.value as 'hex' | 'base64' | 'alphanumeric')}
            className="flex-1 px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="hex">Hexadecimal</option>
            <option value="base64">Base64 (URL-safe)</option>
            <option value="alphanumeric">Alphanumeric</option>
          </select>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2">
        <button
          onClick={generateTokens}
          className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
        >
          Generate Secure Tokens
        </button>
        <button
          onClick={clearAll}
          className="px-4 py-2 bg-gray-200 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-300 transition-colors"
        >
          Clear
        </button>
      </div>

      {/* Output */}
      {tokens.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium text-gray-700">
              Generated Tokens ({tokens.length})
            </label>
            <div className="flex gap-2">
              <button
                onClick={copyAll}
                className="flex items-center gap-1 px-3 py-1.5 text-sm text-gray-600 hover:text-gray-800 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
              >
                Copy All
              </button>
              <DownloadButton content={tokens.join('\n')} filename="tokens.txt" />
            </div>
          </div>
          <div className="bg-gray-900 rounded-lg p-4 space-y-2 max-h-96 overflow-y-auto">
            {tokens.map((token, index) => (
              <div key={index} className="flex items-center justify-between group">
                <code className="text-sm font-mono text-green-400 break-all">{token}</code>
                <CopyButton text={token} className="opacity-0 group-hover:opacity-100 ml-2 flex-shrink-0" />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Info */}
      <div className="text-sm text-gray-500">
        <p>Generates cryptographically secure tokens using the Web Crypto API. Suitable for:</p>
        <ul className="list-disc list-inside mt-1">
          <li>API keys and access tokens</li>
          <li>Session identifiers</li>
          <li>CSRF tokens</li>
          <li>Password reset tokens</li>
        </ul>
      </div>
    </div>
  );
}
