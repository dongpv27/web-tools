'use client';

import { useEffect, useState } from 'react';

// AdSense Slot IDs - Replace with your actual slot IDs
export const ADSENSE_SLOTS = {
  'header-banner': '1234567890',
  'sidebar-1': '2234567890',
  'sidebar-2': '3234567890',
  'footer-banner': '4234567890',
  'in-content': '5234567890',
  'mobile-anchor': '6234567890',
} as const;

// Toggle this to enable/disable ads globally
const ADS_ENABLED = false;

// Toggle this to show placeholder ads when ADS_ENABLED is false
const SHOW_PLACEHOLDERS = true;

// Your AdSense Publisher ID
const ADSENSE_CLIENT_ID = 'ca-pub-XXXXXXXXXXXXXXXX';

// Ad slot configurations with responsive sizes following Google AdSense standards
const adSlots: Record<keyof typeof ADSENSE_SLOTS, {
  desktop: { width: number; height: number };
  mobile: { width: number; height: number };
  type: 'banner' | 'rectangle';
}> = {
  // Horizontal Banners
  'header-banner': {
    desktop: { width: 728, height: 90 },   // Leaderboard
    mobile: { width: 320, height: 100 },   // Large Mobile Banner
    type: 'banner',
  },
  'footer-banner': {
    desktop: { width: 728, height: 90 },   // Leaderboard
    mobile: { width: 320, height: 100 },   // Large Mobile Banner
    type: 'banner',
  },
  // Rectangle Ads
  'sidebar-1': {
    desktop: { width: 300, height: 250 },  // Medium Rectangle
    mobile: { width: 0, height: 0 },       // Hidden on mobile (sidebar hidden)
    type: 'rectangle',
  },
  'sidebar-2': {
    desktop: { width: 300, height: 250 },  // Medium Rectangle
    mobile: { width: 0, height: 0 },       // Hidden on mobile (sidebar hidden)
    type: 'rectangle',
  },
  'in-content': {
    desktop: { width: 336, height: 280 },  // Large Rectangle
    mobile: { width: 336, height: 280 },   // Large Rectangle
    type: 'rectangle',
  },
  // Mobile Only
  'mobile-anchor': {
    desktop: { width: 0, height: 0 },      // Hidden on desktop
    mobile: { width: 320, height: 50 },    // Mobile Banner
    type: 'banner',
  },
};

type AdSlotKey = keyof typeof ADSENSE_SLOTS;

interface AdBannerProps {
  slot: AdSlotKey;
  format?: 'auto' | 'fluid' | 'rectangle' | 'horizontal' | 'vertical';
  className?: string;
  showPlaceholder?: boolean;
}

// Declare adsbygoogle on window object
declare global {
  interface Window {
    adsbygoogle: unknown[];
  }
}

