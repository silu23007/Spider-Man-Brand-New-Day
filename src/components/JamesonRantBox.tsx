/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from "react";
import { soundEngine } from "./SoundEngine";
import { Radio, AlertCircle, Volume2, Flame, RefreshCw } from "lucide-react";

const JJJ_RANTS = [
  {
    text: "THE QUEEN OF ENGLAND! Did she sign up for a spider-infestation? No! Buckingham Palace is probably covered in sticky cobwebs as we speak! And this city is soft! New York is going to the dogs because of a masked, spandex-wearing menace who thinks he is above the law! HE'S A MENACE!",
    topic: "The Queen & City Decay"
  },
  {
    text: "HE'S A PUBLIC HAZARD! He swings around without a license, breaking historic monuments, interrupting legal traffic flow, and running a monopoly on rescue operations! I don't care if he saved a school bus! Who is going to pay for the sticky web cleanup? THE TAXPAYERS! THAT'S WHO!",
    topic: "Public Menace Status"
  },
  {
    text: "THE PEOPLE OF NEW YORK ARE BRAINWASHED! They call him a hero! They print t-shirts! Look at them, walking around, staring at their phones, lazy as slugs, waiting for a web-head to carry them across the street! Get a job! Do some honest work! Like selling newspapers! Buy the Bugle!",
    topic: "Soft Citizens"
  },
  {
    text: "I want pictures of Spider-Man! Not blurry selfies of him posing on the Chrysler Building! I want him caught in the act of being a menace! He's in cahoots with the Green Goblin, I've said it for years! They're probably sharing a hot dog in Central Park right now! Conspiracy! Fraud!",
    topic: "Goblin Conspiracy"
  },
  {
    text: "ANONYMITY IS A CRIME! If he has nothing to hide, why does he wear a mask? Is he ugly? Is he bald? Is he a giant radioactive tick? The public has a right to know who is swingin' above their baby strollers! The Daily Bugle will unmask this coward once and for all!",
    topic: "Masked Cowardice"
  },
  {
    text: "A BRAND NEW DAY? I'll tell you what a brand new day is: it's a day WITHOUT Spider-Man! A day when we can walk down the street without getting hit by a falling spider-booty! Parker, if you don't get me those photos of him stealing a purse by five o'clock, you're FIRED!",
    topic: "A Brand New Day"
  },
  {
    text: "THE QUEEN! THE PEOPLE! The whole system is compromised by this multi-legged freeloader! He doesn't pay municipal taxes, he doesn't respect parking meters, and he has zero regard for the beautiful brick-and-mortar architecture of our skyline! He is a architectural pest!",
    topic: "Architectural Pest"
  }
];

