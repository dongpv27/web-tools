'use client';

import type { Algorithm } from './JwtToolClient';

interface SignatureFormulaProps {
  algorithm: Algorithm;
}

const FORMULAS: Record<Algorithm, { formula: string; description: string }> = {
  HS256: {
    formula: 'HMACSHA256(base64UrlEncode(header) + "." + base64UrlEncode(payload), secret)',
    description: 'HMAC-SHA256 signature using your secret key',
  },
  RS256: {
    formula: 'RSASSA-PKCS1-v1_5-SHA256(header.payload, privateKey)',
    description: 'RSA signature with SHA-256 using your private key',
  },
  ES256: {
    formula: 'ECDSA-P256-SHA256(header.payload, privateKey)',
    description: 'ECDSA signature with P-256 curve and SHA-256 using your private key',
  },
};

export default function SignatureFormula({ algorithm }: SignatureFormulaProps) {
  const { formula, description } = FORMULAS[algorithm];

  return (
    <div className="mt-2 p-3 bg-gray-50 border border-gray-200 rounded-lg">
      <p className="text-xs text-gray-600 mb-1">{description}</p>
      <p className="text-sm font-mono text-gray-800 break-all">{formula}</p>
    </div>
  );
}
