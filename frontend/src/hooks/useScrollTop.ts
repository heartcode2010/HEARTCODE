/**
 * useScrollTop
 * Returns a boolean `show` that becomes true once the window has scrolled
 * past `threshold` pixels — used to show/hide the scroll-to-top button.
 */
import { useState, useEffect } from 'react';

export function useScrollTop(threshold = 120): boolean {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > threshold);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [threshold]);

  return show;
}
