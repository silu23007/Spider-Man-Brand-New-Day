/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from "react";
import { soundEngine } from "./SoundEngine";
import { MapPin, Target, Eye, Globe } from "lucide-react";

interface MapLocation {
  id: string;
  name: string;
  zone: string;
  desc: string;
  x: number; // horizontal %
  y: number; // vertical %
  intel: string;
}

export default function InteractiveMap() {
  const [activeLoc, setActiveLoc] = useState<string>("times-square");

  const locations: MapLocation[] = [
    {
      id: "times-square",
      name: "Times Square",
      zone: "Midtown Manhattan",
      desc: "Neon heart of NY, now empty and silent.",
      x: 48,
      y: 45,
      intel: "The central hub where Spidey faces heavy surveillance. Drone cover is densest here. It is also the battleground of Peter's last encounter with Electro.",
    },
    {
      id: "daily-bugle",
      name: "The Daily Bugle",
      zone: "East Side Manhattan",
      desc: "J. Jonah Jameson's loud broadcast headquarters.",
      x: 62,
      y: 38,
      intel: "Jameson continues his crusade to unmask the 'Spider Threat', broadcasting holographic feeds criticizing Spidey directly above the skyscraper rooftops.",
    },
    {
      id: "queens",
      name: "Forest Hills, Queens",
      zone: "Queens Borough",
      desc: "Peter Parker's humble childhood neighborhood.",
      x: 82,
      y: 58,
      intel: "The quiet streets where Aunt May's house once stood. A nostalgic and melancholic resting place Peter visits under the cloak of night.",
    },
    {
      id: "brooklyn-bridge",
      name: "Brooklyn Bridge",
      zone: "Lower Manhattan Connection",
      desc: "Symmetric suspension cable bridge, optimal for swinging.",
      x: 35,
      y: 82,
      intel: "A key checkpoint where Peter often intercepts arms deals. The long wire networks offer maximum tension anchor nodes for high-speed swinging slingshots.",
    },
    {
      id: "oscorp",
      name: "Oscorp Tower",
      zone: "Upper West Side Manhattan",
      desc: "Towering green bio-tech corporate lab.",
      x: 38,
      y: 28,
      intel: "Norman Osborn's legacy, highly secure and filled with experimental glider tech, kinetic weapons, and genetic trials relating to Scorpion.",
    },
    {
      id: "sanctum",
      name: "Sanctum Sanctorum",
      zone: "Bleecker Street, Greenwich Village",
      desc: "Ancient townhouse protecting mystic gates.",
      x: 40,
      y: 62,
      intel: "Doctor Strange's portal. Ever since the massive spell that erased Peter's memory from existence, Peter watches the Sanctum from a nearby water tower in silence.",
    },
  ];

  const handleSelect = (id: string) => {
    setActiveLoc(id);
    soundEngine.playClick();
  };

  const selectedData = locations.find((l) => l.id === activeLoc) || locations[0];

  return (
    <section className="relative py-20 px-6 max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-16 overflow-hidden">
      {/* Background neon map grid overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(220,38,38,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(220,38,38,0.02)_1px,transparent_1px)] bg-[size:30px_30px] opacity-70 pointer-events-none" />

      {/* Retro HUD radar interactive canvas map with Frosted Glass styling */}
      <div className="relative w-full lg:w-3/5 h-[480px] bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-4 flex items-center justify-center overflow-hidden shadow-2xl">
        {/* Stylized Realistic Transparent NYC Vector Blueprint Map */}
        <svg
          viewBox="0 0 500 500"
          className="absolute inset-0 w-full h-full pointer-events-none select-none"
        >
          {/* Subtle Latitude/Longitude Grid lines */}
          <g stroke="rgba(255, 255, 255, 0.05)" strokeWidth="1">
            <line x1="0" y1="100" x2="500" y2="100" />
            <line x1="0" y1="200" x2="500" y2="200" />
            <line x1="0" y1="300" x2="500" y2="300" />
            <line x1="0" y1="400" x2="500" y2="400" />
            <line x1="100" y1="0" x2="100" y2="500" />
            <line x1="200" y1="0" x2="200" y2="500" />
            <line x1="300" y1="0" x2="300" y2="500" />
            <line x1="400" y1="0" x2="400" y2="500" />
          </g>

          {/* Transparent Water Bodies (Hudson & East Rivers) */}
          <path
            d="M 50,0 Q 150,150 140,280 T 100,500 L 0,500 L 0,0 Z"
            fill="rgba(59, 130, 246, 0.05)"
            stroke="rgba(59, 130, 246, 0.15)"
            strokeWidth="1.5"
          />
          <path
            d="M 280,0 Q 250,100 290,160 T 260,320 Q 220,380 200,500 L 500,500 L 500,0 Z"
            fill="rgba(59, 130, 246, 0.03)"
            stroke="rgba(59, 130, 246, 0.12)"
            strokeWidth="1"
          />

          {/* Manhattan Island Body (Semi-transparent dark blueprint) */}
          <path
            d="M 170,0 L 280,0 L 255,100 L 290,160 L 260,320 L 200,430 L 150,480 L 115,410 L 142,280 Z"
            fill="rgba(239, 68, 68, 0.03)"
            stroke="rgba(220, 38, 38, 0.25)"
            strokeWidth="2"
            strokeDasharray="4,2"
          />

          {/* Central Park Green Zone */}
          <rect
            x="200"
            y="60"
            width="50"
            height="110"
            rx="3"
            fill="rgba(16, 185, 129, 0.08)"
            stroke="rgba(16, 185, 129, 0.35)"
            strokeWidth="1.5"
            strokeDasharray="3,3"
          />
          <text x="206" y="120" fill="rgba(16, 185, 129, 0.6)" fontSize="7" fontFamily="monospace" letterSpacing="1">CENTRAL PARK</text>

          {/* Street Grid Mesh Overlay (Broadway, Avenues, Streets) */}
          <g stroke="rgba(255, 255, 255, 0.06)" strokeWidth="0.8">
            {/* Broadway (Angled diagonal cutting across Manhattan) */}
            <line x1="175" y1="20" x2="115" y2="400" stroke="rgba(220, 38, 38, 0.18)" strokeWidth="1.5" />
            
            {/* Midtown/Upper East & West Side grids */}
            <line x1="180" y1="40" x2="270" y2="40" />
            <line x1="170" y1="80" x2="260" y2="80" />
            <line x1="160" y1="120" x2="280" y2="120" />
            <line x1="150" y1="160" x2="290" y2="160" />
            <line x1="145" y1="200" x2="285" y2="200" />
            <line x1="140" y1="240" x2="275" y2="240" />
            <line x1="135" y1="280" x2="265" y2="280" />
            
            {/* North-South Avenues */}
            <path d="M 180,0 L 130,450" fill="none" />
            <path d="M 210,0 L 150,460" fill="none" />
            <path d="M 240,0 L 175,470" fill="none" />
            <path d="M 270,0 L 220,440" fill="none" />
          </g>

          {/* Major New York City Bridges with realistic dashed cable spans */}
          <g stroke="rgba(239, 68, 68, 0.35)" strokeWidth="1.5" strokeDasharray="3,3">
            {/* Brooklyn Bridge */}
            <line x1="145" y1="440" x2="220" y2="465" />
            <text x="185" y="452" fill="rgba(255, 255, 255, 0.4)" fontSize="6" fontFamily="monospace">BK BRIDGE</text>

            {/* Manhattan Bridge */}
            <line x1="160" y1="410" x2="245" y2="430" />
            
            {/* Williamsburg Bridge */}
            <line x1="200" y1="360" x2="280" y2="380" />
            <text x="210" y="375" fill="rgba(255, 255, 255, 0.4)" fontSize="6" fontFamily="monospace">WMBG BRIDGE</text>

            {/* Queensboro Bridge */}
            <line x1="245" y1="210" x2="315" y2="220" />
            <text x="252" y="205" fill="rgba(255, 255, 255, 0.4)" fontSize="6" fontFamily="monospace">QNSBRG BRIDGE</text>
          </g>

          {/* Island Labels */}
          <text x="175" y="30" fill="rgba(255, 255, 255, 0.25)" fontSize="9" fontFamily="monospace" letterSpacing="2">MANHATTAN</text>
          <text x="350" y="350" fill="rgba(255, 255, 255, 0.15)" fontSize="9" fontFamily="monospace" letterSpacing="2">BROOKLYN</text>
          <text x="380" y="180" fill="rgba(255, 255, 255, 0.15)" fontSize="9" fontFamily="monospace" letterSpacing="2">QUEENS</text>
        </svg>

        {/* Live scanning HUD sweep */}
        <div className="absolute inset-0 bg-gradient-to-r from-red-600/0 via-red-500/5 to-red-600/0 w-1/3 h-full animate-radar-sweep pointer-events-none" />

        {/* Pin labels */}
        <div className="absolute inset-0">
          {locations.map((loc) => {
            const isActive = loc.id === activeLoc;
            return (
              <button
                key={loc.id}
                onClick={() => handleSelect(loc.id)}
                className="absolute flex items-center justify-center cursor-pointer transition-transform duration-300 select-none group"
                style={{
                  left: `${loc.x}%`,
                  top: `${loc.y}%`,
                  transform: "translate(-50%, -50%)",
                }}
              >
                {/* Ping rings */}
                <span className={`absolute w-12 h-12 rounded-full border border-red-500/30 scale-100 ${isActive ? 'animate-ping' : 'group-hover:animate-ping'}`} />
                <span className={`absolute w-7 h-7 rounded-full border border-red-500/50 scale-100 ${isActive ? 'animate-pulse' : ''}`} />

                {/* Main pin marker */}
                <div
                  className={`relative w-4.5 h-4.5 flex items-center justify-center rounded-full border shadow-[0_0_15px_rgba(239,68,68,0.5)] transition-all duration-300 ${
                    isActive
                      ? "bg-red-500 border-white scale-110"
                      : "bg-black border-red-500 group-hover:bg-red-950 group-hover:scale-105"
                  }`}
                >
                  <MapPin className={`w-2 h-2 ${isActive ? 'text-black' : 'text-red-400'}`} />
                </div>

                {/* Pinned visual tooltip */}
                <span className={`absolute top-6 px-2.5 py-1 bg-black/90 border border-white/10 rounded text-[9px] font-mono tracking-widest text-white whitespace-nowrap opacity-60 group-hover:opacity-100 transition-opacity ${isActive ? 'opacity-100 border-red-500/40 text-red-400' : ''}`}>
                  {loc.name}
                </span>
              </button>
            );
          })}
        </div>

        {/* Map visual coordinate telemetry indicators */}
        <div className="absolute bottom-4 left-4 font-mono text-[9px] text-gray-400 space-y-0.5 pointer-events-none">
          <p>SYS.LOC: NEW YORK GRID v1.0.8</p>
          <p>PING_STATE: SUCCESS [●]</p>
          <p>RADAR_SWEEP: ACTIVE</p>
        </div>
      </div>

      {/* Info panel explaining selected location (Right) */}
      <div className="w-full lg:w-2/5 space-y-6 text-white">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-red-500 font-mono text-xs tracking-widest uppercase">
            <Globe className="w-3.5 h-3.5" />
            Spidey Tactical Map
          </div>
          <h2 className="text-3.5xl font-bold font-sans tracking-tight uppercase">
            Manhattan Intel Database
          </h2>
          <p className="text-gray-400 text-sm leading-relaxed font-sans">
            New York is Peter Parker's backyard, playground, and responsibility. Select an active coordinate to load Spider-Man's surveillance log, local lore, and tactical notes.
          </p>
        </div>

        {/* Active Node detailed diagnostic log with Frosted Glass styling */}
        <div className="p-6 bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl space-y-4 shadow-2xl relative overflow-hidden animate-fade-in shadow-black/40">
          <div className="absolute -top-10 -right-10 w-24 h-24 bg-red-900/10 rounded-full blur-2xl pointer-events-none" />

          <div className="space-y-1">
            <span className="text-[10px] font-mono tracking-widest text-red-500 uppercase">
              Zone: {selectedData.zone}
            </span>
            <h3 className="text-xl font-bold tracking-tight text-white font-sans flex items-center gap-2">
              <Target className="w-4.5 h-4.5 text-red-500" />
              {selectedData.name}
            </h3>
          </div>

          <p className="text-sm font-semibold text-gray-200 font-sans border-l-2 border-red-600 pl-3.5">
            "{selectedData.desc}"
          </p>

          <p className="text-sm text-gray-400 leading-relaxed font-sans">
            {selectedData.intel}
          </p>

          {/* Local Coordinate specs */}
          <div className="grid grid-cols-2 gap-4 pt-3 border-t border-white/5 font-mono text-[10px] text-gray-400">
            <div>
              <p className="text-red-500 uppercase tracking-wide">Threat Index</p>
              <p className="text-white text-xs font-semibold mt-0.5">HIGH / RED SENSE</p>
            </div>
            <div>
              <p className="text-red-500 uppercase tracking-wide">Signal strength</p>
              <p className="text-white text-xs font-semibold mt-0.5">98.2% SYNCHRONIZED</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
