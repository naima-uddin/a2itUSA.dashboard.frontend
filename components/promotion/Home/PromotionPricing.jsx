"use client";
// Add this useState import at the top
import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { ChevronRight, Sparkles } from "lucide-react";
import PromotionModal from "@/components/shared/PromotionModal";

const PromotionPricing = ({ config = {} }) => {
  const [activeFaq, setActiveFaq] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState("");
  // Component fixed to show only the "Design & Development" category — tab/scroll states removed

  const [currentPage, setCurrentPage] = useState(0);
  const [hoveredCard, setHoveredCard] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  // Inlined Design & Development data (component-local)
  const designService = {
    id: 1,
    category: config.category || "Design & Development",
    packages:
      Array.isArray(config.packages) && config.packages.length
        ? config.packages
        : [
            {
              id: "design-special",
              name: "Special",
              price: "$99.00",
              originalPrice: "$199",
              discount: "70% Off",
              color: "teal",
              features: [
                "Custom Website Design",
                "Responsive Layout",
                "5 Page Website",
                "Contact Form",
                "Basic SEO Setup",
                "1 Month Support",
                "Google Analytics Setup",
                "Image Optimization",
                "Basic Accessibility",
                "Deployment to Hosting",
              ],
            },
            {
              id: "design-plus",
              name: "Plus",
              price: "$199.00",
              originalPrice: "$339",
              discount: "70% Off",
              color: "orange",
              features: [
                "Everything in Special",
                "10 Page Website",
                "CMS Integration",
                "Custom Animations",
                "E-commerce Ready",
                "3 Months Support",
                "Performance Optimization",
                "SEO Audit & Fixes",
                "Form Integrations (Mail/CRM)",
                "Staging Environment",
              ],
            },
            {
              id: "design-gold",
              name: "Gold",
              price: "$299.00",
              originalPrice: "$799",
              discount: "70% Off",
              color: "red",
              features: [
                "Everything in Plus",
                "15 Page Website",
                "Advanced SEO",
                "Performance Optimization",
                "Custom Admin Panel",
                "6 Months Support",
                "A/B Testing Setup",
                "Security Hardening",
                "Third-party API Integration",
                "Monthly Analytics Report",
              ],
            },
            {
              id: "design-platinum",
              name: "Platinum",
              price: "$399.00",
              originalPrice: "$799",
              discount: "70% Off",
              color: "blue",
              features: [
                "Everything in Gold",
                "20 Page Website",
                "Custom Plugins",
                "API Integration",
                "Multi-language Support",
                "1 Year Support",
                "Progressive Web App (PWA)",
                "CDN Configuration",
                "Advanced Performance Tuning",
                "Dedicated Project Manager",
              ],
            },
            {
              id: "design-boss",
              name: "The Boss",
              price: "$499.00",
              originalPrice: "$899",
              discount: "70% Off",
              color: "purple",
              features: [
                "Everything in Platinum",
                "Unlimited Pages",
                "Custom Frameworks",
                "Progressive Web App",
                "Advanced Security",
                "Lifetime Updates",
                "SLA & Priority Support",
                "On-site Training",
                "Enterprise Integrations",
                "Dedicated Dev Team",
              ],
            },
            {
              id: "design-diamond",
              name: "Diamond",
              price: "$599.00",
              originalPrice: "$999",
              discount: "70% Off",
              color: "indigo",
              features: [
                "Everything in The Boss",
                "Enterprise Solution",
                "Dedicated Team",
                "Custom AI Features",
                "White Label",
                "24/7 Priority Support",
                "SLA & Dedicated Account Manager",
                "Multi-region Deployments",
                "Custom Integrations & Automation",
                "Continuous Optimization & Monitoring",
              ],
            },
          ],
  };

  // Check if device is mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile(); // Initial check
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const currentService = {
    ...designService,
    packages:
      Array.isArray(config.packages) && config.packages.length
        ? config.packages
        : designService.packages,
  };
  const pricingHeading = config.heading || "WE ARE OPTIMISTS WHO LOVE ";
  const pricingHighlight = config.highlight || "TO WORK TOGETHER";
  const pricingDescription =
    config.description ||
    "Choose the perfect plan for your business needs. All packages come with our commitment to excellence. ";

  // Determine packages per page based on screen size
  const packagesPerPage = isMobile ? currentService.packages.length : 3;

  const totalPages = currentService
    ? Math.ceil(currentService.packages.length / packagesPerPage)
    : 0;
  const startIndex = currentPage * packagesPerPage;
  const visiblePackages =
    currentService?.packages.slice(startIndex, startIndex + packagesPerPage) ||
    [];

  // Reset page when switching between mobile and desktop views
  useEffect(() => {
    setCurrentPage(0);
  }, [isMobile]);

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

  if (!currentService) {
    return null;
  }

  // Function to determine card style based on package color
  const getCardStyle = (pkg, isHovered) => {
    const colorMap = {
      teal: {
        headerBg: "bg-gradient-to-br from-teal-400 to-teal-500",
        buttonBg: "bg-teal-500",
        buttonHover: "hover:bg-teal-600",
        ribbonBg:
          "bg-gradient-to-r from-yellow-500 via-amber-400 to-yellow-600",
        iconBg: "bg-teal-400",
      },
      orange: {
        headerBg: "bg-gradient-to-br from-orange-400 to-orange-500",
        buttonBg: "bg-orange-500",
        buttonHover: "hover:bg-orange-600",
        ribbonBg:
          "bg-gradient-to-r from-yellow-500 via-amber-400 to-yellow-600",
        iconBg: "bg-orange-400",
      },
      red: {
        headerBg: "bg-gradient-to-br from-red-500 to-red-600",
        buttonBg: "bg-red-600",
        buttonHover: "hover:bg-red-700",
        ribbonBg:
          "bg-gradient-to-r from-yellow-500 via-amber-400 to-yellow-600",
        iconBg: "bg-red-500",
      },
      blue: {
        headerBg: "bg-gradient-to-br from-blue-500 to-blue-600",
        buttonBg: "bg-blue-600",
        buttonHover: "hover:bg-blue-700",
        ribbonBg:
          "bg-gradient-to-r from-yellow-500 via-amber-400 to-yellow-600",
        iconBg: "bg-blue-500",
      },
      purple: {
        headerBg: "bg-gradient-to-br from-purple-500 to-purple-600",
        buttonBg: "bg-purple-600",
        buttonHover: "hover:bg-purple-700",
        ribbonBg:
          "bg-gradient-to-r from-yellow-500 via-amber-400 to-yellow-600",
        iconBg: "bg-purple-500",
      },
      indigo: {
        headerBg: "bg-gradient-to-br from-indigo-500 to-indigo-600",
        buttonBg: "bg-indigo-600",
        buttonHover: "hover:bg-indigo-700",
        ribbonBg:
          "bg-gradient-to-r from-yellow-500 via-amber-400 to-yellow-600",
        iconBg: "bg-indigo-500",
      },
    };

    const colors = colorMap[pkg.color] || colorMap.blue;

    return {
      ...colors,
      headerText: "text-white",
      bodyBg: "bg-white",
      bodyText: "text-gray-700",
      buttonText: "text-white",
      borderColor: "border-gray-200",
      shadow: isHovered
        ? "shadow-[0_30px_90px_-45px_rgba(15,23,42,0.32)]"
        : "shadow-[0_20px_50px_-30px_rgba(15,23,42,0.18)]",
      transform: isHovered
        ? "translateY(-8px) scale-[1.02]"
        : "translateY(0) scale-100",
    };
  };

  return (
    <>
      <PromotionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Activate Your 70% Off Coupon!"
        subtitle="Everywhere & Every Device, Your Site Should Flow Seamlessly!"
        buttonText="ACTIVATE YOUR COUPON NOW"
        selectedPackage={selectedPackage}
      />

      <section className="relative py-20 flex items-center justify-center overflow-hidden">
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

          /* Styled scrollbar - visible gray with proper track */
          .thin-scrollbar::-webkit-scrollbar {
            width: 4px;
            height: 4px;
          }
          .thin-scrollbar::-webkit-scrollbar-track {
            background: #f1f5f9;
            border-radius: 4px;
          }
          .thin-scrollbar::-webkit-scrollbar-thumb {
            background: #94a3b8;
            border-radius: 4px;
            border: 2px solid #f1f5f9;
          }
          .thin-scrollbar::-webkit-scrollbar-thumb:hover {
            background: #64748b;
          }
          .thin-scrollbar {
            scrollbar-width: thin;
            scrollbar-color: #94a3b8 #f1f5f9;
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

      <div className="min-h-screen bg-linear-to-b from-gray-50 to-white py-12">
        {/* Header */}
        <div className="container mx-auto">
          <section className="py-2">
            <div className="max-w-7xl mx-auto px-4">
              <div className="text-center mb-3">
                <h2
                  className="text-2xl md:text-3xl lg:text-4xl font-bold text-black mb-2 leading-tight"
                  style={{ fontFamily: "var(--font-oswald), sans-serif" }}
                >
                  {pricingHeading}{" "}
                  <span className="text-blue-600">{pricingHighlight}</span>
                </h2>
                <p
                  className="text-gray-600 text-base sm:text-lg max-w-3xl mx-auto mb-6 px-4"
                  style={{
                    fontFamily: "var(--font-oswald), sans-serif",
                    letterSpacing: "0.02em",
                  }}
                >
                  {pricingDescription}
                </p>
              </div>

              {/* Enhanced Pricing Cards with Navigation */}
              <div className="relative">
                {/* Left Navigation Arrow - Show only if more than one page */}
                {totalPages > 1 && (
                  <button
                    onClick={prevPage}
                    className={`absolute -left-4 md:left-2 top-1/2 transform -translate-y-1/2 z-10 bg-white/90 hover:bg-white border border-gray-300 hover:border-blue-500 rounded-full flex items-center justify-center shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-110 group ${
                      isMobile
                        ? "w-10 h-10 -translate-x-4"
                        : "w-10 h-10 md:w-12 md:h-12 -translate-x-6 md:-translate-x-12"
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
                    className={`absolute -right-4 md:right-2 top-1/2 transform -translate-y-1/2 z-10 bg-white/90 hover:bg-white border border-gray-300 hover:border-blue-500 rounded-full flex items-center justify-center shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-110 group ${
                      isMobile
                        ? "w-10 h-10 translate-x-4"
                        : "w-10 h-10 md:w-12 md:h-12 translate-x-6 md:translate-x-12"
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
                  className={`mb-10 ${isMobile ? "px-1" : "grid grid-cols-1 md:grid-cols-3 gap-8 "}`}
                >
                  {visiblePackages.map((pkg, index) => {
                    const isHovered = hoveredCard === pkg.id;
                    const style = getCardStyle(pkg, isHovered);

                    return (
                      <div
                        key={pkg.id}
                        onMouseEnter={() => setHoveredCard(pkg.id)}
                        onMouseLeave={() => setHoveredCard(null)}
                        className={`rounded-lg overflow-hidden ${style.shadow} transition-all duration-500 ${style.transform} ${
                          isMobile ? "w-full mb-8" : ""
                        } relative bg-white`}
                      >
                        {/* Discount Ribbon - Top Right */}
                        <div className="absolute top-0 right-0 z-20">
                          <div
                            className={`${style.ribbonBg} text-white px-3 py-1 sm:px-5 sm:py-2 font-bold text-xs sm:text-sm shadow-lg ring-1 ring-black/10 whitespace-nowrap max-w-35`}
                            style={{
                              clipPath:
                                "polygon(0 0, 100% 0, 100% 100%, 15% 100%)",
                              minWidth: "90px",
                              maxWidth: "140px",
                              textAlign: "right",
                            }}
                          >
                            {pkg.discount}
                          </div>
                        </div>

                        {/* Package Header with Icon and Background */}
                        <div
                          className={`${style.headerBg} p-4 md:p-8 text-left relative`}
                        >
                          <div className="flex items-start gap-4">
                            {/* Building Icon */}
                            <div className="shrink-0">
                              <div className="h-10 w-10 md:w-16 md:h-16 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm">
                                <svg
                                  className="w-10 h-10 text-white"
                                  fill="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path d="M3 21V8l7-5 7 5v13h-4v-7H8v7H3zm2-2h2v-5h10v5h2V9.5l-5-3.575L7 9.5V19z" />
                                  <rect x="9" y="11" width="2" height="2" />
                                  <rect x="13" y="11" width="2" height="2" />
                                  <rect x="9" y="14" width="2" height="2" />
                                  <rect x="13" y="14" width="2" height="2" />
                                </svg>
                              </div>
                            </div>

                            {/* Package Info */}
                            <div className="flex-1">
                              <h3 className="text-2xl font-bold text-white mb-1 md:mb-2 leading-tight">
                                {pkg.name}
                              </h3>
                              <p className="text-sm text-white/90 font-medium">
                                Best Value for Money Guaranteed!
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Price Section - Separate Background */}
                        <div className="bg-linear-to-br from-gray-50 to-gray-100 px-8 py-2 md:py-6 text-center border-b border-gray-200">
                          <div className="flex items-center justify-center gap-3 mb-1">
                            <span className="text-2xl md:text-6xl font-black text-gray-900">
                              {pkg.price.replace(".00", "")}
                            </span>
                            <span className="text-sm md:text-2xl text-red-500 line-through font-semibold">
                              {pkg.originalPrice}
                            </span>
                          </div>
                        </div>

                        {/* Package Features - Scrollable */}
                        <div className="bg-white px-6 py-2 md:py-4 border-b border-gray-200">
                          <div className="max-h-64 overflow-y-auto pr-2 thin-scrollbar">
                            <ul className="space-y-1 md:space-y-3">
                              {pkg.features.map((feature, idx) => (
                                <li
                                  key={idx}
                                  className="flex items-start gap-3"
                                >
                                  <div className="mt-1 shrink-0 ml-3">
                                    <svg
                                      className={`w-2 h-2 ${style.headerBg.includes("teal") ? "text-teal-500" : style.headerBg.includes("orange") ? "text-orange-500" : style.headerBg.includes("red") ? "text-red-500" : style.headerBg.includes("blue") ? "text-blue-500" : style.headerBg.includes("purple") ? "text-purple-500" : "text-indigo-500"}`}
                                      fill="currentColor"
                                      viewBox="0 0 20 20"
                                    >
                                      <circle cx="10" cy="10" r="10" />
                                    </svg>
                                  </div>
                                  <span className="text-xs md:text-sm text-gray-700 leading-relaxed">
                                    {feature}
                                  </span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>

                        {/* CTA Button */}
                        <div className="p-3 md:p-6 bg-white">
                          <button
                            onClick={() => {
                              setSelectedPackage(pkg.name);
                              setIsModalOpen(true);
                            }}
                            className={`w-full py-2 md:py-4 ${style.buttonBg} ${style.buttonText} ${style.buttonHover} font-bold md:text-base text-sm rounded-md transition-all duration-300 transform hover:scale-[1.02] shadow-lg uppercase tracking-wider cursor-pointer`}
                          >
                            START PROJECT
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </>
  );
};

export default PromotionPricing;
