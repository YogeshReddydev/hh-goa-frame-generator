import React, { useState, useEffect } from 'react';
import { BuilderData, ThemeStyle } from '../types';
import { ROLES_AND_STACKS, INDIAN_CITIES, generateTitleForRole, getRandomBuilderTitle, SAMPLE_INDIAN_PARTICIPANTS } from '../data/builderTitles';
import { RefreshCw, Sparkles, Palette, Check } from 'lucide-react';

interface ParticipantFormProps {
  builderData: BuilderData;
  onDataChange: (data: BuilderData) => void;
  onBack: () => void;
  onContinue: () => void;
  onLoadDemoSample?: () => void;
}

const THEME_OPTIONS: { id: ThemeStyle; label: string; tag: string; swatches: string[] }[] = [
  {
    id: 'CLASSIC_GOA',
    label: 'Sunset Goa',
    tag: 'Tropical Emerald',
    swatches: ['#006B3C', '#FFD600', '#FF007A'],
  },
  {
    id: 'SUNSET_PINK',
    label: 'Sunset Pink',
    tag: 'Vibrant Beach',
    swatches: ['#C70039', '#FF007A', '#FFD600'],
  },
  {
    id: 'DEEP_SEA',
    label: 'Deep Sea',
    tag: 'Ocean Cyan',
    swatches: ['#0B2545', '#00E5FF', '#FFD600'],
  },
  {
    id: 'CYBER_GOA',
    label: 'Cyber Goa',
    tag: 'Neon Dark',
    swatches: ['#121214', '#00FF66', '#FF007A'],
  },
];

