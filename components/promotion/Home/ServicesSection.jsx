// components/ServicesSection.jsx
"use client";

import React, { useState } from "react";
import PromotionModal from "@/components/shared/PromotionModal";

const ServicesSection = ({ config = {} }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const services =
    Array.isArray(config.services) && config.services.length
      ? config.services
      : [
          "Design & Development",
          "E-Commerce",
          "Amazon",
          "Shopify",
          "ERP System Development",
          "SEO / SEM / PPC",
          "Server and Hosting Services",
          "E-bay",
        ];

  const sectionBackground =
    config.backgroundImage || "/promotionPortfolio/shape.png";

  return (
    <>
      <PromotionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={config.modalTitle || "Big Discount Going ON!!"}
        subtitle={
          config.modalSubtitle ||
          "Everywhere & Every Device, Your Site Should Flow Seamlessly!"
        }
        buttonText={config.modalButtonText || "START YOUR PROJECT NOW"}
        selectedPackage=""
      />

      <section
        className="relative w-full overflow-hidden bg-center bg-cover bg-no-repeat text-white py-10 md:py-20"
        style={{ backgroundImage: `url('${sectionBackground}')` }}
      >
        <div className="absolute inset-0 bg-black/25 pointer-events-none" />
        <div className="absolute -left-20 -top-8 w-96 h-96 bg-white/6 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute right-0 top-10 w-72 h-72 bg-white/4 rounded-full blur-2xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative flex flex-col lg:flex-row items-center gap-6 md:gap-12">
          <div className="w-full lg:w-1/2 flex items-center justify-center lg:justify-start py-4 md:py-8">
            <div className="relative w-full max-w-137.5 h-75 md:h-100 lg:h-125">
              <div className="absolute top-1/4 left-1/4 w-48 h-48 md:w-72 md:h-72 bg-linear-to-br from-cyan-400/40 via-blue-500/40 to-indigo-600/40 rounded-full blur-3xl animate-pulse" />
              <div
                className="absolute bottom-1/4 right-1/4 w-40 h-40 md:w-64 md:h-64 bg-linear-to-tl from-purple-400/40 via-pink-500/40 to-rose-600/40 rounded-full blur-3xl animate-pulse"
                style={{ animationDelay: "1s" }}
              />
              <div
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-36 h-36 md:w-56 md:h-56 bg-linear-to-r from-amber-400/30 to-orange-500/30 rounded-full blur-2xl animate-pulse"
                style={{ animationDelay: "2s" }}
              />

              <div className="absolute top-4 left-2 md:top-8 md:left-4 bg-linear-to-br from-white/15 to-white/5 backdrop-blur-xl border border-white/30 rounded-2xl md:rounded-3xl p-3 md:p-5 shadow-2xl transform -rotate-6 hover:rotate-0 hover:scale-105 transition-all duration-500 group">
                <div className="flex items-start gap-2 md:gap-4">
                  <div className="w-10 h-10 md:w-14 md:h-14 bg-linear-to-br from-cyan-400 via-blue-500 to-indigo-600 rounded-xl md:rounded-2xl flex items-center justify-center shadow-lg group-hover:rotate-12 transition-transform">
                    <svg
                      className="w-5 h-5 md:w-7 md:h-7 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 10V3L4 14h7v7l9-11h-7z"
                      />
                    </svg>
                  </div>
                  <div>
                    <div className="text-white font-bold text-base md:text-xl mb-0.5">
                      10x
                    </div>
                    <div className="text-white font-semibold text-xs md:text-sm mb-1">
                      Faster Launch
                    </div>
                    <div className="text-white/60 text-[10px] md:text-xs max-w-25 md:max-w-35">
                      Deploy in days not months
                    </div>
                  </div>
                </div>
              </div>

              <div className="absolute top-16 right-2 md:top-24 md:right-6 bg-linear-to-br from-white/15 to-white/5 backdrop-blur-xl border border-white/30 rounded-2xl md:rounded-3xl p-3 md:p-5 shadow-2xl transform rotate-6 hover:rotate-0 hover:scale-105 transition-all duration-500 group">
                <div className="flex items-start gap-2 md:gap-4">
                  <div className="w-10 h-10 md:w-14 md:h-14 bg-linear-to-br from-purple-400 via-pink-500 to-rose-600 rounded-xl md:rounded-2xl flex items-center justify-center shadow-lg group-hover:rotate-12 transition-transform">
                    <svg
                      className="w-5 h-5 md:w-7 md:h-7 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <div>
                    <div className="text-white font-bold text-base md:text-xl mb-0.5">
                      100%
                    </div>
                    <div className="text-white font-semibold text-xs md:text-sm mb-1">
                      Satisfaction
                    </div>
                    <div className="text-white/60 text-[10px] md:text-xs max-w-25 md:max-w-35">
                      Guaranteed results
                    </div>
                  </div>
                </div>
              </div>

              <div className="absolute bottom-12 left-2 md:bottom-16 md:left-8 bg-linear-to-br from-white/15 to-white/5 backdrop-blur-xl border border-white/30 rounded-2xl md:rounded-3xl p-3 md:p-5 shadow-2xl transform rotate-3 hover:rotate-0 hover:scale-105 transition-all duration-500 group">
                <div className="flex items-start gap-2 md:gap-4">
                  <div className="w-10 h-10 md:w-14 md:h-14 bg-linear-to-br from-amber-400 via-orange-500 to-red-600 rounded-xl md:rounded-2xl flex items-center justify-center shadow-lg group-hover:rotate-12 transition-transform">
                    <svg
                      className="w-5 h-5 md:w-7 md:h-7 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                      />
                    </svg>
                  </div>
                  <div>
                    <div className="text-white font-bold text-base md:text-xl mb-0.5">
                      5 Star
                    </div>
                    <div className="text-white font-semibold text-xs md:text-sm mb-1">
                      Quality Work
                    </div>
                    <div className="text-white/60 text-[10px] md:text-xs max-w-25 md:max-w-35">
                      Premium excellence
                    </div>
                  </div>
                </div>
              </div>

              <div className="absolute bottom-2 right-4 md:bottom-8 md:right-12 bg-linear-to-br from-white/15 to-white/5 backdrop-blur-xl border border-white/30 rounded-2xl md:rounded-3xl p-3 md:p-5 shadow-2xl transform -rotate-3 hover:rotate-0 hover:scale-105 transition-all duration-500 group">
                <div className="flex items-start gap-2 md:gap-4">
                  <div className="w-10 h-10 md:w-14 md:h-14 bg-linear-to-br from-emerald-400 via-teal-500 to-cyan-600 rounded-xl md:rounded-2xl flex items-center justify-center shadow-lg group-hover:rotate-12 transition-transform">
                    <svg
                      className="w-5 h-5 md:w-7 md:h-7 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <div>
                    <div className="text-white font-bold text-base md:text-xl mb-0.5">
                      $1M+
                    </div>
                    <div className="text-white font-semibold text-xs md:text-sm mb-1">
                      Revenue
                    </div>
                    <div className="text-white/60 text-[10px] md:text-xs max-w-25 md:max-w-35">
                      Generated for clients
                    </div>
                  </div>
                </div>
              </div>

              <div
                className="absolute top-6 right-[45%] w-12 h-12 md:w-20 md:h-20 border-2 md:border-[3px] border-white/25 rounded-full animate-spin"
                style={{ animationDuration: "15s" }}
              />
              <div className="absolute bottom-4 left-[40%] w-10 h-10 md:w-16 md:h-16 border-2 md:border-[3px] border-linear-to-r from-blue-400/30 to-purple-400/30 rounded-lg transform rotate-45 animate-pulse" />
              <div className="absolute top-1/3 right-8 w-3 h-3 bg-yellow-300 rounded-full animate-ping" />
              <div className="absolute top-[60%] left-2 w-2.5 h-2.5 bg-cyan-300 rounded-full animate-pulse" />
              <div className="absolute bottom-[40%] right-4 w-2 h-2 bg-pink-300 rounded-full animate-bounce" />
              <div
                className="absolute top-16 left-[30%] w-1.5 h-1.5 bg-white/40 rounded-full animate-ping"
                style={{ animationDelay: "0.5s" }}
              />
              <div
                className="absolute top-[45%] right-[25%] w-1 h-1 bg-white/40 rounded-full animate-ping"
                style={{ animationDelay: "1.5s" }}
              />
              <div
                className="absolute bottom-24 left-[55%] w-1.5 h-1.5 bg-white/40 rounded-full animate-ping"
                style={{ animationDelay: "2.5s" }}
              />
            </div>
          </div>

          <div className="w-full lg:w-1/2 text-left mt-0 lg:-mt-10 relative z-10">
            <p className="text-white/85 mb-3 md:mb-4 text-sm md:text-base">
              {config.kicker ||
                "In the ever-connected, attention-challenged digital era."}
            </p>
            <h3
              className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight mb-3 md:mb-4"
              style={{ fontFamily: "var(--font-oswald), sans-serif" }}
            >
              {config.title ||
                "Scale faster: award‑winning web & app experiences"}
            </h3>

            <div className="w-12 md:w-16 h-1 bg-white/20 rounded-full mb-4 md:mb-6" />

            <p className="text-white/85 max-w-lg mb-6 md:mb-8 text-sm md:text-base">
              {config.description ||
                "Choose the perfect plan for your business needs. All packages come with our commitment to excellence."}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 md:gap-3 mb-6 md:mb-8 max-w-md">
              {services.map((svc, i) => (
                <div key={i} className="flex items-start gap-2 md:gap-3">
                  <div className="mt-1 shrink-0">
                    <svg
                      className="w-2 h-2 md:w-2.5 md:h-2.5 text-white/90"
                      fill="currentColor"
                      viewBox="0 0 8 8"
                    >
                      <circle cx="4" cy="4" r="4" />
                    </svg>
                  </div>
                  <div className="text-xs md:text-sm text-white/90">{svc}</div>
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center gap-2 md:gap-3 bg-linear-to-r from-blue-400 to-blue-900 px-5 py-2.5 md:px-6 md:py-3 rounded-full text-sm md:text-base font-semibold shadow-2xl transition-transform transform hover:-translate-y-0.5 cursor-pointer relative"
              style={{ zIndex: 100, pointerEvents: "auto" }}
            >
              {config.ctaLabel || "Let&apos;s Get Started"}
            </button>
          </div>
        </div>

        <div className="absolute inset-x-0 bottom-0 -mb-1 pointer-events-none">
          <svg
            viewBox="0 0 1440 320"
            className="w-full h-24 md:h-36 lg:h-48"
            preserveAspectRatio="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fill="#ffffff"
              d="M0,192L48,186.7C96,181,192,171,288,170.7C384,171,480,181,576,176C672,171,768,149,864,128C960,107,1056,85,1152,90.7C1248,96,1344,128,1392,144L1440,160L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
            ></path>
          </svg>
        </div>
      </section>
    </>
  );
};

export default ServicesSection;
