import React, { useEffect, useRef } from 'react';
import { X, ChevronLeft, ChevronRight, Maximize2 } from 'lucide-react';

interface LightboxItem {
  imageUrl: string;
  caption?: string;
  date?: string;
}

interface LightboxModalProps {
  items: LightboxItem[];
  currentIndex: number;
  isOpen: boolean;
  onClose: () => void;
  onSelectIndex: (index: number) => void;
}

export const LightboxModal: React.FC<LightboxModalProps> = ({
  items,
  currentIndex,
  isOpen,
  onClose,
  onSelectIndex,
}) => {
  const touchStartXRef = useRef<number | null>(null);

  const currentItem = items[currentIndex];

  const handlePrev = () => {
    if (currentIndex > 0) {
      onSelectIndex(currentIndex - 1);
    } else {
      onSelectIndex(items.length - 1);
    }
  };

  const handleNext = () => {
    if (currentIndex < items.length - 1) {
      onSelectIndex(currentIndex + 1);
    } else {
      onSelectIndex(0);
    }
  };

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') handlePrev();
      if (e.key === 'ArrowRight') handleNext();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, currentIndex, items.length]);

  // Touch Swipe navigation for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartXRef.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartXRef.current === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const deltaX = touchEndX - touchStartXRef.current;

    if (deltaX > 45) {
      // Swiped right -> go to prev
      handlePrev();
    } else if (deltaX < -45) {
      // Swiped left -> go to next
      handleNext();
    }
    touchStartXRef.current = null;
  };

  if (!isOpen || !currentItem) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-md p-4 sm:p-6"
    >
      {/* Top action bar */}
      <div className="absolute top-4 left-4 right-4 flex items-center justify-between text-white z-10">
        <div className="text-xs font-mono tracking-wider opacity-80">
          {currentIndex + 1} / {items.length}
        </div>
        <button
          onClick={onClose}
          className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
          aria-label="Close photo lightbox"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Main Image Container with Touch Handlers */}
      <div
        className="relative max-w-5xl max-h-[80vh] flex flex-col items-center justify-center select-none"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <img
          src={currentItem.imageUrl}
          alt={currentItem.caption || 'Memory photo'}
          referrerPolicy="no-referrer"
          className="max-h-[72vh] max-w-full object-contain rounded-xl shadow-2xl"
        />

        {/* Caption */}
        {currentItem.caption && (
          <div className="mt-4 text-center max-w-xl text-stone-200 text-sm font-light px-4">
            <p>{currentItem.caption}</p>
            {currentItem.date && (
              <span className="text-xs text-rose-300 font-mono mt-1 block">
                {currentItem.date}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Navigation arrows (desktop & tablet) */}
      {items.length > 1 && (
        <>
          <button
            onClick={handlePrev}
            className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-white/10 hover:bg-white/25 text-white backdrop-blur transition-colors cursor-pointer"
            aria-label="Previous photo"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            onClick={handleNext}
            className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-white/10 hover:bg-white/25 text-white backdrop-blur transition-colors cursor-pointer"
            aria-label="Next photo"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </>
      )}
    </div>
  );
};
