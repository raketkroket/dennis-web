import type { ReactNode } from 'react';

interface RevealProps {
  children: ReactNode;
  className?: string;
  /** Kept for call sites that stagger items; the CSS version ignores it. */
  delay?: number;
  as?: 'div' | 'section' | 'li' | 'article';
}

// A short fade-up tied to scrolling (CSS scroll-driven animation, see
// .reveal in styles.css). Browsers without support, visitors who prefer
// reduced motion, crawlers and print all simply get the content, visible.
export default function Reveal({ children, className = '', as = 'div' }: RevealProps) {
  const Component = as;
  return <Component className={`reveal ${className}`}>{children}</Component>;
}
