import React from 'react';
import { BuilderData } from '../types';
import { ROLES_AND_STACKS, getRandomBuilderTitle, generateTitleForRole } from '../data/builderTitles';
import { RefreshCw, Sparkles, User, Code, Tag, MessageSquare } from 'lucide-react';

interface BuilderIdEditorProps {
  data: BuilderData;
  onChange: (data: BuilderData) => void;
}

export const BuilderIdEditor: React.FC<BuilderIdEditorProps> = ({ data, onChange }) => {
  const handleRoleChange = (role: string) => {
    const autoTitle = generateTitleForRole(role);
    onChange({
      ...data,
      role,
      builderTitle: autoTitle,
    });
  };

  const handleRegenerateTitle = () => {
    const newTitle = getRandomBuilderTitle(data.builderTitle);
    onChange({
      ...data,
      builderTitle: newTitle,
    });
  };

  return (
    <div className="bg-[#FFF9E8] text-[#111111] p-5 rounded-2xl border-4 border-[#111111] shadow-[6px_6px_0px_#111111] space-y-4">
      {/* Title */}
      <div className="flex items-center justify-between border-b-3 border-[#111111] pb-2">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-[#FF007A]" />
          <span className="font-display text-2xl text-[#111111]">BUILDER IDENTITY DETAILS</span>
        </div>
        <span className="bg-[#FFD600] text-[#111111] font-mono-custom text-[11px] font-bold px-2 py-0.5 border border-[#111111]">
          PASSPORT INFO
        </span>
      </div>

      {/* Field 1: Name */}
      <div>
        <label className="font-mono-custom text-xs font-bold flex items-center gap-1.5 mb-1 text-[#111111]">
          <User className="w-4 h-4 text-[#FF007A]" />
          <span>YOUR NAME / HANDLE</span>
        </label>
        <input
          type="text"
          value={data.name}
          onChange={(e) => onChange({ ...data, name: e.target.value })}
          placeholder="e.g. YOGESH REDDY"
          maxLength={25}
          className="w-full bg-white text-[#111111] font-mono-custom text-sm font-bold p-3 border-3 border-[#111111] shadow-[2px_2px_0px_#111111] focus:outline-none focus:bg-[#FFD600]/20"
        />
      </div>

      {/* Field 2: Stack / Role */}
      <div>
        <label className="font-mono-custom text-xs font-bold flex items-center gap-1.5 mb-1 text-[#111111]">
          <Code className="w-4 h-4 text-[#FF007A]" />
          <span>STACK / ROLE</span>
        </label>
        <select
          value={data.role}
          onChange={(e) => handleRoleChange(e.target.value)}
          className="w-full bg-white text-[#111111] font-mono-custom text-sm font-bold p-3 border-3 border-[#111111] shadow-[2px_2px_0px_#111111] focus:outline-none cursor-pointer"
        >
          {ROLES_AND_STACKS.map((r) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </select>
      </div>

      {/* Field 3: Builder Title Generator */}
      <div>
        <div className="flex items-center justify-between mb-1">
          <label className="font-mono-custom text-xs font-bold flex items-center gap-1.5 text-[#111111]">
            <Tag className="w-4 h-4 text-[#FF007A]" />
            <span>BUILDER TITLE</span>
          </label>
          <button
            type="button"
            onClick={handleRegenerateTitle}
            className="btn-goa-yellow px-2.5 py-1 text-[11px] font-mono-custom font-bold flex items-center gap-1 cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>↻ NEW TITLE</span>
          </button>
        </div>
        <input
          type="text"
          value={data.builderTitle}
          onChange={(e) => onChange({ ...data, builderTitle: e.target.value })}
          placeholder="e.g. THE SECURITY ARCHITECT"
          maxLength={30}
          className="w-full bg-[#FF007A] text-white font-display text-xl p-3 border-3 border-[#111111] shadow-[2px_2px_0px_#111111] focus:outline-none placeholder-white/70"
        />
      </div>

      {/* Field 4: What Are You Building? */}
      <div>
        <label className="font-mono-custom text-xs font-bold flex items-center gap-1.5 mb-1 text-[#111111]">
          <MessageSquare className="w-4 h-4 text-[#FF007A]" />
          <span>WHAT ARE YOU BUILDING IN GOA?</span>
        </label>
        <textarea
          value={data.buildingText}
          onChange={(e) => onChange({ ...data, buildingText: e.target.value })}
          placeholder="Short text e.g. Building an AI cybersecurity scanner for cloud infrastructure..."
          rows={2}
          maxLength={120}
          className="w-full bg-white text-[#111111] font-body text-sm font-medium p-3 border-3 border-[#111111] shadow-[2px_2px_0px_#111111] focus:outline-none focus:bg-[#FFD600]/20 resize-none"
        />
        <div className="text-right font-mono-custom text-[10px] text-[#111111]/60 mt-0.5">
          {data.buildingText.length}/120
        </div>
      </div>
    </div>
  );
};
