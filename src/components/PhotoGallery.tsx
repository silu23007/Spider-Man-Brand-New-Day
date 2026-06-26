/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from "react";
import { soundEngine } from "./SoundEngine";
import { GalleryImage } from "../types";
import { X, ZoomIn, Eye, Image } from "lucide-react";

export default function PhotoGallery() {
  const [activeImage, setActiveImage] = useState<GalleryImage | null>(null);

  const images: GalleryImage[] = [
    {
      id: "teaser-1",
      title: "Solitary Vigilante",
      category: "Teaser Poster",
      color: "from-blue-900 to-slate-900",
      imageUrl: "https://images.unsplash.com/photo-1604200213928-ba3cf4fc8436?auto=format&fit=crop&w=1200&q=80",
    },
    {
      id: "teaser-2",
      title: "Tactical Red Suit",
      category: "Suit Close-up",
      color: "from-stone-900 to-red-950",
      imageUrl: "https://images.unsplash.com/photo-1635805737707-575885ab0820?auto=format&fit=crop&w=1200&q=80",
    },
    {
      id: "teaser-3",
      title: "Rainy Swing Action",
      category: "Cinematic Still",
      color: "from-slate-800 to-blue-900",
      imageUrl: "https://images.unsplash.com/photo-1614975058789-41316d0e2e9c?auto=format&fit=crop&w=1200&q=80",
    },
    {
      id: "teaser-4",
      title: "Tactical Hologram",
      category: "HUD Diagnostic",
      color: "from-red-950 to-neutral-900",
      imageUrl: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1200&q=80",
    },
    {
      id: "teaser-5",
      title: "Manhattan Sunset Skyline",
      category: "Environment Concept",
      color: "from-amber-950 to-stone-900",
      imageUrl: "https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?auto=format&fit=crop&w=1200&q=80",
    },
    {
      id: "teaser-6",
      title: "Peter Parker's Gear",
      category: "Character Concept",
      color: "from-neutral-900 to-indigo-950",
      imageUrl: "https://images.unsplash.com/photo-1495707902641-75cac588d2e9?auto=format&fit=crop&w=1200&q=80",
    },
  ];

  const handleOpen = (img: GalleryImage) => {
    setActiveImage(img);
    soundEngine.playClick();
  };

  const handleClose = () => {
    setActiveImage(null);
    soundEngine.playClick();
  };

  return (
    <section className="relative py-24 px-6 max-w-7xl mx-auto overflow-hidden">
      <div className="space-y-3 mb-16 text-center">
        <p className="text-red-500 font-mono text-xs tracking-widest uppercase">
          Teasers & Artwork
        </p>
        <h2 className="text-4xl font-bold tracking-tight text-white font-sans uppercase">
          Visual Gallery
        </h2>
        <p className="text-gray-400 text-sm max-w-md mx-auto leading-normal font-sans">
          Click to inspect unmasked production art, environmental snapshots, and official teaser conceptualizations.
        </p>
      </div>

      {/* Masonry-Grid Layout */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {images.map((img) => (
          <div
            key={img.id}
            onClick={() => handleOpen(img)}
            className="group relative h-72 rounded-2xl overflow-hidden border border-white/5 bg-gradient-to-br cursor-pointer hover:border-red-500/30 transition-all duration-500 shadow-xl"
          >
            {img.imageUrl ? (
              <img
                src={img.imageUrl}
                alt={img.title}
                referrerPolicy="no-referrer"
                className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:opacity-85 group-hover:scale-105 transition-all duration-700 ease-out"
              />
            ) : (
              <div className={`absolute inset-0 bg-gradient-to-tr ${img.color} opacity-80 group-hover:scale-105 duration-700 ease-out`} />
            )}

            {/* Glowing pattern details inside card */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:16px_16px] pointer-events-none" />

            {/* Simulated cinematic frame sketch with Frosted Glass styling */}
            <div className="absolute inset-4 border border-white/10 rounded-xl flex flex-col justify-between p-4 bg-white/5 backdrop-blur-sm group-hover:border-red-500/30 transition-colors">
              <span className="text-[10px] font-mono tracking-widest uppercase text-red-500 flex items-center gap-2">
                <Image className="w-3.5 h-3.5" />
                {img.category}
              </span>

              <div className="space-y-1.5">
                <h3 className="text-lg font-bold tracking-tight text-white font-sans">
                  {img.title}
                </h3>
                <span className="inline-flex items-center gap-1 text-[10px] font-mono text-gray-400 group-hover:text-red-400 transition-colors">
                  <ZoomIn className="w-3 h-3" /> Click to enlarge
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Dynamic full-screen visual Lightbox */}
      {activeImage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 p-6 animate-fade-in select-none">
          {/* Ambient light ring behind modal */}
          <div className="absolute w-96 h-96 bg-red-600/15 rounded-full blur-3xl" />

          <div className="relative w-full max-w-4xl max-h-[80vh] border border-white/10 rounded-2xl overflow-hidden shadow-[0_24px_50px_rgba(0,0,0,0.8)] bg-black/85 backdrop-blur-md flex flex-col">
            {/* Immersive card display */}
            <div className="w-full h-96 relative flex items-center justify-center p-8 overflow-hidden bg-black">
              {activeImage.imageUrl ? (
                <img
                  src={activeImage.imageUrl}
                  alt={activeImage.title}
                  referrerPolicy="no-referrer"
                  className="absolute inset-0 w-full h-full object-cover opacity-75"
                />
              ) : (
                <div className={`absolute inset-0 bg-gradient-to-br ${activeImage.color} opacity-40`} />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/50" />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />
              
              {/* Dynamic visual placeholder detail */}
              <div className="text-center space-y-3 z-10 max-w-md bg-black/60 p-6 rounded-2xl border border-white/10 backdrop-blur-md">
                <div className="w-12 h-12 border border-white/20 rounded-full flex items-center justify-center mx-auto bg-black/80 shadow-2xl">
                  <Eye className="w-5 h-5 text-red-500 animate-pulse" />
                </div>
                <h4 className="text-xl font-bold font-sans text-white">{activeImage.title}</h4>
                <p className="text-xs text-gray-400 font-mono tracking-widest uppercase">{activeImage.category}</p>
              </div>

              {/* Close Button */}
              <button
                onClick={handleClose}
                className="absolute top-6 right-6 p-2 bg-black/60 hover:bg-black border border-white/10 rounded-full text-white cursor-pointer hover:scale-105 transition-all"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Metadata Footer panel */}
            <div className="p-6 bg-[#090b11] border-t border-white/5 space-y-2">
              <span className="text-[10px] font-mono tracking-widest text-red-500 uppercase">
                PRODUCTION_FILE: {activeImage.id.toUpperCase()}_STAGE_RENDER
              </span>
              <p className="text-xs text-gray-400 font-sans leading-relaxed">
                This conceptual artwork captures the cinematic color keys designed for Marvel Studios' Spider-Man: Brand New Day. It establishes the heavy shadows, chromatic aberration, and neon red color grading designed to ground Peter Parker's lonely vigilante era.
              </p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
