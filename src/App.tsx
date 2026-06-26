/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from "react";
import { soundEngine, useSoundControl } from "./components/SoundEngine";
import OpeningExperience from "./components/OpeningExperience";
import CinematicBackground from "./components/CinematicBackground";
import WebShooter from "./components/WebShooter";
import SpiderSenseCursor from "./components/SpiderSenseCursor";
import HeroSection from "./components/HeroSection";
import CharacterShowcase from "./components/CharacterShowcase";
import SuitShowcase from "./components/SuitShowcase";
import InteractiveMap from "./components/InteractiveMap";
import TimelineSection from "./components/TimelineSection";
import PhotoGallery from "./components/PhotoGallery";
import JamesonRantBox from "./components/JamesonRantBox";
import EasterEggs from "./components/EasterEggs";
import ScrollSpiderWebs from "./components/ScrollSpiderWebs";
import CameraPhotoMode from "./components/CameraPhotoMode";

import { Volume2, VolumeX, Camera, Shield, Globe, Compass, Film, MessageSquare, Info } from "lucide-react";

export default function App() {
  const [introComplete, setIntroComplete] = useState(false);
  const [isSymbioteMode, setIsSymbioteMode] = useState(false);
  const [isPhotoMode, setIsPhotoMode] = useState(false);
  const [spiderSenseMode, setSpiderSenseMode] = useState(false);
  const [lightningActive, setLightningActive] = useState(false);
  const [qualityMode, setQualityMode] = useState<"Performance" | "Balanced" | "Cinematic">("Balanced");
  const [activeEasterEgg, setActiveEasterEgg] = useState<{ id: string; title: string; narrative: string } | null>(null);

  const [showSpiderSignal, setShowSpiderSignal] = useState(false);
  const [mousePos, setMousePos] = useState({ x: -200, y: -200 });

  const { muted, toggleMute } = useSoundControl();

  // Handle global keybindings (S for Spider-Sense, F for Spider-Signal, ESC for Photo-Mode exit)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === "s" && !e.repeat) {
        setSpiderSenseMode((prev) => {
          const next = !prev;
          if (next) {
            soundEngine.playHeartbeat();
          } else {
            soundEngine.playClick();
          }
          return next;
        });
      }

      if (e.key.toLowerCase() === "f" && !e.repeat) {
        setShowSpiderSignal((prev) => {
          const next = !prev;
          if (next) {
            soundEngine.playHeartbeat();
            window.dispatchEvent(new CustomEvent("spidey-achievement", { detail: { id: "spider-signal" } }));
          } else {
            soundEngine.playClick();
          }
          return next;
        });
      }

      if (e.key === "Escape") {
        setIsPhotoMode(false);
        soundEngine.playClick();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Synchronize mouse position for the Spider-Signal beam
  useEffect(() => {
    if (!showSpiderSignal) return;
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [showSpiderSignal]);

  // Sync spider-sense heartbeats in a periodic loop when active
  useEffect(() => {
    if (!spiderSenseMode) return;
    const interval = setInterval(() => {
      soundEngine.playHeartbeat();
    }, 1200); // regular heartbeat pulse
    return () => clearInterval(interval);
  }, [spiderSenseMode]);

  // Sync spider-sense rain sound
  useEffect(() => {
    if (spiderSenseMode && !muted) {
      soundEngine.startSpiderSenseRain();
    } else {
      soundEngine.stopSpiderSenseRain();
    }
    return () => {
      soundEngine.stopSpiderSenseRain();
    };
  }, [spiderSenseMode, muted]);

  // Click handler to launch official BookMyShow page in a new tab
  const handlePreBookTickets = () => {
    soundEngine.playWebShoot();
    window.open("https://in.bookmyshow.com/movies/spider-man-brand-new-day/ET00311494", "_blank");
  };

  const handleSoundToggle = () => {
    toggleMute();
    soundEngine.playClick();
  };

  return (
    <div className={`relative min-h-screen text-white bg-[#020408] select-none transition-all duration-700 ${spiderSenseMode ? "bg-red-950/20" : ""}`}>
      
      {/* Spider-Signal Spotlight Overlay */}
      {showSpiderSignal && (
        <div 
          className="fixed inset-0 pointer-events-none z-30 transition-opacity duration-300 hidden sm:block"
          style={{
            background: `radial-gradient(circle 180px at ${mousePos.x}px ${mousePos.y}px, transparent 30%, rgba(220, 38, 38, 0.1) 60%, rgba(2, 4, 8, 0.94) 100%)`
          }}
        >
          {/* Circular project symbol */}
          <div 
            className="absolute w-36 h-36 text-red-500/30 flex items-center justify-center -translate-x-1/2 -translate-y-1/2"
            style={{ left: mousePos.x, top: mousePos.y }}
          >
            <svg viewBox="0 0 100 100" className="w-full h-full fill-current animate-pulse">
              <path d="M50,15 C28,15 25,45 25,60 C25,78 45,85 50,85 C55,85 75,78 75,60 C75,45 72,15 50,15 Z M38,65 C32,60 30,45 35,32 C38,40 43,45 47,48 C43,56 40,62 38,65 Z M62,65 C60,62 57,56 53,48 C57,45 62,40 65,32 C70,45 68,60 62,65 Z" />
            </svg>
          </div>
          
          {/* Instruction bubble for spotlight mode */}
          <div className="absolute top-28 left-1/2 -translate-x-1/2 px-4 py-2 bg-black/90 border border-red-500/20 rounded-full text-[10px] font-mono tracking-widest text-red-400 uppercase">
            SPIDER-SIGNAL ACTIVE • PRESS [F] TO RETRACT SPOTLIGHT
          </div>
        </div>
      )}

      {/* Scroll Spider Webs overlay */}
      <ScrollSpiderWebs />

      {/* 1. Full-Screen Procedural Living NYC Backdrop */}
      <CinematicBackground 
        lightningActive={lightningActive}
        onLightningTriggered={setLightningActive}
        spiderSenseMode={spiderSenseMode}
        qualityMode={qualityMode}
        onTriggerEasterEgg={(id, title, text) => {
          setActiveEasterEgg({ id, title, narrative: text });
        }}
      />

      {/* Atmospheric Background Glows & Grid Pattern */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-red-900/15 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] left-[-5%] w-[600px] h-[600px] bg-blue-900/15 rounded-full blur-[120px]"></div>
        <div className="absolute inset-0 opacity-15" style={{ backgroundImage: "radial-gradient(#ffffff 0.5px, transparent 0.5px)", backgroundSize: "30px 30px" }}></div>
      </div>

      {/* Scanlines Overlay */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.03] z-50" style={{ background: "linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.06), rgba(0, 255, 0, 0.02), rgba(0, 0, 255, 0.06))", backgroundSize: "100% 2px, 3px 100%" }}></div>

      {/* 2. Custom Hover-snapping Spider-Sense Cursor */}
      <SpiderSenseCursor />

      {/* 3. Physical Verlet-integration Web Ropes Canvas */}
      <WebShooter />

      {/* 4. Cinematic Loading/Opening Intro */}
      {!introComplete ? (
        <OpeningExperience 
          onComplete={() => {
            setIntroComplete(true);
            soundEngine.playThunder();
          }}
          onMusicToggle={handleSoundToggle}
          isMuted={muted}
        />
      ) : (
        <div className="relative z-10 font-sans">
          
          {/* Global Header HUD (Hidden in Photo Mode) */}
          {!isPhotoMode && (
            <header className="fixed top-0 inset-x-0 h-20 bg-white/5 backdrop-blur-md z-40 border-b border-white/10 px-6 flex items-center justify-between shadow-[0_4px_30px_rgba(0,0,0,0.5)]">
              <div className="flex items-center gap-3">
                <div className={`w-9 h-9 border rounded-full flex items-center justify-center transition-all ${isSymbioteMode ? 'border-white bg-white/15' : 'border-red-600 bg-red-600/10 shadow-[0_0_15px_rgba(220,38,38,0.3)]'}`}>
                  <Shield className={`w-4 h-4 ${isSymbioteMode ? 'text-white' : 'text-red-500 animate-pulse'}`} />
                </div>
                <div>
                  <h1 className="text-xs font-bold tracking-[0.25em] font-sans uppercase">SPIDER-MAN</h1>
                  <span className="text-[8px] font-mono tracking-widest text-gray-400 block -mt-1 uppercase">Brand New Day</span>
                </div>
              </div>

              {/* Central Navigation anchors (Hidden on mobile) */}
              <nav className="hidden md:flex items-center gap-8 text-[10px] font-medium tracking-[0.2em] uppercase text-gray-300">
                <a href="#story" onClick={() => soundEngine.playClick()} className="hover:text-red-500 transition-colors">The Story</a>
                <a href="#characters" onClick={() => soundEngine.playClick()} className="hover:text-red-500 transition-colors">Cast</a>
                <a href="#suit" onClick={() => soundEngine.playClick()} className="hover:text-red-500 transition-colors">Suit Tech</a>
                <a href="#map" onClick={() => soundEngine.playClick()} className="hover:text-red-500 transition-colors">NYC Map</a>
                <a href="#timeline" onClick={() => soundEngine.playClick()} className="hover:text-red-500 transition-colors">Timeline</a>
                <a href="#jameson" onClick={() => soundEngine.playClick()} className="hover:text-red-500 transition-colors">Bugle Live</a>
              </nav>

              {/* Utility switches cluster */}
              <div className="flex items-center gap-3">
                {/* Adaptive Graphics Quality Switcher */}
                <div className="hidden lg:flex items-center gap-1 bg-white/5 border border-white/10 rounded-full p-1 text-[8px] font-mono uppercase tracking-widest text-gray-400">
                  <span className="opacity-50 px-1.5">FX:</span>
                  {(["Performance", "Balanced", "Cinematic"] as const).map((mode) => (
                    <button
                      key={mode}
                      onClick={() => {
                        soundEngine.playHover();
                        setQualityMode(mode);
                      }}
                      className={`px-2 py-1 rounded-full font-bold transition-all cursor-pointer ${
                        qualityMode === mode ? "bg-red-600 text-white" : "hover:text-white hover:bg-white/5"
                      }`}
                    >
                      {mode === "Performance" ? "PERF" : mode === "Balanced" ? "BAL" : "CINE"}
                    </button>
                  ))}
                </div>

                {/* Photo Mode toggle indicator */}
                <button
                  onClick={() => {
                    setIsPhotoMode(true);
                    soundEngine.playClick();
                  }}
                  title="Enter Photo Mode"
                  className="p-2.5 bg-white/5 hover:bg-white/10 border border-white/5 rounded-full cursor-pointer transition-transform hover:scale-105"
                >
                  <Camera className="w-4 h-4 text-gray-300" />
                </button>

                {/* Interactive Mute button */}
                <button
                  onClick={handleSoundToggle}
                  className={`p-2.5 rounded-full cursor-pointer transition-all border ${muted ? 'bg-white/5 border-white/5' : 'bg-red-600/20 border-red-500/40 animate-pulse'}`}
                >
                  {muted ? (
                    <VolumeX className="w-4 h-4 text-gray-400" />
                  ) : (
                    <Volume2 className="w-4 h-4 text-red-400" />
                  )}
                </button>

                {/* Pre book button header */}
                <button
                  onClick={handlePreBookTickets}
                  className="hidden sm:inline-block px-6 py-2 bg-white text-black text-[10px] font-bold uppercase tracking-widest rounded-sm hover:bg-red-600 hover:text-white transition-all duration-300 cursor-pointer"
                >
                  Pre-Book Now
                </button>
              </div>
            </header>
          )}

          {/* Full-Screen DSLR Camera & Live Webcam Photo-Mode Overlay */}
          {isPhotoMode && (
            <CameraPhotoMode onClose={() => setIsPhotoMode(false)} />
          )}

          {/* Main Website Sections Content (Hidden in Photo Mode) */}
          {!isPhotoMode && (
            <main className="space-y-32">
              
              {/* 1. HERO BLOCK */}
              <div className="min-h-screen">
                <HeroSection 
                  onPreBook={handlePreBookTickets}
                  spiderSenseMode={spiderSenseMode}
                  isSymbioteMode={isSymbioteMode}
                />
              </div>

              {/* 2. MOVIE PREMISE STORY */}
              <section id="story" className="py-24 px-6 max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-16 overflow-hidden">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-blue-600/5 rounded-full blur-3xl pointer-events-none" />

                <div className="w-full lg:w-1/2 space-y-6">
                  <span className="text-[10px] font-mono tracking-widest text-red-500 uppercase flex items-center gap-2">
                    <Film className="w-4 h-4" />
                    Official Premise
                  </span>
                  <h2 className="text-3.5xl sm:text-4.5xl font-bold font-sans tracking-tight leading-tight uppercase">
                    A GHOST IN THE NEON LIGHTS
                  </h2>
                  <p className="text-lg font-medium text-gray-200 leading-relaxed font-sans border-l-3 border-red-600 pl-4">
                    Following the catastrophic memory wipe of No Way Home, the entire world has forgotten who Peter Parker is.
                  </p>
                  <p className="text-gray-400 text-sm leading-relaxed font-sans">
                    Peter has chosen anonymous isolation, keeping MJ and Ned safe from his crosshairs. Surviving in a dusty room in Manhattan, he defends New York's rooftops alone in a hand-crafted suit. But as Oscorp deploys Mac Gargan’s deadly pneumatic stinger, Peter finds himself hunted by local forces and high-tech corporate syndicates.
                  </p>
                </div>

                <div className="w-full lg:w-1/2 p-8 bg-black/40 backdrop-blur-md border border-white/10 rounded-2xl relative overflow-hidden shadow-[0_8px_32px_0_rgba(0,0,0,0.4)] flex flex-col justify-between min-h-[280px]">
                  <div className="absolute -top-12 -right-12 w-32 h-32 bg-red-900/10 rounded-full blur-2xl pointer-events-none" />
                  <div className="space-y-4">
                    <span className="text-red-500 text-[10px] font-bold tracking-widest uppercase flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-ping" />
                      Live Intel
                    </span>
                    <h3 className="text-xl font-bold font-sans text-white uppercase tracking-tight">THE BURDEN OF ANONYMITY</h3>
                    <p className="text-sm text-gray-300 font-sans leading-relaxed italic">
                      "No friends, no Avengers, no Stark technology. Peter fights on instinct, relying purely on his spider-sense and handmade mechanics to keep the city afloat."
                    </p>
                  </div>
                  <div className="pt-6 border-t border-white/10 font-mono text-[9px] text-gray-400 flex items-center gap-2">
                    <MessageSquare className="w-3.5 h-3.5 text-red-500" />
                    <span>DAILY BUGLE BACKROOM REPORT</span>
                  </div>
                </div>
              </section>

              {/* 3. CHARACTER SHOWCASE (CAROUSEL WITH DYNAMIC INTERACTION) */}
              <section id="characters">
                <CharacterShowcase />
              </section>

              {/* 4. THE INTERACTIVE SUIT SPECIFICATIONS SHOWCASE */}
              <section id="suit" className="bg-[#04060d] border-y border-white/5">
                <SuitShowcase />
              </section>

              {/* 5. TACTICAL RADAR MAP OF MANHATTAN */}
              <section id="map">
                <InteractiveMap />
              </section>

              {/* 6. TIMELINE HISTORY */}
              <section id="timeline">
                <TimelineSection />
              </section>

              {/* 7. PHOTO TEASERS GALLERY */}
              <section id="gallery">
                <PhotoGallery />
              </section>

              {/* 8. J. JONAH JAMESON LIVE RANT INTERACTIVE BROADCAST */}
              <section id="jameson" className="py-12">
                <div className="text-center mb-4">
                  <h2 className="text-red-500 text-xs tracking-[0.5em] uppercase font-bold mb-2">Daily Bugle Bulletins</h2>
                  <h1 className="text-3xl sm:text-4xl font-black italic tracking-tighter uppercase text-white font-sans">Jameson's Rant Hub</h1>
                </div>
                <JamesonRantBox />
              </section>

              {/* 9. MOVIE DATA SHEET SPECIFICATIONS */}
              <section id="details" className="py-20 px-6 max-w-7xl mx-auto">
                <div className="p-8 sm:p-12 bg-black/60 border border-white/5 rounded-3xl shadow-2xl space-y-8">
                  <div className="flex items-center gap-2 text-red-500 text-xs font-mono tracking-widest uppercase">
                    <Info className="w-4.5 h-4.5" />
                    Official Production Dossier
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 text-white">
                    <div className="space-y-1">
                      <p className="text-xs font-mono text-gray-400 uppercase tracking-wider">Release Date</p>
                      <p className="text-lg font-bold font-sans text-white">July 30, 2026</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs font-mono text-gray-400 uppercase tracking-wider">Director</p>
                      <p className="text-lg font-bold font-sans text-white">Jon Watts / Destin Daniel Cretton</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs font-mono text-gray-400 uppercase tracking-wider">Main Cast</p>
                      <p className="text-lg font-bold font-sans text-white">Tom Holland, Zendaya, Jacob Batalon, Sadie Sink</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs font-mono text-gray-400 uppercase tracking-wider">Genre</p>
                      <p className="text-lg font-bold font-sans text-white">Action, Adventure, Sci-Fi, IMAX</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs font-mono text-gray-400 uppercase tracking-wider">Runtime</p>
                      <p className="text-lg font-bold font-sans text-white">Estimated 148 Minutes</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs font-mono text-gray-400 uppercase tracking-wider">Production Studios</p>
                      <p className="text-lg font-bold font-sans text-white">Marvel Studios / Columbia Pictures</p>
                    </div>
                  </div>
                </div>
              </section>

              {/* 10. EASTER EGGS / CODES PANEL */}
              <section id="easter-eggs" className="bg-[#04060d]/70 border-t border-white/5">
                <EasterEggs 
                  onSymbioteToggle={setIsSymbioteMode}
                  isSymbioteMode={isSymbioteMode}
                  onPhotoModeToggle={setIsPhotoMode}
                  isPhotoMode={isPhotoMode}
                  spiderSenseMode={spiderSenseMode}
                />
              </section>
            </main>
          )}

          {/* Minimalist Footing details (Hidden in Photo Mode) */}
          {!isPhotoMode && (
            <footer className="border-t border-white/5 py-12 px-6 max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6 text-xs text-gray-500 font-mono">
              <div className="space-y-1 text-center sm:text-left">
                <p className="text-white uppercase tracking-widest font-bold">SPIDER-MAN: BRAND NEW DAY</p>
                <p>Designed and crafted with complete procedural detail by Google AI.</p>
              </div>

              <div className="flex items-center gap-6">
                <button 
                  onClick={handlePreBookTickets}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Book Tickets
                </button>
                <a href="#gallery" className="hover:text-white transition-colors">Press Kit</a>
                <a href="https://marvel.com" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">Official Site</a>
              </div>
            </footer>
          )}

          {/* Easter Egg Tactical Intel Notification Overlay */}
          {activeEasterEgg && (
            <div className="fixed bottom-24 right-6 left-6 md:left-auto md:w-[450px] z-50 bg-black/90 backdrop-blur-md border border-red-500/40 p-6 rounded-2xl shadow-[0_15px_50px_rgba(220,38,38,0.25)] animate-fade-in text-white">
              <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-3">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-red-500 rounded-full animate-ping" />
                  <span className="text-[9px] font-mono tracking-widest text-red-500 font-bold uppercase">
                    VIGILANTE INTEL TRANSMISSION
                  </span>
                </div>
                <button
                  onClick={() => {
                    soundEngine.playClick();
                    setActiveEasterEgg(null);
                  }}
                  className="text-gray-400 hover:text-white font-bold text-xs px-2 py-1 hover:bg-white/10 rounded cursor-pointer"
                >
                  DISMISS
                </button>
              </div>
              <h4 className="text-sm font-black text-white uppercase tracking-tight mb-2">
                {activeEasterEgg.title}
              </h4>
              <p className="text-xs text-gray-300 leading-relaxed mb-4 font-sans">
                {activeEasterEgg.narrative}
              </p>
              <div className="text-[8px] font-mono text-gray-500 uppercase tracking-wider flex justify-between">
                <span>COORD: NYC_RADAR_INTERCEPT</span>
                <span>STATUS: ACTIVE_DECRYPT</span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
