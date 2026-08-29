'use client';

import React from 'react';

// ============================================================================
// 1. CUTE TEDDY BEAR LOGO ICON (For Header & Branding)
// ============================================================================
export function CuteTeddyLogo({ className = 'w-9 h-9' }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      {/* Ears */}
      <circle cx="22" cy="28" r="16" fill="#D99B6A" stroke="#2D3748" strokeWidth="3.5" />
      <circle cx="22" cy="28" r="9" fill="#FFCCD7" />
      <circle cx="78" cy="28" r="16" fill="#D99B6A" stroke="#2D3748" strokeWidth="3.5" />
      <circle cx="78" cy="28" r="9" fill="#FFCCD7" />
      
      {/* Head */}
      <circle cx="50" cy="52" r="38" fill="#E8B07D" stroke="#2D3748" strokeWidth="3.5" />
      
      {/* Cheeks */}
      <ellipse cx="28" cy="62" rx="7" ry="4.5" fill="#FF8DA1" opacity="0.6" />
      <ellipse cx="72" cy="62" rx="7" ry="4.5" fill="#FF8DA1" opacity="0.6" />
      
      {/* Snout */}
      <ellipse cx="50" cy="64" rx="16" ry="12" fill="#FDF3E7" stroke="#2D3748" strokeWidth="2.5" />
      <path d="M44 59 Q50 54 56 59 Q50 66 44 59 Z" fill="#4A3427" />
      <path d="M50 63 L50 69" stroke="#4A3427" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M45 68 Q50 72 55 68" stroke="#4A3427" strokeWidth="2.5" strokeLinecap="round" fill="none" />
      
      {/* Eyes */}
      <ellipse cx="36" cy="48" rx="4.5" ry="6" fill="#2D3748" />
      <circle cx="34.5" cy="46" r="2" fill="#FFFFFF" />
      <ellipse cx="64" cy="48" rx="4.5" ry="6" fill="#2D3748" />
      <circle cx="62.5" cy="46" r="2" fill="#FFFFFF" />
      
      {/* Cute Head Tuft / Hair */}
      <path d="M46 16 Q50 11 54 16" stroke="#D99B6A" strokeWidth="3.5" strokeLinecap="round" />
    </svg>
  );
}

