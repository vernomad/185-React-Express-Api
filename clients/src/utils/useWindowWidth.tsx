import { useState, useEffect } from 'react';

export function useWindowWidth() {
  const [windowWidth, setWindowWidth] = useState<number>(0);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const handleResize = () => {
        setWindowWidth(window.innerWidth);
      };

      // Set initial width
      handleResize();

      window.addEventListener('resize', handleResize);

      return () => {
        window.removeEventListener('resize', handleResize);
      };
    }
  }, []);

  return windowWidth;
}
