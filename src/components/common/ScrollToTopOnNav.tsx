'use client';

import React, { useEffect, Suspense } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

function ScrollHandler() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Scroll window immediately to top (0, 0)
    // Works reliably across mobile and desktop browsers
    const scrollToTop = () => {
      try {
        window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
      } catch {
        window.scrollTo(0, 0);
      }
      if (document.documentElement) {
        document.documentElement.scrollTop = 0;
      }
      if (document.body) {
        document.body.scrollTop = 0;
      }
    };

    scrollToTop();

    // Re-verify after layout paint to prevent late DOM shifts from preserving scroll position
    const rafId = requestAnimationFrame(() => {
      scrollToTop();
    });

    return () => {
      cancelAnimationFrame(rafId);
    };
  }, [pathname, searchParams]);

  return null;
}

export function ScrollToTopOnNav() {
  return (
    <Suspense fallback={null}>
      <ScrollHandler />
    </Suspense>
  );
}
