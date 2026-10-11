import React, { useState } from 'react';
import { Heart, Lock, KeyRound, Sparkles, HelpCircle, Eye, EyeOff, ShieldAlert } from 'lucide-react';
import { useAnniversary } from '../context/AnniversaryContext';

export const PasscodeGate: React.FC = () => {
  const { data, unlockViewer } = useAnniversary();
  const [passcode, setPasscode] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [rememberDevice, setRememberDevice] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [isShaking, setIsShaking] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUnlockingSuccess, setIsUnlockingSuccess] = useState(false);
  const [showSecurityInfo, setShowSecurityInfo] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!passcode.trim() || isSubmitting) return;

    setIsSubmitting(true);
    setErrorMsg('');

    const res = await unlockViewer(passcode, rememberDevice);
    setIsSubmitting(false);

    if (res.success) {
      setIsUnlockingSuccess(true);
    } else {
      setErrorMsg(res.message || 'Incorrect passcode. Try again!');
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 600);
    }
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-all duration-1000 ${
        isUnlockingSuccess
          ? 'scale-105 opacity-0 pointer-events-none'
          : 'opacity-100'
      } bg-gradient-to-b from-stone-900 via-rose-950 to-stone-950 text-stone-100`}
    >
      {/* Background ambient lighting */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-rose-500/10 rounded-full blur-3xl animate-pulse-subtle" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl" />
      </div>

      <div
        className={`relative w-full max-w-md p-8 sm:p-10 rounded-3xl bg-stone-900/80 backdrop-blur-xl border border-rose-500/20 shadow-2xl shadow-rose-950/50 transition-transform ${
          isShaking ? 'translate-x-[-10px] duration-75' : ''
        }`}
      >
        {/* Crest & Icon */}
        <div className="flex flex-col items-center text-center mb-6">
          <div className="relative mb-4 flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-rose-500/20 to-amber-500/10 border border-rose-500/30 text-rose-300 shadow-inner">
            <Heart className="w-8 h-8 fill-rose-500/40 text-rose-400 animate-pulse-subtle" />
            <Sparkles className="w-4 h-4 text-amber-300 absolute -top-1 -right-1" />
          </div>

          <p className="text-xs tracking-widest uppercase text-rose-300/80 font-medium mb-1">
            Private Anniversary Tribute
          </p>
          <h1 className="text-3xl sm:text-4xl font-serif text-white tracking-wide">
            {data.coupleNames || 'Our Love Story'}
          </h1>
          <p className="text-sm text-stone-300 mt-2 font-light">
            A private space created with love. Please enter our special passcode to step inside.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label htmlFor="passcode-input" className="block text-xs font-medium text-stone-300">
              Passcode
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                <KeyRound className="w-4 h-4" />
              </div>
              <input
                id="passcode-input"
                type={showPassword ? 'text' : 'password'}
                value={passcode}
                onChange={(e) => {
                  setPasscode(e.target.value);
                  if (errorMsg) setErrorMsg('');
                }}
                placeholder="Enter passcode..."
                autoComplete="current-password"
                autoFocus
                className="w-full pl-10 pr-11 py-3 bg-stone-800/80 border border-stone-700/80 focus:border-rose-400 focus:ring-2 focus:ring-rose-400/20 rounded-xl text-stone-100 placeholder-stone-500 text-center tracking-widest text-lg font-mono transition-all outline-none"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? 'Hide passcode' : 'Show passcode'}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-stone-400 hover:text-stone-200 transition-colors"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Error Message with gentle shake */}
          {errorMsg && (
            <div className="p-2.5 rounded-lg bg-rose-500/15 border border-rose-500/30 text-rose-200 text-xs text-center font-medium animate-fadeIn">
              {errorMsg}
            </div>
          )}

          {/* Options */}
          <div className="flex items-center justify-between text-xs text-stone-400 pt-1">
            <label className="flex items-center gap-2 cursor-pointer select-none hover:text-stone-200">
              <input
                type="checkbox"
                checked={rememberDevice}
                onChange={(e) => setRememberDevice(e.target.checked)}
                className="rounded bg-stone-800 border-stone-700 text-rose-600 focus:ring-rose-500 focus:ring-offset-0"
              />
              <span>Remember this device</span>
            </label>

            {data.viewerPasscodeHint && (
              <button
                type="button"
                onClick={() => setShowHint(!showHint)}
                className="inline-flex items-center gap-1 text-rose-300 hover:text-rose-200 hover:underline transition-colors"
              >
                <HelpCircle className="w-3.5 h-3.5" />
                <span>{showHint ? 'Hide Hint' : 'Need a Hint?'}</span>
              </button>
            )}
          </div>

          {/* Hint Disclosure */}
          {showHint && data.viewerPasscodeHint && (
            <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-200 text-xs leading-relaxed">
              <span className="font-semibold text-amber-300">Hint: </span>
              {data.viewerPasscodeHint}
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting || !passcode.trim()}
            className="w-full mt-2 py-3 px-6 rounded-xl bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700 active:scale-[0.98] text-white font-medium text-sm tracking-wide shadow-lg shadow-rose-900/40 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
          >
            {isSubmitting ? (
              <span>Unlocking...</span>
            ) : (
              <>
                <Heart className="w-4 h-4 fill-white/80" />
                <span>Unlock Memories</span>
              </>
            )}
          </button>
        </form>

        {/* Default code note & security transparency */}
        <div className="mt-6 pt-4 border-t border-stone-800/80 flex items-center justify-between text-[11px] text-stone-500">
          <span>Default sample code: <strong className="text-rose-400 font-mono">1402</strong></span>
          <button
            type="button"
            onClick={() => setShowSecurityInfo(!showSecurityInfo)}
            className="inline-flex items-center gap-1 hover:text-stone-300 transition-colors"
          >
            <ShieldAlert className="w-3 h-3 text-amber-400" />
            <span>Security note</span>
          </button>
        </div>

        {/* Security transparency modal explanation */}
        {showSecurityInfo && (
          <div className="mt-3 p-3 rounded-xl bg-stone-800/90 border border-stone-700 text-stone-300 text-[11px] leading-normal space-y-1.5">
            <p className="font-semibold text-amber-300">How Passcode Protection Works:</p>
            <p>
              Your passcode is never saved in plain text — it is securely hashed with <strong>SHA-256</strong>.
            </p>
            <p>
              In a static frontend website, this stops romantic surprises from being seen by casual visitors or friends borrowing your phone. For full enterprise secrecy against someone inspecting raw browser memory, an authenticated server backend (e.g. Firebase Auth) is required.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
