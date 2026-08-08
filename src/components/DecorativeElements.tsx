import React from 'react';

// Palm Tree SVG
export const PalmTreeIcon: React.FC<{ className?: string }> = ({ className = "w-12 h-12" }) => (
  <svg className={className} viewBox="0 0 100 120" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Trunk */}
    <path d="M48 115C48 115 45 75 52 45" stroke="#111111" strokeWidth="6" strokeLinecap="round" />
    <path d="M48 115C48 115 45 75 52 45" stroke="#FFD600" strokeWidth="3" strokeLinecap="round" />
    {/* Bark rings */}
    <path d="M47 95L52 92" stroke="#111111" strokeWidth="3" />
    <path d="M48 80L53 77" stroke="#111111" strokeWidth="3" />
    <path d="M49 65L54 62" stroke="#111111" strokeWidth="3" />
    {/* Palm Fronds Left */}
    <path d="M52 45C35 40 10 48 5 60C18 55 35 55 52 45Z" fill="#006B3C" stroke="#111111" strokeWidth="3" />
    <path d="M52 45C30 25 12 25 5 32C20 30 38 36 52 45Z" fill="#006B3C" stroke="#111111" strokeWidth="3" />
    {/* Palm Fronds Right */}
    <path d="M52 45C70 40 92 46 97 58C84 54 67 54 52 45Z" fill="#006B3C" stroke="#111111" strokeWidth="3" />
    <path d="M52 45C72 25 88 23 96 30C82 29 64 35 52 45Z" fill="#006B3C" stroke="#111111" strokeWidth="3" />
    {/* Top Frond */}
    <path d="M52 45C52 20 40 5 50 2C58 10 56 28 52 45Z" fill="#006B3C" stroke="#111111" strokeWidth="3" />
    {/* Coconuts */}
    <circle cx="47" cy="46" r="4" fill="#FF007A" stroke="#111111" strokeWidth="2" />
    <circle cx="55" cy="47" r="4" fill="#FFD600" stroke="#111111" strokeWidth="2" />
  </svg>
);

// Ocean Wave Line
export const WaveIcon: React.FC<{ className?: string; color?: string }> = ({ className = "w-24 h-6", color = "#FFD600" }) => (
  <svg className={className} viewBox="0 0 120 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M0 12C15 12 15 4 30 4C45 4 45 20 60 20C75 20 75 4 90 4C105 4 105 12 120 12"
      stroke="#111111"
      strokeWidth="5"
      strokeLinecap="round"
    />
    <path
      d="M0 12C15 12 15 4 30 4C45 4 45 20 60 20C75 20 75 4 90 4C105 4 105 12 120 12"
      stroke={color}
      strokeWidth="2.5"
      strokeLinecap="round"
    />
  </svg>
);

// Tropical Sun Accent
export const TropicalSun: React.FC<{ className?: string }> = ({ className = "w-16 h-16" }) => (
  <svg className={className} viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="40" cy="40" r="22" fill="#FFD600" stroke="#111111" strokeWidth="4" />
    {/* Rays */}
    <path d="M40 5V12M40 68V75M5 40H12M68 40H75M15 15L20 20M60 60L65 65M15 65L20 60M60 20L65 15" stroke="#111111" strokeWidth="4" strokeLinecap="round" />
  </svg>
);

// Goa Scooter Silhouette / Retro Vehicle
export const GoaScooter: React.FC<{ className?: string }> = ({ className = "w-20 h-16" }) => (
  <svg className={className} viewBox="0 0 100 80" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Body */}
    <path d="M25 50C25 50 35 30 55 32C65 33 80 40 85 50C88 56 80 62 70 62H25Z" fill="#FF007A" stroke="#111111" strokeWidth="3" />
    {/* Seat */}
    <path d="M45 32C45 32 55 28 72 32C75 33 72 37 65 37H45Z" fill="#FFF9E8" stroke="#111111" strokeWidth="2" />
    {/* Handlebars */}
    <path d="M28 48L22 25L32 20" stroke="#111111" strokeWidth="3" strokeLinecap="round" />
    <circle cx="32" cy="18" r="5" fill="#FFD600" stroke="#111111" strokeWidth="2" />
    {/* Wheels */}
    <circle cx="28" cy="62" r="12" fill="#FFF9E8" stroke="#111111" strokeWidth="4" />
    <circle cx="28" cy="62" r="4" fill="#111111" />
    <circle cx="75" cy="62" r="12" fill="#FFF9E8" stroke="#111111" strokeWidth="4" />
    <circle cx="75" cy="62" r="4" fill="#111111" />
  </svg>
);

