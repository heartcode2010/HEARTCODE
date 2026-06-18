import { useState, useEffect } from 'react';

/**
 * Scroll-to-top button visibility hook.
 * Port of HEARTCODE.html lines 1578-1591.
 */
export function useScrollToTop(threshold = 120): {
  visible: boolean;
  scrollToTop: () => void;
} {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    function onScroll() {
      setVisible(window.scrollY > threshold);
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [threshold]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return { visible, scrollToTop };
}

export default useScrollToTop;
