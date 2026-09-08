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
 * Hot Air Balloon Mascot for Footer
 */
export function HotAirBalloonIllustration({ className = 'w-24 h-36' }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 140" fill="none" xmlns="http://www.w3.org/2000/svg" className={`${className} animate-float`}>
      {/* Balloon Envelope */}
      <path
        d="M 50 10 C 20 10 10 35 15 65 C 20 85 42 100 46 102 L 54 102 C 58 100 80 85 85 65 C 90 35 80 10 50 10 Z"
        fill="#FDE8EB"
        stroke="#F27A8A"
        strokeWidth="2.5"
      />
      {/* Vertical Stripes */}
      <path d="M 50 10 C 36 30 36 80 48 102" stroke="#8FD3E8" strokeWidth="8" fill="none" />
      <path d="M 50 10 C 64 30 64 80 52 102" stroke="#F6D77A" strokeWidth="8" fill="none" />
      <path d="M 50 10 L 50 102" stroke="#F27A8A" strokeWidth="3" fill="none" />

      {/* Ropes */}
      <line x1="42" y1="102" x2="40" y2="114" stroke="#193653" strokeWidth="1.5" />
      <line x1="58" y1="102" x2="60" y2="114" stroke="#193653" strokeWidth="1.5" />

      {/* Basket */}
      <rect x="36" y="114" width="28" height="18" rx="4" fill="#A8C98B" stroke="#729c50" strokeWidth="2" />
      {/* Smiling Teddy Inside Basket */}
      <circle cx="50" cy="112" r="7" fill="#E2AA76" />
      <circle cx="48" cy="111" r="1" fill="#193653" />
      <circle cx="52" cy="111" r="1" fill="#193653" />
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

