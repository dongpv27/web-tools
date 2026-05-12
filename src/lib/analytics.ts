'use client';

import { useCallback, useEffect, useState } from 'react';

/**
 * Lightweight, provider-agnostic event tracking.
 *
 * Architecture only: events flow to gtag if NEXT_PUBLIC_GA_ID is set,
 * otherwise to console.debug in dev, otherwise no-op. Replace the
 * implementation when a real analytics provider is wired up.
 */

type EventProps = Record<string, string | number | boolean | undefined>;

type Gtag = (command: 'event', name: string, params?: EventProps) => void;
declare global {
  interface Window {
    gtag?: Gtag;
  }
}

export function trackEvent(name: string, props: EventProps = {}): void {
  if (typeof window === 'undefined') return;

  if (typeof window.gtag === 'function') {
    window.gtag('event', name, props);
    return;
  }

  if (process.env.NODE_ENV !== 'production') {
    // eslint-disable-next-line no-console
    console.debug('[analytics]', name, props);
  }
}

export const trackToolView = (toolId: string) => trackEvent('tool_view', { tool_id: toolId });
export const trackToolRun = (toolId: string, action: string = 'run') =>
  trackEvent('tool_run', { tool_id: toolId, action });
export const trackToolDownload = (toolId: string, format?: string) =>
  trackEvent('tool_download', { tool_id: toolId, format });
export const trackSearch = (query: string) =>
  trackEvent('search', { query: query.slice(0, 80) });

/** React hook returning a stable trackEvent reference for client components. */
export function useTrackEvent() {
  return useCallback(trackEvent, []);
}

// ---------- recently-used tools (client-side, localStorage) ----------

const RECENT_KEY = 'lwt:recent-tools';
const RECENT_LIMIT = 10;

export function recordRecentTool(slug: string): void {
  if (typeof window === 'undefined' || !slug) return;
  try {
    const raw = window.localStorage.getItem(RECENT_KEY);
    const prev: string[] = raw ? JSON.parse(raw) : [];
    const next = [slug, ...prev.filter((s) => s !== slug)].slice(0, RECENT_LIMIT);
    window.localStorage.setItem(RECENT_KEY, JSON.stringify(next));
  } catch {
    // localStorage may be disabled (private mode, quota) — silently skip.
  }
}

export function getRecentTools(): string[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(RECENT_KEY);
    return raw ? (JSON.parse(raw) as string[]) : [];
  } catch {
    return [];
  }
}

/** Hook: read the current recent-tools list and record visits.
 *  Pass `currentSlug` on a tool page to mark it as visited. */
export function useRecentTools(currentSlug?: string): string[] {
  const [list, setList] = useState<string[]>([]);
  useEffect(() => {
    if (currentSlug) recordRecentTool(currentSlug);
    setList(getRecentTools());
  }, [currentSlug]);
  return list;
}
