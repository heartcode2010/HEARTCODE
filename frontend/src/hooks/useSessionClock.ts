import { useState, useEffect, useRef } from 'react';

/**
 * Session clock hook — returns mm:ss string, updates every second.
 * Port of HEARTCODE.html lines 1592-1596.
 */
export function useSessionClock(): string {
  const startRef = useRef(Date.now());
  const [display, setDisplay] = useState('00:00');

  useEffect(() => {
    const id = setInterval(() => {
      const s = Math.floor((Date.now() - startRef.current) / 1000);
      setDisplay(
        String(Math.floor(s / 60)).padStart(2, '0') +
          ':' +
          String(s % 60).padStart(2, '0')
      );
    }, 1000);
    return () => clearInterval(id);
  }, []);

  return display;
}

export default useSessionClock;
