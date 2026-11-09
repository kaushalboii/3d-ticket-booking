import React from 'react';
import { ScreenConfig } from '../types';
import { INDIAN_SCREENS } from '../data/indianCinemaData';
import { X, Check, Sliders, Volume2, Sparkles, Monitor, Layers } from 'lucide-react';

interface AuditoriumSettingsModalProps {
  currentScreenId: string;
  onSelectScreen: (screen: ScreenConfig) => void;
  projectionMode: string;
  onChangeProjectionMode: (mode: string) => void;
  audioProfile: string;
  onChangeAudioProfile: (profile: string) => void;
  showSweetSpotGuide: boolean;
  onToggleSweetSpotGuide: () => void;
  onClose: () => void;
}

export const AuditoriumSettingsModal: React.FC<AuditoriumSettingsModalProps> = ({
  currentScreenId,
  onSelectScreen,
  projectionMode,
  onChangeProjectionMode,
  audioProfile,
  onChangeAudioProfile,
  showSweetSpotGuide,
  onToggleSweetSpotGuide,
  onClose,
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in select-none">
      <div className="w-full max-w-lg bg-[#0D0D0D] border border-[#222222] rounded-3xl p-6 shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#1C1C1C]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-[#181818] border border-[#2E2E2E] flex items-center justify-center text-[#55E6A5]">
              <Sliders className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white tracking-tight">
                Auditorium & Screen Settings
              </h2>
              <p className="text-[11px] text-[#71717A]">
                CINESCAPE Global Flagship
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#161616] border border-[#262626] text-[#A0A0A0] hover:text-white flex items-center justify-center transition active:scale-95 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Scrollable Content */}
        <div className="flex-1 overflow-y-auto py-4 space-y-6">
          {/* Section 1: Choose Screen */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono uppercase tracking-wider text-[#71717A] flex items-center gap-1.5">
                <Monitor className="w-3.5 h-3.5 text-[#55E6A5]" />
                Select Auditorium Screen
              </span>
              <span className="text-[10px] text-[#55E6A5] font-mono">
                Audi 3 is Video Reference
              </span>
            </div>

            <div className="space-y-2.5">
              {INDIAN_SCREENS.map((sc) => {
                const isSelected = sc.id === currentScreenId;
                return (
                  <div
                    key={sc.id}
                    onClick={() => onSelectScreen(sc)}
                    className={`p-3.5 rounded-2xl border transition cursor-pointer flex flex-col gap-1.5 ${
                      isSelected
                        ? 'bg-[#141414] border-[#55E6A5]/80 shadow-lg shadow-[#55E6A5]/5'
                        : 'bg-[#090909] border-[#1C1C1C] hover:border-[#333333]'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-white tracking-tight">
                          {sc.name}
                        </span>
                        {sc.isReference && (
                          <span className="px-2 py-0.5 rounded-full bg-[#55E6A5]/20 text-[#55E6A5] text-[9px] font-mono font-bold border border-[#55E6A5]/30">
                            Reference Video Spec
                          </span>
                        )}
                      </div>

                      <div
                        className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                          isSelected
                            ? 'bg-[#55E6A5] border-[#55E6A5] text-black'
                            : 'border-[#333333]'
                        }`}
                      >
                        {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                      </div>
                    </div>

                    <p className="text-xs text-[#888888] leading-relaxed">
                      {sc.description}
                    </p>

                    <div className="flex items-center justify-between text-[11px] font-mono text-[#71717A] pt-1">
                      <span>{sc.format}</span>
                      <span className="text-[#D4D4D8]">
                        Standard ₹{sc.standardPrice} · Recliner ₹{sc.reclinerPrice}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Section 2: Projection & Audio Calibration */}
          <div className="space-y-3 pt-2 border-t border-[#1C1C1C]">
            <span className="text-[11px] font-mono uppercase tracking-wider text-[#71717A] flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#55E6A5]" />
              Projection & Color Standard
            </span>

            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'imax-laser', label: 'IMAX 4K Laser' },
                { id: 'standard-xenon', label: 'Xenon 2K' },
                { id: 'hfr-3d', label: '3D HFR 120fps' },
              ].map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => onChangeProjectionMode(opt.id)}
                  className={`py-2 px-2.5 rounded-xl text-[11px] font-semibold border transition text-center cursor-pointer ${
                    projectionMode === opt.id
                      ? 'bg-white text-black border-white font-bold'
                      : 'bg-[#111111] border-[#222222] text-[#888888] hover:text-white'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Section 3: Audio Surround Calibration */}
          <div className="space-y-3 pt-2 border-t border-[#1C1C1C]">
            <span className="text-[11px] font-mono uppercase tracking-wider text-[#71717A] flex items-center gap-1.5">
              <Volume2 className="w-3.5 h-3.5 text-[#55E6A5]" />
              Auditorium Sound System
            </span>

            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'dolby-atmos', label: 'Dolby Atmos 64-CH' },
                { id: 'imax-12track', label: 'IMAX 12-Track' },
                { id: 'studio-flat', label: 'Acoustic Reference' },
              ].map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => onChangeAudioProfile(opt.id)}
                  className={`py-2 px-2.5 rounded-xl text-[11px] font-semibold border transition text-center cursor-pointer ${
                    audioProfile === opt.id
                      ? 'bg-white text-black border-white font-bold'
                      : 'bg-[#111111] border-[#222222] text-[#888888] hover:text-white'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Section 4: Sightline Assistance */}
          <div className="pt-2 border-t border-[#1C1C1C] flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-white block">
                Highlight SMPTE Sweet Spot
              </span>
              <span className="text-[10px] text-[#71717A]">
                Visually highlight rows D–F for optimal eye-level viewing
              </span>
            </div>

            <button
              onClick={onToggleSweetSpotGuide}
              className={`w-11 h-6 rounded-full transition p-0.5 cursor-pointer flex items-center ${
                showSweetSpotGuide ? 'bg-[#55E6A5] justify-end' : 'bg-[#222222] justify-start'
              }`}
            >
              <div className="w-5 h-5 rounded-full bg-white shadow-md" />
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-[#1C1C1C]">
          <button
            onClick={onClose}
            className="w-full py-3 rounded-full bg-white text-black font-bold text-xs tracking-tight hover:bg-[#E4E4E7] transition active:scale-95 cursor-pointer shadow-lg"
          >
            Apply Screen Settings
          </button>
        </div>
      </div>
    </div>
  );
};
