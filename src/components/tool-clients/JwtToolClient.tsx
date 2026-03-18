'use client';

import { useState } from 'react';
import JwtEncoderTab from './JwtEncoderTab';
import JwtDecoderTab from './JwtDecoderTab';

export type Algorithm = 'HS256' | 'RS256' | 'ES256';

interface SharedState {
  token: string;
  secretKey: string;
  algorithm: Algorithm;
  base64UrlEncoded: boolean;
  publicKey?: string; // For RSA/ECDSA signature verification
}

interface JwtToolClientProps {
  slug?: string;
}

export default function JwtToolClient({ slug }: JwtToolClientProps) {
  // Determine default tab from slug
  const getDefaultTab = (): 'encode' | 'decode' => {
    if (slug === 'jwt-decoder') return 'decode';
    return 'encode';
  };

  const [activeTab, setActiveTab] = useState<'encode' | 'decode'>(getDefaultTab());

  // Shared state - in-memory only, no localStorage
  const [sharedState, setSharedState] = useState<SharedState>({
    token: '',
    secretKey: '',
    algorithm: 'HS256',
    base64UrlEncoded: false,
    publicKey: '',
  });

  // Update shared state from Encoder
  const handleEncodeResult = (
    token: string,
    secretKey: string,
    algorithm: Algorithm,
    base64UrlEncoded: boolean,
    publicKey?: string
  ) => {
    console.log('[JWT Tool - handleEncodeResult]', { token, secretKey, algorithm, base64UrlEncoded, publicKey });
    setSharedState(prev => ({
      ...prev,
      token,
      secretKey,
      algorithm,
      base64UrlEncoded,
      publicKey,
    }));
  };

  // Update shared state from Decoder (when user pastes token)
  const handleDecodeResult = (token: string) => {
    console.log('[JWT Tool - handleDecodeResult]', { token });
    setSharedState(prev => ({
      ...prev,
      token,
    }));
  };

  // Update shared state from Decoder (when user manually changes key)
  const handleKeyUpdate = (secretKey: string, publicKey?: string, base64UrlEncoded?: boolean) => {
    console.log('[JWT Tool - handleKeyUpdate]', { secretKey, publicKey, base64UrlEncoded });
    setSharedState(prev => ({
      ...prev,
      secretKey,
      publicKey: publicKey || prev.publicKey,
      base64UrlEncoded: base64UrlEncoded ?? prev.base64UrlEncoded,
    }));
  };

  return (
    <div>
      {/* Tab Navigation */}
      <div className="flex border-b border-gray-200 mb-6">
        <button
          onClick={() => setActiveTab('encode')}
          className={`px-4 py-2 text-sm font-medium transition-colors ${
            activeTab === 'encode'
              ? 'border-b-2 border-blue-600 text-blue-600'
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          Encode
        </button>
        <button
          onClick={() => setActiveTab('decode')}
          className={`px-4 py-2 text-sm font-medium transition-colors ${
            activeTab === 'decode'
              ? 'border-b-2 border-blue-600 text-blue-600'
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          Decode
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === 'encode' ? (
        <JwtEncoderTab
          sharedState={sharedState}
          onEncode={handleEncodeResult}
        />
      ) : (
        <JwtDecoderTab
          sharedState={sharedState}
          onDecode={handleDecodeResult}
          onKeyUpdate={handleKeyUpdate}
        />
      )}
    </div>
  );
}
