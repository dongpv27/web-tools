'use client';

import AdBanner from '@/components/ads/AdBanner';

interface MainLayoutProps {
  children: React.ReactNode;
  /** Show right sidebar with ads */
  showSidebar?: boolean;
  /** Sidebar content (optional custom content above ads) */
  sidebarContent?: React.ReactNode;
  /** Show top banner ad */
  showTopBanner?: boolean;
  /** Show bottom banner ad */
  showBottomBanner?: boolean;
  /** Show mobile anchor ad (fixed at bottom on mobile) */
  showMobileAnchor?: boolean;
  /** Show ad placeholders in development */
  showPlaceholders?: boolean;
}

export default function MainLayout({
  children,
  showSidebar = false,
  sidebarContent,
  showTopBanner = false,
  showBottomBanner = false,
  showMobileAnchor = false,
  showPlaceholders = false,
}: MainLayoutProps) {
  return (
    <div className="min-h-screen">
      {/* Top Banner Ad */}
      {showTopBanner && (
        <div className="bg-gray-50 border-b border-gray-100 py-3">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <AdBanner
              slot="header-banner"
              format="horizontal"
              showPlaceholder={showPlaceholders}
              className="flex justify-center"
            />
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
        <div className={`flex gap-6 lg:gap-8 ${showSidebar ? 'lg:flex-row' : 'flex-col'}`}>
          {/* Main Content */}
          <main className={`flex-1 min-w-0 ${showSidebar ? '' : 'w-full'}`}>
            {children}
          </main>

          {/* Right Sidebar - Only visible on desktop (lg:) */}
          {showSidebar && (
            <aside className="hidden lg:block w-72 xl:w-80 flex-shrink-0">
              <div className="sticky top-20 space-y-4">
                {/* Custom sidebar content */}
                {sidebarContent}

                {/* Sidebar Ad 1 */}
                <AdBanner
                  slot="sidebar-1"
                  format="rectangle"
                  showPlaceholder={showPlaceholders}
                />

                {/* Sidebar Ad 2 */}
                <AdBanner
                  slot="sidebar-2"
                  format="rectangle"
                  showPlaceholder={showPlaceholders}
                />
              </div>
            </aside>
          )}
        </div>

        {/* Mobile/Tablet In-Content Ads - Below main content area */}
        {showSidebar && (
          <div className="lg:hidden mt-8 pt-6 border-t border-gray-200">
            <div className="flex justify-center">
              <AdBanner
                slot="in-content"
                format="rectangle"
                showPlaceholder={showPlaceholders}
              />
            </div>
          </div>
        )}
      </div>

      {/* Bottom Banner Ad */}
      {showBottomBanner && (
        <div className="bg-gray-50 border-t border-gray-100 py-4">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <AdBanner
              slot="footer-banner"
              format="horizontal"
              showPlaceholder={showPlaceholders}
              className="flex justify-center"
            />
          </div>
        </div>
      )}

      {/* Mobile Anchor Ad - Fixed at bottom on mobile only */}
      {showMobileAnchor && (
        <AdBanner
          slot="mobile-anchor"
          format="horizontal"
          showPlaceholder={showPlaceholders}
        />
      )}
    </div>
  );
}
