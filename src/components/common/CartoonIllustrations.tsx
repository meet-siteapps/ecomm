import React from 'react';

/**
 * Brand Logo: Cute smiling Teddy Bear mascot in a playful circle badge
 */
export function CuteTeddyLogo({ className = 'w-8 h-8' }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <circle cx="50" cy="50" r="46" fill="#FDE8EB" stroke="#F27A8A" strokeWidth="4" />
      {/* Left Ear */}
      <circle cx="28" cy="28" r="14" fill="#D49B6A" stroke="#B87B4A" strokeWidth="2.5" />
      <circle cx="28" cy="28" r="7" fill="#FDE8EB" />
      {/* Right Ear */}
      <circle cx="72" cy="28" r="14" fill="#D49B6A" stroke="#B87B4A" strokeWidth="2.5" />
      <circle cx="72" cy="28" r="7" fill="#FDE8EB" />
      {/* Bear Head */}
      <ellipse cx="50" cy="54" rx="30" ry="26" fill="#E2AA76" stroke="#B87B4A" strokeWidth="3" />
      {/* Snout */}
      <ellipse cx="50" cy="61" rx="13" ry="10" fill="#FFF9F2" />
      {/* Nose */}
      <ellipse cx="50" cy="56" rx="5" ry="3.5" fill="#193653" />
      {/* Mouth */}
      <path d="M46 62 Q 50 67 54 62" stroke="#193653" strokeWidth="2" strokeLinecap="round" fill="none" />
      {/* Eyes */}
      <circle cx="40" cy="48" r="3.5" fill="#193653" />
      <circle cx="41.5" cy="46.5" r="1.2" fill="#FFFFFF" />
      <circle cx="60" cy="48" r="3.5" fill="#193653" />
      <circle cx="61.5" cy="46.5" r="1.2" fill="#FFFFFF" />
      {/* Cheeks */}
      <circle cx="34" cy="56" r="4" fill="#F27A8A" fillOpacity="0.45" />
      <circle cx="66" cy="56" r="4" fill="#F27A8A" fillOpacity="0.45" />
    </svg>
  );
}

/**
 * Reference Hero Illustration: Plush 3D-styled Teddy Bear in Teal/Sage dungarees,
 * Pastel 5-Ring Rainbow Arc, Fluffy White Clouds, Toy Ball, Stacking Toy, Smiling Star & Foliage
 */
