import React, { useState } from 'react';
import { UserProfile } from '../types';
import { X, Smartphone, ArrowRight, ShieldCheck, Check, Zap } from 'lucide-react';

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
  const [email] = useState('kaushal@vels.in');
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0c0b0a]/85 backdrop-blur-sm select-none">
      <div className="w-full max-w-sm bg-[#141311] border border-[#efe9de]/[0.08] rounded-[20px] overflow-hidden shadow-2xl flex flex-col">
        <div className="px-5 py-4 border-b border-[#efe9de]/[0.08] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#E5A93C]/15 border border-[#E5A93C]/30 flex items-center justify-center text-[#E5A93C]">
              <Smartphone className="w-4 h-4" strokeWidth={1.75} />
            </div>
            <div>
              <h3 className="text-[#efe9de] font-semibold text-sm leading-tight">
                Sign in to CINESCAPE
              </h3>
              <p className="text-[#787268] text-xs mt-0.5">
                Instant booking & pass storage
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close sign in"
            className="w-8 h-8 rounded-lg bg-[#1e1c19] text-[#aaa398] hover:text-[#efe9de] flex items-center justify-center transition-colors duration-150 cursor-pointer"
          >
            <X className="w-4 h-4" strokeWidth={1.75} />
          </button>
        </div>

        <div className="p-5 space-y-4">
          {!otpStep ? (
            <form onSubmit={handleSendOtp} className="space-y-3">
              <div>
                <label className="text-xs font-medium text-[#aaa398] block mb-1.5">
                  Full name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your name"
                  className="w-full h-10 bg-[#0c0b0a] border border-[#efe9de]/[0.08] px-3.5 rounded-lg text-xs text-[#efe9de] placeholder:text-[#5a554c] focus:outline-none focus:border-[#E5A93C] transition-colors duration-150"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-medium text-[#aaa398] block mb-1.5">
                  Mobile number
                </label>
                <div className="flex gap-2">
                  <span className="h-10 px-3 bg-[#0c0b0a] border border-[#efe9de]/[0.08] rounded-lg text-xs text-[#787268] font-mono flex items-center tabular-nums">
                    +91
                  </span>
                  <input
                    type="tel"
                    maxLength={10}
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                    placeholder="10 digit mobile"
                    className="flex-1 h-10 bg-[#0c0b0a] border border-[#efe9de]/[0.08] px-3.5 rounded-lg text-xs text-[#efe9de] font-mono placeholder:text-[#5a554c] focus:outline-none focus:border-[#E5A93C] transition-colors duration-150 tabular-nums"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full h-11 rounded-xl bg-[#efe9de] hover:bg-white text-[#12110f] font-semibold text-xs transition-colors duration-150 active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer mt-2"
              >
                {isLoading ? (
                  <span>Sending OTP...</span>
                ) : (
                  <>
                    <span>Continue with OTP</span>
                    <ArrowRight className="w-3.5 h-3.5" strokeWidth={1.75} />
                  </>
                )}
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp} className="space-y-3">
              <div className="text-center py-1">
                <span className="text-xs text-[#aaa398] tabular-nums">
                  Enter the 4-digit code sent to{' '}
                  <strong className="text-[#efe9de]">+91 {phone}</strong>
                </span>
              </div>

              <div>
                <input
                  type="text"
                  maxLength={4}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="4-digit code"
                  className="w-full h-12 bg-[#0c0b0a] border border-[#efe9de]/[0.08] px-3.5 rounded-lg text-center text-lg font-mono tracking-widest text-[#E5A93C] focus:outline-none focus:border-[#E5A93C] transition-colors duration-150 tabular-nums"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full h-11 rounded-xl bg-[#efe9de] hover:bg-white text-[#12110f] font-semibold text-xs transition-colors duration-150 active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer"
              >
                {isLoading ? (
                  <span>Verifying...</span>
                ) : (
                  <>
                    <Check className="w-3.5 h-3.5" strokeWidth={1.75} />
                    <span>Verify & sign in</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => setOtpStep(false)}
                className="w-full text-center text-xs text-[#787268] hover:text-[#aaa398] cursor-pointer"
              >
                Change number
              </button>
            </form>
          )}

          <div className="pt-3 border-t border-[#efe9de]/[0.08]">
            <button
              onClick={handleQuickDemoLogin}
              className="w-full h-10 rounded-xl bg-[#1e1c19] border border-[#efe9de]/[0.08] hover:bg-[#262421] text-[#efe9de] text-xs font-medium transition-colors duration-150 flex items-center justify-center gap-2 cursor-pointer"
            >
              <Zap className="w-3.5 h-3.5 text-[#E5A93C]" strokeWidth={1.75} />
              <span>Instant demo sign in</span>
            </button>
          </div>

          <div className="flex items-center justify-center gap-1.5 text-[11px] text-[#787268]">
            <ShieldCheck className="w-3.5 h-3.5 text-[#E5A93C]" strokeWidth={1.75} />
            <span>Encrypted authentication</span>
          </div>
        </div>
      </div>
    </div>
  );
};
