'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { CuteTeddyLogo } from './CartoonIllustrations';

const STORAGE_KEY = 'bl_splash_shown';
const MIN_DURATION_MS = 550; // Minimum time to show branding (0.55s)
const MAX_DURATION_MS = 850; // Maximum duration (0.85s, strictly under 1s)
const FADE_DURATION_MS = 250; // Smooth fade-out duration (250ms)

export function BrandSplashScreen() {
  const [isVisible, setIsVisible] = useState(false);
  const [isFading, setIsFading] = useState(false);
  const dismissedRef = useRef(false);

  // Smooth dismiss handler
  const dismiss = useCallback(() => {
    if (dismissedRef.current) return;
    dismissedRef.current = true;
    setIsFading(true);

    setTimeout(() => {
      setIsVisible(false);
    }, FADE_DURATION_MS);
  }, []);

  useEffect(() => {
    // 1. Session check: only show once per browser session
    try {
      if (typeof window === 'undefined') return;
      const alreadyShown = sessionStorage.getItem(STORAGE_KEY);
      if (alreadyShown) {
        return; // Already seen in this session, do not render
      }

      // Mark as seen immediately so any navigation or refresh in this session won't re-trigger
      sessionStorage.setItem(STORAGE_KEY, 'true');
    } catch {
      // Fallback if sessionStorage is disabled/blocked in private mode
      return;
    }

    setIsVisible(true);
    const startTime = Date.now();

    // 2. Skip logic: if page has already loaded before minimum splash duration,
    // transition out smoothly right after the minimum duration (no unnecessary extra wait).
    const scheduleDismissIfReady = () => {
      const elapsed = Date.now() - startTime;
      const remainingMin = Math.max(0, MIN_DURATION_MS - elapsed);
      return setTimeout(() => {
        dismiss();
      }, remainingMin);
    };

    let timer: NodeJS.Timeout;

    if (document.readyState === 'complete') {
      timer = scheduleDismissIfReady();
    } else {
      const handleLoad = () => {
        timer = scheduleDismissIfReady();
      };
      window.addEventListener('load', handleLoad, { once: true });

      // Hard upper cap: strictly enforce maximum splash duration under 1 second
      timer = setTimeout(() => {
        window.removeEventListener('load', handleLoad);
        dismiss();
      }, MAX_DURATION_MS);
    }

    // Allow user to skip by pressing Escape
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        dismiss();
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [dismiss]);

  if (!isVisible) {
    return null;
  }

  return (
    <div
      role="status"
      aria-label="Loading Baby Ladoo"
      onClick={dismiss}
      style={{ transitionDuration: `${FADE_DURATION_MS}ms` }}
      className={`fixed inset-0 z-[99999] flex flex-col items-center justify-center cursor-pointer select-none bg-gradient-to-b from-[#FFFEFA] via-[#FFFDF9] to-[#FFFBF5] transition-opacity ease-out ${
        isFading ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      <div className="flex flex-col items-center justify-center px-4 max-w-xs sm:max-w-sm text-center">
        {/* Animated Brand Mascot Badge */}
        <div className="relative mb-4 sm:mb-5">
          {/* Subtle Outer Glow Ring */}
          <div className="absolute -inset-2 rounded-[32px] bg-gradient-to-tr from-[#FFD6E0] to-[#FDE8EB] opacity-60 blur-md animate-pulse" />

          {/* Teddy Bear Logo Frame */}
          <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-[28px] bg-gradient-to-br from-[#FFD6E0] to-[#FFC1CC] p-2.5 flex items-center justify-center border-3 border-white shadow-[0_8px_28px_rgba(240,98,119,0.22)] animate-pop-in">
            <CuteTeddyLogo className="w-full h-full animate-bob" />
          </div>
        </div>

        {/* Brand Name with signature multicolored letters */}
        <div className="flex items-baseline font-black text-2xl sm:text-3xl tracking-tight select-none mb-1.5 animate-fade-up">
          <span className="text-[#F27A8A]">B</span>
          <span className="text-[#D99A26]">a</span>
          <span className="text-[#1F95B5]">b</span>
          <span className="text-[#5E933E]">y</span>
          <span className="w-1.5 sm:w-2 inline-block"></span>
          <span className="text-[#F27A8A]">L</span>
          <span className="text-[#D99A26]">a</span>
          <span className="text-[#1F95B5]">d</span>
          <span className="text-[#5E933E]">o</span>
          <span className="text-[#F27A8A]">o</span>
        </div>

        {/* Warm Brand Tagline */}
        <p className="text-[11px] sm:text-xs font-semibold tracking-wider text-[#64748B] uppercase mb-5 animate-fade-up">
          Safe &amp; Organic for Little Ones
        </p>

        {/* 4 Brand-Colored Pulsing Dots */}
        <div className="flex items-center gap-2 mb-4" aria-hidden="true">
          <span className="w-2.5 h-2.5 rounded-full bg-[#F06277] animate-bounce [animation-delay:-0.3s]" />
          <span className="w-2.5 h-2.5 rounded-full bg-[#F6D77A] animate-bounce [animation-delay:-0.15s]" />
          <span className="w-2.5 h-2.5 rounded-full bg-[#8FD3E8] animate-bounce [animation-delay:0s]" />
          <span className="w-2.5 h-2.5 rounded-full bg-[#A8C98B] animate-bounce [animation-delay:0.15s]" />
        </div>

        {/* Skip hint */}
        <span className="text-[10px] text-[#94A3B8] font-medium tracking-wide">
          Tap anywhere to skip
        </span>
      </div>
    </div>
  );
}
