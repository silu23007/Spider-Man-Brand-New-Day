/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";

export default function SpiderSenseCursor() {
  const [position, setPosition] = useState({ x: -100, y: -100 });
  const [hoveredEl, setHoveredEl] = useState<DOMRect | null>(null);
  const [clicked, setClicked] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
      if (!isVisible) setIsVisible(true);

      // Look for hovered buttons or links
      const target = e.target as HTMLElement;
      const interactive = target.closest("a, button, [role='button'], input, select");
      if (interactive) {
        setHoveredEl(interactive.getBoundingClientRect());
      } else {
        setHoveredEl(null);
      }
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    const handleMouseDown = () => {
      setClicked(true);
      setTimeout(() => setClicked(false), 250);
    };

    window.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseleave", handleMouseLeave);
    window.addEventListener("mousedown", handleMouseDown);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
      window.removeEventListener("mousedown", handleMouseDown);
    };
  }, [isVisible]);

  // Connect cursor to target element corners on canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let frameId: number;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);

    const drawWebSnaps = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (hoveredEl && isVisible) {
        ctx.save();
        ctx.strokeStyle = "rgba(239, 68, 68, 0.4)";
        ctx.lineWidth = 1.0;
        ctx.shadowBlur = 4;
        ctx.shadowColor = "rgba(239, 68, 68, 0.6)";

        // Corners of the bounding rectangle
        const corners = [
          { x: hoveredEl.left, y: hoveredEl.top },
          { x: hoveredEl.right, y: hoveredEl.top },
          { x: hoveredEl.right, y: hoveredEl.bottom },
          { x: hoveredEl.left, y: hoveredEl.bottom },
        ];

        // Draw web threads linking cursor center to corners of element
        corners.forEach((corner) => {
          ctx.beginPath();
          ctx.moveTo(position.x, position.y);
          // Slightly curve towards the center of target
          const cx = (position.x + corner.x) / 2;
          const cy = (position.y + corner.y) / 2 + 10; // gravity sag
          ctx.quadraticCurveTo(cx, cy, corner.x, corner.y);
          ctx.stroke();
        });

        ctx.restore();
      }

      frameId = requestAnimationFrame(drawWebSnaps);
    };

    drawWebSnaps();

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener("resize", handleResize);
    };
  }, [hoveredEl, position, isVisible]);

  if (!isVisible) return null;

  return (
    <>
      {/* Connector canvas */}
      <canvas
        ref={canvasRef}
        className="fixed inset-0 w-full h-full pointer-events-none z-40 hidden sm:block"
      />

      {/* Spider Sense circle cursor */}
      <div
        className="fixed top-0 left-0 pointer-events-none z-50 hidden sm:block"
        style={{
          transform: `translate(${position.x}px, ${position.y}px)`,
          marginLeft: "-16px",
          marginTop: "-16px",
          width: 32,
          height: 32,
        }}
      >
        {/* Halo circle */}
        <motion.div
          animate={{
            scale: clicked ? 1.6 : hoveredEl ? 1.25 : 1,
            backgroundColor: hoveredEl 
              ? "rgba(220, 38, 38, 0.2)" 
              : "rgba(220, 38, 38, 0.1)",
            borderColor: hoveredEl ? "rgba(239, 68, 68, 0.95)" : "rgba(239, 68, 68, 0.5)",
          }}
          transition={{ type: "spring", stiffness: 350, damping: 25 }}
          className="w-full h-full border border-red-500 rounded-full flex items-center justify-center relative"
        >
          {/* Animated red glow center */}
          <div className="w-2.5 h-2.5 bg-red-600 rounded-full shadow-[0_0_10px_#dc2626] animate-pulse" />

          {/* Spider sense threat indicators (lightning style pulses) */}
          {hoveredEl && (
            <div className="absolute inset-0">
              {[0, 1, 2].map((i) => (
                <span
                  key={i}
                  className="absolute inset-[-8px] border-t border-red-500 rounded-full animate-ping opacity-75"
                  style={{
                    animationDelay: `${i * 0.12}s`,
                    animationDuration: "1s",
                  }}
                />
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </>
  );
}
