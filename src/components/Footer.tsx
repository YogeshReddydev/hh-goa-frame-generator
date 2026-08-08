import React from 'react';
import { PalmTreeIcon, WaveIcon, GoaHindiBadge } from './DecorativeElements';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-[#004222] text-[#FFF9E8] border-t-4 border-[#111111] mt-16 py-10 px-4 relative overflow-hidden">
      {/* Background Decorative Fronds */}
      <div className="absolute left-2 bottom-0 opacity-20 pointer-events-none">
        <PalmTreeIcon className="w-24 h-28" />
      </div>

      <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 relative z-10 text-center md:text-left">
        <div>
          <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
            <span className="font-display text-2xl text-[#FFD600] tracking-wider">
              HACKER HOUSE GOA
            </span>
            <GoaHindiBadge className="text-xl" />
          </div>
          <p className="font-mono-custom text-xs text-[#FFF9E8]/80 mb-1">
            GOA, INDIA • 28–31 OCT 2026
          </p>
          <p className="font-mono-custom text-xs text-[#FF007A] font-bold">
            #FrameInGoa
          </p>
        </div>

        <div className="flex flex-col items-center md:items-end gap-2">
          <WaveIcon color="#FFD600" className="w-28 h-5" />
          <div className="bg-[#FFD600] text-[#111111] font-mono-custom text-xs font-bold px-3 py-1 border-2 border-[#111111] shadow-[2px_2px_0px_#111111] uppercase tracking-wider">
            BUILT FOR BUILDERS 🌴💻
          </div>
        </div>
      </div>
    </footer>
  );
};
