'use client';

/**
 * Decorative stars and hearts for baby-themed UI
 * Minimal, cute animations for visual appeal
 */

export function FloatingStars({ className = '' }: { className?: string }) {
  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`} aria-hidden="true">
      {/* Top Left Star */}
      <div className="absolute top-[8%] left-[5%] animate-twinkle" style={{ animationDelay: '0s' }}>
        <svg viewBox="0 0 24 24" fill="#FDE68A" className="w-4 h-4 opacity-60">
          <path d="M12 2l2.4 7.4h7.6l-6.2 4.5 2.4 7.4-6.2-4.5-6.2 4.5 2.4-7.4-6.2-4.5h7.6z" />
        </svg>
      </div>

      {/* Top Right Star */}
      <div className="absolute top-[15%] right-[8%] animate-twinkle" style={{ animationDelay: '1.5s' }}>
        <svg viewBox="0 0 24 24" fill="#F6D77A" className="w-3 h-3 opacity-50">
          <path d="M12 2l2.4 7.4h7.6l-6.2 4.5 2.4 7.4-6.2-4.5-6.2 4.5 2.4-7.4-6.2-4.5h7.6z" />
        </svg>
      </div>

      {/* Middle Left Small Star */}
      <div className="absolute top-[45%] left-[10%] animate-twinkle" style={{ animationDelay: '3s' }}>
        <svg viewBox="0 0 24 24" fill="#FDE68A" className="w-3 h-3 opacity-40">
          <path d="M12 2l2.4 7.4h7.6l-6.2 4.5 2.4 7.4-6.2-4.5-6.2 4.5 2.4-7.4-6.2-4.5h7.6z" />
        </svg>
      </div>

      {/* Bottom Right Star */}
      <div className="absolute bottom-[20%] right-[12%] animate-twinkle" style={{ animationDelay: '2s' }}>
        <svg viewBox="0 0 24 24" fill="#FDE68A" className="w-4 h-4 opacity-55">
          <path d="M12 2l2.4 7.4h7.6l-6.2 4.5 2.4 7.4-6.2-4.5-6.2 4.5 2.4-7.4-6.2-4.5h7.6z" />
        </svg>
      </div>

      {/* Top Center Heart */}
      <div className="absolute top-[12%] left-[50%] -translate-x-1/2 animate-float-slow" style={{ animationDelay: '0.5s' }}>
        <svg viewBox="0 0 24 24" fill="#FFC1CC" className="w-3.5 h-3.5 opacity-45">
          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
        </svg>
      </div>

      {/* Bottom Left Heart */}
      <div className="absolute bottom-[25%] left-[15%] animate-float-slow" style={{ animationDelay: '2.5s' }}>
        <svg viewBox="0 0 24 24" fill="#FFB3C1" className="w-3 h-3 opacity-40">
          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
        </svg>
      </div>
    </div>
  );
}

export function FloatingHeartsMinimal({ className = '' }: { className?: string }) {
  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`} aria-hidden="true">
      {/* Left Heart */}
      <div className="absolute top-[20%] left-[8%] animate-float" style={{ animationDelay: '0s' }}>
        <svg viewBox="0 0 24 24" fill="#FFB3C1" className="w-3.5 h-3.5 opacity-35">
          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
        </svg>
      </div>

      {/* Right Heart */}
      <div className="absolute top-[30%] right-[10%] animate-float" style={{ animationDelay: '1.5s' }}>
        <svg viewBox="0 0 24 24" fill="#FFC1CC" className="w-3 h-3 opacity-30">
          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
        </svg>
      </div>

      {/* Bottom Heart */}
      <div className="absolute bottom-[15%] left-[50%] -translate-x-1/2 animate-float" style={{ animationDelay: '2.5s' }}>
        <svg viewBox="0 0 24 24" fill="#FFDDE5" className="w-4 h-4 opacity-25">
          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
        </svg>
      </div>
    </div>
  );
}

