import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { AnniversaryData } from '../types';
import { INITIAL_ANNIVERSARY_DATA } from '../data/defaultData';
import { verifyPasscode, hashString } from '../utils/crypto';

interface AnniversaryContextType {
  data: AnniversaryData;
  isUnlocked: boolean;
  isCreatorMode: boolean;
  saveStatus: 'idle' | 'saving' | 'saved';
  lastSavedAt: string | null;
  isMusicPlaying: boolean;
  musicVolume: number;
  isMuted: boolean;
  isPetalsActive: boolean;
  isDarkMode: boolean;
  showMusicVideo: boolean;
  
  // Actions
  unlockViewer: (passcode: string, rememberDevice: boolean) => Promise<{ success: boolean; message?: string }>;
  relockViewer: () => void;
  enterCreatorMode: (pin: string) => Promise<{ success: boolean; message?: string }>;
  exitCreatorMode: () => void;
  updateData: (updater: Partial<AnniversaryData> | ((prev: AnniversaryData) => Partial<AnniversaryData>)) => void;
  exportBackupJson: () => void;
  importBackupJson: (file: File) => Promise<{ success: boolean; message: string }>;
  resetToDefaults: () => void;
  
  // Music & UI Controls
  setIsMusicPlaying: (playing: boolean | ((p: boolean) => boolean)) => void;
  setMusicVolume: (vol: number) => void;
  setIsMuted: (muted: boolean | ((m: boolean) => boolean)) => void;
  setIsPetalsActive: (active: boolean | ((a: boolean) => boolean)) => void;
  setIsDarkMode: (dark: boolean | ((d: boolean) => boolean)) => void;
  setShowMusicVideo: (show: boolean | ((s: boolean) => boolean)) => void;
}

const STORAGE_KEY_DATA = 'forever_anniversary_data_v1';
const STORAGE_KEY_UNLOCKED = 'forever_anniversary_unlocked';
const STORAGE_KEY_CREATOR = 'forever_anniversary_creator_mode';
const STORAGE_KEY_THEME = 'forever_anniversary_dark_mode';

const AnniversaryContext = createContext<AnniversaryContextType | undefined>(undefined);

