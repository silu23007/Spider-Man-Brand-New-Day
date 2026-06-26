/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from "react";
import { soundEngine } from "./SoundEngine";
import { TimelineEvent } from "../types";
import { Shield, Sparkles, AlertTriangle, Play } from "lucide-react";

export default function TimelineSection() {
  const [activeEvent, setActiveEvent] = useState<string>("brand-new-day");

  const events: TimelineEvent[] = [
    {
      id: "homecoming",
      movie: "Spider-Man: Homecoming",
      year: "2017",
      description: "Peter Parker navigates high school, tests his rookie powers under Tony Stark's mentorship, and defeats the high-flying Vulture in a dramatic warehouse collapse.",
      keyMoment: "Lifting the heavy collapsed rubble in the warehouse by summoning his inner strength.",
      active: false,
    },
    {
      id: "far-from-home",
      movie: "Spider-Man: Far From Home",
      year: "2019",
      description: "Struggling with the loss of Iron Man, Peter travels to Europe, gets deceived by Mysterio's complex drones and illusions, and has his secret identity outed to the globe.",
      keyMoment: "Deploying his pure 'Peter-Tingle' instinct to defeat the illusion machine swarms inside London.",
      active: false,
    },
    {
      id: "no-way-home",
      movie: "Spider-Man: No Way Home",
      year: "2021",
      description: "Peter asks Doctor Strange to cast a spell erasing his identity, resulting in a multiverse rupture. After curing iconic villains, Peter has Strange cast a final spell to wipe him from all memories.",
      keyMoment: "Saying a heartbreaking, final goodbye to MJ and Ned, knowing they won't remember him.",
      active: false,
    },
    {
      id: "brand-new-day",
      movie: "Spider-Man: Brand New Day",
      year: "Upcoming",
      description: "Peter is completely alone. He lives in a small apartment, has no family, Stark technology, or friends, and protects New York anonymously. A new high-tech vigilante era starts now.",
      keyMoment: "Stepping onto a snowy roof in a classic red-and-blue suit, swinging independently into the future.",
      active: true,
    },
  ];

  const handleSelect = (id: string) => {
    setActiveEvent(id);
    soundEngine.playClick();
  };

  const currentData = events.find((e) => e.id === activeEvent) || events[3];

  return (
    <section className="relative py-24 px-6 max-w-7xl mx-auto overflow-hidden">
      {/* Dynamic light highlight in background */}
      <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-80 h-80 bg-red-600/5 rounded-full blur-3xl pointer-events-none" />

      <div className="space-y-3 mb-16 text-center">
        <p className="text-red-500 font-mono text-xs tracking-widest uppercase">
          Chronological Trace
        </p>
        <h2 className="text-4xl font-bold tracking-tight text-white font-sans uppercase">
          Peter Parker's Journey
        </h2>
        <p className="text-gray-400 text-sm max-w-md mx-auto leading-normal font-sans">
          Tracing Peter's life from his bright, mentorship beginnings to the absolute sacrifice of memory and identity.
        </p>
      </div>

      {/* Horizontal timeline track nodes */}
      <div className="relative mb-12">
        {/* Connection track line */}
        <div className="absolute top-6 left-12 right-12 h-0.5 bg-white/10" />

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 relative z-10">
          {events.map((ev, i) => {
            const isActive = ev.id === activeEvent;
            return (
              <div
                key={ev.id}
                onClick={() => handleSelect(ev.id)}
                className="flex flex-col items-center text-center cursor-pointer group"
              >
                {/* Milestone button dot */}
                <div
                  className={`w-12 h-12 flex items-center justify-center rounded-full border transition-all duration-300 ${
                    isActive
                      ? "bg-red-600 border-white scale-110 shadow-[0_0_15px_rgba(239,68,68,0.7)]"
                      : "bg-black border-white/10 group-hover:border-white/40 group-hover:scale-105"
                  }`}
                >
                  {i === 0 && <Shield className={`w-4 h-4 ${isActive ? 'text-white' : 'text-gray-400'}`} />}
                  {i === 1 && <Sparkles className={`w-4 h-4 ${isActive ? 'text-white' : 'text-gray-400'}`} />}
                  {i === 2 && <AlertTriangle className={`w-4 h-4 ${isActive ? 'text-white' : 'text-gray-400'}`} />}
                  {i === 3 && <Play className={`w-4 h-4 ${isActive ? 'text-white' : 'text-red-400'}`} />}
                </div>

                <div className="mt-4 space-y-1">
                  <span className={`font-mono text-xs tracking-widest ${isActive ? 'text-red-500 font-semibold' : 'text-gray-500'}`}>
                    {ev.year}
                  </span>
                  <h3 className={`text-sm font-semibold tracking-tight transition-colors ${isActive ? 'text-white font-bold' : 'text-gray-400 group-hover:text-white'}`}>
                    {ev.movie.split(": ")[1] || ev.movie}
                  </h3>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Dynamic event details viewer with Frosted Glass styling */}
      <div className="p-8 sm:p-10 bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl relative overflow-hidden animate-fade-in shadow-[0_8px_32px_0_rgba(0,0,0,0.4)]">
        <div className="absolute top-0 right-0 p-6 font-mono text-[10px] text-gray-400 tracking-wider">
          EVENT_LOG_ID: {currentData.id.toUpperCase()}
        </div>

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-12">
          <div className="space-y-4 max-w-2xl">
            <span className="text-[10px] font-mono tracking-widest text-red-500 uppercase">
              Phase details [Year {currentData.year}]
            </span>
            <h3 className="text-2.5xl font-bold tracking-tight text-white font-sans">
              {currentData.movie}
            </h3>
            <p className="text-gray-300 text-sm leading-relaxed font-sans">
              {currentData.description}
            </p>
          </div>

          <div className="lg:w-1/3 p-6 bg-red-500/10 backdrop-blur-md border border-red-500/20 rounded-xl space-y-3">
            <div className="flex items-center gap-2 text-red-500 text-xs font-mono tracking-wider uppercase">
              <Sparkles className="w-3.5 h-3.5" />
              Key Catalyst Moment
            </div>
            <p className="text-sm font-medium text-white italic leading-relaxed font-sans">
              "{currentData.keyMoment}"
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