export default function AdBanner({
  slot,
  format = 'auto',
  className = '',
  showPlaceholder = false,
}: AdBannerProps) {
  const [mounted, setMounted] = useState(false);

  const config = adSlots[slot] || {
    desktop: { width: 300, height: 250 },
    mobile: { width: 336, height: 280 },
    type: 'rectangle' as const,
  };

  // Handle client-side mounting to avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  // Push ad to AdSense when component mounts (client-side only)
  useEffect(() => {
    if (!mounted || !ADS_ENABLED) return;

    try {
      // Initialize adsbygoogle array if not exists
      if (typeof window !== 'undefined') {
        window.adsbygoogle = window.adsbygoogle || [];
        window.adsbygoogle.push({});
      }
    } catch (error) {
      console.error('AdSense push error:', error);
    }
  }, [mounted]);

  // Show placeholder when ADS_ENABLED is false and SHOW_PLACEHOLDERS is true
  if (!ADS_ENABLED) {
    if (SHOW_PLACEHOLDERS || showPlaceholder) {
      // Mobile anchor - fixed at bottom on mobile only
      if (slot === 'mobile-anchor') {
        return (
          <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 p-2 shadow-lg">
            <div
              className={`bg-gradient-to-r from-cyan-100 to-blue-100 border-2 border-dashed border-cyan-400 rounded-lg flex items-center justify-center text-cyan-700 text-xs font-medium mx-auto ${className}`}
              style={{ height: config.mobile.height, maxWidth: config.mobile.width }}
            >
              <div className="text-center px-4">
                <span>📱 Mobile Anchor (320×50)</span>
              </div>
            </div>
          </div>
        );
      }

      // Sidebar ads - only show on desktop
      if (slot.startsWith('sidebar-')) {
        return (
          <div className={className}>
            <div
              className="bg-gradient-to-br from-cyan-50 to-blue-50 border-2 border-dashed border-cyan-300 rounded-xl flex items-center justify-center text-cyan-600 text-sm font-medium"
              style={{ minHeight: config.desktop.height, width: '100%', maxWidth: config.desktop.width }}
            >
              <div className="text-center p-2">
                <div className="text-[10px] text-cyan-400 mb-1">ADVERTISEMENT</div>
                <span className="text-xs">{config.desktop.width}×{config.desktop.height}</span>
                <div className="text-[9px] text-cyan-400 mt-1">slot: {slot}</div>
              </div>
            </div>
          </div>
        );
      }

      // Banner ads - responsive
      if (config.type === 'banner') {
        return (
          <div className={className}>
            {/* Desktop Banner */}
            <div
              className="hidden md:flex bg-gradient-to-br from-cyan-50 to-blue-50 border-2 border-dashed border-cyan-300 rounded-xl items-center justify-center text-cyan-600 text-sm font-medium mx-auto"
              style={{ minHeight: config.desktop.height, width: config.desktop.width, maxWidth: '100%' }}
            >
              <div className="text-center p-2">
                <div className="text-[10px] text-cyan-400 mb-1">ADVERTISEMENT</div>
                <span className="text-xs">{config.desktop.width}×{config.desktop.height}</span>
                <div className="text-[9px] text-cyan-400 mt-1">slot: {slot}</div>
              </div>
            </div>

            {/* Mobile Banner */}
            <div
              className="md:hidden bg-gradient-to-br from-cyan-50 to-blue-50 border-2 border-dashed border-cyan-300 rounded-xl flex items-center justify-center text-cyan-600 text-xs font-medium mx-auto"
              style={{ minHeight: config.mobile.height, width: config.mobile.width, maxWidth: '100%' }}
            >
              <div className="text-center p-2">
                <div className="text-[10px] text-cyan-400">AD</div>
                <span>{config.mobile.width}×{config.mobile.height}</span>
              </div>
            </div>
          </div>
        );
      }

      // Rectangle ads (in-content)
      return (
        <div className={className}>
          <div
            className="bg-gradient-to-br from-cyan-50 to-blue-50 border-2 border-dashed border-cyan-300 rounded-xl flex items-center justify-center text-cyan-600 text-sm font-medium mx-auto"
            style={{ minHeight: config.mobile.height, width: config.mobile.width, maxWidth: '100%' }}
          >
            <div className="text-center p-2">
              <div className="text-[10px] text-cyan-400 mb-1">ADVERTISEMENT</div>
              <span className="text-xs">{config.mobile.width}×{config.mobile.height}</span>
              <div className="text-[9px] text-cyan-400 mt-1">slot: {slot}</div>
            </div>
          </div>
        </div>
      );
    }
    return null;
  }

  // Don't render until mounted to avoid hydration mismatch
  if (!mounted) {
    return null;
  }

  // Google AdSense implementation with responsive ads
  const slotId = ADSENSE_SLOTS[slot];

  return (
    <div className={`ad-container ${className}`}>
      {/* Desktop Ad */}
      {config.desktop.width > 0 && (
        <div className="hidden md:block">
          <ins
            className="adsbygoogle"
            style={{ display: 'block', width: config.desktop.width, height: config.desktop.height }}
            data-ad-client={ADSENSE_CLIENT_ID}
            data-ad-slot={slotId}
            data-ad-format={format}
            data-full-width-responsive="false"
          />
        </div>
      )}

      {/* Mobile Ad */}
      {config.mobile.width > 0 && (
        <div className="md:hidden">
          <ins
            className="adsbygoogle"
            style={{ display: 'block', width: config.mobile.width, height: config.mobile.height }}
            data-ad-client={ADSENSE_CLIENT_ID}
            data-ad-slot={slotId}
            data-ad-format={format}
            data-full-width-responsive="true"
          />
        </div>
      )}
    </div>
  );
}
