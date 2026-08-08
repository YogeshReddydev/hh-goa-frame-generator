import React from 'react';
import { 
  PalmTreeIcon, 
  WaveIcon, 
  TropicalSun, 
  GoaScooter, 
  DirectionSign, 
  GoaHindiBadge, 
  FlyingBirds,
  PalmLeafCorner,
  CoconutDrink,
  BeachUmbrella,
  StickerStampBadge
} from './DecorativeElements';
import { Sparkles, ArrowRight, Upload, Crop, Share2, HelpCircle, ShieldCheck } from 'lucide-react';

interface LandingPageProps {
  onStartBuilding: () => void;
  onSelectPfp?: () => void;
  onSelectBuilderId?: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onStartBuilding,
  onSelectPfp,
  onSelectBuilderId,
}) => {
  return (
    <div className="relative min-h-[85vh] flex flex-col justify-between py-6 px-4 overflow-hidden">
      {/* Corner Decorative Palm Fronds */}
      <div className="absolute top-0 left-0 pointer-events-none z-10 hidden sm:block animate-sway">
        <PalmLeafCorner className="w-28 h-28 sm:w-36 sm:h-36" />
      </div>
      <div className="absolute top-0 right-0 pointer-events-none z-10 transform scale-x-100 hidden sm:block rotate-90 animate-sway-reverse">
        <PalmLeafCorner className="w-28 h-28 sm:w-36 sm:h-36" />
      </div>

      {/* Background Sun and Birds */}
      <div className="absolute top-6 right-6 sm:right-20 opacity-90 pointer-events-none z-0 animate-sun-pulse">
        <TropicalSun className="w-16 h-16 sm:w-24 sm:h-24 animate-spin-slow" />
      </div>
      <div className="absolute top-10 left-10 sm:left-32 pointer-events-none z-0 animate-float-gentle">
        <FlyingBirds className="w-16 h-8 sm:w-20 sm:h-10 opacity-70" />
      </div>

      {/* Main Hero Container */}
      <div className="max-w-3xl mx-auto w-full text-center relative z-20 my-auto flex flex-col items-center animate-title-entrance">
        
        {/* Top Floating Official Badge */}
        <div className="inline-flex items-center gap-2 bg-[#FF007A] text-white font-mono-custom text-xs sm:text-sm font-bold px-4 py-1.5 border-3 border-[#111111] shadow-[3px_3px_0px_#111111] transform -rotate-1 mb-5 transition-transform hover:scale-105">
          <Sparkles className="w-4 h-4 text-[#FFD600] animate-spin-slow" />
          <span>HH GOA 2026 • OFFICIAL BUILDER PASSPORT</span>
        </div>

        {/* Brand Title Block */}
        <div className="relative mb-3">
          <h1 className="font-display text-5xl sm:text-7xl md:text-8xl text-[#FFD600] leading-none tracking-wide drop-shadow-[4px_4px_0px_#111111]">
            HACKER HOUSE
          </h1>
          
          {/* Hindi "गोवा" Overlay Badge */}
          <div className="absolute -top-3 -right-2 sm:right-4 transform rotate-12 z-30">
            <div className="bg-[#FFF9E8] text-[#111111] px-2.5 py-0.5 border-3 border-[#111111] shadow-[3px_3px_0px_#111111]">
              <GoaHindiBadge className="text-2xl sm:text-4xl" />
            </div>
          </div>

          <h1 className="font-display text-6xl sm:text-8xl md:text-[9.5rem] text-[#FFF9E8] leading-none tracking-tight drop-shadow-[5px_5px_0px_#111111] -mt-2 sm:-mt-5">
            GOA
          </h1>
        </div>

        {/* Location & Dates Banner */}
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mb-6">
          <DirectionSign text="GOA, INDIA" className="text-sm sm:text-lg" />
          <div className="bg-[#FF007A] text-white font-display text-lg sm:text-xl px-3.5 py-1 border-3 border-[#111111] shadow-[3px_3px_0px_#111111] transform rotate-1">
            28–31 OCT 2026
          </div>
        </div>

        {/* Main Value Proposition Box */}
        <div className="w-full bg-[#FFF9E8] text-[#111111] p-5 sm:p-7 border-4 border-[#111111] shadow-[6px_6px_0px_#111111] rounded-2xl transform -rotate-0.5 mb-8 text-center relative">
          <div className="absolute -top-4 left-1/2 -translate-x-1/2">
            <StickerStampBadge text="VERIFIED BUILDER ID" />
          </div>

          <h2 className="font-display text-3xl sm:text-5xl text-[#111111] leading-tight mt-2 mb-2">
            BUILD YOUR GOA ID.
          </h2>
          
          <p className="font-body text-base sm:text-lg font-bold text-[#FF007A] mb-1">
            Your photo. Your stack. Your builder identity.
          </p>
          <p className="font-body text-xs sm:text-sm font-semibold text-[#111111]/80 max-w-lg mx-auto">
            Create your official HH Goa 2026 frame and share your builder vibe with the world.
          </p>
        </div>

        {/* 3-STEP VISUAL BREAKDOWN */}
        <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-3.5 mb-8">
          {/* STEP 01 */}
          <div className="bg-[#00502D] text-[#FFF9E8] p-4 rounded-xl border-3 border-[#111111] shadow-[4px_4px_0px_#111111] flex flex-col items-center text-center relative group hover:bg-[#005a33] transition-colors">
            <div className="w-8 h-8 rounded-full bg-[#FFD600] text-black font-mono-custom text-xs font-bold flex items-center justify-center border-2 border-black mb-2 shadow">
              01
            </div>
            <div className="flex items-center gap-1.5 font-display text-xl text-[#FFD600] mb-1">
              <Upload className="w-4 h-4 text-[#FF007A]" />
              <span>UPLOAD</span>
            </div>
            <p className="font-mono-custom text-xs text-[#FFF9E8]/90 font-medium">
              Bring your photo.
            </p>
          </div>

          {/* STEP 02 */}
          <div className="bg-[#00502D] text-[#FFF9E8] p-4 rounded-xl border-3 border-[#111111] shadow-[4px_4px_0px_#111111] flex flex-col items-center text-center relative group hover:bg-[#005a33] transition-colors">
            <div className="w-8 h-8 rounded-full bg-[#FF007A] text-white font-mono-custom text-xs font-bold flex items-center justify-center border-2 border-black mb-2 shadow">
              02
            </div>
            <div className="flex items-center gap-1.5 font-display text-xl text-[#FFD600] mb-1">
              <Crop className="w-4 h-4 text-[#FFD600]" />
              <span>MAKE IT YOURS</span>
            </div>
            <p className="font-mono-custom text-xs text-[#FFF9E8]/90 font-medium">
              Crop your photo & add your details.
            </p>
          </div>

          {/* STEP 03 */}
          <div className="bg-[#00502D] text-[#FFF9E8] p-4 rounded-xl border-3 border-[#111111] shadow-[4px_4px_0px_#111111] flex flex-col items-center text-center relative group hover:bg-[#005a33] transition-colors">
            <div className="w-8 h-8 rounded-full bg-[#FFD600] text-black font-mono-custom text-xs font-bold flex items-center justify-center border-2 border-black mb-2 shadow">
              03
            </div>
            <div className="flex items-center gap-1.5 font-display text-xl text-[#FFD600] mb-1">
              <Share2 className="w-4 h-4 text-[#FF007A]" />
              <span>SHARE IT</span>
            </div>
            <p className="font-mono-custom text-xs text-[#FFF9E8]/90 font-medium">
              Generate graphic & share with #FrameInGoa.
            </p>
          </div>
        </div>

        {/* PRIMARY CTA BUTTON & SUPPORTING TEXT */}
        <div className="w-full flex flex-col items-center gap-3 mb-10">
          <button
            onClick={onStartBuilding}
            className="w-full sm:w-auto min-w-[280px] bg-[#FF007A] hover:bg-[#e0006c] text-white font-display text-3xl sm:text-4xl py-4 px-8 rounded-2xl border-4 border-black shadow-[6px_6px_0px_#111111] active:translate-y-1 active:shadow-[2px_2px_0px_#111111] transition-all flex items-center justify-center gap-3 cursor-pointer group transform hover:scale-[1.02]"
          >
            <span>LET'S BUILD</span>
            <ArrowRight className="w-8 h-8 text-[#FFD600] animate-arrow-nudge" />
          </button>

          <div className="flex items-center gap-2 text-[#FFD600] font-mono-custom text-xs font-bold bg-[#111111]/80 px-3 py-1 rounded-full border border-[#FFD600]/30">
            <ShieldCheck className="w-3.5 h-3.5 text-[#00FF66]" />
            <span>No login. No signup. Just build.</span>
          </div>
        </div>

        {/* SUBTLE "WHAT'S THIS?" INFORMATIONAL SECTION */}
        <div className="w-full bg-[#111111]/90 text-[#FFF9E8] p-5 rounded-2xl border-3 border-[#FFD600] shadow-[5px_5px_0px_#111111] text-left relative overflow-hidden mb-6">
          <div className="flex items-center gap-2 mb-2 text-[#FFD600] font-mono-custom text-xs font-bold">
            <HelpCircle className="w-4 h-4 text-[#FF007A]" />
            <span>WHAT'S THIS?</span>
          </div>
          <h3 className="font-display text-2xl text-[#FFF9E8] mb-1">
            A little piece of Goa for your profile.
          </h3>
          <p className="font-body text-xs sm:text-sm text-gray-300 leading-relaxed">
            Upload your photo, choose your format, and we'll create a fixed HH Goa 2026 visual made for builders. 100% processed locally inside your browser.
          </p>

          {/* Direct format jump links for convenience */}
          {(onSelectPfp || onSelectBuilderId) && (
            <div className="mt-4 pt-3 border-t border-gray-700/80 flex flex-wrap items-center gap-3">
              <span className="font-mono-custom text-[11px] text-gray-400">JUMP DIRECTLY TO:</span>
              {onSelectPfp && (
                <button
                  onClick={onSelectPfp}
                  className="font-mono-custom text-xs font-bold text-[#FFD600] hover:text-[#FF007A] underline cursor-pointer"
                >
                  PFP Frame (1:1)
                </button>
              )}
              <span className="text-gray-600">•</span>
              {onSelectBuilderId && (
                <button
                  onClick={onSelectBuilderId}
                  className="font-mono-custom text-xs font-bold text-[#FFD600] hover:text-[#FF007A] underline cursor-pointer"
                >
                  Builder ID Card
                </button>
              )}
            </div>
          )}
        </div>

        {/* Bottom Hashtag & Waves */}
        <div className="flex items-center gap-2">
          <WaveIcon className="w-16 h-4 sm:w-20 sm:h-5 animate-wave-slide" color="#FFD600" />
          <span className="font-mono-custom text-xs sm:text-sm font-bold text-[#FFD600]">
            #FrameInGoa
          </span>
          <WaveIcon className="w-16 h-4 sm:w-20 sm:h-5 animate-wave-slide" color="#FF007A" />
        </div>
      </div>

      {/* Bottom Decorative Row */}
      <div className="max-w-4xl mx-auto w-full flex items-end justify-between opacity-80 pt-6 pointer-events-none">
        <GoaScooter className="w-16 h-12 sm:w-24 sm:h-18 animate-float-gentle" />
        <div className="hidden sm:flex items-center gap-4">
          <CoconutDrink className="w-10 h-10 animate-float-gentle" />
          <BeachUmbrella className="w-12 h-12" />
        </div>
        <PalmTreeIcon className="w-16 h-20 sm:w-24 sm:h-28 animate-sway" />
      </div>
    </div>
  );
};