export function HeroCharactersIllustration({ className = 'w-full max-w-lg' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 600 480"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`${className} drop-shadow-md select-none`}
    >
      <defs>
        {/* Soft Drop Shadow Filter */}
        <filter id="soft-shadow" x="-10%" y="-10%" width="120%" height="120%" filterUnits="userSpaceOnUse">
          <feDropShadow dx="0" dy="8" stdDeviation="10" floodColor="#193653" floodOpacity="0.08" />
        </filter>

        {/* Linear Gradients for 3D depth */}
        <linearGradient id="bearBodyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#EBB888" />
          <stop offset="100%" stopColor="#CE8F58" />
        </linearGradient>

        <linearGradient id="dungareesGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#A8C98B" />
          <stop offset="100%" stopColor="#8AB36B" />
        </linearGradient>

        <linearGradient id="cloudGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="100%" stopColor="#FFF9F2" />
        </linearGradient>
      </defs>

      {/* 1. PASTEL RAINBOW ARC (Backdrop) */}
      <g opacity="0.92">
        {/* Stripe 1: Soft Sage */}
        <path d="M 120 370 A 180 180 0 0 1 480 370" stroke="#EFF7E9" strokeWidth="18" strokeLinecap="round" fill="none" />
        {/* Stripe 2: Pastel Sky Blue */}
        <path d="M 138 370 A 162 162 0 0 1 462 370" stroke="#8FD3E8" strokeWidth="16" strokeLinecap="round" fill="none" />
        {/* Stripe 3: Pastel Yellow */}
        <path d="M 154 370 A 146 146 0 0 1 446 370" stroke="#F6D77A" strokeWidth="15" strokeLinecap="round" fill="none" />
        {/* Stripe 4: Soft Sage */}
        <path d="M 169 370 A 131 131 0 0 1 431 370" stroke="#A8C98B" strokeWidth="15" strokeLinecap="round" fill="none" />
        {/* Stripe 5: Coral Pink */}
        <path d="M 184 370 A 116 116 0 0 1 416 370" stroke="#F27A8A" strokeWidth="14" strokeLinecap="round" fill="none" />
      </g>

      {/* 2. BACKGROUND FLUFFY CLOUDS */}
      <g filter="url(#soft-shadow)">
        {/* Left Base Cloud */}
        <g transform="translate(60, 310)">
          <path
            d="M 20 50 Q 0 50 0 35 Q 0 18 18 18 Q 28 0 50 5 Q 70 -5 85 15 Q 105 12 105 32 Q 115 50 90 50 Z"
            fill="url(#cloudGrad)"
          />
        </g>
        {/* Right Base Cloud */}
        <g transform="translate(420, 320)">
          <path
            d="M 20 50 Q 0 50 0 35 Q 0 18 18 18 Q 28 0 50 5 Q 70 -5 85 15 Q 105 12 105 32 Q 115 50 90 50 Z"
            fill="url(#cloudGrad)"
          />
        </g>
        {/* Top Left Floating Cloud */}
        <g transform="translate(90, 80) scale(0.75)">
          <path
            d="M 20 50 Q 0 50 0 35 Q 0 18 18 18 Q 28 0 50 5 Q 70 -5 85 15 Q 105 12 105 32 Q 115 50 90 50 Z"
            fill="url(#cloudGrad)"
          />
        </g>
      </g>

      {/* 3. SMILING YELLOW STAR (Top Right) */}
      <g transform="translate(450, 70)" className="animate-float">
        <polygon
          points="25,2 32,18 49,18 35,29 40,46 25,35 10,46 15,29 1,18 18,18"
          fill="#F6D77A"
          stroke="#E0B538"
          strokeWidth="2.5"
          strokeLinejoin="round"
        />
        {/* Star Eyes & Smile */}
        <circle cx="21" cy="21" r="2" fill="#193653" />
        <circle cx="29" cy="21" r="2" fill="#193653" />
        <path d="M 22 26 Q 25 29 28 26" stroke="#193653" strokeWidth="1.5" strokeLinecap="round" fill="none" />
        <circle cx="18" cy="24" r="1.5" fill="#F27A8A" />
        <circle cx="32" cy="24" r="1.5" fill="#F27A8A" />
      </g>

      {/* 4. FOUR-TIER STACKING TOY (Right Side of Bear) */}
      <g transform="translate(410, 310)">
        {/* Base Ring 1 (Soft Sage) */}
        <ellipse cx="40" cy="80" rx="36" ry="12" fill="#A8C98B" stroke="#729c50" strokeWidth="2" />
        {/* Ring 2 (Pastel Yellow) */}
        <ellipse cx="40" cy="65" rx="30" ry="10" fill="#F6D77A" stroke="#E0B538" strokeWidth="2" />
        {/* Ring 3 (Pastel Sky Blue) */}
        <ellipse cx="40" cy="52" rx="24" ry="9" fill="#8FD3E8" stroke="#3599b8" strokeWidth="2" />
        {/* Ring 4 (Coral Pink) */}
        <ellipse cx="40" cy="40" rx="18" ry="8" fill="#F27A8A" stroke="#e06878" strokeWidth="2" />
        {/* Star Topper */}
        <polygon
          points="40,16 43,24 51,24 45,29 47,37 40,32 33,37 35,29 29,24 37,24"
          fill="#F6D77A"
          stroke="#E0B538"
          strokeWidth="1.5"
        />
      </g>

      {/* 5. COLORFUL TOY BALL (Left Side of Bear) */}
      <g transform="translate(130, 340)">
        <circle cx="32" cy="32" r="28" fill="#8FD3E8" stroke="#3599b8" strokeWidth="2" />
        {/* Ball color stripes */}
        <path d="M 12 14 Q 32 32 12 50" stroke="#F27A8A" strokeWidth="12" fill="none" />
        <path d="M 32 4 Q 46 32 32 60" stroke="#F6D77A" strokeWidth="8" fill="none" />
        <path d="M 52 14 Q 32 32 52 50" stroke="#A8C98B" strokeWidth="8" fill="none" />
        <circle cx="24" cy="20" r="4" fill="white" opacity="0.6" />
      </g>

      {/* 6. GREEN LEAF SPRIGS (Foliage accents) */}
      <g transform="translate(480, 270)">
        <path d="M 10 40 Q 25 20 40 10" stroke="#A8C98B" strokeWidth="3" strokeLinecap="round" fill="none" />
        <ellipse cx="20" cy="26" rx="8" ry="4" transform="rotate(-30 20 26)" fill="#A8C98B" />
        <ellipse cx="32" cy="18" rx="8" ry="4" transform="rotate(-15 32 18)" fill="#A8C98B" />
        <ellipse cx="40" cy="10" rx="7" ry="3.5" transform="rotate(10 40 10)" fill="#A8C98B" />
      </g>

      {/* 7. PLUSH 3D TEDDY BEAR (Centerpiece Hero Mascot) */}
      <g transform="translate(200, 140)" filter="url(#soft-shadow)">
        {/* Left Bear Ear */}
        <circle cx="48" cy="40" r="24" fill="#CE8F58" stroke="#A36B3B" strokeWidth="3" />
        <circle cx="48" cy="40" r="13" fill="#FDE8EB" />

        {/* Right Bear Ear */}
        <circle cx="152" cy="40" r="24" fill="#CE8F58" stroke="#A36B3B" strokeWidth="3" />
        <circle cx="152" cy="40" r="13" fill="#FDE8EB" />

        {/* Bear Feet / Paws */}
        <g>
          {/* Left Foot */}
          <ellipse cx="50" cy="255" rx="24" ry="18" fill="#CE8F58" stroke="#A36B3B" strokeWidth="3" />
          <ellipse cx="50" cy="255" rx="14" ry="10" fill="#FFF9F2" />
          {/* Right Foot */}
          <ellipse cx="150" cy="255" rx="24" ry="18" fill="#CE8F58" stroke="#A36B3B" strokeWidth="3" />
          <ellipse cx="150" cy="255" rx="14" ry="10" fill="#FFF9F2" />
        </g>

        {/* Bear Body */}
        <ellipse cx="100" cy="180" rx="66" ry="68" fill="url(#bearBodyGrad)" stroke="#A36B3B" strokeWidth="3.5" />

        {/* Bear Dungarees (Soft Sage Overalls) */}
        <g>
          {/* Main Overalls Body */}
          <path
            d="M 46 170 Q 100 155 154 170 L 158 235 Q 100 250 42 235 Z"
            fill="url(#dungareesGrad)"
            stroke="#729c50"
            strokeWidth="3"
          />
          {/* Left Strap */}
          <rect x="58" y="130" width="16" height="50" rx="5" fill="#A8C98B" stroke="#729c50" strokeWidth="2.5" />
          <circle cx="66" cy="170" r="4.5" fill="#F6D77A" stroke="#E0B538" strokeWidth="1.5" />

          {/* Right Strap */}
          <rect x="126" y="130" width="16" height="50" rx="5" fill="#A8C98B" stroke="#729c50" strokeWidth="2.5" />
          <circle cx="134" cy="170" r="4.5" fill="#F6D77A" stroke="#E0B538" strokeWidth="1.5" />

          {/* Front Center Pocket with Heart */}
          <rect x="80" y="180" width="40" height="32" rx="8" fill="#EFF7E9" stroke="#729c50" strokeWidth="2" />
          <path d="M 100 198 L 96 193 A 3 3 0 0 1 100 189 A 3 3 0 0 1 104 193 Z" fill="#F27A8A" />
        </g>

        {/* Bear Arms / Hands */}
        {/* Left Arm */}
        <ellipse cx="36" cy="170" rx="18" ry="32" transform="rotate(25 36 170)" fill="#CE8F58" stroke="#A36B3B" strokeWidth="3" />
        {/* Right Arm waving */}
        <ellipse cx="164" cy="160" rx="18" ry="32" transform="rotate(-35 164 160)" fill="#CE8F58" stroke="#A36B3B" strokeWidth="3" />

        {/* Bear Head */}
        <ellipse cx="100" cy="85" rx="60" ry="52" fill="url(#bearBodyGrad)" stroke="#A36B3B" strokeWidth="3.5" />

        {/* Snout */}
        <ellipse cx="100" cy="98" rx="26" ry="20" fill="#FFF9F2" stroke="#EFE6DA" strokeWidth="2" />
        {/* Nose */}
        <ellipse cx="100" cy="88" rx="10" ry="7" fill="#193653" />
        {/* Mouth */}
        <path d="M 92 100 Q 100 110 108 100" stroke="#193653" strokeWidth="3" strokeLinecap="round" fill="none" />
        <line x1="100" y1="95" x2="100" y2="102" stroke="#193653" strokeWidth="2.5" />

        {/* Eyes (Cute black glossy circles) */}
        <circle cx="76" cy="74" r="7" fill="#193653" />
        <circle cx="79" cy="71" r="2.5" fill="#FFFFFF" />
        <circle cx="124" cy="74" r="7" fill="#193653" />
        <circle cx="127" cy="71" r="2.5" fill="#FFFFFF" />

        {/* Rosy Cheeks */}
        <ellipse cx="64" cy="90" rx="9" ry="6" fill="#F27A8A" fillOpacity="0.5" />
        <ellipse cx="136" cy="90" rx="9" ry="6" fill="#F27A8A" fillOpacity="0.5" />
      </g>
    </svg>
  );
}

