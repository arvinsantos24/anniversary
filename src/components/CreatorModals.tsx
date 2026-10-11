import React, { useState, useRef } from 'react';
import {
  Lock,
  KeyRound,
  Music,
  Download,
  Upload,
  RefreshCw,
  LogOut,
  Shield,
  HelpCircle,
  Check,
  X,
  Sparkles,
  ExternalLink,
  BookOpen,
  Eye,
  EyeOff,
} from 'lucide-react';
import { useAnniversary } from '../context/AnniversaryContext';
import { hashString } from '../utils/crypto';
import { extractYouTubeId } from '../utils/youtube';

interface CreatorAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CreatorAuthModal: React.FC<CreatorAuthModalProps> = ({ isOpen, onClose }) => {
  const { enterCreatorMode } = useAnniversary();
  const [pin, setPin] = useState('');
  const [showPin, setShowPin] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pin.trim() || isSubmitting) return;

    setIsSubmitting(true);
    setErrorMsg('');

    const res = await enterCreatorMode(pin);
    setIsSubmitting(false);

    if (res.success) {
      setPin('');
      onClose();
    } else {
      setErrorMsg(res.message || 'Invalid Creator PIN.');
    }
  };

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn"
    >
      <div className="relative w-full max-w-sm p-6 sm:p-8 rounded-3xl bg-stone-900 border border-stone-700 text-stone-100 shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full text-stone-400 hover:text-white"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-rose-500/20 border border-rose-500/30 flex items-center justify-center text-rose-400 mx-auto mb-3">
            <Lock className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-serif font-bold text-white">Enter Creator Edit Mode</h3>
          <p className="text-xs text-stone-400 mt-1">
            Enter your secret Creator PIN to customize memories, passcodes, and music.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs text-stone-300 font-medium mb-1">Creator PIN</label>
            <div className="relative">
              <input
                type={showPin ? 'text' : 'password'}
                value={pin}
                onChange={(e) => {
                  setPin(e.target.value);
                  if (errorMsg) setErrorMsg('');
                }}
                placeholder="Type 9999"
                autoFocus
                className="w-full pl-4 pr-10 py-2.5 rounded-xl bg-stone-800 border border-stone-700 text-white text-center font-mono tracking-widest text-lg focus:border-rose-500 focus:outline-none"
              />
              <button
                type="button"
                onClick={() => setShowPin(!showPin)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-200"
                aria-label={showPin ? 'Hide PIN' : 'Show PIN'}
              >
                {showPin ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {errorMsg && (
            <p className="text-xs text-rose-400 text-center font-medium">{errorMsg}</p>
          )}

          <button
            type="submit"
            disabled={isSubmitting || !pin.trim()}
            className="w-full py-2.5 px-4 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-sm font-medium transition-colors disabled:opacity-50 cursor-pointer"
          >
            {isSubmitting ? 'Verifying...' : 'Unlock Edit Controls'}
          </button>

          <div className="flex items-center justify-center gap-1.5 pt-1 text-[11px] text-stone-400">
            <span>Default PIN:</span>
            <button
              type="button"
              onClick={() => {
                setPin('9999');
                if (errorMsg) setErrorMsg('');
              }}
              className="text-rose-400 font-mono font-semibold hover:underline cursor-pointer"
            >
              9999 (Click to fill)
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
  const { data, updateData } = useAnniversary();
  const [activeTab, setActiveTab] = useState<'passcode' | 'music' | 'guide'>('passcode');

  // Passcode states
  const [newViewerPasscode, setNewViewerPasscode] = useState('');
  const [newViewerHint, setNewViewerHint] = useState(data.viewerPasscodeHint);
  const [newCreatorPin, setNewCreatorPin] = useState('');
  const [passcodeSuccessMsg, setPasscodeSuccessMsg] = useState('');

  // Music states
  const [musicUrl, setMusicUrl] = useState(data.youtubeUrl);
  const [songTitle, setSongTitle] = useState(data.songTitle);
  const [musicSuccessMsg, setMusicSuccessMsg] = useState('');

  const handleSavePasscodes = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasscodeSuccessMsg('');
    const updates: any = {};

    if (newViewerPasscode.trim()) {
      updates.viewerPasscodeHash = await hashString(newViewerPasscode);
    }
    if (newViewerHint !== data.viewerPasscodeHint) {
      updates.viewerPasscodeHint = newViewerHint;
    }
    if (newCreatorPin.trim()) {
      updates.creatorPasscodeHash = await hashString(newCreatorPin);
    }

    if (Object.keys(updates).length > 0) {
      updateData(updates);
      setPasscodeSuccessMsg('Passcodes updated successfully! They are securely hashed.');
      setNewViewerPasscode('');
      setNewCreatorPin('');
      setTimeout(() => setPasscodeSuccessMsg(''), 4000);
    }
  };

  const handleSaveMusic = (e: React.FormEvent) => {
    e.preventDefault();
    setMusicSuccessMsg('');
    const extractedId = extractYouTubeId(musicUrl);
    if (!extractedId) {
      alert('Could not recognize a valid YouTube link or ID. Please check the URL.');
      return;
    }

    updateData({
      youtubeUrl: musicUrl,
      songTitle: songTitle || 'Our Song',
    });
    setMusicSuccessMsg('Music saved successfully!');
    setTimeout(() => setMusicSuccessMsg(''), 4000);
  };

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn"
    >
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 sm:p-8 rounded-3xl bg-stone-900 border border-stone-700 text-stone-100 shadow-2xl space-y-6">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full text-stone-400 hover:text-white"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        <div>
          <h2 className="text-2xl font-serif font-bold text-white">Creator Configuration & Guide</h2>
          <p className="text-xs text-stone-400 mt-1">
            Manage your partner's access, background music soundtrack, and deployment instructions.
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-stone-800 gap-4 text-xs font-medium">
          <button
            onClick={() => setActiveTab('passcode')}
            className={`pb-3 border-b-2 transition-colors ${
              activeTab === 'passcode'
                ? 'border-rose-500 text-white font-semibold'
                : 'border-transparent text-stone-400 hover:text-stone-200'
            }`}
          >
            Passcodes & Security
          </button>
          <button
            onClick={() => setActiveTab('music')}
            className={`pb-3 border-b-2 transition-colors ${
              activeTab === 'music'
                ? 'border-rose-500 text-white font-semibold'
                : 'border-transparent text-stone-400 hover:text-stone-200'
            }`}
          >
            YouTube Background Music
          </button>
          <button
            onClick={() => setActiveTab('guide')}
            className={`pb-3 border-b-2 transition-colors ${
              activeTab === 'guide'
                ? 'border-rose-500 text-white font-semibold'
                : 'border-transparent text-stone-400 hover:text-stone-200'
            }`}
          >
            Hosting & Free Publishing Guide
          </button>
        </div>

        {/* Tab 1: Passcodes */}
        {activeTab === 'passcode' && (
          <form onSubmit={handleSavePasscodes} className="space-y-4 text-sm">
            <div className="p-4 rounded-2xl bg-stone-800/60 border border-stone-700 space-y-3">
              <h4 className="font-semibold text-rose-400 text-xs uppercase tracking-wider">
                Viewer Lock Screen (Your Partner's Passcode)
              </h4>

              <div>
                <label className="block text-xs text-stone-300 mb-1">
                  Change Viewer Passcode:
                </label>
                <input
                  type="text"
                  value={newViewerPasscode}
                  onChange={(e) => setNewViewerPasscode(e.target.value)}
                  placeholder="Leave blank to keep existing passcode (default: 1402)"
                  className="w-full px-3 py-2 rounded-xl bg-stone-900 border border-stone-700 text-white text-xs font-mono"
                />
              </div>

              <div>
                <label className="block text-xs text-stone-300 mb-1">
                  Passcode Hint for Your Partner:
                </label>
                <input
                  type="text"
                  value={newViewerHint}
                  onChange={(e) => setNewViewerHint(e.target.value)}
                  placeholder="e.g. Our anniversary date (MMDD)"
                  className="w-full px-3 py-2 rounded-xl bg-stone-900 border border-stone-700 text-white text-xs"
                />
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-stone-800/60 border border-stone-700 space-y-3">
              <h4 className="font-semibold text-amber-400 text-xs uppercase tracking-wider">
                Creator Mode PIN (Your Secret Edit Key)
              </h4>

              <div>
                <label className="block text-xs text-stone-300 mb-1">
                  Change Creator PIN:
                </label>
                <input
                  type="text"
                  value={newCreatorPin}
                  onChange={(e) => setNewCreatorPin(e.target.value)}
                  placeholder="Leave blank to keep current PIN (default: 9999)"
                  className="w-full px-3 py-2 rounded-xl bg-stone-900 border border-stone-700 text-white text-xs font-mono"
                />
              </div>
            </div>

            {passcodeSuccessMsg && (
              <div className="p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2">
                <Check className="w-4 h-4" />
                <span>{passcodeSuccessMsg}</span>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-2.5 px-4 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-medium transition-colors"
            >
              Update Security Passcodes
            </button>
          </form>
        )}

        {/* Tab 2: Music */}
        {activeTab === 'music' && (
          <form onSubmit={handleSaveMusic} className="space-y-4 text-sm">
            <div className="p-4 rounded-2xl bg-stone-800/60 border border-stone-700 space-y-3">
              <h4 className="font-semibold text-rose-400 text-xs uppercase tracking-wider">
                Romantic Background Song
              </h4>

              <div>
                <label className="block text-xs text-stone-300 mb-1">
                  YouTube Video Link or ID:
                </label>
                <input
                  type="text"
                  value={musicUrl}
                  onChange={(e) => setMusicUrl(e.target.value)}
                  placeholder="e.g. https://www.youtube.com/watch?v=0pWsL6PzYyA or youtu.be/..."
                  className="w-full px-3 py-2 rounded-xl bg-stone-900 border border-stone-700 text-white text-xs font-mono"
                />
                <p className="text-[11px] text-stone-400 mt-1">
                  Accepts standard links, short links (youtu.be), YouTube Music links, or 11-char IDs.
                </p>
              </div>

              <div>
                <label className="block text-xs text-stone-300 mb-1">
                  Display Song Title:
                </label>
                <input
                  type="text"
                  value={songTitle}
                  onChange={(e) => setSongTitle(e.target.value)}
                  placeholder="e.g. Can't Help Falling in Love"
                  className="w-full px-3 py-2 rounded-xl bg-stone-900 border border-stone-700 text-white text-xs"
                />
              </div>

              {extractYouTubeId(musicUrl) && (
                <div className="text-[11px] text-emerald-400 flex items-center gap-1.5 pt-1">
                  <Check className="w-3.5 h-3.5" />
                  <span>Valid YouTube Video ID: <code>{extractYouTubeId(musicUrl)}</code></span>
                </div>
              )}
            </div>

            {musicSuccessMsg && (
              <div className="p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2">
                <Check className="w-4 h-4" />
                <span>{musicSuccessMsg}</span>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-2.5 px-4 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-medium transition-colors"
            >
              Save Music Soundtrack
            </button>
          </form>
        )}

        {/* Tab 3: Publishing Guide & Security Limits */}
        {activeTab === 'guide' && (
          <div className="space-y-4 text-xs text-stone-300 leading-relaxed">
            <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-200 space-y-2">
              <h4 className="font-semibold text-amber-300 flex items-center gap-1.5">
                <Shield className="w-4 h-4" />
                Security Honesty: Frontend Hashing vs Backend Database
              </h4>
              <p>
                This website hashes all passcodes with <strong>SHA-256</strong>, meaning your actual passcode is never saved in plain text.
              </p>
              <p>
                <strong>The limits:</strong> Because this is a static frontend website, all assets (images, text, letters) reside in the client application bundle or browser storage. This completely protects against accidental peeks from friends, family, or your partner glancing at your phone. However, a tech-savvy person inspecting browser Developer Tools could theoretically locate stored values.
              </p>
              <p>
                <strong>Stronger option:</strong> If you need bank-grade privacy, a full backend with server-side authentication (e.g. Firebase Auth + Firestore security rules) can verify users before delivering any images or text over the wire.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-stone-800/80 border border-stone-700 space-y-3">
              <h4 className="font-semibold text-rose-300 flex items-center gap-1.5">
                <BookOpen className="w-4 h-4" />
                How to Host & Give This to Your Partner for Free
              </h4>

              <div className="space-y-2">
                <p>
                  <strong>Option A — Export Backup & Share URL:</strong> If you host this app on any free static provider, you can edit your content here, click <strong>"Export Backup (JSON)"</strong>, and commit your updated <code>src/data/defaultData.ts</code> or distribute it.
                </p>
                <p>
                  <strong>Option B — Deploy for Free on Vercel or Netlify:</strong>
                </p>
                <ol className="list-decimal list-inside space-y-1 text-stone-400 pl-2">
                  <li>Push your project code to a private GitHub repository.</li>
                  <li>Go to <a href="https://vercel.com" target="_blank" rel="noreferrer" className="text-rose-400 underline">Vercel.com</a> or <a href="https://netlify.com" target="_blank" rel="noreferrer" className="text-rose-400 underline">Netlify.com</a> and sign in with GitHub.</li>
                  <li>Click "Import Repository" and press "Deploy". Build command: <code>npm run build</code>, Output directory: <code>dist</code>.</li>
                  <li>You get a free, private HTTPS link (e.g. <code>our-anniversary.vercel.app</code>) to send your partner with a sweet message!</li>
                </ol>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export const CreatorToolbar: React.FC<{ onOpenSettings: () => void }> = ({ onOpenSettings }) => {
  const {
    isCreatorMode,
    exitCreatorMode,
    saveStatus,
    lastSavedAt,
    exportBackupJson,
    importBackupJson,
    resetToDefaults,
  } = useAnniversary();

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  if (!isCreatorMode) return null;

  const handleImportFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const res = await importBackupJson(file);
    alert(res.message);
  };

  const handleReset = () => {
    if (confirm('Are you sure you want to reset everything back to initial sample memories? This will overwrite your edits.')) {
      resetToDefaults();
    }
  };

  return (
    <div className="sticky top-16 z-40 w-full bg-stone-900 border-b border-rose-500/40 text-stone-100 px-4 py-2 text-xs shadow-lg backdrop-blur">
      <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-3">
        {/* Left: Mode Badge & Live Save Status */}
        <div className="flex items-center gap-3">
          <span className="px-2.5 py-0.5 rounded-full bg-rose-500/30 text-rose-300 font-semibold uppercase tracking-wider text-[10px] border border-rose-500/50 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-ping" />
            Edit Mode ON
          </span>

          <div className="flex items-center gap-1.5 text-stone-400">
            {saveStatus === 'saving' && <span>Saving edits...</span>}
            {saveStatus === 'saved' && (
              <span className="text-emerald-400 flex items-center gap-1">
                <Check className="w-3.5 h-3.5" />
                Saved automatically
              </span>
            )}
            {saveStatus === 'idle' && lastSavedAt && (
              <span>Last saved at {lastSavedAt}</span>
            )}
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={onOpenSettings}
            className="px-2.5 py-1 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-200 border border-stone-700 flex items-center gap-1 transition-colors"
          >
            <Shield className="w-3.5 h-3.5 text-rose-400" />
            <span>Settings & Passcodes</span>
          </button>

          <button
            onClick={exportBackupJson}
            className="px-2.5 py-1 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-200 border border-stone-700 flex items-center gap-1 transition-colors"
            title="Download JSON backup file"
          >
            <Download className="w-3.5 h-3.5 text-blue-400" />
            <span>Export Backup</span>
          </button>

          <input
            ref={fileInputRef}
            type="file"
            accept=".json"
            onChange={handleImportFile}
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="px-2.5 py-1 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-200 border border-stone-700 flex items-center gap-1 transition-colors"
            title="Import JSON backup file"
          >
            <Upload className="w-3.5 h-3.5 text-emerald-400" />
            <span>Import JSON</span>
          </button>

          <button
            onClick={handleReset}
            className="px-2 py-1 rounded-lg bg-stone-800 hover:bg-red-950/60 text-stone-400 hover:text-red-300 border border-stone-700 transition-colors"
            title="Reset to default template"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={exitCreatorMode}
            className="px-3 py-1 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-medium flex items-center gap-1 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Preview As Partner</span>
          </button>
        </div>
      </div>
    </div>
  );
};
