"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  FiExternalLink,
  FiStar,
  FiTrendingUp,
  FiUsers,
  FiTarget,
  FiChevronRight,
  FiChevronLeft,
} from "react-icons/fi";
import ProjectModal from "./ProjectModal";
import FeaturedSlider from "./FeaturedSlider";
import { ChevronRight, Sparkles } from "lucide-react";
import Image from "next/image";
import StatsSection from "./StatsSection";
import Link from "next/link";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

const normalizePortfolioBuckets = (items = []) => {
  const buckets = {
    affiliateProjects: [],
    featuredProjects: [],
    portfolioProjects: [],
  };

  const toArray = (value) => {
    if (Array.isArray(value)) return value.filter(Boolean);
    if (value) return [value];
    return [];
  };

  const projectTypes = (item) => {
    const explicitTypes = toArray(item.projectTypes).map((type) =>
      String(type).trim().toLowerCase(),
    );
    return explicitTypes;
  };

  items.forEach((item) => {
    if (!item || typeof item !== "object") return;

    const normalizedItem = {
      ...item,
      category: Array.isArray(item.category)
        ? item.category
        : item.category
          ? [item.category]
          : [],
      images: Array.isArray(item.images)
        ? item.images
        : item.image
          ? [item.image]
          : [],
      performance: Array.isArray(item.performance)
        ? item.performance
        : Array.isArray(item.metrics)
          ? item.metrics
          : [],
      technologies: Array.isArray(item.technologies) ? item.technologies : [],
      features: Array.isArray(item.features) ? item.features : [],
    };

    const types = projectTypes(item);
    const hasAffiliate = types.includes("affiliate");
    const hasFeatured = types.includes("featured");
    const hasPortfolio = types.includes("portfolio");

    if (hasAffiliate) {
      buckets.affiliateProjects.push(normalizedItem);
    }

    if (hasFeatured) {
      buckets.featuredProjects.push(normalizedItem);
    }

    if (hasPortfolio || (!hasAffiliate && !hasFeatured)) {
      buckets.portfolioProjects.push(normalizedItem);
    }
  });

  return buckets;
};

const CARD_ACCENTS = [
  {
    ring: "ring-blue-200/70",
    badge: "bg-blue-50 text-blue-700 border-blue-100",
    dot: "bg-blue-500",
    bar: "linear-gradient(90deg, rgba(59,130,246,.95), rgba(14,165,233,.75))",
    name: "Blue",
  },
  {
    ring: "ring-indigo-200/70",
    badge: "bg-indigo-50 text-indigo-700 border-indigo-100",
    dot: "bg-indigo-500",
    bar: "linear-gradient(90deg, rgba(99,102,241,.95), rgba(168,85,247,.75))",
    name: "Indigo",
  },
  {
    ring: "ring-slate-200/70",
    badge: "bg-slate-50 text-slate-700 border-slate-200",
    dot: "bg-slate-500",
    bar: "linear-gradient(90deg, rgba(71,85,105,.95), rgba(148,163,184,.75))",
    name: "Slate",
  },
  {
    ring: "ring-cyan-200/70",
    badge: "bg-cyan-50 text-cyan-700 border-cyan-100",
    dot: "bg-cyan-500",
    bar: "linear-gradient(90deg, rgba(6,182,212,.95), rgba(14,165,233,.75))",
    name: "Cyan",
  },
];

