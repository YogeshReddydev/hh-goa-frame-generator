import React, { useState, useRef, useEffect, useCallback } from 'react';
import { FrameFormat, ImageAdjustment } from '../types';
import { renderCroppedImage } from '../utils/cropUtils';
import { RotateCcw, ZoomIn, ZoomOut, ArrowLeft, ArrowRight, ArrowUp, ArrowDown, Move, Loader2 } from 'lucide-react';

interface CropEditorProps {
  imageUrl: string;
  imageElement?: HTMLImageElement | null;
  format: FrameFormat;
  adjustment: ImageAdjustment;
  onAdjustmentChange: (adj: ImageAdjustment) => void;
  onBack: () => void;
  onContinue: () => void;
  onCropComplete?: (croppedImg: HTMLImageElement, dataUrl: string) => void;
}

export const CropEditor: React.FC<CropEditorProps> = ({
  imageUrl,
  imageElement,
  format,
  adjustment,
  onAdjustmentChange,
  onBack,
  onContinue,
  onCropComplete,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isCropping, setIsCropping] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [initialOffset, setInitialOffset] = useState({ x: adjustment.offsetX, y: adjustment.offsetY });

  // Touch pinch distance state
  const touchDistanceRef = useRef<number | null>(null);

  // Handle Drag Start
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
    setDragStart({ x: e.clientX, y: e.clientY });
    setInitialOffset({ x: adjustment.offsetX, y: adjustment.offsetY });
  };

  // Handle Mouse Move
  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging) return;
    const dx = e.clientX - dragStart.x;
    const dy = e.clientY - dragStart.y;
    onAdjustmentChange({
      ...adjustment,
      offsetX: initialOffset.x + dx,
      offsetY: initialOffset.y + dy,
    });
  }, [isDragging, dragStart, initialOffset, adjustment, onAdjustmentChange]);

  // Handle Mouse Up
  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    } else {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, handleMouseMove, handleMouseUp]);

  // Handle Touch Drag & Pinch
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      setIsDragging(true);
      setDragStart({ x: e.touches[0].clientX, y: e.touches[0].clientY });
      setInitialOffset({ x: adjustment.offsetX, y: adjustment.offsetY });
    } else if (e.touches.length === 2) {
      setIsDragging(false);
      const dist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      touchDistanceRef.current = dist;
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length === 1 && isDragging) {
      const dx = e.touches[0].clientX - dragStart.x;
      const dy = e.touches[0].clientY - dragStart.y;
      onAdjustmentChange({
        ...adjustment,
        offsetX: initialOffset.x + dx,
        offsetY: initialOffset.y + dy,
      });
    } else if (e.touches.length === 2 && touchDistanceRef.current !== null) {
      const newDist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      const factor = newDist / touchDistanceRef.current;
      const newZoom = Math.min(Math.max(adjustment.zoom * factor, 0.4), 3.0);
      onAdjustmentChange({
        ...adjustment,
        zoom: newZoom,
      });
      touchDistanceRef.current = newDist;
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
    touchDistanceRef.current = null;
  };

  // Wheel Zoom
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const zoomDelta = e.deltaY < 0 ? 0.08 : -0.08;
    const newZoom = Math.min(Math.max(adjustment.zoom + zoomDelta, 0.4), 3.0);
    onAdjustmentChange({
      ...adjustment,
      zoom: newZoom,
    });
  };

  const handleZoomChange = (newZoom: number) => {
    onAdjustmentChange({
      ...adjustment,
      zoom: Math.min(Math.max(newZoom, 0.4), 3.0),
    });
  };

  const handleNudge = (dx: number, dy: number) => {
    onAdjustmentChange({
      ...adjustment,
      offsetX: adjustment.offsetX + dx,
      offsetY: adjustment.offsetY + dy,
    });
  };

  const handleReset = () => {
    onAdjustmentChange({
      zoom: 1.0,
      offsetX: 0,
      offsetY: 0,
      rotation: 0,
    });
  };

  const handleContinueWithCrop = async () => {
    if (isCropping) return;
    setIsCropping(true);
    try {
      let sourceImg = imageElement;
      if (!sourceImg && imageUrl) {
        sourceImg = new Image();
        sourceImg.crossOrigin = 'anonymous';
        await new Promise<void>((resolve, reject) => {
          sourceImg!.onload = () => resolve();
          sourceImg!.onerror = (err) => reject(err);
          sourceImg!.src = imageUrl;
        });
      }

      if (sourceImg) {
        const { croppedImageElement, croppedDataUrl } = await renderCroppedImage(
          sourceImg,
          format,
          adjustment
        );
        if (onCropComplete) {
          onCropComplete(croppedImageElement, croppedDataUrl);
        }
      }
    } catch (err) {
      console.error('Error rendering cropped image:', err);
    } finally {
      setIsCropping(false);
      onContinue();
    }
  };

  // Aspect Ratio for Crop Box
  const isPfp = format === 'PFP';
  const cropBoxStyle = isPfp
    ? { width: '280px', height: '280px', borderRadius: '16px' }
    : { width: '280px', height: '310px', borderRadius: '12px' };

  return (
    <div className="w-full max-w-xl mx-auto px-4 py-6 flex flex-col items-center">
      {/* Step Header */}
      <div className="text-center mb-5">
        <span className="inline-block bg-[#FFD600] text-black font-mono-custom text-xs font-bold px-3 py-1 border-2 border-black shadow-[2px_2px_0px_#111111] mb-2 transform -rotate-1">
          STEP 03: POSITION YOUR PHOTO
        </span>
        <h2 className="font-bebas text-3xl sm:text-4xl tracking-wide text-[#111111]">
          CROP & ALIGN PHOTO
        </h2>
        <p className="font-mono-custom text-xs text-[#111111]/80 max-w-sm mx-auto mt-1">
          Drag photo to position • Pinch or slide to zoom inside the fixed HH Goa frame.
        </p>
      </div>

      {/* CROP CONTAINER BOX */}
      <div className="relative bg-[#111111] p-4 rounded-2xl border-4 border-[#111111] shadow-[8px_8px_0px_#111111] mb-6 flex flex-col items-center">
        {/* Helper instruction badge overlay */}
        <div className="absolute -top-3 bg-[#FF007A] text-white font-mono-custom text-[11px] font-bold px-3 py-0.5 rounded-full border border-black shadow z-20 flex items-center gap-1">
          <Move className="w-3 h-3" /> DRAG TO MOVE • SCROLL TO ZOOM
        </div>

        {/* CROP MASK VIEWPORT */}
        <div
          ref={containerRef}
          onMouseDown={handleMouseDown}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onWheel={handleWheel}
          style={cropBoxStyle}
          className="relative overflow-hidden bg-[#FFF9E8] border-4 border-[#FFD600] cursor-grab active:cursor-grabbing select-none flex items-center justify-center my-2"
        >
          {/* Background Grid Pattern */}
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#111111_1px,transparent_1px)] [background-size:12px_12px] pointer-events-none" />

          {/* User Image */}
          <img
            src={imageUrl}
            alt="Upload preview"
            draggable={false}
            style={{
              transform: `translate(${adjustment.offsetX}px, ${adjustment.offsetY}px) scale(${adjustment.zoom}) rotate(${adjustment.rotation}deg)`,
              maxWidth: '100%',
              maxHeight: '100%',
              objectFit: 'contain',
              userSelect: 'none',
              pointerEvents: 'none',
              transition: isDragging ? 'none' : 'transform 0.05s ease-out',
            }}
          />

          {/* Rule of Thirds Grid Overlay */}
          <div className="absolute inset-0 border border-[#111111]/20 pointer-events-none grid grid-cols-3 grid-rows-3">
            <div className="border-r border-b border-[#111111]/15" />
            <div className="border-r border-b border-[#111111]/15" />
            <div className="border-b border-[#111111]/15" />
            <div className="border-r border-b border-[#111111]/15" />
            <div className="border-r border-b border-[#111111]/15" />
            <div className="border-b border-[#111111]/15" />
            <div className="border-r border-[#111111]/15" />
            <div className="border-r border-[#111111]/15" />
            <div />
          </div>

          {/* Fixed Frame Indicator Stamp */}
          <div className="absolute bottom-2 right-2 bg-black/80 text-[#FFD600] font-mono-custom text-[10px] font-bold px-2 py-0.5 rounded border border-[#FFD600] pointer-events-none">
            {format === 'PFP' ? 'SQUARE 1:1 CROP' : 'ID PHOTO SLOT'}
          </div>
        </div>

        {/* CONTROLS BAR */}
        <div className="w-full bg-[#222222] p-3 rounded-xl border border-gray-700 mt-2 flex flex-col gap-3">
          {/* Zoom Slider */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleZoomChange(adjustment.zoom - 0.1)}
              className="p-1.5 bg-[#333333] hover:bg-[#444444] text-[#FFD600] rounded border border-gray-600 transition-colors"
              title="Zoom Out"
            >
              <ZoomOut className="w-4 h-4" />
            </button>

            <input
              type="range"
              min="0.4"
              max="3.0"
              step="0.05"
              value={adjustment.zoom}
              onChange={(e) => handleZoomChange(parseFloat(e.target.value))}
              className="flex-1 accent-[#FF007A] cursor-pointer"
            />

            <button
              onClick={() => handleZoomChange(adjustment.zoom + 0.1)}
              className="p-1.5 bg-[#333333] hover:bg-[#444444] text-[#FFD600] rounded border border-gray-600 transition-colors"
              title="Zoom In"
            >
              <ZoomIn className="w-4 h-4" />
            </button>

            <span className="font-mono-custom text-xs text-[#FFD600] font-bold w-12 text-right">
              {Math.round(adjustment.zoom * 100)}%
            </span>
          </div>

          {/* Directional Nudge Buttons & Reset */}
          <div className="flex items-center justify-between gap-2 border-t border-gray-700 pt-2">
            <div className="flex items-center gap-1">
              <span className="font-mono-custom text-[11px] text-gray-400 mr-1">NUDGE:</span>
              <button
                onClick={() => handleNudge(-15, 0)}
                className="p-1.5 bg-[#333333] hover:bg-[#444444] text-white rounded border border-gray-600"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => handleNudge(15, 0)}
                className="p-1.5 bg-[#333333] hover:bg-[#444444] text-white rounded border border-gray-600"
              >
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => handleNudge(0, -15)}
                className="p-1.5 bg-[#333333] hover:bg-[#444444] text-white rounded border border-gray-600"
              >
                <ArrowUp className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => handleNudge(0, 15)}
                className="p-1.5 bg-[#333333] hover:bg-[#444444] text-white rounded border border-gray-600"
              >
                <ArrowDown className="w-3.5 h-3.5" />
              </button>
            </div>

            <button
              onClick={handleReset}
              className="flex items-center gap-1 font-mono-custom text-xs font-bold text-[#FF007A] hover:text-white px-2.5 py-1 rounded bg-[#333333] border border-gray-600 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" /> RESET
            </button>
          </div>
        </div>
      </div>

      {/* NAVIGATION BUTTONS */}
      <div className="w-full flex items-center justify-between gap-4 max-w-md">
        <button
          onClick={onBack}
          className="flex-1 py-3 px-4 bg-[#FFF9E8] hover:bg-gray-100 text-[#111111] font-mono-custom text-xs font-bold border-2 border-black rounded-xl shadow-[3px_3px_0px_#111111] active:translate-y-0.5 transition-all flex items-center justify-center gap-2"
        >
          ← BACK
        </button>

        <button
          onClick={handleContinueWithCrop}
          disabled={isCropping}
          className="flex-1 py-3 px-6 bg-[#FF007A] hover:bg-[#e0006c] text-white font-mono-custom text-xs font-bold border-2 border-black rounded-xl shadow-[4px_4px_0px_#111111] active:translate-y-0.5 transition-all flex items-center justify-center gap-2 disabled:opacity-75"
        >
          {isCropping ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              CROPPING...
            </>
          ) : (
            'CONTINUE →'
          )}
        </button>
      </div>
    </div>
  );
};