// ============================================================================
// 2. HERO CARTOON: TEDDY BEAR & PENGUIN UNDER PASTEL RAINBOW WITH SIGN
// ============================================================================
export function HeroCharactersIllustration({ className = 'w-full max-w-lg' }: { className?: string }) {
  return (
    <div className={`relative ${className}`}>
      <svg viewBox="0 0 600 480" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto drop-shadow-sm">
        <defs>
          <filter id="softGlow" x="-10%" y="-10%" width="120%" height="120%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* ----------------- PASTEL RAINBOW ----------------- */}
        <g opacity="0.92">
          {/* Lavender Outer Ring */}
          <path d="M 120 360 A 200 200 0 0 1 520 360" stroke="#DDD6FE" strokeWidth="18" strokeLinecap="round" fill="none" />
          {/* Sky Blue */}
          <path d="M 138 360 A 182 182 0 0 1 502 360" stroke="#BAE6FD" strokeWidth="18" strokeLinecap="round" fill="none" />
          {/* Mint Green */}
          <path d="M 156 360 A 164 164 0 0 1 484 360" stroke="#A7F3D0" strokeWidth="18" strokeLinecap="round" fill="none" />
          {/* Butter Yellow */}
          <path d="M 174 360 A 146 146 0 0 1 466 360" stroke="#FDE68A" strokeWidth="18" strokeLinecap="round" fill="none" />
          {/* Strawberry Pink Inner */}
          <path d="M 192 360 A 128 128 0 0 1 448 360" stroke="#FECDD3" strokeWidth="18" strokeLinecap="round" fill="none" />
        </g>

        {/* ----------------- CLOUDS AT RAINBOW BASES ----------------- */}
        {/* Left Rainbow Cloud */}
        <g fill="#FFFFFF" stroke="#EFE7DE" strokeWidth="2.5">
          <circle cx="120" cy="350" r="32" />
          <circle cx="150" cy="335" r="28" />
          <circle cx="175" cy="355" r="26" />
          <rect x="100" y="350" width="95" height="25" fill="#FFFFFF" stroke="none" />
        </g>

        {/* Right Rainbow Cloud with Star */}
        <g fill="#FFFFFF" stroke="#EFE7DE" strokeWidth="2.5">
          <circle cx="475" cy="345" r="34" />
          <circle cx="510" cy="330" r="30" />
          <circle cx="540" cy="350" r="28" />
          <rect x="455" y="345" width="105" height="25" fill="#FFFFFF" stroke="none" />
        </g>

        {/* Smiling Star on Top Right of Rainbow */}
        <g transform="translate(460, 80)" className="animate-wiggle origin-center">
          <path d="M25 0 L32 15 L49 17 L36 30 L40 47 L25 38 L9 47 L13 30 L1 17 L17 15 Z" fill="#FDE047" stroke="#EAB308" strokeWidth="2.5" strokeLinejoin="round" />
          {/* Star Face */}
          <circle cx="20" cy="22" r="2.2" fill="#2D3748" />
          <circle cx="30" cy="22" r="2.2" fill="#2D3748" />
          <ellipse cx="16" cy="27" rx="3" ry="2" fill="#FF8DA1" opacity="0.7" />
          <ellipse cx="34" cy="27" rx="3" ry="2" fill="#FF8DA1" opacity="0.7" />
          <path d="M22 28 Q25 33 28 28" stroke="#2D3748" strokeWidth="2" strokeLinecap="round" fill="none" />
        </g>

        {/* ----------------- SOFT GREEN MOUND / GROUND ----------------- */}
        <path d="M 20 440 Q 300 370 580 440 L 580 480 L 20 480 Z" fill="#E8F5E9" />
        <path d="M 0 455 Q 300 405 600 455 L 600 480 L 0 480 Z" fill="#D9F0D6" />

        {/* ----------------- TEDDY BEAR (LEFT/CENTER) ----------------- */}
        <g id="teddy-bear" transform="translate(180, 160)">
          {/* Left Ear */}
          <circle cx="35" cy="45" r="24" fill="#D99B6A" stroke="#2D3748" strokeWidth="4" />
          <circle cx="35" cy="45" r="13" fill="#FFCCD7" />
          
          {/* Right Ear */}
          <circle cx="135" cy="45" r="24" fill="#D99B6A" stroke="#2D3748" strokeWidth="4" />
          <circle cx="135" cy="45" r="13" fill="#FFCCD7" />

          {/* Body */}
          <ellipse cx="85" cy="185" rx="55" ry="60" fill="#E8B07D" stroke="#2D3748" strokeWidth="4" />

          {/* Teal Dungarees Pants / Overalls */}
          <path d="M 40 185 Q 85 175 130 185 L 135 240 Q 85 250 35 240 Z" fill="#4E9F97" stroke="#2D3748" strokeWidth="4" />
          {/* Straps */}
          <path d="M 52 145 L 56 195" stroke="#4E9F97" strokeWidth="14" strokeLinecap="round" />
          <path d="M 52 145 L 56 195" stroke="#2D3748" strokeWidth="3" strokeLinecap="round" fill="none" />
          <circle cx="56" cy="192" r="4.5" fill="#FEF3C7" stroke="#2D3748" strokeWidth="2" />

          <path d="M 118 145 L 114 195" stroke="#4E9F97" strokeWidth="14" strokeLinecap="round" />
          <path d="M 118 145 L 114 195" stroke="#2D3748" strokeWidth="3" strokeLinecap="round" fill="none" />
          <circle cx="114" cy="192" r="4.5" fill="#FEF3C7" stroke="#2D3748" strokeWidth="2" />
          
          {/* Dungaree Center Pocket */}
          <rect x="70" y="195" width="30" height="24" rx="6" fill="#3D867F" stroke="#2D3748" strokeWidth="2.5" />
          <path d="M 78 205 Q 85 210 92 205" stroke="#FEF3C7" strokeWidth="2" strokeLinecap="round" fill="none" />

          {/* Feet/Paws */}
          <ellipse cx="40" cy="245" rx="22" ry="16" fill="#D99B6A" stroke="#2D3748" strokeWidth="4" />
          <ellipse cx="40" cy="245" rx="12" ry="8" fill="#FDF3E7" />
          <ellipse cx="130" cy="245" rx="22" ry="16" fill="#D99B6A" stroke="#2D3748" strokeWidth="4" />
          <ellipse cx="130" cy="245" rx="12" ry="8" fill="#FDF3E7" />

          {/* Left Waving Arm */}
          <g className="animate-wiggle origin-bottom-right">
            <path d="M 35 155 Q 0 135 10 105 Q 25 95 40 120 Z" fill="#E8B07D" stroke="#2D3748" strokeWidth="4" />
            <ellipse cx="15" cy="110" rx="10" ry="8" fill="#FDF3E7" />
          </g>

          {/* Right Arm */}
          <path d="M 130 160 Q 155 180 145 205 Q 130 210 125 185 Z" fill="#E8B07D" stroke="#2D3748" strokeWidth="4" />

          {/* Head */}
          <circle cx="85" cy="90" r="54" fill="#E8B07D" stroke="#2D3748" strokeWidth="4" />

          {/* Cheeks */}
          <ellipse cx="50" cy="105" rx="11" ry="7" fill="#FF8DA1" opacity="0.65" />
          <ellipse cx="120" cy="105" rx="11" ry="7" fill="#FF8DA1" opacity="0.65" />

          {/* Snout */}
          <ellipse cx="85" cy="106" rx="24" ry="18" fill="#FDF3E7" stroke="#2D3748" strokeWidth="3" />
          <path d="M 76 98 Q 85 91 94 98 Q 85 108 76 98 Z" fill="#4A3427" />
          <path d="M 85 104 L 85 113" stroke="#4A3427" strokeWidth="3" strokeLinecap="round" />
          <path d="M 77 112 Q 85 118 93 112" stroke="#4A3427" strokeWidth="3" strokeLinecap="round" fill="none" />

          {/* Eyes */}
          <ellipse cx="64" cy="85" rx="6.5" ry="9" fill="#2D3748" />
          <circle cx="62" cy="82" r="3" fill="#FFFFFF" />
          <ellipse cx="106" cy="85" rx="6.5" ry="9" fill="#2D3748" />
          <circle cx="104" cy="82" r="3" fill="#FFFFFF" />
        </g>

        {/* ----------------- PENGUIN HOLDING PINK HEART (RIGHT/CENTER) ----------------- */}
        <g id="penguin" transform="translate(355, 200)">
          {/* Penguin Body (Slate Navy) */}
          <ellipse cx="70" cy="140" rx="50" ry="65" fill="#334155" stroke="#1E293B" strokeWidth="4" />

          {/* Feet (Orange) */}
          <ellipse cx="45" cy="205" rx="16" ry="9" fill="#FB923C" stroke="#2D3748" strokeWidth="3" />
          <ellipse cx="95" cy="205" rx="16" ry="9" fill="#FB923C" stroke="#2D3748" strokeWidth="3" />

          {/* White Belly & Face */}
          <path d="M 38 120 Q 35 185 70 190 Q 105 185 102 120 Q 105 75 70 75 Q 35 75 38 120 Z" fill="#FFFFFF" stroke="#2D3748" strokeWidth="3" />

          {/* Wings */}
          <path d="M 22 125 Q 5 150 25 175" fill="#334155" stroke="#1E293B" strokeWidth="4" />
          <path d="M 118 125 Q 135 150 115 175" fill="#334155" stroke="#1E293B" strokeWidth="4" />

          {/* Eyes (Happy Closed C-curves) */}
          <path d="M 52 108 Q 58 100 64 108" stroke="#1E293B" strokeWidth="3.5" strokeLinecap="round" fill="none" />
          <path d="M 76 108 Q 82 100 88 108" stroke="#1E293B" strokeWidth="3.5" strokeLinecap="round" fill="none" />

          {/* Beak */}
          <path d="M 64 112 Q 70 122 76 112 Z" fill="#F97316" stroke="#2D3748" strokeWidth="2.5" />

          {/* Cheeks */}
          <ellipse cx="45" cy="116" rx="8" ry="5" fill="#FF8DA1" opacity="0.7" />
          <ellipse cx="95" cy="116" rx="8" ry="5" fill="#FF8DA1" opacity="0.7" />

          {/* Penguin Holding Big Pink Heart */}
          <g transform="translate(48, 125) scale(0.9)" className="animate-pulse">
            <path d="M 25 40 C 25 40 0 24 0 10 C 0 -1 12 -4 25 7 C 38 -4 50 -1 50 10 C 50 24 25 40 25 40 Z" fill="#FF6B8B" stroke="#FA5578" strokeWidth="2.5" />
            <ellipse cx="14" cy="10" rx="4" ry="7" fill="#FFA5BA" opacity="0.6" transform="rotate(-30 14 10)" />
          </g>
        </g>

        {/* ----------------- WOODEN SIGNBOARD "100% ORGANIC & SAFE" ----------------- */}
        <g id="wooden-sign" transform="translate(435, 255)">
          {/* Wooden Posts */}
          <rect x="25" y="65" width="10" height="55" rx="3" fill="#A77A53" stroke="#2D3748" strokeWidth="3" />
          <rect x="105" y="65" width="10" height="55" rx="3" fill="#A77A53" stroke="#2D3748" strokeWidth="3" />

          {/* Wooden Board */}
          <rect x="0" y="0" width="140" height="70" rx="14" fill="#E2C19D" stroke="#2D3748" strokeWidth="3.5" />
          <rect x="6" y="6" width="128" height="58" rx="10" fill="#EAD4BD" stroke="#C49B74" strokeWidth="2" strokeDasharray="4 4" />

          {/* Text inside signboard */}
          <text x="70" y="32" textAnchor="middle" fill="#2D3748" fontFamily="Quicksand, Nunito, sans-serif" fontWeight="800" fontSize="13.5">
            100% Organic
          </text>
          <text x="70" y="49" textAnchor="middle" fill="#2D3748" fontFamily="Quicksand, Nunito, sans-serif" fontWeight="800" fontSize="13.5">
            &amp; Safe
          </text>

          {/* Little green grass around posts */}
          <path d="M 18 115 Q 22 100 30 115 Q 36 102 42 115" stroke="#10B981" strokeWidth="3.5" strokeLinecap="round" fill="none" />
          <path d="M 98 115 Q 102 100 110 115 Q 116 102 122 115" stroke="#10B981" strokeWidth="3.5" strokeLinecap="round" fill="none" />
        </g>

        {/* ----------------- LITTLE FLOWERS ON THE GROUND ----------------- */}
        {/* Purple flower */}
        <g transform="translate(90, 395)">
          <path d="M 10 40 Q 12 25 10 15" stroke="#10B981" strokeWidth="3" fill="none" />
          <circle cx="10" cy="12" r="6" fill="#C084FC" />
          <circle cx="10" cy="12" r="2.5" fill="#FEF08A" />
        </g>
        {/* Pink flower */}
        <g transform="translate(135, 415)">
          <path d="M 10 30 Q 8 20 10 12" stroke="#10B981" strokeWidth="3" fill="none" />
          <circle cx="10" cy="10" r="5.5" fill="#F472B6" />
          <circle cx="10" cy="10" r="2.2" fill="#FEF08A" />
        </g>
        {/* Yellow flower right */}
        <g transform="translate(565, 385)">
          <path d="M 10 35 Q 15 22 12 12" stroke="#10B981" strokeWidth="3" fill="none" />
          <circle cx="12" cy="10" r="6" fill="#FBBF24" />
          <circle cx="12" cy="10" r="2.5" fill="#F87171" />
        </g>
      </svg>
    </div>
  );
}

