"use client";
// components/StatsSectionSimple.jsx
import React, { useEffect, useRef, useState } from 'react';

// Small CountUp component (no external deps)
function CountUp({ end = 0, duration = 1400, suffix = '', start = 0, decimals = 0 }) {
  const [value, setValue] = useState(start);
  const elRef = useRef(null);
  const started = useRef(false);

  useEffect(() => {
    let rafId;
    let startTs = null;

    const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);

    const animate = (ts) => {
      if (!startTs) startTs = ts;
      const progress = Math.min((ts - startTs) / duration, 1);
      const eased = easeOutCubic(progress);
      const current = start + (end - start) * eased;
      setValue(current);
      if (progress < 1) rafId = requestAnimationFrame(animate);
    };

    // intersection observer to start when visible
    const node = elRef.current;
    const startAnimation = () => {
      if (!started.current) {
        started.current = true;
        rafId = requestAnimationFrame(animate);
      }
    };

    if (node && 'IntersectionObserver' in window) {
      const obs = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            startAnimation();
            obs.disconnect();
          }
        });
      }, { threshold: 0.3 });
      obs.observe(node);
      return () => {
        obs.disconnect();
        cancelAnimationFrame(rafId);
      };
    }

    // fallback - start immediately
    startAnimation();
    return () => cancelAnimationFrame(rafId);
  }, [end, duration, start]);

  const formatted = decimals > 0 ? value.toFixed(decimals) : Math.round(value).toLocaleString();
  return (
    <span ref={elRef} aria-hidden>
      {formatted}{suffix}
    </span>
  );
}

const StatsSectionSimple = ({ config = {} }) => {
  const stats = Array.isArray(config.stats) && config.stats.length ? config.stats : [
    { 
      end: 100, 
      suffix: '%', 
      label: 'SUCCESSFUL PROJECTS',
      icon: (
        <img src="https://img.icons8.com/fluency/48/trophy.png" alt="Trophy" className="w-6 h-6 sm:w-8 sm:h-8" />
      ),
      gradient: 'from-emerald-400 to-teal-500'
    },
    { 
      end: 100, 
      suffix: '%', 
      label: 'SATISFACTION',
      icon: (
        <img src="https://img.icons8.com/fluency/48/like.png" alt="Satisfaction" className="w-6 h-6 sm:w-8 sm:h-8" />
      ),
      gradient: 'from-purple-400 to-pink-500'
    },
    { 
      end: 1000, 
      suffix: '+', 
      label: 'SUCCESSFUL DEALS',
      icon: (
        <img src="https://img.icons8.com/fluency/48/handshake.png" alt="Deals" className="w-6 h-6 sm:w-8 sm:h-8" />
      ),
      gradient: 'from-blue-400 to-indigo-500'
    }
  ];

  const title = config.title || "Choose Your Plan";

  return (
    <section className="w-full py-6 md:py-8 px-4 md:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="relative rounded-2xl overflow-hidden bg-gradient-to-r from-blue-700 via-blue-500 to-pink-400 shadow-2xl">
          {/* Subtle pattern overlay */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.1),transparent_50%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_50%,rgba(255,255,255,0.08),transparent_50%)]" />
          
          <div className="relative p-6 md:p-10 flex flex-col md:flex-row items-center justify-between gap-6">
            {/* Left - Heading */}
            <div className="flex-shrink-0 text-center md:text-left">
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white tracking-tight mb-2" style={{ fontFamily: "var(--font-oswald), sans-serif" }}>
                {title}
              </h2>
              <div className="w-24 h-1 bg-white/40 rounded-full mx-auto md:mx-0" />
            </div>

            {/* Right - Stats */}
            <div className="flex flex-col sm:flex-row sm:flex-wrap items-center justify-center gap-6 sm:gap-8 lg:gap-12">
              {stats.map((stat, idx) => (
                <div key={idx} className="group flex flex-col sm:flex-row items-center gap-3 sm:gap-4 relative text-center sm:text-left">
                  {/* Icon */}
                  <div className={`flex-shrink-0 w-12 h-12 sm:w-14 sm:h-14 bg-white/15 backdrop-blur-sm rounded-2xl flex items-center justify-center text-white border border-white/20 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-lg`}>
                    {stat.icon}
                  </div>
                  
                  {/* Text */}
                  <div className="text-white text-center sm:text-left">
                    <div className="text-3xl sm:text-4xl md:text-5xl font-extrabold leading-none mb-1">
                      <CountUp end={stat.end} duration={1500} suffix={stat.suffix} />
                    </div>
                    <div className="text-xs md:text-sm uppercase tracking-wider text-white/90 font-medium">
                      {stat.label}
                    </div>
                  </div>

                  {/* Divider */}
                  {idx < stats.length - 1 && (
                    <div className="hidden lg:block absolute -right-6 h-16 w-px bg-white/20" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default StatsSectionSimple;