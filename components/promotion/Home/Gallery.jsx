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
            description: "Modern UI and strong conversion focus.",
          },
          {
            image: "/promotionPortfolio/serviceSectionImg.png",
            title: "ERP Systems",
            description: "Custom workflows and automation ready.",
          },
          {
            image: "/promotionPortfolio/serviceSectionImg.png",
            title: "SEO Growth",
            description: "Search-focused landing page campaigns.",
          },
        ];

  return (
    <section className="w-full py-10 md:py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-8 md:mb-12">
          <h2
            className="text-3xl md:text-4xl font-bold text-slate-900 mb-3"
            style={{ fontFamily: "var(--font-oswald), sans-serif" }}
          >
            {title}
          </h2>
          <p className="text-slate-600">{description}</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
          {items.map((item, index) => (
            <article
              key={`${item.title}-${index}`}
              className="overflow-hidden rounded-2xl border border-slate-200 shadow-sm bg-slate-50"
            >
              <div className="relative bg-slate-100 h-56 md:h-64 lg:h-72">
                <Image
                  src={item.image}
                  alt={item.title || "Gallery item"}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-4 md:p-5">
                <h3 className="text-lg font-semibold text-slate-900 mb-1">
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