const getCardAccent = (project, index = 0) => {
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

const Portfolio = () => {
  const [portfolioData, setPortfolioData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState("all");
  const [selectedProject, setSelectedProject] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [sliderIndex, setSliderIndex] = useState(0);
  const [affiliateSliderIndex, setAffiliateSliderIndex] = useState(0);
  const [portfolioSliderIndex, setPortfolioSliderIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [desktopColumns, setDesktopColumns] = useState(5);
  const [desktopVisibleRows, setDesktopVisibleRows] = useState(2);

  // Update categories based on your actual data
  const getCategoryCounts = () => {
    const allProjects = getPortfolioProjects();

    const hasCategory = (project, categoryId) => {
      if (!project.category) return false;

      // Handle both string and array categories
      if (Array.isArray(project.category)) {
        return project.category.some((cat) =>
          cat.toLowerCase().includes(categoryId.toLowerCase()),
        );
      }

      // For string categories
      return project.category.toLowerCase().includes(categoryId.toLowerCase());
    };

    const counts = {
      all: allProjects.length,
      web: allProjects.filter((p) => hasCategory(p, "web")).length,
      mobile: allProjects.filter((p) => hasCategory(p, "mobile")).length,
      ecommerce: allProjects.filter(
        (p) => hasCategory(p, "e-commerce") || hasCategory(p, "ecommerce"),
      ).length,
      design: allProjects.filter(
        (p) => hasCategory(p, "ui/ux") || hasCategory(p, "design"),
      ).length,
      affiliate: allProjects.filter((p) => hasCategory(p, "affiliate")).length,
      wordpress: allProjects.filter((p) => hasCategory(p, "wordpress")).length,
      logistics: allProjects.filter(
        (p) => hasCategory(p, "logistics") || hasCategory(p, "logistic"),
      ).length,
      marketing: allProjects.filter(
        (p) =>
          hasCategory(p, "marketing") || hasCategory(p, "digital marketing"),
      ).length,
    };

    return [
      { id: "all", name: "All Projects", count: counts.all },
      { id: "web", name: "Web Development", count: counts.web },
      { id: "affiliate", name: "Affiliate", count: counts.affiliate },
      { id: "ecommerce", name: "E-commerce", count: counts.ecommerce },
      { id: "mobile", name: "Mobile Apps", count: counts.mobile },
      { id: "wordpress", name: "WordPress", count: counts.wordpress },
      { id: "design", name: "UI/UX Design", count: counts.design },
      { id: "logistics", name: "Logistics", count: counts.logistics },
      { id: "marketing", name: "Marketing", count: counts.marketing },
    ];
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${API_BASE}/api/portfolio`);
        const data = await response.json();
        setPortfolioData(normalizePortfolioBuckets(data.portfolios || []));
      } catch (err) {
        console.error("Error loading portfolio data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    // Check screen size
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
      setDesktopColumns(window.innerWidth >= 1024 ? 5 : 4);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Auto slide for portfolio projects on mobile
  useEffect(() => {
    if (isMobile && getFilteredProjects().length > 1) {
      const interval = setInterval(() => {
        setPortfolioSliderIndex(
          (prev) => (prev + 1) % getFilteredProjects().length,
        );
      }, 6000);

      return () => clearInterval(interval);
    }
  }, [isMobile, activeFilter]);

  useEffect(() => {
    setDesktopVisibleRows(2);
    setPortfolioSliderIndex(0);
  }, [activeFilter, desktopColumns]);

  // Get all projects from the new structure
  const getAllProjects = () => {
    if (!portfolioData) return [];
    const allProjects = [
      ...portfolioData.affiliateProjects,
      ...portfolioData.featuredProjects,
      ...portfolioData.portfolioProjects,
    ];

    const seen = new Set();
    return allProjects.filter((project) => {
      const key =
        project?._id || project?.id || `${project?.title}-${project?.image}`;
      if (!key || seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  };

  // Get affiliate projects
  const getAffiliateProjects = () => {
    if (!portfolioData) return [];
    return portfolioData.affiliateProjects || [];
  };

  // Get featured projects for slider
  const getFeaturedProjects = () => {
    if (!portfolioData) return [];
    return portfolioData.featuredProjects || [];
  };

  // Get portfolio projects for grid
  const getPortfolioProjects = () => {
    if (!portfolioData) return [];
    return portfolioData.portfolioProjects || [];
  };

  // Filter portfolio projects by category
  const getFilteredProjects = () => {
    const allPortfolioProjects = getPortfolioProjects();

    if (activeFilter === "all") return allPortfolioProjects;

    // Helper function to check category match
    const matchesCategory = (project) => {
      if (!project.category) return false;

      // Handle array categories
      if (Array.isArray(project.category)) {
        const categories = project.category.map((c) => c.toLowerCase());

        switch (activeFilter) {
          case "web":
            return categories.some(
              (cat) => cat.includes("web") || cat.includes("development"),
            );
          case "mobile":
            return categories.some(
              (cat) => cat.includes("mobile") || cat.includes("app"),
            );
          case "ecommerce":
            return categories.some(
              (cat) =>
                cat.includes("e-commerce") ||
                cat.includes("commerce") ||
                cat.includes("shop") ||
                cat.includes("store"),
            );

          case "design":
            return categories.some(
              (cat) =>
                cat.includes("ui") ||
                cat.includes("ux") ||
                cat.includes("design"),
            );
          case "marketing":
            return categories.some(
              (cat) =>
                cat.includes("marketing") || cat.includes("digital marketing"),
            );
          case "affiliate":
            return categories.some((cat) => cat.includes("affiliate"));
          case "wordpress":
            return categories.some((cat) => cat.includes("wordpress"));
          case "logistics":
            return categories.some(
              (cat) => cat.includes("logistic") || cat.includes("logistics"),
            );
          default:
            return false;
        }
      }

      // Handle string category (backward compatibility)
      const category = project.category.toLowerCase();

      switch (activeFilter) {
        case "web":
          return category.includes("web") || category.includes("development");
        case "mobile":
          return category.includes("mobile") || category.includes("app");
        case "ecommerce":
          return (
            category.includes("e-commerce") || category.includes("commerce")
          );
        case "design":
          return (
            category.includes("ui") ||
            category.includes("ux") ||
            category.includes("design")
          );
        case "marketing":
          return (
            category.includes("marketing") ||
            category.includes("digital marketing")
          );
        case "logistics":
          return (
            category.includes("logistic") || category.includes("logistics")
          );
        case "wordpress":
          return category.includes("wordpress");
        case "affiliate":
          return category.includes("affiliate");
        default:
          return false;
      }
    };

    return allPortfolioProjects.filter(matchesCategory);
  };

  const openProjectModal = (project) => {
    setSelectedProject(project);
    setModalOpen(true);
  };

  // Slider navigation for Featured Work
  const nextSlide = () => {
    const projects = getFeaturedProjects();
    if (projects.length > 0) {
      setSliderIndex((prev) => (prev + 1) % projects.length);
    }
  };

  const prevSlide = () => {
    const projects = getFeaturedProjects();
    if (projects.length > 0) {
      setSliderIndex((prev) => (prev - 1 + projects.length) % projects.length);
    }
  };

  // Affiliate slider navigation
  const nextAffiliateSlide = () => {
    const projects = getAffiliateProjects();
    if (projects.length > 0) {
      setAffiliateSliderIndex((prev) => (prev + 1) % projects.length);
    }
  };

  const prevAffiliateSlide = () => {
    const projects = getAffiliateProjects();
    if (projects.length > 0) {
      setAffiliateSliderIndex(
        (prev) => (prev - 1 + projects.length) % projects.length,
      );
    }
  };

  const affiliateProjects = getAffiliateProjects();
  const visibleAffiliateProjects =
    affiliateProjects.length > 0
      ? Array.from(
          { length: Math.min(3, affiliateProjects.length) },
          (_, idx) =>
            affiliateProjects[
              (affiliateSliderIndex + idx) % affiliateProjects.length
            ],
        )
      : [];

  // Portfolio slider navigation
  const nextPortfolioSlide = () => {
    const projects = getFilteredProjects();
    if (projects.length > 0) {
      setPortfolioSliderIndex((prev) => (prev + 1) % projects.length);
    }
  };

  const prevPortfolioSlide = () => {
    const projects = getFilteredProjects();
    if (projects.length > 0) {
      setPortfolioSliderIndex(
        (prev) => (prev - 1 + projects.length) % projects.length,
      );
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="space-y-4">
          <div className="w-16 h-16 mx-auto border-2 border-gray-900 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-sm text-gray-500">Loading portfolio...</p>
        </div>
      </div>
    );
  }

  const categories = getCategoryCounts();
  const filteredProjects = getFilteredProjects();
  const desktopVisibleCount = desktopVisibleRows * desktopColumns;
  const desktopVisibleProjects = filteredProjects.slice(0, desktopVisibleCount);
  const hasMoreDesktopProjects = desktopVisibleCount < filteredProjects.length;
  const canShowViewLess = desktopVisibleRows > 2;

  return (
    <>
      <div className="bg-white/70 text-gray-900">
        {/* Hero Section with Image */}
        <section className="relative min-h-[50vh] sm:min-h-[60vh] md:min-h-[70vh] py-12 sm:py-16 md:py-20 flex items-center justify-center overflow-hidden border-b border-white/10">
          {/* Background Image with Overlay */}
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-[url('/portfolio.png')] bg-cover bg-center"></div>
            <div className="absolute inset-0 bg-linear-to-r from-slate-950/92 via-blue-950/80 to-transparent"></div>
            <div className="absolute inset-0 bg-linear-to-t from-white via-transparent to-transparent opacity-20"></div>
          </div>

          {/* Geometric Overlay */}
          <div className="absolute inset-0">
            <div className="absolute top-20 right-20 w-64 h-64 border border-white/10 rotate-45 rounded-4xl"></div>
            <div className="absolute bottom-40 left-32 w-40 h-40 border border-white/10 rotate-12 rounded-3xl"></div>
            <div className="absolute top-1/3 left-1/4 w-32 h-32 border border-white/10 -rotate-12 rounded-2xl"></div>
            <div className="absolute top-1/2 right-1/3 w-48 h-48 border border-white/10 rotate-45 rounded-3xl"></div>
          </div>

          {/* Hero Content */}
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-full mb-4 sm:mb-6 md:mb-8 border border-white/20 text-xs sm:text-sm shadow-sm">
                <FiStar className="w-4 h-4" />
                <span className="text-sm font-medium">
                  {getAllProjects().length}+ Successful Projects
                </span>
              </div>

              <h1 className="text-3xl md:text-4xl lg:text-5xl xl:text-5xl font-bold mb-6 leading-none">
                <span className="text-white">Our Creative</span>
                <div className="relative inline-flex ml-2 sm:ml-4 items-center">
                  <span className="relative z-10 text-transparent bg-clip-text bg-linear-to-r from-blue-300 to-purple-300 text-3xl sm:text-4xl">
                    Portfolio
                  </span>
                  <Sparkles className="ml-3 text-white/80 w-4 h-4" />
                  <div className="absolute -bottom-1 sm:-bottom-2 left-0 w-full h-1 sm:h-2 bg-linear-to-r from-blue-400 to-purple-400"></div>
                </div>
              </h1>

              <p className="text-lg sm:text-xl md:text-2xl text-white/90 mb-6 sm:mb-8 md:mb-10 max-w-2xl leading-relaxed tracking-tight">
                Explore our diverse collection of web development, mobile apps,
                e-commerce platforms, and digital marketing solutions. Each
                project represents our commitment to excellence and innovation.
              </p>

              {/* Quick Stats */}
              <div className="grid grid-cols-3 gap-4 sm:gap-6 mt-8 sm:mt-12">
                <div className="text-center">
                  <div className="text-2xl sm:text-3xl md:text-3xl font-bold text-white mb-1">
                    120+
                  </div>
                  <div className="text-xs sm:text-sm text-white/70">
                    Projects
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl sm:text-3xl md:text-3xl font-bold text-white mb-1">
                    100%
                  </div>
                  <div className="text-xs sm:text-sm text-white/70">
                    Satisfaction
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl sm:text-3xl md:text-3xl font-bold text-white mb-1">
                    50K+
                  </div>
                  <div className="text-xs sm:text-sm text-white/70">Users</div>
                </div>
              </div>
            </div>
          </div>

          {/* Scroll Indicator */}
          <div className="hidden md:block absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce">
            <div className="text-white text-sm font-medium mb-2">
              Scroll to explore
            </div>
            <div className="w-px h-16 bg-linear-to-b from-white to-transparent mx-auto"></div>
          </div>
        </section>

        <div className="min-h-screen bg-white">
          {/* Affiliate & Partnership Projects */}
          <section className="py-6 bg-linear-to-b from-white via-slate-50 to-white border-y border-slate-100">
            <div className="container mx-auto px-4">
              <div className="text-center mb-6">
                <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-slate-900 text-white rounded-full text-xs sm:text-sm font-medium mb-2 sm:mb-3 shadow-sm">
                  <FiTarget className="w-3 h-3 sm:w-4 sm:h-4" />
                  Partnership Projects
                </div>
                <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-slate-900  tracking-tight">
                  Affiliate & Collaboration Works
                </h2>
                <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto mb-6 leading-relaxed">
                  Special projects developed in partnership with industry
                  leaders
                </p>
              </div>

              {/* Mobile View - Single Card with Slider */}
              <div className="md:hidden ">
                {affiliateProjects.length > 0 && (
                  <>
                    {/* Current Card */}
                    <motion.div
                      key={affiliateSliderIndex}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="relative"
                    >
                      <div className="bg-white/80 backdrop-blur-xl border border-white/70 rounded-3xl overflow-hidden shadow-[0_18px_50px_rgba(15,23,42,0.10)] hover:-translate-y-1 hover:shadow-[0_24px_70px_rgba(15,23,42,0.14)] transition transform duration-300 ring-1 ring-white/60">
                        {/* Image */}
                        <div className="relative h-48 sm:h-56 overflow-hidden">
                          <Image
                            src={
                              affiliateProjects[affiliateSliderIndex].images[0]
                            }
                            alt={affiliateProjects[affiliateSliderIndex].title}
                            fill
                            className="absolute inset-0 w-full h-full object-cover"
                            sizes="(max-width:768px) 100vw, 33vw"
                          />

                          {/* Category badge */}
                          <div className="absolute top-3 left-3">
                            <span className="px-2 py-1 bg-white/70 backdrop-blur-md text-slate-700 text-xs font-semibold rounded-full shadow-sm border border-white/60">
                              {affiliateProjects[affiliateSliderIndex].category}
                            </span>
                          </div>

                          {/* Partnership badge */}
                          <div className="absolute top-3 right-3">
                            <span className="px-2 py-1 bg-amber-50/90 text-amber-700 text-xs font-medium rounded-full shadow-sm border border-amber-100">
                              Partnership
                            </span>
                          </div>
                        </div>

                        {/* Content */}
                        <div className="p-4">
                          <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-1">
                            {affiliateProjects[affiliateSliderIndex].title}
                          </h3>
                          <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                            {
                              affiliateProjects[affiliateSliderIndex]
                                .description
                            }
                          </p>

                          <div className="flex items-center justify-between">
                            <div className="space-y-1">
                              {affiliateProjects[affiliateSliderIndex]
                                .performance &&
                                affiliateProjects[
                                  affiliateSliderIndex
                                ].performance
                                  .slice(0, 2)
                                  .map((metric, idx) => (
                                    <div
                                      key={idx}
                                      className="flex items-center gap-2"
                                    >
                                      <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                                      <span className="text-xs">
                                        <span className="font-bold text-gray-900">
                                          {metric.value}
                                        </span>
                                        <span className="text-gray-500 ml-1">
                                          {metric.label}
                                        </span>
                                      </span>
                                    </div>
                                  ))}
                            </div>
                            <button
                              onClick={() =>
                                openProjectModal(
                                  affiliateProjects[affiliateSliderIndex],
                                )
                              }
                              className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors flex items-center gap-2 shadow-sm"
                            >
                              View Case
                              <FiExternalLink className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </motion.div>

                    {/* Slider Controls and Dots */}
                    {affiliateProjects.length > 1 && (
                      <>
                        <div className="flex justify-center items-center gap-4 mt-6">
                          <button
                            onClick={prevAffiliateSlide}
                            className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                          >
                            <FiChevronLeft className="w-5 h-5 text-gray-700" />
                          </button>

                          <div className="flex gap-2">
                            {affiliateProjects.map((_, index) => (
                              <button
                                key={index}
                                onClick={() => setAffiliateSliderIndex(index)}
                                className={`w-2 h-2 rounded-full transition-colors ${
                                  affiliateSliderIndex === index
                                    ? "bg-blue-600"
                                    : "bg-gray-300"
                                }`}
                              />
                            ))}
                          </div>

                          <button
                            onClick={nextAffiliateSlide}
                            className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                          >
                            <FiChevronRight className="w-5 h-5 text-gray-700" />
                          </button>
                        </div>
                      </>
                    )}
                  </>
                )}
              </div>

              {/* Desktop View - Row Slider */}
              <div className="hidden md:block -mt-8">
                {affiliateProjects.length > 0 && (
                  <div className="relative">
                    <div className="flex items-center justify-between mb-4">
                      <button
                        onClick={prevAffiliateSlide}
                        className="p-2 rounded-full bg-white border border-slate-200 shadow-sm hover:bg-slate-50 transition-colors"
                        aria-label="Previous affiliate project"
                      >
                        <FiChevronLeft className="w-5 h-5 text-slate-700" />
                      </button>

                      <button
                        onClick={nextAffiliateSlide}
                        className="p-2 rounded-full bg-white border border-slate-200 shadow-sm hover:bg-slate-50 transition-colors"
                        aria-label="Next affiliate project"
                      >
                        <FiChevronRight className="w-5 h-5 text-slate-700" />
                      </button>
                    </div>

                    <div className="overflow-hidden">
                      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
                        {visibleAffiliateProjects.map((project, index) => (
                          <motion.div
                            key={`${project.id}-${affiliateSliderIndex}-${index}`}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3 }}
                            className="group relative"
                          >
                            <div className="bg-white/80 backdrop-blur-xl border border-white/70 rounded-3xl overflow-hidden shadow-[0_18px_50px_rgba(15,23,42,0.10)] hover:-translate-y-1 hover:shadow-[0_24px_70px_rgba(15,23,42,0.14)] transition transform duration-300 ring-1 ring-white/60">
                              <div className="relative h-64 overflow-hidden">
                                <Image
                                  src={project.images[0]}
                                  alt={project.title}
                                  fill
                                  className="absolute inset-0 w-full h-full object-cover opacity-100 transition-all duration-500 group-hover:opacity-0 group-hover:scale-110"
                                />
                                <Image
                                  src={project.images[1] || project.images[0]}
                                  alt={`${project.title} - hover view`}
                                  fill
                                  className="absolute inset-0 w-full h-full object-cover opacity-0 transition-all duration-500 group-hover:opacity-100 group-hover:scale-110"
                                />

                                <div className="absolute top-4 left-4">
                                  <span className="px-3 py-1 bg-white/70 backdrop-blur-md text-slate-700 text-xs font-semibold rounded-full shadow-sm border border-white/60">
                                    {Array.isArray(project.category)
                                      ? project.category[0]
                                      : project.category}
                                  </span>
                                </div>

                                <div className="absolute top-4 right-4">
                                  <span className="px-3 py-1 bg-amber-50/90 text-amber-700 text-xs font-medium rounded-full shadow-sm border border-amber-100">
                                    Partnership
                                  </span>
                                </div>
                              </div>

                              <div className="p-6">
                                <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-1">
                                  {project.title}
                                </h3>
                                <p className="text-gray-600 mb-6 text-sm line-clamp-2">
                                  {project.description}
                                </p>

                                <div className="flex items-center justify-between">
                                  <div className="space-y-2">
                                    {project.performance &&
                                      project.performance
                                        .slice(0, 2)
                                        .map((metric, metricIndex) => (
                                          <div
                                            key={metricIndex}
                                            className="flex items-center gap-2"
                                          >
                                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                            <span className="text-sm">
                                              <span className="font-bold text-gray-900">
                                                {metric.value}
                                              </span>
                                              <span className="text-gray-500 ml-2">
                                                {metric.label}
                                              </span>
                                            </span>
                                          </div>
                                        ))}
                                  </div>
                                  <button
                                    onClick={() => openProjectModal(project)}
                                    className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors flex items-center gap-2 shadow-sm"
                                  >
                                    View Case
                                    <FiExternalLink className="w-4 h-4" />
                                  </button>
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* Featured Work Slider */}
          <section className="py-10 sm:py-12 bg-white border-y border-slate-100">
            <div className="container mx-auto px-4">
              <div className="text-center mb-6 sm:mb-8">
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900 mb-2 tracking-tight">
                  Featured Work
                </h2>
                <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed">
                  Our most impactful projects that showcase excellence in
                  digital innovation
                </p>
              </div>

              {getFeaturedProjects().length > 0 ? (
                <FeaturedSlider
                  projects={getFeaturedProjects()}
                  openProjectModal={openProjectModal}
                  sliderIndex={sliderIndex}
                  setSliderIndex={setSliderIndex}
                  nextSlide={nextSlide}
                  prevSlide={prevSlide}
                />
              ) : (
                <div className="text-center py-8 sm:py-12">
                  <p className="text-gray-500">
                    No featured projects available
                  </p>
                </div>
              )}
            </div>
          </section>

          {/* Portfolio Projects Grid */}
          <section
            id="portfolio-projects"
            className="py-12 sm:py-20 bg-linear-to-b from-slate-50 via-white to-slate-50"
          >
            <div className="container mx-auto px-4">
              <div className="mb-8 sm:mb-12">
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900 mb-4 sm:mb-6 tracking-tight">
                  Portfolio Projects
                </h2>

                {/* Filter Tabs - Dynamically generated */}
                <div className="flex flex-wrap gap-1.5 sm:gap-2">
                  {categories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => {
                        setActiveFilter(category.id);
                        setPortfolioSliderIndex(0); // Reset to first slide when changing filter
                      }}
                      className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium transition-colors ${
                        activeFilter === category.id
                          ? "bg-slate-900 text-white shadow-md"
                          : "bg-white text-slate-700 hover:bg-slate-100 border border-gray-200"
                      }`}
                    >
                      {category.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Mobile View - Single Card Slider */}
              <div className="md:hidden">
                {filteredProjects.length > 0 ? (
                  <>
                    {(() => {
                      const currentProject =
                        filteredProjects[portfolioSliderIndex];
                      const accent = getCardAccent(
                        currentProject,
                        portfolioSliderIndex,
                      );
                      const categories = Array.isArray(currentProject.category)
                        ? currentProject.category
                        : currentProject.category
                          ? [currentProject.category]
                          : [];
                      const performance = Array.isArray(
                        currentProject.performance,
                      )
                        ? currentProject.performance
                        : [];

                      return (
                        <motion.div
                          key={`${currentProject?.id || currentProject?.title}-${portfolioSliderIndex}`}
                          initial={{ opacity: 0, y: 18 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 18 }}
                          className="group cursor-pointer"
                          onClick={() => openProjectModal(currentProject)}
                        >
                          <div className="overflow-hidden rounded-4xl border border-slate-200 bg-white shadow-[0_26px_80px_rgba(15,23,42,0.12)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_36px_100px_rgba(15,23,42,0.18)]">
                            <div className="relative aspect-16/10 overflow-hidden">
                              <Image
                                src={currentProject.image}
                                alt={currentProject.title}
                                fill
                                className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                                sizes="(max-width:768px) 100vw, 50vw"
                              />
                              <div className="absolute inset-0 bg-linear-to-t from-slate-950/18 via-slate-950/8 to-transparent" />
                              <div className="absolute inset-x-0 bottom-0 p-4">
                                <div className="flex flex-wrap gap-1.5 mb-2 opacity-90">
                                  {categories.slice(0, 2).map((cat) => (
                                    <span
                                      key={cat}
                                      className={`px-2 py-0.5 rounded-full border text-[11px] font-semibold backdrop-blur-sm ${accent.badge}`}
                                    >
                                      {cat}
                                    </span>
                                  ))}
                                </div>
                                <h3 className="text-lg font-semibold text-white line-clamp-2 tracking-tight">
                                  {currentProject.title}
                                </h3>
                              </div>
                            </div>

                            <div className="p-4">
                              <p className="text-sm leading-relaxed text-slate-600 line-clamp-2 opacity-90">
                                {currentProject.description}
                              </p>

                              <div className="mt-4 flex flex-wrap gap-2 opacity-80">
                                {(currentProject.technologies || [])
                                  .slice(0, 3)
                                  .map((tech) => (
                                    <span
                                      key={tech}
                                      className="px-2.5 py-1 rounded-full border border-slate-200 bg-slate-50 text-slate-700 text-xs"
                                    >
                                      {tech}
                                    </span>
                                  ))}
                              </div>

                              <div className="mt-4 flex items-center justify-between">
                                <div className="text-[11px] text-slate-500">
                                  Hover for details
                                </div>
                                <button
                                  onClick={(event) => {
                                    event.stopPropagation();
                                    openProjectModal(currentProject);
                                  }}
                                  className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-3.5 py-2 text-xs font-medium text-white shadow-sm transition hover:bg-slate-800"
                                >
                                  View case
                                  <FiExternalLink className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      );
                    })()}

                    {filteredProjects.length > 1 && (
                      <>
                        <div className="mt-6 flex items-center justify-center gap-4">
                          <button
                            onClick={prevPortfolioSlide}
                            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-slate-50"
                            aria-label="Previous portfolio project"
                          >
                            <FiChevronLeft className="w-5 h-5" />
                          </button>

                          <div className="flex items-center gap-1.5">
                            {filteredProjects.map((_, index) => (
                              <button
                                key={index}
                                onClick={() => setPortfolioSliderIndex(index)}
                                className={`h-2 rounded-full transition-all ${
                                  portfolioSliderIndex === index
                                    ? "w-6 bg-slate-900"
                                    : "w-2 bg-slate-300"
                                }`}
                                aria-label={`Go to portfolio project ${index + 1}`}
                              />
                            ))}
                          </div>

                          <button
                            onClick={nextPortfolioSlide}
                            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-slate-50"
                            aria-label="Next portfolio project"
                          >
                            <FiChevronRight className="w-5 h-5" />
                          </button>
                        </div>

                        <div className="mt-2 text-center text-xs text-slate-500">
                          Slide {portfolioSliderIndex + 1} of{" "}
                          {filteredProjects.length}
                        </div>
                      </>
                    )}
                  </>
                ) : (
                  <div className="rounded-4xl border border-dashed border-slate-200 bg-white/80 p-8 text-center shadow-sm backdrop-blur-sm">
                    <p className="text-slate-500">
                      No projects found for this category
                    </p>
                    <button
                      onClick={() => setActiveFilter("all")}
                      className="mt-4 rounded-full bg-slate-900 px-4 py-2 text-sm text-white transition hover:bg-slate-800"
                    >
                      View All Projects
                    </button>
                  </div>
                )}
              </div>

              {/* Desktop View - Grid */}
              <div className="hidden md:block">
                {filteredProjects.length > 0 ? (
                  <>
                    <div className="grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-5">
                      {desktopVisibleProjects.map((project, index) => {
                        const accent = getCardAccent(project, index);
                        const categories = Array.isArray(project.category)
                          ? project.category
                          : project.category
                            ? [project.category]
                            : [];
                        const performance = Array.isArray(project.performance)
                          ? project.performance
                          : [];

                        return (
                          <motion.article
                            key={`${project.id}-${index}`}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.04 }}
                            className="group overflow-hidden rounded-xl border border-slate-200 bg-white shadow-[0_24px_80px_rgba(15,23,42,0.12)] transition duration-300 hover:-translate-y-2 hover:shadow-[0_40px_120px_rgba(15,23,42,0.18)]"
                          >
                            <div className="block w-full text-left">
                              <div className="relative aspect-3/3 overflow-hidden">
                                <Image
                                  src={project.image}
                                  alt={project.title}
                                  fill
                                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.08]"
                                  sizes="(max-width:768px) 100vw, 33vw"
                                />
                                <div className="absolute inset-0 bg-linear-to-t from-slate-950/28 via-slate-950/18 to-transparent opacity-100" />

                                <div className="absolute inset-x-0 top-0 flex items-start justify-between p-2">
                                  <div className="flex flex-wrap gap-1.5">
                                    {categories.slice(0, 2).map((cat) => (
                                      <span
                                        key={cat}
                                        className={`rounded-full border px-2 py-1 text-[10px] font-semibold backdrop-blur-sm ${accent.badge}`}
                                      >
                                        {cat}
                                      </span>
                                    ))}
                                  </div>
                                  {project.year ? (
                                    <span className="rounded-full border border-white/20 bg-white/15 px-2.5 py-1 text-[11px] font-semibold text-white backdrop-blur-sm">
                                      {project.year}
                                    </span>
                                  ) : null}
                                </div>

                                <div className="absolute inset-x-0 bottom-0 p-4"></div>
                                <div className="absolute inset-0 opacity-0 transition duration-300 group-hover:opacity-100">
                                  <div className="absolute inset-0 bg-linear-to-t from-slate-950/66 via-slate-950/44 to-slate-950/20" />
                                  <div className="absolute inset-x-0 bottom-0 p-4">
                                    <p className="text-xs leading-relaxed text-white line-clamp-2">
                                      {project.description}
                                    </p>
                                    <div className="mt-3 flex flex-wrap gap-1.5">
                                      {(project.technologies || [])
                                        .slice(0, 2)
                                        .map((tech) => (
                                          <span
                                            key={tech}
                                            className="rounded-full border border-white/15 bg-white/10 px-2.5 py-1 text-[11px] text-white backdrop-blur-sm"
                                          >
                                            {tech}
                                          </span>
                                        ))}
                                    </div>
                                  </div>
                                </div>
                              </div>

                              <div className="px-4 py-2">
                                <div className="flex items-start justify-between gap-3">
                                  <div>
                                    <h3 className="text-base font-semibold tracking-tight text-slate-900 line-clamp-1">
                                      {project.title}
                                    </h3>
                                    <p className="mt-1 text-xs text-slate-500 line-clamp-1">
                                      {categories.join(" • ") || "Portfolio"}
                                    </p>
                                  </div>

                                  <button
                                    onClick={() => openProjectModal(project)}
                                    className="inline-flex shrink-0 items-center gap-1 rounded-full bg-slate-900 px-3 py-2 text-xs font-medium text-white shadow-sm transition hover:bg-slate-800"
                                  >
                                    View case
                                    <FiExternalLink className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </div>
                            </div>
                          </motion.article>
                        );
                      })}
                    </div>

                    <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
                      {hasMoreDesktopProjects && (
                        <button
                          onClick={() => setDesktopVisibleRows((prev) => prev + 1)}
                          className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-5 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-slate-800"
                        >
                          View More
                          <FiChevronRight className="w-4 h-4" />
                        </button>
                      )}

                      {canShowViewLess && (
                        <button
                          onClick={() =>
                            setDesktopVisibleRows((prev) => Math.max(2, prev - 1))
                          }
                          className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-5 py-2.5 text-sm font-medium text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-slate-50"
                        >
                          View Less
                          <FiChevronLeft className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </>
                ) : (
                  <div className="rounded-4xl border border-dashed border-slate-200 bg-white/80 p-12 text-center shadow-sm backdrop-blur-sm">
                    <p className="text-slate-500">
                      No projects found for this category
                    </p>
                    <button
                      onClick={() => setActiveFilter("all")}
                      className="mt-4 rounded-full bg-slate-900 px-6 py-2 text-white transition hover:bg-slate-800"
                    >
                      View All Projects
                    </button>
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* Stats Section */}
          <StatsSection />

          {/* CTA Section */}
          <section className="py-12 sm:py-20 bg-linear-to-r from-blue-600 to-purple-600 text-white">
            <div className="container mx-auto px-4">
              <div className="max-w-3xl mx-auto text-center">
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-6">
                  Ready to Create Something Amazing?
                </h2>
                <p className="text-blue-100 mb-6 sm:mb-8 text-base sm:text-lg">
                  Let's collaborate to bring your vision to life with our
                  expertise.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
                  <a
                    href={
                      "https://wa.me/18083015039?text=" +
                      encodeURIComponent(
                        "Hello, I'm interested in starting a project.",
                      )
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <button className="px-6 py-2.5 sm:px-8 sm:py-3 bg-white text-blue-700 font-semibold rounded-full shadow-sm border border-gray-200 hover:shadow-md transition transform duration-200 focus:outline-none focus:ring-2 focus:ring-blue-100 text-sm sm:text-base flex items-center gap-2 justify-center">
                      <Sparkles className="w-4 h-4 text-yellow-400" /> Start a
                      Project
                    </button>
                  </a>
                </div>
              </div>
            </div>
          </section>

          {/* Project Modal */}
          {selectedProject && (
            <ProjectModal
              project={selectedProject}
              isOpen={modalOpen}
              onClose={() => setModalOpen(false)}
            />
          )}
        </div>
      </div>
    </>
  );
};

export default Portfolio;
