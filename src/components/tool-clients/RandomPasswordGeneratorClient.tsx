'use client';

import { useState, useCallback } from 'react';
import CopyButton from '@/components/ui/CopyButton';
import DownloadButton from '@/components/ui/DownloadButton';
import { PASSPHRASE_WORDS } from '@/lib/passphrase-wordlist';

type Mode = 'random' | 'passphrase';
type Separator = '-' | '.' | '_' | ' ' | '';

export default function RandomPasswordGeneratorClient() {
  const [mode, setMode] = useState<Mode>('random');
  const [password, setPassword] = useState('');

  // Random mode
  const [length, setLength] = useState(16);
  const [options, setOptions] = useState({
    uppercase: true,
    lowercase: true,
    numbers: true,
    symbols: true,
    excludeSimilar: false,
    excludeAmbiguous: false,
  });

  // Passphrase mode
  const [wordCount, setWordCount] = useState(5);
  const [separator, setSeparator] = useState<Separator>('-');
  const [capitalize, setCapitalize] = useState(true);
  const [appendDigits, setAppendDigits] = useState(true);

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

  // Cryptographically uniform random integer in [0, max).
  // Math.random isn't CSPRNG; naive modulo on getRandomValues introduces
  // bias. This rejects bytes outside the largest multiple of `max` that
  // fits in a 32-bit space.
  const secureRandomInt = (max: number): number => {
    const buf = new Uint32Array(1);
    const limit = Math.floor(0x100000000 / max) * max;
    while (true) {
      crypto.getRandomValues(buf);
      if (buf[0] < limit) return buf[0] % max;
    }
  };

  const generateRandom = useCallback(() => {
    const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const lowercase = 'abcdefghijklmnopqrstuvwxyz';
    const numbers = '0123456789';
    const symbols = '!@#$%^&*()_+-=[]{}|;:,.<>?';

    let chars = '';
    if (options.uppercase) chars += uppercase;
    if (options.lowercase) chars += lowercase;
    if (options.numbers) chars += numbers;
    if (options.symbols) chars += symbols;

    if (options.excludeSimilar) chars = chars.replace(/[Il1|O0]/g, '');
    if (options.excludeAmbiguous) chars = chars.replace(/[{}\[\]()/\\'"`~,;:.<>]/g, '');

    if (chars.length === 0) { setPassword(''); return; }

    let pwd = '';
    for (let i = 0; i < length; i++) {
      pwd += chars[secureRandomInt(chars.length)];
    }
    setPassword(pwd);
  }, [length, options]);

  const generatePassphrase = useCallback(() => {
    const words: string[] = [];
    for (let i = 0; i < wordCount; i++) {
      let w = PASSPHRASE_WORDS[secureRandomInt(PASSPHRASE_WORDS.length)];
      if (capitalize) w = w[0].toUpperCase() + w.slice(1);
      words.push(w);
    }
    let result = words.join(separator);
    if (appendDigits) {
      const digits = String(secureRandomInt(10000)).padStart(4, '0');
      result += separator + digits;
    }
    setPassword(result);
  }, [wordCount, separator, capitalize, appendDigits]);

  const generate = () => (mode === 'random' ? generateRandom() : generatePassphrase());

  // Approximate Shannon entropy of the GENERATING DISTRIBUTION (not the
  // observed string). For random: log2(charsetSize) × length. For
  // passphrase: log2(wordlistSize) × wordCount + bits for digits.
  const entropyBits = (() => {
    if (mode === 'random') {
      let pool = 0;
      if (options.uppercase) pool += 26;
      if (options.lowercase) pool += 26;
      if (options.numbers) pool += 10;
      if (options.symbols) pool += 30;
      if (options.excludeSimilar) pool -= 6;
      if (options.excludeAmbiguous) pool -= 18;
      if (pool < 2) return 0;
      return Math.round(length * Math.log2(pool));
    }
    let bits = wordCount * Math.log2(PASSPHRASE_WORDS.length);
    if (appendDigits) bits += Math.log2(10000); // ~13.3
    return Math.round(bits);
  })();

  const CHAR_TYPE_KEYS: (keyof typeof options)[] = ['uppercase', 'lowercase', 'numbers', 'symbols'];
  const handleOptionChange = (key: keyof typeof options) => {
    const newOptions = { ...options, [key]: !options[key] };
    if (CHAR_TYPE_KEYS.includes(key)) {
      const anyCharType = CHAR_TYPE_KEYS.some(k => newOptions[k]);
      if (!anyCharType) return;
    }
    setOptions(newOptions);
  };

  const strength = password ? getStrength(password) : null;

  return (
    <div className="space-y-6">
      {/* Mode switch — equal width on mobile, fit-to-content on tablet+ */}
      <div className="grid grid-cols-2 sm:flex gap-2">
        <button
          onClick={() => { setMode('random'); setPassword(''); }}
          className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors min-h-[44px] ${
            mode === 'random' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Random password
        </button>
        <button
          onClick={() => { setMode('passphrase'); setPassword(''); }}
          className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors min-h-[44px] ${
            mode === 'passphrase' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Passphrase
        </button>
      </div>

      {/* Password Display */}
      {password && (
        <>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium text-gray-700">Generated {mode === 'random' ? 'Password' : 'Passphrase'}</label>
            <div className="flex gap-2">
              <CopyButton text={password} />
              <DownloadButton content={password} filename={mode === 'random' ? 'password.txt' : 'passphrase.txt'} />
            </div>
          </div>
          <div className="p-4 bg-gray-900 rounded-lg">
            <code className="text-lg font-mono text-green-400 break-all">{password}</code>
          </div>

          {strength && (
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm text-gray-600">Strength: {strength.label} <span className="text-gray-400">· ~{entropyBits} bits entropy</span></span>
                <span className="text-sm text-gray-500">{password.length} chars</span>
              </div>
              <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                <div className={`h-full ${strength.color} transition-all`} style={{ width: strength.width }} />
              </div>
            </div>
          )}
        </>
      )}

      {/* Random options */}
      {mode === 'random' && (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Length: <span className="font-mono">{length}</span>
            </label>
            <input
              type="range"
              min="4"
              max="64"
              value={length}
              onChange={(e) => setLength(Number(e.target.value))}
              className="w-full"
            />
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {(Object.entries({
              uppercase: 'A-Z uppercase',
              lowercase: 'a-z lowercase',
              numbers: '0-9 digits',
              symbols: 'Symbols (!@#$…)',
              excludeSimilar: 'Exclude similar (I,l,1,O,0)',
              excludeAmbiguous: 'Exclude brackets/quotes',
            }) as [keyof typeof options, string][]).map(([k, label]) => (
              <label key={k} className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={options[k]}
                  onChange={() => handleOptionChange(k)}
                  className="w-4 h-4 text-blue-600 rounded"
                />
                {label}
              </label>
            ))}
          </div>
        </div>
      )}

      {/* Passphrase options */}
      {mode === 'passphrase' && (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Word count: <span className="font-mono">{wordCount}</span> · entropy ≈ {entropyBits} bits
            </label>
            <input
              type="range"
              min="3"
              max="10"
              value={wordCount}
              onChange={(e) => setWordCount(Number(e.target.value))}
              className="w-full"
            />
            <p className="text-xs text-gray-500 mt-1">
              4 words ≈ {Math.round(4 * Math.log2(PASSPHRASE_WORDS.length))} bits (online attack-resistant) ·
              7 words ≈ {Math.round(7 * Math.log2(PASSPHRASE_WORDS.length))} bits (offline-attack-resistant) ·
              wordlist of {PASSPHRASE_WORDS.length} curated English words
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Separator</label>
              <select
                value={separator}
                onChange={(e) => setSeparator(e.target.value as Separator)}
                className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-md bg-white"
              >
                <option value="-">Hyphen (-)</option>
                <option value=".">Dot (.)</option>
                <option value="_">Underscore (_)</option>
                <option value=" ">Space ( )</option>
                <option value="">None</option>
              </select>
            </div>
            <div className="flex flex-col gap-1.5 pt-5">
              <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                <input type="checkbox" checked={capitalize} onChange={(e) => setCapitalize(e.target.checked)} className="w-4 h-4 text-blue-600 rounded" />
                Capitalize each word
              </label>
              <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                <input type="checkbox" checked={appendDigits} onChange={(e) => setAppendDigits(e.target.checked)} className="w-4 h-4 text-blue-600 rounded" />
                Append 4 random digits
              </label>
            </div>
          </div>
        </div>
      )}

      <button
        onClick={generate}
        className="w-full px-4 py-3 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
      >
        Generate {mode === 'random' ? 'Password' : 'Passphrase'}
      </button>
    </div>
  );
}
