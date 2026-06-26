/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef, useState } from "react";
import { soundEngine } from "./SoundEngine";
import { Camera, X, Grid, Download, Trash2, Sliders, Info, AlertCircle, Eye } from "lucide-react";

interface CameraPhotoModeProps {
  onClose: () => void;
}

export default function CameraPhotoMode({ onClose }: CameraPhotoModeProps) {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [streamError, setStreamError] = useState(false);
  const [filter, setFilter] = useState<"standard" | "noir" | "spidey" | "symbiote">("standard");
  const [showGrid, setShowGrid] = useState(true);
  const [zoom, setZoom] = useState(1);
  const [snapshots, setSnapshots] = useState<string[]>([]);
  const [flashActive, setFlashActive] = useState(false);
  const [focusPos, setFocusPos] = useState<{ x: number; y: number } | null>(null);
  const [cameraLoading, setCameraLoading] = useState(true);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Initialize camera stream
  useEffect(() => {
    setCameraLoading(true);
    let activeStream: MediaStream | null = null;

    navigator.mediaDevices
      .getUserMedia({
        video: {
          facingMode: "user",
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
      })
      .then((s) => {
        setStream(s);
        activeStream = s;
        setStreamError(false);
        setCameraLoading(false);
        if (videoRef.current) {
          videoRef.current.srcObject = s;
        }
      })
      .catch((err) => {
        console.warn("Camera hardware not found or permission blocked. Engaging high-fidelity HUD simulator mode.", err);
        setStreamError(true);
        setCameraLoading(false);
      });

    return () => {
      if (activeStream) {
        activeStream.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  // Handle focus target clicks on viewport
  const handleViewportClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setFocusPos({ x, y });
    soundEngine.playFocusBeep();

    // Auto clear focus reticle
    const timeout = setTimeout(() => {
      setFocusPos(null);
    }, 1000);

    return () => clearTimeout(timeout);
  };

  // Capture frame from stream or simulated canvas
  const handleCapture = () => {
    soundEngine.playShutter();
    setFlashActive(true);

    // Flash effect animation
    setTimeout(() => {
      setFlashActive(false);
    }, 150);

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = 1280;
    const height = 720;
    canvas.width = width;
    canvas.height = height;

    // Draw background (Webcam or High-fidelity cinematic simulator still)
    if (stream && videoRef.current && !streamError) {
      // Draw webcam frame
      ctx.save();
      // Mirror horizontal for natural selfie style
      ctx.translate(width, 0);
      ctx.scale(-1, 1);
      
      // Calculate zoom offsets
      const zWidth = width / zoom;
      const zHeight = height / zoom;
      const sx = (width - zWidth) / 2;
      const sy = (height - zHeight) / 2;

      ctx.drawImage(videoRef.current, sx, sy, zWidth, zHeight, 0, 0, width, height);
      ctx.restore();
    } else {
      // Draw high-fidelity Spider-Man movie simulated background
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.referrerPolicy = "no-referrer";
      img.src = "https://images.unsplash.com/photo-1604200213928-ba3cf4fc8436?auto=format&fit=crop&w=1280&q=80";
      
      img.onload = () => {
        ctx.save();
        const zWidth = width / zoom;
        const zHeight = height / zoom;
        const sx = (width - zWidth) / 2;
        const sy = (height - zHeight) / 2;

        ctx.drawImage(img, sx, sy, zWidth, zHeight, 0, 0, width, height);

        // Overlay a futuristic red focus target reticle inside capture frame
        ctx.strokeStyle = "rgba(220, 38, 38, 0.5)";
        ctx.lineWidth = 3;
        ctx.strokeRect(width / 2 - 80, height / 2 - 80, 160, 160);
        
        ctx.fillStyle = "rgba(220, 38, 38, 0.8)";
        ctx.font = "bold 20px monospace";
        ctx.fillText("SIMULATED TARGET ACQUIRED", width / 2 - 140, height / 2 + 120);

        applyFiltersAndSave(ctx, canvas);
        ctx.restore();
      };
      return;
    }

    applyFiltersAndSave(ctx, canvas);
  };

  const applyFiltersAndSave = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => {
    const width = canvas.width;
    const height = canvas.height;
    
    // Apply filters directly to pixels so the downloaded image retains filters
    const imgData = ctx.getImageData(0, 0, width, height);
    const data = imgData.data;

    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];

      if (filter === "noir") {
        // High contrast grayscale
        const gray = 0.299 * r + 0.587 * g + 0.114 * b;
        const contrast = 1.2; // slight boost
        const finalGray = Math.min(255, Math.max(0, (gray - 128) * contrast + 128));
        data[i] = finalGray;
        data[i + 1] = finalGray;
        data[i + 2] = finalGray;
      } else if (filter === "spidey") {
        // Red Hot Spider-Sense thermal vision
        const gray = 0.299 * r + 0.587 * g + 0.114 * b;
        data[i] = Math.min(255, gray * 1.8);       // heavily prioritize red channel
        data[i + 1] = Math.min(255, gray * 0.4);   // low green
        data[i + 2] = Math.min(255, gray * 0.1);   // very low blue
      } else if (filter === "symbiote") {
        // Deep purple, ultra dark shadow high contrast
        const gray = 0.299 * r + 0.587 * g + 0.114 * b;
        const inverted = 255 - gray;
        data[i] = Math.min(255, (r * 0.4) + (inverted * 0.1));
        data[i + 1] = Math.min(255, (g * 0.2));
        data[i + 2] = Math.min(255, (b * 0.8) + (inverted * 0.15));
      }
    }

    ctx.putImageData(imgData, 0, 0);

    // Overlay Stark HUD Watermark details
    ctx.fillStyle = "rgba(255, 255, 255, 0.45)";
    ctx.font = "bold 14px monospace";
    ctx.fillText("STARK INDUSTRIES © 2026 HUD V1.48", 40, height - 40);
    ctx.fillStyle = "rgba(220, 38, 38, 0.7)";
    ctx.fillText("SPIDEY_SNAPS_NYC", width - 200, height - 40);

    const dataUrl = canvas.toDataURL("image/jpeg");
    setSnapshots((prev) => [dataUrl, ...prev]);

    if (zoom >= 2) {
      window.dispatchEvent(new CustomEvent("spidey-achievement", { detail: { id: "stark-lens" } }));
    }
  };

  const deleteSnapshot = (idx: number) => {
    soundEngine.playClick();
    setSnapshots((prev) => prev.filter((_, i) => i !== idx));
  };

  const getFilterStyle = () => {
    switch (filter) {
      case "noir":
        return "grayscale contrast-125";
      case "spidey":
        return "hue-rotate-[-30deg] saturate-200 contrast-125 brightness-90 saturate-150 shadow-[inset_0_0_80px_rgba(220,38,38,0.7)] border-red-500/50";
      case "symbiote":
        return "invert opacity-90 contrast-200 saturate-150 brightness-75 bg-[#050010]";
      default:
        return "";
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black flex flex-col items-center justify-between p-4 md:p-8 overflow-hidden select-none">
      
      {/* Hidden processing canvas */}
      <canvas ref={canvasRef} className="hidden" />

      {/* Top Header Controls bar */}
      <div className="w-full max-w-7xl flex items-center justify-between border-b border-white/10 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 border border-red-500 bg-red-600/10 rounded-full flex items-center justify-center">
            <Camera className="w-4 h-4 text-red-500 animate-pulse" />
          </div>
          <div>
            <h2 className="text-sm font-bold tracking-[0.25em] font-sans uppercase text-white">STARK HUD DSLR CAPTURE</h2>
            <p className="text-[9px] font-mono text-gray-400 uppercase tracking-widest">
              {streamError ? "VIRTUAL MOVIE SIMULATOR MODE" : "LIVE WEBCAM STREAM SYNCED"}
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            soundEngine.playClick();
            onClose();
          }}
          className="p-2.5 bg-white/5 hover:bg-red-600 hover:text-white border border-white/10 rounded-full text-gray-300 transition-all cursor-pointer"
          title="Exit Photo Mode"
        >
          <X className="w-4.5 h-4.5" />
        </button>
      </div>

      {/* Main Viewfinder Frame Container */}
      <div className="relative w-full max-w-5xl aspect-video bg-neutral-950 border-2 border-white/10 rounded-2xl overflow-hidden shadow-[0_25px_80px_rgba(0,0,0,0.8)] my-auto flex items-center justify-center">
        
        {/* Flash overlay white block */}
        <div
          className={`absolute inset-0 bg-white z-40 pointer-events-none transition-opacity duration-150 ${
            flashActive ? "opacity-100" : "opacity-0"
          }`}
        />

        {/* Outer Grid lines / brackets HUD layout */}
        <div className="absolute inset-6 border border-white/5 pointer-events-none z-20 flex flex-col justify-between p-4">
          <div className="flex justify-between text-[10px] font-mono text-gray-500">
            <span>F/2.8</span>
            <span>1/250s</span>
            <span>ISO 400</span>
          </div>
          <div className="flex justify-between text-[10px] font-mono text-red-500 items-end">
            <span className="flex items-center gap-1.5 font-bold">
              <span className="w-2 h-2 bg-red-500 rounded-full animate-ping" />
              REC LIVE
            </span>
            <span>EV +0.3</span>
          </div>
        </div>

        {/* Viewport content area */}
        <div
          ref={containerRef}
          onClick={handleViewportClick}
          className="relative w-full h-full overflow-hidden cursor-crosshair flex items-center justify-center"
        >
          {/* Rule of Thirds camera grid lines overlay */}
          {showGrid && (
            <div className="absolute inset-0 pointer-events-none z-20">
              {/* Vertical grids */}
              <div className="absolute left-1/3 top-0 bottom-0 border-l border-white/10" />
              <div className="absolute left-2/3 top-0 bottom-0 border-l border-white/10" />
              {/* Horizontal grids */}
              <div className="absolute top-1/3 left-0 right-0 border-t border-white/10" />
              <div className="absolute top-2/3 left-0 right-0 border-t border-white/10" />
            </div>
          )}

          {/* Dynamic Click Focus Reticle */}
          {focusPos && (
            <div
              className="absolute w-12 h-12 border-2 border-red-500 z-30 pointer-events-none flex items-center justify-center -translate-x-1/2 -translate-y-1/2 animate-scale-up"
              style={{ top: focusPos.y, left: focusPos.x }}
            >
              <div className="w-2 h-2 bg-red-500 rounded-full" />
            </div>
          )}

          {/* Actual video stream or simulator fallback block */}
          {cameraLoading ? (
            <div className="text-center space-y-3 z-10 text-gray-400 font-mono">
              <div className="w-10 h-10 border-2 border-red-500 border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="text-xs uppercase tracking-widest">CALIBRATING DSLR OPTICS...</p>
            </div>
          ) : stream && !streamError ? (
            /* Real webcam streaming */
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className={`w-full h-full object-cover select-none scale-x-[-1] transition-all duration-300 ${getFilterStyle()}`}
              style={{ transform: `scaleX(-1) scale(${zoom})` }}
            />
          ) : (
            /* Virtual simulated backdrop with heavy drift animation */
            <div className="relative w-full h-full">
              <img
                src="https://images.unsplash.com/photo-1604200213928-ba3cf4fc8436?auto=format&fit=crop&w=1280&q=80"
                alt="Simulated NYC Skyscraper"
                referrerPolicy="no-referrer"
                className={`w-full h-full object-cover transition-all duration-500 select-none ${getFilterStyle()}`}
                style={{ transform: `scale(${zoom})` }}
              />
              {/* Rain pitter patter drops simulated for fallback visual layout */}
              <div className="absolute inset-0 bg-black/10 z-10 pointer-events-none">
                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:100%_4px] opacity-30" />
              </div>
              <div className="absolute top-6 left-6 z-20 bg-black/75 border border-red-500/30 px-3 py-1.5 rounded-lg text-[9px] font-mono tracking-wider text-red-500">
                ⚠️ CAMERA DISCONNECTED — SIMULATOR ACTIVE
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Toolbars / Camera Control HUD */}
      <div className="w-full max-w-7xl grid grid-cols-1 lg:grid-cols-3 gap-6 border-t border-white/10 pt-6">
        
        {/* Filter selection buttons (Left Col) */}
        <div className="space-y-2">
          <p className="text-[10px] font-mono text-gray-400 uppercase tracking-widest flex items-center gap-1.5">
            <Sliders className="w-3.5 h-3.5" /> Optics & Filters
          </p>
          <div className="flex gap-2">
            {[
              { id: "standard", label: "STANDARD" },
              { id: "noir", label: "NOIR B&W" },
              { id: "spidey", label: "SPIDEY" },
              { id: "symbiote", label: "SYMBIOTE" },
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => {
                  soundEngine.playClick();
                  setFilter(f.id as any);
                }}
                className={`flex-1 py-1.5 border rounded text-[9px] font-bold font-mono tracking-widest transition-all cursor-pointer ${
                  filter === f.id
                    ? "bg-red-600 border-red-500 text-white shadow-[0_0_10px_rgba(220,38,38,0.25)]"
                    : "border-white/10 text-gray-400 hover:text-white hover:bg-white/5"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Shutter Capture Button (Center Col) */}
        <div className="flex flex-col items-center justify-center gap-3">
          <div className="flex items-center gap-4">
            {/* Zoom toggle button */}
            <button
              onClick={() => {
                soundEngine.playClick();
                setZoom((prev) => (prev === 1 ? 1.5 : prev === 1.5 ? 2.2 : 1));
              }}
              className="px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded font-mono text-[10px] font-bold text-gray-300 cursor-pointer"
            >
              ZOOM: {zoom}x
            </button>

            {/* Shoot camera shutter button */}
            <button
              onClick={handleCapture}
              disabled={cameraLoading}
              className="w-16 h-16 bg-red-600 hover:bg-red-500 text-white rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(220,38,38,0.4)] cursor-pointer hover:scale-105 active:scale-95 transition-all"
              title="Capture Photo"
            >
              <div className="w-12 h-12 border-2 border-white rounded-full flex items-center justify-center">
                <div className="w-8 h-8 bg-white rounded-full" />
              </div>
            </button>

            {/* Grid display toggle */}
            <button
              onClick={() => {
                soundEngine.playClick();
                setShowGrid((p) => !p);
              }}
              className={`p-2 border rounded-lg cursor-pointer transition-colors ${
                showGrid ? "bg-red-600/10 border-red-500/40 text-red-500" : "border-white/10 text-gray-400 hover:text-white"
              }`}
              title="Toggle Grid Lines"
            >
              <Grid className="w-4.5 h-4.5" />
            </button>
          </div>
          <span className="text-[9px] font-mono text-gray-400 tracking-widest uppercase">CLICK VIEWPORT TO RE-FOCUS RETICLE</span>
        </div>

        {/* Saved Snapshots Tray list (Right Col) */}
        <div className="space-y-2">
          <p className="text-[10px] font-mono text-gray-400 uppercase tracking-widest flex items-center gap-1.5">
            <Eye className="w-3.5 h-3.5 text-red-500" /> Saved Selfies ({snapshots.length})
          </p>

          <div className="flex gap-2 overflow-x-auto pb-1 max-w-full h-16 items-center">
            {snapshots.length === 0 ? (
              <div className="w-full h-12 flex items-center justify-center border border-dashed border-white/5 rounded text-[9px] font-mono text-gray-500 tracking-wider">
                NO CAPTURED SNAPSHOTS YET
              </div>
            ) : (
              snapshots.map((snap, i) => (
                <div
                  key={i}
                  className="relative group w-14 h-11 border border-white/20 rounded overflow-hidden flex-shrink-0 bg-neutral-950"
                >
                  <img src={snap} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center gap-1 transition-opacity">
                    {/* Real Download click */}
                    <a
                      href={snap}
                      download={`spidey_selfie_${i + 1}.jpg`}
                      onClick={() => soundEngine.playClick()}
                      className="p-1 bg-green-600 rounded text-white hover:bg-green-500"
                      title="Download image"
                    >
                      <Download className="w-2.5 h-2.5" />
                    </a>
                    {/* Delete item */}
                    <button
                      onClick={() => deleteSnapshot(i)}
                      className="p-1 bg-red-600 rounded text-white hover:bg-red-500 cursor-pointer"
                      title="Delete snapshot"
                    >
                      <Trash2 className="w-2.5 h-2.5" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>

    </div>
  );
}