// Direction Sign Board
export const DirectionSign: React.FC<{ text?: string; className?: string }> = ({ text = "GOA 2026", className = "w-32 h-12" }) => (
  <div className={`relative inline-flex items-center justify-center bg-[#FFD600] text-[#111111] font-display text-lg px-4 py-1 border-3 border-[#111111] shadow-[3px_3px_0px_#111111] transform -rotate-2 ${className}`}>
    <span className="truncate">{text}</span>
  </div>
);

// Hindi "गोवा" Graphic Badge
export const GoaHindiBadge: React.FC<{ className?: string }> = ({ className = "" }) => (
  <div className={`inline-block font-devanagari text-3xl md:text-4xl text-[#FFD600] drop-shadow-[2px_2px_0px_#111111] transform rotate-2 ${className}`}>
    गोवा
  </div>
);

// Palm Leaf Corner Accent
export const PalmLeafCorner: React.FC<{ className?: string }> = ({ className = "w-24 h-24" }) => (
  <svg className={className} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M100 0C60 10 20 40 0 100C30 70 70 50 100 0Z" fill="#00502D" stroke="#111111" strokeWidth="3" />
    <path d="M100 0C50 30 20 60 0 100" stroke="#FFD600" strokeWidth="2" />
    <path d="M60 20C45 35 30 55 20 75" stroke="#111111" strokeWidth="1.5" />
    <path d="M80 10C65 28 50 48 40 65" stroke="#111111" strokeWidth="1.5" />
  </svg>
);

// Tropical Birds Flying
export const FlyingBirds: React.FC<{ className?: string }> = ({ className = "w-16 h-8" }) => (
  <svg className={className} viewBox="0 0 80 40" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M10 20C15 12 22 15 28 22C34 15 41 12 46 20" stroke="#111111" strokeWidth="3" strokeLinecap="round" />
    <path d="M45 10C49 4 54 6 59 12C64 6 69 4 73 10" stroke="#111111" strokeWidth="2.5" strokeLinecap="round" />
  </svg>
);

// Beach Umbrella SVG
export const BeachUmbrella: React.FC<{ className?: string }> = ({ className = "w-12 h-12" }) => (
  <svg className={className} viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M40 38V75" stroke="#111111" strokeWidth="4" strokeLinecap="round" />
    <path d="M10 38C10 22 23 10 40 10C57 10 70 22 70 38H10Z" fill="#FF007A" stroke="#111111" strokeWidth="4" />
    <path d="M25 38C25 22 32 10 40 10C48 10 55 22 55 38H25Z" fill="#FFD600" stroke="#111111" strokeWidth="3" />
  </svg>
);

// Coconut Drink SVG
export const CoconutDrink: React.FC<{ className?: string }> = ({ className = "w-10 h-10" }) => (
  <svg className={className} viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
    <ellipse cx="30" cy="35" rx="18" ry="16" fill="#6B4226" stroke="#111111" strokeWidth="3" />
    <ellipse cx="30" cy="24" rx="14" ry="5" fill="#FFF9E8" stroke="#111111" strokeWidth="2" />
    {/* Straw */}
    <path d="M28 24L18 8H12" stroke="#FF007A" strokeWidth="3" strokeLinecap="round" />
    {/* Umbrella */}
    <path d="M34 24L44 14" stroke="#111111" strokeWidth="2" />
    <path d="M38 10L48 16" stroke="#FFD600" strokeWidth="3" strokeLinecap="round" />
  </svg>
);

// Retro Goa Sticker Badge
export const StickerStampBadge: React.FC<{ text?: string; className?: string }> = ({ text = "VERIFIED BUILDER", className = "" }) => (
  <div className={`inline-flex items-center justify-center bg-[#FF007A] text-white font-mono-custom text-xs font-bold px-3 py-1 border-2 border-[#111111] shadow-[2px_2px_0px_#111111] transform -rotate-3 ${className}`}>
    ★ {text} ★
  </div>
);

