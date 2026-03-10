'use client';

import { useState, useCallback } from 'react';
import CopyButton from '@/components/ui/CopyButton';

export default function RandomPasswordGeneratorClient() {
  const [password, setPassword] = useState('');
  const [length, setLength] = useState(16);
  const [options, setOptions] = useState({
    uppercase: true,
    lowercase: true,
    numbers: true,
    symbols: true,
  });

  const getStrength = (pwd: string) => {
    let score = 0;
    if (pwd.length >= 8) score++;
    if (pwd.length >= 12) score++;
    if (pwd.length >= 16) score++;
    if (/[a-z]/.test(pwd)) score++;
    if (/[A-Z]/.test(pwd)) score++;
    if (/[0-9]/.test(pwd)) score++;
    if (/[^a-zA-Z0-9]/.test(pwd)) score++;

    if (score <= 2) return { label: 'Weak', color: 'bg-red-500', width: '25%' };
    if (score <= 4) return { label: 'Fair', color: 'bg-yellow-500', width: '50%' };
    if (score <= 5) return { label: 'Good', color: 'bg-blue-500', width: '75%' };
    return { label: 'Strong', color: 'bg-green-500', width: '100%' };
  };

  const generatePassword = useCallback(() => {
    const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const lowercase = 'abcdefghijklmnopqrstuvwxyz';
    const numbers = '0123456789';
    const symbols = '!@#$%^&*()_+-=[]{}|;:,.<>?';

    let chars = '';
    if (options.uppercase) chars += uppercase;
    if (options.lowercase) chars += lowercase;
    if (options.numbers) chars += numbers;
    if (options.symbols) chars += symbols;

    if (chars.length === 0) {
      setPassword('');
      return;
    }

    let pwd = '';
    const array = new Uint32Array(length);
    crypto.getRandomValues(array);
    for (let i = 0; i < length; i++) {
      pwd += chars[array[i] % chars.length];
    }
    setPassword(pwd);
  }, [length, options]);

  const handleOptionChange = (key: keyof typeof options) => {
    const newOptions = { ...options, [key]: !options[key] };
    // Ensure at least one option is selected
    if (Object.values(newOptions).some(v => v)) {
      setOptions(newOptions);
    }
  };

  const strength = password ? getStrength(password) : null;

  return (
    <div className="space-y-6">
      {/* Password Display */}
      {password && (
        <div className="relative">
          <div className="p-4 bg-gray-900 rounded-lg">
            <code className="text-lg font-mono text-green-400 break-all">{password}</code>
          </div>
          <CopyButton text={password} className="absolute top-2 right-2" />

          {/* Strength Indicator */}
          {strength && (
            <div className="mt-3">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm text-gray-600">Strength: {strength.label}</span>
                <span className="text-sm text-gray-500">{password.length} chars</span>
              </div>
              <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                <div className={`h-full ${strength.color} transition-all`} style={{ width: strength.width }} />
              </div>
            </div>
          )}
        </div>
      )}

      {/* Length Slider */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm font-medium text-gray-700">Password Length</label>
          <span className="text-sm font-mono text-gray-600">{length}</span>
        </div>
        <input
          type="range"
          min="4"
          max="64"
          value={length}
          onChange={(e) => setLength(Number(e.target.value))}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
        />
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>4</span>
          <span>64</span>
        </div>
      </div>

      {/* Options */}
      <div className="space-y-3">
        <label className="text-sm font-medium text-gray-700">Include Characters</label>
        <div className="grid grid-cols-2 gap-3">
          {[
            { key: 'uppercase', label: 'Uppercase (A-Z)', example: 'ABC' },
            { key: 'lowercase', label: 'Lowercase (a-z)', example: 'abc' },
            { key: 'numbers', label: 'Numbers (0-9)', example: '123' },
            { key: 'symbols', label: 'Symbols (!@#$)', example: '!@#' },
          ].map(({ key, label, example }) => (
            <label
              key={key}
              className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                options[key as keyof typeof options]
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:bg-gray-50'
              }`}
            >
              <input
                type="checkbox"
                checked={options[key as keyof typeof options]}
                onChange={() => handleOptionChange(key as keyof typeof options)}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <div>
                <span className="text-sm text-gray-700">{label}</span>
                <span className="text-xs text-gray-400 ml-1">({example})</span>
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2">
        <button
          onClick={generatePassword}
          className="flex-1 px-4 py-3 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
        >
          Generate Password
        </button>
        <button
          onClick={generatePassword}
          className="px-4 py-3 bg-gray-200 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-300 transition-colors"
          title="Regenerate"
        >
          🔄
        </button>
      </div>

      {/* Tips */}
      <div className="text-sm text-gray-500 space-y-1">
        <p>• Use at least 12 characters for better security</p>
        <p>• Include a mix of character types</p>
        <p>• Each password is generated locally and never stored</p>
      </div>
    </div>
  );
}
