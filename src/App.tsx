import React, { useState, useEffect } from 'react';
import { AppStep, FrameFormat, ImageAdjustment, BuilderData } from './types';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { LandingPage } from './components/LandingPage';
import { FormatSelector } from './components/FormatSelector';
import { PhotoUploader } from './components/PhotoUploader';
import { CropEditor } from './components/CropEditor';
import { ParticipantForm } from './components/ParticipantForm';
import { PreviewScreen } from './components/PreviewScreen';
import { ResultScreen } from './components/ResultScreen';
import { ProgressSteps } from './components/ProgressSteps';
import { generateFrameCanvas } from './utils/canvasGenerator';
import { renderCroppedImage } from './utils/cropUtils';
import { SAMPLE_INDIAN_PARTICIPANTS } from './data/builderTitles';

export default function App() {
  const [currentStep, setCurrentStep] = useState<AppStep>('LANDING');
  const [selectedFormat, setSelectedFormat] = useState<FrameFormat>('PFP');

  // Photo State
  const [uploadedImageFile, setUploadedImageFile] = useState<File | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
  const [imageElement, setImageElement] = useState<HTMLImageElement | null>(null);

  // Cropped Image State (Generated from Crop step)
  const [croppedImageElement, setCroppedImageElement] = useState<HTMLImageElement | null>(null);
  const [croppedDataUrl, setCroppedDataUrl] = useState<string | null>(null);

  // Position / Zoom Adjustment State
  const [adjustment, setAdjustment] = useState<ImageAdjustment>({
    zoom: 1.0,
    offsetX: 0,
    offsetY: 0,
    rotation: 0,
  });

  // Builder Card Form State with Indian sample defaults
  const [builderData, setBuilderData] = useState<BuilderData>({
    name: 'Aarav Sharma',
    role: 'Full Stack Development',
    city: 'Bengaluru, India',
    builderTitle: 'THE SYSTEM BUILDER',
    buildingText: 'Building scalable distributed systems & local AI agents for web apps.',
    themeStyle: 'CLASSIC_GOA',
  });

  // Generated Canvas Result Data URL
  const [generatedDataUrl, setGeneratedDataUrl] = useState<string | null>(null);

  // Handle Photo Upload Selection
  const handleImageSelected = (file: File, dataUrl: string) => {
    setUploadedImageFile(file);
    setImagePreviewUrl(dataUrl);
    setCroppedImageElement(null);
    setCroppedDataUrl(null);
    setAdjustment({ zoom: 1.0, offsetX: 0, offsetY: 0, rotation: 0 });

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      setImageElement(img);
      // Auto move to Crop Step upon successful image load
      setCurrentStep('CROP');
    };
    img.onerror = () => {
      console.error('Failed to load image element');
    };
    img.src = dataUrl;
  };

  const handleClearImage = () => {
    setUploadedImageFile(null);
    setImagePreviewUrl(null);
    setImageElement(null);
    setCroppedImageElement(null);
    setCroppedDataUrl(null);
    setAdjustment({ zoom: 1.0, offsetX: 0, offsetY: 0, rotation: 0 });
  };

  // Load Full Demo Sample Participant Data + Sample Avatar
  const handleLoadDemoSample = () => {
    const sample = SAMPLE_INDIAN_PARTICIPANTS[0]; // Ananya Rao from Hyderabad
    setBuilderData({
      name: sample.name,
      role: sample.role,
      city: sample.city,
      builderTitle: sample.builderTitle,
      buildingText: sample.buildingText,
      themeStyle: 'CLASSIC_GOA',
    });

    const sampleSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="600" viewBox="0 0 600 600"><rect width="600" height="600" fill="#006B3C"/><circle cx="300" cy="240" r="160" fill="#FFD600" stroke="#111111" stroke-width="8"/><path d="M300 40 V60 M300 420 V440 M100 240 H120 M480 240 H500" stroke="#111111" stroke-width="8" stroke-linecap="round"/><path d="M0 480 C150 450 150 510 300 480 C450 450 450 510 600 480 L600 600 L0 600 Z" fill="#FF007A" stroke="#111111" stroke-width="8"/><ellipse cx="300" cy="580" rx="180" ry="120" fill="#FFF9E8" stroke="#111111" stroke-width="8"/><circle cx="300" cy="320" r="100" fill="#FFF9E8" stroke="#111111" stroke-width="8"/><rect x="220" y="300" width="70" height="40" rx="10" fill="#111111"/><rect x="310" y="300" width="70" height="40" rx="10" fill="#111111"/><line x1="290" y1="315" x2="310" y2="315" stroke="#111111" stroke-width="8"/><path d="M80 480 C80 300 60 200 40 150" stroke="#111111" stroke-width="12" stroke-linecap="round"/><path d="M520 480 C520 300 540 200 560 150" stroke="#111111" stroke-width="12" stroke-linecap="round"/><text x="300" y="210" font-family="sans-serif" font-weight="900" font-size="32" fill="#111111" text-anchor="middle">GOA BUILDER</text></svg>`;
    const sampleUrl = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(sampleSvg);
    const dummyFile = new File(["demo"], "demo_hacker_goa.png", { type: "image/png" });

    handleImageSelected(dummyFile, sampleUrl);
  };

  // Final Canvas Generation
  const handleGenerateFinal = async () => {
    try {
      let activeCroppedImg = croppedImageElement;
      if (!activeCroppedImg && imageElement) {
        const cropRes = await renderCroppedImage(imageElement, selectedFormat, adjustment);
        activeCroppedImg = cropRes.croppedImageElement;
        setCroppedImageElement(cropRes.croppedImageElement);
        setCroppedDataUrl(cropRes.croppedDataUrl);
      }

      if (!activeCroppedImg) {
        alert('Photo missing. Please select and crop a photo first.');
        setCurrentStep('CROP');
        return;
      }

      const finalUrl = await generateFrameCanvas({
        format: selectedFormat,
        croppedImageElement: activeCroppedImg,
        imageElement,
        adjustment,
        builderData,
      });

      setGeneratedDataUrl(finalUrl);
      setCurrentStep('GENERATED');
    } catch (err) {
      console.error('Final generation error:', err);
    }
  };

  // Reset Flow
  const handleReset = () => {
    handleClearImage();
    setSelectedFormat('PFP');
    setCurrentStep('LANDING');
    setGeneratedDataUrl(null);
  };

  // Step Click Handler for Progress Bar
  const handleStepClick = (step: AppStep) => {
    setCurrentStep(step);
  };

  return (
    <div className="min-h-screen goa-pattern-bg text-[#FFF9E8] flex flex-col font-body selection:bg-[#FF007A] selection:text-white">
      {/* Navigation Header */}
      <Header
        currentStep={currentStep}
        onGoHome={() => setCurrentStep('LANDING')}
        onReset={handleReset}
      />

      {/* Progress Steps Bar */}
      {currentStep !== 'LANDING' && (
        <ProgressSteps
          currentStep={currentStep}
          format={selectedFormat}
          onStepClick={handleStepClick}
        />
      )}

      {/* App Body Content Router */}
      <main className="flex-1 w-full pb-12">
        {/* STEP 0: LANDING / WELCOME */}
        {currentStep === 'LANDING' && (
          <LandingPage
            onStartBuilding={() => setCurrentStep('FORMAT_SELECT')}
            onSelectPfp={() => {
              setSelectedFormat('PFP');
              setCurrentStep('PHOTO_UPLOAD');
            }}
            onSelectBuilderId={() => {
              setSelectedFormat('BUILDER_ID');
              setCurrentStep('PHOTO_UPLOAD');
            }}
          />
        )}

        {/* STEP 1: CHOOSE FORMAT */}
        {currentStep === 'FORMAT_SELECT' && (
          <FormatSelector
            selectedFormat={selectedFormat}
            onSelectFormat={(format) => {
              setSelectedFormat(format);
              setCurrentStep('PHOTO_UPLOAD');
            }}
          />
        )}

        {/* STEP 2: UPLOAD PHOTO */}
        {currentStep === 'PHOTO_UPLOAD' && (
          <div className="max-w-2xl mx-auto px-4 py-8">
            <div className="text-center mb-6">
              <span className="inline-block bg-[#FFD600] text-black font-mono-custom text-xs font-bold px-3 py-1 border-2 border-black shadow-[2px_2px_0px_#111111] mb-2 transform -rotate-1">
                STEP 02: UPLOAD YOUR PHOTO
              </span>
              <h2 className="font-bebas text-4xl sm:text-5xl tracking-wide text-[#111111]">
                {selectedFormat === 'PFP' ? 'PFP FRAME CREATOR' : 'BUILDER ID PASSPORT'}
              </h2>
              <p className="font-mono-custom text-xs text-[#111111]/80 mt-1">
                Select or drop a photo. Portrait, landscape, or mobile selfie.
              </p>
            </div>

            <PhotoUploader
              onImageSelected={handleImageSelected}
              hasImage={!!imagePreviewUrl}
              imagePreviewUrl={imagePreviewUrl}
              onClearImage={handleClearImage}
            />

            {/* Quick Demo Mode Trigger Button */}
            <div className="mt-6 text-center">
              <button
                onClick={handleLoadDemoSample}
                className="bg-[#006B3C] hover:bg-[#00502D] text-[#FFD600] font-mono-custom text-xs font-bold px-5 py-2.5 rounded-xl border-2 border-black shadow-[3px_3px_0px_#111111] transition-transform active:scale-95"
              >
                ★ TRY A DEMO WITH SAMPLE INDIAN BUILDER DATA ★
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: CROP & ALIGN PHOTO */}
        {currentStep === 'CROP' && imagePreviewUrl && (
          <CropEditor
            imageUrl={imagePreviewUrl}
            imageElement={imageElement}
            format={selectedFormat}
            adjustment={adjustment}
            onAdjustmentChange={(newAdj) => setAdjustment(newAdj)}
            onCropComplete={(croppedImg, dataUrl) => {
              setCroppedImageElement(croppedImg);
              setCroppedDataUrl(dataUrl);
            }}
            onBack={() => setCurrentStep('PHOTO_UPLOAD')}
            onContinue={() => {
              if (selectedFormat === 'BUILDER_ID') {
                setCurrentStep('DETAILS');
              } else {
                setCurrentStep('PREVIEW');
              }
            }}
          />
        )}

        {/* STEP 4: ENTER PARTICIPANT DETAILS (Builder ID mode only) */}
        {currentStep === 'DETAILS' && (
          <ParticipantForm
            builderData={builderData}
            onDataChange={(newData) => setBuilderData(newData)}
            onBack={() => setCurrentStep('CROP')}
            onContinue={() => setCurrentStep('PREVIEW')}
            onLoadDemoSample={handleLoadDemoSample}
          />
        )}

        {/* STEP 5: PREVIEW */}
        {currentStep === 'PREVIEW' && (
          <PreviewScreen
            croppedImageElement={croppedImageElement}
            imageElement={imageElement}
            adjustment={adjustment}
            builderData={builderData}
            format={selectedFormat}
            onEdit={() => {
              if (selectedFormat === 'BUILDER_ID') {
                setCurrentStep('DETAILS');
              } else {
                setCurrentStep('CROP');
              }
            }}
            onGenerate={handleGenerateFinal}
          />
        )}

        {/* STEP 6 & 7: FINAL GENERATED ID RESULT */}
        {currentStep === 'GENERATED' && (
          <ResultScreen
            generatedDataUrl={generatedDataUrl}
            onEdit={() => {
              if (selectedFormat === 'BUILDER_ID') {
                setCurrentStep('DETAILS');
              } else {
                setCurrentStep('CROP');
              }
            }}
            onCreateAnother={handleReset}
            builderName={builderData.name}
            builderData={builderData}
            isPfp={selectedFormat === 'PFP'}
          />
        )}
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
