/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { AnniversaryProvider, useAnniversary } from './context/AnniversaryContext';
import { PetalsCanvas } from './components/PetalsCanvas';
import { PasscodeGate } from './components/PasscodeGate';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { TimelineSection } from './components/TimelineSection';
import { GallerySection } from './components/GallerySection';
import { LoveLetterSection } from './components/LoveLetterSection';
import { ReasonsSection } from './components/ReasonsSection';
import { Footer } from './components/Footer';
import { MusicPlayer } from './components/MusicPlayer';
import { LightboxModal } from './components/LightboxModal';
import { SurpriseModal } from './components/SurpriseModal';
import { CreatorToolbar, CreatorAuthModal, SettingsModal } from './components/CreatorModals';

const MainApp: React.FC = () => {
  const { data, isUnlocked, isCreatorMode } = useAnniversary();

  // Modal States
  const [isCreatorAuthOpen, setIsCreatorAuthOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isSurpriseOpen, setIsSurpriseOpen] = useState(false);

  // Lightbox State
  const [lightboxState, setLightboxState] = useState<{
    isOpen: boolean;
    currentIndex: number;
    items: Array<{ imageUrl: string; caption?: string; date?: string }>;
  }>({
    isOpen: false,
    currentIndex: 0,
    items: [],
  });

  // Global Keyboard Shortcut: Ctrl + Shift + E opens Creator Access
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === 'e') {
        e.preventDefault();
        setIsCreatorAuthOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const openGalleryLightbox = (index: number) => {
    setLightboxState({
      isOpen: true,
      currentIndex: index,
      items: data.gallery.map((g) => ({
        imageUrl: g.imageUrl,
        caption: g.caption,
        date: g.date,
      })),
    });
  };

  const openMilestoneLightbox = (index: number) => {
    setLightboxState({
      isOpen: true,
      currentIndex: index,
      items: data.milestones.map((m) => ({
        imageUrl: m.imageUrl,
        caption: `${m.title}: ${m.description}`,
        date: m.date,
      })),
    });
  };

  return (
    <div className="min-h-screen bg-stone-50 dark:bg-stone-950 text-stone-800 dark:text-stone-100 transition-colors selection:bg-rose-200 selection:text-rose-950">
      {/* Floating Petals Canvas */}
      <PetalsCanvas />

      {/* Passcode Lock Screen (Viewer Gate) */}
      {!isUnlocked && <PasscodeGate />}

      {/* Creator Edit Mode Persistent Toolbar */}
      <CreatorToolbar onOpenSettings={() => setIsSettingsOpen(true)} />

      {/* Top Navbar */}
      <Navbar
        onOpenCreatorAuth={() => setIsCreatorAuthOpen(true)}
        onOpenSurprise={() => setIsSurpriseOpen(true)}
      />

      {/* Main Content Sections */}
      <main>
        <HeroSection />
        <TimelineSection onOpenMilestoneLightbox={openMilestoneLightbox} />
        <GallerySection onOpenGalleryLightbox={openGalleryLightbox} />
        <LoveLetterSection />
        <ReasonsSection />
      </main>

      {/* Footer */}
      <Footer
        onOpenCreatorAuth={() => setIsCreatorAuthOpen(true)}
        onOpenSurprise={() => setIsSurpriseOpen(true)}
      />

      {/* Floating Background YouTube Music Player */}
      <MusicPlayer />

      {/* Photo Lightbox */}
      <LightboxModal
        isOpen={lightboxState.isOpen}
        items={lightboxState.items}
        currentIndex={lightboxState.currentIndex}
        onClose={() => setLightboxState((prev) => ({ ...prev, isOpen: false }))}
        onSelectIndex={(index) => setLightboxState((prev) => ({ ...prev, currentIndex: index }))}
      />

      {/* Romantic Surprise Modal */}
      <SurpriseModal
        isOpen={isSurpriseOpen}
        onClose={() => setIsSurpriseOpen(false)}
      />

      {/* Creator PIN Authentication Modal */}
      <CreatorAuthModal
        isOpen={isCreatorAuthOpen}
        onClose={() => setIsCreatorAuthOpen(false)}
      />

      {/* Creator Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />
    </div>
  );
};

export default function App() {
  return (
    <AnniversaryProvider>
      <MainApp />
    </AnniversaryProvider>
  );
}
