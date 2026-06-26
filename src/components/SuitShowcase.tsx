/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { soundEngine } from "./SoundEngine";
import { Sparkles, Compass, Cpu, Target, Shield, Zap } from "lucide-react";

interface Hotspot {
  id: string;
  title: string;
  icon: any;
  desc: string;
  x: number; // percentage from left of container
  y: number; // percentage from top of container
  detail: string;
}

export default function SuitShowcase() {
  const [viewMode, setViewMode] = useState<"full" | "hand">("full");
  const [activeHotspot, setActiveHotspot] = useState<string>("lenses");
  const [rotation, setRotation] = useState({ x: 0, y: 0 });

  const fullSuitHotspots: Hotspot[] = [
    {
      id: "lenses",
      title: "Adaptive Lenses",
      icon: Target,
      desc: "Retina-adaptive HUD & tactical tracking.",
      x: 50,
      y: 28,
      detail: "Equipped with custom high-contrast photoreactive shielding, matching Peter's pupil contractions, loaded with full Stark-residual thermal mapping and AI environment telemetry.",
    },
    {
      id: "fabric",
      title: "Vibranium Nano-Weave",
      icon: Sparkles,
      desc: "Ultra-elastic kinetic impact absorption.",
      x: 35,
      y: 50,
      detail: "Sewn with lightweight carbon-nanotube matrices, integrating subtle elastic blue webbing that expands under tension to diffuse and dissipate heavy impact energy.",
    },
    {
      id: "insignia",
      title: "Liquid-Silicon Insignia",
      icon: Cpu,
      desc: "Integrated sub-surface nanotech mainframe.",
      x: 50,
      y: 58,
      detail: "The central crest houses a distributed quantum computing deck with self-healing emergency repair reserves to fix suit tearing or insulate against electro-arcs.",
    },
    {
      id: "shooters",
      title: "Web Shooters",
      icon: Compass,
      desc: "Dual pneumatic web fluid compressors.",
      x: 24,
      y: 75,
      detail: "Redesigned minimalist magnetic nozzles that shoot synthetic web fluid at 400 psi, capable of adjusting density on the fly for impact pellets, ropes, or protective nets.",
    },
  ];

  const handSuitHotspots: Hotspot[] = [
    {
      id: "nozzle",
      title: "Brass Web Nozzle",
      icon: Zap,
      desc: "High-pressure directional discharge port.",
      x: 50,
      y: 78,
      detail: "A solid-brass micro-bored nozzle forged by Peter himself in his workshop, utilizing magnetic induction locks to prevent residue clog and guarantee 400 psi stream velocity.",
    },
    {
      id: "palmGrip",
      title: "Nylon Micro-Grid Palm",
      icon: Shield,
      desc: "High-traction friction matrix.",
      x: 50,
      y: 48,
      detail: "Constructed with Kevlar-insulated tactical mesh that prevents rope burn during 120mph pendulum swings, reinforced with high-density polyurethane webbing patterns.",
    },
    {
      id: "electroPad",
      title: "Electrostatic Fingerpads",
      icon: Sparkles,
      desc: "Van der Waals adhesion membranes.",
      x: 68,
      y: 18,
      detail: "Individual micro-suction pores stitched on fingerpads, using synthetic carbon fibers to simulate natural gecko adhesion, allowing vertical brick-climbing even under heavy rain.",
    },
    {
      id: "seams",
      title: "Flex-Stitch Knuckles",
      icon: Target,
      desc: "Dual-row double reinforced joint stitches.",
      x: 35,
      y: 35,
      detail: "Hand-threaded heavy-duty elastic seams designed with Peter's personal sewing kit, offering maximum kinetic punch flexibility while resisting blade tearing or tear gas corrosion.",
    },
  ];

  const hotspots = viewMode === "full" ? fullSuitHotspots : handSuitHotspots;

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    const rect = el.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 20; // rotate up to 10deg
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * -20;
    setRotation({ x, y });
  };

  const handleMouseLeave = () => {
    setRotation({ x: 0, y: 0 });
  };

  const selectHotspot = (id: string) => {
    setActiveHotspot(id);
    soundEngine.playClick();
  };

  const toggleViewMode = (mode: "full" | "hand") => {
    soundEngine.playClick();
    setViewMode(mode);
    setActiveHotspot(mode === "full" ? "lenses" : "nozzle");
  };

  const activeData = hotspots.find((h) => h.id === activeHotspot) || hotspots[0];

  return (
    <section className="relative py-24 px-6 max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-16 overflow-hidden">
      {/* Background radial highlight */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-96 h-96 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* 3D-Interactive Suit Model Rendering Frame (Left) */}
      <div
        className="relative w-full lg:w-1/2 h-[520px] flex flex-col items-center justify-center cursor-grab group select-none"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{ perspective: 1000 }}
      >
        {/* Toggle Mode Control Hud */}
        <div className="absolute top-0 flex items-center gap-1 bg-black/60 border border-white/10 rounded-full p-1 text-[10px] font-mono uppercase tracking-widest text-gray-400 z-20">
          <button
            onClick={() => toggleViewMode("full")}
            className={`px-4 py-1.5 rounded-full font-bold transition-all cursor-pointer ${
              viewMode === "full" ? "bg-red-600 text-white" : "hover:text-white"
            }`}
          >
            Full Suit Matrix
          </button>
          <button
            onClick={() => toggleViewMode("hand")}
            className={`px-4 py-1.5 rounded-full font-bold transition-all cursor-pointer ${
              viewMode === "hand" ? "bg-red-600 text-white" : "hover:text-white"
            }`}
          >
            Peter's Hand Glove
          </button>
        </div>

        {/* Shadow floor */}
        <div className="absolute bottom-6 w-72 h-8 bg-black/60 rounded-full blur-xl scale-95" />

        {/* Dynamic Card Container rotating in 3D */}
        <div
          className="relative w-80 h-[440px] flex items-center justify-center transition-transform duration-200 ease-out"
          style={{
            transform: `rotateY(${rotation.x}px) rotateX(${rotation.y}px)`,
            transformStyle: "preserve-3d",
          }}
        >
          {viewMode === "full" ? (
            /* Detailed layered high-contrast SVG Suit Artwork */
            <svg
              viewBox="0 0 400 600"
              className="w-full h-full drop-shadow-[0_20px_50px_rgba(220,38,38,0.18)]"
              style={{ transform: "translateZ(30px)" }}
            >
              {/* Outline Glow */}
              <filter id="suit-glow">
                <feGaussianBlur stdDeviation="6" result="coloredBlur" />
                <feMerge>
                  <feMergeNode in="coloredBlur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>

              {/* Suit Chest Plate & Shoulders (Red Section) */}
              <path
                d="M100,180 L300,180 L340,240 L350,380 L280,500 L120,500 L50,380 L60,240 Z"
                fill="#dc2626"
                stroke="#991b1b"
                strokeWidth="3"
              />

              {/* Blue Side Panels */}
              <path
                d="M60,240 L100,240 L120,500 L50,380 Z"
                fill="#1e3a8a"
                stroke="#1e40af"
                strokeWidth="2"
              />
              <path
                d="M340,240 L300,240 L280,500 L350,380 Z"
                fill="#1e3a8a"
                stroke="#1e40af"
                strokeWidth="2"
              />

              {/* Web Grid lines on chest */}
              <g stroke="#111827" strokeWidth="1.5" opacity="0.65">
                {/* Vertical Web offsets */}
                <path d="M200,180 C200,280 200,450 200,500" />
                <path d="M150,180 C160,280 170,450 160,500" />
                <path d="M250,180 C240,280 230,450 240,500" />
                {/* Horizontal Rings */}
                <path d="M80,260 C140,240 260,240 320,260" fill="none" />
                <path d="M70,330 C130,310 270,310 330,330" fill="none" />
                <path d="M90,410 C140,390 260,390 310,410" fill="none" />
              </g>

              {/* Spider Insignia (Black Center Chest Emblem) */}
              <g fill="#111827" stroke="#1f2937" strokeWidth="1" style={{ transform: "translate(200px, 320px) scale(0.95)" }}>
                {/* Spider Body */}
                <ellipse cx="0" cy="-10" rx="9" ry="14" />
                <ellipse cx="0" cy="12" rx="12" ry="16" />
                {/* Upper legs */}
                <path d="M-5,-10 C-15,-35 -35,-40 -50,-35 L-55,-37 C-35,-45 -15,-40 0,-15" />
                <path d="M5,-10 C15,-35 35,-40 50,-35 L55,-37 C35,-45 15,-40 0,-15" />
                {/* Middle legs */}
                <path d="M-8,-2 C-30,-15 -55,-5 -65,15 L-63,18 C-53,0 -30,-10 0,0" />
                <path d="M8,-2 C30,-15 55,-5 65,15 L63,18 C53,0 30,-10 0,0" />
                {/* Lower legs */}
                <path d="M-8,15 C-25,30 -40,55 -35,80 L-32,79 C-38,58 -23,36 0,20" />
                <path d="M8,15 C25,30 40,55 35,80 L32,79 C38,58 23,36 0,20" />
              </g>

              {/* Spider-Man Head / Mask (Upper level) */}
              <path
                d="M150,80 C150,30 250,30 250,80 C250,135 200,175 200,175 C200,175 150,135 150,80 Z"
                fill="#dc2626"
                stroke="#991b1b"
                strokeWidth="2.5"
              />

              {/* Web lines on head */}
              <g stroke="#111827" strokeWidth="1.2" opacity="0.6" fill="none">
                <path d="M200,30 L200,175" />
                <path d="M150,80 L250,80" />
                <path d="M165,55 L235,130" />
                <path d="M235,55 L165,130" />
                {/* Circles */}
                <path d="M200,80 A15,15 0 0,1 200,50 A15,15 0 0,1 200,80" />
                <path d="M200,80 A35,35 0 0,1 200,20 A35,35 0 0,1 200,80" />
              </g>

              {/* Glowing Eyes */}
              <path
                d="M165,75 C180,75 190,82 195,95 C185,98 170,95 160,85 Z"
                fill="#ffffff"
                stroke="#000"
                strokeWidth="4"
                filter="url(#suit-glow)"
              />
              <path
                d="M235,75 C220,75 210,82 205,95 C215,98 230,95 240,85 Z"
                fill="#ffffff"
                stroke="#000"
                strokeWidth="4"
                filter="url(#suit-glow)"
              />
            </svg>
          ) : (
            /* Peter's Hand / Glove Closeup SVG - HIGH FIDELITY REALISTIC GRAPHIC */
            <svg
              viewBox="0 0 400 600"
              className="w-full h-full drop-shadow-[0_20px_50px_rgba(220,38,38,0.25)]"
              style={{ transform: "translateZ(30px)" }}
            >
              {/* Solid Background container */}
              <g>
                {/* The forearm and hand shape */}
                {/* Underlay hand shadow */}
                <path
                  d="M140,550 L140,430 C130,400 120,280 130,220 C135,180 125,120 145,90 C155,75 170,75 180,95 C185,110 180,160 185,200 C185,160 195,110 215,90 C225,80 238,85 242,105 C248,135 242,190 245,220 C245,170 255,125 275,110 C285,100 295,105 298,125 C302,155 295,200 295,235 C295,195 305,150 325,145 C335,140 342,150 340,170 C335,210 325,270 320,310 C322,345 350,380 345,410 C335,450 260,550 260,550 Z"
                  fill="none"
                />

                {/* Main Glove Base Leather Section (Deep Slate / Navy contrast grip) */}
                <path
                  d="M120,530 L135,400 L115,280 C110,240 125,210 140,195 L145,115 C148,95 168,95 172,115 L180,210 L188,110 C190,90 210,90 214,110 L220,215 L228,125 C230,105 250,105 253,125 L258,230 C260,155 280,155 282,175 L285,275 C290,290 310,310 320,340 C328,365 315,400 295,440 L240,530 Z"
                  fill="#111625"
                  stroke="#1e293b"
                  strokeWidth="3.5"
                />

                {/* Red Web panels on fingerbacks and knuckles */}
                {/* Index finger red cap */}
                <path d="M142,190 L145,115 C148,95 168,95 172,115 L175,190 Z" fill="#dc2626" stroke="#991b1b" strokeWidth="1.5" />
                {/* Middle finger red cap */}
                <path d="M182,190 L188,110 C190,90 210,90 214,110 L216,190 Z" fill="#dc2626" stroke="#991b1b" strokeWidth="1.5" />
                {/* Ring finger red cap */}
                <path d="M222,200 L228,125 C230,105 250,105 253,125 L255,200 Z" fill="#dc2626" stroke="#991b1b" strokeWidth="1.5" />
                {/* Pinky finger red cap */}
                <path d="M260,210 L264,160 C266,145 282,145 284,160 L283,215 Z" fill="#dc2626" stroke="#991b1b" strokeWidth="1.5" />

                {/* Forearm large Red sleeve shield */}
                <path
                  d="M130,420 L280,440 L260,535 L120,530 Z"
                  fill="#dc2626"
                  stroke="#991b1b"
                  strokeWidth="2.5"
                />

                {/* Wrist straps (Reinforced nylon support) */}
                <rect x="125" y="445" width="145" height="30" rx="4" fill="#090d16" stroke="#1f2937" strokeWidth="2" />
                <line x1="130" y1="460" x2="265" y2="460" stroke="#374151" strokeWidth="3" strokeDasharray="5,5" />

                {/* Hand Web patterns */}
                <g stroke="#111827" strokeWidth="1.2" opacity="0.75" fill="none">
                  {/* Finger joint lines */}
                  <line x1="158" y1="125" x2="158" y2="180" />
                  <line x1="201" y1="120" x2="201" y2="180" />
                  <line x1="241" y1="135" x2="241" y2="190" />
                  {/* Web curves on forearm */}
                  <path d="M125,475 C180,490 220,490 265,475" />
                  <path d="M122,505 C180,520 220,520 255,505" />
                </g>

                {/* Realistic Wrist Web Shooter Plate */}
                <g style={{ transform: "translate(195px, 460px)" }}>
                  {/* Base plate */}
                  <rect x="-30" y="-12" width="60" height="24" rx="6" fill="#1f2937" stroke="#4b5563" strokeWidth="2" />
                  {/* Status glass bulb (Green glowing indicator) */}
                  <circle cx="-16" cy="0" r="3" fill="#10b981" />
                  <circle cx="-16" cy="0" r="1.5" fill="#a7f3d0" />
                  {/* Pressure Dial */}
                  <circle cx="16" cy="0" r="4" fill="#374151" stroke="#9ca3af" strokeWidth="1" />
                  <line x1="16" y1="0" x2="19" y2="-2" stroke="#ef4444" strokeWidth="1.5" />
                  {/* Central solid brass pneumatic nozzle */}
                  <rect x="-6" y="-16" width="12" height="10" rx="2" fill="#d97706" stroke="#b45309" strokeWidth="1.5" />
                  <circle cx="0" cy="-12" r="2.5" fill="#111" />
                </g>

                {/* Gecko grip dots on fingers */}
                <g fill="#ef4444" opacity="0.6">
                  <circle cx="158" cy="115" r="1.5" />
                  <circle cx="201" cy="110" r="1.5" />
                  <circle cx="241" cy="125" r="1.5" />
                </g>
              </g>
            </svg>
          )}

          {/* Interactive hotspot buttons pinned inside Card */}
          {hotspots.map((spot) => (
            <button
              key={spot.id}
              onClick={() => selectHotspot(spot.id)}
              className="absolute z-10 w-8 h-8 flex items-center justify-center bg-black/85 border-2 border-red-500 rounded-full cursor-pointer hover:scale-110 transition-transform shadow-[0_0_15px_rgba(239,68,68,0.5)] group/btn"
              style={{
                left: `${spot.x}%`,
                top: `${spot.y}%`,
                transform: "translate(-50%, -50%) translateZ(40px)",
              }}
            >
              <span className={`absolute inset-0 bg-red-600 rounded-full animate-ping opacity-35 ${activeHotspot === spot.id ? 'duration-1000' : 'duration-3000'}`} />
              <spot.icon className={`w-3.5 h-3.5 text-red-400 group-hover/btn:text-white transition-colors ${activeHotspot === spot.id ? 'text-white scale-110' : ''}`} />
            </button>
          ))}
        </div>
      </div>

      {/* Dynamic Specifications Detail panel (Right) */}
      <div className="w-full lg:w-1/2 space-y-8 text-white">
        <div className="space-y-3">
          <p className="text-red-500 font-mono text-xs tracking-widest uppercase">
            {viewMode === "full" ? "Integrated Weaponry & Gear" : "Workshop Craftsmanship Specs"}
          </p>
          <h2 className="text-4xl font-bold font-sans tracking-tight uppercase">
            {viewMode === "full" ? "THE STARK-PARKER NANO SUIT" : "PARKER'S WORKSHOP HAND GLOVE"}
          </h2>
          <p className="text-gray-400 text-sm max-w-lg leading-relaxed font-sans">
            {viewMode === "full" 
              ? "Crafted anonymously using residual Stark nanotech fabricators, this Brand New Day suit integrates state-of-the-art physics absorption polymers with reactive HUD matrices."
              : "Handmade by Peter Parker in his apartment using durable heavy-stitch athletic leather, dynamic Kevlar polymers, and recycled camera lenses to capture New York's crime waves."}
          </p>
        </div>

        {/* Specifications HUD list */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {hotspots.map((spot) => (
            <div
              key={spot.id}
              onClick={() => selectHotspot(spot.id)}
              className={`p-4 border rounded-xl cursor-pointer transition-all duration-300 backdrop-blur-md ${
                activeHotspot === spot.id
                  ? "bg-white/10 border-white/30 shadow-[0_4px_25px_rgba(255,255,255,0.1)]"
                  : "bg-white/5 border-white/10 hover:border-white/20"
              }`}
            >
              <div className="flex items-center gap-3 mb-1.5">
                <spot.icon className={`w-4 h-4 ${activeHotspot === spot.id ? 'text-red-500 animate-pulse' : 'text-gray-400'}`} />
                <h3 className="text-sm font-semibold tracking-wide">{spot.title}</h3>
              </div>
              <p className="text-xs text-gray-400 leading-normal">{spot.desc}</p>
            </div>
          ))}
        </div>

        {/* Active Hotspot Deep-Dive specs block with Frosted Glass styling */}
        <div className="p-6 bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl space-y-3 animate-fade-in shadow-2xl shadow-black/40">
          <div className="flex items-center gap-2 text-red-500 text-xs font-mono uppercase tracking-widest">
            <span className="w-1.5 h-1.5 bg-red-600 rounded-full animate-ping" />
            System Diagnostic
          </div>
          <h4 className="text-lg font-bold tracking-tight text-white font-sans">
            {activeData.title} Tech Specifications
          </h4>
          <p className="text-sm text-gray-300 leading-relaxed font-sans">
            {activeData.detail}
          </p>
        </div>
      </div>
    </section>
  );
}

