// Business events for Google Analytics (the gtag snippet in index.html).
// Never pass what a visitor typed: only event names, page paths, choices from
// fixed lists and calculated amounts. Does nothing when gtag is not loaded
// (blocked, not consented, or during the build).

type Params = Record<string, string | number | boolean | undefined>;

declare global {
  interface Window {
    gtag?: (command: 'event', name: string, params?: Params) => void;
  }
}

export function track(name: string, params: Params = {}) {
  if (typeof window === 'undefined') return;
  try {
    window.gtag?.('event', name, params);
  } catch {
    // Analytics must never break the page.
  }
}

const sent = new Set<string>();

/** Sends an event once per page load, e.g. the first interaction with a form. */
export function trackOnce(name: string, params: Params = {}) {
  if (sent.has(name)) return;
  sent.add(name);
  track(name, params);
}

const ctaPaths = new Set(['/configurator', '/contact', '/badkamer-renovatie-kosten']);

/** Phone, e-mail, WhatsApp and call-to-action clicks anywhere on the site. */
export function trackLinkClick(event: MouseEvent) {
  const link = (event.target as Element | null)?.closest?.('a[href]') as HTMLAnchorElement | null;
  if (!link) return;
  const href = link.getAttribute('href') ?? '';
  const from = window.location.pathname;
  if (href.startsWith('tel:')) track('phone_click', { from });
  else if (href.startsWith('mailto:')) track('email_click', { from });
  else if (/^https:\/\/(wa\.me|api\.whatsapp\.com)\//.test(href)) track('whatsapp_click', { from });
  else {
    const url = new URL(href, window.location.origin);
    if (url.origin === window.location.origin && ctaPaths.has(url.pathname) && url.pathname !== from) {
      track('cta_click', { target: url.pathname, from, link_text: (link.textContent ?? '').trim().slice(0, 60) });
    }
  }
}