// ============================================================================
// 3. FOOTER CARTOON: PASTEL HOT AIR BALLOON
// ============================================================================
export function HotAirBalloonIllustration({ className = 'w-36 h-48' }: { className?: string }) {
  return (
    <div className={`relative animate-float-slow ${className}`}>
      <svg viewBox="0 0 160 220" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
        {/* Balloon Body */}
        <g>
          {/* Background shape */}
          <path d="M 80 10 C 25 10 15 65 35 110 C 45 130 65 145 80 145 C 95 145 115 130 125 110 C 145 65 135 10 80 10 Z" fill="#FFEAEF" stroke="#2D3748" strokeWidth="3.5" />
          
          {/* Vertical Stripes */}
          {/* Mint stripe */}
          <path d="M 80 10 C 55 10 45 65 58 110 C 65 130 75 145 80 145 C 75 145 65 130 58 110 C 45 65 55 10 80 10 Z" fill="#D1FAE5" />
          {/* Butter Yellow center */}
          <path d="M 80 10 C 70 10 65 65 72 110 C 75 130 78 145 80 145 C 82 145 85 130 88 110 C 95 65 90 10 80 10 Z" fill="#FEF3C7" />
          {/* Sky Blue right stripe */}
          <path d="M 80 10 C 105 10 115 65 102 110 C 95 130 85 145 80 145 C 85 145 95 130 102 110 C 115 65 105 10 80 10 Z" fill="#E0F2FE" />
          
          {/* Outer stroke detail */}
          <path d="M 80 10 C 25 10 15 65 35 110 C 45 130 65 145 80 145 C 95 145 115 130 125 110 C 145 65 135 10 80 10 Z" stroke="#2D3748" strokeWidth="3.5" fill="none" />
        </g>

        {/* Ropes */}
        <line x1="52" y1="145" x2="62" y2="175" stroke="#2D3748" strokeWidth="2.5" />
        <line x1="108" y1="145" x2="98" y2="175" stroke="#2D3748" strokeWidth="2.5" />
        <line x1="80" y1="145" x2="80" y2="175" stroke="#2D3748" strokeWidth="2" />

        {/* Basket */}
        <rect x="58" y="175" width="44" height="32" rx="7" fill="#E2C19D" stroke="#2D3748" strokeWidth="3" />
        <line x1="58" y1="185" x2="102" y2="185" stroke="#C49B74" strokeWidth="2" />
        <line x1="58" y1="195" x2="102" y2="195" stroke="#C49B74" strokeWidth="2" />

        {/* Cute Baby Bear peeking out of basket */}
        <g transform="translate(68, 160)">
          {/* Ears */}
          <circle cx="7" cy="6" r="4.5" fill="#D99B6A" stroke="#2D3748" strokeWidth="1.5" />
          <circle cx="17" cy="6" r="4.5" fill="#D99B6A" stroke="#2D3748" strokeWidth="1.5" />
          {/* Head */}
          <circle cx="12" cy="14" r="9" fill="#E8B07D" stroke="#2D3748" strokeWidth="2" />
          {/* Cheeks */}
          <circle cx="7" cy="16" r="1.8" fill="#FF8DA1" />
          <circle cx="17" cy="16" r="1.8" fill="#FF8DA1" />
          {/* Eyes */}
          <circle cx="9.5" cy="13" r="1.2" fill="#2D3748" />
          <circle cx="14.5" cy="13" r="1.2" fill="#2D3748" />
          {/* Snout */}
          <ellipse cx="12" cy="16" rx="3.5" ry="2.5" fill="#FDF3E7" />
          <circle cx="12" cy="15.2" r="1" fill="#4A3427" />
        </g>

        {/* Tiny Cloud at bottom */}
        <g fill="#FFFFFF" opacity="0.9">
          <circle cx="35" cy="195" r="12" />
          <circle cx="48" cy="190" r="10" />
          <circle cx="58" cy="197" r="8" />
        </g>
      </svg>
    </div>
  );
}

