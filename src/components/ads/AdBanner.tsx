interface AdBannerProps {
  slot: string;
  format?: 'horizontal' | 'vertical' | 'rectangle' | 'auto';
  className?: string;
  showPlaceholder?: boolean;
}

// Toggle this to enable/disable ads globally
const ADS_ENABLED = false;

// Ad slot configurations
const adSlots: Record<string, { width: number; height: number }> = {
  'header-banner': { width: 728, height: 90 },
  'sidebar-1': { width: 300, height: 250 },
  'sidebar-2': { width: 300, height: 250 },
  'in-content': { width: 336, height: 280 },
  'footer-banner': { width: 728, height: 90 },
};

export default function AdBanner({
  slot,
  format = 'auto',
  className = '',
  showPlaceholder = false,
}: AdBannerProps) {
  // Don't render anything if ads are disabled and no placeholder requested
  if (!ADS_ENABLED && !showPlaceholder) {
    return null;
  }

  const config = adSlots[slot] || { width: 300, height: 250 };

  // Placeholder for development/preview
  if (!ADS_ENABLED && showPlaceholder) {
    return (
      <div
        className={`bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center text-gray-400 text-sm ${className}`}
        style={{ minHeight: config.height, minWidth: config.width, maxWidth: '100%' }}
      >
        <span>Ad: {slot}</span>
      </div>
    );
  }

  // Google AdSense implementation (ready to use)
  return (
    <div className={`ad-container ${className}`}>
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client="ca-pub-XXXXXXXXXXXXXXXX"
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive="true"
      />
    </div>
  );
}
