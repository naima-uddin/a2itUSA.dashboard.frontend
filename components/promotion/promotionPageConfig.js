import Banner from "./Home/Banner";
import Slider from "./Home/Slider";
import Portfolio from "./Home/Portfolio";
import Gallery from "./Home/Gallery";
import PromotionPricing from "./Home/PromotionPricing";
import StatsSectionSimple from "./Home/StatsSectionSimple";
import ServicesSection from "./Home/ServicesSection";
import Enhancement from "./Home/Enhancement";

const cloneData = (value) => JSON.parse(JSON.stringify(value || {}));

export const PROMOTION_SECTION_KEYS = [
  "banner",
  "slider",
  "portfolio",
  "gallery",
  "pricing",
  "stats",
  "services",
  "enhancement",
];

export const PROMOTION_SECTION_COMPONENTS = {
  banner: Banner,
  slider: Slider,
  portfolio: Portfolio,
  gallery: Gallery,
  pricing: PromotionPricing,
  stats: StatsSectionSimple,
  services: ServicesSection,
  enhancement: Enhancement,
};

export const PROMOTION_SECTION_LABELS = {
  banner: "Hero Banner",
  slider: "Logo Slider",
  portfolio: "Portfolio Preview",
  gallery: "Gallery Showcase",
  pricing: "Pricing Plans",
  stats: "Stats Strip",
  services: "Services Showcase",
  enhancement: "Trust Signals",
};