/**
 * Hot Air Balloon Mascot for Footer (Little Nest style)
 */
export function HotAirBalloonIllustration({ className = 'w-24 h-36' }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 160" fill="none" xmlns="http://www.w3.org/2000/svg" className={`${className} animate-float select-none`}>
      {/* Balloon Envelope - 5 distinct pastel slices */}
      <defs>
        <clipPath id="balloonClip">
          <path d="M 60 10 C 25 10 12 38 18 72 C 24 95 50 110 54 112 L 66 112 C 70 110 96 95 102 72 C 108 38 95 10 60 10 Z" />
        </clipPath>
      </defs>

      {/* Main outer envelope with outline */}
      <path
        d="M 60 10 C 25 10 12 38 18 72 C 24 95 50 110 54 112 L 66 112 C 70 110 96 95 102 72 C 108 38 95 10 60 10 Z"
        fill="#FFF9F0"
        stroke="#475569"
        strokeWidth="2"
      />

      {/* Clipped colored vertical panels */}
      <g clipPath="url(#balloonClip)">
        {/* Leftmost panel - Soft Pink */}
        <path d="M 60 10 C 35 15 20 45 18 72 C 20 90 35 105 54 112 L 18 112 L 18 10 Z" fill="#F8A3AF" stroke="#475569" strokeWidth="1.2" />
        {/* Next panel - Pastel Yellow */}
        <path d="M 60 10 C 45 20 38 50 40 80 C 42 98 52 108 55 112 L 35 112 L 35 10 Z" fill="#FDE68A" stroke="#475569" strokeWidth="1.2" />
        {/* Center panel - Warm Cream */}
        <path d="M 60 10 C 52 35 52 85 57 112 L 63 112 C 68 85 68 35 60 10 Z" fill="#FFFDF9" stroke="#475569" strokeWidth="1.2" />
        {/* Next panel - Mint Green */}
        <path d="M 60 10 C 75 20 82 50 80 80 C 78 98 68 108 65 112 L 85 112 L 85 10 Z" fill="#BBF7D0" stroke="#475569" strokeWidth="1.2" />
        {/* Rightmost panel - Sky Blue */}
        <path d="M 60 10 C 85 15 100 45 102 72 C 100 90 85 105 66 112 L 102 112 L 102 10 Z" fill="#BAE6FD" stroke="#475569" strokeWidth="1.2" />
      </g>

      {/* Ropes attaching basket */}
      <line x1="48" y1="112" x2="45" y2="124" stroke="#475569" strokeWidth="1.5" />
      <line x1="56" y1="112" x2="53" y2="124" stroke="#475569" strokeWidth="1.5" />
      <line x1="64" y1="112" x2="67" y2="124" stroke="#475569" strokeWidth="1.5" />
      <line x1="72" y1="112" x2="75" y2="124" stroke="#475569" strokeWidth="1.5" />

      {/* Smiling Teddy inside basket */}
      <g transform="translate(60, 122)">
        {/* Ears */}
        <circle cx="-6" cy="-4" r="3" fill="#D49B6A" stroke="#475569" strokeWidth="1" />
        <circle cx="6" cy="-4" r="3" fill="#D49B6A" stroke="#475569" strokeWidth="1" />
        {/* Head */}
        <circle cx="0" cy="0" r="7" fill="#E2AA76" stroke="#475569" strokeWidth="1.2" />
        {/* Eyes & Snout */}
        <ellipse cx="0" cy="2" rx="3.5" ry="2.5" fill="#FFFDF9" />
        <circle cx="0" cy="1" r="1" fill="#1E293B" />
        <circle cx="-2.5" cy="-1" r="0.9" fill="#1E293B" />
        <circle cx="2.5" cy="-1" r="0.9" fill="#1E293B" />
        {/* Cheeks */}
        <circle cx="-4" cy="1" r="1.2" fill="#F06277" opacity="0.6" />
        <circle cx="4" cy="1" r="1.2" fill="#F06277" opacity="0.6" />
        {/* Paws on rim */}
        <ellipse cx="-7" cy="4" rx="2.5" ry="2" fill="#E2AA76" stroke="#475569" strokeWidth="0.8" />
        <ellipse cx="7" cy="4" rx="2.5" ry="2" fill="#E2AA76" stroke="#475569" strokeWidth="0.8" />
      </g>

      {/* Wicker Basket */}
      <rect x="42" y="125" width="36" height="20" rx="4" fill="#E0A96D" stroke="#475569" strokeWidth="1.8" />
      {/* Basket weave pattern */}
      <line x1="42" y1="131" x2="78" y2="131" stroke="#BD7E44" strokeWidth="1.2" />
      <line x1="42" y1="138" x2="78" y2="138" stroke="#BD7E44" strokeWidth="1.2" />
      <line x1="51" y1="125" x2="51" y2="145" stroke="#BD7E44" strokeWidth="1.2" />
      <line x1="60" y1="125" x2="60" y2="145" stroke="#BD7E44" strokeWidth="1.2" />
      <line x1="69" y1="125" x2="69" y2="145" stroke="#BD7E44" strokeWidth="1.2" />

      {/* Fluffy white cloud at the base */}
      <g transform="translate(15, 136)" filter="drop-shadow(0 2px 4px rgba(0,0,0,0.05))">
        <path
          d="M 12 18 Q 0 18 0 10 Q 0 2 10 3 Q 15 -4 28 0 Q 40 -6 50 2 Q 62 -2 65 8 Q 74 6 72 16 Q 72 20 60 20 Z"
          fill="#FFFFFF"
          stroke="#E2E8F0"
          strokeWidth="1.2"
        />
      </g>
    </svg>
  );
}