// ============================================================================
// 4. FOOTER CARTOON: FRIENDLY BABY GIRAFFE
// ============================================================================
export function BabyGiraffeIllustration({ className = 'w-32 h-52' }: { className?: string }) {
  return (
    <div className={`relative animate-wiggle origin-bottom ${className}`}>
      <svg viewBox="0 0 160 260" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
        {/* Giraffe Body */}
        <ellipse cx="75" cy="205" rx="38" ry="32" fill="#FCD34D" stroke="#2D3748" strokeWidth="3.5" />

        {/* Legs */}
        <rect x="52" y="215" width="10" height="40" rx="5" fill="#FCD34D" stroke="#2D3748" strokeWidth="3" />
        <rect x="52" y="248" width="10" height="7" rx="2" fill="#78350F" />
        <rect x="88" y="215" width="10" height="40" rx="5" fill="#FCD34D" stroke="#2D3748" strokeWidth="3" />
        <rect x="88" y="248" width="10" height="7" rx="2" fill="#78350F" />

        {/* Tail */}
        <path d="M 112 205 Q 130 215 125 235" stroke="#FCD34D" strokeWidth="5" strokeLinecap="round" fill="none" />
        <ellipse cx="125" cy="235" rx="6" ry="8" fill="#78350F" />

        {/* Long Neck */}
        <path d="M 58 200 L 72 80 L 92 80 L 86 200 Z" fill="#FCD34D" stroke="#2D3748" strokeWidth="3.5" />

        {/* Giraffe Spots on Neck and Body */}
        <ellipse cx="80" cy="110" rx="7" ry="5" fill="#B45309" opacity="0.85" />
        <ellipse cx="78" cy="140" rx="8" ry="6" fill="#B45309" opacity="0.85" />
        <ellipse cx="82" cy="175" rx="9" ry="7" fill="#B45309" opacity="0.85" />
        <ellipse cx="65" cy="205" rx="8" ry="6" fill="#B45309" opacity="0.85" />
        <ellipse cx="95" cy="210" rx="9" ry="7" fill="#B45309" opacity="0.85" />

        {/* Giraffe Mane */}
        <path d="M 88 85 L 94 92 L 88 100 L 94 110 L 88 120 L 94 130 L 88 140 L 94 150 L 88 160" stroke="#78350F" strokeWidth="4" strokeLinecap="round" />

        {/* Head */}
        <g transform="translate(48, 25)">
          {/* Horns / Ossicones */}
          <line x1="28" y1="20" x2="22" y2="4" stroke="#2D3748" strokeWidth="3" />
          <circle cx="21" cy="4" r="5" fill="#78350F" stroke="#2D3748" strokeWidth="2" />
          
          <line x1="42" y1="20" x2="48" y2="4" stroke="#2D3748" strokeWidth="3" />
          <circle cx="49" cy="4" r="5" fill="#78350F" stroke="#2D3748" strokeWidth="2" />

          {/* Ears */}
          <ellipse cx="14" cy="28" rx="10" ry="6" fill="#FCD34D" stroke="#2D3748" strokeWidth="2.5" transform="rotate(-25 14 28)" />
          <ellipse cx="14" cy="28" rx="5" ry="3" fill="#FFCCD7" transform="rotate(-25 14 28)" />

          <ellipse cx="56" cy="28" rx="10" ry="6" fill="#FCD34D" stroke="#2D3748" strokeWidth="2.5" transform="rotate(25 56 28)" />
          <ellipse cx="56" cy="28" rx="5" ry="3" fill="#FFCCD7" transform="rotate(25 56 28)" />

          {/* Head Shape */}
          <ellipse cx="35" cy="42" rx="24" ry="26" fill="#FCD34D" stroke="#2D3748" strokeWidth="3.5" />
          
          {/* Snout */}
          <ellipse cx="35" cy="55" rx="18" ry="13" fill="#FEF3C7" stroke="#2D3748" strokeWidth="2.5" />
          <circle cx="29" cy="52" r="2" fill="#78350F" />
          <circle cx="41" cy="52" r="2" fill="#78350F" />
          <path d="M 30 58 Q 35 63 40 58" stroke="#78350F" strokeWidth="2" strokeLinecap="round" fill="none" />

          {/* Eyes (Gentle, Sweet Smile) */}
          <path d="M 23 35 Q 28 30 32 35" stroke="#2D3748" strokeWidth="3" strokeLinecap="round" fill="none" />
          <path d="M 38 35 Q 43 30 47 35" stroke="#2D3748" strokeWidth="3" strokeLinecap="round" fill="none" />

          {/* Rosy Cheeks */}
          <ellipse cx="18" cy="45" rx="5" ry="3.5" fill="#FF8DA1" opacity="0.75" />
          <ellipse cx="52" cy="45" rx="5" ry="3.5" fill="#FF8DA1" opacity="0.75" />
        </g>
      </svg>
    </div>
  );
}

