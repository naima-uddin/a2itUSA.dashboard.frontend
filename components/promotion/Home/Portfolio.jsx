"use client";

import React, { useMemo, useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

const normalizeProject = (project) => ({
  ...project,
  category: Array.isArray(project.category)
    ? project.category
    : project.category
      ? [project.category]
      : [],
  images: Array.isArray(project.images)
    ? project.images
    : project.image
      ? [project.image]
      : [],
  performance: Array.isArray(project.performance)
    ? project.performance
    : Array.isArray(project.metrics)
      ? project.metrics
      : [],
});

export default function Portfolio({ config = {} }) {
  const [projects, setProjects] = useState([]);
  const [active, setActive] = useState("All");
  const [selectedIndex, setSelectedIndex] = useState(null);
  // don't highlight any category button on initial load; showAll logic still uses "All"
  const [showActive, setShowActive] = useState(false);
  const [showAll, setShowAll] = useState(false);
  const [autoScrollIndex, setAutoScrollIndex] = useState(0);

  // responsive visible count: mobile -> 2, desktop -> 4
  const [visibleCount, setVisibleCount] = useState(4);
  useEffect(() => {
    const update = () => {
      if (typeof window === "undefined") return;
      const w = window.innerWidth;
      // treat <768px as mobile
      setVisibleCount(w < 768 ? 2 : 4);
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  useEffect(() => {
    let mounted = true;
    const configProjects =
      Array.isArray(config.projects) && config.projects.length
        ? config.projects
        : null;
    if (configProjects) {
      const items = configProjects.map(normalizeProject).filter((p) => p && p.image);
      setProjects(items);
      if (items.length) setAutoScrollIndex(0);
      return () => (mounted = false);
    }

    fetch(`${API_BASE}/api/portfolio`, { cache: "no-store" })
      .then((r) => r.json())
      .then((data) => {
        if (!mounted) return;
        const items = (data?.portfolios || [])
          .map(normalizeProject)
          .filter((p) => p && p.image && p.isActive !== false);
        setProjects(items);
        if (items.length) setAutoScrollIndex(0);
      })
      .catch(() => {});
    return () => (mounted = false);
  }, [config.projects]);

  const categories = useMemo(() => {
    const set = new Set();
    projects.forEach((p) => {
      (Array.isArray(p.category) ? p.category : [p.category || ""])
        .map((c) => c.trim())
        .forEach((c) => {
          if (c) set.add(c);
        });
    });
    return ["All", ...Array.from(set)];
  }, [projects]);

  const filtered = useMemo(() => {
    if (active === "All") return projects;
    return projects.filter((p) => {
      const cats = Array.isArray(p.category)
        ? p.category.map((c) => c.trim())
        : String(p.category || "")
            .split(",")
            .map((c) => c.trim());
      return cats.includes(active);
    });
  }, [projects, active]);

  const selectedItem = selectedIndex !== null ? filtered[selectedIndex] : null;

  useEffect(() => {
    function onKey(e) {
      if (e.key === "Escape") setSelectedIndex(null);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // Scroll to the View more button when collapsing (showAll -> false)
  const viewMoreRef = useRef(null);
  const prevShowAllRef = useRef(showAll);
  useEffect(() => {
    // if it changed from true -> false, scroll button into view after layout update
    if (prevShowAllRef.current && !showAll) {
      // small delay to allow DOM collapse before scrolling
      setTimeout(() => {
        viewMoreRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }, 80);
    }
    prevShowAllRef.current = showAll;
  }, [showAll]);

  const title = config.title || "Experience Our High-Impact Digital Projects";
  const description =
    config.description ||
    "Explore our latest work across custom web development, scalable eCommerce platforms, ERP system integrations, marketplace solutions, and performance-driven marketing campaigns.";

  if (
    (config.mode === "gallery" || config.galleryMode) &&
    Array.isArray(config.galleryItems) &&
    config.galleryItems.length
  ) {
    return (
      <section
        className="w-full pt-16 bg-[#071331]/0 -mb-20 md:-mb-10"
        style={{ fontFamily: "var(--font-oswald), sans-serif" }}
      >
        <div className="max-w-7xl mx-auto px-2 md:px-4">
          <div className="text-center mb-4 md:mb-10">
            <h2 className="text-3xl md:text-4xl font-oswald font-bold bg-linear-to-r from-[#93c9ff] to-[#0202c1] bg-clip-text text-transparent pb-2">
              {title}
            </h2>
            <p className="text-[#989897] max-w-2xl mx-auto">{description}</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
            {config.galleryItems.map((item, index) => (
              <article
                key={`${item.title || "gallery"}-${index}`}
                className="rounded-3xl overflow-hidden bg-white shadow-[0_24px_70px_-40px_rgba(15,23,42,0.45)] border border-slate-200"
              >
                <div className="relative bg-slate-100 h-56 md:h-64 lg:h-72 overflow-hidden">
                  <Image
                    src={item.image}
                    alt={item.title || "Gallery item"}
                    width={1200}
                    height={900}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="p-4 md:p-5">
                  <h3 className="text-lg font-bold text-slate-900 mb-1">
                    {item.title}
                  </h3>
                  <p className="text-sm text-slate-600">{item.description}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      className="w-full pt-16 bg-[#071331]/0 -mb-20 md:-mb-10"
      style={{ fontFamily: "var(--font-oswald), sans-serif" }}
    >
      <div className="max-w-7xl mx-auto px-2 md:px-4">
        <div className="text-center mb-4 md:mb-10">
          <h2 className="text-3xl md:text-4xl font-oswald font-bold bg-linear-to-r from-[#93c9ff] to-[#0202c1] bg-clip-text text-transparent pb-2">
            {title}
          </h2>
          <p className=" text-[#989897] max-w-2xl mx-auto">{description}</p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3 mb-4 md:mb-8">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => {
                setActive(cat);
                setShowActive(true);
                setShowAll(false);
              }}
              className={`px-4 py-2 rounded-full text-sm font-semibold transition ${showActive && active === cat ? "bg-linear-to-r from-blue-500 to-blue-900 text-white" : "bg-blue-600/30 text-white/90 "}`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-3 md:gap-4">
          {filtered.map((p, idx) => {
            // Skip items beyond visibleCount when showAll is false
            if (!showAll && idx >= visibleCount) {
              return null;
            }
            const isAuto = autoScrollIndex === idx;
            const isSelected = selectedIndex === idx;
            return (
              <article
                key={p.id + "-" + idx}
                className={`group relative mx-auto w-full max-w-75 md:max-w-72.5 ${isAuto || isSelected ? "auto-scrolling" : ""}`}
                role="button"
                tabIndex={0}
                onClick={() => {
                  setSelectedIndex(idx);
                  setAutoScrollIndex(idx);
                }}
                onKeyDown={(e) =>
                  e.key === "Enter" &&
                  (setSelectedIndex(idx), setAutoScrollIndex(idx))
                }
                onMouseEnter={() => setAutoScrollIndex(idx)}
                onMouseLeave={() => setAutoScrollIndex(0)}
              >
                {/* Phone device frame - realistic modern phone */}
                <div
                  className="relative bg-gray-900 rounded-[2.5rem] p-1 shadow-xl hover:shadow-2xl transition-all hover:scale-[1.02]"
                  style={{ aspectRatio: "9/13" }}
                >
                  {/* Top bezel/notch area (inset to match inner screen) */}
                  <div className="absolute left-1 right-1 top-0 h-7 bg-gray-900 rounded-t-[2.3rem] flex items-center justify-center z-20">
                    {/* Notch */}
                    <div className="flex items-center gap-2 bg-black px-6 py-1 rounded-b-2xl">
                      <div className="w-1.5 h-1.5 rounded-full bg-gray-700" />
                      <div className="w-12 h-0.5 rounded-full bg-gray-800" />
                      <div className="w-2 h-2 rounded-full bg-gray-700 ring-1 ring-gray-600" />
                    </div>
                  </div>

                  {/* Phone screen (inner content area) */}
                  <div className="relative overflow-hidden rounded-[2.3rem] bg-black h-full">
                    <div
                      className={`absolute inset-0 image-wrapper ${isAuto || isSelected ? "is-scrolling" : ""}`}
                    >
                      <div className="image-scroll">
                        <div className="scroll-item">
                          <Image
                            src={p.image}
                            alt={p.title}
                            fill
                            className="object-cover"
                            sizes="290px"
                            priority={idx < 4}
                          />
                        </div>
                        <div className="scroll-item">
                          <Image
                            src={p.image}
                            alt={p.title}
                            fill
                            className="object-cover"
                            sizes="290px"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="absolute bottom-6 left-4 right-4 z-20">
                      <div className="text-blue-600">
                        <h3 className="text-sm font-bold leading-tight line-clamp-2 drop-shadow-lg mb-1">
                          {p.title}
                        </h3>
                      </div>
                    </div>
                  </div>

                  {/* Bottom chin/home indicator (inset to match screen) */}
                  <div className="absolute left-1 right-1 bottom-0 h-7 bg-gray-900 rounded-b-[2.3rem] flex items-center justify-center z-20">
                    <div className="w-20 h-1 rounded-full bg-gray-500" />
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        {/* View more / View less button */}
        {filtered.length > visibleCount && (
          <div className="flex justify-center mt-6" ref={viewMoreRef}>
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log(
                  "Button clicked! showAll before:",
                  showAll,
                  "filtered.length:",
                  filtered.length,
                  "visibleCount:",
                  visibleCount,
                );
                setShowAll((prev) => {
                  const newValue = !prev;
                  console.log("Setting showAll to:", newValue);
                  return newValue;
                });
              }}
              className="inline-flex items-center gap-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-full px-6 py-2.5 shadow-lg transition cursor-pointer z-10 relative"
            >
              <span className="text-white font-bold">
                {showAll ? "View Less" : "View More"}
              </span>
            </button>
          </div>
        )}
      </div>

      {/* Modal / Lightbox */}
      {selectedIndex !== null && selectedItem && (
        <div
          className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm "
          role="dialog"
          aria-modal="true"
          onClick={() => setSelectedIndex(null)}
        >
          {/* Image - centered full viewport */}
          <div className="relative w-full h-screen flex items-center justify-center">
            <div className="relative w-full h-full max-w-6xl">
              <Image
                src={selectedItem.image}
                alt={selectedItem.title}
                fill
                className="object-contain"
                quality={95}
                priority
                onClick={(e) => e.stopPropagation()}
              />

              {/* Close button - positioned relative to image */}
              <button
                onClick={() => setSelectedIndex(null)}
                className="absolute top-4 right-4 z-60 bg-blue-600 hover:bg-red-600 text-white rounded-full w-12 h-12 flex items-center justify-center transition-all shadow-2xl hover:scale-110 text-xl font-bold"
                aria-label="Close"
              >
                ✕
              </button>

              {/* Previous arrow button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  const newIndex =
                    selectedIndex > 0 ? selectedIndex - 1 : filtered.length - 1;
                  setSelectedIndex(newIndex);
                }}
                className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 md:top-auto md:translate-y-0 md:bottom-8 z-60 bg-linear-to-l from-cyan-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-full w-9 h-9 md:w-10 md:h-10 flex items-center justify-center transition-all shadow-2xl hover:scale-110 text-2xl md:text-3xl font-bold backdrop-blur-sm leading-none"
                aria-label="Previous"
              >
                <span className="block -mt-2">‹</span>
              </button>

              {/* Next arrow button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  const newIndex =
                    selectedIndex < filtered.length - 1 ? selectedIndex + 1 : 0;
                  setSelectedIndex(newIndex);
                }}
                className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 md:top-auto md:translate-y-0 md:bottom-8 z-60 bg-linear-to-r from-cyan-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-full w-9 h-9 md:w-10 md:h-10 flex items-center justify-center transition-all shadow-2xl hover:scale-110 text-2xl md:text-3xl font-bold backdrop-blur-sm leading-none"
                aria-label="Next"
              >
                <span className="block -mt-2">›</span>
              </button>
            </div>

            {/* Content box - left on desktop, bottom bar on mobile */}
            <div
              className="absolute left-0 right-0 bottom-0 md:left-8 md:right-auto md:top-1/2 md:-translate-y-1/2 md:bottom-auto z-55 md:max-w-md bg-linear-to-t from-black via-black/90 to-transparent md:bg-none md:from-transparent backdrop-blur-none md:backdrop-blur-md md:rounded-lg p-4 pt-10 md:p-8 md:shadow-2xl"
              onClick={(e) => e.stopPropagation()}
              style={{
                background:
                  "linear-gradient(to top, rgba(0,0,0,0.95), rgba(0,0,0,0.7) 60%, transparent)",
              }}
            >
              {/* Desktop background overlay */}
              <div className="hidden md:block absolute inset-0 bg-black/60 rounded-lg -z-10" />

              {/* Chat bubble tail - only visible on desktop */}
              <div
                className="hidden md:block absolute -right-3 bottom-1/16 -translate-y-1/2"
                style={{
                  width: 0,
                  height: 0,
                  borderTop: "12px solid transparent",
                  borderBottom: "12px solid transparent",
                  borderLeft: "12px solid rgba(0, 0, 0, 0.6)",
                }}
              />
              <h3 className="text-base md:text-2xl lg:text-3xl font-oswald font-bold text-white mb-2 md:mb-3 leading-tight">
                {selectedItem.title}
              </h3>
              {/* Description - hidden on mobile */}
              <p className="hidden md:block text-sm lg:text-base text-slate-200 leading-relaxed mb-6">
                {selectedItem.description}
              </p>

              {/* Start project button */}
              <a
                href={
                  "https://wa.me/18083015039?text=" +
                  encodeURIComponent(
                    `Hello, I'm interested in starting a project: ${selectedItem?.title || ""}`,
                  )
                }
                target="_blank"
                rel="noopener noreferrer"
                className="relative inline-flex items-center gap-1 bg-linear-to-r from-cyan-600 to-blue-700 hover:from-cyan-700 hover:to-blue-800 text-white font-bold rounded-full px-3 py-2 md:px-4 md:py-3 transition-all shadow-2xl hover:scale-110 whitespace-nowrap animate-pulse text-sm md:text-base"
                style={{
                  boxShadow:
                    "0 0 30px rgba(59, 130, 246, 0.8), 0 0 60px rgba(59, 130, 246, 0.5), 0 0 90px rgba(59, 130, 246, 0.3)",
                }}
              >
                <span className="text-lg md:text-2xl">🚀</span>
                <span className="text-sm md:text-lg">Start a project</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
