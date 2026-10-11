import React, { useState } from 'react';
import { Heart, Lock, Sun, Moon, Sparkles, Feather, ShieldCheck } from 'lucide-react';
import { useAnniversary } from '../context/AnniversaryContext';

interface NavbarProps {
  onOpenCreatorAuth: () => void;
  onOpenSurprise: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenCreatorAuth, onOpenSurprise }) => {
  const { data, relockViewer, isDarkMode, setIsDarkMode, isCreatorMode } = useAnniversary();

  return (
    <header className="sticky top-0 z-30 w-full backdrop-blur-md bg-stone-50/80 dark:bg-stone-900/80 border-b border-rose-100/70 dark:border-rose-950/60 transition-colors">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Brand Wordmark (Single text element in display serif) */}
        <a
          href="#hero"
          className="text-xl sm:text-2xl font-serif font-semibold tracking-tight text-rose-950 dark:text-rose-100 hover:text-rose-600 dark:hover:text-rose-300 transition-colors whitespace-nowrap shrink-0 flex items-center gap-2"
        >
          <span>{data.coupleNames || 'Alex & Maya'}</span>
          <span className="text-rose-500 text-sm">♥</span>
        </a>

        {/* Zone 2: 4 concise single-line nav links */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-stone-600 dark:text-stone-300">
          <a
            href="#story"
            className="hover:text-rose-600 dark:hover:text-rose-300 transition-colors whitespace-nowrap shrink-0"
          >
            Our Journey
          </a>
          <a
            href="#gallery"
            className="hover:text-rose-600 dark:hover:text-rose-300 transition-colors whitespace-nowrap shrink-0"
          >
            Gallery
          </a>
          <a
            href="#letter"
            className="hover:text-rose-600 dark:hover:text-rose-300 transition-colors whitespace-nowrap shrink-0"
          >
            Love Letter
          </a>
          <a
            href="#reasons"
            className="hover:text-rose-600 dark:hover:text-rose-300 transition-colors whitespace-nowrap shrink-0"
          >
            Reasons I Love You
          </a>
        </nav>

        {/* Zone 3: 1 Primary Action + subtle utility icon controls */}
        <div className="flex items-center gap-2.5 shrink-0">
          {/* Night/Day mode switch */}
          <button
            type="button"
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="p-2 rounded-xl text-stone-500 hover:text-stone-800 dark:text-stone-400 dark:hover:text-stone-100 hover:bg-rose-50 dark:hover:bg-rose-950/50 transition-colors"
            title={isDarkMode ? 'Switch to romantic daylight' : 'Switch to romantic twilight'}
            aria-label="Toggle dark mode"
          >
            {isDarkMode ? <Sun className="w-4 h-4 text-amber-300" /> : <Moon className="w-4 h-4 text-stone-600" />}
          </button>

          {/* Re-lock screen button */}
          <button
            type="button"
            onClick={relockViewer}
            className="p-2 rounded-xl text-stone-500 hover:text-stone-800 dark:text-stone-400 dark:hover:text-stone-100 hover:bg-rose-50 dark:hover:bg-rose-950/50 transition-colors"
            title="Lock Tribute Screen"
            aria-label="Lock screen"
          >
            <Lock className="w-4 h-4" />
          </button>

          {/* Primary CTA: Special Surprise */}
          <button
            type="button"
            onClick={onOpenSurprise}
            className="px-4 py-2 text-xs sm:text-sm font-medium text-white bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700 rounded-xl shadow-sm shadow-rose-900/20 active:scale-[0.98] transition-all whitespace-nowrap shrink-0 flex items-center gap-1.5 cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>A Surprise For You</span>
          </button>
        </div>
      </div>
    </header>
  );
};
