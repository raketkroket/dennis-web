import { useState, useSyncExternalStore } from 'react';

/**
 * True when the page arrived as prerendered HTML (scripts/prerender.ts). The
 * first render must then match that HTML exactly, so saved preferences such
 * as the language are applied right after it instead.
 */
export const startedFromPrerender = typeof document !== 'undefined' && Boolean(document.getElementById('root')?.hasChildNodes());

const subscribe = () => () => {};

/**
 * False on the server and while React takes over prerendered HTML (also for
 * lazily loaded parts that are taken over later), true for normal renders.
 */
export function useHasMounted(): boolean {
  return useSyncExternalStore(subscribe, () => true, () => false);
}

/**
 * Whether this component was first rendered in the browser (a visit within
 * the site) rather than taken over from prerendered HTML. Fixed for the life
 * of the component, so entrance animations never switch on afterwards.
 */
export function useStartedOnClient(): boolean {
  const mounted = useHasMounted();
  const [startedOnClient] = useState(mounted);
  return startedOnClient;
}
