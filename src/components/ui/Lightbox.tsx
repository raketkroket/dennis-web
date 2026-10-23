import { useEffect, useRef, type PointerEvent as ReactPointerEvent } from 'react';
import { createPortal } from 'react-dom';
import { ArrowLeft, ArrowRight, X } from 'lucide-react';
import type { ResponsiveImage } from '../../content/types';
import { useLanguage } from '../../i18n/useLanguage';
import { fill } from '../../i18n/format';

export interface LightboxItem {
  image: ResponsiveImage;
  alt: string;
  caption?: string;
}

interface LightboxProps {
  items: LightboxItem[];
  index: number | null;
  title: string;
  onClose: () => void;
  onIndexChange: (index: number) => void;
}

/**
 * Full-screen photo viewer: Escape closes, arrow keys and swipes move
 * between photos, Tab stays inside the dialog and focus returns to the
 * photo that opened it.
 */
export default function Lightbox({ items, index, title, onClose, onIndexChange }: LightboxProps) {
  const { t } = useLanguage();
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const swipeStart = useRef<number | null>(null);
  const open = index !== null && items.length > 0;
  const count = items.length;

  useEffect(() => {
    if (!open) return undefined;
    const opener = document.activeElement as HTMLElement | null;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeRef.current?.focus();
    return () => {
      document.body.style.overflow = originalOverflow;
      opener?.focus?.();
    };
  }, [open]);

  useEffect(() => {
    if (!open) return undefined;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        onClose();
      } else if (event.key === 'ArrowLeft' && count > 1) {
        onIndexChange((index - 1 + count) % count);
      } else if (event.key === 'ArrowRight' && count > 1) {
        onIndexChange((index + 1) % count);
      } else if (event.key === 'Tab' && dialogRef.current) {
        // Cycle through the visible buttons only (some are phone-only).
        const focusable = [...dialogRef.current.querySelectorAll<HTMLElement>('button:not([disabled])')].filter((element) => element.getClientRects().length > 0);
        if (!focusable.length) return;
        event.preventDefault();
        const current = focusable.indexOf(document.activeElement as HTMLElement);
        const next = event.shiftKey ? (current <= 0 ? focusable.length - 1 : current - 1) : (current === -1 || current === focusable.length - 1 ? 0 : current + 1);
        focusable[next].focus();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [open, index, count, onClose, onIndexChange]);

  // Load the neighbouring photos so moving through the gallery feels instant.
  useEffect(() => {
    if (!open || count < 2) return;
    for (const neighbour of [items[(index + 1) % count], items[(index - 1 + count) % count]]) {
      const preload = new Image();
      if (neighbour.image.srcSet) preload.srcset = neighbour.image.srcSet;
      preload.src = neighbour.image.src;
    }
  }, [open, index, count, items]);

  if (!open) return null;
  const item = items[index];

  const onPointerDown = (event: ReactPointerEvent) => {
    swipeStart.current = event.clientX;
  };
  const onPointerUp = (event: ReactPointerEvent) => {
    if (swipeStart.current === null || count < 2) return;
    const distance = event.clientX - swipeStart.current;
    swipeStart.current = null;
    if (Math.abs(distance) > 50) onIndexChange((index + (distance < 0 ? 1 : -1) + count) % count);
  };

  return createPortal(
    <div
      ref={dialogRef}
      className="fixed inset-0 z-[70] flex flex-col bg-[#14100c]/95 text-denra-ivory"
      role="dialog"
      aria-modal="true"
      aria-label={fill(t('site.lightboxLabel'), { title })}
    >
      <div className="flex items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <p className="min-w-0 truncate text-sm text-denra-ivory/80" aria-live="polite">
          {fill(t('site.lightboxCount'), { index: index + 1, total: count })}
          <span className="hidden sm:inline"> · {title}</span>
        </p>
        <button ref={closeRef} type="button" onClick={onClose} className="inline-flex h-12 items-center gap-2 border border-denra-ivory/30 px-4 text-sm font-medium hover:bg-denra-ivory/10">
          <X size={18} aria-hidden="true" />
          {t('site.lightboxClose')}
        </button>
      </div>

      <div
        className="relative flex min-h-0 flex-1 items-center justify-center px-2 pb-2 sm:px-20"
        onPointerDown={onPointerDown}
        onPointerUp={onPointerUp}
        onClick={(event) => { if (event.target === event.currentTarget) onClose(); }}
      >
        <img
          key={item.image.src}
          src={item.image.src}
          srcSet={item.image.srcSet}
          sizes="100vw"
          width={item.image.width}
          height={item.image.height}
          alt={item.alt}
          className="h-auto max-h-full w-auto max-w-full select-none object-contain"
          draggable={false}
        />
        {count > 1 && (
          <>
            <button type="button" onClick={() => onIndexChange((index - 1 + count) % count)} className="absolute left-2 top-1/2 hidden h-14 w-14 -translate-y-1/2 items-center justify-center border border-denra-ivory/30 bg-[#14100c]/60 hover:bg-denra-ivory/10 sm:left-4 sm:flex" aria-label={t('site.lightboxPrevious')}>
              <ArrowLeft size={20} aria-hidden="true" />
            </button>
            <button type="button" onClick={() => onIndexChange((index + 1) % count)} className="absolute right-2 top-1/2 hidden h-14 w-14 -translate-y-1/2 items-center justify-center border border-denra-ivory/30 bg-[#14100c]/60 hover:bg-denra-ivory/10 sm:right-4 sm:flex" aria-label={t('site.lightboxNext')}>
              <ArrowRight size={20} aria-hidden="true" />
            </button>
          </>
        )}
      </div>

      <div className="flex min-h-[64px] items-center justify-between gap-3 border-t border-denra-ivory/10 px-4 py-3 sm:px-6">
        <p className="min-w-0 text-sm text-denra-ivory/80">{item.caption}</p>
        {count > 1 && (
          <div className="flex shrink-0 gap-2 sm:hidden">
            <button type="button" onClick={() => onIndexChange((index - 1 + count) % count)} className="flex h-12 w-12 items-center justify-center border border-denra-ivory/30" aria-label={t('site.lightboxPrevious')}>
              <ArrowLeft size={18} aria-hidden="true" />
            </button>
            <button type="button" onClick={() => onIndexChange((index + 1) % count)} className="flex h-12 w-12 items-center justify-center border border-denra-ivory/30" aria-label={t('site.lightboxNext')}>
              <ArrowRight size={18} aria-hidden="true" />
            </button>
          </div>
        )}
      </div>
    </div>,
    document.body,
  );
}
