"use client";

import { useEffect, useState } from "react";
import { useAudio } from "@/contexts/audio-context";
import { Navbar } from "@/components/layout/navbar";
import { TransportBackground } from "@/components/layout/transport-background";

// Conteneur pour le lecteur audio intégré
function AudioPlayerContainer() {
  const { isPlaying, currentTrackTitle, playRadio, pauseRadio } = useAudio();
  const [showControls, setShowControls] = useState(false);

  // Afficher les contrôles au survol ou lors de la lecture
  useEffect(() => {
    const handleMouseEnter = () => setShowControls(true);
    const handleMouseLeave = () => setShowControls(false);

    const element = document.querySelector('[data-audio-trigger]');
    element?.addEventListener('mouseenter', handleMouseEnter);
    element?.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      element?.removeEventListener('mouseenter', handleMouseEnter);
      element?.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return (
    <div
      data-audio-trigger
      className="fixed bottom-0 left-0 right-0 h-20 bg-black/50 backdrop-blur-sm border-t border-neutral-200/20 pointer-events-none"
      style={{ transform: 'translateY(100%)', transition: 'transform 0.3s ease-out' }}
    >
      <div className="h-full flex items-center justify-center pointer-events-all">
        {showControls || isPlaying ? (
          <div className="flex items-center space-x-4 max-w-4xl mx-auto px-4">
            <button
              onClick={isPlaying ? pauseRadio : playRadio}
              className="p-2 rounded-full hover:bg-neutral-800/20 transition-colors"
              aria-label={isPlaying ? "Mettre en pause" : "Lancer la radio"}
            >
              {isPlaying ? (
                <svg className="h-5 w-5 text-neutral-100" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
                </svg>
              ) : (
                <svg className="h-5 w-5 text-neutral-100" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 5v14l11-7z" />
                </svg>
              )}
            </button>

            <div className="flex-1 min-w-0">
              <p className="truncate text-sm font-medium text-neutral-100">
                {currentTrackTitle || "Radio ClearBus"}
              </p>
              {!isPlaying && (
                <p className="text-xs text-neutral-400">
                  Appuyez pour écouter
                </p>
              )}
            </div>
          </div>
        ) : (
          <button
            onClick={() => setShowControls(true)}
            className="w-full h-full text-center text-neutral-500/50 hover:text-neutral-500/70 transition-colors"
            aria-label="Afficher les contrôles audio"
          >
            <svg className="h-4 w-4 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 18V6l12 6" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}

// Client component for the interactive parts of the layout
export function RootLayoutClient({
  user,
  children,
}: Readonly<{
  user: Awaited<ReturnType<typeof getCurrentUser>> | null;
  children: React.ReactNode;
}>) {
  return (
    <>
      {/* Arrière-plan dynamique du transport */}
      <TransportBackground />

      {/* Audio Player intégré de manière plus subtile */}
      <AudioPlayerContainer />

      {/* Contenu principal avec effet de profondeur */}
      <main className="relative z-10 min-h-screen bg-transparent">
        <Navbar user={user} className="glassmorphism" />

        {/* Container principal avec padding adaptatif */}
        <div className="relative z-10 pt-16 pb-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="container mx-auto px-4">
            <main className="space-y-16">{children}</main>
          </div>
        </div>
      </main>
    </>
  );
}