'use client';

import { useState } from 'react';

export default function PasswordStrengthCheckerClient() {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const checkStrength = (pwd: string) => {
    let score = 0;
    const checks = {
      length: pwd.length >= 8,
      uppercase: /[A-Z]/.test(pwd),
      lowercase: /[a-z]/.test(pwd),
      numbers: /[0-9]/.test(pwd),
      symbols: /[^A-Za-z0-9]/.test(pwd),
      noSpace: !/\s/.test(pwd),
      length12: pwd.length >= 12,
    };

    if (checks.length) score++;
    if (checks.uppercase) score++;
    if (checks.lowercase) score++;
    if (checks.numbers) score++;
    if (checks.symbols) score++;
    if (checks.noSpace) score++;
    if (checks.length12) score++;

    let strength = { label: 'Very Weak', color: 'bg-red-500', width: '14%' };
    if (score >= 2) strength = { label: 'Weak', color: 'bg-orange-500', width: '28%' };
    if (score >= 3) strength = { label: 'Fair', color: 'bg-yellow-500', width: '42%' };
    if (score >= 4) strength = { label: 'Good', color: 'bg-blue-500', width: '60%' };
    if (score >= 5) strength = { label: 'Strong', color: 'bg-green-500', width: '80%' };
    if (score >= 6) strength = { label: 'Very Strong', color: 'bg-green-600', width: '100%' };

    return { checks, strength, score };
  };

  const { checks, strength, score } = checkStrength(password);

  const suggestions = [];
  if (!checks.length) suggestions.push('Use at least 8 characters');
  if (!checks.uppercase) suggestions.push('Add uppercase letters (A-Z)');
  if (!checks.lowercase) suggestions.push('Add lowercase letters (a-z)');
  if (!checks.numbers) suggestions.push('Add numbers (0-9)');
  if (!checks.symbols) suggestions.push('Add special characters (!@#$%^&*)');
  if (!checks.length12) suggestions.push('Use 12+ characters for better security');

  return (
    <div className="space-y-6">
      {/* Input */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
        <div className="relative">
          <input
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter password to check..."
            className="w-full px-4 py-2 pr-16 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
          />
          <button
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-2 top-1/2 -translate-y-1/2 px-2 py-1 text-xs text-gray-500 hover:text-gray-700"
          >
            {showPassword ? 'Hide' : 'Show'}
          </button>
        </div>
      </div>

      {/* Strength Meter */}
      {password && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Strength:</span>
            <span className={`text-sm font-medium ${strength.color.replace('bg-', 'text-')}`}>
              {strength.label}
            </span>
          </div>
          <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
            <div
              className={`h-full ${strength.color} transition-all duration-300`}
              style={{ width: strength.width }}
            />
          </div>
          <p className="text-xs text-gray-500">Score: {score}/7</p>
        </div>
      )}

      {/* Checks */}
      {password && (
        <div className="space-y-2">
          <h3 className="text-sm font-medium text-gray-700">Password Requirements</h3>
          <div className="grid grid-cols-2 gap-2">
            {Object.entries({
              '8+ characters': checks.length,
              'Uppercase (A-Z)': checks.uppercase,
              'Lowercase (a-z)': checks.lowercase,
              'Number (0-9)': checks.numbers,
              'Special char': checks.symbols,
              'No spaces': checks.noSpace,
              '12+ characters': checks.length12,
            }).map(([label, passed]) => (
              <div key={label} className="flex items-center gap-2 text-sm">
                <span className={passed ? 'text-green-500' : 'text-gray-300'}>
                  {passed ? '✓' : '○'}
                </span>
                <span className={passed ? 'text-gray-700' : 'text-gray-400'}>
                  {label}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Suggestions */}
      {suggestions.length > 0 && password && (
        <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <h4 className="text-sm font-medium text-yellow-800 mb-2">Suggestions:</h4>
          <ul className="text-sm text-yellow-700 space-y-1">
            {suggestions.map((s, i) => (
              <li key={i}>• {s}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Warning */}
      {password && score >= 5 && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-sm text-green-700">
            ✓ This password meets good security standards
          </p>
        </div>
      )}
    </div>
  );
}