/**
 * Floating Kawaii Decorative Shapes (Stars, Dots, Hearts)
 */
export function FloatingPastelDecorations() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden select-none" aria-hidden="true">
      {/* Top Left Yellow Star */}
      <div className="absolute top-10 left-[8%] animate-twinkle">
        <svg viewBox="0 0 24 24" fill="#F6D77A" className="w-5 h-5 opacity-75">
          <path d="M12 2l2.4 7.4h7.6l-6.2 4.5 2.4 7.4-6.2-4.5-6.2 4.5 2.4-7.4-6.2-4.5h7.6z" />
        </svg>
      </div>

      {/* Top Right Coral Heart */}
      <div className="absolute top-14 right-[12%] animate-float">
        <svg viewBox="0 0 24 24" fill="#F27A8A" className="w-4 h-4 opacity-60">
          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
        </svg>
      </div>

      {/* Mid Left Sky Blue Sparkle */}
      <div className="absolute top-1/2 left-[4%] animate-twinkle">
        <svg viewBox="0 0 24 24" fill="#8FD3E8" className="w-4 h-4 opacity-70">
          <path d="M12 0l3 9 9 3-9 3-3 9-3-9-9-3 9-3z" />
        </svg>
      </div>

      {/* Bottom Right Sage Green Dot */}
      <div className="absolute bottom-16 right-[6%] w-3 h-3 rounded-full bg-[#A8C98B] opacity-60 animate-float-slow" />
    </div>
  );
}

/**
 * Cute Sitting Teddy Bear with Pink Bow Tie for Nav & Drawer Menus
 */