export const AnniversaryProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Load initial data from localStorage if exists, else default
  const [data, setData] = useState<AnniversaryData>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_DATA);
      if (stored) {
        const parsed = JSON.parse(stored);
        // Automatically migrate legacy hashes if user loaded with old defaults
        if (parsed.creatorPasscodeHash === 'e9573887c2b535d55b0a373d489b4f91e920d317fb6c85746777cf4798365825') {
          parsed.creatorPasscodeHash = '888df25ae35772424a560c7152a1de794440e0ea5cfee62828333a456a506e05';
        }
        if (parsed.viewerPasscodeHash === '1099f6630f94119d5c3da466be8e495f2d6556e8738ad057cf57d6e5c5443fa5') {
          parsed.viewerPasscodeHash = '5626696e19ac4b81318bf2bdc4af05efb210da38a29f0cc395eeda1c37d11ede';
        }
        return { ...INITIAL_ANNIVERSARY_DATA, ...parsed };
      }
    } catch (err) {
      console.warn('Could not read stored anniversary data:', err);
    }
    return INITIAL_ANNIVERSARY_DATA;
  });

  // Check if previously unlocked (remembered on this device or session)
  const [isUnlocked, setIsUnlocked] = useState<boolean>(() => {
    try {
      const local = localStorage.getItem(STORAGE_KEY_UNLOCKED);
      const session = sessionStorage.getItem(STORAGE_KEY_UNLOCKED);
      return local === 'true' || session === 'true';
    } catch {
      return false;
    }
  });

  const [isCreatorMode, setIsCreatorMode] = useState<boolean>(() => {
    try {
      return sessionStorage.getItem(STORAGE_KEY_CREATOR) === 'true';
    } catch {
      return false;
    }
  });

  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');
  const [lastSavedAt, setLastSavedAt] = useState<string | null>(null);

  // Audio & Atmosphere Controls
  const [isMusicPlaying, setIsMusicPlaying] = useState<boolean>(false);
  const [musicVolume, setMusicVolume] = useState<number>(70);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [showMusicVideo, setShowMusicVideo] = useState<boolean>(false);
  const [isPetalsActive, setIsPetalsActive] = useState<boolean>(true);
  
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    try {
      return localStorage.getItem(STORAGE_KEY_THEME) === 'true';
    } catch {
      return false;
    }
  });

  // Save dark mode preference
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_THEME, String(isDarkMode));
      if (isDarkMode) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    } catch {
      // ignore
    }
  }, [isDarkMode]);

  // Persist data changes to localStorage with debounced indicator
  const persistData = useCallback((newData: AnniversaryData) => {
    setSaveStatus('saving');
    try {
      localStorage.setItem(STORAGE_KEY_DATA, JSON.stringify(newData));
      setSaveStatus('saved');
      setLastSavedAt(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
      setTimeout(() => {
        setSaveStatus('idle');
      }, 2500);
    } catch (err) {
      console.error('Storage write error:', err);
      setSaveStatus('idle');
    }
  }, []);

  const updateData = useCallback((updater: Partial<AnniversaryData> | ((prev: AnniversaryData) => Partial<AnniversaryData>)) => {
    setData((prev) => {
      const partial = typeof updater === 'function' ? updater(prev) : updater;
      const next = { ...prev, ...partial };
      persistData(next);
      return next;
    });
  }, [persistData]);

  // Unlock viewer with passcode
  const unlockViewer = async (passcode: string, rememberDevice: boolean): Promise<{ success: boolean; message?: string }> => {
    const isValid = await verifyPasscode(passcode, data.viewerPasscodeHash);
    if (isValid) {
      setIsUnlocked(true);
      // Start background music automatically on this direct user interaction
      setIsMusicPlaying(true);
      try {
        if (rememberDevice) {
          localStorage.setItem(STORAGE_KEY_UNLOCKED, 'true');
        } else {
          sessionStorage.setItem(STORAGE_KEY_UNLOCKED, 'true');
        }
      } catch {
        // ignore storage errors
      }
      return { success: true };
    }
    return {
      success: false,
      message: 'Not quite, my love! ❤️ Check the hint or try our special date.',
    };
  };

  const relockViewer = () => {
    setIsUnlocked(false);
    setIsCreatorMode(false);
    setIsMusicPlaying(false);
    try {
      localStorage.removeItem(STORAGE_KEY_UNLOCKED);
      sessionStorage.removeItem(STORAGE_KEY_UNLOCKED);
      sessionStorage.removeItem(STORAGE_KEY_CREATOR);
    } catch {
      // ignore
    }
  };

  // Creator Mode login with creator PIN
  const enterCreatorMode = async (pin: string): Promise<{ success: boolean; message?: string }> => {
    const isValid = await verifyPasscode(pin, data.creatorPasscodeHash);
    if (isValid) {
      setIsCreatorMode(true);
      try {
        sessionStorage.setItem(STORAGE_KEY_CREATOR, 'true');
      } catch {
        // ignore
      }
      return { success: true };
    }
    return {
      success: false,
      message: 'Incorrect Creator PIN. Please try again.',
    };
  };

  const exitCreatorMode = () => {
    setIsCreatorMode(false);
    try {
      sessionStorage.removeItem(STORAGE_KEY_CREATOR);
    } catch {
      // ignore
    }
  };

  // JSON Export for safe backups
  const exportBackupJson = () => {
    const jsonStr = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `our-anniversary-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // JSON Import
  const importBackupJson = (file: File): Promise<{ success: boolean; message: string }> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const parsed = JSON.parse(e.target?.result as string);
          if (!parsed.coupleNames || !parsed.anniversaryDate) {
            resolve({ success: false, message: 'Invalid backup file format.' });
            return;
          }
          const merged = { ...INITIAL_ANNIVERSARY_DATA, ...parsed };
          setData(merged);
          persistData(merged);
          resolve({ success: true, message: 'Successfully imported anniversary memories!' });
        } catch {
          resolve({ success: false, message: 'Could not read JSON file. Check file syntax.' });
        }
      };
      reader.onerror = () => resolve({ success: false, message: 'Failed to read file.' });
      reader.readAsText(file);
    });
  };

  const resetToDefaults = () => {
    setData(INITIAL_ANNIVERSARY_DATA);
    persistData(INITIAL_ANNIVERSARY_DATA);
  };

  return (
    <AnniversaryContext.Provider
      value={{
        data,
        isUnlocked,
        isCreatorMode,
        saveStatus,
        lastSavedAt,
        isMusicPlaying,
        musicVolume,
        isMuted,
        isPetalsActive,
        isDarkMode,
        showMusicVideo,
        unlockViewer,
        relockViewer,
        enterCreatorMode,
        exitCreatorMode,
        updateData,
        exportBackupJson,
        importBackupJson,
        resetToDefaults,
        setIsMusicPlaying,
        setMusicVolume,
        setIsMuted,
        setIsPetalsActive,
        setIsDarkMode,
        setShowMusicVideo,
      }}
    >
      {children}
    </AnniversaryContext.Provider>
  );
};

export const useAnniversary = (): AnniversaryContextType => {
  const context = useContext(AnniversaryContext);
  if (!context) {
    throw new Error('useAnniversary must be used within an AnniversaryProvider');
  }
  return context;
};