export const PROMOTION_SECTION_DEFAULT_CONFIGS = {
  banner: {
    heading: "Big Discount Going ON!!",
    subheading: "Everywhere & Every Device, Your Site Should Flow Seamlessly!",
    introText:
      "From high-performance websites to full-scale eCommerce, ERP systems, and digital marketing.",
    startPrice: "$99",
    primaryLabel: "Start Your Project",
    secondaryLabel: "Get Free Consultation",
    modalButtonText: "START YOUR PROJECT NOW",
    backgroundImage: "/banner.jpeg",
    heroLines: [
      "Design. Develop. Dominate.",
      "Scale Your Brand Without Limits.",
      "Optimize, and scale for global success.",
    ],
  },
  slider: {
    images: [
      "/slider/googleads.png",
      "/slider/amazon.webp",
      "/slider/cloude.png",
      "/slider/ebay.png",
      "/slider/erp.png",
      "/slider/web.png",
      "/slider/magento.png",
      "/slider/react.png",
      "/slider/woocommerce.png",
      "/slider/seo.png",
      "/slider/Shopify.png",
      "/slider/wordpresss.png",
    ],
    autoplay: true,
    interval: 3000,
  },
  portfolio: {
    title: "Experience Our High-Impact Digital Projects",
    description:
      "Explore our latest work across custom web development, scalable eCommerce platforms, ERP system integrations, marketplace solutions, and performance-driven marketing campaigns.",
    mode: "projects",
    projects: [],
    galleryItems: [
      {
        title: "Website Design",
        image: "/promotionPortfolio/serviceSectionImg.png",
        description: "Modern UI and strong conversion focus.",
      },
      {
        title: "ERP Systems",
        image: "/promotionPortfolio/serviceSectionImg.png",
        description: "Custom workflows and automation ready.",
      },
      {
        title: "SEO Growth",
        image: "/promotionPortfolio/serviceSectionImg.png",
        description: "Search-focused landing page campaigns.",
      },
    ],
  },
  gallery: {
    title: "Explore Our Creative Gallery",
    description:
      "Use this section for image-first promotional pages, campaign highlights, and featured work.",
    items: [
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
    ],
  },
  pricing: {
    category: "Design & Development",
    heading: "WE ARE OPTIMISTS WHO LOVE",
    highlight: "TO WORK TOGETHER",
    description:
      "Choose the perfect plan for your business needs. All packages come with our commitment to excellence.",
    packages: [
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
  },
  stats: {
    title: "Choose Your Plan",
    stats: [
      {
        end: 100,
        suffix: "%",
        label: "SUCCESSFUL PROJECTS",
        icon: "trophy",
        gradient: "from-emerald-400 to-teal-500",
      },
      {
        end: 100,
        suffix: "%",
        label: "SATISFACTION",
        icon: "like",
        gradient: "from-purple-400 to-pink-500",
      },
      {
        end: 1000,
        suffix: "+",
        label: "SUCCESSFUL DEALS",
        icon: "handshake",
        gradient: "from-blue-400 to-indigo-500",
      },
    ],
  },
  services: {
    kicker: "In the ever-connected, attention-challenged digital era.",
    title: "Scale faster: award‑winning web & app experiences",
    description:
      "Choose the perfect plan for your business needs. All packages come with our commitment to excellence.",
    backgroundImage: "/promotionPortfolio/shape.png",
    modalTitle: "Big Discount Going ON!!",
    modalSubtitle:
      "Everywhere & Every Device, Your Site Should Flow Seamlessly!",
    modalButtonText: "START YOUR PROJECT NOW",
    ctaLabel: "Start Your Project",
    services: [
      "Design & Development",
      "E-Commerce",
      "Amazon",
      "Shopify",
      "ERP System Development",
      "SEO / SEM / PPC",
      "Server and Hosting Services",
      "E-bay",
    ],
  },
  enhancement: {
    highlight: "Next Level",
    emphasis: "Growth",
    description:
      "From concept to launch, we craft memorable brand and product experiences that convert — clear process, measurable results.",
    heroImage: "/promotionPortfolio/serviceSectionImg.png",
    cards: [
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
    ],
  },
};

const createSectionConfig = (key) =>
  cloneData(PROMOTION_SECTION_DEFAULT_CONFIGS[key] || {});

export const DEFAULT_PROMOTION_PAGE = {
  slug: "website",
  title: "Website Promotion",
  description:
    "Default promotions landing page with all sections enabled for the website offer.",
  metaTitle: "Website Promotion",
  metaDescription:
    "A complete promotional landing page for website design, development, and growth services.",
  isActive: true,
  sections: PROMOTION_SECTION_KEYS.map((key, index) => ({
    key,
    enabled: key === "gallery" ? false : true,
    order: index,
    config: createSectionConfig(key),
  })),
  footer: {
    headline: "Sign up now for the ultimate website experience!",
    description:
      "A2IT LLC is your all-in-one web design and development agency, featuring a team of skilled and imaginative developers, marketers, and designers.",
    copyrightText: "Copyright © 2026 A2IT LLC | All rights reserved.",
    logoImage: "/A2ITLogo.png",
  },
};

export const createDefaultPromotionPage = (slug = "website") => ({
  ...cloneData(DEFAULT_PROMOTION_PAGE),
  slug,
  title:
    slug === "website"
      ? DEFAULT_PROMOTION_PAGE.title
      : `${slug
          .split("-")
          .filter(Boolean)
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(" ")} Promotion`,
  metaTitle:
    slug === "website"
      ? DEFAULT_PROMOTION_PAGE.metaTitle
      : `${slug
          .split("-")
          .filter(Boolean)
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(" ")} Promotion`,
  metaDescription:
    slug === "website"
      ? DEFAULT_PROMOTION_PAGE.metaDescription
      : `Custom promotions page for ${slug}`,
});

export const normalizePromotionPage = (page) => {
  if (!page) return null;

  const sectionMap = new Map(
    (page.sections || []).map((section, index) => [
      section?.key,
      {
        key: section?.key,
        enabled: section?.enabled !== false,
        order: Number.isFinite(Number(section?.order))
          ? Number(section.order)
          : index,
        config:
          typeof section?.config === "object" && section?.config !== null
            ? section.config
            : {},
      },
    ]),
  );

  const sections = PROMOTION_SECTION_KEYS.map((key, index) => {
    const existing = sectionMap.get(key);
    return {
      key,
      enabled: existing ? existing.enabled : true,
      order: existing ? existing.order : index,
      config: {
        ...createSectionConfig(key),
        ...(existing ? existing.config : {}),
      },
    };
  }).sort((a, b) => a.order - b.order);

  return {
    ...createDefaultPromotionPage(page.slug || "website"),
    ...page,
    sections,
    footer: {
      ...createDefaultPromotionPage(page.slug || "website").footer,
      ...(typeof page.footer === "object" && page.footer !== null
        ? page.footer
        : {}),
    },
  };
};