export const ParticipantForm: React.FC<ParticipantFormProps> = ({
  builderData,
  onDataChange,
  onBack,
  onContinue,
  onLoadDemoSample,
}) => {
  // Determine if current role/city match predefined lists (excluding 'Other')
  const isPresetRole = ROLES_AND_STACKS.filter((r) => r !== 'Other').includes(builderData.role);
  const isPresetCity = INDIAN_CITIES.filter((c) => c !== 'Other').includes(builderData.city);

  // States to track if 'Other' mode was manually chosen
  const [isOtherRoleSelected, setIsOtherRoleSelected] = useState(!isPresetRole && builderData.role !== '');
  const [isOtherCitySelected, setIsOtherCitySelected] = useState(!isPresetCity && builderData.city !== '');

  // Keep 'Other' mode flags in sync when builderData is updated externally (e.g. sample presets)
  useEffect(() => {
    if (isPresetRole) {
      setIsOtherRoleSelected(false);
    }
  }, [builderData.role, isPresetRole]);

  useEffect(() => {
    if (isPresetCity) {
      setIsOtherCitySelected(false);
    }
  }, [builderData.city, isPresetCity]);

  const handleRoleChange = (newRole: string) => {
    const autoTitle = generateTitleForRole(newRole);
    onDataChange({
      ...builderData,
      role: newRole,
      builderTitle: autoTitle,
    });
  };

  const handleRoleSelect = (selectedVal: string) => {
    if (selectedVal === 'Other') {
      setIsOtherRoleSelected(true);
      if (isPresetRole) {
        handleRoleChange('');
      }
    } else {
      setIsOtherRoleSelected(false);
      handleRoleChange(selectedVal);
    }
  };

  const handleCitySelect = (selectedVal: string) => {
    if (selectedVal === 'Other') {
      setIsOtherCitySelected(true);
      if (isPresetCity) {
        onDataChange({ ...builderData, city: '' });
      }
    } else {
      setIsOtherCitySelected(false);
      onDataChange({ ...builderData, city: selectedVal });
    }
  };

  const handleShuffleTitle = () => {
    const newTitle = getRandomBuilderTitle(builderData.builderTitle);
    onDataChange({
      ...builderData,
      builderTitle: newTitle,
    });
  };

  const handleSelectSample = (sample: typeof SAMPLE_INDIAN_PARTICIPANTS[0]) => {
    setIsOtherRoleSelected(false);
    setIsOtherCitySelected(false);
    onDataChange({
      ...builderData,
      name: sample.name,
      role: sample.role,
      city: sample.city,
      builderTitle: sample.builderTitle,
      buildingText: sample.buildingText,
    });
  };

  const isFormValid = builderData.name.trim().length > 0 && builderData.role.trim().length > 0;

  // Selected dropdown values
  const roleSelectValue = isOtherRoleSelected ? 'Other' : (isPresetRole ? builderData.role : (builderData.role ? 'Other' : ''));
  const citySelectValue = isOtherCitySelected ? 'Other' : (isPresetCity ? builderData.city : (builderData.city ? 'Other' : ''));

  return (
    <div className="w-full max-w-xl mx-auto px-4 py-6">
      {/* Header */}
      <div className="text-center mb-6">
        <span className="inline-block bg-[#FFD600] text-black font-mono-custom text-xs font-bold px-3 py-1 border-2 border-black shadow-[2px_2px_0px_#111111] mb-2 transform -rotate-1">
          STEP 04: PARTICIPANT DETAILS
        </span>
        <h2 className="font-bebas text-3xl sm:text-4xl tracking-wide text-[#111111]">
          ENTER YOUR BUILDER IDENTITY
        </h2>
        <p className="font-mono-custom text-xs text-[#111111]/80 max-w-md mx-auto mt-1">
          Provide your details for your official Hacker House Goa 2026 Passport.
        </p>
      </div>

      {/* QUICK DEMO PRESETS BANNER */}
      <div className="bg-[#006B3C] text-[#FFF9E8] p-3.5 rounded-2xl border-3 border-black shadow-[4px_4px_0px_#111111] mb-6">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1.5 font-mono-custom text-xs font-bold text-[#FFD600]">
            <Sparkles className="w-4 h-4 text-[#FFD600]" />
            <span>TRY SAMPLE INDIAN PARTICIPANTS</span>
          </div>
          {onLoadDemoSample && (
            <button
              onClick={onLoadDemoSample}
              className="bg-[#FF007A] hover:bg-[#e0006c] text-white font-mono-custom text-[11px] font-bold px-2.5 py-1 rounded border border-black shadow-[2px_2px_0px_#111111] transition-transform active:scale-95 cursor-pointer"
            >
              ★ FULL DEMO MODE ★
            </button>
          )}
        </div>
        <div className="flex flex-wrap gap-1.5">
          {SAMPLE_INDIAN_PARTICIPANTS.slice(0, 4).map((sample, idx) => (
            <button
              key={idx}
              onClick={() => handleSelectSample(sample)}
              className="bg-[#FFF9E8] hover:bg-[#FFD600] text-[#111111] font-mono-custom text-[11px] font-bold px-2.5 py-1 rounded border border-black transition-colors cursor-pointer"
            >
              + {sample.name} ({sample.city.split(',')[0]})
            </button>
          ))}
        </div>
      </div>

      {/* FORM CARD */}
      <div className="bg-[#FFF9E8] p-5 rounded-2xl border-4 border-[#111111] shadow-[8px_8px_0px_#111111] space-y-4 mb-6">
        {/* Full Name */}
        <div>
          <label className="block font-mono-custom text-xs font-bold text-[#111111] mb-1">
            FULL NAME <span className="text-[#FF007A]">*</span>
          </label>
          <input
            type="text"
            value={builderData.name}
            onChange={(e) => onDataChange({ ...builderData, name: e.target.value })}
            placeholder="e.g. Aarav Sharma"
            className="w-full px-3.5 py-2.5 bg-white border-2 border-black rounded-xl font-sans text-sm font-bold text-[#111111] focus:outline-none focus:ring-2 focus:ring-[#FF007A] shadow-[2px_2px_0px_#111111]"
          />
        </div>

        {/* Role / Stack Selection */}
        <div>
          <label className="block font-mono-custom text-xs font-bold text-[#111111] mb-1">
            ROLE / TECH STACK <span className="text-[#FF007A]">*</span>
          </label>
          <div className="relative">
            <select
              value={roleSelectValue}
              onChange={(e) => handleRoleSelect(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-white border-2 border-black rounded-xl font-sans text-sm font-bold text-[#111111] focus:outline-none focus:ring-2 focus:ring-[#FF007A] shadow-[2px_2px_0px_#111111] appearance-none cursor-pointer pr-10"
            >
              <option value="">Select your stack / role...</option>
              {ROLES_AND_STACKS.map((r, i) => (
                <option key={i} value={r}>
                  {r}
                </option>
              ))}
            </select>
            <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none font-bold text-xs text-[#111111]">
              ▼
            </div>
          </div>

          {/* Conditional Custom Role Input: Appears ONLY when 'Other' is selected */}
          {isOtherRoleSelected && (
            <div className="mt-2.5">
              <label className="block font-mono-custom text-[11px] font-bold text-[#006B3C] mb-1">
                ENTER YOUR ROLE / TECH STACK
              </label>
              <input
                type="text"
                autoFocus
                value={builderData.role}
                onChange={(e) => handleRoleChange(e.target.value)}
                placeholder="e.g. Full Stack Developer, Rust Engineer..."
                className="w-full px-3.5 py-2 bg-white border-2 border-black rounded-xl font-mono-custom text-xs text-[#111111] focus:outline-none focus:ring-2 focus:ring-[#FF007A] shadow-[2px_2px_0px_#111111]"
              />
            </div>
          )}
        </div>

        {/* City / Location Dropdown */}
        <div>
          <label className="block font-mono-custom text-xs font-bold text-[#111111] mb-1">
            LOCATION / CITY <span className="text-[#FF007A]">*</span>
          </label>
          <div className="relative">
            <select
              value={citySelectValue}
              onChange={(e) => handleCitySelect(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-white border-2 border-black rounded-xl font-sans text-sm font-bold text-[#111111] focus:outline-none focus:ring-2 focus:ring-[#FF007A] shadow-[2px_2px_0px_#111111] appearance-none cursor-pointer pr-10"
            >
              <option value="">Select your location...</option>
              {INDIAN_CITIES.map((c, i) => (
                <option key={i} value={c}>
                  {c}
                </option>
              ))}
            </select>
            <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none font-bold text-xs text-[#111111]">
              ▼
            </div>
          </div>

          {/* Conditional Custom Location Input: Appears ONLY when 'Other' is selected */}
          {isOtherCitySelected && (
            <div className="mt-2.5">
              <label className="block font-mono-custom text-[11px] font-bold text-[#006B3C] mb-1">
                ENTER YOUR LOCATION
              </label>
              <input
                type="text"
                autoFocus
                value={builderData.city}
                onChange={(e) => onDataChange({ ...builderData, city: e.target.value })}
                placeholder="e.g. Indore, India or SF, USA..."
                className="w-full px-3.5 py-2 bg-white border-2 border-black rounded-xl font-mono-custom text-xs text-[#111111] focus:outline-none focus:ring-2 focus:ring-[#FF007A] shadow-[2px_2px_0px_#111111]"
              />
            </div>
          )}
        </div>

        {/* Builder Title (Auto-suggested with Shuffle) */}
        <div className="bg-[#FFD600] p-3.5 rounded-xl border-2 border-black shadow-[3px_3px_0px_#111111]">
          <div className="flex items-center justify-between mb-1">
            <span className="font-mono-custom text-[11px] font-bold text-black flex items-center gap-1">
              ⚡ AUTO-GENERATED BUILDER TITLE
            </span>
            <button
              onClick={handleShuffleTitle}
              className="flex items-center gap-1 font-mono-custom text-[11px] font-bold text-white bg-[#FF007A] hover:bg-[#e0006c] px-2.5 py-1 rounded border border-black transition-all active:scale-95 cursor-pointer"
            >
              <RefreshCw className="w-3 h-3" /> CHANGE TITLE
            </button>
          </div>
          <div className="bg-black text-[#FFD600] font-bebas text-2xl tracking-wider px-3 py-1.5 rounded border border-black text-center shadow-inner">
            {builderData.builderTitle || 'THE SYSTEM BUILDER'}
          </div>
        </div>

        {/* FRAME THEME TOGGLE */}
        <div className="pt-1">
          <label className="block font-mono-custom text-xs font-bold text-[#111111] mb-2 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Palette className="w-4 h-4 text-[#FF007A]" /> FRAME THEME STYLE <span className="text-[#FF007A]">*</span>
            </span>
            <span className="text-[10px] font-mono-custom text-[#111111] bg-[#FFD600] px-2 py-0.5 border border-black rounded font-bold">
              PREVIEW THEME
            </span>
          </label>
          <div className="grid grid-cols-2 gap-2.5">
            {THEME_OPTIONS.map((theme) => {
              const isSelected = (builderData.themeStyle || 'CLASSIC_GOA') === theme.id;
              return (
                <button
                  key={theme.id}
                  type="button"
                  onClick={() => onDataChange({ ...builderData, themeStyle: theme.id })}
                  className={`p-3 rounded-xl border-2 text-left transition-all cursor-pointer flex flex-col justify-between ${
                    isSelected
                      ? 'bg-[#111111] text-white border-black shadow-[3px_3px_0px_#FFD600] scale-[1.02]'
                      : 'bg-white hover:bg-yellow-50/50 text-[#111111] border-black/40 hover:border-black shadow-[2px_2px_0px_#111111]'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bebas text-lg tracking-wider leading-none">
                      {theme.label}
                    </span>
                    {isSelected && (
                      <span className="text-[10px] font-mono-custom font-bold bg-[#FF007A] text-white px-1.5 py-0.5 rounded border border-black flex items-center gap-0.5">
                        <Check className="w-3 h-3" /> ACTIVE
                      </span>
                    )}
                  </div>
                  <div className="flex items-center justify-between mt-1">
                    <span className="font-mono-custom text-[10px] opacity-80">
                      {theme.tag}
                    </span>
                    <div className="flex items-center gap-1">
                      {theme.swatches.map((color, idx) => (
                        <span
                          key={idx}
                          className="w-3.5 h-3.5 rounded-full border border-black shadow-xs inline-block"
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Optional: What are you building? */}
        <div>
          <label className="block font-mono-custom text-xs font-bold text-[#111111] mb-1">
            WHAT ARE YOU BUILDING IN GOA? <span className="text-gray-500 font-normal">(OPTIONAL)</span>
          </label>
          <textarea
            rows={2}
            value={builderData.buildingText}
            onChange={(e) => onDataChange({ ...builderData, buildingText: e.target.value })}
            placeholder="e.g. Building AI agents & local hackathon tools on the sunny beaches of Goa!"
            className="w-full px-3.5 py-2 bg-white border-2 border-black rounded-xl font-sans text-sm font-medium text-[#111111] focus:outline-none focus:ring-2 focus:ring-[#FF007A] shadow-[2px_2px_0px_#111111] resize-none"
          />
        </div>
      </div>

      {/* FORM NAVIGATION */}
      <div className="w-full flex items-center justify-between gap-4">
        <button
          onClick={onBack}
          className="flex-1 py-3 px-4 bg-[#FFF9E8] hover:bg-gray-100 text-[#111111] font-mono-custom text-xs font-bold border-2 border-black rounded-xl shadow-[3px_3px_0px_#111111] active:translate-y-0.5 transition-all cursor-pointer"
        >
          ← BACK
        </button>

        <button
          disabled={!isFormValid}
          onClick={onContinue}
          className={`flex-1 py-3 px-6 font-mono-custom text-xs font-bold border-2 border-black rounded-xl shadow-[4px_4px_0px_#111111] transition-all flex items-center justify-center gap-2 ${
            isFormValid
              ? 'bg-[#FF007A] hover:bg-[#e0006c] text-white cursor-pointer active:translate-y-0.5'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed shadow-none'
          }`}
        >
          NEXT: PREVIEW →
        </button>
      </div>
    </div>
  );
};

