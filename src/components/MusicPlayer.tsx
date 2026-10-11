import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Volume2, VolumeX, Play, Pause, Music, ChevronUp, ChevronDown, ExternalLink } from 'lucide-react';
import { useAnniversary } from '../context/AnniversaryContext';
import { extractYouTubeId } from '../utils/youtube';

declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: () => void;
  }
}

export const MusicPlayer: React.FC = () => {
  const {
    data,
    isMusicPlaying,
    setIsMusicPlaying,
    musicVolume,
    setMusicVolume,
    isMuted,
    setIsMuted,
    showMusicVideo,
    setShowMusicVideo,
    isDarkMode,
  } = useAnniversary();

  const playerRef = useRef<any>(null);
  const containerId = 'youtube-music-player-frame';
  const [isPlayerReady, setIsPlayerReady] = useState(false);
  const [isApiLoaded, setIsApiLoaded] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const videoId = extractYouTubeId(data.youtubeUrl) || '0pWsL6PzYyA';

  // Load YouTube IFrame API script
  useEffect(() => {
    if (window.YT && window.YT.Player) {
      setIsApiLoaded(true);
      return;
    }

    const tag = document.createElement('script');
    tag.src = 'https://www.youtube.com/iframe_api';
    const firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag?.parentNode?.insertBefore(tag, firstScriptTag);

    window.onYouTubeIframeAPIReady = () => {
      setIsApiLoaded(true);
    };
  }, []);

  // Initialize player when API is ready and video ID changes
  useEffect(() => {
    if (!isApiLoaded || !videoId) return;

    if (playerRef.current) {
      try {
        playerRef.current.loadVideoById(videoId);
        if (isMusicPlaying) {
          playerRef.current.playVideo();
        }
      } catch (err) {
        console.warn('Could not load new video ID:', err);
      }
      return;
    }

    try {
      playerRef.current = new window.YT.Player(containerId, {
        height: '180',
        width: '320',
        videoId: videoId,
        playerVars: {
          autoplay: 0,
          controls: 1,
          disablekb: 1,
          fs: 0,
          loop: 1,
          modestbranding: 1,
          playsinline: 1,
          rel: 0,
          origin: window.location.origin,
        },
        events: {
          onReady: (event: any) => {
            setIsPlayerReady(true);
            event.target.setVolume(musicVolume);
            if (isMuted) {
              event.target.mute();
            } else {
              event.target.unMute();
            }
            if (isMusicPlaying) {
              event.target.playVideo();
            }
          },
          onStateChange: (event: any) => {
            // YT.PlayerState.PLAYING = 1, PAUSED = 2, ENDED = 0
            if (event.data === 1) {
              setIsMusicPlaying(true);
            } else if (event.data === 2) {
              setIsMusicPlaying(false);
            } else if (event.data === 0) {
              // Loop track
              event.target.playVideo();
            }
          },
          onError: (err: any) => {
            console.warn('YouTube Player error:', err);
          },
        },
      });
    } catch (err) {
      console.warn('Error creating YouTube player:', err);
    }
  }, [isApiLoaded, videoId]);

  // Sync play/pause state
  useEffect(() => {
    if (!playerRef.current || !isPlayerReady) return;
    try {
      if (isMusicPlaying) {
        playerRef.current.playVideo();
      } else {
        playerRef.current.pauseVideo();
      }
    } catch (err) {
      console.warn('Could not change play state:', err);
    }
  }, [isMusicPlaying, isPlayerReady]);

  // Sync volume state
  useEffect(() => {
    if (!playerRef.current || !isPlayerReady) return;
    try {
      playerRef.current.setVolume(musicVolume);
    } catch (err) {
      console.warn('Could not set volume:', err);
    }
  }, [musicVolume, isPlayerReady]);

  // Sync mute state
  useEffect(() => {
    if (!playerRef.current || !isPlayerReady) return;
    try {
      if (isMuted) {
        playerRef.current.mute();
      } else {
        playerRef.current.unMute();
      }
    } catch (err) {
      console.warn('Could not toggle mute:', err);
    }
  }, [isMuted, isPlayerReady]);

  const togglePlay = () => {
    setIsMusicPlaying((prev) => !prev);
  };

  const toggleMute = () => {
    setIsMuted((prev) => !prev);
  };

  return (
    <>
      {/* Hidden/Off-screen container for the YouTube IFrame player when not popped up */}
      <div
        className={
          showMusicVideo
            ? 'fixed bottom-20 right-4 sm:right-6 z-40 rounded-2xl overflow-hidden shadow-2xl border border-rose-300 dark:border-rose-900 bg-black'
            : 'absolute -top-[9999px] -left-[9999px] pointer-events-none opacity-0'
        }
      >
        <div id={containerId} />
      </div>

      {/* Floating Mini Controller at bottom right */}
      <div className="fixed bottom-4 right-4 sm:right-6 z-40">
        <div
          className={`flex flex-col rounded-2xl border backdrop-blur-xl shadow-xl transition-all duration-300 ${
            isDarkMode
              ? 'bg-stone-900/90 border-rose-500/30 text-stone-100 shadow-rose-950/40'
              : 'bg-white/95 border-rose-200 text-stone-800 shadow-rose-900/10'
          }`}
        >
          {/* Main bar row */}
          <div className="flex items-center gap-3 px-3.5 py-2.5">
            {/* Play/Pause Button */}
            <button
              type="button"
              onClick={togglePlay}
              className={`w-9 h-9 rounded-full flex items-center justify-center transition-all ${
                isMusicPlaying
                  ? 'bg-rose-500 text-white shadow-md shadow-rose-500/30'
                  : 'bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-200 hover:bg-rose-100 dark:hover:bg-rose-950'
              }`}
              title={isMusicPlaying ? 'Pause Music' : 'Play Music'}
              aria-label={isMusicPlaying ? 'Pause Background Music' : 'Play Background Music'}
            >
              {isMusicPlaying ? (
                <Pause className="w-4 h-4 fill-current" />
              ) : (
                <Play className="w-4 h-4 fill-current translate-x-0.5" />
              )}
            </button>

            {/* Song Info & Equalizer Animation */}
            <div className="flex flex-col max-w-[120px] sm:max-w-[160px]">
              <div className="flex items-center gap-1.5">
                <Music
                  className={`w-3.5 h-3.5 text-rose-500 ${
                    isMusicPlaying ? 'animate-bounce' : 'opacity-60'
                  }`}
                />
                <span className="text-xs font-medium truncate">
                  {data.songTitle || 'Our Song'}
                </span>
              </div>
              <span className="text-[10px] text-stone-400 truncate">
                {isMusicPlaying ? 'Playing romance' : 'Music paused'}
              </span>
            </div>

            {/* Mute Toggle */}
            <button
              type="button"
              onClick={toggleMute}
              className="p-1.5 rounded-lg text-stone-500 dark:text-stone-400 hover:text-stone-800 dark:hover:text-stone-100 transition-colors"
              title={isMuted ? 'Unmute' : 'Mute'}
              aria-label={isMuted ? 'Unmute audio' : 'Mute audio'}
            >
              {isMuted ? (
                <VolumeX className="w-4 h-4 text-rose-400" />
              ) : (
                <Volume2 className="w-4 h-4" />
              )}
            </button>

            {/* Expand / Controls Accordion */}
            <button
              type="button"
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 transition-colors"
              title="Music Controls"
              aria-label="Toggle music volume slider"
            >
              {isExpanded ? (
                <ChevronDown className="w-4 h-4" />
              ) : (
                <ChevronUp className="w-4 h-4" />
              )}
            </button>
          </div>

          {/* Expanded Drawer (Volume + Video Toggle) */}
          {isExpanded && (
            <div className="px-4 pb-3 pt-1 border-t border-rose-100 dark:border-rose-950/60 space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-stone-400 w-8">Vol:</span>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={isMuted ? 0 : musicVolume}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    setMusicVolume(val);
                    if (isMuted && val > 0) setIsMuted(false);
                  }}
                  className="w-28 h-1.5 bg-stone-200 dark:bg-stone-700 rounded-lg appearance-none cursor-pointer accent-rose-500"
                  aria-label="Adjust volume"
                />
                <span className="text-[10px] font-mono text-stone-400 w-6 text-right">
                  {isMuted ? 0 : musicVolume}%
                </span>
              </div>

              <div className="flex items-center justify-between pt-1">
                <button
                  type="button"
                  onClick={() => setShowMusicVideo(!showMusicVideo)}
                  className="text-[11px] text-rose-500 hover:text-rose-600 dark:text-rose-400 dark:hover:text-rose-300 font-medium transition-colors"
                >
                  {showMusicVideo ? 'Hide Video Box' : 'Watch Music Video'}
                </button>
                <a
                  href={data.youtubeUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 text-[10px] text-stone-400 hover:text-stone-600 dark:hover:text-stone-300 transition-colors"
                >
                  <span>Open YouTube</span>
                  <ExternalLink className="w-2.5 h-2.5" />
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};
