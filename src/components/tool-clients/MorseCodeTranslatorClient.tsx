'use client';

import { useState } from 'react';
import CopyButton from '@/components/ui/CopyButton';

const MORSE_CODE: Record<string, string> = {
  'A': '.-', 'B': '-...', 'C': '-.-.', 'D': '-..', 'E': '.', 'F': '..-.',
  'G': '--.', 'H': '....', 'I': '..', 'J': '.---', 'K': '-.-', 'L': '.-..',
  'M': '--', 'N': '-.', 'O': '---', 'P': '.--.', 'Q': '--.-', 'R': '.-.',
  'S': '...', 'T': '-', 'U': '..-', 'V': '...-', 'W': '.--', 'X': '-..-',
  'Y': '-.--', 'Z': '--..', '0': '-----', '1': '.----', '2': '..---',
  '3': '...--', '4': '....-', '5': '.....', '6': '-....', '7': '--...',
  '8': '---..', '9': '----.', '.': '.-.-.-', ',': '--..--', '?': '..--..',
  "'": '.----.', '!': '-.-.--', '/': '-..-.', '(': '-.--.', ')': '-.--.-',
  '&': '.-...', ':': '---...', ';': '-.-.-.', '=': '-...-', '+': '.-.-.',
  '-': '-....-', '_': '..--.-', '"': '.-..-.', '$': '...-..-', '@': '.--.-.',
  ' ': '/'
};

const REVERSE_MORSE: Record<string, string> = Object.fromEntries(
  Object.entries(MORSE_CODE).map(([k, v]) => [v, k])
);

export default function MorseCodeTranslatorClient() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [mode, setMode] = useState<'encode' | 'decode'>('encode');

  const textToMorse = (text: string): string => {
    return text.toUpperCase().split('').map(char => {
      return MORSE_CODE[char] || char;
    }).join(' ');
  };

  const morseToText = (morse: string): string => {
    return morse.split(' ').map(code => {
      if (code === '/') return ' ';
      return REVERSE_MORSE[code] || code;
    }).join('');
  };

  const translate = () => {
    if (mode === 'encode') {
      setOutput(textToMorse(input));
    } else {
      setOutput(morseToText(input));
    }
  };

  const swap = () => {
    const temp = input;
    setInput(output);
    setOutput(temp);
    setMode(mode === 'encode' ? 'decode' : 'encode');
  };

  const clear = () => {
    setInput('');
    setOutput('');
  };

  return (
    <div className="space-y-6">
      {/* Mode Selection */}
      <div className="flex gap-2">
        <button
          onClick={() => setMode('encode')}
          className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
            mode === 'encode'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Text to Morse
        </button>
        <button
          onClick={() => setMode('decode')}
          className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
            mode === 'decode'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Morse to Text
        </button>
      </div>

      {/* Input */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {mode === 'encode' ? 'Text to Convert' : 'Morse Code to Decode'}
        </label>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          rows={4}
          className="w-full px-3 py-2 text-sm font-mono border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder={mode === 'encode' ? 'Enter text to convert to Morse code...' : 'Enter Morse code (use spaces between letters, / for spaces)...'}
        />
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2">
        <button
          onClick={translate}
          className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
        >
          Translate
        </button>
        <button
          onClick={swap}
          className="px-4 py-2 bg-gray-600 text-white text-sm font-medium rounded-lg hover:bg-gray-700 transition-colors"
        >
          Swap
        </button>
        <button
          onClick={clear}
          className="px-4 py-2 bg-gray-200 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-300 transition-colors"
        >
          Clear
        </button>
      </div>

      {/* Output */}
      {output && (
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium text-gray-700">
              {mode === 'encode' ? 'Morse Code' : 'Decoded Text'}
            </label>
            <CopyButton text={output} />
          </div>
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <pre className="text-sm font-mono text-gray-800 whitespace-pre-wrap break-all">{output}</pre>
          </div>
        </div>
      )}

      {/* Reference */}
      <div className="text-sm text-gray-500">
        <p className="mb-2">Morse Code Reference:</p>
        <div className="grid grid-cols-6 md:grid-cols-10 gap-2 text-xs font-mono bg-gray-50 p-3 rounded-lg">
          {Object.entries(MORSE_CODE).slice(0, 26).map(([char, code]) => (
            <div key={char} className="text-center">
              <span className="font-bold">{char}</span>
              <div className="text-gray-500">{code}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
