import React, { useState } from 'react';
import { Seat } from '../../types';
import {
  ArrowLeft,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  RotateCcw,
  Volume2
} from 'lucide-react';

interface FirstPersonHUDProps {
  seat: Seat;
  isSelected: boolean;
  onToggleSeat: (seat: Seat) => void;
  onReturnToMap: () => void;
  onSelectCompareSeat: (seatId: string) => void;
  yaw: number;
  pitch: number;
  onLookAroundChange: (yaw: number, pitch: number) => void;
  onResetLookAround: () => void;
}

export const FirstPersonHUD: React.FC<FirstPersonHUDProps> = ({
  seat,
  isSelected,
  onToggleSeat,
  onReturnToMap,
  onSelectCompareSeat,
  yaw,
  pitch,
  onLookAroundChange,
  onResetLookAround
}) => {
  const [isDockCollapsed, setIsDockCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState<'metrics' | 'compare' | 'lookaround'>('metrics');

  // Physical calculations relative to IMAX screen (0, 5.2, -3)
  const screenDistMeters = Math.sqrt(
    Math.pow(seat.coord3D.x, 2) +
    Math.pow(seat.coord3D.y - 5.2, 2) +
    Math.pow(seat.coord3D.z - (-3), 2)
  );

  const screenDistFeet = (screenDistMeters * 3.28084).toFixed(1);
  const distM = screenDistMeters.toFixed(1);

  const offAxisDegrees = Math.round(
    Math.abs(Math.atan2(seat.coord3D.x, seat.coord3D.z + 3) * (180 / Math.PI))
  );

  const screenWidth = 22;
  const fovDegrees = Math.round(
    2 * Math.atan(screenWidth / (2 * (seat.coord3D.z + 3))) * (180 / Math.PI)
  );

  const getQualityEvaluation = () => {
    if (offAxisDegrees <= 10 && ['D', 'E', 'F'].includes(seat.row)) {
      return {
        label: 'Reference sweetspot',
        color: 'text-zinc-200',
        audioScore: 'Center channel balanced',
        summary: 'Direct geometric center with neutral acoustic arrival times.',
      };
    }
    if (offAxisDegrees <= 20) {
      return {
        label: 'Prime cinematic field',
        color: 'text-zinc-300',
        audioScore: '96% spatial balance',
        summary: 'Even field of view aligned with screen curvature.',
      };
    }
    return {
      label: 'Lateral wing perspective',
      color: 'text-zinc-400',
      audioScore: 'Lateral surround bias',
      summary: 'Wider peripheral view with direct aisle clearance.',
    };
  };

  const evaluation = getQualityEvaluation();

  return (
    <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-4 md:p-6 select-none font-sans">
      {/* Top Header Bar */}
      <div className="flex items-center justify-between w-full pointer-events-auto">
        <button
          onClick={onReturnToMap}
          className="h-8 px-3 rounded-lg bg-[#141519]/90 backdrop-blur-md border border-white/[0.08] hover:border-white/20 text-xs font-medium text-zinc-300 hover:text-white transition-colors flex items-center gap-1.5"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Exit eye-level view</span>
        </button>

        <div className="flex items-center gap-3 bg-[#141519]/90 backdrop-blur-md border border-white/[0.08] px-3 py-1.5 rounded-lg text-xs font-mono text-zinc-400">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400/80 inline-block" />
          <span className="text-zinc-200">
            Row {seat.row} • Seat {seat.number}
          </span>
          <span className="text-zinc-600">|</span>
          <span className="tabular-nums">{distM}m to screen</span>
        </div>
      </div>

      {/* Subtle Optical Reticle */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-25">
        <div className="w-20 h-20 border border-white/40 rounded-full flex items-center justify-center">
          <div className="w-1 h-1 bg-white rounded-full" />
        </div>
      </div>

      {/* Bottom Control Dock */}
      <div className="pointer-events-auto mx-auto w-full max-w-[800px] flex flex-col items-center">
        <button
          onClick={() => setIsDockCollapsed(!isDockCollapsed)}
          className="flex items-center gap-1 px-3 py-1 rounded-t-lg bg-[#121317]/95 border-t border-x border-white/[0.08] text-zinc-400 hover:text-white text-[11px] font-mono transition-colors"
        >
          {isDockCollapsed ? (
            <>
              <ChevronUp className="w-3 h-3" />
              <span>Show sightline controls</span>
            </>
          ) : (
            <>
              <ChevronDown className="w-3 h-3" />
              <span>Hide controls</span>
            </>
          )}
        </button>

        {!isDockCollapsed && (
          <div className="w-full bg-[#121317]/95 backdrop-blur-md border border-white/[0.08] rounded-b-xl rounded-t-lg p-4 space-y-3.5 shadow-2xl">
            {/* Top Row: Seat & Main Action */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/[0.06]">
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-lg bg-[#18191e] border border-white/[0.08] flex items-center justify-center text-zinc-200 font-mono text-xs font-medium">
                  {seat.row}{seat.number}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-medium text-white">
                      Row {seat.row}, Seat {seat.number}
                    </h3>
                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-white/[0.06] text-zinc-400 font-mono uppercase">
                      {seat.tier.replace('_', ' ')}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-xs font-mono text-zinc-400 mt-0.5">
                    <span className={evaluation.color}>{evaluation.label}</span>
                    <span>•</span>
                    <span className="tabular-nums">${seat.price.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => onToggleSeat(seat)}
                  className={`h-8 px-3.5 rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5 ${
                    isSelected
                      ? 'bg-rose-500/10 border border-rose-500/30 text-rose-300 hover:bg-rose-500/20'
                      : 'bg-white text-zinc-950 hover:bg-zinc-200'
                  }`}
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>{isSelected ? 'Remove seat' : `Select seat (${seat.id})`}</span>
                </button>
              </div>
            </div>

            {/* Sub-nav Tabs */}
            <div className="flex items-center justify-between gap-2 text-xs">
              <div className="flex items-center gap-1 bg-[#16171b] p-0.5 rounded-lg border border-white/[0.06]">
                <button
                  onClick={() => setActiveTab('metrics')}
                  className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
                    activeTab === 'metrics'
                      ? 'bg-[#22232a] text-white border border-white/[0.1]'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  Sightline metrics
                </button>
                <button
                  onClick={() => setActiveTab('compare')}
                  className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
                    activeTab === 'compare'
                      ? 'bg-[#22232a] text-white border border-white/[0.1]'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  Compare rows
                </button>
                <button
                  onClick={() => setActiveTab('lookaround')}
                  className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
                    activeTab === 'lookaround'
                      ? 'bg-[#22232a] text-white border border-white/[0.1]'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  Look around
                </button>
              </div>

              {(yaw !== 0 || pitch !== 0) && (
                <button
                  onClick={onResetLookAround}
                  className="flex items-center gap-1 text-[11px] font-mono text-zinc-400 hover:text-white"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Reset angle</span>
                </button>
              )}
            </div>

            {/* Tab 1: Sightline Metrics */}
            {activeTab === 'metrics' && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-0.5">
                <div className="bg-[#16171b] border border-white/[0.05] rounded-lg p-2.5">
                  <span className="text-[10px] font-mono uppercase text-zinc-500 block">
                    Distance to screen
                  </span>
                  <div className="flex items-baseline gap-1 mt-0.5">
                    <span className="text-sm font-medium font-mono text-white tabular-nums">{distM}m</span>
                    <span className="text-[11px] font-mono text-zinc-500">({screenDistFeet} ft)</span>
                  </div>
                  <span className="text-[10px] font-mono text-zinc-500 block mt-0.5">
                    Row {seat.row} tiered depth
                  </span>
                </div>

                <div className="bg-[#16171b] border border-white/[0.05] rounded-lg p-2.5">
                  <span className="text-[10px] font-mono uppercase text-zinc-500 block">
                    Horizontal FOV
                  </span>
                  <div className="flex items-baseline gap-1 mt-0.5">
                    <span className="text-sm font-medium font-mono text-white tabular-nums">{fovDegrees}°</span>
                    <span className="text-[11px] font-mono text-zinc-400">arc</span>
                  </div>
                  <span className="text-[10px] font-mono text-zinc-500 block mt-0.5">
                    Recommended: 36°–52°
                  </span>
                </div>

                <div className="bg-[#16171b] border border-white/[0.05] rounded-lg p-2.5">
                  <span className="text-[10px] font-mono uppercase text-zinc-500 block">
                    Off-axis angle
                  </span>
                  <div className="flex items-baseline gap-1 mt-0.5">
                    <span className="text-sm font-medium font-mono text-white tabular-nums">{offAxisDegrees}°</span>
                    <span className="text-[11px] font-mono text-zinc-500">offset</span>
                  </div>
                  <span className="text-[10px] font-mono text-zinc-500 block mt-0.5">
                    Curvature compensated
                  </span>
                </div>

                <div className="bg-[#16171b] border border-white/[0.05] rounded-lg p-2.5">
                  <span className="text-[10px] font-mono uppercase text-zinc-500 block">
                    Spatial audio
                  </span>
                  <div className="flex items-center gap-1 mt-0.5">
                    <Volume2 className="w-3.5 h-3.5 text-zinc-400" />
                    <span className="text-xs font-mono text-white">Dolby Atmos</span>
                  </div>
                  <span className="text-[10px] font-mono text-zinc-500 block mt-0.5">
                    {evaluation.audioScore}
                  </span>
                </div>
              </div>
            )}

            {/* Tab 2: Compare Presets */}
            {activeTab === 'compare' && (
              <div className="space-y-1.5 pt-0.5">
                <p className="text-xs text-zinc-500">
                  Switch the camera position across reference auditorium rows:
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <button
                    onClick={() => onSelectCompareSeat('A-6')}
                    className={`p-2.5 rounded-lg border text-left transition-colors flex flex-col justify-between ${
                      seat.id === 'A-6'
                        ? 'bg-[#22232a] border-white/20 text-white'
                        : 'bg-[#16171b] border-white/[0.06] hover:border-white/10 text-zinc-300'
                    }`}
                  >
                    <span className="text-xs font-medium block">Front row (A-6)</span>
                    <span className="text-[10px] font-mono text-zinc-500 mt-1">
                      7.8m • 64° FOV
                    </span>
                  </button>

                  <button
                    onClick={() => onSelectCompareSeat('D-6')}
                    className={`p-2.5 rounded-lg border text-left transition-colors flex flex-col justify-between ${
                      seat.id === 'D-6'
                        ? 'bg-[#22232a] border-white/20 text-white'
                        : 'bg-[#16171b] border-white/[0.06] hover:border-white/10 text-zinc-300'
                    }`}
                  >
                    <span className="text-xs font-medium block">Center sweetspot (D-6)</span>
                    <span className="text-[10px] font-mono text-zinc-400 mt-1">
                      14.2m • 46° FOV
                    </span>
                  </button>

                  <button
                    onClick={() => onSelectCompareSeat('H-6')}
                    className={`p-2.5 rounded-lg border text-left transition-colors flex flex-col justify-between ${
                      seat.id === 'H-6'
                        ? 'bg-[#22232a] border-white/20 text-white'
                        : 'bg-[#16171b] border-white/[0.06] hover:border-white/10 text-zinc-300'
                    }`}
                  >
                    <span className="text-xs font-medium block">Back row (H-6)</span>
                    <span className="text-[10px] font-mono text-zinc-500 mt-1">
                      23.1m • 32° FOV
                    </span>
                  </button>

                  <button
                    onClick={() => onSelectCompareSeat('C-1')}
                    className={`p-2.5 rounded-lg border text-left transition-colors flex flex-col justify-between ${
                      seat.id === 'C-1'
                        ? 'bg-[#22232a] border-white/20 text-white'
                        : 'bg-[#16171b] border-white/[0.06] hover:border-white/10 text-zinc-300'
                    }`}
                  >
                    <span className="text-xs font-medium block">Wing corner (C-1)</span>
                    <span className="text-[10px] font-mono text-zinc-500 mt-1">
                      12.5m • 24° off-axis
                    </span>
                  </button>
                </div>
              </div>
            )}

            {/* Tab 3: Look Around */}
            {activeTab === 'lookaround' && (
              <div className="space-y-2.5 pt-0.5">
                <div className="flex items-center justify-between text-xs text-zinc-500 font-mono">
                  <span>Pan camera to inspect head clearance and neighboring sightlines:</span>
                  <span className="text-zinc-300">
                    Yaw: {(yaw * 100).toFixed(0)}% | Pitch: {(pitch * 100).toFixed(0)}%
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <div className="flex justify-between text-[11px] font-mono text-zinc-400 mb-1">
                      <span>Horizontal pan</span>
                      <span>{yaw < 0 ? 'Left' : yaw > 0 ? 'Right' : 'Center'}</span>
                    </div>
                    <input
                      type="range"
                      min="-0.35"
                      max="0.35"
                      step="0.01"
                      value={yaw}
                      onChange={(e) => onLookAroundChange(parseFloat(e.target.value), pitch)}
                      className="w-full accent-white h-1 bg-[#1c1d22] rounded-lg cursor-pointer"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between text-[11px] font-mono text-zinc-400 mb-1">
                      <span>Vertical tilt</span>
                      <span>{pitch < 0 ? 'Down' : pitch > 0 ? 'Up' : 'Eye level'}</span>
                    </div>
                    <input
                      type="range"
                      min="-0.25"
                      max="0.25"
                      step="0.01"
                      value={pitch}
                      onChange={(e) => onLookAroundChange(yaw, parseFloat(e.target.value))}
                      className="w-full accent-white h-1 bg-[#1c1d22] rounded-lg cursor-pointer"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
