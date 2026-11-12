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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0c0b0a]/80 backdrop-blur-md select-none">
      <div className="w-full max-w-lg bg-[#141311] border border-[#efe9de]/[0.08] rounded-2xl p-6 shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#efe9de]/[0.08]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[#1c1a17] border border-[#efe9de]/[0.08] flex items-center justify-center text-[#E5A93C]">
              <Sliders className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-[#efe9de] tracking-tight">
                Auditorium & Screen Settings
              </h2>
              <p className="text-[11px] text-[#9b9388]">
                Cinescape Global Flagship
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close settings"
            className="w-8 h-8 rounded-full bg-[#1c1a17] border border-[#efe9de]/[0.08] text-[#9b9388] hover:text-[#efe9de] flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Scrollable Content */}
        <div className="flex-1 overflow-y-auto py-4 space-y-6">
          {/* Section 1: Choose Screen */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-[#9b9388] flex items-center gap-1.5">
                <Monitor className="w-3.5 h-3.5 text-[#E5A93C]" />
                Auditorium screen
              </span>
              <span className="text-[11px] text-[#E5A93C] font-mono">
                Audi 3 video spec
              </span>
            </div>

            <div className="space-y-2.5">
              {INDIAN_SCREENS.map((sc) => {
                const isSelected = sc.id === currentScreenId;
                return (
                  <button
                    type="button"
                    key={sc.id}
                    onClick={() => onSelectScreen(sc)}
                    className={`w-full text-left p-3.5 rounded-xl border transition-colors cursor-pointer flex flex-col gap-1.5 ${
                      isSelected
                        ? 'bg-[#1c1a17] border-[#E5A93C]'
                        : 'bg-[#0c0b0a] border-[#efe9de]/[0.08] hover:border-[#efe9de]/[0.18]'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-[#efe9de] tracking-tight">
                          {sc.name}
                        </span>
                        {sc.isReference && (
                          <span className="px-2 py-0.5 rounded-full bg-[#E5A93C]/12 text-[#E5A93C] text-[10px] font-medium border border-[#E5A93C]/25">
                            Reference Spec
                          </span>
                        )}
                      </div>

                      <div
                        className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                          isSelected
                            ? 'bg-[#E5A93C] border-[#E5A93C] text-[#0c0b0a]'
                            : 'border-[#efe9de]/20'
                        }`}
                      >
                        {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                      </div>
                    </div>

                    <p className="text-xs text-[#9b9388] leading-relaxed">
                      {sc.description}
                    </p>

                    <div className="flex items-center justify-between text-[11px] font-mono text-[#6e675f] pt-1 tabular-nums">
                      <span>{sc.format}</span>
                      <span className="text-[#c5bdb1]">
                        Standard ₹{sc.standardPrice} · Recliner ₹{sc.reclinerPrice}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section 2: Projection & Audio Calibration */}
          <div className="space-y-3 pt-4 border-t border-[#efe9de]/[0.08]">
            <span className="text-xs font-medium text-[#9b9388] flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#E5A93C]" />
              Projection & color standard
            </span>

            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'imax-laser', label: 'IMAX 4K Laser' },
                { id: 'standard-xenon', label: 'Xenon 2K' },
                { id: 'hfr-3d', label: '3D HFR 120fps' },
              ].map((opt) => (
                <button
                  type="button"
                  key={opt.id}
                  onClick={() => onChangeProjectionMode(opt.id)}
                  className={`py-2 px-2.5 rounded-xl text-[11px] font-medium border transition-colors text-center cursor-pointer ${
                    projectionMode === opt.id
                      ? 'bg-[#efe9de] text-[#0c0b0a] border-[#efe9de] font-semibold'
                      : 'bg-[#0c0b0a] border-[#efe9de]/[0.08] text-[#9b9388] hover:text-[#efe9de]'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Section 3: Audio Surround Calibration */}
          <div className="space-y-3 pt-4 border-t border-[#efe9de]/[0.08]">
            <span className="text-xs font-medium text-[#9b9388] flex items-center gap-1.5">
              <Volume2 className="w-3.5 h-3.5 text-[#E5A93C]" />
              Auditorium sound system
            </span>

            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'dolby-atmos', label: 'Dolby Atmos 64-CH' },
                { id: 'imax-12track', label: 'IMAX 12-Track' },
                { id: 'studio-flat', label: 'Acoustic Reference' },
              ].map((opt) => (
                <button
                  type="button"
                  key={opt.id}
                  onClick={() => onChangeAudioProfile(opt.id)}
                  className={`py-2 px-2.5 rounded-xl text-[11px] font-medium border transition-colors text-center cursor-pointer ${
                    audioProfile === opt.id
                      ? 'bg-[#efe9de] text-[#0c0b0a] border-[#efe9de] font-semibold'
                      : 'bg-[#0c0b0a] border-[#efe9de]/[0.08] text-[#9b9388] hover:text-[#efe9de]'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Section 4: Sightline Assistance */}
          <div className="pt-4 border-t border-[#efe9de]/[0.08] flex items-center justify-between gap-4">
            <div>
              <span className="text-xs font-semibold text-[#efe9de] block">
                Highlight SMPTE Sweet Spot
              </span>
              <span className="text-[11px] text-[#9b9388]">
                Visually mark rows D–F for optimal eye-level viewing
              </span>
            </div>

            <button
              type="button"
              onClick={onToggleSweetSpotGuide}
              aria-pressed={showSweetSpotGuide}
              className={`w-11 h-6 rounded-full transition-colors p-0.5 cursor-pointer flex items-center shrink-0 ${
                showSweetSpotGuide ? 'bg-[#E5A93C] justify-end' : 'bg-[#25221e] justify-start'
              }`}
            >
              <div className="w-5 h-5 rounded-full bg-[#efe9de] shadow-sm" />
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-[#efe9de]/[0.08]">
          <button
            type="button"
            onClick={onClose}
            className="w-full h-11 rounded-full bg-[#efe9de] text-[#0c0b0a] font-semibold text-xs hover:bg-[#e5dfd4] transition-colors cursor-pointer"
          >
            Apply Screen Settings
          </button>
        </div>
      </div>
    </div>
  );
};
