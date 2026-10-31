import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { supabaseConfigured } from '../lib/env';
import { startedFromPrerender } from '../lib/hydration';
import { defaultSiteContent, loadSiteContent } from './load';
import type { SiteContent } from './types';

interface SiteContentValue extends SiteContent {
  /** True once live content from Supabase has arrived (or there is none to wait for). */
  ready: boolean;
  reload: () => Promise<void>;
}

const SiteContentContext = createContext<SiteContentValue | null>(null);
const cacheKey = 'denra-site-text-cache';

// Texts and business details are cached so returning visitors do not see
// the built-in wording flash before Dennis's edits arrive. Projects are not
// cached: their image URLs change with every deploy.
function cachedStrings(): Partial<Pick<SiteContent, 'texts' | 'business'>> {
  try {
    return JSON.parse(window.localStorage.getItem(cacheKey) ?? '{}');
  } catch {
    return {};
  }
}

export function SiteContentProvider({ children, initialContent }: { children: ReactNode; initialContent: SiteContent | null }) {
  // A prerendered page starts from the content it was rendered with: Dennis's
  // content when it was baked in at build time, otherwise the built-in content.
  const [content, setContent] = useState<SiteContent>(() => initialContent ?? ({ ...defaultSiteContent(), ...(supabaseConfigured && !startedFromPrerender ? cachedStrings() : {}) }));
  const [ready, setReady] = useState(!supabaseConfigured);

  const reload = useCallback(async () => {
    if (!supabaseConfigured) return;
    // The client is loaded after the first paint; the built-in content shows meanwhile.
    const { supabase } = await import('../lib/supabase');
    if (!supabase) return;
    const next = await loadSiteContent(supabase, defaultSiteContent());
    setContent(next);
    setReady(true);
    try {
      window.localStorage.setItem(cacheKey, JSON.stringify({ texts: next.texts, business: next.business }));
    } catch {
      // Storage can be unavailable (private mode); the cache is only a nicety.
    }
  }, []);

  useEffect(() => {
    if (supabaseConfigured && startedFromPrerender && !initialContent) {
      const cached = cachedStrings();
      if (cached.texts || cached.business) setContent((current) => ({ ...current, ...cached }));
    }
    reload().catch((error) => {
      console.error('Could not load website content; showing the built-in version.', error);
      setReady(true);
    });
  }, [reload, initialContent]);

  const value = useMemo(() => ({ ...content, ready, reload }), [content, ready, reload]);
  return <SiteContentContext.Provider value={value}>{children}</SiteContentContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useSiteContent(): SiteContentValue {
  const context = useContext(SiteContentContext);
  if (!context) throw new Error('useSiteContent must be used within a SiteContentProvider');
  return context;
}