export function SparklesBorder({ className = '' }: { className?: string }) {
  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`} aria-hidden="true">
      {/* Top sparkles */}
      <div className="absolute top-0 left-[20%] animate-twinkle">
        <svg viewBox="0 0 12 12" fill="#FDE68A" className="w-2 h-2 opacity-60">
          <path d="M6 0l1.2 3.7h3.8l-3.1 2.25L9.1 9.7 6 7.45 2.9 9.7l1.2-3.75L1 3.7h3.8z" />
        </svg>
      </div>
      <div className="absolute top-0 right-[25%] animate-twinkle" style={{ animationDelay: '1s' }}>
        <svg viewBox="0 0 12 12" fill="#FFB3C1" className="w-2 h-2 opacity-50">
          <path d="M6 0l1.2 3.7h3.8l-3.1 2.25L9.1 9.7 6 7.45 2.9 9.7l1.2-3.75L1 3.7h3.8z" />
        </svg>
      </div>

      {/* Side sparkles */}
      <div className="absolute left-0 top-[30%] animate-twinkle" style={{ animationDelay: '2s' }}>
        <svg viewBox="0 0 12 12" fill="#FDE68A" className="w-2 h-2 opacity-45">
          <path d="M6 0l1.2 3.7h3.8l-3.1 2.25L9.1 9.7 6 7.45 2.9 9.7l1.2-3.75L1 3.7h3.8z" />
        </svg>
      </div>
      <div className="absolute right-0 top-[40%] animate-twinkle" style={{ animationDelay: '1.5s' }}>
        <svg viewBox="0 0 12 12" fill="#FFB3C1" className="w-2 h-2 opacity-55">
          <path d="M6 0l1.2 3.7h3.8l-3.1 2.25L9.1 9.7 6 7.45 2.9 9.7l1.2-3.75L1 3.7h3.8z" />
        </svg>
      </div>

      {/* Bottom sparkles */}
      <div className="absolute bottom-0 left-[30%] animate-twinkle" style={{ animationDelay: '0.5s' }}>
        <svg viewBox="0 0 12 12" fill="#FDE68A" className="w-2 h-2 opacity-50">
          <path d="M6 0l1.2 3.7h3.8l-3.1 2.25L9.1 9.7 6 7.45 2.9 9.7l1.2-3.75L1 3.7h3.8z" />
        </svg>
      </div>
      <div className="absolute bottom-0 right-[35%] animate-twinkle" style={{ animationDelay: '2.5s' }}>
        <svg viewBox="0 0 12 12" fill="#FFB3C1" className="w-2 h-2 opacity-40">
          <path d="M6 0l1.2 3.7h3.8l-3.1 2.25L9.1 9.7 6 7.45 2.9 9.7l1.2-3.75L1 3.7h3.8z" />
        </svg>
      </div>
    </div>
  );
}

export function FloatingStarsMinimal({ className = '' }: { className?: string }) {
  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`} aria-hidden="true">
      <div className="absolute top-[10%] left-[12%] animate-twinkle" style={{ animationDelay: '0s' }}>
        <svg viewBox="0 0 16 16" fill="#FDE68A" className="w-2.5 h-2.5 opacity-50">
          <path d="M8 1l1.6 4.9h5.1l-4.1 3 1.6 4.9L8 10.8l-4.1 3 1.6-4.9-4.1-3h5.1z" />
        </svg>
      </div>
      <div className="absolute top-[25%] right-[15%] animate-twinkle" style={{ animationDelay: '2s' }}>
        <svg viewBox="0 0 16 16" fill="#FDE68A" className="w-2 h-2 opacity-45">
          <path d="M8 1l1.6 4.9h5.1l-4.1 3 1.6 4.9L8 10.8l-4.1 3 1.6-4.9-4.1-3h5.1z" />
        </svg>
      </div>
      <div className="absolute bottom-[20%] left-[18%] animate-twinkle" style={{ animationDelay: '1.2s' }}>
        <svg viewBox="0 0 16 16" fill="#FDE68A" className="w-2.5 h-2.5 opacity-40">
          <path d="M8 1l1.6 4.9h5.1l-4.1 3 1.6 4.9L8 10.8l-4.1 3 1.6-4.9-4.1-3h5.1z" />
        </svg>
      </div>
    </div>
  );
}
