import { useEffect, useRef, useCallback } from 'react';

/**
 * Glitch logo hook — triggers CSS glitch class at random intervals.
 * Port of HEARTCODE.html lines 1599-1613.
 */
export function useGlitchLogo(ref: React.RefObject<HTMLElement | null>) {
  const timerRef = useRef<number | null>(null);

  const glitch = useCallback(() => {
    if (!ref.current) return;
    ref.current.classList.add('glitch');
    setTimeout(() => {
      ref.current?.classList.remove('glitch');
    }, 200);
  }, [ref]);

  useEffect(() => {
    function schedule() {
      const delay = 800 + Math.random() * 1700;
      timerRef.current = window.setTimeout(() => {
        glitch();
        if (Math.random() < 0.5) setTimeout(glitch, 180);
        if (Math.random() < 0.2) setTimeout(glitch, 380);
        schedule();
      }, delay);
    }
    schedule();
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [glitch]);

  return glitch;
}

export default useGlitchLogo;
