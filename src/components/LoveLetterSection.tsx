import React, { useState, useEffect } from 'react';
import { Heart, Edit2, Play, Pause, RotateCcw, Check, X, Plus, Trash2 } from 'lucide-react';
import { useAnniversary } from '../context/AnniversaryContext';
import { LoveLetter } from '../types';

export const LoveLetterSection: React.FC = () => {
  const { data, updateData, isCreatorMode } = useAnniversary();
  const [isTypewriterActive, setIsTypewriterActive] = useState(false);
  const [displayedTextLength, setDisplayedTextLength] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [editLetter, setEditLetter] = useState<LoveLetter>(data.loveLetter);

  // Combine full text for typewriter animation
  const fullLetterText = data.loveLetter.paragraphs.join('\n\n');

  useEffect(() => {
    if (!isTypewriterActive) {
      setDisplayedTextLength(fullLetterText.length);
      return;
    }

    setDisplayedTextLength(0);
    const interval = setInterval(() => {
      setDisplayedTextLength((prev) => {
        if (prev >= fullLetterText.length) {
          clearInterval(interval);
          return prev;
        }
        return prev + 2; // Type speed
      });
    }, 28);

    return () => clearInterval(interval);
  }, [isTypewriterActive, fullLetterText]);

  const handleStartEdit = () => {
    setEditLetter({ ...data.loveLetter });
    setIsEditing(true);
  };

  const handleSaveEdit = () => {
    updateData({ loveLetter: editLetter });
    setIsEditing(false);
  };

  const handleParagraphChange = (index: number, value: string) => {
    const updated = [...editLetter.paragraphs];
    updated[index] = value;
    setEditLetter({ ...editLetter, paragraphs: updated });
  };

  const handleAddParagraph = () => {
    setEditLetter({
      ...editLetter,
      paragraphs: [...editLetter.paragraphs, 'Write your next heartfelt message here...'],
    });
  };

  const handleRemoveParagraph = (index: number) => {
    if (editLetter.paragraphs.length <= 1) return;
    const updated = editLetter.paragraphs.filter((_, i) => i !== index);
    setEditLetter({ ...editLetter, paragraphs: updated });
  };

  return (
    <section id="letter" className="py-16 sm:py-24 border-t border-rose-100 dark:border-rose-950/60 relative">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="text-center max-w-xl mx-auto mb-12">
          <p className="text-xs uppercase tracking-widest text-rose-500 font-semibold mb-2">
            From My Heart To Yours
          </p>
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-stone-900 dark:text-stone-50">
            {data.loveLetter.title || 'A Letter For You'}
          </h2>

          {/* Action buttons */}
          <div className="mt-4 flex items-center justify-center gap-3">
            <button
              onClick={() => setIsTypewriterActive(!isTypewriterActive)}
              className="px-3.5 py-1.5 text-xs font-medium rounded-xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 hover:bg-rose-100 transition-colors inline-flex items-center gap-1.5 cursor-pointer"
            >
              {isTypewriterActive ? (
                <>
                  <Pause className="w-3.5 h-3.5" />
                  <span>Show Full Letter</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5" />
                  <span>Play Typewriter Effect</span>
                </>
              )}
            </button>

            {isCreatorMode && !isEditing && (
              <button
                onClick={handleStartEdit}
                className="px-3.5 py-1.5 text-xs font-medium rounded-xl bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 hover:opacity-90 transition-opacity inline-flex items-center gap-1.5 cursor-pointer"
              >
                <Edit2 className="w-3.5 h-3.5" />
                <span>Edit Letter Content</span>
              </button>
            )}
          </div>
        </div>

        {/* Letter Parchment Container */}
        {isEditing ? (
          <div className="p-6 sm:p-10 rounded-3xl bg-white dark:bg-stone-800 border-2 border-rose-400 shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-stone-200 dark:border-stone-700">
              <span className="text-sm font-semibold text-rose-600 dark:text-rose-400">
                Edit Love Letter
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() => setIsEditing(false)}
                  className="px-3 py-1.5 text-xs rounded-lg bg-stone-200 dark:bg-stone-700 text-stone-700 dark:text-stone-300"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveEdit}
                  className="px-4 py-1.5 text-xs bg-rose-600 text-white rounded-lg flex items-center gap-1"
                >
                  <Check className="w-3.5 h-3.5" />
                  Save Letter
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-stone-600 dark:text-stone-300 mb-1">
                  Letter Heading:
                </label>
                <input
                  type="text"
                  value={editLetter.title}
                  onChange={(e) => setEditLetter({ ...editLetter, title: e.target.value })}
                  className="w-full px-3 py-1.5 text-sm rounded-lg border border-stone-300 dark:border-stone-600 bg-stone-50 dark:bg-stone-900 text-stone-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-600 dark:text-stone-300 mb-1">
                  Salutation (Dear...):
                </label>
                <input
                  type="text"
                  value={editLetter.salutation}
                  onChange={(e) => setEditLetter({ ...editLetter, salutation: e.target.value })}
                  className="w-full px-3 py-1.5 text-sm rounded-lg border border-stone-300 dark:border-stone-600 bg-stone-50 dark:bg-stone-900 text-stone-900 dark:text-white"
                />
              </div>
            </div>

            <div className="space-y-3 pt-2">
              <label className="block text-xs font-medium text-stone-600 dark:text-stone-300">
                Paragraphs:
              </label>
              {editLetter.paragraphs.map((p, index) => (
                <div key={index} className="flex gap-2 items-start">
                  <textarea
                    rows={3}
                    value={p}
                    onChange={(e) => handleParagraphChange(index, e.target.value)}
                    className="flex-1 px-3 py-2 text-sm rounded-lg border border-stone-300 dark:border-stone-600 bg-stone-50 dark:bg-stone-900 text-stone-900 dark:text-white"
                  />
                  <button
                    onClick={() => handleRemoveParagraph(index)}
                    disabled={editLetter.paragraphs.length <= 1}
                    className="p-2 text-stone-400 hover:text-red-500 disabled:opacity-30"
                    title="Remove paragraph"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={handleAddParagraph}
                className="text-xs text-rose-600 hover:underline inline-flex items-center gap-1 font-medium"
              >
                <Plus className="w-3.5 h-3.5" />
                Add another paragraph
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              <div>
                <label className="block text-xs font-medium text-stone-600 dark:text-stone-300 mb-1">
                  Closing:
                </label>
                <input
                  type="text"
                  value={editLetter.closing}
                  onChange={(e) => setEditLetter({ ...editLetter, closing: e.target.value })}
                  className="w-full px-2.5 py-1 text-xs rounded-lg border border-stone-300 dark:border-stone-600 bg-stone-50 dark:bg-stone-900"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-stone-600 dark:text-stone-300 mb-1">
                  Signature:
                </label>
                <input
                  type="text"
                  value={editLetter.signature}
                  onChange={(e) => setEditLetter({ ...editLetter, signature: e.target.value })}
                  className="w-full px-2.5 py-1 text-xs rounded-lg border border-stone-300 dark:border-stone-600 bg-stone-50 dark:bg-stone-900"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-stone-600 dark:text-stone-300 mb-1">
                  Date Note:
                </label>
                <input
                  type="text"
                  value={editLetter.date}
                  onChange={(e) => setEditLetter({ ...editLetter, date: e.target.value })}
                  className="w-full px-2.5 py-1 text-xs rounded-lg border border-stone-300 dark:border-stone-600 bg-stone-50 dark:bg-stone-900"
                />
              </div>
            </div>
          </div>
        ) : (
          <div className="relative p-8 sm:p-14 rounded-3xl bg-[#FCFAF7] dark:bg-stone-900/90 border border-stone-200/80 dark:border-stone-800 shadow-xl shadow-rose-950/5 max-w-3xl mx-auto overflow-hidden">
            {/* Romantic watermark wax seal emblem */}
            <div className="absolute top-6 right-6 sm:top-8 sm:right-8 w-14 h-14 rounded-full bg-rose-700/90 dark:bg-rose-800 shadow-md flex items-center justify-center text-rose-100 border-2 border-rose-500/40 select-none">
              <Heart className="w-7 h-7 fill-rose-200 text-rose-100" />
            </div>

            {/* Salutation */}
            <p className="font-serif italic text-xl sm:text-2xl text-rose-950 dark:text-rose-200 font-medium mb-6">
              {data.loveLetter.salutation}
            </p>

            {/* Paragraphs with typewriter effect support */}
            <div className="space-y-5 text-base sm:text-lg text-stone-800 dark:text-stone-200 font-serif leading-relaxed font-light">
              {isTypewriterActive ? (
                <p className="whitespace-pre-line">
                  {fullLetterText.slice(0, displayedTextLength)}
                  {displayedTextLength < fullLetterText.length && (
                    <span className="inline-block w-2 h-4 ml-1 bg-rose-500 animate-pulse" />
                  )}
                </p>
              ) : (
                data.loveLetter.paragraphs.map((p, idx) => (
                  <p key={idx} className="leading-relaxed">
                    {p}
                  </p>
                ))
              )}
            </div>

            {/* Closing & Sign-off */}
            <div className="mt-10 pt-6 border-t border-rose-200/60 dark:border-rose-900/50 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div>
                <p className="text-sm font-serif italic text-stone-600 dark:text-stone-400">
                  {data.loveLetter.closing}
                </p>
                <p className="text-2xl sm:text-3xl font-serif font-bold text-rose-900 dark:text-rose-300 mt-1">
                  {data.loveLetter.signature}
                </p>
              </div>

              {data.loveLetter.date && (
                <div className="text-xs text-stone-400 font-mono tracking-wider">
                  {data.loveLetter.date}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
