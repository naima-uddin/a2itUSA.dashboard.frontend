// FeaturedSlider.jsx
"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  FiExternalLink,
  FiStar,
  FiChevronLeft,
  FiChevronRight,
} from "react-icons/fi";
import Image from "next/image";

const CARD_ACCENTS = [
  {
    ring: "ring-blue-200/70",
    bar: "linear-gradient(90deg, rgba(59,130,246,.95), rgba(14,165,233,.70))",
    badge: "bg-blue-50 text-blue-700 border-blue-100",
    button: "linear-gradient(90deg, #1d4ed8, #0f766e)",
  },
  {
    ring: "ring-indigo-200/70",
    bar: "linear-gradient(90deg, rgba(99,102,241,.95), rgba(168,85,247,.70))",
    badge: "bg-indigo-50 text-indigo-700 border-indigo-100",
    button: "linear-gradient(90deg, #4338ca, #7c3aed)",
  },
  {
    ring: "ring-slate-200/70",
    bar: "linear-gradient(90deg, rgba(71,85,105,.95), rgba(148,163,184,.70))",
    badge: "bg-slate-50 text-slate-700 border-slate-200",
    button: "linear-gradient(90deg, #0f172a, #475569)",
  },
  {
    ring: "ring-cyan-200/70",
    bar: "linear-gradient(90deg, rgba(6,182,212,.95), rgba(14,165,233,.70))",
    badge: "bg-cyan-50 text-cyan-700 border-cyan-100",
    button: "linear-gradient(90deg, #0e7490, #0284c7)",
  },
];

const getAccent = (project, index = 0) => {
  const categoryText = Array.isArray(project?.category)
    ? project.category.join(" ")
    : String(project?.category || "");
  const key = `${project?.projectTypes || ""} ${categoryText}`.toLowerCase();

  if (key.includes("affiliate")) return CARD_ACCENTS[1];
  if (key.includes("design")) return CARD_ACCENTS[3];
  if (key.includes("marketing")) return CARD_ACCENTS[0];
  if (key.includes("logistic")) return CARD_ACCENTS[2];

  return CARD_ACCENTS[index % CARD_ACCENTS.length];
};

