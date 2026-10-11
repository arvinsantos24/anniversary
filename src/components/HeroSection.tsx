import React, { useState, useEffect, useRef } from 'react';
import { Heart, Calendar, Clock, Edit2, Upload, Sparkles, Check } from 'lucide-react';
import { useAnniversary } from '../context/AnniversaryContext';
import { calculateElapsedTime, formatDatePretty } from '../utils/dateMath';
import { compressImageFile } from '../utils/imageCompressor';

export const HeroSection: React.FC = () => {
  const { data, updateData, isCreatorMode } = useAnniversary();
  const [elapsed, setElapsed] = useState(() => calculateElapsedTime(data.anniversaryDate));
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Edit states for Creator Mode
  const [isEditingNames, setIsEditingNames] = useState(false);
  const [namesInput, setNamesInput] = useState(data.coupleNames);
  const [taglineInput, setTaglineInput] = useState(data.tagline);

  const [isEditingDate, setIsEditingDate] = useState(false);
  const [dateInput, setDateInput] = useState(data.anniversaryDate.slice(0, 16));

  // Live timer tick every 1000ms
  useEffect(() => {
    const timer = setInterval(() => {
      setElapsed(calculateElapsedTime(data.anniversaryDate));
    }, 1000);
    return () => clearInterval(timer);
  }, [data.anniversaryDate]);

  const handleSaveNames = () => {
    updateData({
      coupleNames: namesInput,
      tagline: taglineInput,
    });
    setIsEditingNames(false);
  };

  const handleSaveDate = () => {
    updateData({
      anniversaryDate: new Date(dateInput).toISOString(),
    });
    setIsEditingDate(false);
  };

  const handleHeroImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const compressed = await compressImageFile(file, 1600, 0.85);
      updateData({ heroImageUrl: compressed });
    } catch (err) {
      alert('Could not process this image. Please try another.');
    }
  };

  return (
    <section id="hero" className="relative pt-8 pb-16 sm:py-20 overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Split Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          {/* Left Column: Typographic Hierarchy */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            {/* Subtle editorial kicker */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-100/80 dark:bg-rose-950/60 text-rose-800 dark:text-rose-300 text-xs tracking-wide font-medium">
              <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500" />
              <span>Celebrating Our Love</span>
            </div>

            {/* Names & Tagline */}
            {isEditingNames ? (
              <div className="p-4 rounded-2xl bg-white dark:bg-stone-800 border border-rose-300 dark:border-rose-700 shadow-md space-y-3">
                <div>
                  <label className="block text-xs font-medium text-stone-600 dark:text-stone-300 mb-1">
                    Couple Names:
                  </label>
                  <input
                    type="text"
                    value={namesInput}
                    onChange={(e) => setNamesInput(e.target.value)}
                    className="w-full px-3 py-2 text-xl font-serif rounded-lg border border-stone-300 dark:border-stone-600 bg-stone-50 dark:bg-stone-900 text-stone-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-stone-600 dark:text-stone-300 mb-1">
                    Romantic Subtitle / Tagline:
                  </label>
                  <input
                    type="text"
                    value={taglineInput}
                    onChange={(e) => setTaglineInput(e.target.value)}
                    className="w-full px-3 py-1.5 text-sm rounded-lg border border-stone-300 dark:border-stone-600 bg-stone-50 dark:bg-stone-900 text-stone-900 dark:text-white"
                  />
                </div>
                <div className="flex gap-2 justify-end">
                  <button
                    onClick={() => setIsEditingNames(false)}
                    className="px-3 py-1.5 text-xs text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-700 rounded-lg"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveNames}
                    className="px-4 py-1.5 text-xs bg-rose-600 text-white rounded-lg flex items-center gap-1"
                  >
                    <Check className="w-3.5 h-3.5" />
                    Save Names
                  </button>
                </div>
              </div>
            ) : (
              <div className="relative group">
                <h1 className="text-4xl sm:text-5xl md:text-6xl font-serif font-bold tracking-tight text-stone-900 dark:text-stone-50 leading-[1.1] text-balance">
                  {data.coupleNames}
                </h1>
                <p className="mt-3 text-base sm:text-lg text-stone-600 dark:text-stone-300 max-w-xl font-light leading-relaxed">
                  {data.tagline}
                </p>

                {isCreatorMode && (
                  <button
                    onClick={() => {
                      setNamesInput(data.coupleNames);
                      setTaglineInput(data.tagline);
                      setIsEditingNames(true);
                    }}
                    className="mt-2 inline-flex items-center gap-1.5 text-xs text-rose-600 dark:text-rose-400 font-medium hover:underline bg-rose-50 dark:bg-rose-950/60 px-2.5 py-1 rounded-lg border border-rose-200 dark:border-rose-800"
                  >
                    <Edit2 className="w-3 h-3" />
                    Edit Names & Subtitle
                  </button>
                )}
              </div>
            )}

            {/* Anniversary Date Badge */}
            <div className="flex items-center justify-center lg:justify-start gap-2 text-xs sm:text-sm text-stone-500 dark:text-stone-400">
              <Calendar className="w-4 h-4 text-rose-500" />
              <span>Together Since {formatDatePretty(data.anniversaryDate)}</span>
              {isCreatorMode && (
                <button
                  onClick={() => {
                    setDateInput(data.anniversaryDate.slice(0, 16));
                    setIsEditingDate(true);
                  }}
                  className="ml-2 text-xs text-rose-600 dark:text-rose-400 hover:underline inline-flex items-center gap-1"
                >
                  <Edit2 className="w-3 h-3" />
                  Edit Date
                </button>
              )}
            </div>

            {/* Edit Date Modal Drawer */}
            {isEditingDate && (
              <div className="p-4 rounded-xl bg-white dark:bg-stone-800 border border-rose-300 dark:border-rose-700 shadow-md max-w-sm space-y-2">
                <label className="block text-xs font-medium text-stone-700 dark:text-stone-300">
                  Select Anniversary Date & Time:
                </label>
                <input
                  type="datetime-local"
                  value={dateInput}
                  onChange={(e) => setDateInput(e.target.value)}
                  className="w-full px-3 py-1.5 text-sm rounded-lg border border-stone-300 dark:border-stone-600 bg-stone-50 dark:bg-stone-900 text-stone-900 dark:text-white"
                />
                <div className="flex gap-2 justify-end pt-1">
                  <button
                    onClick={() => setIsEditingDate(false)}
                    className="px-3 py-1 text-xs text-stone-600 dark:text-stone-400"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveDate}
                    className="px-3 py-1 text-xs bg-rose-600 text-white rounded-lg flex items-center gap-1"
                  >
                    <Check className="w-3.5 h-3.5" />
                    Save Date
                  </button>
                </div>
              </div>
            )}

            {/* Live Counter (Years, Months, Days, Hours, Minutes, Seconds) */}
            <div className="pt-2">
              <div className="text-xs uppercase tracking-widest text-stone-400 dark:text-stone-500 font-medium mb-3 flex items-center justify-center lg:justify-start gap-1.5">
                <Clock className="w-3.5 h-3.5 text-rose-500" />
                <span>Our Time Together</span>
              </div>

              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 sm:gap-3 max-w-xl mx-auto lg:mx-0">
                <div className="p-3 rounded-2xl bg-white/80 dark:bg-stone-800/80 border border-rose-100 dark:border-rose-950/60 shadow-sm text-center">
                  <div className="text-2xl sm:text-3xl font-bold font-mono tabular-nums text-rose-600 dark:text-rose-400">
                    {elapsed.years}
                  </div>
                  <div className="text-[11px] text-stone-500 dark:text-stone-400 mt-0.5">Years</div>
                </div>

                <div className="p-3 rounded-2xl bg-white/80 dark:bg-stone-800/80 border border-rose-100 dark:border-rose-950/60 shadow-sm text-center">
                  <div className="text-2xl sm:text-3xl font-bold font-mono tabular-nums text-rose-600 dark:text-rose-400">
                    {elapsed.months}
                  </div>
                  <div className="text-[11px] text-stone-500 dark:text-stone-400 mt-0.5">Months</div>
                </div>

                <div className="p-3 rounded-2xl bg-white/80 dark:bg-stone-800/80 border border-rose-100 dark:border-rose-950/60 shadow-sm text-center">
                  <div className="text-2xl sm:text-3xl font-bold font-mono tabular-nums text-rose-600 dark:text-rose-400">
                    {elapsed.days}
                  </div>
                  <div className="text-[11px] text-stone-500 dark:text-stone-400 mt-0.5">Days</div>
                </div>

                <div className="p-3 rounded-2xl bg-white/80 dark:bg-stone-800/80 border border-rose-100 dark:border-rose-950/60 shadow-sm text-center">
                  <div className="text-2xl sm:text-3xl font-bold font-mono tabular-nums text-rose-600 dark:text-rose-400">
                    {String(elapsed.hours).padStart(2, '0')}
                  </div>
                  <div className="text-[11px] text-stone-500 dark:text-stone-400 mt-0.5">Hours</div>
                </div>

                <div className="p-3 rounded-2xl bg-white/80 dark:bg-stone-800/80 border border-rose-100 dark:border-rose-950/60 shadow-sm text-center">
                  <div className="text-2xl sm:text-3xl font-bold font-mono tabular-nums text-rose-600 dark:text-rose-400">
                    {String(elapsed.minutes).padStart(2, '0')}
                  </div>
                  <div className="text-[11px] text-stone-500 dark:text-stone-400 mt-0.5">Minutes</div>
                </div>

                <div className="p-3 rounded-2xl bg-white/80 dark:bg-stone-800/80 border border-rose-100 dark:border-rose-950/60 shadow-sm text-center">
                  <div className="text-2xl sm:text-3xl font-bold font-mono tabular-nums text-rose-600 dark:text-rose-400">
                    {String(elapsed.seconds).padStart(2, '0')}
                  </div>
                  <div className="text-[11px] text-stone-500 dark:text-stone-400 mt-0.5">Seconds</div>
                </div>
              </div>

              {/* Total days calculation banner */}
              <p className="mt-3 text-xs text-stone-500 dark:text-stone-400 text-center lg:text-left">
                That is <strong className="font-mono tabular-nums text-rose-600 dark:text-rose-400">{elapsed.totalDays.toLocaleString()}</strong> days of laughs, adventures, and loving each other.
              </p>
            </div>
          </div>

          {/* Right Column: Hero Visual Container */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative w-full max-w-md aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl border-4 border-white dark:border-stone-800 shadow-rose-900/15 group">
              <img
                src={data.heroImageUrl}
                alt={`${data.coupleNames} anniversary tribute`}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />

              {/* Romantic subtle bottom scrim overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent pointer-events-none" />

              <div className="absolute bottom-5 left-5 right-5 text-white">
                <p className="font-serif italic text-sm sm:text-base leading-snug drop-shadow-md">
                  "{data.heroQuote}"
                </p>
              </div>

              {/* Creator Mode: Upload & Replace Photo Button */}
              {isCreatorMode && (
                <div className="absolute top-4 right-4">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleHeroImageUpload}
                    className="hidden"
                  />
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="px-3 py-1.5 rounded-xl bg-black/75 hover:bg-black/90 text-white text-xs font-medium backdrop-blur-md border border-white/20 shadow-lg flex items-center gap-1.5 transition-all cursor-pointer"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    Change Photo
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