export default function JamesonRantBox() {
  const [rantIndex, setRantIndex] = useState(0);
  const [angerLevel, setAngerLevel] = useState<"calm" | "furious" | "nuclear">("furious");

  const triggerNextRant = () => {
    soundEngine.playClick();
    setRantIndex((prev) => (prev + 1) % JJJ_RANTS.length);
  };

  const currentRant = JJJ_RANTS[rantIndex];

  // Map anger level to CSS classes
  const getAngerStyles = () => {
    switch (angerLevel) {
      case "calm":
        return {
          container: "border-gray-500/20 bg-black/40 shadow-xl shadow-black/30",
          glow: "bg-gray-500/5",
          badge: "bg-gray-500/20 text-gray-300",
          text: "text-gray-200 font-sans italic",
          title: "text-gray-300",
          icon: "text-gray-400"
        };
      case "furious":
        return {
          container: "border-red-500/30 bg-red-950/10 shadow-[0_0_25px_rgba(239,68,68,0.1)]",
          glow: "bg-red-600/10",
          badge: "bg-red-500/20 text-red-400 animate-pulse",
          text: "text-white font-sans font-medium tracking-tight",
          title: "text-red-500",
          icon: "text-red-500"
        };
      case "nuclear":
        return {
          container: "border-red-600 bg-red-950/30 shadow-[0_0_40px_rgba(239,68,68,0.3)]",
          glow: "bg-red-600/25",
          badge: "bg-red-600 text-white font-black uppercase animate-ping",
          text: "text-red-200 font-mono font-black uppercase text-base sm:text-lg tracking-wide scale-102",
          title: "text-red-500 font-black tracking-widest uppercase",
          icon: "text-red-600"
        };
    }
  };

  const styles = getAngerStyles();

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-8">
      {/* Container Card */}
      <div className={`relative rounded-2xl p-6 sm:p-8 border backdrop-blur-md transition-all duration-500 ${styles.container}`}>
        {/* Decorative background glow */}
        <div className={`absolute -top-24 -left-24 w-48 h-48 rounded-full blur-3xl pointer-events-none transition-all duration-500 ${styles.glow}`} />
        <div className={`absolute -bottom-24 -right-24 w-48 h-48 rounded-full blur-3xl pointer-events-none transition-all duration-500 ${styles.glow}`} />

        {/* Daily Bugle Header */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-white/10 pb-6 mb-6">
          <div className="flex items-center gap-3">
            <Radio className={`w-6 h-6 ${styles.icon}`} />
            <div>
              <h3 className={`text-lg font-black tracking-tighter uppercase font-sans ${styles.title}`}>
                DAILY BUGLE BROADCAST
              </h3>
              <p className="text-[9px] font-mono tracking-widest text-gray-400 uppercase">
                JJJ EXCLUSIVE • SIGNAL: LIVE_INTERCEPT
              </p>
            </div>
          </div>

          {/* Anger level controls */}
          <div className="flex items-center gap-2 bg-black/60 p-1 rounded-lg border border-white/5">
            <button
              onClick={() => {
                soundEngine.playHover();
                setAngerLevel("calm");
              }}
              className={`px-3 py-1 rounded text-[9px] font-bold uppercase tracking-wider transition-all duration-300 cursor-pointer ${
                angerLevel === "calm" ? "bg-white/10 text-white" : "text-gray-400 hover:text-white"
              }`}
            >
              Calm
            </button>
            <button
              onClick={() => {
                soundEngine.playHover();
                setAngerLevel("furious");
              }}
              className={`px-3 py-1 rounded text-[9px] font-bold uppercase tracking-wider transition-all duration-300 cursor-pointer ${
                angerLevel === "furious" ? "bg-red-500/20 text-red-400" : "text-gray-400 hover:text-white"
              }`}
            >
              Furious
            </button>
            <button
              onClick={() => {
                soundEngine.playHover();
                setAngerLevel("nuclear");
                window.dispatchEvent(new CustomEvent("spidey-achievement", { detail: { id: "jameson" } }));
              }}
              className={`px-3 py-1 rounded text-[9px] font-black uppercase tracking-wider transition-all duration-300 flex items-center gap-1 cursor-pointer ${
                angerLevel === "nuclear" ? "bg-red-600 text-white" : "text-gray-400 hover:text-red-400"
              }`}
            >
              <Flame className="w-3 h-3" />
              Nuclear
            </button>
          </div>
        </div>

        {/* The Rant Box Body */}
        <div className="space-y-6">
          <div className="flex items-center gap-2">
            <span className={`px-2 py-0.5 rounded text-[8px] font-mono font-bold tracking-widest uppercase ${styles.badge}`}>
              {currentRant.topic}
            </span>
            <span className="text-[10px] font-mono text-gray-500">
              SPEAKER: J. JONAH JAMESON
            </span>
          </div>

          <div className="bg-black/40 rounded-xl p-6 border border-white/5 min-h-[140px] flex items-center relative overflow-hidden">
            {/* Background watermarked JJJ letter */}
            <span className="absolute -right-4 -bottom-10 text-[120px] font-black font-sans select-none text-white/5 pointer-events-none">
              JJJ
            </span>
            
            <p className={`relative z-10 text-sm sm:text-base leading-relaxed font-sans transition-all duration-500 ${styles.text}`}>
              "{currentRant.text}"
            </p>
          </div>

          {/* Interactive button to toggle rants */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
            <div className="flex items-center gap-2 text-[10px] font-mono text-gray-400">
              <Volume2 className="w-3.5 h-3.5 text-red-500" />
              <span>INTERACTIVE TRANSMISSION STREAM</span>
            </div>

            <button
              onClick={triggerNextRant}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2.5 bg-white text-black hover:bg-red-600 hover:text-white text-[10px] font-bold uppercase tracking-widest rounded-sm transition-all duration-300 hover:scale-105 cursor-pointer shadow-md shadow-white/5 group"
            >
              <RefreshCw className="w-3.5 h-3.5 group-hover:rotate-180 transition-transform duration-500" />
              Next Rant
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