export function CuteSittingTeddyIllustration({ className = 'w-28 h-28' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 160 160"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`${className} select-none`}
    >
      <defs>
        <linearGradient id="teddyWarmGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#F5D0A9" />
          <stop offset="100%" stopColor="#DE9E66" />
        </linearGradient>
        <linearGradient id="grassGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#A8C98B" />
          <stop offset="100%" stopColor="#82AD60" />
        </linearGradient>
      </defs>

      {/* Grassy floor base with sprouts */}
      <ellipse cx="80" cy="148" rx="65" ry="10" fill="#E8F4E1" />
      <g transform="translate(10, 130)">
        <path d="M 12 18 Q 16 6 22 2 Q 22 10 18 20 Z" fill="url(#grassGrad)" />
        <path d="M 20 19 Q 28 8 36 6 Q 32 14 26 21 Z" fill="url(#grassGrad)" />
        <circle cx="28" cy="8" r="2.5" fill="#F27A8A" />
      </g>
      <g transform="translate(115, 132)">
        <path d="M 8 16 Q 16 4 22 2 Q 19 12 14 18 Z" fill="url(#grassGrad)" />
        <circle cx="22" cy="4" r="2" fill="#F6D77A" />
      </g>

      {/* Bear Back / Body */}
      {/* Left Foot */}
      <g>
        <ellipse cx="44" cy="132" rx="18" ry="13" transform="rotate(-15 44 132)" fill="#DE9E66" stroke="#B87B4A" strokeWidth="2" />
        <ellipse cx="44" cy="132" rx="11" ry="8" transform="rotate(-15 44 132)" fill="#FFF5EB" />
        <circle cx="39" cy="125" r="2" fill="#DE9E66" />
        <circle cx="45" cy="123" r="2" fill="#DE9E66" />
        <circle cx="51" cy="125" r="2" fill="#DE9E66" />
      </g>

      {/* Right Foot */}
      <g>
        <ellipse cx="116" cy="132" rx="18" ry="13" transform="rotate(15 116 132)" fill="#DE9E66" stroke="#B87B4A" strokeWidth="2" />
        <ellipse cx="116" cy="132" rx="11" ry="8" transform="rotate(15 116 132)" fill="#FFF5EB" />
        <circle cx="121" cy="125" r="2" fill="#DE9E66" />
        <circle cx="115" cy="123" r="2" fill="#DE9E66" />
        <circle cx="109" cy="125" r="2" fill="#DE9E66" />
      </g>

      {/* Bear Tummy */}
      <ellipse cx="80" cy="106" rx="34" ry="32" fill="url(#teddyWarmGrad)" stroke="#B87B4A" strokeWidth="2.5" />
      <ellipse cx="80" cy="108" rx="20" ry="20" fill="#FFF5EB" />

      {/* Bear Left Paw */}
      <ellipse cx="52" cy="104" rx="10" ry="16" transform="rotate(25 52 104)" fill="#DE9E66" stroke="#B87B4A" strokeWidth="2" />
      {/* Bear Right Paw */}
      <ellipse cx="108" cy="104" rx="10" ry="16" transform="rotate(-25 108 104)" fill="#DE9E66" stroke="#B87B4A" strokeWidth="2" />

      {/* Left Ear */}
      <circle cx="48" cy="38" r="16" fill="#DE9E66" stroke="#B87B4A" strokeWidth="2" />
      <circle cx="48" cy="38" r="9" fill="#FFD6E0" />

      {/* Right Ear */}
      <circle cx="112" cy="38" r="16" fill="#DE9E66" stroke="#B87B4A" strokeWidth="2" />
      <circle cx="112" cy="38" r="9" fill="#FFD6E0" />

      {/* Bear Head */}
      <ellipse cx="80" cy="62" rx="40" ry="34" fill="url(#teddyWarmGrad)" stroke="#B87B4A" strokeWidth="2.5" />

      {/* Snout */}
      <ellipse cx="80" cy="71" rx="17" ry="13" fill="#FFF8F0" stroke="#EFE4D6" strokeWidth="1.5" />
      {/* Nose */}
      <ellipse cx="80" cy="65" rx="6" ry="4" fill="#2E2016" />
      {/* Mouth */}
      <path d="M 74 72 Q 80 77 86 72" stroke="#2E2016" strokeWidth="2" strokeLinecap="round" fill="none" />
      <line x1="80" y1="69" x2="80" y2="73" stroke="#2E2016" strokeWidth="1.5" />

      {/* Eyes */}
      <circle cx="63" cy="56" r="4.5" fill="#2E2016" />
      <circle cx="65" cy="54" r="1.5" fill="#FFFFFF" />
      <circle cx="97" cy="56" r="4.5" fill="#2E2016" />
      <circle cx="99" cy="54" r="1.5" fill="#FFFFFF" />

      {/* Rosy Cheeks */}
      <circle cx="56" cy="67" r="5.5" fill="#F27A8A" fillOpacity="0.45" />
      <circle cx="104" cy="67" r="5.5" fill="#F27A8A" fillOpacity="0.45" />

      {/* Cute Pink Ribbon Bow Tie at Neck */}
      <g transform="translate(80, 87)">
        {/* Left Bow Loop */}
        <path d="M 0 0 C -8 -6 -14 -4 -12 2 C -10 7 -4 3 0 0 Z" fill="#F27A8A" stroke="#E05B6E" strokeWidth="1.2" />
        {/* Right Bow Loop */}
        <path d="M 0 0 C 8 -6 14 -4 12 2 C 10 7 4 3 0 0 Z" fill="#F27A8A" stroke="#E05B6E" strokeWidth="1.2" />
        {/* Bow Center Knot */}
        <circle cx="0" cy="0" r="3" fill="#F8A3AF" stroke="#E05B6E" strokeWidth="1.2" />
        {/* Ribbon Tails */}
        <path d="M -2 2 L -5 8 L -2 7 L 0 3" fill="#F27A8A" />
        <path d="M 2 2 L 5 8 L 2 7 L 0 3" fill="#F27A8A" />
      </g>
    </svg>
  );
}


