"use client";

import React, { useRef, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiArrowRight,
  FiCheck,
  FiDollarSign,
  FiTrendingUp,
  FiSearch,
  FiPieChart,
  FiLink,
  FiBarChart2,
  FiUsers,
  FiBookOpen,
  FiTarget,
  FiChevronDown,
  FiPlay,
  FiPackage,
  FiTruck,
  FiHeadphones,
  FiGlobe,
  FiShield,
  FiCpu,
  FiStar,
  FiShoppingCart,
  FiLayers,
  FiBox,
  FiZap,
  FiAward,
  FiArrowLeft,
  FiShoppingBag,
  FiDatabase,
  FiFilter,
  FiRefreshCw,
  FiTruck as FiShipping,
  FiCreditCard,
  FiSmartphone,
  FiChevronUp,
  FiTag,
  FiGrid,
  FiBarChart,
  FiShare2,
  FiPercent,
  FiTool,
  FiDownload,
  FiCheckCircle,
  FiUser,
} from "react-icons/fi";
import Link from "next/link";
import Image from "next/image";
import pricingDataJson from "@/public/pricing-data.json";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

const normalizePortfolioBuckets = (items = []) => {
  const buckets = {
    affiliateProjects: [],
    featuredProjects: [],
    portfolioProjects: [],
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

    const isAffiliate =
      normalizedItem.type === "affiliate" ||
      normalizedItem.category.some((cat) =>
        String(cat).toLowerCase().includes("affiliate"),
      );
    const isFeatured = normalizedItem.type === "featured";

    if (isAffiliate) {
      buckets.affiliateProjects.push(normalizedItem);
      return;
    }

    if (isFeatured) {
      buckets.featuredProjects.push(normalizedItem);
      return;
    }

    buckets.portfolioProjects.push(normalizedItem);
  });

  return buckets;
};

