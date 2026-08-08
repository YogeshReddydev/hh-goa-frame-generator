import React from 'react';
import { AppStep } from '../types';
import { GoaHindiBadge } from './DecorativeElements';
import { RotateCcw, Home } from 'lucide-react';

interface HeaderProps {
  currentStep: AppStep;
  onGoHome: () => void;
  onReset: () => void;
}

export const Header: React.FC<HeaderProps> = ({ currentStep, onGoHome, onReset }) => {
  return (
    <header className="w-full bg-[#00502D] border-b-4 border-[#111111] px-4 py-3 sticky top-0 z-40 shadow-md">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        {/* Left Branding */}
        <button
          onClick={onGoHome}
          className="flex items-center gap-3 text-left focus:outline-none group cursor-pointer"
        >
          <div className="bg-[#FFD600] text-[#111111] font-display text-xl sm:text-2xl px-2.5 py-1 border-2 border-[#111111] shadow-[2px_2px_0px_#111111] group-hover:translate-x-0.5 transition-transform">
            HH GOA
          </div>
          <div className="hidden sm:block">
            <div className="font-display text-xl text-[#FFF9E8] leading-tight tracking-wider">
              HACKER HOUSE GOA
            </div>
            <div className="font-mono-custom text-xs text-[#FFD600] font-bold tracking-widest">
              FRAME LAB 2026
            </div>
          </div>
        </button>

        {/* Center Hindi Accent */}
        <div className="hidden md:flex items-center gap-2">
          <GoaHindiBadge className="text-2xl" />
          <span className="font-mono-custom text-xs bg-[#FF007A] text-white px-2 py-0.5 border border-[#111111]">
            28–31 OCT
          </span>
        </div>

        {/* Right Actions / Hashtag */}
        <div className="flex items-center gap-2 sm:gap-3">
          <span className="font-mono-custom text-xs font-bold bg-[#FFF9E8] text-[#111111] px-2.5 py-1 border-2 border-[#111111] shadow-[2px_2px_0px_#111111]">
            #FrameInGoa
          </span>

          {currentStep !== 'LANDING' && (
            <button
              onClick={onReset}
              className="btn-goa-pink px-2.5 py-1 text-xs font-mono-custom font-bold flex items-center gap-1 cursor-pointer"
              title="Reset Frame"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">RESET</span>
            </button>
          )}

          {currentStep !== 'LANDING' && (
            <button
              onClick={onGoHome}
              className="btn-goa-yellow px-2.5 py-1 text-xs font-mono-custom font-bold flex items-center gap-1 cursor-pointer"
              title="Home"
            >
              <Home className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
