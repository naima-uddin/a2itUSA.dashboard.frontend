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
  const visibleAffiliateProjects = affiliateProjects.slice(
    affiliateSliderIndex,
    affiliateSliderIndex + 3,
  );

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

  return (
    <>
      <div className="bg-white text-gray-900">
        {/* Hero Section with Image */}
        <section className="relative min-h-[50vh] sm:min-h-[60vh] md:min-h-[70vh] py-12 sm:py-16 md:py-20 flex items-center justify-center overflow-hidden">
          {/* Background Image with Overlay */}
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-[url('/portfolio.png')] bg-cover bg-center"></div>
            <div className="absolute inset-0 bg-linear-to-r from-blue-900/90 via-blue-900/80 to-transparent"></div>
            <div className="absolute inset-0 bg-linear-to-t from-white via-transparent to-transparent opacity-30"></div>
          </div>

          {/* Geometric Overlay */}
          <div className="absolute inset-0">
            <div className="absolute top-20 right-20 w-64 h-64 border-2 border-blue-400/20 rotate-45"></div>
            <div className="absolute bottom-40 left-32 w-40 h-40 border border-purple-400/20 rotate-12"></div>
            <div className="absolute top-1/3 left-1/4 w-32 h-32 border border-blue-500/10 -rotate-12"></div>
            <div className="absolute top-1/2 right-1/3 w-48 h-48 border border-purple-500/10 rotate-45"></div>
          </div>

          {/* Hero Content */}
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-full mb-4 sm:mb-6 md:mb-8 border border-white/20 text-xs sm:text-sm">
                <FiStar className="w-4 h-4" />
                <span className="text-sm font-medium">
                  {getAllProjects().length}+ Successful Projects
                </span>
              </div>

              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold mb-6 leading-none">
                <span className="text-white">Our Creative</span>
                <div className="relative inline-block ml-2 sm:ml-4">
                  <span className="relative z-10 text-transparent bg-clip-text bg-linear-to-r from-blue-300 to-purple-300">
                    Portfolio
                  </span>
                  <div className="absolute -bottom-1 sm:-bottom-2 left-0 w-full h-1 sm:h-2 bg-linear-to-r from-blue-400 to-purple-400"></div>
                </div>
              </h1>

              <p className="text-base sm:text-lg md:text-xl text-white/90 mb-6 sm:mb-8 md:mb-10 max-w-2xl leading-relaxed">
                Explore our diverse collection of web development, mobile apps,
                e-commerce platforms, and digital marketing solutions. Each
                project represents our commitment to excellence and innovation.
              </p>

              {/* Quick Stats */}
              <div className="grid grid-cols-3 gap-4 sm:gap-6 mt-8 sm:mt-12">
                <div className="text-center">
                  <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-1">
                    120+
                  </div>
                  <div className="text-xs sm:text-sm text-white/70">
                    Projects
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-1">
                    100%
                  </div>
                  <div className="text-xs sm:text-sm text-white/70">
                    Satisfaction
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-1">
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
          {/* Hero Section */}
          <section className="pt-20">
            <div className="container mx-auto px-4">
              <div className="max-w-7xl text-center mx-auto">
                <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold text-gray-900 mb-1 leading-tight text-center">
                  <span className="text-blue-600">Portfolio Showcase</span>
                </h1>
                <p className="text-lg sm:text-xl text-gray-600 mb-8 sm:mb-12 max-w-7xl leading-relaxed text-center mx-auto">
                  A curated selection of {getAllProjects().length} projects that
                  demonstrate our approach to digital innovation and
                  user-centered design.
                </p>
              </div>
            </div>
          </section>

          {/* Affiliate & Partnership Projects */}
          <section className="py-4 bg-linear-to-b from-white to-blue-50">
            <div className="container mx-auto px-4">
              <div className="text-center mb-2 ">
                <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-blue-600 text-white rounded-full text-xs sm:text-sm font-medium mb-2 sm:mb-3 -mt-6">
                  <FiTarget className="w-3 h-3 sm:w-4 sm:h-4" />
                  Partnership Projects
                </div>
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">
                  Affiliate & Collaboration Works
                </h2>
                <p className="text-sm sm:text-base text-gray-600 max-w-2xl mx-auto mb-6">
                  Special projects developed in partnership with industry
                  leaders
                </p>
              </div>

              {/* Mobile View - Single Card with Slider */}
              <div className="md:hidden">
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
                      <div className="bg-white border border-teal-100 rounded-2xl overflow-hidden shadow-lg">
                        {/* Image */}
                        <div className="relative h-48 sm:h-56 overflow-hidden">
                          <img
                            src={
                              affiliateProjects[affiliateSliderIndex].images[0]
                            }
                            alt={affiliateProjects[affiliateSliderIndex].title}
                            className="w-full h-full object-cover"
                          />

                          {/* Category badge */}
                          <div className="absolute top-3 left-3">
                            <span className="px-2 py-1 bg-white/90 backdrop-blur-sm text-blue-600 text-xs font-bold rounded-full">
                              {affiliateProjects[affiliateSliderIndex].category}
                            </span>
                          </div>

                          {/* Partnership badge */}
                          <div className="absolute top-3 right-3">
                            <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-medium rounded-full">
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
                              className="px-3 py-1.5 bg-blue-600 text-white text-xs font-medium rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-1"
                            >
                              View Case
                              <FiExternalLink className="w-3 h-3" />
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

                        <div className="text-center mt-2 text-sm text-gray-500">
                          {affiliateSliderIndex + 1} /{" "}
                          {affiliateProjects.length}
                        </div>
                      </>
                    )}
                  </>
                )}
              </div>

              {/* Desktop View - Row Slider */}
              <div className="hidden md:block">
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
                      <div className="text-sm text-slate-500">
                        {affiliateSliderIndex + 1} / {affiliateProjects.length}
                      </div>
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
                            <div className="bg-white border border-teal-100 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-500">
                              <div className="relative h-64 overflow-hidden">
                                <img
                                  src={project.images[0]}
                                  alt={project.title}
                                  className="absolute inset-0 w-full h-full object-cover opacity-100 transition-all duration-500 group-hover:opacity-0 group-hover:scale-110"
                                />
                                <img
                                  src={project.images[1] || project.images[0]}
                                  alt={`${project.title} - hover view`}
                                  className="absolute inset-0 w-full h-full object-cover opacity-0 transition-all duration-500 group-hover:opacity-100 group-hover:scale-110"
                                />

                                <div className="absolute top-4 left-4">
                                  <span className="px-3 py-1 bg-white/90 backdrop-blur-sm text-blue-600 text-xs font-bold rounded-full">
                                    {Array.isArray(project.category)
                                      ? project.category[0]
                                      : project.category}
                                  </span>
                                </div>

                                <div className="absolute top-4 right-4">
                                  <span className="px-3 py-1 bg-yellow-100 text-yellow-800 text-xs font-medium rounded-full">
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
                                    className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
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
          <section className="py-8 sm:py-10 bg-white">
            <div className="container mx-auto px-4">
              <div className="text-center mb-6 sm:mb-8">
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                  Featured Work
                </h2>
                <p className="text-sm sm:text-base text-gray-600 max-w-2xl mx-auto">
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
            className="py-12 sm:py-20 bg-gray-50"
          >
            <div className="container mx-auto px-4">
              <div className="mb-8 sm:mb-12">
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-blue-600 mb-4 sm:mb-6">
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
                          ? "bg-blue-600 text-white shadow-md"
                          : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
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
                    {/* Current Card */}
                    <motion.div
                      key={`${filteredProjects[portfolioSliderIndex]?.id}-${portfolioSliderIndex}`}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="group relative cursor-pointer"
                      onClick={() =>
                        openProjectModal(filteredProjects[portfolioSliderIndex])
                      }
                    >
                      {/* Image Container */}
                      <div className="relative aspect-square overflow-hidden rounded-xl sm:rounded-2xl bg-gray-100">
                        {/* Base Image */}
                        <img
                          src={filteredProjects[portfolioSliderIndex].image}
                          alt={filteredProjects[portfolioSliderIndex].title}
                          className="absolute inset-0 w-full h-full object-cover group-hover:blur-sm group-hover:scale-110 transition-all duration-500"
                        />

                        {/* Overlay Content - Shows on hover */}
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-center items-center p-4 text-center">
                          <h3 className="text-lg font-bold text-white mb-2 line-clamp-2">
                            {filteredProjects[portfolioSliderIndex].title}
                          </h3>
                          <p className="text-gray-200 text-xs mb-3 line-clamp-2">
                            {filteredProjects[portfolioSliderIndex].description}
                          </p>

                          {/* Show first 2 categories as tags */}
                          {filteredProjects[portfolioSliderIndex].category && (
                            <div className="flex flex-wrap gap-1 justify-center mb-3">
                              {(Array.isArray(
                                filteredProjects[portfolioSliderIndex].category,
                              )
                                ? filteredProjects[portfolioSliderIndex]
                                    .category
                                : [
                                    filteredProjects[portfolioSliderIndex]
                                      .category,
                                  ]
                              )
                                .slice(0, 2)
                                .map((cat, idx) => (
                                  <span
                                    key={idx}
                                    className="px-2 py-0.5 bg-white/20 text-white text-xs rounded"
                                  >
                                    {cat}
                                  </span>
                                ))}
                            </div>
                          )}

                          <div className="flex flex-wrap gap-1 justify-center mb-3">
                            {filteredProjects[portfolioSliderIndex]
                              .technologies &&
                              filteredProjects[
                                portfolioSliderIndex
                              ].technologies
                                .slice(0, 3)
                                .map((tech, idx) => (
                                  <span
                                    key={idx}
                                    className="px-2 py-0.5 bg-white/20 text-white text-xs rounded"
                                  >
                                    {tech}
                                  </span>
                                ))}
                          </div>

                          {filteredProjects[portfolioSliderIndex].performance &&
                            filteredProjects[portfolioSliderIndex].performance
                              .length > 0 && (
                              <div className="flex items-center gap-4">
                                {filteredProjects[
                                  portfolioSliderIndex
                                ].performance
                                  .slice(0, 2)
                                  .map((metric, idx) => (
                                    <div key={idx} className="text-center">
                                      <div className="text-base font-bold text-white">
                                        {metric.value}
                                      </div>
                                      <div className="text-xs text-gray-300">
                                        {metric.label}
                                      </div>
                                    </div>
                                  ))}
                              </div>
                            )}

                          <div className="mt-4 px-3 py-1.5 bg-white/20 backdrop-blur-sm text-white text-xs font-medium rounded-full">
                            Click to view details
                          </div>
                        </div>

                        {/* Category Badges - Show up to 2 categories */}
                        <div className="absolute top-3 left-3 flex flex-wrap gap-1">
                          {filteredProjects[portfolioSliderIndex].category &&
                            (Array.isArray(
                              filteredProjects[portfolioSliderIndex].category,
                            )
                              ? filteredProjects[portfolioSliderIndex].category
                              : [
                                  filteredProjects[portfolioSliderIndex]
                                    .category,
                                ]
                            )
                              .slice(0, 2)
                              .map((cat, idx) => (
                                <span
                                  key={idx}
                                  className="px-2 py-0.5 bg-white/90 backdrop-blur-sm text-blue-600 text-xs font-bold rounded-full"
                                >
                                  {cat}
                                </span>
                              ))}
                        </div>
                      </div>

                      {/* Title and categories (visible always) */}
                      <div className="mt-3 mb-4">
                        <h3 className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-1">
                          {filteredProjects[portfolioSliderIndex].title}
                        </h3>
                        {filteredProjects[portfolioSliderIndex].category && (
                          <p className="text-xs text-gray-500 mt-1 line-clamp-1">
                            {Array.isArray(
                              filteredProjects[portfolioSliderIndex].category,
                            )
                              ? filteredProjects[
                                  portfolioSliderIndex
                                ].category.join(", ")
                              : filteredProjects[portfolioSliderIndex].category}
                          </p>
                        )}
                      </div>
                    </motion.div>

                    {/* Slider Controls and Dots */}
                    {filteredProjects.length > 1 && (
                      <>
                        <div className="flex justify-center items-center gap-4 mt-6">
                          <button
                            onClick={prevPortfolioSlide}
                            className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                          >
                            <FiChevronLeft className="w-5 h-5 text-gray-700" />
                          </button>

                          <div className="flex gap-1.5">
                            {filteredProjects.map((_, index) => (
                              <button
                                key={index}
                                onClick={() => setPortfolioSliderIndex(index)}
                                className={`w-1.5 h-1.5 rounded-full transition-colors ${
                                  portfolioSliderIndex === index
                                    ? "bg-blue-600"
                                    : "bg-gray-300"
                                }`}
                              />
                            ))}
                          </div>

                          <button
                            onClick={nextPortfolioSlide}
                            className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                          >
                            <FiChevronRight className="w-5 h-5 text-gray-700" />
                          </button>
                        </div>

                        <div className="text-center mt-2 text-xs text-gray-500">
                          Slide {portfolioSliderIndex + 1} of{" "}
                          {filteredProjects.length} • Auto-changing in 6s
                        </div>
                      </>
                    )}
                  </>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-500">
                      No projects found for this category
                    </p>
                    <button
                      onClick={() => setActiveFilter("all")}
                      className="mt-4 px-4 py-2 bg-blue-600 text-white text-sm rounded-full hover:bg-blue-700 transition-colors"
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
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                      {filteredProjects.map((project, index) => (
                        <motion.div
                          key={`${project.id}-${index}`}
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: index * 0.05 }}
                          className="group relative cursor-pointer"
                          onClick={() => openProjectModal(project)}
                        >
                          {/* Image Container */}
                          <div className="relative aspect-square overflow-hidden rounded-2xl bg-gray-100">
                            {/* Base Image */}
                            <img
                              src={project.image}
                              alt={project.title}
                              className="absolute inset-0 w-full h-full object-cover group-hover:blur-sm group-hover:scale-110 transition-all duration-500"
                            />

                            {/* Overlay Content - Shows on hover */}
                            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-center items-center p-6 text-center">
                              <h3 className="text-xl font-bold text-white mb-3 line-clamp-2">
                                {project.title}
                              </h3>
                              <p className="text-gray-200 text-sm mb-4 line-clamp-2">
                                {project.description}
                              </p>

                              {/* Show first 2 categories as tags */}
                              {project.category && (
                                <div className="flex flex-wrap gap-2 justify-center mb-4">
                                  {(Array.isArray(project.category)
                                    ? project.category
                                    : [project.category]
                                  )
                                    .slice(0, 2)
                                    .map((cat, idx) => (
                                      <span
                                        key={idx}
                                        className="px-2 py-1 bg-white/20 text-white text-xs rounded"
                                      >
                                        {cat}
                                      </span>
                                    ))}
                                </div>
                              )}

                              <div className="flex flex-wrap gap-2 justify-center mb-4">
                                {project.technologies &&
                                  project.technologies
                                    .slice(0, 3)
                                    .map((tech, idx) => (
                                      <span
                                        key={idx}
                                        className="px-2 py-1 bg-white/20 text-white text-xs rounded"
                                      >
                                        {tech}
                                      </span>
                                    ))}
                              </div>

                              {project.performance &&
                                project.performance.length > 0 && (
                                  <div className="flex items-center gap-6">
                                    {project.performance
                                      .slice(0, 2)
                                      .map((metric, idx) => (
                                        <div key={idx} className="text-center">
                                          <div className="text-lg font-bold text-white">
                                            {metric.value}
                                          </div>
                                          <div className="text-xs text-gray-300">
                                            {metric.label}
                                          </div>
                                        </div>
                                      ))}
                                  </div>
                                )}

                              <div className="mt-6 px-4 py-2 bg-white/20 backdrop-blur-sm text-white text-sm font-medium rounded-full">
                                Click to view details
                              </div>
                            </div>

                            {/* Category Badges - Show up to 2 categories */}
                            <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                              {project.category &&
                                (Array.isArray(project.category)
                                  ? project.category
                                  : [project.category]
                                )
                                  .slice(0, 2)
                                  .map((cat, idx) => (
                                    <span
                                      key={idx}
                                      className="px-3 py-1 bg-white/90 backdrop-blur-sm text-blue-600 text-xs font-bold rounded-full"
                                    >
                                      {cat}
                                    </span>
                                  ))}
                            </div>
                          </div>

                          {/* Title and categories (visible always) */}
                          <div className="mt-4 mb-4">
                            <h3 className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-1">
                              {project.title}
                            </h3>
                            {project.category && (
                              <p className="text-sm text-gray-500 mt-1 line-clamp-1">
                                {Array.isArray(project.category)
                                  ? project.category.join(", ")
                                  : project.category}
                              </p>
                            )}
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </>
                ) : (
                  <div className="text-center py-12">
                    <p className="text-gray-500">
                      No projects found for this category
                    </p>
                    <button
                      onClick={() => setActiveFilter("all")}
                      className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors"
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
                    <button className="px-6 py-2.5 sm:px-8 sm:py-3 bg-white text-blue-600 font-bold rounded-full hover:bg-gray-100 transition-colors text-sm sm:text-base">
                      Start a Project
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
