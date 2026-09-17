'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { CuteTeddyLogo } from './CartoonIllustrations';

const STORAGE_KEY = 'bl_splash_session_seen';
const SPLASH_DURATION_MS = 2000; // 2.0s comfortable, visible branding
const SPLASH_FADE_MS = 400;     // 400ms smooth, elegant fade-out

interface BrandSplashScreenProps {
  children?: React.ReactNode;
}

export function BrandSplashScreen({ children }: BrandSplashScreenProps) {
  const [isSplashVisible, setIsSplashVisible] = useState(true);
  const [isFading, setIsFading] = useState(false);
  const [contentRevealed, setContentRevealed] = useState(false);
  const [shouldAnimateEntrance, setShouldAnimateEntrance] = useState(true);

  const dismissedRef = useRef(false);

  // Smooth dismiss handler
  const dismiss = useCallback(() => {
    if (dismissedRef.current) return;
    dismissedRef.current = true;
    setIsFading(true);
    setContentRevealed(true);

    setTimeout(() => {
      setIsSplashVisible(false);
    }, SPLASH_FADE_MS);
  }, []);

  useEffect(() => {
    let timer1: NodeJS.Timeout;
    let timer2: NodeJS.Timeout;

    // Accessibility: Respect prefers-reduced-motion
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setIsSplashVisible(false);
      setContentRevealed(true);
      setShouldAnimateEntrance(false);
      return;
    }

    try {
      const navEntries = performance.getEntriesByType('navigation');
      const isReload =
        (navEntries.length > 0 && (navEntries[0] as PerformanceNavigationTiming).type === 'reload') ||
        (typeof window !== 'undefined' && (window.performance as any)?.navigation?.type === 1);

      const sessionSeen = sessionStorage.getItem(STORAGE_KEY) === 'true';

      if (sessionSeen && !isReload) {
        // Already seen in this session during internal navigation:
        // Skip splash completely — NO second mini-loading screen or flash
        setIsSplashVisible(false);
        setContentRevealed(true);
        setShouldAnimateEntrance(false);
        return;
      }

      // First visit in this session or page refresh (F5/Reload):
      // Mark as seen so future internal navigations don't repeat
      sessionStorage.setItem(STORAGE_KEY, 'true');
      setShouldAnimateEntrance(true);

      // Play unified, centered branded splash screen for 2.0s
      timer1 = setTimeout(() => {
        if (dismissedRef.current) return;
        setIsFading(true);
        setContentRevealed(true);

        timer2 = setTimeout(() => {
          setIsSplashVisible(false);
        }, SPLASH_FADE_MS);
      }, SPLASH_DURATION_MS);

    } catch {
      // Fallback if sessionStorage is restricted (e.g. strict private mode)
      setIsSplashVisible(false);
      setContentRevealed(true);
      setShouldAnimateEntrance(false);
    }

    // Allow user to skip by pressing Escape
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        dismiss();
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    // Hard safety timeout
    const safetyTimer = setTimeout(() => {
      setContentRevealed(true);
      setIsSplashVisible(false);
    }, 3500);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(safetyTimer);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [dismiss]);

  // Content entrance styling:
  // - If splash played: bottom-to-top rising reveal entrance
  // - If already seen in session: immediate display
  let contentAnimationClass = 'w-full';
  if (shouldAnimateEntrance) {
    contentAnimationClass = contentRevealed
      ? 'w-full translate-y-0 opacity-100 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]'
      : 'w-full translate-y-8 opacity-0 pointer-events-none';
  } else {
    contentAnimationClass = 'w-full opacity-100';
  }

  return (
    <>
      <noscript>
        <style>
          {`
            .opacity-0 { opacity: 1 !important; transform: none !important; pointer-events: auto !important; }
            #bl-splash-overlay { display: none !important; }
          `}
        </style>
      </noscript>

      {isSplashVisible && (
        <div
          id="bl-splash-overlay"
          role="status"
          aria-label="Loading Baby Ladoo"
          onClick={dismiss}
          style={{
            transitionDuration: `${SPLASH_FADE_MS}ms`,
          }}
          className={`fixed inset-0 z-[99999] flex flex-col items-center justify-center cursor-pointer select-none bg-gradient-to-b from-[#FFFEFA] via-[#FFFDF9] to-[#FFFBF5] transition-opacity ease-out ${
            isFading ? 'opacity-0 pointer-events-none' : 'opacity-100'
          }`}
        >
          {/* Centered, Single High-Polish Branded Intro Screen */}
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

            {/* 4 Brand-Colored Pulsing/Bouncing Dots */}
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
      )}

      {children ? (
        <div className={contentAnimationClass}>
          {children}
        </div>
      ) : null}
    </>
  );
}
