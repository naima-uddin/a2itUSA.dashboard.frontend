"use client";
import { useCallback, useEffect, useState, useRef } from "react";
import Link from "next/link";
import { ChevronRight, Sparkles } from "lucide-react";
import {
  createDefaultPricingPageContent,
  normalizePricingPageContent,
} from "./pricingPageData";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

const Pricing = ({ content = null }) => {
  const [activeFaq, setActiveFaq] = useState(null);
  const [showLeftIndicator, setShowLeftIndicator] = useState(false);
  const [showRightIndicator, setShowRightIndicator] = useState(true);
  const [pageContent, setPageContent] = useState(() =>
    normalizePricingPageContent(content || createDefaultPricingPageContent()),
  );
  const [loading, setLoading] = useState(!content);
  const tabsContainerRef = useRef(null);
  const handleScroll = () => {
    if (tabsContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = tabsContainerRef.current;
      setShowLeftIndicator(scrollLeft > 0);
      setShowRightIndicator(scrollLeft < scrollWidth - clientWidth - 1);
    }
  };

  const scrollLeft = () => {
    if (tabsContainerRef.current) {
      tabsContainerRef.current.scrollBy({ left: -200, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (tabsContainerRef.current) {
      tabsContainerRef.current.scrollBy({ left: 200, behavior: "smooth" });
    }
  };

  useEffect(() => {
    handleScroll();
    window.addEventListener("resize", handleScroll);
    return () => window.removeEventListener("resize", handleScroll);
  }, []);

  const [activeService, setActiveService] = useState("Design & Development");
  const [currentPage, setCurrentPage] = useState(0);
  const [hoveredCard, setHoveredCard] = useState(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    if (content) {
      setPageContent(normalizePricingPageContent(content));
      setLoading(false);
      return;
    }

    let isMounted = true;

    fetch(`${API_BASE}/api/pricing-page`)
      .then((res) => res.json())
      .then((data) => {
        if (!isMounted) return;

        setPageContent(
          normalizePricingPageContent(
            data?.page?.content || data?.content || {},
          ),
        );
      })
      .catch((error) => {
        console.error("Error loading pricing page content:", error);
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [content]);

  // Check if device is mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile(); // Initial check
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const services = pageContent.services || [];
  const currentService = services.find(
    (service) => service.category === activeService,
  );

  const getVisiblePackages = (packages = [], page = 0, pageSize = 1) => {
    if (!packages.length) return [];
    if (packages.length <= pageSize) return packages;

    const start = (page * pageSize) % packages.length;
    const end = start + pageSize;

    if (end <= packages.length) {
      return packages.slice(start, end);
    }

    return [
      ...packages.slice(start),
      ...packages.slice(0, end - packages.length),
    ];
  };

  // Determine packages per page based on screen size
  const packagesPerPage = isMobile ? 1 : 3;

  const totalPages = currentService
    ? Math.ceil(currentService.packages.length / packagesPerPage)
    : 0;
  const visiblePackages = getVisiblePackages(
    currentService?.packages || [],
    currentPage,
    packagesPerPage,
  );

  // Navigation functions
  const nextPage = useCallback(() => {
    setCurrentPage((prevPage) => (prevPage + 1) % totalPages);
  }, [totalPages]);

  const prevPage = useCallback(() => {
    setCurrentPage((prevPage) => (prevPage - 1 + totalPages) % totalPages);
  }, [totalPages]);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (totalPages <= 1) return;

      if (e.key === "ArrowLeft") {
        prevPage();
      } else if (e.key === "ArrowRight") {
        nextPage();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [prevPage, nextPage, totalPages]);

  if (loading) {
    return (
      <main className="pt-20 bg-white min-h-screen">
        <div className="flex justify-center items-center h-64">
          <div className="text-xl text-blue-600">Loading pricing data...</div>
        </div>
      </main>
    );
  }

  if (!services.length) {
    return (
      <main className="pt-20 bg-white min-h-screen">
        <div className="flex justify-center items-center h-64">
          <div className="text-xl text-red-600">
            Failed to load pricing content
          </div>
        </div>
      </main>
    );
  }

  if (!currentService) {
    return null;
  }

  // Function to determine card style based on package name
  const getCardStyle = (pkg, isHovered) => {
    const isSpecialPackage = pkg.name === "Special" || pkg.name === "Platinum";

    if (isSpecialPackage) {
      // Special and Platinum packages - Elegant Black Theme
      return {
        headerBg: isHovered
          ? "bg-gradient-to-br from-gray-900 via-black to-gray-900"
          : "bg-gradient-to-br from-gray-900 via-black to-gray-900",
        headerText: "text-white",
        bodyBg: isHovered ? "bg-gray-50" : "bg-white",
        bodyText: "text-gray-700",
        buttonBg: isHovered ? "bg-blue-600" : "bg-blue-500",
        buttonText: "text-white",
        buttonHover: "hover:bg-blue-600",
        borderColor: isHovered ? "border-blue-500" : "border-gray-300",
        shadow: isHovered ? "shadow-2xl ring-2 ring-blue-500/10" : "shadow-xl",
        iconColor: "text-blue-500",
        transform: isHovered
          ? "translateY(-10px) scale-[1.02]"
          : "translateY(0) scale-100",
        priceColor: "text-white",
        accentTop:
          "relative before:absolute before:top-0 before:left-0 before:right-0 before:h-1 before:bg-gradient-to-r before:from-blue-500 before:to-blue-600",
        badge:
          "absolute -top-3 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white px-6 py-2 rounded-full font-bold text-sm shadow-lg",
        badgeText: pkg.name.toUpperCase(),
      };
    } else {
      // Standard packages - Professional Blue Theme
      return {
        headerBg: isHovered
          ? "bg-gradient-to-br from-blue-600 via-blue-500 to-blue-600"
          : "bg-gradient-to-br from-blue-600 via-blue-500 to-blue-600",
        headerText: "text-white",
        bodyBg: isHovered ? "bg-blue-50" : "bg-white",
        bodyText: "text-gray-700",
        buttonBg: isHovered ? "bg-black" : "bg-gray-900",
        buttonText: "text-white",
        buttonHover: "hover:bg-black",
        borderColor: isHovered ? "border-blue-400" : "border-gray-300",
        shadow: isHovered ? "shadow-xl ring-1 ring-blue-400/10" : "shadow-lg",
        iconColor: "text-blue-500",
        transform: isHovered
          ? "translateY(-8px) scale-[1.01]"
          : "translateY(0) scale-100",
        priceColor: "text-white",
        accentTop: "",
        badge: null,
        badgeText: null,
      };
    }
  };

  // Split services into two rows for mobile
  const splitServicesForMobile = () => {
    const midPoint = Math.ceil(services.length / 2);
    return {
      row1: services.slice(0, midPoint),
      row2: services.slice(midPoint),
    };
  };

  const mobileServices = splitServicesForMobile();

  return (
    <>
      <section className="relative py-20 flex items-center justify-center overflow-hidden">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: `url('${pageContent.hero.backgroundImage || "/pricing-img.avif"}')`,
            }}
          ></div>
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-transparent"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent opacity-30"></div>
        </div>

        {/* Geometric Overlay */}
        <div className="absolute inset-0">
          <div className="absolute top-20 right-20 w-64 h-64 border-2 border-blue-500/30 rotate-45"></div>
          <div className="absolute bottom-40 left-32 w-40 h-40 border border-orange-500/20 rotate-12"></div>
          <div className="absolute top-1/3 left-1/4 w-32 h-32 border border-blue-600/10 -rotate-12"></div>
        </div>

        {/* Hero Content */}
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm text-white px-4 py-2 rounded-full mb-8 border border-white/20">
              <Sparkles className="w-4 h-4" />
              <span className="text-sm font-medium">
                {pageContent.hero.badge}
              </span>
            </div>

            <h1 className="text-2xl md:text-3xl lg:text-4xl  xl:text-5xl font-bold mb-6 leading-none ">
              <span className="text-white">{pageContent.hero.titleLine1}</span>
              <div className="relative inline-block ml-2 sm:ml-4">
                <span className="relative z-10 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-800">
                  {pageContent.hero.highlight}
                </span>
                <div className="absolute -bottom-1 sm:-bottom-2 left-0 w-full h-1 sm:h-2 bg-gradient-to-r from-blue-500 to-orange-500"></div>
              </div>
            </h1>

            <p className="text-base sm:text-lg md:text-xl text-white/90 mb-10 max-w-xl leading-relaxed">
              {pageContent.hero.description}
            </p>

            <div className="flex flex-wrap gap-4">
              <Link href={pageContent.hero.primaryButtonHref || "/contact"}>
                <button className="btn-3d flex items-center gap-2 group">
                  {pageContent.hero.primaryButtonLabel}
                  <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
              </Link>

              <Link href={pageContent.hero.secondaryButtonHref || "/portfolio"}>
                <button className="btn-neon flex items-center gap-2 group">
                  {pageContent.hero.secondaryButtonLabel}
                  <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
              </Link>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="text-white text-sm font-medium mb-2">
            Scroll to explore
          </div>
          <div className="w-px h-16 bg-gradient-to-b from-white to-transparent mx-auto"></div>
        </div>

        <style jsx>{`
          .btn-3d {
            padding: 18px 45px;
            font-size: 18px;
            font-weight: 700;
            color: white;
            background: linear-gradient(145deg, #66b2ff, #000099);
            border: none;
            cursor: pointer;
            position: relative;
            transition: all 0.3s ease;
            transform-style: preserve-3d;
            min-width: 220px;
            text-align: center;
            letter-spacing: 0.5px;
            text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
          }

          .btn-3d:hover {
            transform: translateY(-4px) rotateX(10deg);
            box-shadow:
              0 15px 30px rgba(102, 126, 234, 0.4),
              inset 0 -3px 0 rgba(0, 0, 0, 0.2);
            background: linear-gradient(145deg, #764ba2, #667eea);
          }

          .btn-3d:active {
            transform: translateY(-2px);
            box-shadow:
              0 8px 20px rgba(102, 126, 234, 0.3),
              inset 0 -2px 0 rgba(0, 0, 0, 0.2);
          }

          /* Top edge effect */
          .btn-3d::before {
            content: "";
            position: absolute;
            top: 3px;
            left: 3px;
            right: 3px;
            height: 30%;
            background: linear-gradient(rgba(255, 255, 255, 0.3), transparent);
            border-radius: 10px 10px 0 0;
            opacity: 0.6;
          }

          /* Neon Button Style - Fixed white background */
          .btn-neon {
            padding: 18px 45px;
            font-size: 18px;
            font-weight: 700;
            color: white;
            background: linear-gradient(145deg, #66b2ff, #000099);
            border: none;
            cursor: pointer;
            position: relative;
            transition: all 0.3s ease;
            transform-style: preserve-3d;
            min-width: 220px;
            text-align: center;
            letter-spacing: 0.5px;
            text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
          }

          .btn-neon:hover {
            transform: translateY(-4px) rotateX(10deg);
            box-shadow:
              0 15px 30px rgba(102, 126, 234, 0.4),
              inset 0 -3px 0 rgba(0, 0, 0, 0.2);
            background: linear-gradient(145deg, #764ba2, #667eea);
          }

          .btn-neon:active {
            transform: translateY(-2px);
            box-shadow:
              0 8px 20px rgba(245, 87, 108, 0.3),
              inset 0 -2px 0 rgba(0, 0, 0, 0.2);
          }

          /* Top edge effect */
          .btn-neon::before {
            content: "";
            position: absolute;
            top: 3px;
            left: 3px;
            right: 3px;
            height: 30%;
            background: linear-gradient(rgba(255, 255, 255, 0.3), transparent);
            border-radius: 10px 10px 0 0;
            opacity: 0.6;
          }

          /* Responsive */
          /* Responsive */
          @media (max-width: 640px) {
            .btn-3d,
            .btn-neon {
              padding: 8px 10px;
              font-size: 12px;
              min-width: auto; /* 🔑 allow buttons to shrink */
              width: auto;
              letter-spacing: 0.4px;
            }
          }

          /* Extra small devices (very small phones) */
          @media (max-width: 400px) {
            .btn-3d,
            .btn-neon {
              padding: 6px 8px;
              font-size: 10px;
            }
          }
        `}</style>
      </section>

      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12">
        {/* Header */}
        <div className="container mx-auto px-4">
          <section className="py-2">
            <div className="max-w-7xl mx-auto px-4 sm:px-6">
              <div className="text-center mb-3">
                <p className="text-gray-600 text-2xl max-w-4xl mx-auto mb-4 px-4">
                  {pageContent.pricingSection.description}
                </p>

                {/* Enhanced Service Tabs - Responsive for mobile and desktop */}
                <div
                  className={`w-full pb-2 relative ${isMobile ? "" : "px-4"}`}
                >
                  {isMobile ? (
                    // Mobile layout: Grid with 2 items per row
                    <div className="grid grid-cols-2 gap-2 px-2">
                      {services.map((service) => (
                        <button
                          key={service.id}
                          onClick={() => {
                            setActiveService(service.category);
                            setCurrentPage(0);
                          }}
                          className={`px-3 py-2 font-bold text-xs transition-all duration-300 rounded-sm whitespace-nowrap relative overflow-hidden group border ${
                            activeService === service.category
                              ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg shadow-blue-500/30 border-blue-600 transform scale-105"
                              : "bg-white text-gray-700 border-gray-300 hover:bg-blue-50 hover:border-blue-300 hover:text-blue-700"
                          }`}
                        >
                          {/* Active indicator */}
                          {activeService === service.category && (
                            <>
                              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-700 opacity-100"></div>
                              <span className="relative z-10 font-extrabold">
                                {service.category}
                              </span>
                              <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-12 h-1 bg-white rounded-t-full z-20"></div>
                            </>
                          )}
                          {activeService !== service.category && (
                            <span className="relative">{service.category}</span>
                          )}

                          {/* Hover effect for inactive tabs */}
                          {activeService !== service.category && (
                            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/0 to-blue-500/0 group-hover:from-blue-500/5 group-hover:to-blue-500/10 transition-all duration-300"></div>
                          )}
                        </button>
                      ))}
                    </div>
                  ) : (
                    // Desktop layout: Horizontal scroll with indicators
                    <div className="relative px-12">
                      {/* Left indicator arrow - positioned outside the scroll area */}
                      {showLeftIndicator && (
                        <button
                          onClick={scrollLeft}
                          className="absolute left-0 top-1/2 transform -translate-y-1/2 z-30 cursor-pointer hover:scale-110 transition-transform"
                          aria-label="Scroll left"
                        >
                          <div className="w-8 h-8 flex items-center justify-center rounded-full bg-white border border-gray-300 shadow-md hover:shadow-lg hover:border-blue-400">
                            <svg
                              className="w-5 h-5 text-gray-600"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M15 19l-7-7 7-7"
                              />
                            </svg>
                          </div>
                        </button>
                      )}

                      {/* Right indicator arrow - positioned outside the scroll area */}
                      {showRightIndicator && (
                        <button
                          onClick={scrollRight}
                          className="absolute right-0 top-1/2 transform -translate-y-1/2 z-30 cursor-pointer hover:scale-110 transition-transform"
                          aria-label="Scroll right"
                        >
                          <div className="w-8 h-8 flex items-center justify-center rounded-full bg-white border border-gray-300 shadow-md hover:shadow-lg hover:border-blue-400">
                            <svg
                              className="w-5 h-5 text-gray-600"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 5l7 7-7 7"
                              />
                            </svg>
                          </div>
                        </button>
                      )}

                      {/* Scrollable container */}
                      <div
                        ref={tabsContainerRef}
                        className="flex overflow-x-auto scrollbar-hide gap-2 py-2 px-1"
                        onScroll={handleScroll}
                      >
                        {services.map((service) => (
                          <button
                            key={service.id}
                            onClick={() => {
                              setActiveService(service.category);
                              setCurrentPage(0);
                            }}
                            className={`px-6 py-3 font-bold text-sm transition-all duration-300 rounded-sm whitespace-nowrap relative overflow-hidden group border flex-shrink-0 ${
                              activeService === service.category
                                ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg shadow-blue-500/30 border-blue-600 transform scale-105"
                                : "bg-white text-gray-700 border-gray-300 hover:bg-blue-50 hover:border-blue-300 hover:text-blue-700"
                            }`}
                          >
                            {/* Active indicator */}
                            {activeService === service.category && (
                              <>
                                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-700 opacity-100"></div>
                                <span className="relative z-10 font-extrabold">
                                  {service.category}
                                </span>
                                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-16 h-1 bg-white rounded-t-full z-20"></div>
                              </>
                            )}
                            {activeService !== service.category && (
                              <span className="relative">
                                {service.category}
                              </span>
                            )}

                            {/* Hover effect for inactive tabs */}
                            {activeService !== service.category && (
                              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/0 to-blue-500/0 group-hover:from-blue-500/5 group-hover:to-blue-500/10 transition-all duration-300"></div>
                            )}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Enhanced Pricing Cards with Navigation */}
              <div className="relative">
                {/* Left Navigation Arrow - Show only if more than one page */}
                {totalPages > 1 && (
                  <button
                    onClick={prevPage}
                    className={`absolute left-0 top-1/2 transform -translate-y-1/2 z-10 bg-white/90 hover:bg-white border border-gray-300 hover:border-blue-500 rounded-full flex items-center justify-center shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-110 group ${
                      isMobile
                        ? "w-10 h-10 -translate-x-4"
                        : "w-12 h-12 md:w-16 md:h-16 -translate-x-6 md:-translate-x-12"
                    }`}
                    aria-label="Previous page"
                  >
                    <svg
                      className={`text-gray-600 group-hover:text-blue-600 transition-colors duration-300 ${
                        isMobile ? "w-5 h-5" : "w-6 h-6 md:w-8 md:h-8"
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 19l-7-7 7-7"
                      />
                    </svg>
                  </button>
                )}

                {/* Right Navigation Arrow - Show only if more than one page */}
                {totalPages > 1 && (
                  <button
                    onClick={nextPage}
                    className={`absolute right-0 top-1/2 transform -translate-y-1/2 z-10 bg-white/90 hover:bg-white border border-gray-300 hover:border-blue-500 rounded-full flex items-center justify-center shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-110 group ${
                      isMobile
                        ? "w-10 h-10 translate-x-4"
                        : "w-12 h-12 md:w-16 md:h-16 translate-x-6 md:translate-x-12"
                    }`}
                    aria-label="Next page"
                  >
                    <svg
                      className={`text-gray-600 group-hover:text-blue-600 transition-colors duration-300 ${
                        isMobile ? "w-5 h-5" : "w-6 h-6 md:w-8 md:h-8"
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </button>
                )}

                {/* Cards Container - Different grid for mobile vs desktop */}
                <div
                  className={`mb-10 ${isMobile ? "px-8" : "grid grid-cols-1 md:grid-cols-3 gap-8"}`}
                >
                  {visiblePackages.map((pkg, index) => {
                    const isHovered = hoveredCard === pkg.id;
                    const style = getCardStyle(pkg, isHovered);

                    return (
                      <div
                        key={pkg.id}
                        onMouseEnter={() => setHoveredCard(pkg.id)}
                        onMouseLeave={() => setHoveredCard(null)}
                        className={`rounded-sm border-2 ${style.borderColor} ${style.shadow} transition-all duration-500 overflow-hidden ${style.transform} ${style.accentTop} ${
                          isMobile ? "w-full" : ""
                        }`}
                      >
                        {/* Floating Badge for Special/Platinum */}
                        {style.badge && (
                          <div className={style.badge}>{style.badgeText}</div>
                        )}

                        {/* Package Header with Gradient */}
                        <div
                          className={`${style.headerBg} p-6 md:p-10 text-center relative overflow-hidden ${style.badge ? "pt-14 md:pt-16" : "pt-6 md:pt-10"}`}
                        >
                          {/* Package Name */}
                          <div className="mb-4">
                            <h3
                              className={`text-2xl md:text-3xl font-bold ${style.headerText} tracking-tight`}
                            >
                              {pkg.name}
                            </h3>
                          </div>

                          {/* Price with Emphasis */}
                          <div className="mb-4">
                            <div
                              className={`text-4xl md:text-5xl font-black ${style.priceColor} leading-none mb-2`}
                            >
                              {pkg.price}
                            </div>
                            <div className="h-px w-16 md:w-20 bg-white/40 mx-auto"></div>
                          </div>

                          {/* CTA Button */}
                          <Link
                            href="/contact"
                            className={`inline-block w-full py-3 md:py-4 font-bold rounded-sm transition-all duration-300 transform hover:scale-[1.02] ${style.buttonBg} ${style.buttonText} ${style.buttonHover} shadow-lg hover:shadow-xl`}
                          >
                            GET STARTED
                          </Link>
                        </div>

                        {/* Package Features */}
                        <div
                          className={`${style.bodyBg} p-6 md:p-8 transition-colors duration-300`}
                        >
                          <h4
                            className={`text-lg md:text-xl font-semibold mb-6 md:mb-8 text-center ${style.bodyText} relative pb-2`}
                          >
                            <span className="relative">
                              What's Included
                              <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-12 md:w-16 h-1 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full"></div>
                            </span>
                          </h4>
                          <ul className="space-y-3 md:space-y-4">
                            {pkg.features.map((feature, idx) => (
                              <li key={idx} className="flex items-start group">
                                <div className="relative mr-3 md:mr-4">
                                  <div
                                    className={`w-5 h-5 md:w-6 md:h-6 rounded-full ${style.iconColor} bg-blue-100 flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}
                                  >
                                    <svg
                                      className="w-2.5 h-2.5 md:w-3 md:h-3"
                                      fill="currentColor"
                                      viewBox="0 0 20 20"
                                    >
                                      <path
                                        fillRule="evenodd"
                                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                        clipRule="evenodd"
                                      />
                                    </svg>
                                  </div>
                                </div>
                                <span
                                  className={`text-sm md:text-base ${style.bodyText} group-hover:text-gray-900 transition-colors duration-300 flex-1`}
                                >
                                  {feature}
                                </span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* Special Highlight for Special/Platinum */}
                        {(pkg.name === "Special" ||
                          pkg.name === "Platinum") && (
                          <div
                            className={`absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-24 md:w-32 h-1.5 md:h-2 bg-gradient-to-r ${pkg.name === "Special" ? "from-blue-500 to-blue-600" : "from-blue-500 to-blue-600"} rounded-full blur-sm opacity-70`}
                          ></div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </section>

          {/* Interactive FAQ Section */}
          <div className="max-w-7xl mx-auto mb-20 mt-20">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                {pageContent.cta?.faqHeading || "Questions? We've got answers."}
              </h2>
              <p className="text-gray-600 text-lg">
                {pageContent.cta?.faqDescription ||
                  "Everything you need to know about our pricing and plans"}
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {(pageContent.faqs || []).map((faq, index) => (
                <div
                  key={index}
                  className={`relative overflow-hidden rounded-2xl border transition-all duration-500 cursor-pointer ${
                    activeFaq === index
                      ? "border-blue-300 bg-blue-50 shadow-lg scale-[1.02]"
                      : "border-gray-200 bg-white hover:shadow-md"
                  }`}
                  onClick={() =>
                    setActiveFaq(activeFaq === index ? null : index)
                  }
                >
                  <div className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-4">
                        <span className="text-2xl">{faq.icon}</span>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 mb-2">
                            {faq.question}
                          </h3>
                          <div
                            className={`overflow-hidden transition-all duration-500 ${
                              activeFaq === index
                                ? "max-h-48 opacity-100"
                                : "max-h-0 opacity-0"
                            }`}
                          >
                            <p className="text-gray-600">{faq.answer}</p>
                          </div>
                        </div>
                      </div>
                      <div
                        className={`transform transition-transform duration-500 ${
                          activeFaq === index ? "rotate-180" : ""
                        }`}
                      >
                        <svg
                          className="w-5 h-5 text-gray-500"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 9l-7 7-7-7"
                          />
                        </svg>
                      </div>
                    </div>
                  </div>

                  {/* Animated background effect */}
                  <div
                    className={`absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 transition-opacity duration-500 ${
                      activeFaq === index ? "opacity-100" : "opacity-0"
                    }`}
                  ></div>
                </div>
              ))}
            </div>

            {/* FAQ CTA */}
            <div className="text-center mt-12">
              <p className="text-gray-600 mb-6">
                {pageContent.cta?.faqCtaText ||
                  "Still have questions? We're here to help!"}
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link href="/contact">
                  <button className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5">
                    <svg
                      className="w-5 h-5 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                      />
                    </svg>
                    Chat with Support
                  </button>
                </Link>
              </div>
            </div>
          </div>

          {/* Bottom CTA - Floating Card Design */}
          <div className="relative mb-8">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-pink-600/10 rounded-3xl blur-xl"></div>
            <div className="relative bg-gradient-to-r from-blue-900 to-blue-600 rounded-3xl p-12 text-white overflow-hidden">
              {/* Background Pattern */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-32 translate-x-32"></div>
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full translate-y-24 -translate-x-24"></div>

              <div className="relative z-10 text-center">
                <h3 className="text-3xl font-bold mb-4">
                  {pageContent.cta.title}
                </h3>
                <p className="text-blue-100 text-lg mb-8 max-w-2xl mx-auto">
                  {pageContent.cta.description}
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                  <button className="px-8 py-4 bg-white text-blue-600 font-bold rounded-xl hover:bg-gray-100 transition-all duration-300 hover:shadow-2xl hover:-translate-y-1">
                    {pageContent.cta.primaryLabel}
                    <span className="block text-sm font-normal mt-1 text-blue-500">
                      {pageContent.cta.primaryNote}
                    </span>
                  </button>

                  <div className="flex items-center text-white">
                    <div className="w-24 h-px bg-white/30"></div>
                    <span className="px-4 text-sm">OR</span>
                    <div className="w-24 h-px bg-white/30"></div>
                  </div>

                  <Link href={pageContent.cta.secondaryHref || "/contact"}>
                    <button className="px-8 py-4 bg-transparent border-2 border-white/30 text-white font-semibold rounded-xl hover:bg-white/10 hover:border-white/50 transition-all duration-300 group">
                      <div className="flex items-center">
                        <svg
                          className="w-5 h-5 mr-2 group-hover:animate-bounce"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z"
                          />
                        </svg>
                        {pageContent.cta.secondaryLabel}
                      </div>
                    </button>
                  </Link>
                </div>

                <div className="mt-8 text-blue-100/80 text-sm">
                  <div className="flex items-center justify-center space-x-6">
                    {(pageContent.cta.features || []).map((feature) => (
                      <div key={feature} className="flex items-center">
                        <svg
                          className="w-4 h-4 mr-2"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                        {feature}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Pricing;
