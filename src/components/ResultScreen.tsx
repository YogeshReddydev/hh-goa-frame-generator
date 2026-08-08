import React, { useEffect, useState } from 'react';
import { Download, Twitter, Edit2, RotateCcw, Check, Sparkles, AlertCircle } from 'lucide-react';
import confetti from 'canvas-confetti';
import { WaveIcon, DirectionSign } from './DecorativeElements';

interface ResultScreenProps {
  generatedDataUrl: string | null;
  onEdit: () => void;
  onCreateAnother: () => void;
  builderName?: string;
  isPfp: boolean;
}

export const ResultScreen: React.FC<ResultScreenProps> = ({
  generatedDataUrl,
  onEdit,
  onCreateAnother,
  builderName = 'builder',
  isPfp,
}) => {
  const [downloaded, setDownloaded] = useState(false);
  const [showShareGuide, setShowShareGuide] = useState(false);

  // Trigger confetti burst on load
  useEffect(() => {
    try {
      confetti({
        particleCount: 70,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#FFD600', '#FF007A', '#006B3C', '#FFF9E8'],
      });
    } catch {
      // Fallback
    }
  }, []);

  const filename = isPfp
    ? 'hh-goa-frame.png'
    : `hh-goa-builder-${builderName.toLowerCase().replace(/[^a-z0-9]/g, '-')}.png`;

  const handleDownload = () => {
    if (!generatedDataUrl) return;

    const link = document.createElement('a');
    link.href = generatedDataUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setDownloaded(true);
    setTimeout(() => setDownloaded(false), 4000);
  };

  const handleShareToX = () => {
    // 1. Auto download image first if needed
    if (generatedDataUrl && !downloaded) {
      handleDownload();
    }

    // 2. Open X Tweet Composer intent
    const tweetText = encodeURIComponent(
      `I’m building in Goa with Hacker House Goa 2026 🌴💻\n\nMeet me at #FrameInGoa\n\nHACKER HOUSE GOA\n28–31 OCT 2026`
    );
    const xUrl = `https://twitter.com/intent/tweet?text=${tweetText}`;
    window.open(xUrl, '_blank');

    setShowShareGuide(true);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-6 text-center">
      {/* Title Header */}
      <div className="inline-flex items-center gap-2 bg-[#FFD600] text-[#111111] font-mono-custom text-xs font-bold px-3 py-1 border-2 border-[#111111] shadow-[2px_2px_0px_#111111] mb-2 uppercase">
        <Sparkles className="w-4 h-4 text-[#FF007A]" />
        <span>PASSPORT READY</span>
      </div>

      <h2 className="font-display text-4xl sm:text-6xl text-[#FFF9E8] drop-shadow-[4px_4px_0px_#111111] mb-2">
        YOUR GOA ID IS READY!
      </h2>

      <p className="font-mono-custom text-xs sm:text-sm text-[#FFD600] mb-6">
        Download your high-res 1080p graphic & mark your presence in Goa
      </p>

      {/* Main Preview Container */}
      {generatedDataUrl ? (
        <div className="relative inline-block mb-8 animate-card-pop-in">
          <div className="bg-[#FFF9E8] p-3 rounded-2xl border-4 border-[#111111] shadow-[8px_8px_0px_#111111] transform -rotate-1 max-w-lg mx-auto overflow-hidden transition-transform duration-300 hover:scale-[1.01]">
            <img
              src={generatedDataUrl}
              alt="Hacker House Goa Result"
              className="w-full h-auto rounded-lg border-2 border-[#111111] shadow-inner"
            />
          </div>
          <div className="absolute -bottom-3 -right-3 sm:right-4 bg-[#FF007A] text-white font-display text-base px-3 py-1 border-2 border-[#111111] shadow-[2px_2px_0px_#111111] transform rotate-3">
            OFFICIAL HH GOA 2026
          </div>
        </div>
      ) : (
        <div className="p-12 bg-[#FFF9E8] text-[#111111] font-mono-custom text-sm font-bold border-4 border-[#111111] rounded-2xl mb-8">
          GENERATING HIGH-RES PNG...
        </div>
      )}

      {/* Share Guide Banner Notice */}
      {showShareGuide && (
        <div className="max-w-lg mx-auto bg-[#FFD600] text-[#111111] p-4 border-3 border-[#111111] shadow-[4px_4px_0px_#111111] mb-6 text-left flex items-start gap-3">
          <AlertCircle className="w-6 h-6 text-[#FF007A] flex-shrink-0 mt-0.5" />
          <div className="text-xs font-mono-custom">
            <p className="font-bold text-sm mb-0.5">IMAGE SAVED TO DOWNLOADS! 📸</p>
            <p>
              Your graphic is saved in your browser downloads. Simply attach it to your post on X to share!
            </p>
          </div>
        </div>
      )}

      {/* Large Action Buttons */}
      <div className="max-w-lg mx-auto flex flex-col gap-3 mb-8">
        <button
          onClick={handleDownload}
          className="btn-goa-yellow w-full py-4 text-xl sm:text-2xl font-display flex items-center justify-center gap-3 cursor-pointer"
        >
          {downloaded ? (
            <>
              <Check className="w-6 h-6 text-[#006B3C]" />
              <span>DOWNLOADED PNG!</span>
            </>
          ) : (
            <>
              <Download className="w-6 h-6" />
              <span>DOWNLOAD IMAGE (PNG) →</span>
            </>
          )}
        </button>

        <button
          onClick={handleShareToX}
          className="btn-goa-pink w-full py-4 text-xl sm:text-2xl font-display flex items-center justify-center gap-3 cursor-pointer"
        >
          <Twitter className="w-6 h-6 fill-current" />
          <span>SHARE TO X (#FrameInGoa) →</span>
        </button>

        <div className="grid grid-cols-2 gap-3 pt-2">
          <button
            onClick={onEdit}
            className="btn-goa-cream py-3 text-base font-display flex items-center justify-center gap-2 cursor-pointer"
          >
            <Edit2 className="w-4 h-4 text-[#FF007A]" />
            <span>EDIT DETAILS</span>
          </button>

          <button
            onClick={onCreateAnother}
            className="btn-goa-cream py-3 text-base font-display flex items-center justify-center gap-2 cursor-pointer"
          >
            <RotateCcw className="w-4 h-4 text-[#006B3C]" />
            <span>CREATE ANOTHER</span>
          </button>
        </div>
      </div>
    </div>
  );
};
