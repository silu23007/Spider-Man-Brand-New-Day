/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useRef, useState } from "react";
import { soundEngine } from "./SoundEngine";

interface WebNode {
  x: number;
  y: number;
  oldX: number;
  oldY: number;
  pinned: boolean;
}

interface WebRope {
  id: string;
  nodes: WebNode[];
  targetLength: number;
  tension: number;
  opacity: number;
  isFading: boolean;
  color: string;
}

export default function WebShooter() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const ropesRef = useRef<WebRope[]>([]);
  const activeDragNode = useRef<{ ropeId: string; nodeIndex: number } | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);

    // Verlet integration constants
    const GRAVITY = 0.25;
    const WIND = 0.05;
    const CONTRACTION_LOOPS = 6;

    // Create custom decorative webs attached to the screen corners on mount
    const addDecorativeWeb = (x1: number, y1: number, x2: number, y2: number) => {
      const nodes: WebNode[] = [];
      const steps = 15;
      for (let i = 0; i <= steps; i++) {
        const t = i / steps;
        const x = x1 + (x2 - x1) * t;
        const y = y1 + (y2 - y1) * t;
        nodes.push({
          x,
          y,
          oldX: x,
          oldY: y,
          pinned: i === 0 || i === steps,
        });
      }

      ropesRef.current.push({
        id: Math.random().toString(),
        nodes,
        targetLength: Math.hypot(x2 - x1, y2 - y1) / steps,
        tension: 0.98,
        opacity: 0.65,
        isFading: false,
        color: "rgba(243, 244, 246, 0.75)",
      });
    };

    // Corner cobwebs
    addDecorativeWeb(0, 0, width * 0.15, height * 0.1);
    addDecorativeWeb(width, 0, width * 0.85, height * 0.1);

    // Shooting web logic
    const handleMouseClick = (e: MouseEvent) => {
      // Ignore click if user clicked on button, input or link
      const target = e.target as HTMLElement;
      if (
        target.closest("button") || 
        target.closest("a") || 
        target.closest("input") || 
        target.closest("textarea")
      ) {
        return;
      }

      const clickX = e.clientX;
      const clickY = e.clientY;

      // Web shoots from bottom-center (Peter swinging)
      const startX = width / 2;
      const startY = height;

      const nodes: WebNode[] = [];
      const steps = 20;
      const distance = Math.hypot(clickX - startX, clickY - startY);
      const segmentLen = distance / steps;

      for (let i = 0; i <= steps; i++) {
        const t = i / steps;
        const x = startX + (clickX - startX) * t;
        const y = startY + (clickY - startY) * t;
        nodes.push({
          x,
          y,
          oldX: x,
          oldY: y,
          pinned: i === 0 || i === steps, // anchor both ends initially
        });
      }

      // Play procedural web shot sound
      soundEngine.playWebShoot();

      const newRope: WebRope = {
        id: Math.random().toString(),
        nodes,
        targetLength: segmentLen,
        tension: 0.95,
        opacity: 1.0,
        isFading: true,
        color: "rgba(255, 255, 255, 0.95)",
      };

      ropesRef.current.push(newRope);

      // Trigger standard swing whoosh
      setTimeout(() => {
        soundEngine.playSwing();
      }, 100);
    };

    // Grab & stretch webs with mouse drag
    const handleMouseDown = (e: MouseEvent) => {
      const mx = e.clientX;
      const my = e.clientY;

      // Find closest node to stretch
      let closestNode: { ropeId: string; nodeIndex: number; dist: number } | null = null;

      ropesRef.current.forEach((rope) => {
        rope.nodes.forEach((node, idx) => {
          const dist = Math.hypot(node.x - mx, node.y - my);
          if (dist < 25) {
            if (!closestNode || dist < closestNode.dist) {
              closestNode = { ropeId: rope.id, nodeIndex: idx, dist };
            }
          }
        });
      });

      if (closestNode) {
        activeDragNode.current = closestNode;
        soundEngine.playHover();
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (activeDragNode.current) {
        const { ropeId, nodeIndex } = activeDragNode.current;
        const rope = ropesRef.current.find((r) => r.id === ropeId);
        if (rope) {
          const node = rope.nodes[nodeIndex];
          node.x = e.clientX;
          node.y = e.clientY;
          node.oldX = e.clientX;
          node.oldY = e.clientY;
        }
      }
    };

    const handleMouseUp = () => {
      activeDragNode.current = null;
    };

    window.addEventListener("click", handleMouseClick);
    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);

    let animationId: number;

    // Simulation & Rendering loop
    const updatePhysics = () => {
      ctx.clearRect(0, 0, width, height);

      // Solve Verlet Physics & Constraints
      ropesRef.current.forEach((rope) => {
        const nodes = rope.nodes;

        // 1. Verlet Integration (Velocity & Acceleration)
        for (let i = 0; i < nodes.length; i++) {
          const n = nodes[i];
          if (n.pinned && !(activeDragNode.current && activeDragNode.current.ropeId === rope.id && activeDragNode.current.nodeIndex === i)) {
            continue;
          }

          const vx = (n.x - n.oldX) * 0.98; // damping/friction
          const vy = (n.y - n.oldY) * 0.98;

          n.oldX = n.x;
          n.oldY = n.y;

          n.x += vx + (WIND * Math.sin(Date.now() * 0.003 + n.y * 0.01));
          n.y += vy + GRAVITY;
        }

        // 2. Resolve Constraints (Elastic distance limiters)
        for (let loop = 0; loop < CONTRACTION_LOOPS; loop++) {
          for (let i = 0; i < nodes.length - 1; i++) {
            const n1 = nodes[i];
            const n2 = nodes[i + 1];

            const dx = n2.x - n1.x;
            const dy = n2.y - n1.y;
            const dist = Math.hypot(dx, dy);
            const diff = rope.targetLength - dist;
            const percent = (diff / dist) * 0.5 * rope.tension;

            const offsetX = dx * percent;
            const offsetY = dy * percent;

            if (!n1.pinned || (activeDragNode.current && activeDragNode.current.ropeId === rope.id && activeDragNode.current.nodeIndex === i)) {
              n1.x -= offsetX;
              n1.y -= offsetY;
            }
            if (!n2.pinned || (activeDragNode.current && activeDragNode.current.ropeId === rope.id && activeDragNode.current.nodeIndex === i + 1)) {
              n2.x += offsetX;
              n2.y += offsetY;
            }
          }
        }

        // 3. Draw Web Rope with glowing subsurface translucent rendering
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(nodes[0].x, nodes[0].y);

        for (let i = 1; i < nodes.length; i++) {
          // Curved line segments
          const xc = (nodes[i].x + nodes[i - 1].x) / 2;
          const yc = (nodes[i].y + nodes[i - 1].y) / 2;
          ctx.quadraticCurveTo(nodes[i - 1].x, nodes[i - 1].y, xc, yc);
        }

        ctx.lineTo(nodes[nodes.length - 1].x, nodes[nodes.length - 1].y);

        // Core thick thread
        ctx.shadowBlur = 10;
        ctx.shadowColor = "rgba(147, 197, 253, 0.6)";
        ctx.strokeStyle = rope.color.replace(/[\d.]+\)$/, `${rope.opacity})`);
        ctx.lineWidth = 1.8;
        ctx.stroke();

        // High gloss white highlight thread
        ctx.shadowBlur = 0;
        ctx.strokeStyle = `rgba(255, 255, 255, ${rope.opacity * 0.9})`;
        ctx.lineWidth = 0.8;
        ctx.stroke();

        ctx.restore();

        // 4. Handle gradual fadeout of web shots
        if (rope.isFading) {
          rope.opacity -= 0.0035; // fade away slowly over 5-7 seconds
        }
      });

      // Clear fully invisible ropes
      ropesRef.current = ropesRef.current.filter((rope) => !rope.isFading || rope.opacity > 0.01);

      animationId = requestAnimationFrame(updatePhysics);
    };

    updatePhysics();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("click", handleMouseClick);
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none z-30"
      id="web-shooter-canvas"
    />
  );
}
