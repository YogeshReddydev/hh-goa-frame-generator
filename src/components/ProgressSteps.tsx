import React from 'react';
import { AppStep, FrameFormat } from '../types';

interface ProgressStepsProps {
  currentStep: AppStep;
  format: FrameFormat;
  onStepClick?: (step: AppStep) => void;
}

export const ProgressSteps: React.FC<ProgressStepsProps> = ({ currentStep, format, onStepClick }) => {
  // Define steps according to format
  const steps: { id: AppStep; label: string; number: string }[] = format === 'PFP' ? [
    { id: 'FORMAT_SELECT', label: 'FORMAT', number: '01' },
    { id: 'PHOTO_UPLOAD', label: 'PHOTO', number: '02' },
    { id: 'CROP', label: 'CROP', number: '03' },
    { id: 'PREVIEW', label: 'PREVIEW', number: '04' },
    { id: 'GENERATED', label: 'READY', number: '05' },
  ] : [
    { id: 'FORMAT_SELECT', label: 'FORMAT', number: '01' },
    { id: 'PHOTO_UPLOAD', label: 'PHOTO', number: '02' },
    { id: 'CROP', label: 'CROP', number: '03' },
    { id: 'DETAILS', label: 'DETAILS', number: '04' },
    { id: 'PREVIEW', label: 'PREVIEW', number: '05' },
    { id: 'GENERATED', label: 'READY', number: '06' },
  ];

  const getStepIndex = (step: AppStep) => steps.findIndex(s => s.id === step);
  const currentIndex = getStepIndex(currentStep);

  if (currentStep === 'LANDING') return null;

  return (
    <div className="w-full bg-[#111111] text-[#FFF9E8] py-2.5 px-3 border-b-4 border-[#FFD600] overflow-x-auto shadow-md">
      <div className="max-w-4xl mx-auto flex items-center justify-between min-w-[340px]">
        {steps.map((step, idx) => {
          const isActive = step.id === currentStep;
          const isCompleted = idx < currentIndex;
          const isClickable = isCompleted && onStepClick;

          return (
            <React.Fragment key={step.id}>
              {idx > 0 && (
                <div 
                  className={`h-0.5 flex-1 mx-1 sm:mx-2 transition-colors duration-300 ${
                    idx <= currentIndex ? 'bg-[#FFD600]' : 'bg-gray-700'
                  }`} 
                />
              )}
              <button
                disabled={!isClickable}
                onClick={() => isClickable && onStepClick(step.id)}
                className={`flex items-center gap-1.5 px-2 py-1 rounded transition-all font-mono-custom text-xs font-bold whitespace-nowrap ${
                  isActive
                    ? 'bg-[#FF007A] text-white shadow-[2px_2px_0px_#FFD600] scale-105'
                    : isCompleted
                    ? 'bg-[#006B3C] text-[#FFD600] cursor-pointer hover:bg-[#00502D]'
                    : 'text-gray-400 opacity-60 cursor-not-allowed'
                }`}
              >
                <span className={`text-[10px] px-1 py-0.2 rounded ${
                  isActive ? 'bg-black text-[#FFD600]' : isCompleted ? 'bg-[#FFD600] text-black' : 'bg-gray-800'
                }`}>
                  {isCompleted ? '✓' : step.number}
                </span>
                <span className="hidden sm:inline">{step.label}</span>
              </button>
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};