/**
 * WavyDivider — smooth organic wave SVG used between homepage sections.
 * topColor: the section above, bottomColor: the section below.
 * Flip vertically with className="rotate-180" when needed.
 */
export function WavyDivider({
  topColor = '#FFFEFA',
  bottomColor = '#FFFBF5',
  className = '',
}: {
  topColor?: string;
  bottomColor?: string;
  className?: string;
}) {
  return (
    <div className={`w-full overflow-hidden leading-none ${className}`} style={{ background: topColor }} aria-hidden="true">
      <svg
        viewBox="0 0 1440 56"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full block"
        preserveAspectRatio="none"
        style={{ height: '40px' }}
      >
        <path
          d="M0 28 C180 56 360 0 540 28 C720 56 900 0 1080 28 C1260 56 1380 14 1440 28 L1440 56 L0 56 Z"
          fill={bottomColor}
        />
      </svg>
    </div>
  );
}

/**
 * ScallopDivider — tighter scalloped/cloud-bump wave for section breaks.
 */
export function ScallopDivider({
  topColor = '#ffffff',
  bottomColor = '#FFFBF5',
  className = '',
}: {
  topColor?: string;
  bottomColor?: string;
  className?: string;
}) {
  return (
    <div className={`w-full overflow-hidden leading-none ${className}`} style={{ background: topColor }} aria-hidden="true">
      <svg
        viewBox="0 0 1440 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full block"
        preserveAspectRatio="none"
        style={{ height: '36px' }}
      >
        <path
          d="M0 0 Q 36 48 72 0 Q 108 48 144 0 Q 180 48 216 0 Q 252 48 288 0 Q 324 48 360 0 Q 396 48 432 0 Q 468 48 504 0 Q 540 48 576 0 Q 612 48 648 0 Q 684 48 720 0 Q 756 48 792 0 Q 828 48 864 0 Q 900 48 936 0 Q 972 48 1008 0 Q 1044 48 1080 0 Q 1116 48 1152 0 Q 1188 48 1224 0 Q 1260 48 1296 0 Q 1332 48 1368 0 Q 1404 48 1440 0 L1440 48 L0 48 Z"
          fill={bottomColor}
        />
      </svg>
    </div>
  );
}

/**
 * FooterGiraffe — cute smiling cartoon giraffe sitting in the footer corner.
 * Matches Little Nest reference: golden yellow coat, warm caramel spots, soft expressions.
 */
export function FooterGiraffe({ className = 'w-24 h-36' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 120 180"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`${className} select-none animate-float`}
      aria-hidden="true"
    >
      {/* Tail with tuft */}
      <path d="M 72 148 Q 88 155 82 168 Q 86 162 92 164" stroke="#F5D278" strokeWidth="3" strokeLinecap="round" fill="none" />
      <circle cx="93" cy="165" r="3.5" fill="#BD7E44" />

      {/* Back legs */}
      <rect x="60" y="128" width="11" height="38" rx="5" fill="#F5D278" stroke="#D4A745" strokeWidth="1.5" />
      <rect x="74" y="128" width="11" height="38" rx="5" fill="#F5D278" stroke="#D4A745" strokeWidth="1.5" />
      {/* Front legs */}
      <rect x="30" y="110" width="11" height="44" rx="5" fill="#F5D278" stroke="#D4A745" strokeWidth="1.5" />
      <rect x="44" y="110" width="11" height="44" rx="5" fill="#F5D278" stroke="#D4A745" strokeWidth="1.5" />
      {/* Hooves */}
      <rect x="29" y="150" width="13" height="8" rx="4" fill="#8C5320" />
      <rect x="43" y="150" width="13" height="8" rx="4" fill="#8C5320" />
      <rect x="59" y="162" width="13" height="8" rx="4" fill="#8C5320" />
      <rect x="73" y="162" width="13" height="8" rx="4" fill="#8C5320" />

      {/* Body */}
      <ellipse cx="55" cy="118" rx="30" ry="24" fill="#F5D278" stroke="#D4A745" strokeWidth="2" />
      {/* Body spots (Caramel Brown) */}
      <ellipse cx="44" cy="110" rx="6" ry="4" transform="rotate(-20 44 110)" fill="#BD7E44" />
      <ellipse cx="62" cy="120" rx="5.5" ry="4.5" fill="#BD7E44" />
      <ellipse cx="50" cy="128" rx="4.5" ry="3.5" transform="rotate(15 50 128)" fill="#BD7E44" />
      <ellipse cx="70" cy="112" rx="4" ry="3" fill="#BD7E44" />

      {/* Neck */}
      <path d="M 42 96 Q 38 60 44 30" stroke="#F5D278" strokeWidth="18" strokeLinecap="round" fill="none" />
      <path d="M 42 96 Q 38 60 44 30" stroke="#D4A745" strokeWidth="18" strokeLinecap="round" fill="none" strokeOpacity="0.25" />
      {/* Neck spots */}
      <ellipse cx="40" cy="74" rx="4" ry="3" transform="rotate(-10 40 74)" fill="#BD7E44" />
      <ellipse cx="43" cy="54" rx="3.5" ry="3" transform="rotate(5 43 54)" fill="#BD7E44" />
      <ellipse cx="41" cy="38" rx="3" ry="2.5" fill="#BD7E44" />

      {/* Ossicones (horns) */}
      <rect x="44" y="14" width="5" height="12" rx="2.5" fill="#D4A745" stroke="#8C5320" strokeWidth="1" />
      <circle cx="46.5" cy="13" r="3.5" fill="#8C5320" />
      <rect x="56" y="16" width="5" height="10" rx="2.5" fill="#D4A745" stroke="#8C5320" strokeWidth="1" />
      <circle cx="58.5" cy="15" r="3.5" fill="#8C5320" />

      {/* Head */}
      <ellipse cx="52" cy="30" rx="18" ry="15" fill="#F5D278" stroke="#D4A745" strokeWidth="2" />
      {/* Snout */}
      <ellipse cx="62" cy="35" rx="10" ry="7" fill="#FFF8E7" stroke="#D4A745" strokeWidth="1.2" />
      {/* Nostrils */}
      <circle cx="60" cy="36" r="1.2" fill="#8C5320" />
      <circle cx="65" cy="36" r="1.2" fill="#8C5320" />
      {/* Eyes */}
      <circle cx="46" cy="27" r="3.5" fill="#1E293B" />
      <circle cx="47.5" cy="25.5" r="1.2" fill="white" />
      {/* Long eyelash */}
      <path d="M 43 24 Q 45 21 48 23" stroke="#1E293B" strokeWidth="1.5" strokeLinecap="round" fill="none" />
      {/* Rosy cheek */}
      <circle cx="41" cy="32" r="4.5" fill="#F06277" fillOpacity="0.5" />
      {/* Smile */}
      <path d="M 57 38 Q 62 42 67 38" stroke="#8C5320" strokeWidth="1.5" strokeLinecap="round" fill="none" />

      {/* Mane along neck */}
      <path d="M 44 26 Q 40 18 42 10 Q 44 16 46 12 Q 47 18 49 14 Q 50 20 52 16 Q 52 22 54 19" stroke="#BD7E44" strokeWidth="3.5" strokeLinecap="round" fill="none" />

      {/* Small flowers near feet */}
      <circle cx="18" cy="168" r="4" fill="#F06277" />
      <circle cx="18" cy="168" r="1.8" fill="#FFF9F0" />
      <circle cx="106" cy="170" r="3.5" fill="#FDE68A" />
      <circle cx="106" cy="170" r="1.5" fill="#FFF9F0" />
    </svg>
  );
}

