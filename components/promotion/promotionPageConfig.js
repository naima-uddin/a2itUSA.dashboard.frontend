import Banner from "./Home/Banner";
import Slider from "./Home/Slider";
import Portfolio from "./Home/Portfolio";
import PromotionPricing from "./Home/PromotionPricing";
import StatsSectionSimple from "./Home/StatsSectionSimple";
import ServicesSection from "./Home/ServicesSection";
import Enhancement from "./Home/Enhancement";

export const PROMOTION_SECTION_KEYS = [
  "banner",
  "slider",
  "portfolio",
  "pricing",
  "stats",
  "services",
  "enhancement",
];

export const PROMOTION_SECTION_COMPONENTS = {
  banner: Banner,
  slider: Slider,
  portfolio: Portfolio,
  pricing: PromotionPricing,
  stats: StatsSectionSimple,
  services: ServicesSection,
  enhancement: Enhancement,
};

export const PROMOTION_SECTION_LABELS = {
  banner: "Hero Banner",
  slider: "Logo Slider",
  portfolio: "Portfolio Preview",
  pricing: "Pricing Plans",
  stats: "Stats Strip",
  services: "Services Showcase",
  enhancement: "Trust Signals",
};

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
    enabled: true,
    order: index,
    config: {},
  })),
};

export const createDefaultPromotionPage = (slug = "website") => ({
  ...DEFAULT_PROMOTION_PAGE,
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
        order: Number.isFinite(Number(section?.order)) ? Number(section.order) : index,
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
      config: existing ? existing.config : {},
    };
  }).sort((a, b) => a.order - b.order);

  return {
    ...createDefaultPromotionPage(page.slug || "website"),
    ...page,
    sections,
  };
};