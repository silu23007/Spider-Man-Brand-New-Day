/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useRef } from "react";
import { soundEngine } from "./SoundEngine";

interface CinematicBackgroundProps {
  lightningActive: boolean;
  onLightningTriggered: (active: boolean) => void;
  spiderSenseMode: boolean;
  qualityMode: "Performance" | "Balanced" | "Cinematic";
  onTriggerEasterEgg: (id: string, title: string, text: string) => void;
}

export default function CinematicBackground({
  lightningActive,
  onLightningTriggered,
  spiderSenseMode,
  qualityMode,
  onTriggerEasterEgg,
}: CinematicBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Dynamic density variables based on graphics quality setting
    const rainCount = qualityMode === "Performance" ? 30 : qualityMode === "Balanced" ? 120 : 350;
    const cloudCount = qualityMode === "Performance" ? 1 : qualityMode === "Balanced" ? 3 : 5;
    const trafficCount = qualityMode === "Performance" ? 4 : qualityMode === "Balanced" ? 14 : 28;

    // Generate Rain Particles
    const rainParticles: { x: number; y: number; length: number; speed: number; opacity: number }[] = [];
    for (let i = 0; i < rainCount; i++) {
      rainParticles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        length: Math.random() * 20 + 15,
        speed: Math.random() * 15 + 18,
        opacity: Math.random() * 0.4 + 0.15,
      });
    }

    // Interactive custom spark particle system for clicks/explosions
    const sparks: { x: number; y: number; vx: number; vy: number; r: number; color: string; alpha: number }[] = [];
    const triggerSparks = (cx: number, cy: number, color = "#ef4444") => {
      const numSparks = qualityMode === "Performance" ? 15 : 40;
      for (let i = 0; i < numSparks; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 6 + 2;
        sparks.push({
          x: cx,
          y: cy,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - 2, // slight upward float
          r: Math.random() * 3 + 1,
          color,
          alpha: 1,
        });
      }
    };

    // Skyscraper configurations
    const buildings: {
      x: number;
      w: number;
      h: number;
      color: string;
      windows: { x: number; y: number; active: boolean; color: string }[];
    }[] = [];

    const buildingCount = Math.ceil(width / 140) + 2;
    for (let i = 0; i < buildingCount; i++) {
      const w = Math.random() * 80 + 90;
      const h = Math.random() * (height * 0.5) + height * 0.25;
      const x = i * 110 - 50;

      // Window grid inside building
      const windows: { x: number; y: number; active: boolean; color: string }[] = [];
      const cols = Math.floor(w / 14);
      const rows = Math.floor(h / 20);

      for (let r = 1; r < rows - 1; r++) {
        for (let c = 1; c < cols - 1; c++) {
          if (Math.random() > 0.45) {
            windows.push({
              x: c * 14 + 4,
              y: r * 20 + 4,
              active: Math.random() > 0.3,
              color: Math.random() > 0.9 
                ? "rgba(147, 197, 253, 0.75)" // blue tint
                : "rgba(253, 224, 71, 0.65)", // warm yellow tint
            });
          }
        }
      }

      buildings.push({
        x,
        w,
        h,
        color: `rgba(${Math.random() * 5 + 4}, ${Math.random() * 8 + 6}, ${Math.random() * 15 + 12}, 1)`,
        windows,
      });
    }

    // Clouds
    const clouds: { x: number; y: number; r: number; speed: number }[] = [];
    for (let i = 0; i < cloudCount; i++) {
      clouds.push({
        x: width * (0.1 + i * 0.2),
        y: height * (0.05 + Math.random() * 0.15),
        r: Math.random() * 60 + 100,
        speed: Math.random() * 0.08 + 0.05,
      });
    }

    // Helicopter/Drone with spin behavior on click
    const copter = {
      x: -100,
      y: height * 0.15,
      targetY: height * 0.15,
      speed: 0.65,
      searchlightAngle: 0,
      lightDirection: 1,
      spinAngle: 0,
      isSpinning: false,
    };

    // Horizontal Traffic
    const traffic: { x: number; w: number; speed: number; direction: 1 | -1; color: string }[] = [];
    for (let i = 0; i < trafficCount; i++) {
      traffic.push({
        x: Math.random() * width,
        w: Math.random() * 15 + 8,
        speed: Math.random() * 1.5 + 1.2,
        direction: Math.random() > 0.5 ? 1 : -1,
        color: Math.random() > 0.5 ? "#ef4444" : "#fbfbfb",
      });
    }

    // Interactive mouse tracking
    let mouseX = -999;
    let mouseY = -999;
    let hoveredZone: "moon" | "drone" | "oscorp" | "bugle" | null = null;

    // Lightning strike variables
    let lightningTimer = 0;
    let nextLightning = Math.random() * 400 + 200;

    // Handle Resize
    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);

    // Listeners for mouse interactions
    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseX = e.clientX - rect.left;
      mouseY = e.clientY - rect.top;

      let found: typeof hoveredZone = null;

      // 1. Check Moon Hover
      const moonX = width * 0.8;
      const moonY = height * 0.2;
      if (Math.hypot(mouseX - moonX, mouseY - moonY) < 55) {
        found = "moon";
      }

      // 2. Check Drone Hover
      if (Math.hypot(mouseX - copter.x, mouseY - copter.y) < 30) {
        found = "drone";
      }

      // 3. Check Oscorp Tower (We designate building index 1)
      if (buildings[1]) {
        const b = buildings[1];
        const topY = height - b.h;
        if (mouseX >= b.x && mouseX <= b.x + b.w && mouseY >= topY - 20 && mouseY <= topY + 25) {
          found = "oscorp";
        }
      }

      // 4. Check Daily Bugle Web (We designate building index 3 or fallback)
      if (buildings[3]) {
        const b = buildings[3];
        const topY = height - b.h;
        if (mouseX >= b.x && mouseX <= b.x + b.w && mouseY >= topY - 20 && mouseY <= topY + 25) {
          found = "bugle";
        }
      }

      hoveredZone = found;

      // Update cursor feedback style on canvas if hovered over anything interactable
      if (found) {
        canvas.style.pointerEvents = "auto";
        canvas.style.cursor = "pointer";
      } else {
        canvas.style.pointerEvents = "none"; // allow page interactions
        canvas.style.cursor = "default";
      }
    };

    const handleCanvasClick = (e: MouseEvent) => {
      if (!hoveredZone) return;

      const rect = canvas.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const clickY = e.clientY - rect.top;

      if (hoveredZone === "moon") {
        soundEngine.playThunder();
        triggerSparks(clickX, clickY, "#ef4444");

        // Scarlet Eclipse trigger
        onLightningTriggered(true);
        setTimeout(() => onLightningTriggered(false), 200);

        onTriggerEasterEgg(
          "moon",
          "Cosmic Symbiote Eclipse",
          "Secret satellite signal intercepted! The Blood Moon has aligned with Symbiote frequency V-256. Cosmic radiation peaks detected over New York, instantly increasing organic suit bonding potential."
        );
      } else if (hoveredZone === "drone") {
        soundEngine.playWebShoot();
        triggerSparks(clickX, clickY, "#3b82f6");
        
        // Make drone spin wildly
        copter.isSpinning = true;
        copter.spinAngle = 0;

        onTriggerEasterEgg(
          "drone",
          "Oscorp Drone Intercepted",
          "Encrypted drone surveillance log decrypted! Corporate scans detect Mac Gargan's pneumatic stinger prototype arriving via private barge at Dock 4. Kingpin is backing the tactical deployment."
        );
      } else if (hoveredZone === "oscorp") {
        soundEngine.playClick();
        triggerSparks(clickX, clickY, "#10b981");

        onTriggerEasterEgg(
          "oscorp",
          "Osborn Spire Signal Hack",
          "Oscorp Mainframe breach successful! Research notes reveal Norman Osborn has restarted private trials of the experimental Goblin formula under the classified name 'Project: Brand New Day'."
        );
      } else if (hoveredZone === "bugle") {
        soundEngine.playSwing();
        triggerSparks(clickX, clickY, "#f59e0b");

        onTriggerEasterEgg(
          "bugle",
          "Rooftop Web Stash Discovered",
          "You found Peter Parker's forgotten spider-web backpack on the ledge! It contains a spare camera, three rolls of high-contrast film, a half-eaten pizza slice, and a handwritten note from Aunt May."
        );
      }
    };

    // Attach mouse move & click triggers
    window.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("click", handleCanvasClick);

    // Main animation loop
    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // 1. Render Sky Background
      if (spiderSenseMode) {
        ctx.fillStyle = "rgba(18, 2, 2, 1)";
        ctx.fillRect(0, 0, width, height);
      } else {
        const skyGrad = ctx.createLinearGradient(0, 0, 0, height);
        skyGrad.addColorStop(0, "rgba(5, 7, 20, 1)");
        skyGrad.addColorStop(1, "rgba(10, 11, 24, 1)");
        ctx.fillStyle = skyGrad;
        ctx.fillRect(0, 0, width, height);
      }

      // Moon Easter Egg Target
      if (!spiderSenseMode) {
        const moonX = width * 0.8;
        const moonY = height * 0.2;
        ctx.beginPath();
        ctx.arc(moonX, moonY, 50, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(255, 255, 255, 0.08)";
        ctx.fill();

        // Draw interactive ring if moon hovered
        if (hoveredZone === "moon") {
          ctx.strokeStyle = "rgba(239, 68, 68, 0.4)";
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.arc(moonX, moonY, 62 + Math.sin(Date.now() * 0.01) * 3, 0, Math.PI * 2);
          ctx.stroke();

          // Render scan label
          ctx.font = "8px monospace";
          ctx.fillStyle = "#ef4444";
          ctx.fillText("[ CLICK: ECLIPSE SIGNALS ]", moonX - 60, moonY + 75);
        }

        if (qualityMode !== "Performance") {
          ctx.shadowBlur = hoveredZone === "moon" ? 60 : 40;
          ctx.shadowColor = hoveredZone === "moon" ? "rgba(239, 68, 68, 0.4)" : "rgba(255, 255, 255, 0.1)";
        }
      }

      // Reset shadows
      ctx.shadowBlur = 0;

      // 2. Render Moving Clouds
      clouds.forEach((c) => {
        c.x += c.speed;
        if (c.x - c.r > width) c.x = -c.r;

        ctx.fillStyle = spiderSenseMode ? "rgba(220, 38, 38, 0.03)" : "rgba(255, 255, 255, 0.015)";
        ctx.beginPath();
        ctx.arc(c.x, c.y, c.r, 0, Math.PI * 2);
        ctx.arc(c.x + c.r * 0.5, c.y - c.r * 0.2, c.r * 0.8, 0, Math.PI * 2);
        ctx.arc(c.x - c.r * 0.5, c.y + c.r * 0.1, c.r * 0.7, 0, Math.PI * 2);
        ctx.fill();
      });

      // 3. Render Skyscraper Silhouettes with illuminated windows & interactive signs
      buildings.forEach((b, index) => {
        const topY = height - b.h;

        // Base building rectangle
        if (spiderSenseMode) {
          ctx.fillStyle = "rgba(0, 0, 0, 1)";
          ctx.strokeStyle = "rgba(220, 38, 38, 0.2)";
          ctx.lineWidth = 1.5;
          ctx.fillRect(b.x, topY, b.w, b.h);
          ctx.strokeRect(b.x, topY, b.w, b.h);
        } else {
          ctx.fillStyle = b.color;
          ctx.fillRect(b.x, topY, b.w, b.h);

          // Add subtle architectural outline
          ctx.strokeStyle = "rgba(255, 255, 255, 0.02)";
          ctx.lineWidth = 1;
          ctx.strokeRect(b.x, topY, b.w, b.h);
        }

        // DESIGNATED EASTER EGGS ON ROOFTOPS
        // Building Index 1: OSCORP SPIRE
        if (index === 1 && !spiderSenseMode) {
          // Green glowing neon O antenna
          ctx.strokeStyle = "#10b981";
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(b.x + b.w / 2, topY);
          ctx.lineTo(b.x + b.w / 2, topY - 35);
          ctx.stroke();

          // Pulsing signal light on tip
          ctx.fillStyle = Math.floor(Date.now() / 400) % 2 === 0 ? "#10b981" : "rgba(16, 185, 129, 0.2)";
          ctx.beginPath();
          ctx.arc(b.x + b.w / 2, topY - 35, 5, 0, Math.PI * 2);
          ctx.fill();

          // Green 'O' logo
          ctx.strokeStyle = "rgba(16, 185, 129, 0.85)";
          ctx.lineWidth = 3;
          ctx.beginPath();
          ctx.arc(b.x + b.w / 2, topY + 30, 14, 0, Math.PI * 2);
          ctx.stroke();

          // Scan indicator
          if (hoveredZone === "oscorp") {
            ctx.strokeStyle = "#10b981";
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.arc(b.x + b.w / 2, topY, 40 + Math.sin(Date.now() * 0.015) * 5, 0, Math.PI * 2);
            ctx.stroke();

            ctx.font = "8px monospace";
            ctx.fillStyle = "#10b981";
            ctx.fillText("[ OSCORP SIGNALS ]", b.x + b.w / 2 - 45, topY - 48);
          }
        }

        // Building Index 3: DAILY BUGLE WEB SIGN
        if (index === 3 && !spiderSenseMode) {
          // Spider logo style beacon
          ctx.strokeStyle = "#f59e0b";
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          // Web pattern lines
          ctx.arc(b.x + b.w / 2, topY, 12, 0, Math.PI * 2);
          ctx.stroke();
          
          ctx.beginPath();
          ctx.moveTo(b.x + b.w / 2 - 15, topY);
          ctx.lineTo(b.x + b.w / 2 + 15, topY);
          ctx.moveTo(b.x + b.w / 2, topY - 15);
          ctx.lineTo(b.x + b.w / 2, topY + 15);
          ctx.stroke();

          // Center red spider core
          ctx.fillStyle = "#ef4444";
          ctx.beginPath();
          ctx.arc(b.x + b.w / 2, topY, 3, 0, Math.PI * 2);
          ctx.fill();

          // Scan indicator
          if (hoveredZone === "bugle") {
            ctx.strokeStyle = "#f59e0b";
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.arc(b.x + b.w / 2, topY, 30 + Math.sin(Date.now() * 0.012) * 4, 0, Math.PI * 2);
            ctx.stroke();

            ctx.font = "8px monospace";
            ctx.fillStyle = "#f59e0b";
            ctx.fillText("[ WEB STASH ]", b.x + b.w / 2 - 32, topY - 22);
          }
        }

        // Windows
        b.windows.forEach((win) => {
          const wx = b.x + win.x;
          const wy = topY + win.y;

          if (wx > 0 && wx < width - 10 && wy > 0 && wy < height) {
            // Flicker windows occasionally
            if (Math.random() > 0.998) {
              win.active = !win.active;
            }

            if (win.active) {
              ctx.fillStyle = spiderSenseMode 
                ? "rgba(239, 68, 68, 0.4)" 
                : win.color;
              ctx.fillRect(wx, wy, 6, 8);
            }
          }
        });
      });

      // 4. Moving Helicopter/Drone and Volumetric Searchlight
      copter.x += copter.speed;
      if (copter.x > width + 150) {
        copter.x = -150;
        copter.y = Math.random() * (height * 0.3) + height * 0.1;
      }

      // Drone flight hovering float
      copter.y += Math.sin(copter.x * 0.05) * 0.5;

      // Spin logic when hacked
      if (copter.isSpinning) {
        copter.spinAngle += 0.25;
        if (copter.spinAngle >= Math.PI * 4) {
          copter.isSpinning = false;
          copter.spinAngle = 0;
        }
      }

      // Draw Drone body (save context for rotation)
      ctx.save();
      ctx.translate(copter.x, copter.y);
      ctx.rotate(copter.spinAngle);

      ctx.fillStyle = spiderSenseMode ? "#dc2626" : "#1e293b";
      ctx.beginPath();
      ctx.arc(0, 0, 10, 0, Math.PI * 2);
      ctx.fill();

      // Flashing beacons
      if (Math.floor(Date.now() / 200) % 2 === 0) {
        ctx.fillStyle = "#ef4444";
        ctx.beginPath();
        ctx.arc(-12, 0, 4, 0, Math.PI * 2);
        ctx.arc(12, 0, 4, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.restore();

      // Searchlight volumetric beam (disabled in low-spec Performance mode for higher FPS)
      if (qualityMode !== "Performance" || hoveredZone === "drone") {
        copter.searchlightAngle += 0.005 * copter.lightDirection;
        if (Math.abs(copter.searchlightAngle) > 0.4) {
          copter.lightDirection *= -1;
        }

        const lightLength = height * 0.7;
        const targetAngle = Math.PI / 2 + copter.searchlightAngle;
        const lx = copter.x + Math.cos(targetAngle) * lightLength;
        const ly = copter.y + Math.sin(targetAngle) * lightLength;

        // Draw cone of light
        const beamGrad = ctx.createLinearGradient(copter.x, copter.y, lx, ly);
        if (spiderSenseMode) {
          beamGrad.addColorStop(0, "rgba(239, 68, 68, 0.45)");
          beamGrad.addColorStop(0.5, "rgba(239, 68, 68, 0.1)");
          beamGrad.addColorStop(1, "rgba(239, 68, 68, 0)");
        } else {
          const droneHoverAlphaMultiplier = hoveredZone === "drone" ? 2.0 : 1.0;
          beamGrad.addColorStop(0, `rgba(255, 255, 255, ${0.25 * droneHoverAlphaMultiplier})`);
          beamGrad.addColorStop(0.5, `rgba(147, 197, 253, ${0.08 * droneHoverAlphaMultiplier})`);
          beamGrad.addColorStop(1, "rgba(147, 197, 253, 0)");
        }

        ctx.beginPath();
        ctx.moveTo(copter.x, copter.y);
        ctx.lineTo(lx - 120, ly);
        ctx.lineTo(lx + 120, ly);
        ctx.closePath();
        ctx.fillStyle = beamGrad;
        ctx.fill();
      }

      // Draw interactive targets around the moving Drone
      if (hoveredZone === "drone" && !spiderSenseMode) {
        ctx.strokeStyle = "#3b82f6";
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(copter.x, copter.y, 22, 0, Math.PI * 2);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(copter.x - 30, copter.y);
        ctx.lineTo(copter.x - 15, copter.y);
        ctx.moveTo(copter.x + 15, copter.y);
        ctx.lineTo(copter.x + 30, copter.y);
        ctx.moveTo(copter.x, copter.y - 30);
        ctx.lineTo(copter.x, copter.y - 15);
        ctx.moveTo(copter.x, copter.y + 15);
        ctx.lineTo(copter.x, copter.y + 30);
        ctx.stroke();

        ctx.font = "8px monospace";
        ctx.fillStyle = "#3b82f6";
        ctx.fillText("[ CLICK: INTERCEPT DRONE ]", copter.x - 65, copter.y - 38);
      }

      // 5. Render Horizontal Traffic
      traffic.forEach((car) => {
        car.x += car.speed * car.direction;
        if (car.direction === 1 && car.x > width) car.x = -20;
        if (car.direction === -1 && car.x < -20) car.x = width;

        const streetY = height - 12;
        ctx.fillStyle = car.color;
        
        // Draw head/brake light glow based on Quality Setting
        if (qualityMode !== "Performance") {
          ctx.shadowBlur = 10;
          ctx.shadowColor = car.color;
        }
        ctx.fillRect(car.x, streetY + (car.direction === 1 ? 2 : -2), car.w, 3);
        ctx.shadowBlur = 0;
      });

      // 6. Rain system
      ctx.strokeStyle = spiderSenseMode ? "rgba(239, 68, 68, 0.3)" : "rgba(173, 216, 230, 0.25)";
      ctx.lineWidth = 1;
      rainParticles.forEach((p) => {
        p.y += p.speed;
        p.x += 1.5; // wind angle slant

        if (p.y > height) {
          p.y = -20;
          p.x = Math.random() * width;
        }

        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(p.x + 1.5, p.y + p.length);
        ctx.stroke();

        // Puddle splashes in Cinematic / Balanced mode
        if (qualityMode !== "Performance" && Math.random() > 0.985 && p.y > height - 30) {
          ctx.beginPath();
          ctx.ellipse(p.x, height - 3, 4, 1.5, 0, 0, Math.PI * 2);
          ctx.stroke();
        }
      });

      // Rising steam/mist particles at street level in Cinematic mode
      if (qualityMode === "Cinematic" && Math.random() > 0.85) {
        // Just push a light translucent gray arc drifting upward
        ctx.fillStyle = "rgba(255, 255, 255, 0.02)";
        ctx.beginPath();
        ctx.arc(Math.random() * width, height - Math.random() * 40 - 10, Math.random() * 30 + 10, 0, Math.PI * 2);
        ctx.fill();
      }

      // 7. Lightning Simulation & Flashes
      lightningTimer++;
      if (lightningTimer >= nextLightning) {
        lightningTimer = 0;
        nextLightning = Math.random() * 500 + 200; // time until next lightning

        // Trigger flash sequence
        onLightningTriggered(true);
        soundEngine.playThunder();

        setTimeout(() => {
          onLightningTriggered(false);
          // Secondary double-strike in high graphical levels
          if (qualityMode !== "Performance") {
            setTimeout(() => {
              onLightningTriggered(true);
              setTimeout(() => {
                onLightningTriggered(false);
              }, 100);
            }, 150);
          }
        }, 120);
      }

      // Draw lightning glare
      if (lightningActive && !spiderSenseMode) {
        ctx.fillStyle = "rgba(219, 234, 254, 0.45)"; // soft volumetric blue glow
        ctx.fillRect(0, 0, width, height);

        // Bold lightning path
        ctx.strokeStyle = "rgba(255, 255, 255, 0.95)";
        ctx.lineWidth = 3;
        
        if (qualityMode !== "Performance") {
          ctx.shadowBlur = 30;
          ctx.shadowColor = "rgba(147, 197, 253, 0.85)";
        }
        
        ctx.beginPath();
        let lx = width * Math.random();
        ctx.moveTo(lx, 0);
        ctx.lineTo(lx - 40, height * 0.25);
        ctx.lineTo(lx + 20, height * 0.45);
        ctx.lineTo(lx - 10, height * 0.7);
        ctx.stroke();
        ctx.shadowBlur = 0;
      }

      // 8. Render interactive particle Sparks (Click responses / Web hits)
      for (let i = sparks.length - 1; i >= 0; i--) {
        const s = sparks[i];
        s.x += s.vx;
        s.y += s.vy;
        s.vy += 0.08; // gravity
        s.alpha -= 0.02; // fade out

        if (s.alpha <= 0) {
          sparks.splice(i, 1);
        } else {
          ctx.fillStyle = s.color;
          ctx.globalAlpha = s.alpha;
          ctx.beginPath();
          ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      ctx.globalAlpha = 1.0; // restore alpha

      animationId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [lightningActive, spiderSenseMode, qualityMode, onLightningTriggered, onTriggerEasterEgg]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-auto -z-10 bg-transparent"
      id="cinematic-nyc-background"
    />
  );
}
