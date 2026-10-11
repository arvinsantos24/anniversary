import React, { useEffect } from 'react';
import { Heart, Sparkles, X, Edit3, Check } from 'lucide-react';
import { useAnniversary } from '../context/AnniversaryContext';

interface SurpriseModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SurpriseModal: React.FC<SurpriseModalProps> = ({ isOpen, onClose }) => {
  const { data, updateData, isCreatorMode } = useAnniversary();
  const [isEditing, setIsEditing] = React.useState(false);
  const [title, setTitle] = React.useState(data.surpriseMessageTitle);
  const [content, setContent] = React.useState(data.surpriseMessageContent);

  // Trigger floating heart burst particles onto document when opened
  useEffect(() => {
    if (!isOpen) return;

    const createFloatingHeart = () => {
      const heart = document.createElement('div');
      heart.innerHTML = '❤️';
      heart.style.position = 'fixed';
      heart.style.left = `${Math.random() * 90 + 5}vw`;
      heart.style.bottom = '10vh';
      heart.style.fontSize = `${Math.random() * 24 + 18}px`;
      heart.style.opacity = '1';
      heart.style.pointerEvents = 'none';
      heart.style.zIndex = '9999';
      heart.style.transition = 'all 2.4s ease-out';
      document.body.appendChild(heart);

      requestAnimationFrame(() => {
        heart.style.transform = `translateY(-${Math.random() * 60 + 40}vh) scale(${Math.random() * 0.8 + 1})`;
        heart.style.opacity = '0';
      });

      setTimeout(() => {
        heart.remove();
      }, 2500);
    };

    // Burst 18 hearts
    for (let i = 0; i < 18; i++) {
      setTimeout(createFloatingHeart, i * 80);
    }
  }, [isOpen]);

  const handleSave = () => {
    updateData({
      surpriseMessageTitle: title,
      surpriseMessageContent: content,
    });
    setIsEditing(false);
  };

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn"
    >
      <div className="relative w-full max-w-lg p-8 sm:p-10 rounded-3xl bg-gradient-to-b from-stone-900 to-rose-950 text-white border border-rose-500/30 shadow-2xl shadow-rose-950 text-center space-y-6">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
          aria-label="Close surprise note"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Romantic Heart Icon Animation */}
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-rose-500/20 border-2 border-rose-400 text-rose-300 mx-auto shadow-inner">
          <Heart className="w-10 h-10 fill-rose-500 animate-pulse text-rose-300" />
        </div>

        {isEditing ? (
          <div className="space-y-3 text-left">
            <div>
              <label className="block text-xs font-medium text-stone-300 mb-1">
                Surprise Heading:
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-1.5 text-base font-serif rounded-lg bg-stone-800 border border-stone-700 text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-stone-300 mb-1">
                Surprise Message Content:
              </label>
              <textarea
                rows={4}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-lg bg-stone-800 border border-stone-700 text-white"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setIsEditing(false)}
                className="px-3 py-1.5 text-xs rounded-lg bg-stone-700 text-stone-300"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-1.5 text-xs rounded-lg bg-rose-600 text-white flex items-center gap-1"
              >
                <Check className="w-3.5 h-3.5" />
                Save Message
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <h3 className="text-3xl sm:text-4xl font-serif font-bold text-white tracking-wide">
              {data.surpriseMessageTitle}
            </h3>

            <p className="text-stone-200 text-base sm:text-lg font-light leading-relaxed font-serif whitespace-pre-line px-2">
              {data.surpriseMessageContent}
            </p>

            <div className="pt-4 flex flex-col items-center gap-2">
              <div className="inline-flex items-center gap-1.5 text-rose-300 text-xs font-mono tracking-widest uppercase">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Happy Anniversary Forever</span>
              </div>

              {isCreatorMode && (
                <button
                  onClick={() => {
                    setTitle(data.surpriseMessageTitle);
                    setContent(data.surpriseMessageContent);
                    setIsEditing(true);
                  }}
                  className="mt-2 text-xs text-rose-300 hover:text-white underline inline-flex items-center gap-1"
                >
                  <Edit3 className="w-3 h-3" />
                  Edit Surprise Message
                </button>
              )}
            </div>
          </div>
        )}

        <button
          onClick={onClose}
          className="w-full py-3 px-6 rounded-xl bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700 text-white font-medium text-sm shadow-lg shadow-rose-950 cursor-pointer"
        >
          Cherish This Always
        </button>
      </div>
    </div>
  );
};
