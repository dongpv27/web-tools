'use client';

import { useState } from 'react';
import ToolInput from '@/components/tools/ToolInput';

interface ValidationResult {
  valid: boolean;
  type: 'IPv4' | 'IPv6' | 'Unknown';
  details?: {
    version: string;
    private: boolean;
    reserved: boolean;
    loopback: boolean;
    multicast: boolean;
  };
  error?: string;
}

export default function IpAddressValidatorClient() {
  const [input, setInput] = useState('');
  const [result, setResult] = useState<ValidationResult | null>(null);

  const validateIPv4 = (ip: string): ValidationResult => {
    const parts = ip.split('.');
    if (parts.length !== 4) {
      return { valid: false, type: 'IPv4', error: 'IPv4 must have 4 octets' };
    }

    const nums = parts.map(p => parseInt(p, 10));
    if (nums.some(n => isNaN(n) || n < 0 || n > 255)) {
      return { valid: false, type: 'IPv4', error: 'Each octet must be between 0 and 255' };
    }

    // Check for leading zeros
    if (parts.some(p => p.length > 1 && p.startsWith('0'))) {
      return { valid: false, type: 'IPv4', error: 'Leading zeros are not allowed' };
    }

    const [a, b, c, d] = nums;

    // Determine IP type
    let private_ = false;
    let reserved = false;
    let loopback = false;
    let multicast = false;

    // Loopback: 127.0.0.0/8
    if (a === 127) loopback = true;

    // Private ranges
    if (a === 10) private_ = true;
    if (a === 172 && b >= 16 && b <= 31) private_ = true;
    if (a === 192 && b === 168) private_ = true;

    // Reserved
    if (a === 0) reserved = true;
    if (a >= 224 && a <= 255) {
      if (a >= 224 && a <= 239) multicast = true;
      reserved = true;
    }

    return {
      valid: true,
      type: 'IPv4',
      details: {
        version: 'IPv4 (32-bit)',
        private: private_,
        reserved,
        loopback,
        multicast,
      },
    };
  };

  const validateIPv6 = (ip: string): ValidationResult => {
    // Handle :: shorthand
    let normalized = ip;

    // Expand :: to appropriate number of zeros
    if (ip.includes('::')) {
      const parts = ip.split('::');
      const left = parts[0] ? parts[0].split(':') : [];
      const right = parts[1] ? parts[1].split(':') : [];
      const missing = 8 - left.length - right.length;
      const zeros = Array(missing).fill('0');
      normalized = [...left, ...zeros, ...right].join(':');
    }

    const parts = normalized.split(':');
    if (parts.length !== 8) {
      return { valid: false, type: 'IPv6', error: 'IPv6 must have 8 groups' };
    }

    // Validate each group
    const hexRegex = /^[0-9a-fA-F]{1,4}$/;
    for (const part of parts) {
      if (!hexRegex.test(part)) {
        return { valid: false, type: 'IPv6', error: 'Each group must be 1-4 hex digits' };
      }
    }

    const isLoopback = ip === '::1' || normalized === '0:0:0:0:0:0:0:1';
    const isPrivate = ip.startsWith('fc') || ip.startsWith('fd') || ip.startsWith('fe80');

    return {
      valid: true,
      type: 'IPv6',
      details: {
        version: 'IPv6 (128-bit)',
        private: isPrivate,
        reserved: false,
        loopback: isLoopback,
        multicast: ip.startsWith('ff'),
      },
    };
  };

  const validate = () => {
    const ip = input.trim();

    if (!ip) {
      setResult({ valid: false, type: 'Unknown', error: 'Please enter an IP address' });
      return;
    }

    // Determine if IPv4 or IPv6
    if (ip.includes('.')) {
      setResult(validateIPv4(ip));
    } else if (ip.includes(':')) {
      setResult(validateIPv6(ip));
    } else {
      setResult({ valid: false, type: 'Unknown', error: 'Invalid IP address format' });
    }
  };

  const clearAll = () => {
    setInput('');
    setResult(null);
  };

  return (
    <div className="space-y-6">
      {/* Input */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          IP Address
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Enter IP address (e.g., 192.168.1.1 or 2001:db8::1)"
            className="flex-1 px-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
          />
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2">
        <button
          onClick={validate}
          className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
        >
          Validate
        </button>
        <button
          onClick={clearAll}
          className="px-4 py-2 bg-gray-200 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-300 transition-colors"
        >
          Clear
        </button>
      </div>

      {/* Result */}
      {result && (
        <div
          className={`p-4 rounded-lg border ${
            result.valid
              ? 'bg-green-50 border-green-200'
              : 'bg-red-50 border-red-200'
          }`}
        >
          <div className="flex items-center gap-2 mb-2">
            {result.valid ? (
              <svg className="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              <svg className="w-5 h-5 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            )}
            <span className={`font-medium ${result.valid ? 'text-green-800' : 'text-red-800'}`}>
              {result.valid ? `Valid ${result.type} Address` : `Invalid ${result.type} Address`}
            </span>
          </div>

          {result.error && (
            <p className="text-sm text-red-600">{result.error}</p>
          )}

          {result.details && (
            <div className="mt-3 space-y-1 text-sm">
              <p><span className="text-gray-500">Version:</span> <span className="font-mono">{result.details.version}</span></p>
              <p><span className="text-gray-500">Private:</span> {result.details.private ? 'Yes' : 'No'}</p>
              <p><span className="text-gray-500">Reserved:</span> {result.details.reserved ? 'Yes' : 'No'}</p>
              <p><span className="text-gray-500">Loopback:</span> {result.details.loopback ? 'Yes' : 'No'}</p>
              <p><span className="text-gray-500">Multicast:</span> {result.details.multicast ? 'Yes' : 'No'}</p>
            </div>
          )}
        </div>
      )}

      {/* Info */}
      <div className="text-sm text-gray-500 space-y-2">
        <p>Supports both IPv4 (e.g., 192.168.1.1) and IPv6 (e.g., 2001:db8::1) addresses.</p>
      </div>
    </div>
  );
}