/**
 * SmallCloudAccent — a single puffy cloud shape for hero decoration.
 */
export function SmallCloudAccent({ className = 'w-20 h-10' }: { className?: string }) {
  return (
    <svg viewBox="0 0 80 40" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} aria-hidden="true">
      <path
        d="M 10 32 Q 0 32 0 24 Q 0 14 10 13 Q 14 4 24 6 Q 32 0 44 5 Q 56 0 64 10 Q 78 10 78 22 Q 80 32 64 32 Z"
        fill="white"
        fillOpacity="0.85"
      />
    </svg>
  );
}

/**
 * LeafSprigAccent — small decorative leaf sprig for corner/hero accents.
 */
export function LeafSprigAccent({ className = 'w-10 h-10' }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} aria-hidden="true">
      <path d="M 20 38 Q 20 20 20 10" stroke="#A8C98B" strokeWidth="2.5" strokeLinecap="round" fill="none" />
      <ellipse cx="12" cy="22" rx="9" ry="5" transform="rotate(-35 12 22)" fill="#A8C98B" fillOpacity="0.7" />
      <ellipse cx="28" cy="18" rx="9" ry="5" transform="rotate(35 28 18)" fill="#A8C98B" fillOpacity="0.7" />
      <ellipse cx="16" cy="12" rx="7" ry="4" transform="rotate(-15 16 12)" fill="#A8C98B" fillOpacity="0.5" />
    </svg>
  );
}

/**
 * Animate Bob keyframe — gentle up-down bobbing motion.
 */
export const animateBobCSS = `
@keyframes gentleBob {
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-4px);
  }
}

.animate-bob {
  animation: gentleBob 3.5s ease-in-out infinite;
}
`;

/**
 * HeroGroundShape — warm sand/ground-colored wave at bottom of hero with decorative bushes/flowers
 */
