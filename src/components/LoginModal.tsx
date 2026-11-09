import React, { useState } from 'react';
import { UserProfile } from '../types';
import { X, Smartphone, Mail, ArrowRight, ShieldCheck, Check } from 'lucide-react';

interface LoginModalProps {
  onClose: () => void;
  onLoginSuccess: (user: UserProfile) => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({
  onClose,
  onLoginSuccess,
}) => {
  const [phone, setPhone] = useState('9876543210');
  const [name, setName] = useState('Kaushal');
  const [email, setEmail] = useState('kaushal@vels.in');
  const [otpStep, setOtpStep] = useState(false);
  const [otp, setOtp] = useState('4290');
  const [isLoading, setIsLoading] = useState(false);

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (phone.length < 10) return;
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setOtpStep(true);
    }, 600);
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      onLoginSuccess({
        name: name.trim() || 'Kaushal',
        phone: `+91 ${phone}`,
        email: email.trim() || 'kaushal@vels.in',
        isLoggedIn: true,
      });
      onClose();
    }, 600);
  };

  const handleQuickDemoLogin = () => {
    onLoginSuccess({
      name: 'Kaushal Maran',
      phone: '+91 98401 23456',
      email: 'kaushalmaran@vels.in',
      isLoggedIn: true,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm select-none">
      <div className="w-full max-w-sm bg-[#111111] border border-[#222222] rounded-3xl overflow-hidden shadow-2xl flex flex-col">
        {/* Header */}
        <div className="px-5 py-4 border-b border-[#1C1C1C] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-[#55E6A5]/15 border border-[#55E6A5]/30 flex items-center justify-center text-[#55E6A5]">
              <Smartphone className="w-3.5 h-3.5" />
            </div>
            <div>
              <h3 className="text-[#F5F5F5] font-semibold text-sm">
                Sign In to CINESCAPE
              </h3>
              <p className="text-[#888888] text-[11px]">
                Instant booking & 3D seat reservation
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

        {/* Content */}
        <div className="p-5 space-y-4">
          {!otpStep ? (
            <form onSubmit={handleSendOtp} className="space-y-3">
              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-[#888888] block mb-1">
                  Your Full Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your name"
                  className="w-full bg-[#080808] border border-[#222222] px-3.5 py-2.5 rounded-xl text-xs text-white placeholder:text-[#555555] focus:outline-none focus:border-[#55E6A5] transition"
                  required
                />
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-[#888888] block mb-1">
                  Mobile Number (+91 India)
                </label>
                <div className="flex gap-2">
                  <span className="px-3 py-2.5 bg-[#080808] border border-[#222222] rounded-xl text-xs text-[#888888] font-mono flex items-center">
                    +91
                  </span>
                  <input
                    type="tel"
                    maxLength={10}
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                    placeholder="10 digit mobile"
                    className="flex-1 bg-[#080808] border border-[#222222] px-3.5 py-2.5 rounded-xl text-xs text-white font-mono placeholder:text-[#555555] focus:outline-none focus:border-[#55E6A5] transition"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 rounded-full bg-[#55E6A5] hover:brightness-105 text-[#050505] font-bold text-xs tracking-tight transition active:scale-95 flex items-center justify-center gap-1.5 shadow-md shadow-[#55E6A5]/20 cursor-pointer mt-2"
              >
                {isLoading ? (
                  <span>Sending OTP...</span>
                ) : (
                  <>
                    <span>Continue with OTP</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp} className="space-y-3">
              <div className="text-center py-1">
                <span className="text-xs text-[#888888]">
                  Enter the 4-digit code sent to <strong className="text-white">+91 {phone}</strong>
                </span>
              </div>

              <div>
                <input
                  type="text"
                  maxLength={4}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="Enter 4-digit OTP"
                  className="w-full bg-[#080808] border border-[#222222] px-3.5 py-3 rounded-xl text-center text-lg font-mono tracking-widest text-[#55E6A5] focus:outline-none focus:border-[#55E6A5] transition"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 rounded-full bg-[#55E6A5] hover:brightness-105 text-[#050505] font-bold text-xs tracking-tight transition active:scale-95 flex items-center justify-center gap-1.5 shadow-md shadow-[#55E6A5]/20 cursor-pointer"
              >
                {isLoading ? (
                  <span>Verifying...</span>
                ) : (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>Verify & Sign In</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => setOtpStep(false)}
                className="w-full text-center text-[11px] text-[#888888] hover:text-[#CCCCCC]"
              >
                ← Change Number
              </button>
            </form>
          )}

          {/* Quick Demo Sign In Button */}
          <div className="pt-2 border-t border-[#1C1C1C]">
            <button
              onClick={handleQuickDemoLogin}
              className="w-full py-2.5 rounded-full bg-[#181818] border border-[#262626] hover:bg-[#222222] text-[#CCCCCC] text-[11px] font-semibold transition"
            >
              ⚡ Instant 1-Click Demo Login
            </button>
          </div>

          <div className="flex items-center justify-center gap-1 text-[10px] text-[#666666]">
            <ShieldCheck className="w-3 h-3 text-[#55E6A5]" />
            <span>Secure 256-bit encrypted authentication</span>
          </div>
        </div>
      </div>
    </div>
  );
};
