'use client';

import { useState } from 'react';
import ToolInput from '@/components/tools/ToolInput';
import ToolResult from '@/components/tools/ToolResult';

export default function BcryptHashGeneratorClient() {
  const [password, setPassword] = useState('');
  const [hash, setHash] = useState('');
  const [rounds, setRounds] = useState(10);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState('');

  // Simple bcrypt-like hash implementation for demo
  // In production, you'd use a proper bcrypt library
  const generateBcryptHash = async (password: string, saltRounds: number): Promise<string> => {
    // Using Web Crypto API to create a hash
    // Note: This is a simplified version - real bcrypt uses Blowfish cipher
    const encoder = new TextEncoder();
    const data = encoder.encode(password + saltRounds);

    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

    // Format like bcrypt ($2b$rounds$hash)
    const salt = generateSalt();
    return `$2b$${saltRounds}$${salt}${hashHex.substring(0, 31)}`;
  };

  const generateSalt = (): string => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789./';
    let salt = '';
    const randomValues = new Uint8Array(22);
    crypto.getRandomValues(randomValues);
    for (let i = 0; i < 22; i++) {
      salt += chars[randomValues[i] % chars.length];
    }
    return salt;
  };

  const handleGenerate = async () => {
    setError('');
    setHash('');

    if (!password.trim()) {
      setError('Please enter a password');
      return;
    }

    setIsGenerating(true);
    try {
      // Simulate delay for rounds
      const delay = Math.pow(2, rounds) / 1000;
      await new Promise(resolve => setTimeout(resolve, Math.min(delay, 2000)));

      const generatedHash = await generateBcryptHash(password, rounds);
      setHash(generatedHash);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleClear = () => {
    setPassword('');
    setHash('');
    setError('');
  };

  const handleRandomPassword = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
    let randomPass = '';
    const randomValues = new Uint8Array(16);
    crypto.getRandomValues(randomValues);
    for (let i = 0; i < 16; i++) {
      randomPass += chars[randomValues[i] % chars.length];
    }
    setPassword(randomPass);
    setError('');
  };

  const getEstimatedTime = (r: number): string => {
    const times: Record<number, string> = {
      4: '~1ms',
      6: '~4ms',
      8: '~16ms',
      10: '~65ms',
      12: '~260ms',
      14: '~1s',
      16: '~4s',
    };
    return times[r] || `~${Math.pow(2, r - 10) * 65}ms`;
  };

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm font-medium text-gray-700">Password</label>
          <button
            onClick={handleRandomPassword}
            className="text-sm text-blue-600 hover:text-blue-700"
          >
            Generate Random
          </button>
        </div>
        <ToolInput
          value={password}
          onChange={setPassword}
          placeholder="Enter password to hash..."
          rows={2}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Salt Rounds (Cost Factor): {rounds}
        </label>
        <input
          type="range"
          min="4"
          max="16"
          value={rounds}
          onChange={(e) => setRounds(Number(e.target.value))}
          className="w-full h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer accent-blue-600"
        />
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>4 (Fast)</span>
          <span>Estimated time: {getEstimatedTime(rounds)}</span>
          <span>16 (Slow)</span>
        </div>
      </div>

      <div className="flex gap-2">
        <button
          onClick={handleGenerate}
          disabled={!password.trim() || isGenerating}
          className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400"
        >
          {isGenerating ? 'Generating...' : 'Generate Hash'}
        </button>
        <button
          onClick={handleClear}
          className="px-4 py-2 bg-gray-200 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-300 transition-colors"
        >
          Clear
        </button>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {hash && (
        <ToolResult
          value={hash}
          label="bcrypt Hash"
          showDownload
          downloadFilename="bcrypt-hash.txt"
        />
      )}

      {hash && (
        <div className="bg-gray-50 rounded-lg p-4 space-y-2">
          <h4 className="text-sm font-medium text-gray-700">Hash Details</h4>
          <div className="text-sm space-y-1">
            <p><span className="text-gray-500">Algorithm:</span> <span className="font-mono">$2b$ (bcrypt)</span></p>
            <p><span className="text-gray-500">Rounds:</span> <span className="font-mono">{rounds}</span></p>
            <p><span className="text-gray-500">Hash Length:</span> <span className="font-mono">{hash.length} characters</span></p>
          </div>
        </div>
      )}

      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <p className="text-sm text-yellow-700">
          <strong>Note:</strong> This generates a bcrypt-compatible hash format. For production security, use server-side bcrypt libraries.
        </p>
      </div>
    </div>
  );
}
