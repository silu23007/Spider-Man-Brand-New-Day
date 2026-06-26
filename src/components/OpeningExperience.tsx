/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import * as React from "react";
import { useState, useEffect, useRef } from "react";
import { soundEngine } from "./SoundEngine";
import { Play, Volume2, Shield, Activity, Cpu, Zap, Compass, RefreshCw, Key, Radio, Terminal, Fingerprint } from "lucide-react";

interface OpeningExperienceProps {
  onComplete: () => void;
  onMusicToggle: () => void;
  isMuted: boolean;
}

interface NanoParticle {
  id: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  originalX: number;
  originalY: number;
  isDragging?: boolean;
}

interface CyberSpark {
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  size: number;
  alpha: number;
  decay: number;
}

export default function OpeningExperience({ onComplete, onMusicToggle, isMuted }: OpeningExperienceProps) {
  const [step, setStep] = useState<"click-to-start" | "weaving" | "swinging" | "done">("click-to-start");
  const [progress, setProgress] = useState(0);
  const [spiderPos, setSpiderPos] = useState({ x: -50, y: -50 });
  const [webLines, setWebLines] = useState<{ x1: number; y1: number; x2: number; y2: number }[]>([]);
  
  // Interactive Console Decryption Level
  const [decryptionProgress, setDecryptionProgress] = useState(0);
  const [scanning, setScanning] = useState(false);
  const [isFullyUnlocked, setIsFullyUnlocked] = useState(false);
  const [frequencyValue, setFrequencyValue] = useState(440);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const interactiveCanvasRef = useRef<HTMLCanvasElement>(null);
  const shakeRef = useRef<HTMLDivElement>(null);

  // Stark HUD physics nodes & sparks
  const particlesRef = useRef<NanoParticle[]>([]);
  const sparksRef = useRef<CyberSpark[]>([]);
  const dragParticleRef = useRef<NanoParticle | null>(null);
  const lastMousePosRef = useRef<{ x: number; y: number } | null>(null);
  const cursorTrailRef = useRef<{ x: number; y: number; time: number }[]>([]);

  // Initialize interactive Stark HUD Console layout
  useEffect(() => {
    if (step !== "click-to-start") return;

    const canvas = interactiveCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initializeSystemCore(canvas.width, canvas.height);
    };

    const initializeSystemCore = (width: number, height: number) => {
      // Setup floating interactive nanotech nodes that orbit the scanner
      const cx = width / 2;
      const cy = height / 2;
      const nodes: NanoParticle[] = [];

      // Create orbital rings of floating nanoparticles
      const ringRadii = [180, 240, 310];
      const particlesPerRing = [8, 12, 16];
      const colors = ["rgba(239, 68, 68, 0.7)", "rgba(14, 165, 233, 0.7)", "rgba(255, 255, 255, 0.6)"];

      ringRadii.forEach((radius, rIdx) => {
        const count = particlesPerRing[rIdx];
        const ringColor = colors[rIdx % colors.length];

        for (let i = 0; i < count; i++) {
          const angle = (i / count) * Math.PI * 2;
          const nx = cx + Math.cos(angle) * radius;
          const ny = cy + Math.sin(angle) * radius;

          nodes.push({
            id: `nano-${rIdx}-${i}`,
            x: nx,
            y: ny,
            vx: 0,
            vy: 0,
            size: Math.random() * 4 + 4,
            color: ringColor,
            originalX: nx,
            originalY: ny,
          });
        }
      });

      particlesRef.current = nodes;
      sparksRef.current = [];
    };

    window.addEventListener("resize", resizeCanvas);
    resizeCanvas();

    // Console rendering & interactive loop
    let animationId: number;
    let time = 0;

    const updateConsole = () => {
      time += 0.015;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const cx = canvas.width / 2;
      const cy = canvas.height / 2;
      const particles = particlesRef.current;
      const sparks = sparksRef.current;

      // 1. Draw Rotating Quantum Stark HUD Rings
      ctx.save();
      ctx.lineWidth = 1;
      
      // Outer Scanner frequency orbit
      ctx.strokeStyle = "rgba(239, 68, 68, 0.08)";
      ctx.beginPath();
      ctx.arc(cx, cy, 140, 0, Math.PI * 2);
      ctx.stroke();

      // Outer glowing tech ring 1
      ctx.strokeStyle = "rgba(14, 165, 233, 0.15)";
      ctx.beginPath();
      ctx.arc(cx, cy, 200, time * 0.2, time * 0.2 + Math.PI * 1.5);
      ctx.stroke();

      // Outer glowing tech ring 2 (Reverse direction)
      ctx.strokeStyle = "rgba(239, 68, 68, 0.12)";
      ctx.beginPath();
      ctx.arc(cx, cy, 270, -time * 0.1, -time * 0.1 + Math.PI * 0.8);
      ctx.stroke();

      // Draw concentric holographic hash ticks
      ctx.strokeStyle = "rgba(255, 255, 255, 0.04)";
      ctx.beginPath();
      ctx.arc(cx, cy, 340, 0, Math.PI * 2);
      ctx.stroke();

      for (let angle = 0; angle < Math.PI * 2; angle += Math.PI / 18) {
        const ax = cx + Math.cos(angle + time * 0.05) * 340;
        const ay = cy + Math.sin(angle + time * 0.05) * 340;
        const bx = cx + Math.cos(angle + time * 0.05) * 350;
        const by = cy + Math.sin(angle + time * 0.05) * 350;
        ctx.beginPath();
        ctx.moveTo(ax, ay);
        ctx.lineTo(bx, by);
        ctx.stroke();
      }

      ctx.restore();

      // 2. Physics Integration for NanoParticles
      particles.forEach((p) => {
        if (p.isDragging) return;

        // Apply a gentle orbital gravitational pull towards central biometric core
        const dx = cx - p.x;
        const dy = cy - p.y;
        const dist = Math.hypot(dx, dy);

        // Standard gravity pull + angular force for spinning rotation
        const pullForce = 0.008;
        const spinForce = 0.035;

        // Radial orbit speed adjustments
        const angle = Math.atan2(dy, dx);
        const targetX = cx + Math.cos(angle + 0.003) * dist;
        const targetY = cy + Math.sin(angle + 0.003) * dist;

        p.vx += (targetX - p.x) * pullForce;
        p.vy += (targetY - p.y) * pullForce;

        // Friction dampening
        p.vx *= 0.95;
        p.vy *= 0.95;

        p.x += p.vx;
        p.y += p.vy;
      });

      // 3. Draw Connecting Cybernetic Synapses Lines (if particles are close enough)
      ctx.save();
      ctx.lineWidth = 0.6;
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const pA = particles[i];
          const pB = particles[j];
          const dist = Math.hypot(pB.x - pA.x, pB.y - pA.y);

          if (dist < 100) {
            const alpha = (1.0 - dist / 100) * 0.22;
            ctx.strokeStyle = `rgba(14, 165, 233, ${alpha})`;
            ctx.beginPath();
            ctx.moveTo(pA.x, pA.y);
            ctx.lineTo(pB.x, pB.y);
            ctx.stroke();
          }
        }
      }
      ctx.restore();

      // 4. Draw Floating Interactive Nano Nodes
      particles.forEach((p) => {
        ctx.save();
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.isDragging ? "#ffffff" : p.color;
        ctx.shadowColor = p.isDragging ? "#ffffff" : p.color;
        ctx.shadowBlur = p.isDragging ? 12 : 5;
        ctx.fill();

        // Render mini orbital tech dots
        if (p.isDragging) {
          ctx.strokeStyle = "rgba(255, 255, 255, 0.4)";
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size * 2.2, 0, Math.PI * 2);
          ctx.stroke();
        }
        ctx.restore();
      });

      // 5. Update & Draw Charging Sparks (Biometric Scanner flow)
      for (let i = sparks.length - 1; i >= 0; i--) {
        const s = sparks[i];
        s.x += s.vx;
        s.y += s.vy;
        s.vx *= 0.97;
        s.vy *= 0.97;
        s.alpha -= s.decay;

        if (s.alpha <= 0) {
          sparks.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.globalAlpha = s.alpha;
        ctx.fillStyle = s.color;
        ctx.shadowColor = s.color;
        ctx.shadowBlur = s.size * 2.5;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      // 6. Draw Interactive Laser mouse-slicing sparks
      if (cursorTrailRef.current.length > 1) {
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(cursorTrailRef.current[0].x, cursorTrailRef.current[0].y);
        for (let i = 1; i < cursorTrailRef.current.length; i++) {
          ctx.lineTo(cursorTrailRef.current[i].x, cursorTrailRef.current[i].y);
        }
        ctx.strokeStyle = "rgba(14, 165, 233, 0.7)";
        ctx.lineWidth = 2.5;
        ctx.shadowColor = "#0ea5e9";
        ctx.shadowBlur = 8;
        ctx.stroke();
        ctx.restore();

        const now = Date.now();
        cursorTrailRef.current = cursorTrailRef.current.filter((pt) => now - pt.time < 140);
      }

      animationId = requestAnimationFrame(updateConsole);
    };

    animationId = requestAnimationFrame(updateConsole);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", resizeCanvas);
    };
  }, [step]);

  // Handle active biometric palm charge holding state
  useEffect(() => {
    if (!scanning || isFullyUnlocked) return;

    soundEngine.playHeartbeat();
    const interval = setInterval(() => {
      setDecryptionProgress((prev) => {
        const next = prev + 1.8;

        // Spark generator at random intervals surrounding biometric console
        const canvas = interactiveCanvasRef.current;
        if (canvas) {
          const cx = canvas.width / 2;
          const cy = canvas.height / 2;
          for (let k = 0; k < 6; k++) {
            const angle = Math.random() * Math.PI * 2;
            const dist = 100 + Math.random() * 200;
            const sx = cx + Math.cos(angle) * dist;
            const sy = cy + Math.sin(angle) * dist;

            // Sparks pull inward to scanner core
            const speed = Math.random() * 3 + 2;
            sparksRef.current.push({
              x: sx,
              y: sy,
              vx: -Math.cos(angle) * speed,
              vy: -Math.sin(angle) * speed,
              color: Math.random() > 0.45 ? "#0ea5e9" : "#ef4444",
              size: Math.random() * 3 + 1.5,
              alpha: 0.9,
              decay: Math.random() * 0.02 + 0.012,
            });
          }
        }

        if (next >= 100) {
          clearInterval(interval);
          setIsFullyUnlocked(true);
          soundEngine.playThunder();
          // Auto transition to cinematic web compilation stage
          setTimeout(() => {
            startWebCompile();
          }, 800);
          return 100;
        }

        setFrequencyValue(Math.floor(440 + next * 6));
        return next;
      });
    }, 45);

    return () => clearInterval(interval);
  }, [scanning, isFullyUnlocked]);

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = interactiveCanvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;

    lastMousePosRef.current = { x: mx, y: my };
    cursorTrailRef.current = [{ x: mx, y: my, time: Date.now() }];

    // Interactive node dragging selection check
    let nearestNode: NanoParticle | null = null;
    let minDist = 35; // grab radius margin

    particlesRef.current.forEach((node) => {
      const d = Math.hypot(node.x - mx, node.y - my);
      if (d < minDist) {
        minDist = d;
        nearestNode = node;
      }
    });

    if (nearestNode) {
      soundEngine.playClick();
      dragParticleRef.current = nearestNode;
      (nearestNode as NanoParticle).isDragging = true;
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = interactiveCanvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;

    cursorTrailRef.current.push({ x: mx, y: my, time: Date.now() });

    if (dragParticleRef.current) {
      dragParticleRef.current.x = mx;
      dragParticleRef.current.y = my;
      dragParticleRef.current.vx = 0;
      dragParticleRef.current.vy = 0;

      // Spark trail during node dragging
      if (Math.random() > 0.4) {
        sparksRef.current.push({
          x: mx,
          y: my,
          vx: (Math.random() - 0.5) * 5,
          vy: (Math.random() - 0.5) * 5,
          color: dragParticleRef.current.color,
          size: Math.random() * 2 + 1,
          alpha: 1.0,
          decay: 0.04,
        });
      }
    }

    lastMousePosRef.current = { x: mx, y: my };
  };

  const handleMouseUp = () => {
    if (dragParticleRef.current) {
      soundEngine.playHover();
      
      // Give a physics velocity push on drag release
      if (lastMousePosRef.current && cursorTrailRef.current.length > 2) {
        const trail = cursorTrailRef.current;
        const lastPt = trail[trail.length - 1];
        const prevPt = trail[trail.length - 3];
        dragParticleRef.current.vx = (lastPt.x - prevPt.x) * 0.35;
        dragParticleRef.current.vy = (lastPt.y - prevPt.y) * 0.35;
      }

      dragParticleRef.current.isDragging = false;
      dragParticleRef.current = null;
    }
    lastMousePosRef.current = null;
  };

  const startWebCompile = () => {
    soundEngine.playClick();
    setStep("weaving");
  };

  // Animate Spidey-OS Weaving core
  useEffect(() => {
    if (step !== "weaving") return;

    setTimeout(() => {
      soundEngine.playThunder();
    }, 500);

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setStep("swinging");
          return 100;
        }

        const angle = (prev / 100) * Math.PI * 10;
        const radius = 100 + (prev / 100) * 300;
        const width = window.innerWidth;
        const height = window.innerHeight;
        const centerX = width / 2;
        const centerY = height / 2;

        const nextX = centerX + Math.cos(angle) * radius;
        const nextY = centerY + Math.sin(angle) * radius;

        setSpiderPos({ x: nextX, y: nextY });

        if (Math.random() > 0.6) {
          soundEngine.playHover();
          setWebLines((lines) => [
            ...lines,
            { x1: centerX, y1: centerY, x2: nextX, y2: nextY },
            lines.length > 0 
              ? { x1: lines[lines.length - 1].x2, y1: lines[lines.length - 1].y2, x2: nextX, y2: nextY }
              : { x1: nextX, y1: nextY, x2: nextX, y2: nextY }
          ]);
        }

        return prev + 1.2;
      });
    }, 30);

    return () => clearInterval(interval);
  }, [step]);

  // Animate cinematic Swing entrance
  useEffect(() => {
    if (step !== "swinging") return;

    soundEngine.playSwing();
    soundEngine.playWebShoot();

    let frame = 0;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    let spideyScale = 0.1;
    let spideyX = canvas.width / 2;
    let spideyY = canvas.height * 1.2;

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (frame < 10 || (frame > 25 && frame < 30)) {
        ctx.fillStyle = "rgba(255, 255, 255, 0.95)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        if (frame === 1 || frame === 26) {
          soundEngine.playThunder();
        }
      } else {
        ctx.fillStyle = "rgba(2, 4, 12, 1)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }

      ctx.strokeStyle = "rgba(255, 255, 255, 0.4)";
      ctx.lineWidth = 2;
      const progressTear = frame / 50;
      webLines.forEach((line) => {
        const dx1 = (line.x1 - canvas.width / 2) * progressTear * 1.5;
        const dy1 = (line.y1 - canvas.height / 2) * progressTear * 1.5;
        const dx2 = (line.x2 - canvas.width / 2) * progressTear * 1.5;
        const dy2 = (line.y2 - canvas.height / 2) * progressTear * 1.5;

        ctx.beginPath();
        ctx.moveTo(line.x1 + dx1, line.y1 + dy1);
        ctx.lineTo(line.x2 + dx2, line.y2 + dy2);
        ctx.stroke();
      });

      spideyScale += 0.08;
      spideyY -= 20;
      spideyX += Math.sin(frame * 0.15) * 15;

      ctx.save();
      ctx.translate(spideyX, spideyY);
      ctx.scale(spideyScale, spideyScale);

      ctx.shadowBlur = 40;
      ctx.shadowColor = "rgba(220, 38, 38, 0.9)";

      ctx.fillStyle = "#dc2626";
      ctx.beginPath();
      ctx.arc(0, 0, 80, 0, Math.PI * 2);
      ctx.fill();

      ctx.beginPath();
      ctx.moveTo(-120, 100);
      ctx.lineTo(120, 100);
      ctx.lineTo(80, 40);
      ctx.lineTo(-80, 40);
      ctx.closePath();
      ctx.fill();

      ctx.strokeStyle = "#111827";
      ctx.lineWidth = 3;
      for (let i = 0; i < 8; i++) {
        const angle = (i * Math.PI) / 4;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(Math.cos(angle) * 80, Math.sin(angle) * 80);
        ctx.stroke();
      }

      ctx.fillStyle = "#ffffff";
      ctx.strokeStyle = "#000000";
      ctx.lineWidth = 6;

      ctx.beginPath();
      ctx.moveTo(-45, -10);
      ctx.quadraticCurveTo(-35, -45, -10, -15);
      ctx.quadraticCurveTo(-25, 10, -45, -10);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(45, -10);
      ctx.quadraticCurveTo(35, -45, 10, -15);
      ctx.quadraticCurveTo(25, 10, 45, -10);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      ctx.restore();

      ctx.strokeStyle = "rgba(255, 255, 255, 0.85)";
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(canvas.width / 2 - 200, 0);
      ctx.lineTo(spideyX - 30, spideyY - 20);
      ctx.stroke();

      if (spideyScale > 3 && shakeRef.current) {
        shakeRef.current.style.transform = `translate(${Math.random() * 40 - 20}px, ${Math.random() * 40 - 20}px)`;
      }

      frame++;
      if (spideyScale < 12) {
        requestAnimationFrame(animate);
      } else {
        setTimeout(() => {
          onComplete();
        }, 300);
      }
    };

    requestAnimationFrame(animate);
  }, [step]);

  const triggerDirectBypass = () => {
    soundEngine.setMute(isMuted);
    setStep("weaving");
  };

  return (
    <div 
      ref={shakeRef}
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#010204] text-white overflow-hidden select-none transition-transform duration-75"
    >
      {/* Real-time scanning grid lines overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(18,24,38,0.03)_50%,transparent_50%)] bg-[size:100%_4px] pointer-events-none z-10" />

      {/* Cybernetic HUD layout parameters */}
      <div className="absolute inset-8 border border-white/5 pointer-events-none z-20 flex flex-col justify-between p-4 text-[9px] font-mono text-gray-500 uppercase">
        <div className="flex justify-between">
          <span className="flex items-center gap-1">
            <Radio className="w-3 h-3 text-red-500 animate-pulse" /> CORE_SYNC_441.9Hz
          </span>
          <span>STARK_INDUSTRIES_V9.22</span>
        </div>
        <div className="flex justify-between">
          <span>SECURE_HOLOGRAPHIC_GATEWAY</span>
          <span>OS_BOOT: SECTOR_1.44</span>
        </div>
      </div>

      {/* Futuristic STARK-TECH HUD Interactive Gateway Console */}
      {step === "click-to-start" && (
        <div className="relative w-full h-full flex flex-col items-center justify-between p-6">
          
          {/* Real-time Web Canvas for stretching/cutting */}
          <canvas
            ref={interactiveCanvasRef}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            className="absolute inset-0 w-full h-full z-0 cursor-crosshair"
          />

          {/* Top Stark-Tech Status log */}
          <div className="relative z-20 w-full max-w-7xl flex items-center justify-between border-b border-white/5 pb-4 mt-2">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 border border-red-500 bg-red-600/10 rounded flex items-center justify-center">
                <Cpu className="w-4.5 h-4.5 text-red-500 animate-pulse" />
              </div>
              <div>
                <h3 className="text-xs font-bold tracking-[0.2em] font-sans uppercase">STARK NEURAL DECRYPTION CORE</h3>
                <p className="text-[9px] font-mono text-gray-500 uppercase tracking-widest">
                  BIOMETRIC GATE: <span className={isFullyUnlocked ? "text-green-400 font-bold" : "text-red-500 font-bold animate-pulse"}>{isFullyUnlocked ? "DECRYPTED" : "LOCKED"}</span>
                </p>
              </div>
            </div>

            <div className="hidden sm:flex items-center gap-6 font-mono text-[9px] text-gray-400">
              <div className="flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5 text-sky-400" />
                <span>FREQUENCY: {frequencyValue}Hz</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Terminal className="w-3.5 h-3.5 text-red-500" />
                <span>STARK_WEB_OS // V1.48</span>
              </div>
            </div>
          </div>

          {/* Futuristic Gateway Core Content (Centered Overly) */}
          <div className="relative z-20 text-center max-w-md w-full bg-black/75 border border-white/10 p-8 rounded-3xl backdrop-blur-xl shadow-[0_25px_70px_rgba(0,0,0,0.85)] flex flex-col items-center gap-6 my-auto">
            
            <div className="space-y-2">
              <span className="text-sky-400 font-mono text-[9px] font-bold tracking-[0.35em] uppercase">STARK LABS HUD SYSTEM</span>
              <h1 className="text-3.5xl sm:text-4.5xl font-sans tracking-[0.25em] text-center uppercase font-black bg-gradient-to-r from-white via-gray-200 to-white bg-clip-text text-transparent">
                SPIDER-MAN
              </h1>
              <p className="text-red-500 font-mono text-xs tracking-[0.35em] uppercase font-bold">
                BRAND NEW DAY
              </p>
            </div>

            {/* Futuristic Fingerprint Scanner Button & holding charge */}
            <div className="flex flex-col items-center gap-3 w-full my-1.5">
              <div className="text-[10px] font-mono text-gray-400 uppercase tracking-widest">
                {isFullyUnlocked ? "AUTHENTICATION COMPLETE" : "PLACE HAND OVER CORE TO CHARGE"}
              </div>

              <button
                onMouseDown={() => {
                  soundEngine.playClick();
                  setScanning(true);
                }}
                onMouseUp={() => {
                  setScanning(false);
                  soundEngine.playHover();
                }}
                onMouseLeave={() => setScanning(false)}
                onTouchStart={() => {
                  soundEngine.playClick();
                  setScanning(true);
                }}
                onTouchEnd={() => {
                  setScanning(false);
                  soundEngine.playHover();
                }}
                className={`relative w-24 h-24 rounded-full border-2 flex items-center justify-center transition-all duration-300 cursor-pointer ${
                  scanning 
                    ? "bg-sky-500/15 border-sky-400 scale-105 shadow-[0_0_35px_rgba(14,165,233,0.4)]" 
                    : isFullyUnlocked
                      ? "bg-green-600/10 border-green-500 shadow-[0_0_20px_rgba(34,197,94,0.3)] text-green-400"
                      : "bg-red-600/10 border-red-500 text-red-500 hover:bg-red-500/15"
                }`}
              >
                {/* Fingerprint logo */}
                <Fingerprint className={`w-10 h-10 ${scanning ? "animate-pulse" : ""}`} />

                {/* Circular decryption progress gauge */}
                <svg className="absolute inset-0 w-full h-full -rotate-90 pointer-events-none">
                  <circle
                    cx="48"
                    cy="48"
                    r="45"
                    stroke={scanning ? "rgba(14,165,233,0.3)" : "rgba(239,68,68,0.15)"}
                    strokeWidth="3"
                    fill="transparent"
                  />
                  <circle
                    cx="48"
                    cy="48"
                    r="45"
                    stroke={isFullyUnlocked ? "#22c55e" : "#0ea5e9"}
                    strokeWidth="3.5"
                    fill="transparent"
                    strokeDasharray={282}
                    strokeDashoffset={282 - (282 * decryptionProgress) / 100}
                    className="transition-all duration-75"
                  />
                </svg>
              </button>

              {/* Numerical Decryption Progress Text */}
              <div className="flex items-center gap-1.5 font-mono text-[10px]">
                <span className={isFullyUnlocked ? "text-green-400 font-bold" : "text-gray-400"}>
                  {isFullyUnlocked ? "SECURE BYPASS SECURED" : `DECRYPTING SYNAPSE CORES... ${Math.floor(decryptionProgress)}%`}
                </span>
              </div>
            </div>

            {/* Instruction Readout block */}
            <div className="p-3 bg-neutral-900 border border-white/5 rounded-xl w-full text-center">
              <p className="text-[9px] font-mono leading-relaxed text-gray-500 uppercase tracking-widest">
                ⚡ <span className="text-sky-400">TOUCH OR DRAG FLUID NANOTECH NODES</span> FOR DEEP MATRIX ANALYSIS
                <br />
                ⚡ <span className="text-red-500">HOLD CHARGE BUTTON</span> TO FORCE QUANTUM BYPASS
              </p>
            </div>

            <div className="flex items-center gap-3 w-full">
              <button
                onClick={triggerDirectBypass}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-red-600 hover:bg-red-500 text-white rounded-md text-[10px] font-bold tracking-widest uppercase transition-all duration-300 shadow-[0_0_20px_rgba(220,38,38,0.3)] cursor-pointer hover:scale-[1.03]"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                DIRECT BYPASS & ENTER
              </button>
            </div>

            {/* Dynamic Status Log Footer Ticker */}
            <span className="text-[8px] font-mono text-gray-500 uppercase tracking-widest">
              STARK NEURAL CORE V1.48 • DUAL CODES READY
            </span>

          </div>

          {/* Bottom Stark-Tech Footer Readout */}
          <div className="relative z-20 w-full max-w-7xl flex flex-col sm:flex-row items-center justify-between border-t border-white/5 pt-4 text-gray-500 font-mono text-[8px] tracking-widest uppercase mb-2">
            <span>© 2026 STARK INDUSTRIES • ALL INTEL RIGHTS RESERVED</span>
            <span className="mt-1 sm:mt-0">SECURE SHELL // MULTIVERSE_GATE_OS</span>
          </div>

        </div>
      )}

      {/* Spider-OS Weaving / Spin thread screen */}
      {step === "weaving" && (
        <div className="relative w-full h-full pointer-events-none">
          <svg className="absolute inset-0 w-full h-full">
            <defs>
              <filter id="glow">
                <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                <feMerge>
                  <feMergeNode in="coloredBlur"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
            </defs>

            {webLines.map((line, i) => (
              <line
                key={i}
                x1={line.x1}
                y1={line.y1}
                x2={line.x2}
                y2={line.y2}
                stroke="rgba(14, 165, 233, 0.45)"
                strokeWidth="1.5"
                filter="url(#glow)"
              />
            ))}
          </svg>

          <div
            className="absolute transition-all duration-75 flex items-center justify-center"
            style={{
              left: spiderPos.x - 16,
              top: spiderPos.y - 16,
              width: 32,
              height: 32,
            }}
          >
            <svg viewBox="0 0 32 32" className="w-full h-full text-red-500 fill-current animate-pulse drop-shadow-[0_0_8px_rgba(239,68,68,0.8)]">
              <path d="M16 4c-1 0-2 1-2 2s1 2 2 2 2-1 2-2-1-2-2-2zm0 5c-3 0-5 2-5 5 0 2 1 3 2 4l-3 4-2-1c-1 0-1 1 0 2l3 2c1 0 2-1 2-2l2-3h2l2 3c0 1 1 2 2 2l3-2c1-1 1-2 0-2l-2 1-3-4c1-1 2-2 2-4 0-3-2-5-5-5zm-5 5c0-1.6 1.4-3 3-3s3 1.4 3 3-1.4 3-3 3-3-1.4-3-3z"/>
            </svg>
          </div>

          <div className="absolute bottom-16 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3">
            <p className="text-sky-400 font-mono text-xs tracking-widest uppercase animate-pulse">
              SPINNING WEBS OF INTEGRATED FATE...
            </p>
            <div className="w-64 h-1 bg-white/10 rounded-full overflow-hidden">
              <div 
                className="h-full bg-red-600 transition-all duration-75"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-red-500 font-mono text-xs">{Math.floor(progress)}%</p>
          </div>
        </div>
      )}

      {/* Cinematic Swing Scene View */}
      {step === "swinging" && (
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
      )}

      {/* Skip button option */}
      {step !== "click-to-start" && (
        <button
          onClick={onComplete}
          className="absolute top-8 right-8 z-50 flex items-center gap-2 px-4 py-2 bg-black/40 hover:bg-black/60 border border-white/10 rounded-full text-xs font-mono tracking-widest uppercase transition-all duration-300 hover:scale-105 cursor-pointer"
        >
          Skip Intro
        </button>
      )}
    </div>
  );
}
