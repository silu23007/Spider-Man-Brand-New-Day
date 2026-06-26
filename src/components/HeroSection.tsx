/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from "react";
import { soundEngine } from "./SoundEngine";
import { Calendar, Ticket, Compass, Play, AlertCircle } from "lucide-react";

interface HeroSectionProps {
  onPreBook: () => void;
  spiderSenseMode: boolean;
  isSymbioteMode: boolean;
}

export default function HeroSection({ onPreBook, spiderSenseMode, isSymbioteMode }: HeroSectionProps) {
  // Set release date: July 30, 2026
  const targetDate = new Date("2026-07-30T00:00:00Z").getTime();
  const [timeLeft, setTimeLeft] = useState({
    months: 0,
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isExpired: false,
  });

  const [simulatedZero, setSimulatedZero] = useState(false);

  useEffect(() => {
    const calculateTime = () => {
      if (simulatedZero) {
        setTimeLeft({ months: 0, days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: true });
        return;
      }

      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference <= 0) {
        setTimeLeft({ months: 0, days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: true });
        return;
      }

      const seconds = Math.floor((difference / 1000) % 60);
      const minutes = Math.floor((difference / 1000 / 60) % 60);
      const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
      const days = Math.floor((difference / (1000 * 60 * 60 * 24)) % 30);
      const months = Math.floor(difference / (1000 * 60 * 60 * 24 * 30));

      setTimeLeft({ months, days, hours, minutes, seconds, isExpired: false });
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);
    return () => clearInterval(interval);
  }, [simulatedZero]);

  const triggerInstantZero = () => {
    setSimulatedZero(true);
    soundEngine.playThunder();
    soundEngine.playSwing();
    soundEngine.playWebShoot();
  };

  return (
    <section className="relative min-h-screen flex flex-col justify-between pt-28 pb-16 px-6 max-w-7xl mx-auto text-white select-none">
      {/* Background soft red/blue lighting */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-96 h-96 bg-red-900/10 rounded-full blur-3xl pointer-events-none" />

      {/* Main cinematic titles */}
      <div className="flex flex-col items-center text-center space-y-4 max-w-4xl mx-auto my-auto relative z-10 animate-fade-in mt-12">
        {/* Release Status HUD */}
        <div className="flex items-center gap-2.5 px-4.5 py-1.5 bg-white/5 backdrop-blur-md border border-white/10 rounded-full text-[10px] font-mono tracking-widest uppercase text-gray-300">
          <Calendar className="w-3.5 h-3.5 text-red-500" />
          {timeLeft.isExpired ? "RELEASE PHASE: CURRENTLY ACTIVE" : "RELEASE DATE: JULY 30, 2026"}
        </div>

        {/* Cinematic Display Title */}
        <div className="text-center mb-6">
          <h2 className="text-red-500 text-xs sm:text-sm tracking-[0.5em] sm:tracking-[0.6em] uppercase font-bold mb-2">
            A Brand New Day Starts Now
          </h2>
          <h1 className="text-5xl sm:text-7xl lg:text-8xl font-black italic tracking-tighter leading-none flex flex-col font-sans">
            <span className="block text-white">SPIDER-MAN</span>
            <span className={`block mt-2 text-transparent text-outline-thin ${isSymbioteMode ? 'text-outline-thin' : 'text-outline-red'} transition-colors duration-500`}>
              BRAND NEW DAY
            </span>
          </h1>
        </div>

        {/* Live Countdown Clock using absolute high-end glassmorphism */}
        <div className="flex flex-wrap sm:flex-nowrap justify-center items-center gap-6 sm:gap-10 mt-8 backdrop-blur-md bg-white/5 border border-white/10 p-8 sm:p-10 rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.5)]">
          {!timeLeft.isExpired ? (
            <>
              {/* Months */}
              <div className="flex flex-col items-center px-4">
                <span className={`text-4xl sm:text-5xl font-light tabular-nums ${isSymbioteMode ? 'text-white' : 'text-white'}`}>
                  {String(timeLeft.months).padStart(2, "0")}
                </span>
                <span className="text-[9px] uppercase tracking-widest opacity-50 mt-2">Months</span>
              </div>
              <div className="hidden sm:block w-px h-12 bg-white/10"></div>

              {/* Days */}
              <div className="flex flex-col items-center px-4">
                <span className={`text-4xl sm:text-5xl font-light tabular-nums ${isSymbioteMode ? 'text-white' : 'text-white'}`}>
                  {String(timeLeft.days).padStart(2, "0")}
                </span>
                <span className="text-[9px] uppercase tracking-widest opacity-50 mt-2">Days</span>
              </div>
              <div className="hidden sm:block w-px h-12 bg-white/10"></div>

              {/* Hours */}
              <div className="flex flex-col items-center px-4">
                <span className={`text-4xl sm:text-5xl font-light tabular-nums ${isSymbioteMode ? 'text-white' : 'text-white'}`}>
                  {String(timeLeft.hours).padStart(2, "0")}
                </span>
                <span className="text-[9px] uppercase tracking-widest opacity-50 mt-2">Hours</span>
              </div>
              <div className="hidden sm:block w-px h-12 bg-white/10"></div>

              {/* Minutes */}
              <div className="flex flex-col items-center px-4">
                <span className={`text-4xl sm:text-5xl font-light tabular-nums ${isSymbioteMode ? 'text-white' : 'text-white'}`}>
                  {String(timeLeft.minutes).padStart(2, "0")}
                </span>
                <span className="text-[9px] uppercase tracking-widest opacity-50 mt-2">Minutes</span>
              </div>
              <div className="hidden sm:block w-px h-12 bg-white/10"></div>

              {/* Seconds */}
              <div className="flex flex-col items-center px-4">
                <span className={`text-4xl sm:text-5xl font-light tabular-nums ${isSymbioteMode ? 'text-neutral-400' : 'text-red-500'}`}>
                  {String(timeLeft.seconds).padStart(2, "0")}
                </span>
                <span className="text-[9px] uppercase tracking-widest opacity-50 mt-2">Seconds</span>
              </div>
            </>
          ) : (
            // Swung Away confetti release visual
            <div className="p-4 flex flex-col items-center text-center space-y-2 animate-fade-in">
              <span className="text-lg font-bold text-white tracking-widest uppercase font-sans">
                🕸️ MOVIE AVAILABLE NOW 🕸️
              </span>
              <p className="text-xs text-gray-400 max-w-md font-sans leading-relaxed">
                Spider-Man has swung into action! The brand new day is here. Grab tickets immediately at your closest IMAX theatre!
              </p>
            </div>
          )}
        </div>

        {/* Buttons cluster */}
        <div className="flex flex-col sm:flex-row items-center gap-4 pt-10 relative z-10 w-full justify-center">
          <button
            onClick={onPreBook}
            id="book-tickets-btn"
            className="w-full sm:w-auto flex items-center justify-center gap-2.5 px-8 py-3 bg-white text-black hover:bg-red-600 hover:text-white text-[10px] font-bold uppercase tracking-widest rounded-sm transition-all duration-300 hover:scale-105 shadow-xl shadow-white/5 group cursor-pointer"
          >
            <Ticket className="w-3.5 h-3.5 fill-current group-hover:rotate-12 transition-transform" />
            Pre-Book Now
          </button>
        </div>
      </div>

      {/* Dynamic Telemetry Specs */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-[9px] text-gray-400 border-t border-white/5 pt-8 relative z-10 pointer-events-none mt-12">
        <div className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 bg-red-600 rounded-full animate-ping" />
          <span>SYS.TELEMETRY: SPIDER-BOT CONNECTED</span>
        </div>
        <div>
          <span>MARVEL ENTERTAINMENT © 2026</span>
        </div>
      </div>
    </section>
  );
}
