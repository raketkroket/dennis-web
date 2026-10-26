import { useSyncExternalStore } from 'react';

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
