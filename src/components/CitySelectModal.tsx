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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm select-none">
      <div className="w-full max-w-sm bg-[#0E1118] border border-white/[0.08] rounded-3xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-5 py-4 border-b border-white/[0.08] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-[#141822] border border-white/[0.08] flex items-center justify-center text-[#55E6A5]">
              <Globe className="w-3.5 h-3.5" strokeWidth={1.5} />
            </div>
            <div>
              <h3 className="text-[#F0F1F4] font-medium text-sm">
                Select territory
              </h3>
              <p className="text-[#7A8296] text-[11px]">
                Cinema sightline network
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-[#141822] text-[#7A8296] hover:text-[#F0F1F4] flex items-center justify-center cursor-pointer"
          >
            <X className="w-3.5 h-3.5" strokeWidth={1.5} />
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
                className={`w-full p-3.5 rounded-2xl border text-left transition flex items-center justify-between cursor-pointer ${
                  isSelected
                    ? 'bg-[#1C2230] border-[#55E6A5]/50 text-white'
                    : 'bg-[#141822] border-white/[0.08] hover:border-white/[0.16] hover:bg-[#1A202D] text-[#D1D5DF]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-xl">{city.flag}</span>
                  <div>
                    <h4 className="text-xs font-medium text-[#F0F1F4] flex items-center gap-1.5">
                      <span>{city.name}</span>
                      <span className="text-[10px] text-[#7A8296] font-normal">
                        ({city.country})
                      </span>
                    </h4>
                    <p className="text-[11px] text-[#7A8296] mt-0.5">
                      {city.theatresCount} multiplexes
                    </p>
                  </div>
                </div>

                {isSelected ? (
                  <div className="w-5 h-5 rounded-full bg-[#55E6A5] text-[#07130E] flex items-center justify-center">
                    <Check className="w-3 h-3 stroke-[3]" />
                  </div>
                ) : (
                  <MapPin className="w-3.5 h-3.5 text-[#5C6479]" strokeWidth={1.5} />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};