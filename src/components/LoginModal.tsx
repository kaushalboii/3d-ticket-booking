import React, { useState } from 'react';
import { UserProfile } from '../types';
import { X, Smartphone, ArrowRight, ShieldCheck, Check } from 'lucide-react';

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
    }, 500);
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
    }, 500);
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm select-none">
      <div className="w-full max-w-sm bg-[#0E1118] border border-white/[0.08] rounded-3xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-5 py-4 border-b border-white/[0.08] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-[#141822] border border-white/[0.08] flex items-center justify-center text-[#55E6A5]">
              <Smartphone className="w-3.5 h-3.5" strokeWidth={1.5} />
            </div>
            <div>
              <h3 className="text-[#F0F1F4] font-medium text-sm">
                Sign in
              </h3>
              <p className="text-[#7A8296] text-[11px]">
                Access ticket reservations
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

        {/* Content */}
        <div className="p-5 space-y-4">
          {!otpStep ? (
            <form onSubmit={handleSendOtp} className="space-y-3">
              <div>
                <label className="text-[11px] text-[#7A8296] block mb-1">
                  Full name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your name"
                  className="w-full bg-[#141822] border border-white/[0.08] px-3.5 py-2.5 rounded-xl text-xs text-[#F0F1F4] placeholder:text-[#5C6479] focus:outline-none focus:border-[#55E6A5]/50 transition"
                  required
                />
              </div>

              <div>
                <label className="text-[11px] text-[#7A8296] block mb-1">
                  Mobile number (+91)
                </label>
                <div className="flex gap-2">
                  <span className="px-3 py-2.5 bg-[#141822] border border-white/[0.08] rounded-xl text-xs text-[#7A8296] font-mono flex items-center">
                    +91
                  </span>
                  <input
                    type="tel"
                    maxLength={10}
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                    placeholder="10-digit number"
                    className="flex-1 bg-[#141822] border border-white/[0.08] px-3.5 py-2.5 rounded-xl text-xs text-[#F0F1F4] font-mono placeholder:text-[#5C6479] focus:outline-none focus:border-[#55E6A5]/50 transition"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-2.5 rounded-full bg-[#55E6A5] text-[#07130E] font-medium text-xs tracking-tight transition active:scale-[0.98] flex items-center justify-center gap-1.5 cursor-pointer mt-2 shadow-[inset_0_1px_0_rgba(255,255,255,0.25)]"
              >
                {isLoading ? (
                  <span>Sending code...</span>
                ) : (
                  <>
                    <span>Continue with SMS code</span>
                    <ArrowRight className="w-3.5 h-3.5" strokeWidth={1.5} />
                  </>
                )}
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp} className="space-y-3">
              <div className="text-center py-1">
                <span className="text-xs text-[#7A8296]">
                  Enter 4-digit code sent to <span className="text-[#F0F1F4] font-mono">+91 {phone}</span>
                </span>
              </div>

              <div>
                <input
                  type="text"
                  maxLength={4}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="0000"
                  className="w-full bg-[#141822] border border-white/[0.08] px-3.5 py-3 rounded-xl text-center text-lg font-mono tracking-widest text-[#55E6A5] focus:outline-none focus:border-[#55E6A5]/50 transition"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-2.5 rounded-full bg-[#55E6A5] text-[#07130E] font-medium text-xs tracking-tight transition active:scale-[0.98] flex items-center justify-center gap-1.5 cursor-pointer shadow-[inset_0_1px_0_rgba(255,255,255,0.25)]"
              >
                {isLoading ? (
                  <span>Verifying...</span>
                ) : (
                  <>
                    <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                    <span>Verify & continue</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => setOtpStep(false)}
                className="w-full text-center text-[11px] text-[#7A8296] hover:text-[#D1D5DF] cursor-pointer"
              >
                ← Change number
              </button>
            </form>
          )}

          {/* Quick Demo Sign In Button */}
          <div className="pt-2 border-t border-white/[0.08]">
            <button
              onClick={handleQuickDemoLogin}
              className="w-full py-2 rounded-full bg-[#141822] border border-white/[0.08] hover:bg-[#1C2230] text-[#D1D5DF] text-[11px] font-normal transition cursor-pointer"
            >
              Quick demo sign in
            </button>
          </div>

          <div className="flex items-center justify-center gap-1.5 text-[11px] text-[#5C6479]">
            <ShieldCheck className="w-3.5 h-3.5 text-[#55E6A5]" strokeWidth={1.5} />
            <span>Encrypted authentication session</span>
          </div>
        </div>
      </div>
    </div>
  );
};