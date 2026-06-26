/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from "react";
import { soundEngine } from "./SoundEngine";
import { Achievement } from "../types";
import { Trophy, Camera, Heart, HelpCircle, EyeOff, Check, AlertCircle, X } from "lucide-react";

interface EasterEggsProps {
  onSymbioteToggle: (active: boolean) => void;
  isSymbioteMode: boolean;
  onPhotoModeToggle: (active: boolean) => void;
  isPhotoMode: boolean;
  spiderSenseMode: boolean;
}

export default function EasterEggs({
  onSymbioteToggle,
  isSymbioteMode,
  onPhotoModeToggle,
  isPhotoMode,
  spiderSenseMode,
}: EasterEggsProps) {
  const [achievements, setAchievements] = useState<Achievement[]>([
    { id: "intro", title: "Web Slinger Initiate", description: "Successfully survived the high-speed cinematic swing intro.", unlocked: true, icon: "🕸️" },
    { id: "spider-sense", title: "Danger Warning", description: "Triggered the global Spider-Sense highlight node by pressing [S].", unlocked: false, icon: "⚡" },
    { id: "symbiote", title: "Symbiote Bond", description: "Discovered the alien substance by entering the legendary Konami Code.", unlocked: false, icon: "👽" },
    { id: "photo", title: "Daily Bugle Photo-op", description: "Launched Photo Mode to snapshot the weather and New York skyline.", unlocked: false, icon: "📸" },
    { id: "claver-web", title: "Tension Mastery", description: "Spent more than 10 seconds stretching physics threads.", unlocked: false, icon: "🕷️" },
    { id: "jameson", title: "Mad Publisher", description: "Drove J. Jonah Jameson into a nuclear fit using daily rants.", unlocked: false, icon: "📰" },
    { id: "spider-signal", title: "Web Signal Beam", description: "Toggled Peter's Spider-Signal spotlight beam using the [F] key.", unlocked: false, icon: "🔦" },
    { id: "stark-lens", title: "Pro Photojournalist", description: "Captured a high zoom 2.2x photo using the Stark HUD DSLR.", unlocked: false, icon: "🔭" },
    { id: "uncle-ben", title: "Uncle Ben's Legacy", description: "Typed the sacred keyword 'power' to recall historic wisdom.", unlocked: false, icon: "🕊️" },
  ]);

  const [notification, setNotification] = useState<string | null>(null);
  const [konamiIdx, setKonamiIdx] = useState(0);
  const [showUncleBenQuote, setShowUncleBenQuote] = useState(false);

  const konamiCode = [
    "ArrowUp",
    "ArrowUp",
    "ArrowDown",
    "ArrowDown",
    "ArrowLeft",
    "ArrowRight",
    "ArrowLeft",
    "ArrowRight",
    "b",
    "a",
  ];

  const triggerAchievement = (id: string) => {
    setAchievements((prev) =>
      prev.map((ach) => {
        if (ach.id === id && !ach.unlocked) {
          soundEngine.playThunder();
          setNotification(`🏆 ACHIEVEMENT UNLOCKED: ${ach.title.toUpperCase()}!`);
          setTimeout(() => setNotification(null), 4000);
          return { ...ach, unlocked: true, unlockedAt: new Date().toLocaleTimeString() };
        }
        return ach;
      })
    );
  };

  // Listen to custom achievements dispatched from other components
  useEffect(() => {
    const handleCustomAchievement = (e: Event) => {
      const customEvent = e as CustomEvent;
      if (customEvent.detail && customEvent.detail.id) {
        triggerAchievement(customEvent.detail.id);
      }
    };
    window.addEventListener("spidey-achievement", handleCustomAchievement);
    return () => window.removeEventListener("spidey-achievement", handleCustomAchievement);
  }, []);

  // Keyboard sequence detector for "power" and Konami code and [S]
  useEffect(() => {
    let typedSequence = "";

    const handleKeyDown = (e: KeyboardEvent) => {
      // 1. Konami Code check
      if (e.key === konamiCode[konamiIdx]) {
        const nextIdx = konamiIdx + 1;
        setKonamiIdx(nextIdx);

        if (nextIdx === konamiCode.length) {
          setKonamiIdx(0);
          const nextSymbioteState = !isSymbioteMode;
          onSymbioteToggle(nextSymbioteState);
          triggerAchievement("symbiote");
          soundEngine.playThunder();

          setNotification(
            nextSymbioteState 
              ? "SYMBIOTE SUIT BONDED. THE ENTIRE EXPERIENCE SHIFTS." 
              : "Symbiote substance detached. Classic suit restored."
          );
          setTimeout(() => setNotification(null), 5000);
        }
      } else {
        setKonamiIdx(0);
      }

      // 2. Spider-Sense key [S]
      if (e.key.toLowerCase() === "s" && !e.repeat) {
        triggerAchievement("spider-sense");
      }

      // 3. Typo-tolerant custom word "power" listener
      if (e.key.length === 1) {
        typedSequence = (typedSequence + e.key.toLowerCase()).slice(-8);
        if (typedSequence.endsWith("power")) {
          triggerAchievement("uncle-ben");
          setShowUncleBenQuote(true);
          soundEngine.playThunder();
          typedSequence = "";
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [konamiIdx, isSymbioteMode, onSymbioteToggle]);

  const startPhotoMode = () => {
    const nextPhotoMode = !isPhotoMode;
    onPhotoModeToggle(nextPhotoMode);
    triggerAchievement("photo");
    soundEngine.playClick();

    if (nextPhotoMode) {
      setNotification("PHOTO MODE ACTIVE. [ESC] or click bottom button to exit.");
      setTimeout(() => setNotification(null), 3500);
    }
  };

  const unlockedCount = achievements.filter((a) => a.unlocked).length;

  return (
    <div className="relative py-20 px-6 max-w-7xl mx-auto text-white">
      {/* Dynamic Pop notification toast */}
      {notification && (
        <div className="fixed bottom-8 left-8 z-50 flex items-center gap-3 px-6 py-4 bg-red-600 border border-white/20 rounded-2xl shadow-2xl animate-bounce">
          <Trophy className="w-5 h-5 text-yellow-300 animate-pulse" />
          <p className="text-xs font-mono font-bold tracking-widest text-white uppercase">
            {notification}
          </p>
        </div>
      )}

      {/* Grid containing Achievement ledger & Photo-mode instructions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Achievements (Left) */}
        <div className="space-y-6">
          <div className="space-y-1.5">
            <span className="text-red-500 font-mono text-xs tracking-widest uppercase flex items-center gap-2">
              <Trophy className="w-4 h-4 text-yellow-500" />
              Progress ledger
            </span>
            <h2 className="text-3.5xl font-bold tracking-tight font-sans">
              MULTIVERSE ACHIEVEMENTS
            </h2>
            <p className="text-gray-400 text-sm max-w-md font-sans leading-normal">
              Unlocked {unlockedCount} out of {achievements.length} secrets in this Spider-Man fan canvas. Search around or perform combinations to uncover more.
            </p>
          </div>

          {/* Achievement feed */}
          <div className="space-y-3">
            {achievements.map((ach) => (
              <div
                key={ach.id}
                className={`p-4 border rounded-2xl flex items-center justify-between transition-all duration-300 backdrop-blur-md ${
                  ach.unlocked
                    ? "bg-white/10 border-white/30 shadow-[0_4px_15px_rgba(255,255,255,0.1)]"
                    : "bg-white/5 border-white/10 opacity-55"
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 border border-white/5 bg-black/40 rounded-xl flex items-center justify-center text-lg shadow-xl">
                    {ach.unlocked ? ach.icon : "🔒"}
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold tracking-wide flex items-center gap-2">
                      {ach.title}
                      {ach.unlocked && <Check className="w-3.5 h-3.5 text-green-500" />}
                    </h3>
                    <p className="text-xs text-gray-400 leading-normal">{ach.description}</p>
                  </div>
                </div>
                {ach.unlocked && ach.unlockedAt && (
                  <span className="hidden sm:block font-mono text-[9px] text-red-400">
                    Unlocked: {ach.unlockedAt}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Photo Mode & Secret codes (Right) with Frosted Glass styling */}
        <div className="p-8 bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl space-y-6 relative overflow-hidden shadow-[0_8px_32px_0_rgba(0,0,0,0.4)]">
          <div className="absolute top-0 right-0 p-6 font-mono text-[9px] text-gray-500">
            SYSTEM: EASTER_EGGS_SHELL
          </div>

          <div className="space-y-2">
            <h3 className="text-xl font-bold font-sans tracking-tight">SECRET MULTIVERSE KEYS</h3>
            <p className="text-xs text-gray-400 leading-relaxed font-sans">
              Peter Parker left behind classified diagnostic codes in his suit computer. Use these hotkeys or launch controls to manipulate the simulation details:
            </p>
          </div>

          {/* Key list */}
          <div className="space-y-4 font-mono text-xs">
            <div className="flex items-start justify-between p-4 bg-white/5 border border-white/10 rounded-xl backdrop-blur-md">
              <div className="space-y-1">
                <p className="text-white font-bold">SYMBIOTE MODE</p>
                <p className="text-[10px] text-gray-400">Press the ancient gaming Konami code to bind the Symbiote suit.</p>
              </div>
              <span className="px-2 py-1 bg-white/10 border border-white/10 rounded text-red-500 font-semibold uppercase tracking-wider whitespace-nowrap">
                ↑ ↑ ↓ ↓ ← → ← → B A
              </span>
            </div>

            <div className="flex items-start justify-between p-4 bg-white/5 border border-white/10 rounded-xl backdrop-blur-md">
              <div className="space-y-1">
                <p className="text-white font-bold">SPIDER-SENSE HIGHLIGHT</p>
                <p className="text-[10px] text-gray-400">Press 'S' on your keyboard to trigger a high-contrast danger pulse highlight.</p>
              </div>
              <span className="px-2 py-1 bg-neutral-900 border border-white/10 rounded text-red-500 font-semibold uppercase tracking-wider">
                Press [ S ]
              </span>
            </div>
          </div>

          {/* Photo Mode Trigger card with high-end Frosted style */}
          <div className="p-6 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="space-y-1.5 text-center sm:text-left">
              <h4 className="text-sm font-bold text-white font-sans flex items-center justify-center sm:justify-start gap-2">
                <Camera className="w-4.5 h-4.5 text-red-500" />
                DAILY BUGLE PHOTO MODE
              </h4>
              <p className="text-xs text-gray-400 leading-normal font-sans">
                Hide all buttons, dialog cards, and HUD grids to inspect and take pristine screenshots of our high-contrast NYC background canvas.
              </p>
            </div>

            <button
              onClick={startPhotoMode}
              className="px-5 py-2.5 bg-white text-black hover:bg-red-600 hover:text-white rounded-sm text-xs font-bold tracking-wider uppercase transition-all duration-300 hover:scale-105 cursor-pointer shadow-lg"
            >
              {isPhotoMode ? "Exit Photo Mode" : "Launch Photo Mode"}
            </button>
          </div>
        </div>
      </div>

      {/* 4. Cinematic Uncle Ben Quote Memory Overlay */}
      {showUncleBenQuote && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-xl p-6 select-none animate-fade-in transition-all">
          <div className="relative max-w-2xl w-full text-center space-y-8 p-10 border border-amber-500/20 bg-gradient-to-b from-amber-950/10 to-neutral-950 rounded-3xl shadow-[0_0_60px_rgba(245,158,11,0.15)] flex flex-col items-center">
            
            {/* Soft ambient orange glow inside card */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full bg-amber-500/5 blur-[120px] pointer-events-none" />

            {/* Exit top button */}
            <button
              onClick={() => {
                soundEngine.playClick();
                setShowUncleBenQuote(false);
              }}
              className="absolute top-6 right-6 p-2 bg-white/5 hover:bg-amber-500 hover:text-black border border-white/10 rounded-full text-gray-400 transition-all cursor-pointer"
              title="Close Memorial"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Radiant glowing Dove/Memorial symbol */}
            <div className="w-16 h-16 border-2 border-amber-500/30 rounded-full flex items-center justify-center bg-amber-500/10 shadow-lg relative">
              <span className="text-2xl">🕊️</span>
              <div className="absolute inset-[-4px] border border-amber-500/20 rounded-full animate-ping opacity-30" />
            </div>

            <div className="space-y-4 max-w-lg relative z-10">
              <span className="text-amber-500 font-mono text-[9px] font-bold tracking-[0.4em] uppercase">SACRED WISDOM MEMORY SECURED</span>
              <blockquote className="text-2xl sm:text-3.5xl font-serif font-medium leading-relaxed text-amber-100 tracking-tight italic drop-shadow-md">
                "Remember, Peter. With great power comes great responsibility."
              </blockquote>
              <p className="text-xs text-gray-400 font-mono tracking-widest uppercase">— UNCLE BEN, AMAZING FANTASY #15</p>
            </div>

            <button
              onClick={() => {
                soundEngine.playClick();
                setShowUncleBenQuote(false);
              }}
              className="px-6 py-2.5 bg-amber-500/10 hover:bg-amber-500 hover:text-black border border-amber-500/30 text-amber-400 font-mono text-[10px] font-bold tracking-widest uppercase rounded-sm transition-all duration-300 cursor-pointer"
            >
              DISMISS MEMORY
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
