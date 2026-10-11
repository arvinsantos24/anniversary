import React from 'react';
import { Heart, Lock, Sparkles, Feather } from 'lucide-react';
import { useAnniversary } from '../context/AnniversaryContext';

interface FooterProps {
  onOpenCreatorAuth: () => void;
  onOpenSurprise: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenCreatorAuth, onOpenSurprise }) => {
  const { data, isCreatorMode } = useAnniversary();

  return (
    <footer className="relative pt-16 pb-20 border-t border-rose-200/70 dark:border-rose-950/60 bg-stone-100/60 dark:bg-stone-900/60 transition-colors">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center space-y-8">
        {/* Heart Seal */}
        <div className="flex items-center justify-center">
          <div className="w-12 h-12 rounded-full bg-rose-500/10 dark:bg-rose-500/20 border border-rose-400/30 flex items-center justify-center text-rose-500">
            <Heart className="w-6 h-6 fill-rose-500" />
          </div>
        </div>

        {/* Final Anniversary Blessing */}
        <div className="space-y-3 max-w-xl mx-auto">
          <h3 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900 dark:text-stone-100">
            {data.finalNote.heading}
          </h3>
          <p className="text-stone-600 dark:text-stone-300 text-sm sm:text-base font-light leading-relaxed font-serif">
            {data.finalNote.body}
          </p>
          <p className="font-serif italic text-rose-700 dark:text-rose-400 font-medium pt-2">
            — {data.finalNote.signature}
          </p>
        </div>

        {/* Surprise action reminder */}
        <div>
          <button
            onClick={onOpenSurprise}
            className="px-6 py-2.5 rounded-2xl bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700 text-white font-medium text-xs sm:text-sm shadow-md shadow-rose-900/20 active:scale-[0.98] transition-all inline-flex items-center gap-2 cursor-pointer"
          >
            <Sparkles className="w-4 h-4" />
            <span>{data.surpriseButtonLabel || 'Open My Heart For You'}</span>
          </button>
        </div>

        {/* Quiet Footer Metadata & Discreet Creator Trigger */}
        <div className="pt-8 border-t border-stone-200/80 dark:border-stone-800/80 flex flex-col sm:flex-row items-center justify-between text-xs text-stone-400 dark:text-stone-500 gap-4">
          <div className="flex items-center gap-2">
            <span>Made with endless love for {data.partnerTwoName || 'my favorite person'}</span>
            <span aria-hidden="true">·</span>
            <span>Forever & Always</span>
          </div>

          <div className="flex items-center gap-3">
            {/* Discreet Creator Mode Trigger */}
            <button
              onClick={onOpenCreatorAuth}
              className="text-stone-400 hover:text-rose-600 dark:hover:text-rose-400 transition-colors flex items-center gap-1 opacity-70 hover:opacity-100"
              title="Creator Edit Access"
            >
              <Lock className="w-3 h-3" />
              <span>{isCreatorMode ? 'Edit Mode Active' : 'Creator Access'}</span>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