export function HeroGroundShape({ className = '' }: { className?: string }) {
  return (
    <div className={`absolute bottom-0 left-0 right-0 pointer-events-none select-none ${className}`} aria-hidden="true">
      {/* Warm sand/ground wave */}
      <svg
        viewBox="0 0 1440 120"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full"
        preserveAspectRatio="none"
      >
        <path
          d="M0 40 C240 80 480 20 720 50 C960 80 1200 30 1440 60 L1440 120 L0 120 Z"
          fill="#E8DCC8"
        />
      </svg>
      
      {/* Small bush/flower decorations sitting on the ground */}
      {/* Left bush cluster */}
      <div className="absolute bottom-2 left-[8%] hidden sm:block">
        <svg viewBox="0 0 60 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-12 h-8">
          {/* Bush leaves */}
          <circle cx="15" cy="28" r="12" fill="#A8C98B" opacity="0.8" />
          <circle cx="28" cy="25" r="14" fill="#A8C98B" opacity="0.85" />
          <circle cx="42" cy="28" r="11" fill="#A8C98B" opacity="0.75" />
          {/* Small flowers */}
          <circle cx="18" cy="20" r="3" fill="#F27A8A" opacity="0.9" />
          <circle cx="18" cy="20" r="1.5" fill="#FFF9F2" />
          <circle cx="38" cy="22" r="2.5" fill="#F6D77A" opacity="0.9" />
          <circle cx="38" cy="22" r="1.2" fill="#FFF9F2" />
        </svg>
      </div>

      {/* Right bush cluster */}
      <div className="absolute bottom-3 right-[10%] hidden md:block">
        <svg viewBox="0 0 50 35" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-10 h-7">
          {/* Bush leaves */}
          <circle cx="12" cy="24" r="10" fill="#A8C98B" opacity="0.75" />
          <circle cx="25" cy="22" r="12" fill="#A8C98B" opacity="0.8" />
          <circle cx="38" cy="25" r="9" fill="#A8C98B" opacity="0.7" />
          {/* Small flower */}
          <circle cx="25" cy="16" r="2.5" fill="#8FD3E8" opacity="0.9" />
          <circle cx="25" cy="16" r="1.2" fill="#FFF9F2" />
        </svg>
      </div>

      {/* Center-left small flower */}
      <div className="absolute bottom-4 left-[25%] hidden lg:block">
        <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-5 h-5">
          <circle cx="10" cy="10" r="4" fill="#F27A8A" opacity="0.8" />
          <circle cx="10" cy="10" r="2" fill="#FFF9F2" />
          <circle cx="10" cy="16" r="1.5" fill="#A8C98B" opacity="0.6" />
        </svg>
      </div>

      {/* Center-right grass tuft */}
      <div className="absolute bottom-2 right-[28%] hidden lg:block">
        <svg viewBox="0 0 30 25" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-6 h-5">
          <path d="M 8 25 Q 12 10 16 5" stroke="#A8C98B" strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.7" />
          <path d="M 14 25 Q 18 12 22 6" stroke="#A8C98B" strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.6" />
          <path d="M 4 25 Q 8 15 10 8" stroke="#A8C98B" strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.5" />
        </svg>
      </div>
    </div>
  );
}

/**
 * Enhanced FloatingPastelDecorations — richer set of hero background accents.
 * Clouds, stars, hearts, leaf sprigs — all pointer-events-none, aria-hidden.
 */
export function FloatingPastelDecorationsEnhanced() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden select-none" aria-hidden="true">
      {/* Top-left large cloud */}
      <div className="absolute top-6 left-[-2%] opacity-70 motion-safe:animate-float-slow hidden sm:block">
        <SmallCloudAccent className="w-32 h-16" />
      </div>
      {/* Top-right small cloud */}
      <div className="absolute top-4 right-[8%] opacity-60 motion-safe:animate-float" style={{ animationDelay: '1.2s' }}>
        <SmallCloudAccent className="w-20 h-10" />
      </div>
      {/* Upper-left yellow star */}
      <div className="absolute top-8 left-[6%] motion-safe:animate-twinkle" style={{ animationDelay: '0.3s' }}>
        <svg viewBox="0 0 24 24" fill="#F6D77A" className="w-5 h-5 opacity-80">
          <path d="M12 2l2.4 7.4h7.6l-6.2 4.5 2.4 7.4-6.2-4.5-6.2 4.5 2.4-7.4-6.2-4.5h7.6z" />
        </svg>
      </div>
      {/* Upper-right coral heart */}
      <div className="absolute top-12 right-[10%] motion-safe:animate-float" style={{ animationDelay: '0.8s' }}>
        <svg viewBox="0 0 24 24" fill="#F27A8A" className="w-4 h-4 opacity-55">
          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
        </svg>
      </div>
      {/* Mid-left sky-blue sparkle */}
      <div className="absolute top-1/2 left-[3%] motion-safe:animate-twinkle" style={{ animationDelay: '1.5s' }}>
        <svg viewBox="0 0 24 24" fill="#8FD3E8" className="w-4 h-4 opacity-65">
          <path d="M12 0l3 9 9 3-9 3-3 9-3-9-9-3 9-3z" />
        </svg>
      </div>
      {/* Left leaf sprig */}
      <div className="absolute bottom-24 left-[2%] opacity-50 motion-safe:animate-float-slow hidden md:block" style={{ animationDelay: '2s' }}>
        <LeafSprigAccent className="w-10 h-10" />
      </div>
      {/* Right leaf sprig */}
      <div className="absolute bottom-20 right-[3%] opacity-45 motion-safe:animate-float hidden md:block" style={{ animationDelay: '0.6s' }}>
        <LeafSprigAccent className="w-8 h-8" />
      </div>
      {/* Bottom-right sage dot */}
      <div className="absolute bottom-16 right-[5%] w-3 h-3 rounded-full bg-[#A8C98B] opacity-55 motion-safe:animate-float-slow" style={{ animationDelay: '1s' }} />
      {/* Bottom-left yellow dot */}
      <div className="absolute bottom-28 left-[8%] w-2.5 h-2.5 rounded-full bg-[#F6D77A] opacity-60 motion-safe:animate-twinkle" style={{ animationDelay: '0.4s' }} />
      {/* Small pink heart bottom-center-right */}
      <div className="absolute bottom-10 right-[18%] motion-safe:animate-float" style={{ animationDelay: '1.8s' }}>
        <svg viewBox="0 0 20 20" fill="#F27A8A" className="w-3 h-3 opacity-40">
          <path d="M10 17.5l-1.2-1.1C4.5 12.8 2 10.5 2 7.5 2 5.2 3.7 3.5 6 3.5c1.4 0 2.8.7 4 1.9C11.2 4.2 12.6 3.5 14 3.5c2.3 0 4 1.7 4 4 0 3-2.5 5.3-6.8 8.9L10 17.5z" />
        </svg>
      </div>
    </div>
  );
}
