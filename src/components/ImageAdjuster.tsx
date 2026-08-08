import React from 'react';
import { ImageAdjustment } from '../types';
import { ZoomIn, ZoomOut, ArrowLeft, ArrowRight, ArrowUp, ArrowDown, RotateCcw } from 'lucide-react';

interface ImageAdjusterProps {
  adjustment: ImageAdjustment;
  onChange: (adjustment: ImageAdjustment) => void;
}

export const ImageAdjuster: React.FC<ImageAdjusterProps> = ({ adjustment, onChange }) => {
  const stepPosition = 20;
  const stepZoom = 0.15;

  const handleZoomIn = () => {
    onChange({ ...adjustment, zoom: Math.min(3.0, adjustment.zoom + stepZoom) });
  };

  const handleZoomOut = () => {
    onChange({ ...adjustment, zoom: Math.max(0.4, adjustment.zoom - stepZoom) });
  };

  const handleMove = (dx: number, dy: number) => {
    onChange({
      ...adjustment,
      offsetX: adjustment.offsetX + dx,
      offsetY: adjustment.offsetY + dy,
    });
  };

  const handleReset = () => {
    onChange({ zoom: 1.0, offsetX: 0, offsetY: 0, rotation: 0 });
  };

  return (
    <div className="bg-[#FFF9E8] text-[#111111] p-4 rounded-xl border-3 border-[#111111] shadow-[4px_4px_0px_#111111]">
      <div className="flex items-center justify-between mb-3 border-b-2 border-[#111111] pb-2">
        <span className="font-display text-xl font-bold">PHOTO POSITIONING</span>
        <button
          onClick={handleReset}
          className="btn-goa-pink px-2 py-1 text-[11px] font-mono-custom font-bold flex items-center gap-1 cursor-pointer"
          title="Reset Alignment"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>RESET</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Zoom Controls */}
        <div>
          <label className="font-mono-custom text-xs font-bold block mb-1.5 text-[#111111]">
            ZOOM: {Math.round(adjustment.zoom * 100)}%
          </label>
          <div className="flex items-center gap-2">
            <button
              onClick={handleZoomOut}
              className="btn-goa-cream p-2 flex items-center justify-center cursor-pointer"
              title="Zoom Out"
            >
              <ZoomOut className="w-5 h-5 text-[#111111]" />
            </button>
            <input
              type="range"
              min="0.4"
              max="3.0"
              step="0.05"
              value={adjustment.zoom}
              onChange={(e) => onChange({ ...adjustment, zoom: parseFloat(e.target.value) })}
              className="w-full accent-[#FF007A] cursor-pointer"
            />
            <button
              onClick={handleZoomIn}
              className="btn-goa-cream p-2 flex items-center justify-center cursor-pointer"
              title="Zoom In"
            >
              <ZoomIn className="w-5 h-5 text-[#111111]" />
            </button>
          </div>
        </div>

        {/* Direction Pad Controls */}
        <div>
          <label className="font-mono-custom text-xs font-bold block mb-1.5 text-[#111111]">
            PAN POSITION
          </label>
          <div className="flex items-center justify-center gap-1.5">
            <button
              onClick={() => handleMove(-stepPosition, 0)}
              className="btn-goa-cream p-2 cursor-pointer"
              title="Move Left"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div className="flex flex-col gap-1">
              <button
                onClick={() => handleMove(0, -stepPosition)}
                className="btn-goa-cream p-2 cursor-pointer"
                title="Move Up"
              >
                <ArrowUp className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleMove(0, stepPosition)}
                className="btn-goa-cream p-2 cursor-pointer"
                title="Move Down"
              >
                <ArrowDown className="w-4 h-4" />
              </button>
            </div>
            <button
              onClick={() => handleMove(stepPosition, 0)}
              className="btn-goa-cream p-2 cursor-pointer"
              title="Move Right"
            >
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
