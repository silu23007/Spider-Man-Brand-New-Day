/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from "react";
import { soundEngine } from "./SoundEngine";
import { ChevronLeft, ChevronRight, MessageSquare, Shield, Skull, Activity } from "lucide-react";

interface Character {
  id: string;
  name: string;
  role: string;
  faction: "hero" | "villain" | "neutral";
  quote: string;
  description: string;
  visualTheme: string; // Tailwind styles for card background
  icon: any;
  accent: string;
  timeline: string;
}

export default function CharacterShowcase() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isShaking, setIsShaking] = useState(false);
  const [shells, setShells] = useState<{ id: number; x: number; y: number; rotate: number }[]>([]);

  const characters: Character[] = [
    {
      id: "peter",
      name: "Peter Parker / Spider-Man",
      role: "The Friendly Neighborhood Ghost",
      faction: "hero",
      quote: "The world forgot who Peter Parker is... but they still remember Spider-Man.",
      description: "Peter now lives anonymously in a cramped studio apartment, protecting New York alone with no tech support or friends. He must rebuild his life from scratch while facing the burdens of secrecy.",
      visualTheme: "from-red-950/40 to-blue-950/40 border-red-500/30",
      icon: Shield,
      accent: "text-red-500",
      timeline: "Post-Spell / Brand New Day",
    },
    {
      id: "mj",
      name: "Michelle Jones (MJ)",
      role: "The Forgotten Soulmate",
      faction: "neutral",
      quote: "I feel like... I'm missing a part of my own story, and I don't know why.",
      description: "Attending MIT alongside Ned, MJ lives her life with no memory of ever meeting Peter Parker. Yet, a strange feeling of unfinished connection lingers in her mind whenever she reads her old essays.",
      visualTheme: "from-neutral-900/60 to-neutral-950 border-white/10",
      icon: MessageSquare,
      accent: "text-amber-500",
      timeline: "MIT Freshman Year",
    },
    {
      id: "ned",
      name: "Ned Leeds",
      role: "The Sorcerer in Waiting",
      faction: "neutral",
      quote: "We used to do crazy things, didn't we MJ? I just wish I could remember the details.",
      description: "Peter's former 'Guy in the Chair'. Now focusing on magic theory and engineering at MIT, Ned's memory of Peter is fully wiped, leaving him with a phantom gap in his tech-building years.",
      visualTheme: "from-neutral-900/60 to-neutral-950 border-white/10",
      icon: MessageSquare,
      accent: "text-blue-400",
      timeline: "MIT Freshman Year",
    },
    {
      id: "hulk",
      name: "Bruce Banner / Hulk",
      role: "The Giant Science Ally",
      faction: "hero",
      quote: "Peter? I don't recall... but this energy signature you're showing me is familiar.",
      description: "While analyzing atmospheric fluctuations in NYC, Banner encounters Spider-Man. Although he cannot recall Peter Parker, Banner's scientific logs identify Spider-Man as a reliable veteran ally.",
      visualTheme: "from-emerald-950/40 to-neutral-950 border-emerald-500/30",
      icon: Activity,
      accent: "text-emerald-500",
      timeline: "SHe-Hulk Post-Credits Transition",
    },
    {
      id: "punisher",
      name: "Frank Castle / Punisher",
      role: "Vigilante Force of Nature",
      faction: "neutral",
      quote: "You wear a mask to save your enemies. I don't wear one because they don't get saved.",
      description: "Frank Castle has tracked down high-tech Oscorp weapon shipments in New York's dark alleys. His brutal methods clash directly with Spider-Man's non-lethal ethics, creating tense conflict.",
      visualTheme: "from-stone-900/80 to-stone-950 border-stone-600/40",
      icon: Skull,
      accent: "text-neutral-300",
      timeline: "Hell's Kitchen Reconnaissance",
    },
    {
      id: "scorpion",
      name: "Mac Gargan / Scorpion",
      role: "Pneumatic Exo-Stinger Threat",
      faction: "villain",
      quote: "I've waited years to squash you, Bug. Now Oscorp finally gave me the pincers to do it.",
      description: "Mac Gargan is released and fitted with a high-powered titanium tail-harness funded by Oscorp labs. Driven by historical rage, Scorpion leads a vicious manhunt across Manhattan's rooftops.",
      visualTheme: "from-green-950/40 to-emerald-950/20 border-green-500/30",
      icon: Skull,
      accent: "text-green-500",
      timeline: "Raft Escape / Oscorp Fitted",
    },
    {
      id: "hacker",
      name: "Mystery Witness (Sadie Sink)",
      role: "The Cryptic Tech Journalist",
      faction: "neutral",
      quote: "I've been analyzing NYC traffic logs. There's a ghost in the grid saving people in red and blue.",
      description: "A highly brilliant cyber-intelligence investigator based in Manhattan. Having uncovered multiple unlogged anomalies in NYPD security cameras, she tracks the mystery of the forgotten hero.",
      visualTheme: "from-purple-950/30 to-neutral-950 border-purple-500/20",
      icon: MessageSquare,
      accent: "text-purple-400",
      timeline: "Daily Bugle Backroom Archives",
    },
  ];

  // Specific Hulk section screen-shake interaction
  useEffect(() => {
    if (characters[activeIndex].id === "hulk") {
      setIsShaking(true);
      soundEngine.playThunder();
      const t = setTimeout(() => setIsShaking(false), 800);
      return () => clearTimeout(t);
    }
  }, [activeIndex]);

  // Specific Punisher section falling shell-casings simulation
  useEffect(() => {
    if (characters[activeIndex].id === "punisher") {
      // Spawn falling brass shells in interval
      const interval = setInterval(() => {
        setShells((prev) => [
          ...prev.slice(-15), // keep last 15 shells
          {
            id: Date.now() + Math.random(),
            x: Math.random() * 90 + 5,
            y: -10,
            rotate: Math.random() * 360,
          },
        ]);
        if (Math.random() > 0.6) {
          soundEngine.playClick(); // metallic tick
        }
      }, 400);

      return () => clearInterval(interval);
    } else {
      setShells([]);
    }
  }, [activeIndex]);

  // Fall tick for shells
  useEffect(() => {
    if (shells.length === 0) return;
    const frame = requestAnimationFrame(() => {
      setShells((prev) =>
        prev
          .map((s) => ({ ...s, y: s.y + 4.5, rotate: s.rotate + 1.5 }))
          .filter((s) => s.y < 420)
      );
    });
    return () => cancelAnimationFrame(frame);
  }, [shells]);

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % characters.length);
    soundEngine.playClick();
  };

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + characters.length) % characters.length);
    soundEngine.playClick();
  };

  const activeChar = characters[activeIndex];

  return (
    <div
      className={`relative py-24 px-6 max-w-7xl mx-auto overflow-hidden transition-all duration-300 ${
        isShaking ? "animate-shake" : ""
      }`}
    >
      {/* Background ambient lighting */}
      <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-[#02040c]/0 via-[#02040c]/40 to-[#02040c]/0 pointer-events-none" />

      <div className="flex flex-col md:flex-row items-center justify-between mb-16 gap-6">
        <div className="space-y-2">
          <p className="text-red-500 font-mono text-xs tracking-widest uppercase">
            Unmasked files
          </p>
          <h2 className="text-4xl font-bold tracking-tight text-white font-sans uppercase">
            Character Records
          </h2>
          <p className="text-gray-400 text-sm max-w-md font-sans leading-normal">
            A brand new day starts now, accompanied by familiar faces, old allies whose memories are erased, and deadly new high-tech vigilante threats.
          </p>
        </div>

        {/* Carousel controls */}
        <div className="flex items-center gap-3">
          <button
            onClick={handlePrev}
            className="p-3.5 bg-white/5 hover:bg-white/10 border border-white/5 rounded-full hover:scale-105 transition-all cursor-pointer"
          >
            <ChevronLeft className="w-5 h-5 text-white" />
          </button>
          <span className="text-sm font-mono text-gray-400 min-w-[3rem] text-center">
            {activeIndex + 1} / {characters.length}
          </span>
          <button
            onClick={handleNext}
            className="p-3.5 bg-white/5 hover:bg-white/10 border border-white/5 rounded-full hover:scale-105 transition-all cursor-pointer"
          >
            <ChevronRight className="w-5 h-5 text-white" />
          </button>
        </div>
      </div>

      {/* Cinematic Showcase Card with Frosted Glass styling */}
      <div
        className="relative w-full min-h-[440px] rounded-2xl p-8 sm:p-12 border border-white/10 bg-white/5 backdrop-blur-md shadow-[0_10px_40px_rgba(0,0,0,0.5)] overflow-hidden transition-all duration-500"
      >
        {/* Falling bullet shell casings in Punisher Mode */}
        {activeChar.id === "punisher" && (
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {shells.map((s) => (
              <div
                key={s.id}
                className="absolute w-2 h-5 bg-amber-500/80 rounded-sm shadow-[0_0_8px_rgba(245,158,11,0.5)]"
                style={{
                  left: `${s.x}%`,
                  top: `${s.y}px`,
                  transform: `rotate(${s.rotate}deg)`,
                }}
              />
            ))}
            {/* Dark alley heavy red overlay */}
            <div className="absolute inset-0 bg-red-950/15 mix-blend-color-burn" />
          </div>
        )}

        {/* Shaking indicator on Hulk Card */}
        {activeChar.id === "hulk" && (
          <div className="absolute inset-0 pointer-events-none bg-emerald-950/5 animate-pulse" />
        )}

        {/* Decorative Grid and Background details */}
        <div className="absolute -right-16 -bottom-16 w-80 h-80 bg-white/2 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col justify-between h-full gap-8">
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/5 pb-4">
              <div className="space-y-1">
                <span className="text-[10px] font-mono tracking-widest text-red-500 uppercase">
                  Timeline: {activeChar.timeline}
                </span>
                <h3 className="text-2.5xl sm:text-3.5xl font-bold tracking-tight text-white font-sans">
                  {activeChar.name}
                </h3>
              </div>
              <span className="flex items-center gap-2 px-3.5 py-1.5 bg-black/40 border border-white/10 rounded-full text-[10px] font-mono tracking-widest uppercase text-gray-300">
                <activeChar.icon className={`w-3.5 h-3.5 ${activeChar.accent}`} />
                {activeChar.role}
              </span>
            </div>

            {/* Quote with giant graphic brackets */}
            <div className="relative pl-6">
              <span className="absolute left-0 top-0 text-5xl font-serif text-white/10 leading-none">“</span>
              <p className="text-xl sm:text-2xl font-medium tracking-wide italic text-gray-100 leading-relaxed font-sans">
                {activeChar.quote}
              </p>
            </div>

            {/* Description detailing lore */}
            <p className="text-gray-400 text-sm max-w-3xl leading-relaxed font-sans">
              {activeChar.description}
            </p>
          </div>

          {/* Interactive metadata footer */}
          <div className="flex flex-wrap items-center gap-6 text-xs font-mono text-gray-400">
            <div>
              <span className="text-red-500 font-semibold">Affiliation:</span>{" "}
              <span className="text-white uppercase tracking-wider">{activeChar.faction}</span>
            </div>
            <div className="hidden sm:block">
              <span className="text-red-500 font-semibold">Database entry:</span>{" "}
              <span className="text-white uppercase tracking-wider">SECURE-LOG-0{activeIndex + 1}</span>
            </div>
            {activeChar.id === "hulk" && (
              <span className="text-emerald-500 animate-pulse uppercase tracking-wider font-semibold">
                ● Scroll active: Ground rumble triggered
              </span>
            )}
            {activeChar.id === "punisher" && (
              <span className="text-red-400 animate-pulse uppercase tracking-wider font-semibold">
                ● Bullet casings tumbling in storm
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Quick Select deck from design HTML */}
      <div className="flex flex-wrap justify-center gap-3 mt-8 relative z-10">
        {characters.map((char, index) => (
          <div 
            key={char.id} 
            onClick={() => {
              setActiveIndex(index);
              soundEngine.playClick();
            }}
            className="group cursor-pointer flex flex-col items-center"
          >
            <div className={`w-14 h-14 rounded-lg bg-white/5 border transition-all duration-300 flex flex-col items-center justify-center backdrop-blur-md ${
              activeIndex === index 
                ? "border-red-500 shadow-[0_0_15px_rgba(220,38,38,0.3)] bg-white/15" 
                : "border-white/10 hover:border-red-500/50"
            }`}>
              <char.icon className={`w-5 h-5 ${activeIndex === index ? char.accent : "text-gray-400 group-hover:text-white"}`} />
            </div>
            <p className={`text-[9px] uppercase tracking-[0.1em] mt-1.5 transition-all duration-300 ${
              activeIndex === index ? "opacity-100 text-red-500 font-bold" : "opacity-40 group-hover:opacity-80 text-gray-400"
            }`}>
              {char.id}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
