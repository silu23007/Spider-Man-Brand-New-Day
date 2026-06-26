/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";

interface WebInstance {
  id: string;
  type: "corner-tl" | "corner-tr" | "corner-bl" | "corner-br" | "center-splat";
  x: number; // percentage left
  y: number; // percentage top
  scale: number;
  rotation: number;
  opacity: number;
}

export default function ScrollSpiderWebs() {
  const [webs, setWebs] = useState<WebInstance[]>([]);
  const [lastScrollTime, setLastScrollTime] = useState<number>(0);

  useEffect(() => {
    let lastY = window.scrollY;

    const handleScroll = () => {
      const currentY = window.scrollY;
      const diff = Math.abs(currentY - lastY);
      if (diff < 15) return; // ignore tiny tremors
      lastY = currentY;

      const now = Date.now();
      // Rate limit spawns so it stays extremely subtle and responsive
      if (now - lastScrollTime < 1800) return;

      // Random chance to spawn a web strand on scroll
      if (Math.random() < 0.2) {
        setLastScrollTime(now);

        const types: Array<WebInstance["type"]> = [
          "corner-tl",
          "corner-tr",
          "corner-bl",
          "corner-br",
          "center-splat",
        ];
        const chosenType = types[Math.floor(Math.random() * types.length)];

        const newWeb: WebInstance = {
          id: `web-${now}-${Math.random()}`,
          type: chosenType,
          // Random coordinates within suitable viewport zones
          x: Math.random() * 60 + 20, // 20% to 80%
          y: Math.random() * 60 + 20, // 20% to 80%
          scale: Math.random() * 0.4 + 0.6, // 0.6 to 1.0
          rotation: Math.random() * 360,
          opacity: Math.random() * 0.25 + 0.15, // 0.15 to 0.4
        };

        setWebs((prev) => {
          // Keep max 3 webs on screen to prevent overlapping and heavy layout tree
          const filtered = prev.filter((w) => now - parseInt(w.id.split("-")[1]) < 3000);
          return [...filtered.slice(-2), newWeb];
        });

        // Automatically clean up this web after 2.8 seconds
        setTimeout(() => {
          setWebs((prev) => prev.filter((w) => w.id !== newWeb.id));
        }, 2800);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollTime]);

  return (
    <div className="fixed inset-0 z-40 pointer-events-none select-none overflow-hidden">
      <AnimatePresence>
        {webs.map((web) => {
          let positionStyles = {};
          let svgContent = null;

          // Corner Webs or Splats SVG paths
          if (web.type === "corner-tl") {
            positionStyles = { top: 0, left: 0 };
            svgContent = (
              <svg viewBox="0 0 100 100" className="w-48 h-48 sm:w-64 sm:h-64 text-white/10 stroke-current fill-none">
                <path d="M0,0 Q30,5 50,0 M0,0 Q5,30 0,50 M0,0 Q20,20 40,40" strokeWidth="1" />
                <path d="M0,15 Q15,15 15,0" strokeWidth="0.8" />
                <path d="M0,30 Q25,25 30,0" strokeWidth="0.8" />
                <path d="M0,45 Q35,35 45,0" strokeWidth="0.8" />
                <path d="M0,60 Q45,45 60,0" strokeWidth="0.8" />
                <path d="M0,75 Q55,55 75,0" strokeWidth="0.8" />
                <line x1="0" y1="0" x2="30" y2="70" strokeWidth="0.6" />
                <line x1="0" y1="0" x2="70" y2="30" strokeWidth="0.6" />
              </svg>
            );
          } else if (web.type === "corner-tr") {
            positionStyles = { top: 0, right: 0 };
            svgContent = (
              <svg viewBox="0 0 100 100" className="w-48 h-48 sm:w-64 sm:h-64 text-white/10 stroke-current fill-none">
                <path d="M100,0 Q70,5 50,0 M100,0 Q95,30 100,50 M100,0 Q80,20 60,40" strokeWidth="1" />
                <path d="M100,15 Q85,15 85,0" strokeWidth="0.8" />
                <path d="M100,30 Q75,25 70,0" strokeWidth="0.8" />
                <path d="M100,45 Q65,35 55,0" strokeWidth="0.8" />
                <path d="M100,60 Q55,45 40,0" strokeWidth="0.8" />
                <path d="M100,75 Q45,55 25,0" strokeWidth="0.8" />
                <line x1="100" y1="0" x2="70" y2="70" strokeWidth="0.6" />
                <line x1="100" y1="0" x2="30" y2="30" strokeWidth="0.6" />
              </svg>
            );
          } else if (web.type === "corner-bl") {
            positionStyles = { bottom: 0, left: 0 };
            svgContent = (
              <svg viewBox="0 0 100 100" className="w-48 h-48 sm:w-64 sm:h-64 text-white/10 stroke-current fill-none">
                <path d="M0,100 Q30,95 50,100 M0,100 Q5,70 0,50 M0,100 Q20,80 40,60" strokeWidth="1" />
                <path d="M0,85 Q15,85 15,100" strokeWidth="0.8" />
                <path d="M0,70 Q25,75 30,100" strokeWidth="0.8" />
                <path d="M0,55 Q35,65 45,100" strokeWidth="0.8" />
                <path d="M0,40 Q45,55 60,100" strokeWidth="0.8" />
                <path d="M0,25 Q55,45 75,100" strokeWidth="0.8" />
                <line x1="0" y1="100" x2="30" y2="30" strokeWidth="0.6" />
                <line x1="0" y1="100" x2="70" y2="70" strokeWidth="0.6" />
              </svg>
            );
          } else if (web.type === "corner-br") {
            positionStyles = { bottom: 0, right: 0 };
            svgContent = (
              <svg viewBox="0 0 100 100" className="w-48 h-48 sm:w-64 sm:h-64 text-white/10 stroke-current fill-none">
                <path d="M100,100 Q70,95 50,100 M100,100 Q95,70 100,50 M100,100 Q80,80 60,60" strokeWidth="1" />
                <path d="M100,85 Q85,85 85,100" strokeWidth="0.8" />
                <path d="M100,70 Q75,75 70,100" strokeWidth="0.8" />
                <path d="M100,55 Q65,65 55,100" strokeWidth="0.8" />
                <path d="M100,40 Q55,55 40,100" strokeWidth="0.8" />
                <path d="M100,25 Q45,45 25,100" strokeWidth="0.8" />
                <line x1="100" y1="100" x2="70" y2="30" strokeWidth="0.6" />
                <line x1="100" y1="100" x2="30" y2="70" strokeWidth="0.6" />
              </svg>
            );
          } else {
            // center-splat
            positionStyles = {
              top: `${web.y}%`,
              left: `${web.x}%`,
              transform: "translate(-50%, -50%)",
            };
            svgContent = (
              <svg viewBox="0 0 100 100" className="w-32 h-32 sm:w-48 sm:h-48 text-white/10 stroke-current fill-none">
                {/* Core anchor spokes */}
                <line x1="50" y1="50" x2="50" y2="10" strokeWidth="1" />
                <line x1="50" y1="50" x2="50" y2="90" strokeWidth="1" />
                <line x1="50" y1="50" x2="10" y2="50" strokeWidth="1" />
                <line x1="50" y1="50" x2="90" y2="50" strokeWidth="1" />
                <line x1="50" y1="50" x2="20" y2="20" strokeWidth="0.8" />
                <line x1="50" y1="50" x2="80" y2="80" strokeWidth="0.8" />
                <line x1="50" y1="50" x2="80" y2="20" strokeWidth="0.8" />
                <line x1="50" y1="50" x2="20" y2="80" strokeWidth="0.8" />

                {/* Inner web concentric polygon layers */}
                <polygon points="50,42 56,44 58,50 56,56 50,58 44,56 42,50 44,44" strokeWidth="0.6" />
                <polygon points="50,34 61,37 66,50 61,63 50,66 39,63 34,50 39,37" strokeWidth="0.6" />
                <polygon points="50,24 67,28 76,50 67,72 50,76 33,72 24,50 33,28" strokeWidth="0.6" />
                <polygon points="50,14 73,19 86,50 73,81 50,86 27,81 14,50 27,19" strokeWidth="0.6" />
              </svg>
            );
          }

          return (
            <motion.div
              key={web.id}
              className="absolute"
              style={positionStyles}
              initial={{ opacity: 0, scale: web.scale * 0.8, rotate: web.rotation }}
              animate={{ opacity: web.opacity, scale: web.scale }}
              exit={{ opacity: 0, scale: web.scale * 1.1, transition: { duration: 0.5 } }}
              transition={{ type: "spring", stiffness: 80, damping: 15 }}
            >
              {svgContent}
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
