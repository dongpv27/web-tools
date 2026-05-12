import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';

export const runtime = 'edge';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const title = (searchParams.get('title') || 'Love Web Tools').slice(0, 120);
  const subtitle = (searchParams.get('subtitle') || 'Free Online Developer Tools').slice(0, 140);
  const category = searchParams.get('category')?.slice(0, 40);

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          justifyContent: 'center',
          padding: '80px',
          background: 'linear-gradient(135deg, #0ea5e9 0%, #2563eb 50%, #7c3aed 100%)',
          color: 'white',
          fontFamily: 'sans-serif',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 16,
            fontSize: 32,
            fontWeight: 600,
            opacity: 0.95,
            marginBottom: 24,
          }}
        >
          <span style={{ fontSize: 44 }}>♥</span>
          Love Web Tools
        </div>
        {category && (
          <div
            style={{
              fontSize: 24,
              padding: '8px 20px',
              background: 'rgba(255,255,255,0.18)',
              borderRadius: 999,
              marginBottom: 24,
              textTransform: 'uppercase',
              letterSpacing: 2,
            }}
          >
            {category}
          </div>
        )}
        <div
          style={{
            fontSize: 80,
            fontWeight: 800,
            lineHeight: 1.05,
            marginBottom: 24,
            maxWidth: 1000,
          }}
        >
          {title}
        </div>
        <div
          style={{
            fontSize: 32,
            opacity: 0.9,
            maxWidth: 1000,
          }}
        >
          {subtitle}
        </div>
        <div
          style={{
            position: 'absolute',
            bottom: 60,
            right: 80,
            fontSize: 22,
            opacity: 0.8,
          }}
        >
          lovewebtools.com
        </div>
      </div>
    ),
    { width: 1200, height: 630 },
  );
}
