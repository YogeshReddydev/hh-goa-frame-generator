import React, { useEffect, useState } from 'react';
import { BuilderData, FrameFormat, ImageAdjustment } from '../types';
import { generateFrameCanvas } from '../utils/canvasGenerator';
import { Edit2, Sparkles, CheckCircle2 } from 'lucide-react';

interface PreviewScreenProps {
  croppedImageElement: HTMLImageElement | null;
  imageElement?: HTMLImageElement | null;
  adjustment?: ImageAdjustment;
  builderData: BuilderData;
  format: FrameFormat;
  onEdit: () => void;
  onGenerate: () => void;
}

export const PreviewScreen: React.FC<PreviewScreenProps> = ({
  croppedImageElement,
  imageElement,
  adjustment,
  builderData,
  format,
  onEdit,
  onGenerate,
}) => {
  const [previewDataUrl, setPreviewDataUrl] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [genStep, setGenStep] = useState<number>(0);

  useEffect(() => {
    let active = true;
    const renderPreview = async () => {
      try {
        const url = await generateFrameCanvas({
          format,
          croppedImageElement,
          imageElement,
          adjustment,
          builderData,
        });
        if (active) {
          setPreviewDataUrl(url);
        }
      } catch (err) {
        console.error('Error rendering preview canvas:', err);
      }
    };

    renderPreview();

    return () => {
      active = false;
    };
  }, [croppedImageElement, imageElement, adjustment, builderData, format]);

  const handleConfirmGenerate = () => {
    setIsGenerating(true);
    setGenStep(1); // PHOTO check

    setTimeout(() => {
      setGenStep(2); // IDENTITY check
    }, 400);

    setTimeout(() => {
      setGenStep(3); // GOA check
    }, 800);

    setTimeout(() => {
      setGenStep(4); // YOUR GOA ID IS READY
    }, 1200);

    setTimeout(() => {
      onGenerate();
    }, 1600);
  };

  return (
    <div className="w-full max-w-xl mx-auto px-4 py-6 flex flex-col items-center">
      {/* Step Header */}
      <div className="text-center mb-5">
        <span className="inline-block bg-[#FFD600] text-black font-mono-custom text-xs font-bold px-3 py-1 border-2 border-black shadow-[2px_2px_0px_#111111] mb-2 transform -rotate-1">
          STEP 05: PREVIEW YOUR ID
        </span>
        <h2 className="font-bebas text-4xl sm:text-5xl tracking-wide text-[#111111] flex items-center justify-center gap-2">
          YOUR GOA ID
        </h2>
        <p className="font-mono-custom text-sm font-bold text-[#FF007A] mt-1">
          LOOKS GOOD?
        </p>
      </div>

      {/* PREVIEW DISPLAY CONTAINER */}
      <div className="relative bg-[#111111] p-3 rounded-2xl border-4 border-[#111111] shadow-[8px_8px_0px_#111111] mb-6 flex flex-col items-center max-w-md w-full">
        {/* Loading Overlay when generating */}
        {isGenerating && (
          <div className="absolute inset-0 bg-[#111111]/95 backdrop-blur-md z-30 rounded-xl flex flex-col items-center justify-center p-6 text-center border-2 border-[#FFD600]">
            <Sparkles className="w-12 h-12 text-[#FFD600] animate-spin mb-2" />
            
            <div className="font-bebas text-3xl sm:text-4xl text-[#FFD600] tracking-wider leading-tight mb-4">
              BUILDING YOUR<br />GOA ID...
            </div>

            {/* Branded Checklist Items */}
            <div className="flex flex-col gap-2 font-mono-custom text-sm font-bold text-[#FFF9E8] mb-4 text-left w-48">
              <div className={`flex items-center justify-between transition-all ${genStep >= 1 ? 'text-[#00FF66] opacity-100 scale-100' : 'opacity-30'}`}>
                <span>PHOTO</span>
                <span>{genStep >= 1 ? '✓' : '...'}</span>
              </div>
              <div className={`flex items-center justify-between transition-all ${genStep >= 2 ? 'text-[#00FF66] opacity-100 scale-100' : 'opacity-30'}`}>
                <span>IDENTITY</span>
                <span>{genStep >= 2 ? '✓' : '...'}</span>
              </div>
              <div className={`flex items-center justify-between transition-all ${genStep >= 3 ? 'text-[#00FF66] opacity-100 scale-100' : 'opacity-30'}`}>
                <span>GOA</span>
                <span>{genStep >= 3 ? '✓' : '...'}</span>
              </div>
            </div>

            {genStep >= 4 && (
              <div className="bg-[#FF007A] text-white font-mono-custom text-xs font-bold px-4 py-1.5 border-2 border-black shadow-[2px_2px_0px_#FFD600] animate-card-pop-in">
                YOUR GOA ID IS READY.
              </div>
            )}
          </div>
        )}

        {/* Live Preview Image */}
        {previewDataUrl ? (
          <img
            src={previewDataUrl}
            alt="Goa ID Preview"
            className="w-full h-auto rounded-xl border-2 border-[#FFD600] shadow-inner bg-[#FFF9E8]"
          />
        ) : (
          <div className="w-full h-80 bg-[#006B3C] rounded-xl border-2 border-[#FFD600] flex items-center justify-center font-mono-custom text-xs text-[#FFD600] font-bold">
            RENDERING PREVIEW...
          </div>
        )}

        {/* Preview Badge */}
        <div className="mt-2.5 flex items-center justify-between w-full px-2 text-[#FFF9E8] font-mono-custom text-[11px]">
          <span className="flex items-center gap-1 text-[#FFD600]">
            <CheckCircle2 className="w-3.5 h-3.5" /> HIGH-FIDELITY PREVIEW
          </span>
          <span className="text-gray-400">
            {format === 'PFP' ? '1080 x 1080 PNG' : '1080 x 1350 PNG'}
          </span>
        </div>
      </div>

      {/* ACTION BUTTONS */}
      <div className="w-full flex items-center justify-between gap-4 max-w-md">
        <button
          onClick={onEdit}
          disabled={isGenerating}
          className="flex-1 py-3 px-4 bg-[#FFF9E8] hover:bg-gray-100 text-[#111111] font-mono-custom text-xs font-bold border-2 border-black rounded-xl shadow-[3px_3px_0px_#111111] active:translate-y-0.5 transition-all flex items-center justify-center gap-2"
        >
          <Edit2 className="w-4 h-4" /> ← EDIT
        </button>

        <button
          onClick={handleConfirmGenerate}
          disabled={isGenerating || !previewDataUrl}
          className="flex-1 py-3.5 px-6 bg-[#FF007A] hover:bg-[#e0006c] text-white font-mono-custom text-xs font-bold border-2 border-black rounded-xl shadow-[4px_4px_0px_#111111] active:translate-y-0.5 transition-all flex items-center justify-center gap-2 transform hover:scale-[1.02]"
        >
          GENERATE ID →
        </button>
      </div>
    </div>
  );
};