// Main Amazon Services Component
const AmazonServices = () => {
  const [activeSection, setActiveSection] = useState("hero");
  const [activeStep, setActiveStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeFeature, setActiveFeature] = useState(0);
  const [activeCampaign, setActiveCampaign] = useState(0);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [currentProjectSlide, setCurrentProjectSlide] = useState(0);
  const [hoveredCard, setHoveredCard] = useState(null);
  const [windowWidth, setWindowWidth] = useState(
    typeof window !== "undefined" ? window.innerWidth : 1024,
  );
  const [activeAccordion, setActiveAccordion] = useState(null);
  const [portfolioBuckets, setPortfolioBuckets] = useState({
    affiliateProjects: [],
    featuredProjects: [],
    portfolioProjects: [],
  });

  const heroRef = useRef(null);
  const affiliateRef = useRef(null);
  const fbaRef = useRef(null);
  const vendorRef = useRef(null);
  const marketingRef = useRef(null);
  const pricingRef = useRef(null);
  const portfolioRef = useRef(null);
  const faqRef = useRef(null);

  // Get Amazon packages from imported JSON with Special as black color
  const amazonPackages =
    pricingDataJson.services
      .find((s) => s.category === "Amazon Services")
      ?.packages.map((pkg) => ({
        ...pkg,
        color:
          pkg.name === "Special"
            ? "black"
            : pkg.name === "Gold"
              ? "blue"
              : pkg.color,
      })) || [];

  useEffect(() => {
    let mounted = true;

    const fetchPortfolioProjects = async () => {
      try {
        const response = await fetch(`${API_BASE}/api/portfolio`, {
          cache: "no-store",
        });

        if (!response.ok) return;

        const data = await response.json();
        if (!mounted) return;

        setPortfolioBuckets(normalizePortfolioBuckets(data.portfolios || []));
      } catch (error) {
        // Ignore network failures and keep the section empty.
      }
    };

    fetchPortfolioProjects();

    return () => {
      mounted = false;
    };
  }, []);

  // Get all projects from MongoDB
  const allPortfolioProjects = portfolioBuckets.portfolioProjects || [];
  const allAffiliateProjects = portfolioBuckets.affiliateProjects || [];

  // Combine and filter projects for Amazon/e-commerce/affiliate
  const allProjects = [...allPortfolioProjects, ...allAffiliateProjects];
  const amazonProjects = allProjects.filter((project) => {
    const categories = Array.isArray(project.category)
      ? project.category
      : [project.category];
    return categories.some(
      (cat) =>
        typeof cat === "string" &&
        (cat.toLowerCase().includes("e-commerce") ||
          cat.toLowerCase().includes("affiliate") ||
          cat.toLowerCase().includes("amazon") ||
          cat.toLowerCase().includes("shopify")),
    );
  });

  // Responsive slides per view
  const getSlidesPerView = () => {
    if (windowWidth < 640) return 1;
    if (windowWidth < 1024) return 2;
    return 3;
  };

  const getProjectsPerView = () => {
    if (windowWidth < 640) return 1;
    if (windowWidth < 768) return 2;
    if (windowWidth < 1024) return 3;
    return 4;
  };

  const slidesPerView = getSlidesPerView();
  const projectsPerView = getProjectsPerView();

  // Group packages into slides
  const groupedPackages = [];
  for (let i = 0; i < amazonPackages.length; i += slidesPerView) {
    groupedPackages.push(amazonPackages.slice(i, i + slidesPerView));
  }

  // Group projects into slides - only include slides with projects
  const groupedProjects = [];
  for (let i = 0; i < amazonProjects.length; i += projectsPerView) {
    const slideProjects = amazonProjects.slice(i, i + projectsPerView);
    if (slideProjects.length > 0) {
      groupedProjects.push(slideProjects);
    }
  }

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Reset slides when grouping changes
  useEffect(() => {
    setCurrentSlide(0);
    setCurrentProjectSlide(0);
  }, [slidesPerView, projectsPerView]);

  // Auto play for affiliate steps
  useEffect(() => {
    if (isPlaying) {
      const interval = setInterval(() => {
        setActiveStep((prev) => (prev + 1) % 3);
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [isPlaying]);

  const handleScroll = (ref, section) => {
    if (ref.current) {
      const elementPosition = ref.current.offsetTop - 80;
      window.scrollTo({
        top: elementPosition,
        behavior: "smooth",
      });
      setActiveSection(section);
    }
  };

  const toggleAccordion = (index) => {
    setActiveAccordion(activeAccordion === index ? null : index);
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % groupedPackages.length);
  };

  const prevSlide = () => {
    setCurrentSlide(
      (prev) => (prev - 1 + groupedPackages.length) % groupedPackages.length,
    );
  };

  const nextProjectSlide = () => {
    setCurrentProjectSlide((prev) => (prev + 1) % groupedProjects.length);
  };

  const prevProjectSlide = () => {
    setCurrentProjectSlide(
      (prev) => (prev - 1 + groupedProjects.length) % groupedProjects.length,
    );
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  const goToProjectSlide = (index) => {
    setCurrentProjectSlide(index);
  };

  const getPackageColor = (pkg, isHover = false) => {
    if (pkg.name === "Special" && isHover) return "from-gray-900 to-black";
    if (pkg.name === "Special") return "from-gray-800 to-black";
    if (pkg.name === "Gold" && isHover) return "from-blue-700 to-indigo-800";
    if (pkg.name === "Gold") return "from-blue-600 to-indigo-700";
    if (isHover) return "from-blue-600 to-indigo-700";
    return "from-blue-500 to-indigo-600";
  };

  const getCardBackground = (pkg) => {
    if (pkg.name === "Special")
      return "bg-linear-to-br from-gray-900 via-gray-800 to-black border-gray-700";
    if (pkg.name === "Gold")
      return "bg-linear-to-br from-blue-50 via-white to-indigo-50 border-blue-100";
    return "bg-linear-to-br from-blue-50 via-white to-indigo-50 border-blue-100";
  };

  const getIconForPackage = (pkgName) => {
    switch (pkgName) {
      case "Special":
        return <FiShoppingBag className="text-2xl" />;
      case "Plus":
        return <FiTrendingUp className="text-2xl" />;
      case "Gold":
        return <FiAward className="text-2xl" />;
      case "Platinum":
        return <FiDatabase className="text-2xl" />;
      case "The Boss":
        return <FiZap className="text-2xl" />;
      case "Diamond":
        return <FiGlobe className="text-2xl" />;
      default:
        return <FiShoppingCart className="text-2xl" />;
    }
  };

  // FBA features
  const fbaFeatures = [
    {
      icon: <FiPackage className="text-4xl" />,
      title: "Storage & Inventory Management",
      description:
        "Amazon stores your products and manages inventory until sold",
      stats: "99.9% inventory accuracy",
    },
    {
      icon: <FiTruck className="text-4xl" />,
      title: "Order Fulfillment",
      description:
        "Amazon picks, packs, and ships products directly to customers",
      stats: "24-48h delivery guarantee",
    },
    {
      icon: <FiHeadphones className="text-4xl" />,
      title: "Customer Service & Returns",
      description:
        "Amazon handles inquiries, returns, and refunds professionally",
      stats: "98% customer satisfaction",
    },
  ];

  // Campaigns for marketing
  const campaigns = [
    {
      title: "Sponsored Products",
      description: "Promote individual products on Amazon search results",
      stats: "40% average CTR increase",
      icon: <FiShoppingCart />,
    },
    {
      title: "Sponsored Brands",
      description: "Showcase your brand and multiple products",
      stats: "25% brand awareness boost",
      icon: <FiTrendingUp />,
    },
    {
      title: "Sponsored Display",
      description: "Retarget customers on and off Amazon",
      stats: "35% higher conversion rate",
      icon: <FiTarget />,
    },
  ];

  return (
    <div className="min-h-screen bg-white text-gray-800">
      {/* Hero Section */}
      <section
        ref={heroRef}
        className="relative min-h-[60vh] sm:min-h-[70vh] md:min-h-[80vh] py-12 sm:py-16 md:py-20 flex items-center justify-center overflow-hidden"
      >
        {/* Background Image with Overlay */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[url('/assets/amazon/amazon.png')] bg-cover bg-center"></div>
          <div className="absolute inset-0 bg-linear-to-r from-black/70 via-black/50 to-transparent"></div>
          <div className="absolute inset-0 bg-linear-to-t from-white via-transparent to-transparent opacity-30"></div>
        </div>

        {/* Geometric Overlay */}
        <div className="absolute inset-0 hidden lg:block">
          <div className="absolute top-20 right-20 w-64 h-64 border-2 border-yellow-400/30 rotate-45 animate-pulse"></div>
          <div className="absolute bottom-40 left-32 w-40 h-40 border border-orange-400/20 rotate-12"></div>
          <div className="absolute top-1/3 left-1/4 w-32 h-32 border border-pink-400/10 -rotate-12"></div>
        </div>

        {/* Hero Content */}
        <div className="max-w-7xl mx-auto px-6 sm:px-12 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="inline-flex items-center px-4 py-2 bg-white/20 backdrop-blur-sm text-white rounded-full text-sm font-medium mb-6">
                <FiPercent className="mr-2" />
                AMAZON SERVICES SPECIALIST
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-white">
                Maximize Your{" "}
                <span className="text-transparent bg-clip-text bg-linear-to-r from-yellow-300 via-orange-400 to-pink-500">
                  Amazon Potential
                </span>
              </h1>
              <p className="text-lg text-blue-100 mb-8">
                Comprehensive Amazon solutions including FBA, Vendor Central,
                affiliate programs, and marketing services to scale your
                e-commerce business.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/contact"
                  className="bg-white text-blue-600 px-8 py-3 rounded-lg font-medium hover:bg-blue-50 transition-colors duration-200 flex items-center justify-center gap-2"
                >
                  Get Started
                  <FiArrowRight />
                </Link>
                <button
                  onClick={() => handleScroll(pricingRef, "pricing")}
                  className="border-2 border-white text-white px-8 py-3 rounded-lg font-medium hover:bg-white/10 transition-colors duration-200"
                >
                  View Pricing
                </button>
              </div>
            </motion.div>
            {/* Affiliate Marketing Section */}
            <section
              ref={affiliateRef}
              className="py-4 bg-white rounded-sm shadow-sm"
            >
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col lg:flex-row gap-8 items-center">
                  <div className="lg:w-1/3">
                    <h3 className="text-2xl font-bold mb-4">Our Process</h3>
                    <div className="space-y-4">
                      {[
                        "Setup & Strategy",
                        "Implementation",
                        "Optimization",
                      ].map((step, index) => (
                        <button
                          key={index}
                          onClick={() => {
                            setActiveStep(index);
                            setIsPlaying(false);
                          }}
                          className={`w-full text-left p-2 rounded-lg transition-all ${
                            activeStep === index
                              ? "bg-blue-600 text-white"
                              : "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50"
                          }`}
                        >
                          <div className="flex items-center">
                            <div className="w-6 h-6 rounded-full border-2 border-current flex items-center justify-center mr-3">
                              {index + 1}
                            </div>
                            <span className="font-medium">{step}</span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="lg:w-2/3">
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={activeStep}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="bg-linear-to-br from-blue-50 to-indigo-50 p-6 rounded-xl shadow-sm border border-blue-100"
                      >
                        <h4 className="text-xl font-bold mb-3">
                          {
                            [
                              "Account Setup & Strategy",
                              "Content & Link Implementation",
                              "Performance Optimization",
                            ][activeStep]
                          }
                        </h4>
                        <p className="text-gray-600 mb-4">
                          {
                            [
                              "We create your Amazon Associates account, develop a monetization strategy, and identify profitable product niches.",
                              "Our team integrates affiliate links strategically into your content with proper tracking and optimization.",
                              "We monitor performance, A/B test placements, and maximize your commission earnings through data-driven decisions.",
                            ][activeStep]
                          }
                        </p>
                        <ul className="space-y-2">
                          {[
                            [
                              "Account creation",
                              "Niche research",
                              "Strategy planning",
                            ],
                            [
                              "Link integration",
                              "Content optimization",
                              "Tracking setup",
                            ],
                            [
                              "Performance analysis",
                              "A/B testing",
                              "Revenue growth",
                            ],
                          ][activeStep].map((item, i) => (
                            <li key={i} className="flex items-center">
                              <FiCheck className="text-green-500 mr-2" />
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </motion.div>
                    </AnimatePresence>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </section>

      {/* Marketing Services Section */}
      <section ref={marketingRef} className="py-10 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-4"
          >
            <div className="flex items-center justify-center gap-2">
              <div className="inline-flex items-center justify-center w-10 h-10 bg-blue-100 rounded-2xl mb-2">
                <FiBarChart2 className="text-2xl text-blue-600" />
              </div>
              <span className="text-blue-600 font-semibold tracking-widest text-sm">
                AMAZON MARKETING SERVICES
              </span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mt-4 mb-3">
              Amplify Your Amazon Presence
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Data-driven Amazon advertising strategies that deliver measurable
              ROI
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {campaigns.map((campaign, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={`p-6 bg-white rounded-xl border-2 transition-all cursor-pointer ${
                  activeCampaign === index
                    ? "border-blue-600 shadow-lg"
                    : "border-gray-200 hover:border-blue-400"
                }`}
                onClick={() => setActiveCampaign(index)}
              >
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4 text-blue-600">
                  {campaign.icon}
                </div>
                <h3 className="text-lg font-bold mb-2">{campaign.title}</h3>
                <p className="text-gray-600 text-sm mb-3">
                  {campaign.description}
                </p>
                <div className="text-blue-600 font-semibold">
                  {campaign.stats}
                </div>
              </motion.div>
            ))}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeCampaign}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-white rounded-2xl p-8 shadow-sm"
            >
              <h3 className="text-2xl font-bold text-blue-600 mb-4">
                {campaigns[activeCampaign].title}
              </h3>
              <p className="text-gray-600 mb-6">
                {campaigns[activeCampaign].description}
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  [
                    "Keyword optimization",
                    "Bid management",
                    "Performance tracking",
                  ],
                  [
                    "Brand storytelling",
                    "Product portfolio",
                    "Creative assets",
                  ],
                  [
                    "Audience targeting",
                    "Cross-channel",
                    "Conversion tracking",
                  ],
                ][activeCampaign].map((item, i) => (
                  <div key={i} className="flex items-center">
                    <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mr-3 text-blue-600">
                      <FiCheck className="text-xs" />
                    </div>
                    <span className="text-gray-700">{item}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {/* Portfolio Section */}
      <section ref={portfolioRef} className="py-10 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-4"
          >
            <div className="inline-flex items-center justify-center w-10 h-10 bg-blue-100 rounded-2xl mb-2">
              <FiGrid className="text-2xl text-blue-600" />
            </div>
            <span className="text-blue-600 font-semibold tracking-widest text-sm -mt-1">
              OUR WORK
            </span>
            <h2 className="text-3xl md:text-4xl font-bold mt-4 mb-3">
              Amazon Projects
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Successful e-commerce solutions we've built for businesses
            </p>
          </motion.div>

          {/* Projects Slider Navigation */}
          {groupedProjects.length > 1 && (
            <div className="flex justify-end items-center gap-4 mb-4">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={prevProjectSlide}
                className="p-3 rounded-full bg-blue-600 hover:bg-blue-700 text-white shadow-lg transition-all"
              >
                <FiArrowLeft />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={nextProjectSlide}
                className="p-3 rounded-full bg-blue-600 hover:bg-blue-700 text-white shadow-lg transition-all"
              >
                <FiArrowRight />
              </motion.button>
            </div>
          )}

          {/* Projects Grid */}
          <div className="overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentProjectSlide}
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -100 }}
                className={`grid gap-6 ${
                  windowWidth < 640
                    ? "grid-cols-1"
                    : windowWidth < 768
                      ? "grid-cols-2"
                      : windowWidth < 1024
                        ? "grid-cols-3"
                        : "grid-cols-4"
                }`}
              >
                {groupedProjects[currentProjectSlide]?.map((project, index) => (
                  <motion.div
                    key={project.id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white rounded-xl overflow-hidden border border-gray-200 hover:shadow-lg transition-all flex flex-col h-full"
                  >
                    <div className="h-48 bg-gray-100 relative">
                      <Image
                        src={project.image}
                        alt={project.title}
                        fill
                        className="object-cover"
                        unoptimized
                      />
                      <div className="absolute top-4 left-4">
                        <span className="px-3 py-1 bg-green-500 text-white text-xs rounded-full font-bold">
                          {project.status}
                        </span>
                      </div>
                    </div>
                    <div className="p-6 grow flex flex-col">
                      <h3 className="font-bold text-lg mb-2 line-clamp-2">
                        {project.title.split("–")[0].trim()}
                      </h3>
                      <p className="text-gray-600 text-sm mb-4 line-clamp-2 grow">
                        {project.description}
                      </p>
                      <div className="flex flex-wrap gap-2 mb-4">
                        {project.technologies.slice(0, 3).map((tech, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                      <div className="grid grid-cols-2 gap-2 mt-auto">
                        {project.performance.slice(0, 2).map((stat, idx) => (
                          <div
                            key={idx}
                            className="text-center p-2 bg-gray-50 rounded"
                          >
                            <div className="font-bold text-blue-600">
                              {stat.value}
                            </div>
                            <div className="text-xs text-gray-600">
                              {stat.label}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Slide Indicators */}
          {groupedProjects.length > 1 && (
            <div className="flex justify-center mt-8">
              <div className="flex space-x-2">
                {groupedProjects.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => goToProjectSlide(index)}
                    className={`w-3 h-3 rounded-full transition-all ${
                      currentProjectSlide === index
                        ? "bg-blue-600"
                        : "bg-gray-300"
                    }`}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Pricing Section */}
      <section ref={pricingRef} className="py-10 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-4"
          >
            <div className="inline-flex items-center justify-center w-10 h-10 bg-blue-100 rounded-2xl mb-2">
              <FiTag className="text-2xl text-blue-600" />
            </div>
            <span className="text-blue-600 font-semibold tracking-widest text-sm">
              PRICING PLANS
            </span>
            <h2 className="text-3xl md:text-4xl font-bold mt-2 mb-2">
              Choose Your Amazon Solution
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto -mt-1">
              Comprehensive Amazon services tailored to your business needs
            </p>
          </motion.div>

          {/* Pricing Slider */}
          <div className="relative">
            {/* Navigation Arrows */}
            {groupedPackages.length > 1 && (
              <div className="flex justify-end items-center gap-4 mb-4">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={prevSlide}
                  className="p-3 rounded-full bg-blue-600 hover:bg-blue-700 text-white shadow-lg transition-all"
                >
                  <FiArrowLeft />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={nextSlide}
                  className="p-3 rounded-full bg-blue-600 hover:bg-blue-700 text-white shadow-lg transition-all"
                >
                  <FiArrowRight />
                </motion.button>
              </div>
            )}

            {/* Pricing Cards */}
            <div className="overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentSlide}
                  initial={{ opacity: 0, x: 100 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  className={`grid gap-6 ${
                    windowWidth < 640
                      ? "grid-cols-1"
                      : windowWidth < 1024
                        ? "grid-cols-2"
                        : "grid-cols-3"
                  }`}
                >
                  {groupedPackages[currentSlide]?.map((pkg, index) => (
                    <motion.div
                      key={pkg.id}
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      onMouseEnter={() => setHoveredCard(pkg.id)}
                      onMouseLeave={() => setHoveredCard(null)}
                      className={`relative rounded-2xl overflow-hidden transition-all ${getCardBackground(
                        pkg,
                      )} border-2 ${
                        hoveredCard === pkg.id
                          ? "border-blue-400 shadow-xl"
                          : "border-gray-200 hover:shadow-lg"
                      }`}
                    >
                      {/* Ribbon for Gold Plan */}
                      {pkg.name === "Gold" && (
                        <div className="absolute top-4 -right-10 bg-blue-600 text-white px-10 py-1 rotate-45 shadow-lg">
                          <span className="text-xs font-bold">POPULAR</span>
                        </div>
                      )}

                      <div className="p-6">
                        {/* Header */}
                        <div className="text-center mb-6">
                          <div
                            className={`inline-flex items-center justify-center w-14 h-14 rounded-2xl mb-4 ${
                              hoveredCard === pkg.id
                                ? `bg-linear-to-r ${getPackageColor(pkg, true)}`
                                : `bg-linear-to-r ${getPackageColor(pkg)}`
                            }`}
                          >
                            <div className="text-white">
                              {getIconForPackage(pkg.name)}
                            </div>
                          </div>
                          <h3
                            className={`text-xl font-bold mb-2 ${pkg.name === "Special" ? "text-white" : ""}`}
                          >
                            {pkg.name}
                          </h3>
                          <div className="text-3xl font-bold mb-2">
                            <span
                              className={
                                pkg.name === "Special"
                                  ? "text-white"
                                  : pkg.name === "Gold"
                                    ? "text-blue-900"
                                    : "text-blue-900"
                              }
                            >
                              {pkg.price}
                            </span>
                          </div>
                          <div
                            className={`text-sm ${pkg.name === "Special" ? "text-gray-300" : "text-gray-600"}`}
                          >
                            One-time payment
                          </div>
                        </div>

                        {/* Features */}
                        <ul className="space-y-3 mb-6">
                          {pkg.features.map((feature, idx) => (
                            <li key={idx} className="flex items-start">
                              <FiCheck
                                className={`mt-1 mr-3 shrink-0 ${
                                  pkg.name === "Special"
                                    ? "text-gray-300"
                                    : pkg.name === "Gold"
                                      ? "text-blue-500"
                                      : "text-blue-500"
                                }`}
                              />
                              <span
                                className={`text-sm ${pkg.name === "Special" ? "text-gray-200" : "text-gray-700"}`}
                              >
                                {feature}
                              </span>
                            </li>
                          ))}
                        </ul>

                        {/* CTA Button */}
                        <Link href="/contact" className="block">
                          <button
                            className={`w-full py-3 rounded-lg font-bold transition-all ${
                              pkg.name === "Special"
                                ? "bg-white text-gray-900 hover:bg-gray-100"
                                : pkg.name === "Gold"
                                  ? "bg-blue-600 text-white hover:bg-blue-700"
                                  : "bg-blue-600 text-white hover:bg-blue-700"
                            }`}
                          >
                            Get {pkg.name} Plan
                          </button>
                        </Link>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Slide Indicators */}
            {groupedPackages.length > 1 && (
              <div className="flex justify-center mt-8">
                <div className="flex space-x-2">
                  {groupedPackages.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => goToSlide(index)}
                      className={`w-3 h-3 rounded-full transition-all ${
                        currentSlide === index ? "bg-blue-600" : "bg-gray-300"
                      }`}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* FBA Services Section */}
      <section ref={fbaRef} className="py-10 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-4"
          >
            <div className="inline-flex items-center justify-center w-10 h-10 bg-blue-100 rounded-2xl mb-2">
              <FiPackage className="text-2xl text-blue-600" />
            </div>
            <span className="text-blue-600 font-semibold tracking-widest text-sm">
              AMAZON FBA SERVICES
            </span>
            <h2 className="text-3xl md:text-4xl font-bold mt-4 mb-3">
              Streamline Your E-Commerce Success
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Let Amazon handle fulfillment while you focus on growing your
              business
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {fbaFeatures.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white rounded-xl p-6 shadow-sm border border-gray-200"
              >
                <div className="w-16 h-16 bg-blue-100 rounded-xl flex items-center justify-center mb-4 text-blue-600">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                <p className="text-gray-600 mb-4">{feature.description}</p>
                <div className="text-blue-600 font-semibold">
                  {feature.stats}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section ref={faqRef} className="py-10 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-4"
          >
            <div className="inline-flex items-center justify-center w-10 h-10 bg-blue-100 rounded-2xl mb-2">
              <FiBox className="text-2xl text-blue-600" />
            </div>
            <span className="text-blue-600 font-semibold tracking-widest text-sm">
              FAQ
            </span>
            <h2 className="text-3xl md:text-4xl font-bold mt-2 mb-3">
              Frequently Asked Questions
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Everything you need to know about our Amazon services
            </p>
          </motion.div>

          <div className="space-y-4">
            {[
              {
                question: "How long does it take to set up Amazon services?",
                answer:
                  "Setup times vary by service: Affiliate (1-2 days), FBA (2-3 weeks), Vendor Central (3-4 weeks). We provide detailed timelines during consultation.",
              },
              {
                question: "Do you provide ongoing support?",
                answer:
                  "Yes, all plans include dedicated support. We offer monitoring, updates, and optimization services with extended support options available.",
              },
              {
                question: "Can you help migrate from other platforms?",
                answer:
                  "Absolutely! We provide migration services for data, products, customers, and orders with zero downtime and complete data integrity.",
              },
              {
                question: "What's included in the pricing?",
                answer:
                  "All plans include setup, configuration, training, and initial support. Additional services like custom development or advanced analytics may have separate fees.",
              },
              {
                question: "Can I upgrade my plan later?",
                answer:
                  "Yes, you can upgrade anytime. We offer seamless migration between plans. Downgrades are available at the end of your service period.",
              },
            ].map((faq, index) => (
              <div
                key={index}
                className={`rounded-xl border-2 overflow-hidden transition-all ${
                  activeAccordion === index
                    ? "border-blue-400 shadow-sm"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <button
                  onClick={() => toggleAccordion(index)}
                  className="w-full p-6 text-left flex justify-between items-center hover:bg-gray-50"
                >
                  <h3 className="font-semibold text-gray-900">
                    {faq.question}
                  </h3>
                  <div
                    className={`transition-transform ${
                      activeAccordion === index ? "rotate-180" : ""
                    }`}
                  >
                    {activeAccordion === index ? (
                      <FiChevronUp className="text-gray-600" />
                    ) : (
                      <FiChevronDown className="text-gray-600" />
                    )}
                  </div>
                </button>

                <AnimatePresence>
                  {activeAccordion === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 pb-6">
                        <p className="text-gray-600">{faq.answer}</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-10 bg-linear-to-r from-blue-600 to-indigo-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h2
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-3xl md:text-4xl font-bold mb-6 text-white"
          >
            Ready to Scale Your Amazon Business?
          </motion.h2>
          <p className="text-blue-100 mb-8 text-lg">
            Join successful businesses with our proven Amazon solutions
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contact"
              className="bg-white text-blue-600 hover:bg-blue-50 font-bold py-4 px-8 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
            >
              Start Free Consultation
              <FiArrowRight />
            </Link>
            <button
              onClick={() => handleScroll(pricingRef, "pricing")}
              className="border-2 border-white text-white hover:bg-white/10 font-bold py-4 px-8 rounded-lg transition-colors duration-200"
            >
              View Pricing Plans
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

// Clock icon component
const FiClock = ({ className = "w-5 h-5" }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
    ></path>
  </svg>
);

export default AmazonServices;
