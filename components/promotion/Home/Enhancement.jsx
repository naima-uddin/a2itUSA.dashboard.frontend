import React from 'react';
import Image from 'next/image';

const Enhancement = ({ config = {} }) => {
  const cards = Array.isArray(config.cards) && config.cards.length ? config.cards : [
    {
      image: "/promotionPortfolio/cashback.png",
      title: "Money-Back Policy",
      description: "Risk-free promise",
    },
    {
      image: "/promotionPortfolio/satisfaction.png",
      title: "Customer Satisfaction",
      description: "5‑star results",
    },
    {
      image: "/promotionPortfolio/support.png",
      title: "Round-the-Clock Support",
      description: "Always available",
    },
    {
      image: "/promotionPortfolio/design.png",
      title: "Custom Crafted Designs",
      description: "Tailored to your audience",
    },
  ];
  return (
    <section className="bg-gray-50 pt-2 pb-6 md:pb-8 lg:pb-6 mb-6 md:mb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-5 gap-8 md:gap-16 lg:gap-24 items-center lg:items-end">
        {/* Left - mockup image */}
        <div className="flex justify-start items-end relative lg:col-span-2 lg:self-end">
          {/* Decorative background elements */}
          <div className="absolute inset-0 -z-10">
            {/* Large gradient blob */}
            <div
              className="absolute top-1/4 left-1/4 w-48 h-48 md:w-80 md:h-80 lg:w-96 lg:h-96 rounded-full blur-3xl opacity-60"
              style={{ backgroundImage: "linear-gradient(135deg, rgba(219,234,254,0.9), rgba(238,242,255,0.8), rgba(243,232,255,0.9))" }}
            />
            {/* Secondary gradient */}
            <div
              className="absolute bottom-1/3 right-1/4 w-40 h-40 md:w-64 md:h-64 lg:w-80 lg:h-80 rounded-full blur-2xl opacity-50"
              style={{ backgroundImage: "linear-gradient(315deg, rgba(239,246,255,0.9), rgba(236,254,255,0.8), rgba(255,255,255,0))" }}
            />
            {/* Decorative shapes */}
            <div className="absolute top-12 right-16 w-16 h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 border-2 md:border-3 lg:border-4 border-blue-200/30 rounded-full animate-pulse" />
            <div
              className="absolute bottom-24 left-12 w-10 h-10 md:w-12 md:h-12 lg:w-16 lg:h-16 rounded-2xl rotate-45"
              style={{ backgroundImage: "linear-gradient(135deg, rgba(96,165,250,0.2), rgba(129,140,248,0.2))" }}
            />
            <div className="absolute top-1/2 right-8 w-3 h-3 bg-blue-400 rounded-full animate-bounce" />
            <div className="absolute bottom-1/3 left-1/4 w-2 h-2 bg-indigo-400 rounded-full" />
          </div>
          
          <div className="relative w-full overflow-visible -ml-4 md:-ml-8 lg:-ml-12 mb-6 md:mb-10 lg:mb-12" style={{ maxWidth: "1000px" }}>
            {/* Subtle glow behind image */}
            <div
              className="absolute inset-0 rounded-2xl md:rounded-3xl blur-xl md:blur-2xl scale-95"
              style={{ backgroundImage: "linear-gradient(135deg, rgba(96,165,250,0.08), rgba(129,140,248,0.08), rgba(168,85,247,0.08))" }}
            />
            {/* contained bottom shadow so visible-bottom aligns with cards */}
            <div
              className="absolute bottom-0 left-0 right-0 h-32 md:h-44 lg:h-72 rounded-b-2xl md:rounded-b-3xl -z-10"
              style={{ backgroundImage: "linear-gradient(to top, rgba(30,64,175,0.3), rgba(30,64,175,0.7), rgba(255,255,255,0))" }}
            />
            <Image
              src="/promotionPortfolio/serviceSectionImg.png"
              alt="Service mockups"
              width={1160}
              height={900}
              className="object-contain drop-shadow-xl md:drop-shadow-2xl rounded-lg md:rounded-xl scale-110 md:scale-125 lg:scale-150 transition-transform duration-700 w-full h-auto relative z-10"
              priority
            />
          </div>
          
        </div>

        {/* Right - content + feature cards */}
        <div className="flex flex-col space-y-3 md:space-y-4 lg:pl-8 lg:col-span-3 lg:self-end ml-4 md:ml-0">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold leading-tight text-gray-900" style={{ fontFamily: "var(--font-oswald), sans-serif" }}>
           Unlock Your  
            <span className="block lg:inline"> <span className="bg-clip-text text-transparent" style={{ backgroundImage: "linear-gradient(90deg, #2563eb, #4f46e5)" }}>{config.highlight || "Next Level"}</span> of Professional  </span>
            <span className="bg-clip-text text-transparent" style={{ backgroundImage: "linear-gradient(90deg, #2563eb, #4f46e5)" }}>{config.emphasis || "Growth"}</span>
          </h2>

          <p className="text-sm md:text-base text-gray-600 max-w-xl">
            {config.description || "From concept to launch, we craft memorable brand and product experiences that convert — clear process, measurable results."}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6 mt-auto">
            {cards.map((card, index) => (
              <div key={`${card.title}-${index}`} className={`relative bg-white rounded-xl md:rounded-2xl p-4 md:p-6 shadow-lg border hover:shadow-xl transition-shadow overflow-visible ${index % 2 === 0 ? "mr-4 md:mr-6" : ""}`}>
                <div className="absolute top-3 md:top-4 -left-6 md:-left-8 lg:-left-10 w-12 h-12 md:w-14 md:h-14 lg:w-20 lg:h-20 overflow-visible">
                  <Image src={card.image} alt={card.title} width={160} height={160} quality={100} className="w-full h-full object-contain" />
                </div>
                <div className="pl-7 md:pl-8">
                  <div className="font-semibold text-sm md:text-base text-gray-800">{card.title}</div>
                  <div className="text-xs md:text-sm text-gray-500 mt-1">{card.description}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Enhancement;
