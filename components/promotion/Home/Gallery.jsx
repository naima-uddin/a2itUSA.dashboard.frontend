"use client";

import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";

export default function Gallery({ config = {} }) {
  const title = config.title || "Explore Our Creative Gallery ";
  const description =
    config.description ||
    "Use this section for image-first promotional pages, campaign highlights, and featured work.";
  // Only use items provided via config (from the database).
  // Do not fall back to any default images.
  const items =
    Array.isArray(config.items) && config.items.length ? config.items : [];
  const validItems = items.filter(
    (it) => it && typeof it.image === "string" && it.image.trim(),
  );

  const heights = [
    "h-56",
    "h-72",
    "h-64",
    "h-80",
    "h-60",
    "h-72",
    "h-64",
    "h-56",
  ];

  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const openLightbox = useCallback((index) => {
    setSelectedIndex(index);
    setLightboxOpen(true);
  }, []);

  const closeLightbox = useCallback(() => setLightboxOpen(false), []);

  const showPrev = useCallback(() => {
    setSelectedIndex(
      (prev) => (prev - 1 + validItems.length) % validItems.length,
    );
  }, [validItems.length]);

  const showNext = useCallback(() => {
    setSelectedIndex((prev) => (prev + 1) % validItems.length);
  }, [validItems.length]);

  useEffect(() => {
    if (!lightboxOpen) return;

    const onKey = (e) => {
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowLeft") showPrev();
      if (e.key === "ArrowRight") showNext();
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lightboxOpen, closeLightbox, showPrev, showNext]);

  return (
    <section className="w-full py-4 md:py-10 mt-16 -mb-20 bg-linear-to-b from-white via-slate-50 to-slate-100">
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-8 md:mb-12">
          <h2
            className="text-3xl md:text-4xl font-bold text-slate-900 mb-3"
            style={{ fontFamily: "var(--font-oswald), sans-serif" }}
          >
            {title}
          </h2>
          <p className="text-slate-600 text-sm md:text-base">{description}</p>
        </div>

        {/* Grid: fixed row height, show only 3 rows (overflow hidden). Clicking opens lightbox showing full gallery. */}
        <div
          className="overflow-hidden"
          style={{
            // row height for each grid row
            ["--row-h"]: "240px",
            ["--gap"]: "1rem",
          }}
        >
          <div
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
            style={{
              gridAutoRows: "var(--row-h)",
              gap: "1rem",
              maxHeight: "calc(var(--row-h) * 3 + (var(--gap) * 2))",
              overflow: "hidden",
            }}
          >
            {validItems.map((item, index) => (
              <article
                key={`${item.title || "item"}-${index}`}
                onClick={() => openLightbox(index)}
                className="relative cursor-pointer overflow-hidden rounded-sm border border-white/70 bg-slate-200 shadow-[0_6px_20px_rgba(15,23,42,0.18)] group"
              >
                <div className={`relative w-full h-full`}>
                  <Image
                    src={item.image}
                    alt={item.title || "Gallery item"}
                    fill
                    className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                  />

                  <div className="absolute top-2 right-2 z-10 rounded bg-white/80 px-2 py-0.5 text-[11px] font-medium text-slate-700 backdrop-blur-sm">
                    {String(index + 1).padStart(2, "0")}
                  </div>

                  <div className="absolute inset-0 bg-linear-to-t from-black/75 via-black/25 to-transparent" />

                  <div className="absolute inset-x-0 bottom-0 z-10 p-4 md:p-5 text-center text-white">
                    <h3 className="text-xl md:text-2xl font-bold leading-tight drop-shadow-sm">
                      {item.title}
                    </h3>
                    <p className="mt-1 text-sm md:text-base text-white/90">
                      {item.description}
                    </p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>

        {/* Lightbox modal */}
        {lightboxOpen && validItems.length > 0 && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4">
            <button
              className="absolute top-10 right-4 z-60 text-white text-4xl"
              onClick={closeLightbox}
              aria-label="Close gallery"
            >
              ×
            </button>

            <button
              className="absolute left-6 text-white text-5xl"
              onClick={showPrev}
              aria-label="Previous"
            >
              ‹
            </button>

            <div className="max-w-[90%] max-h-[90%] w-full">
              <div className="relative w-full h-[70vh]">
                <Image
                  src={validItems[selectedIndex].image}
                  alt={validItems[selectedIndex].title || "Gallery image"}
                  fill
                  className="object-contain"
                />
              </div>

              <div className="mt-4 text-center text-white">
                <div className="text-lg font-semibold">
                  {validItems[selectedIndex].title}
                </div>
                <div className="text-sm mt-1">
                  {validItems[selectedIndex].description}
                </div>
              </div>
            </div>

            <button
              className="absolute right-6 text-white text-5xl"
              onClick={showNext}
              aria-label="Next"
            >
              ›
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
