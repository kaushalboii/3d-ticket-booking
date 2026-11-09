import React from 'react';
import { City } from '../types';
import { CITIES_LIST } from '../data/velsData';
import { X, MapPin, Check, Globe } from 'lucide-react';

interface CitySelectModalProps {
  currentCity: string;
  onSelectCity: (city: City) => void;
  onClose: () => void;
}

export const CitySelectModal: React.FC<CitySelectModalProps> = ({
  currentCity,
  onSelectCity,
  onClose,
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm select-none animate-fade-in">
      <div className="w-full max-w-sm bg-[#111111] border border-[#222222] rounded-3xl overflow-hidden shadow-2xl flex flex-col">
        {/* Header */}
        <div className="px-5 py-4 border-b border-[#1C1C1C] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-[#55E6A5]/15 border border-[#55E6A5]/30 flex items-center justify-center text-[#55E6A5]">
              <Globe className="w-3.5 h-3.5" />
            </div>
            <div>
              <h3 className="text-[#F5F5F5] font-semibold text-sm">
                Select Your Region
              </h3>
              <p className="text-[#888888] text-[11px]">
                Global Cinema & 3D Booking Network
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-[#1A1A1A] text-[#888888] hover:text-[#F5F5F5] flex items-center justify-center"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Cities List */}
        <div className="p-4 space-y-2 max-h-[380px] overflow-y-auto">
          {CITIES_LIST.map((city) => {
            const isSelected = city.name.toLowerCase() === currentCity.toLowerCase();
            return (
              <button
                key={city.id}
                onClick={() => {
                  onSelectCity(city);
                  onClose();
                }}
                className={`w-full p-3 rounded-2xl border text-left transition flex items-center justify-between cursor-pointer ${
                  isSelected
                    ? 'bg-[#55E6A5]/10 border-[#55E6A5] text-white shadow-md'
                    : 'bg-[#0E0E0E] border-[#202020] hover:border-[#333333] hover:bg-[#161616] text-[#D0D0D0]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-xl">{city.flag}</span>
                  <div>
                    <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                      <span>{city.name}</span>
                      <span className="text-[10px] text-[#777777] font-normal">
                        ({city.country})
                      </span>
                    </h4>
                    <p className="text-[10px] text-[#888888]">
                      {city.theatresCount} Multiplexes & IMAX Theatres
                    </p>
                  </div>
                </div>

                {isSelected ? (
                  <div className="w-5 h-5 rounded-full bg-[#55E6A5] text-[#050505] flex items-center justify-center">
                    <Check className="w-3 h-3 stroke-[3]" />
                  </div>
                ) : (
                  <MapPin className="w-3.5 h-3.5 text-[#555555]" />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