const FeaturedSlider = ({
  projects,
  openProjectModal,
  sliderIndex,
  setSliderIndex,
  nextSlide,
  prevSlide,
}) => {
  const [currentImageIndices, setCurrentImageIndices] = useState(
    projects.reduce((acc, project, index) => {
      acc[index] = 0;
      return acc;
    }, {}),
  );

  const handleThumbnailClick = (projectIndex, imageIndex) => {
    setCurrentImageIndices((prev) => ({
      ...prev,
      [projectIndex]: imageIndex,
    }));
  };

  const resolvePerformance = (project) =>
    project.performance || project.metrics || [];

  return (
    <div className="relative">
      <div className="relative h-75 sm:h-100 md:h-125 lg:h-137.5 overflow-hidden rounded-2xl sm:rounded-3xl border border-white/70 bg-linear-to-br from-white/92 via-white/84 to-slate-50/88 shadow-[0_24px_80px_rgba(15,23,42,0.10)] backdrop-blur-2xl ring-1 ring-white/70">
        {projects.map((project, index) => {
          const accent = getAccent(project, index);
          const active = sliderIndex === index;
          const currentImage = project.images[currentImageIndices[index]];

          return (
            <motion.div
              key={project.id}
              className="absolute inset-0"
              initial={{ opacity: 0, x: "100%" }}
              animate={{
                opacity: active ? 1 : 0,
                x: active ? "0%" : sliderIndex < index ? "100%" : "-100%",
                zIndex: active ? 10 : 0,
              }}
              transition={{ duration: 0.45, ease: "easeInOut" }}
            >
              <div className="lg:hidden w-full h-full flex flex-col bg-white/85 backdrop-blur-xl">
                <div
                  className={`relative h-56 md:h-72 shrink-0 ring-1 ${accent.ring}`}
                >
                  <Image
                    src={currentImage}
                    alt={`${project.title} - Image ${currentImageIndices[index] + 1}`}
                    fill
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                    sizes="(max-width:640px) 100vw, 50vw"
                  />
                  <div className="absolute inset-0 bg-linear-to-b from-slate-950/10 via-transparent to-slate-950/45" />
                  <div
                    className="absolute top-0 left-0 right-0 h-1.5"
                    style={{ background: accent.bar }}
                  />

                  <div className="absolute top-3 left-3">
                    <div
                      className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold shadow-sm border backdrop-blur-sm ${accent.badge}`}
                    >
                      <FiStar className="w-3 h-3" />
                      Featured
                    </div>
                  </div>

                  <div className="absolute bottom-3 right-3 px-2 py-1 bg-black/60 backdrop-blur-sm rounded-full text-white text-xs">
                    {currentImageIndices[index] + 1} / {project.images.length}
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto p-4 sm:p-6 border-t border-white/60 bg-white/75">
                  <div className="mb-3 flex items-center justify-between gap-2">
                    <span
                      className={`px-2 py-1 text-xs font-semibold rounded-full border ${accent.badge}`}
                    >
                      {project.category}
                    </span>
                    <span className="text-[11px] uppercase tracking-[0.18em] text-slate-400">
                      Featured Work
                    </span>
                  </div>

                  <h3 className="text-lg sm:text-xl font-semibold text-slate-900 mb-2 line-clamp-2">
                    {project.title}
                  </h3>
                  <p className="text-sm text-slate-600 mb-4 line-clamp-2 leading-relaxed">
                    {project.description}
                  </p>

                  <div className="mb-4">
                    <h4 className="text-xs font-semibold text-slate-700 mb-2">
                      Technologies Used
                    </h4>
                    <div className="flex flex-wrap gap-1.5">
                      {(project.technologies || [])
                        .slice(0, 3)
                        .map((tech, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-0.5 bg-white text-slate-700 rounded-full text-xs border border-slate-200 shadow-sm"
                          >
                            {tech}
                          </span>
                        ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 mb-4">
                    {resolvePerformance(project)
                      .slice(0, 2)
                      .map((metric, idx) => (
                        <div
                          key={idx}
                          className="text-center p-2 bg-white rounded-lg border border-slate-200 shadow-sm"
                        >
                          <div className="text-lg sm:text-xl font-bold text-slate-900">
                            {metric.value}
                          </div>
                          <div className="text-xs text-slate-500">
                            {metric.label}
                          </div>
                        </div>
                      ))}
                  </div>

                  {project.features && project.features.length > 0 && (
                    <div className="mb-4">
                      <h4 className="text-xs font-semibold text-slate-700 mb-2">
                        Key Features
                      </h4>
                      <ul className="space-y-1">
                        {project.features.slice(0, 2).map((feature, idx) => (
                          <li
                            key={idx}
                            className="flex items-start gap-1.5 text-xs text-slate-600"
                          >
                            <div
                              className="w-1.5 h-1.5 rounded-full mt-0.5 shrink-0"
                              style={{ background: accent.bar }}
                            />
                            <span className="line-clamp-2">{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <button
                    onClick={() => openProjectModal(project)}
                    className="w-full px-4 py-2.5 text-white text-sm font-medium rounded-lg transition-colors flex items-center justify-center gap-2 shadow-sm"
                    style={{ background: accent.button }}
                  >
                    View Case Study
                    <FiExternalLink className="w-3 h-3" />
                  </button>
                </div>

                {project.images.length > 1 && (
                  <div className="p-3 border-t border-white/60 bg-white/80 backdrop-blur-xl">
                    <div className="flex gap-2 overflow-x-auto scrollbar-hide">
                      {project.images.map((image, imgIndex) => (
                        <button
                          key={imgIndex}
                          onClick={() => handleThumbnailClick(index, imgIndex)}
                          className={`shrink-0 w-12 h-12 rounded-md overflow-hidden border-2 transition-all relative ${
                            currentImageIndices[index] === imgIndex
                              ? "border-slate-900 scale-105"
                              : "border-slate-200 hover:border-slate-300"
                          }`}
                        >
                          <Image
                            src={image}
                            alt={`${project.title} - Thumbnail ${imgIndex + 1}`}
                            fill
                            className="absolute inset-0 w-full h-full object-cover"
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="hidden lg:grid w-full h-full lg:grid-cols-2 gap-8 items-center bg-white/85 backdrop-blur-xl p-6 lg:p-8">
                <div className="relative h-full">
                  <div
                    className={`relative h-80 lg:h-96 rounded-xl lg:rounded-2xl overflow-hidden mb-4 ring-1 ${accent.ring} shadow-[0_18px_40px_rgba(15,23,42,0.12)]`}
                  >
                    <Image
                      src={currentImage}
                      alt={`${project.title} - Image ${currentImageIndices[index] + 1}`}
                      fill
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                      sizes="(max-width:1024px) 100vw, 50vw"
                    />
                    <div className="absolute inset-0 bg-linear-to-r from-slate-950/10 via-transparent to-slate-950/45" />
                    <div
                      className="absolute top-0 left-0 right-0 h-1.5"
                      style={{ background: accent.bar }}
                    />
                    <div className="absolute top-4 left-4">
                      <div
                        className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold shadow-sm border backdrop-blur-sm ${accent.badge}`}
                      >
                        <FiStar className="w-3 h-3" />
                        Featured
                      </div>
                    </div>
                    <div className="absolute bottom-4 right-4 px-3 py-1 bg-black/60 backdrop-blur-sm rounded-full text-white text-sm">
                      {currentImageIndices[index] + 1} / {project.images.length}
                    </div>
                  </div>

                  {project.images.length > 1 && (
                    <div className="flex gap-3 overflow-x-auto py-2 scrollbar-hide">
                      {project.images.map((image, imgIndex) => (
                        <button
                          key={imgIndex}
                          onClick={() => handleThumbnailClick(index, imgIndex)}
                          className={`shrink-0 w-16 h-16 lg:w-20 lg:h-20 rounded-lg overflow-hidden border-2 transition-all relative ${
                            currentImageIndices[index] === imgIndex
                              ? "border-slate-900 scale-105"
                              : "border-slate-200 hover:border-slate-300"
                          }`}
                        >
                          <Image
                            src={image}
                            alt={`${project.title} - Thumbnail ${imgIndex + 1}`}
                            fill
                            className="absolute inset-0 w-full h-full object-cover"
                          />
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <div className="px-2 py-1 lg:px-4 xl:px-8 border-l border-slate-200/80">
                  <div className="mb-3 flex items-center justify-between gap-3">
                    <span
                      className={`px-3 py-1 text-xs font-semibold rounded-full border ${accent.badge}`}
                    >
                      {project.category}
                    </span>
                    <span className="text-[11px] uppercase tracking-[0.18em] text-slate-400">
                      Featured Work
                    </span>
                  </div>

                  <h3 className="text-xl lg:text-2xl font-bold text-slate-900 mb-2">
                    {project.title}
                  </h3>
                  <p className="text-slate-600 mb-4 lg:text-lg leading-relaxed">
                    {project.description}
                  </p>

                  {project.detailedDescription && (
                    <p className="text-slate-500 mb-4 text-sm lg:text-base leading-relaxed line-clamp-3">
                      {project.detailedDescription}
                    </p>
                  )}

                  <div className="mb-4">
                    <h4 className="text-sm font-semibold text-slate-700 mb-2">
                      Technologies Used
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {(project.technologies || [])
                        .slice(0, 5)
                        .map((tech, idx) => (
                          <span
                            key={idx}
                            className="px-3 py-1 bg-white text-slate-700 rounded-full text-xs border border-slate-200 shadow-sm"
                          >
                            {tech}
                          </span>
                        ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-4">
                    {resolvePerformance(project).map((metric, idx) => (
                      <div
                        key={idx}
                        className="text-center px-3 py-3 bg-white rounded-xl border border-slate-200 shadow-sm"
                      >
                        {metric.icon && (
                          <div className="text-xl mb-2">{metric.icon}</div>
                        )}
                        <div className="text-2xl font-bold text-slate-900">
                          {metric.value}
                        </div>
                        <div className="text-sm text-slate-500">
                          {metric.label}
                        </div>
                      </div>
                    ))}
                  </div>

                  {project.features && project.features.length > 0 && (
                    <div className="mb-5">
                      <h4 className="text-sm font-semibold text-slate-700 mb-3">
                        Key Features
                      </h4>
                      <ul className="space-y-1">
                        {project.features.slice(0, 3).map((feature, idx) => (
                          <li
                            key={idx}
                            className="flex items-center gap-2 text-sm text-slate-600"
                          >
                            <div
                              className="w-1.5 h-1.5 rounded-full"
                              style={{ background: accent.bar }}
                            />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <button
                    onClick={() => openProjectModal(project)}
                    className="w-full px-6 py-3 text-white font-medium rounded-md transition-colors flex items-center justify-center gap-2 shadow-sm"
                    style={{ background: accent.button }}
                  >
                    View Full Case Study
                    <FiExternalLink className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {projects.length > 1 && (
        <>
          <div className="absolute top-1/2 left-2 sm:left-4 -translate-y-1/2 z-20">
            <button
              onClick={prevSlide}
              className="w-8 h-8 sm:w-10 sm:h-10 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg bg-white/85 border border-gray-200 hover:bg-slate-50 transition-colors"
            >
              <FiChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-slate-700" />
            </button>
          </div>
          <div className="absolute top-1/2 right-2 sm:right-4 -translate-y-1/2 z-20">
            <button
              onClick={nextSlide}
              className="w-8 h-8 sm:w-10 sm:h-10 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg bg-white/85 border border-gray-200 hover:bg-slate-50 transition-colors"
            >
              <FiChevronRight className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-slate-700" />
            </button>
          </div>
        </>
      )}

      {projects.length > 1 && (
        <div className="flex justify-center gap-1.5 sm:gap-2 mt-4 sm:mt-6 lg:mt-8">
          {projects.map((_, index) => (
            <button
              key={index}
              onClick={() => setSliderIndex(index)}
              className={`h-1.5 sm:h-2 rounded-full transition-all ${
                sliderIndex === index
                  ? "bg-slate-900 w-6 sm:w-8"
                  : "bg-gray-300 w-1.5 sm:w-2 hover:bg-gray-400"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default FeaturedSlider;
