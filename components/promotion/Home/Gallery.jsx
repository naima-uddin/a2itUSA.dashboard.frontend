"use client";

import React from "react";
import Image from "next/image";

export default function Gallery({ config = {} }) {
  const title = config.title || "Explore Our Creative Gallery";
  const description =
    config.description ||
    "Use this section for image-first promotional pages, campaign highlights, and featured work.";
  const items =
    Array.isArray(config.items) && config.items.length
      ? config.items
      : [
          {
            image: "/promotionPortfolio/serviceSectionImg.png",
            title: "Website Design",
            description: "Digital Experiences",
          },
          {
            image: "/promotionPortfolio/serviceSectionImg.png",
            title: "ERP Systems",
            description: "Business Solutions",
          },
          {
            image: "/promotionPortfolio/serviceSectionImg.png",
            title: "SEO Growth",
            description: "Performance Marketing",
          },
        ];

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

  return (
    <section className="w-full py-10 md:py-16 bg-linear-to-b from-white via-slate-50 to-slate-100">
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

        <div className="columns-1 sm:columns-2 lg:columns-4 gap-4 md:gap-5 [column-fill:balance]">
          {items.map((item, index) => (
            <article
              key={`${item.title}-${index}`}
              className="mb-4 break-inside-avoid overflow-hidden rounded-sm border border-white/70 bg-slate-200 shadow-[0_6px_20px_rgba(15,23,42,0.18)] group"
            >
              <div
                className={`relative overflow-hidden bg-slate-100 ${heights[index % heights.length]}`}
              >
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
    </section>
  );
}