// ============================================================================
// 5. FLOATING DECORATIVE PASTEL ELEMENTS (Stars, Hearts, Sparkles, Clouds)
// ============================================================================
export function FloatingPastelDecorations() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden select-none">
      {/* Floating Kawaii Star 1 (Top Left) */}
      <div className="absolute top-10 left-[8%] animate-float">
        <svg width="28" height="28" viewBox="0 0 40 40" fill="none">
          <path d="M20 0 L25 12 L38 14 L28 24 L31 38 L20 30 L9 38 L12 24 L2 14 L15 12 Z" fill="#FEF08A" stroke="#EAB308" strokeWidth="2" />
          <circle cx="16" cy="18" r="1.5" fill="#2D3748" />
          <circle cx="24" cy="18" r="1.5" fill="#2D3748" />
          <path d="M18 22 Q20 25 22 22" stroke="#2D3748" strokeWidth="1.5" strokeLinecap="round" fill="none" />
        </svg>
      </div>

      {/* Floating Pink Heart (Top Center) */}
      <div className="absolute top-14 left-[48%] animate-twinkle">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="#FF6B8B" stroke="#FA5578" strokeWidth="1.5" opacity="0.75">
          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
        </svg>
      </div>

      {/* Floating Lavender Sparkle (Top Right) */}
      <div className="absolute top-20 right-[12%] animate-float-slow">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="#DDD6FE">
          <path d="M12 0 L14.5 9.5 L24 12 L14.5 14.5 L12 24 L9.5 14.5 L0 12 L9.5 9.5 Z" />
        </svg>
      </div>

      {/* Floating Sky Blue Cloud (Middle Left) */}
      <div className="absolute top-[42%] left-[3%] opacity-60 animate-float-slow">
        <svg width="54" height="32" viewBox="0 0 64 36" fill="#E0F2FE">
          <circle cx="20" cy="22" r="14" />
          <circle cx="36" cy="16" r="16" />
          <circle cx="50" cy="24" r="12" />
          <rect x="15" y="22" width="40" height="14" />
        </svg>
      </div>

      {/* Floating Mint Leaf Sparkle (Middle Right) */}
      <div className="absolute top-[52%] right-[5%] animate-twinkle">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="#A7F3D0">
          <path d="M12 0 C12 12 24 12 24 12 C12 12 12 24 12 24 C12 12 0 12 0 12 C12 12 12 0 12 0 Z" />
        </svg>
      </div>
    </div>
  );
}
