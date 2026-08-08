import React, { useRef, useState } from 'react';
import { Upload, Camera, Image as ImageIcon, AlertCircle, RefreshCw } from 'lucide-react';
import { PalmTreeIcon, TropicalSun, WaveIcon } from './DecorativeElements';
import heic2any from 'heic2any';

interface PhotoUploaderProps {
  onImageSelected: (file: File, dataUrl: string) => void;
  hasImage: boolean;
  imagePreviewUrl: string | null;
  onClearImage: () => void;
}

export const PhotoUploader: React.FC<PhotoUploaderProps> = ({
  onImageSelected,
  hasImage,
  imagePreviewUrl,
  onClearImage,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const processFile = async (file: File) => {
    setErrorMsg(null);
    setIsLoading(true);

    try {
      let finalFile = file;

      // Handle HEIC/HEIF conversion
      const fileName = file.name.toLowerCase();
      if (fileName.endsWith('.heic') || fileName.endsWith('.heif') || file.type === 'image/heic') {
        try {
          const convertedBlob = await heic2any({
            blob: file,
            toType: 'image/jpeg',
            quality: 0.9,
          });
          const blobToUse = Array.isArray(convertedBlob) ? convertedBlob[0] : convertedBlob;
          finalFile = new File([blobToUse], file.name.replace(/\.(heic|heif)$/i, '.jpg'), {
            type: 'image/jpeg',
          });
        } catch (err) {
          console.warn('HEIC conversion warning:', err);
          // Fall through to standard FileReader
        }
      }

      // Check file type
      if (!finalFile.type.startsWith('image/')) {
        setErrorMsg("Hmm. Goa couldn't read that photo. Try a JPG, PNG or HEIC.");
        setIsLoading(false);
        return;
      }

      // Read as Data URL
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        if (result) {
          onImageSelected(finalFile, result);
        } else {
          setErrorMsg('Failed to process image file. Please try another photo.');
        }
        setIsLoading(false);
      };
      reader.onerror = () => {
        setErrorMsg('Error reading file. Try selecting a different photo.');
        setIsLoading(false);
      };
      reader.readAsDataURL(finalFile);
    } catch (err) {
      console.error('File process error:', err);
      setErrorMsg("Hmm. Goa couldn't read that photo. Try a JPG, PNG or HEIC.");
      setIsLoading(false);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Hidden File Inputs */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileInputChange}
        accept="image/png, image/jpeg, image/webp, image/heic, image/heif"
        className="hidden"
      />
      <input
        type="file"
        ref={cameraInputRef}
        onChange={handleFileInputChange}
        accept="image/*"
        capture="user"
        className="hidden"
      />

      {/* Main Upload Box */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`relative rounded-2xl border-4 border-[#111111] p-6 text-center transition-all ${
          isDragging
            ? 'bg-[#FFD600] border-dashed shadow-[8px_8px_0px_#111111]'
            : 'bg-[#FFF9E8] shadow-[6px_6px_0px_#111111]'
        }`}
      >
        {isLoading ? (
          <div className="py-12 flex flex-col items-center justify-center gap-3">
            <RefreshCw className="w-10 h-10 text-[#FF007A] animate-spin" />
            <p className="font-mono-custom text-sm font-bold text-[#111111]">
              PROCESSING YOUR GOA PHOTO...
            </p>
          </div>
        ) : hasImage && imagePreviewUrl ? (
          /* PREVIEW STATE */
          <div className="py-4 flex flex-col items-center animate-card-pop-in">
            <div className="relative group mb-4">
              <img
                src={imagePreviewUrl}
                alt="Selected Preview"
                className="w-48 h-48 sm:w-56 sm:h-56 object-cover rounded-xl border-4 border-[#111111] shadow-[4px_4px_0px_#111111] transition-transform duration-300 transform group-hover:scale-[1.02]"
              />
              <div className="absolute top-2 right-2 bg-[#FF007A] text-white font-mono-custom text-xs font-bold px-2 py-0.5 border border-[#111111] shadow">
                UPLOADED
              </div>
            </div>

            <p className="font-mono-custom text-xs font-bold text-[#006B3C] mb-4">
              ✓ PHOTO READY! ADJUST POSITION BELOW IF NEEDED.
            </p>

            <button
              onClick={onClearImage}
              className="btn-goa-cream text-xs font-mono-custom font-bold px-4 py-2 flex items-center gap-2 cursor-pointer"
            >
              <RefreshCw className="w-4 h-4 text-[#FF007A]" />
              <span>CHANGE PHOTO</span>
            </button>
          </div>
        ) : (
          /* EMPTY UPLOAD STATE */
          <div className="py-6 flex flex-col items-center">
            {/* Illustrated Tropical Goa Scene */}
            <div className="flex items-center justify-center gap-4 mb-4 animate-float-gentle">
              <PalmTreeIcon className="w-12 h-14 animate-sway" />
              <div className="bg-[#FFD600] text-[#111111] font-display text-lg px-4 py-1.5 border-3 border-[#111111] shadow-[3px_3px_0px_#111111] transform -rotate-2">
                YOUR PHOTO GOES HERE →
              </div>
              <TropicalSun className="w-10 h-10 animate-sun-pulse" />
            </div>

            {/* Heading */}
            <h3 className="font-display text-4xl sm:text-5xl text-[#111111] mb-1">
              DROP YOUR PHOTO.
            </h3>
            <p className="font-body text-xs sm:text-sm font-semibold text-[#111111]/70 mb-6 max-w-md">
              Portrait. Landscape. Cropped. Off-center. We'll handle it seamlessly.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 w-full max-w-md mb-4">
              <button
                onClick={() => fileInputRef.current?.click()}
                className="btn-goa-yellow w-full sm:w-auto font-display text-lg px-6 py-3 flex items-center justify-center gap-2 cursor-pointer"
              >
                <Upload className="w-5 h-5" />
                <span>SELECT PHOTO</span>
              </button>

              <button
                onClick={() => cameraInputRef.current?.click()}
                className="btn-goa-pink w-full sm:w-auto font-display text-lg px-6 py-3 flex items-center justify-center gap-2 cursor-pointer"
              >
                <Camera className="w-5 h-5" />
                <span>TAKE A PHOTO</span>
              </button>
            </div>

            {/* Quick Demo Sample Photo Loader */}
            <button
              onClick={() => {
                const sampleSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="600" viewBox="0 0 600 600"><rect width="600" height="600" fill="#006B3C"/><circle cx="300" cy="240" r="160" fill="#FFD600" stroke="#111111" stroke-width="8"/><path d="M300 40 V60 M300 420 V440 M100 240 H120 M480 240 H500" stroke="#111111" stroke-width="8" stroke-linecap="round"/><path d="M0 480 C150 450 150 510 300 480 C450 450 450 510 600 480 L600 600 L0 600 Z" fill="#FF007A" stroke="#111111" stroke-width="8"/><ellipse cx="300" cy="580" rx="180" ry="120" fill="#FFF9E8" stroke="#111111" stroke-width="8"/><circle cx="300" cy="320" r="100" fill="#FFF9E8" stroke="#111111" stroke-width="8"/><rect x="220" y="300" width="70" height="40" rx="10" fill="#111111"/><rect x="310" y="300" width="70" height="40" rx="10" fill="#111111"/><line x1="290" y1="315" x2="310" y2="315" stroke="#111111" stroke-width="8"/><path d="M80 480 C80 300 60 200 40 150" stroke="#111111" stroke-width="12" stroke-linecap="round"/><path d="M520 480 C520 300 540 200 560 150" stroke="#111111" stroke-width="12" stroke-linecap="round"/><text x="300" y="210" font-family="sans-serif" font-weight="900" font-size="32" fill="#111111" text-anchor="middle">GOA BUILDER</text></svg>`;
                const sampleUrl = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(sampleSvg);
                const dummyFile = new File(["demo"], "demo_hacker_goa.png", { type: "image/png" });
                onImageSelected(dummyFile, sampleUrl);
              }}
              className="font-mono-custom text-xs font-bold text-[#FFD600] underline hover:text-[#FF007A] transition-colors cursor-pointer mb-3"
            >
              ★ DON'T HAVE A PHOTO? USE SAMPLE GOA BUILDER AVATAR ★
            </button>

            <p className="font-mono-custom text-[11px] text-[#111111]/60">
              SUPPORTS JPG, PNG, WEBP & HEIC • 100% PRIVATE & IN-BROWSER
            </p>
          </div>
        )}

        {/* Error Alert Box */}
        {errorMsg && (
          <div className="mt-4 bg-[#FF007A] text-white p-3 border-2 border-[#111111] font-mono-custom text-xs flex items-center gap-2 text-left">
            <AlertCircle className="w-5 h-5 flex-shrink-0 text-[#FFD600]" />
            <span>{errorMsg}</span>
          </div>
        )}
      </div>
    </div>
  );
};
