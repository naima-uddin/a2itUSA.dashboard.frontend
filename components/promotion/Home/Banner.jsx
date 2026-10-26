
"use client";

import { useState } from "react";
import Image from "next/image";
import PromotionModal from "@/components/shared/PromotionModal";

const Banner = ({ config = {} }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const heroLines =
    Array.isArray(config.heroLines) && config.heroLines.length
      ? config.heroLines
      : [
          "Design. Develop. Dominate.",
          "Scale Your Brand Without Limits.",
          "Optimize, and scale for global success.",
        ];

  const heading = config.heading || "Big Discount Going ON!!";
  const subheading =
    config.subheading ||
    "Everywhere & Every Device, Your Site Should Flow Seamlessly!";

  const startPrice = config.startPrice || "$99";

  const introText =
    config.introText ||
    "From high-performance websites to full-scale eCommerce, ERP systems, and digital marketing.";

  const primaryLabel = config.primaryLabel || "Start Your Project";
  const secondaryLabel = config.secondaryLabel || "Get Free Consultation";

  const backgroundImage = config.backgroundImage || "/banner.jpeg";
  const mobileBackgroundImage = config.mobileBackgroundImage || "";

  return (
    <>
      <PromotionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={heading}
        subtitle={subheading}
        buttonText={config.modalButtonText || "START YOUR PROJECT NOW"}
        selectedPackage=""
      />

      <section
        className="
          relative isolate w-full overflow-hidden
          min-h-[500px]
          sm:min-h-[540px]
          md:min-h-[580px]
          lg:min-h-[620px]
          xl:min-h-[660px]
          2xl:min-h-[700px]
          flex items-center
          bg-slate-950
          banner-section
        "
        style={{
          fontFamily: "var(--font-oswald), sans-serif",
        }}
      >
        {/* Desktop Background */}
        <div
          className="absolute inset-0 -z-20 hidden md:block"
          style={{
            backgroundImage: `url("${backgroundImage}")`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
          aria-hidden="true"
        />

        {/* Mobile Background */}
        <div
          className="absolute inset-0 -z-20 md:hidden"
          style={{
            backgroundImage: `url("${
              mobileBackgroundImage || backgroundImage
            }")`,
            backgroundSize: "cover",
            backgroundPosition: mobileBackgroundImage
              ? "center"
              : "center top",
            backgroundRepeat: "no-repeat",
          }}
          aria-hidden="true"
        />

        {/* Overlay */}
        <div
          className="
            absolute inset-0 -z-10
            bg-gradient-to-r
            from-black/10 via-transparent to-black/10
            pointer-events-none
          "
          aria-hidden="true"
        />

        {/* Main Content */}
        <div
          className="
            relative z-10 w-full
            px-4 py-12
            min-[480px]:px-6
            sm:py-14
            md:px-8 md:py-16
            lg:px-12 lg:py-20
            xl:px-16
            2xl:px-24
            banner-title
          "
        >
          <div
            className="
              mx-auto w-full max-w-7xl
              md:mx-0
              text-center md:text-left
            "
          >
            {/* Intro */}
            <p
              className="
                hidden md:block
                max-w-xl lg:max-w-2xl
                mb-5 lg:mb-6
                text-slate-100/90
                text-base lg:text-lg xl:text-xl
                leading-relaxed font-medium
                md:pl-4 lg:pl-8
              "
            >
              {introText}
            </p>

            {/* Starting Price */}
            <div
              className="
                mt-8 sm:mt-10
                md:mt-0
                md:pl-8 lg:pl-12 xl:pl-16
              "
            >
              <p
                className="
                  text-white/95 font-semibold
                  text-2xl
                  min-[375px]:text-3xl
                  sm:text-3xl
                  md:text-3xl
                  lg:text-4xl
                  xl:text-[42px]
                  leading-tight
                  break-words
                "
              >
                Starting from{" "}
                <span className="text-[#66B2FF] whitespace-nowrap">
                  {startPrice}
                </span>{" "}
                Only
              </p>
            </div>

            {/* Hero Lines */}
            <div
              className="
                mt-5
                flex flex-col
                items-center md:items-start
                gap-2
                text-sm
                min-[375px]:text-base
                sm:text-base
                md:text-base
                lg:text-lg
                leading-relaxed
                text-white/95
                md:pl-8 lg:pl-12 xl:pl-16
              "
            >
              {heroLines.map((line, index) => (
                <div
                  key={`${line}-${index}`}
                  className="
                    flex items-start
                    justify-center md:justify-start
                    gap-2 sm:gap-3
                    max-w-full
                  "
                >
                  <span className="text-[#66B2FF] font-bold shrink-0">
                    •
                  </span>

                  <span className="min-w-0 break-words">
                    {line}
                  </span>
                </div>
              ))}
            </div>

            {/* CTA Buttons */}
            <div
              className="
                mt-8 sm:mt-9 lg:mt-10
                flex flex-col
                min-[480px]:flex-row
                items-stretch min-[480px]:items-center
                justify-center md:justify-start
                gap-3 sm:gap-4
                md:pl-4 lg:pl-8
              "
            >
              <button
                type="button"
                onClick={() => setIsModalOpen(true)}
                aria-label="Start your project"
                className="
                  inline-flex items-center justify-center gap-2
                  w-full min-[480px]:w-auto
                  min-h-12
                  px-5 sm:px-6 py-3
                  bg-gradient-to-r from-blue-500 to-blue-900
                  hover:from-blue-600 hover:to-blue-950
                  text-white font-semibold
                  text-sm sm:text-base
                  text-center
                  rounded-full
                  shadow-lg
                  transition-all duration-200
                  hover:-translate-y-0.5
                  focus-visible:outline-none
                  focus-visible:ring-2
                  focus-visible:ring-blue-300
                  cursor-pointer
                "
              >
                <span aria-hidden="true">🚀</span>
                <span>{primaryLabel}</span>
              </button>

              <a
                href="tel:+18083015039"
                aria-label="Call for free consultation"
                className="
                  inline-flex items-center justify-center gap-2
                  w-full min-[480px]:w-auto
                  min-h-12
                  px-5 sm:px-6 py-3
                  border border-white/40
                  bg-black/10
                  hover:bg-white/10
                  text-white font-semibold
                  text-sm sm:text-base
                  text-center
                  rounded-full
                  transition-all duration-200
                  focus-visible:outline-none
                  focus-visible:ring-2
                  focus-visible:ring-white
                "
              >
                <span aria-hidden="true">📞</span>
                <span>{secondaryLabel}</span>
              </a>
            </div>
          </div>
        </div>

        {/* Desktop Social Strip */}
        <div
          className="
            hidden md:flex
            absolute top-1/2 -translate-y-1/2
            right-4 lg:right-8 xl:right-12
            items-center flex-col gap-4
            z-20
          "
        >
          <div className="w-px h-8 lg:h-10 bg-gradient-to-b from-transparent via-white/30 to-white/50" />

          <a
            href="https://wa.me/18083015039"
            aria-label="WhatsApp to +1 (808) 301-5039"
            title="WhatsApp"
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-full hover:bg-white/10 transition"
          >
            <Image
              src="/whatsapp.svg"
              width={24}
              height={24}
              alt="WhatsApp"
              className="w-5 h-5 lg:w-6 lg:h-6 opacity-80 hover:opacity-100 transition-opacity"
            />
          </a>

          <a
            href="mailto:info@a2itllc.com"
            aria-label="Email - info@a2itllc.com"
            title="Email"
            className="p-2 rounded-full hover:bg-white/10 transition"
          >
            <Image
              src="/email.svg"
              width={24}
              height={24}
              alt="Email"
              className="w-5 h-5 lg:w-6 lg:h-6 opacity-80 hover:opacity-100 transition-opacity"
            />
          </a>

          <a
            href="https://www.google.com/maps/search/?api=1&query=16192+Coastal+Highway,+Lewes,+DE+19958"
            aria-label="Map - 16192 Coastal Highway, Lewes, DE 19958"
            title="Map"
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-full hover:bg-white/10 transition"
          >
            <Image
              src="/map.svg"
              width={24}
              height={24}
              alt="Map"
              className="w-5 h-5 lg:w-6 lg:h-6 opacity-80 hover:opacity-100 transition-opacity"
            />
          </a>

          <div className="w-px h-8 lg:h-10 bg-gradient-to-b from-white/50 to-white/20" />

          <span
            className="
              text-white/80 text-xs lg:text-sm
              tracking-[0.15em] uppercase
            "
            style={{
              writingMode: "vertical-rl",
              textOrientation: "mixed",
            }}
          >
            Contact
          </span>
        </div>

        {/* Scroll Arrow */}
        <div
          className="
            hidden md:block
            absolute bottom-3 lg:bottom-5
            left-1/2 -translate-x-1/2
            z-10
          "
        >
          <Image
            src="/promotionPortfolio/down-arrow-home.png"
            width={104}
            height={104}
            alt="Scroll Down"
            className="
              animate-bounce
              w-12 h-12
              md:w-14 md:h-14
              lg:w-16 lg:h-16
              xl:w-20 xl:h-20
              object-contain
            "
          />
        </div>
      </section>
    </>
  );
};

export default Banner;