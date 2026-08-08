import React from 'react';
import { FrameFormat } from '../types';
import { Camera, IdCard, ArrowRight, Sparkles, CheckCircle2 } from 'lucide-react';
import { PalmTreeIcon, WaveIcon, GoaHindiBadge } from './DecorativeElements';

interface FormatSelectorProps {
  selectedFormat: FrameFormat;
  onSelectFormat: (format: FrameFormat) => void;
}

export const FormatSelector: React.FC<FormatSelectorProps> = ({
  selectedFormat,
  onSelectFormat,
}) => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Header Heading */}
      <div className="text-center mb-8">
        <div className="inline-block bg-[#FFD600] text-[#111111] font-mono-custom text-xs font-bold px-3 py-1 border-2 border-[#111111] shadow-[2px_2px_0px_#111111] mb-2 uppercase tracking-wider">
          STEP 1 OF 3 • CHOOSE FORMAT
        </div>
        <h2 className="font-display text-4xl sm:text-6xl text-[#FFF9E8] drop-shadow-[3px_3px_0px_#111111]">
          SELECT YOUR FORMAT
        </h2>
        <p className="font-mono-custom text-xs sm:text-sm text-[#FFD600] mt-1">
          Pick your preferred Hacker House Goa 2026 digital asset
        </p>
      </div>

      {/* Two Signboard Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* CARD 1: PFP FRAME */}
        <div
          onClick={() => onSelectFormat('PFP')}
          className={`group cursor-pointer rounded-xl p-6 transition-all relative ${
            selectedFormat === 'PFP'
              ? 'bg-[#FFF9E8] border-4 border-[#111111] shadow-[8px_8px_0px_#FFD600] transform -rotate-1'
              : 'bg-[#00502D] text-[#FFF9E8] border-3 border-[#111111] shadow-[5px_5px_0px_#111111] hover:bg-[#005a33] hover:-translate-y-1'
          }`}
        >
          {/* Active indicator badge */}
          {selectedFormat === 'PFP' && (
            <div className="absolute -top-3 -right-3 bg-[#FF007A] text-white p-1.5 rounded-full border-2 border-[#111111] shadow-[2px_2px_0px_#111111]">
              <CheckCircle2 className="w-6 h-6 text-[#FFD600]" />
            </div>
          )}

          {/* Card Top Label */}
          <div className="flex items-center justify-between mb-4">
            <span
              className={`font-mono-custom text-xs font-bold px-2.5 py-1 border-2 border-[#111111] ${
                selectedFormat === 'PFP'
                  ? 'bg-[#FF007A] text-white'
                  : 'bg-[#FFD600] text-[#111111]'
              }`}
            >
              1080 × 1080 PX • SQUARE
            </span>
            <Camera className={`w-6 h-6 ${selectedFormat === 'PFP' ? 'text-[#FF007A]' : 'text-[#FFD600]'}`} />
          </div>

          {/* Title */}
          <h3
            className={`font-display text-3xl sm:text-4xl mb-2 ${
              selectedFormat === 'PFP' ? 'text-[#111111]' : 'text-[#FFD600]'
            }`}
          >
            PFP FRAME
          </h3>

          <p
            className={`font-body text-sm font-semibold mb-6 ${
              selectedFormat === 'PFP' ? 'text-[#111111]/80' : 'text-[#FFF9E8]/90'
            }`}
          >
            Turn your photo into an HH Goa 2026 profile picture. Perfect for X, Discord, and Telegram.
          </p>

          {/* Visual Preview Graphic Box */}
          <div className="w-full h-48 bg-[#006B3C] border-3 border-[#111111] rounded-lg p-3 relative flex items-center justify-center overflow-hidden mb-6">
            <div className="w-28 h-28 rounded-full border-4 border-[#FFD600] shadow-[3px_3px_0px_#111111] bg-[#FFF9E8] flex items-center justify-center relative overflow-hidden">
              <div className="text-center">
                <span className="text-3xl">🌴</span>
                <div className="font-display text-xs text-[#111111] font-bold">YOUR PHOTO</div>
              </div>
              <div className="absolute inset-0 border-4 border-[#FF007A] rounded-full pointer-events-none opacity-80" />
            </div>

            {/* Frame Corner Accents */}
            <div className="absolute top-2 left-2 bg-[#FFD600] text-[#111111] font-display text-xs px-2 py-0.5 border border-[#111111]">
              HH GOA 2026
            </div>
            <div className="absolute bottom-2 right-2 bg-[#FF007A] text-white font-mono-custom text-[10px] px-2 py-0.5 border border-[#111111]">
              #FrameInGoa
            </div>
          </div>

          {/* Card Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onSelectFormat('PFP');
            }}
            className={`w-full font-display text-xl py-3 px-4 flex items-center justify-center gap-2 cursor-pointer ${
              selectedFormat === 'PFP' ? 'btn-goa-yellow' : 'btn-goa-cream'
            }`}
          >
            <span>USE PFP FRAME →</span>
          </button>
        </div>

        {/* CARD 2: BUILDER ID */}
        <div
          onClick={() => onSelectFormat('BUILDER_ID')}
          className={`group cursor-pointer rounded-xl p-6 transition-all relative ${
            selectedFormat === 'BUILDER_ID'
              ? 'bg-[#FFF9E8] border-4 border-[#111111] shadow-[8px_8px_0px_#FFD600] transform rotate-1'
              : 'bg-[#00502D] text-[#FFF9E8] border-3 border-[#111111] shadow-[5px_5px_0px_#111111] hover:bg-[#005a33] hover:-translate-y-1'
          }`}
        >
          {/* Active indicator badge */}
          {selectedFormat === 'BUILDER_ID' && (
            <div className="absolute -top-3 -right-3 bg-[#FF007A] text-white p-1.5 rounded-full border-2 border-[#111111] shadow-[2px_2px_0px_#111111]">
              <CheckCircle2 className="w-6 h-6 text-[#FFD600]" />
            </div>
          )}

          {/* Card Top Label */}
          <div className="flex items-center justify-between mb-4">
            <span
              className={`font-mono-custom text-xs font-bold px-2.5 py-1 border-2 border-[#111111] ${
                selectedFormat === 'BUILDER_ID'
                  ? 'bg-[#FF007A] text-white'
                  : 'bg-[#FFD600] text-[#111111]'
              }`}
            >
              1080 × 1350 PX • POSTER / BADGE
            </span>
            <IdCard className={`w-6 h-6 ${selectedFormat === 'BUILDER_ID' ? 'text-[#FF007A]' : 'text-[#FFD600]'}`} />
          </div>

          {/* Title */}
          <h3
            className={`font-display text-3xl sm:text-4xl mb-2 ${
              selectedFormat === 'BUILDER_ID' ? 'text-[#111111]' : 'text-[#FFD600]'
            }`}
          >
            BUILDER ID
          </h3>

          <p
            className={`font-body text-sm font-semibold mb-6 ${
              selectedFormat === 'BUILDER_ID' ? 'text-[#111111]/80' : 'text-[#FFF9E8]/90'
            }`}
          >
            Create your own Hacker House Goa builder identity card with stack, role, & custom title.
          </p>

          {/* Visual Preview Graphic Box */}
          <div className="w-full h-48 bg-[#006B3C] border-3 border-[#111111] rounded-lg p-3 relative flex items-center justify-between overflow-hidden mb-6">
            {/* Small Badge Mockup */}
            <div className="w-24 h-36 bg-[#FFF9E8] border-2 border-[#111111] rounded p-1.5 flex flex-col justify-between shadow-[2px_2px_0px_#111111]">
              <div className="bg-[#FFD600] text-[8px] font-display font-bold text-center border border-[#111111]">
                HH GOA
              </div>
              <div className="w-full h-14 bg-gray-200 border border-[#111111] rounded flex items-center justify-center text-xs">
                👤
              </div>
              <div className="space-y-0.5">
                <div className="h-1.5 bg-[#FF007A] rounded w-full" />
                <div className="h-1.5 bg-[#111111] rounded w-3/4" />
              </div>
            </div>

            {/* Right details preview */}
            <div className="flex-1 ml-3 text-left space-y-1">
              <div className="bg-[#FFD600] text-[#111111] font-display text-sm px-2 py-0.5 border border-[#111111] inline-block">
                BUILDER PASSPORT
              </div>
              <div className="font-mono-custom text-[10px] text-[#FFF9E8]">
                NAME: YOGESH R.
              </div>
              <div className="font-mono-custom text-[10px] text-[#FFD600]">
                ROLE: AI / CYBERSECURITY
              </div>
              <div className="bg-[#FF007A] text-white font-mono-custom text-[9px] px-1.5 py-0.5 border border-[#111111] inline-block">
                THE SECURITY ARCHITECT
              </div>
            </div>
          </div>

          {/* Card Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onSelectFormat('BUILDER_ID');
            }}
            className={`w-full font-display text-xl py-3 px-4 flex items-center justify-center gap-2 cursor-pointer ${
              selectedFormat === 'BUILDER_ID' ? 'btn-goa-yellow' : 'btn-goa-cream'
            }`}
          >
            <span>BUILD MY ID →</span>
          </button>
        </div>
      </div>
    </div>
  );
};
