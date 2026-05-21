import pricingData from "@/public/pricing-data.json";

const cloneData = (value) => JSON.parse(JSON.stringify(value || {}));

export const DEFAULT_PRICING_PAGE_CONTENT = {
  hero: {
    badge: "Since 2015 • Redefining Technology",
    titleLine1: "WE ARE OPTIMISTS WHO LOVE",
    highlight: "TO WORK TOGETHER",
    description:
      "Choose the perfect package that fits your needs and budget. Quality services at competitive prices with transparent pricing and no hidden fees.",
    primaryButtonLabel: "Contact With Us",
    primaryButtonHref: "/contact",
    secondaryButtonLabel: "Watch Our Success Story",
    secondaryButtonHref: "/portfolio",
    backgroundImage: "/pricing-img.avif",
  },
  pricingSection: {
    titleLine1: "WE ARE OPTIMISTS WHO LOVE",
    highlight: "TO WORK TOGETHER",
    description:
      "Choose the perfect plan for your business needs. All packages come with our commitment to excellence.",
  },
  faqs: [
    {
      question: "Can I change plans anytime?",
      answer:
        "Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately.",
      icon: "🔄",
    },
    {
      question: "Is there a free trial?",
      answer:
        "Yes, all plans come with a 14-day free trial. No credit card required.",
      icon: "🎯",
    },
    {
      question: "What payment methods do you accept?",
      answer:
        "We accept all major credit cards, PayPal, and bank transfers for annual plans.",
      icon: "💳",
    },
    {
      question: "Do you offer discounts for nonprofits?",
      answer:
        "Yes, we offer a 25% discount for registered nonprofit organizations.",
      icon: "🏛️",
    },
    {
      question: "Can I cancel anytime?",
      answer: "Absolutely. Cancel anytime with no hidden fees or penalties.",
      icon: "🚫",
    },
    {
      question: "Is there a setup fee?",
      answer:
        "No setup fees for any of our plans. What you see is what you pay.",
      icon: "🎁",
    },
  ],
  cta: {
    title: "Ready to transform your business?",
    description:
      "Join thousands of successful companies using our platform. Start your free trial today.",
    faqHeading: "Questions? We've got answers.",
    faqDescription: "Everything you need to know about our pricing and plans",
    faqCtaText: "Still have questions? We're here to help!",
    primaryLabel: "Start Free 14-Day Trial",
    primaryNote: "No credit card required",
    secondaryLabel: "Schedule Personalized Demo",
    secondaryHref: "/contact",
    features: ["No setup fees", "Cancel anytime", "24/7 support"],
  },
  services: cloneData(pricingData.services || []),
};

const cloneArray = (items, fallback = []) =>
  Array.isArray(items) ? cloneData(items) : cloneData(fallback);

export const normalizePricingPageContent = (value = {}) => ({
  hero: {
    ...cloneData(DEFAULT_PRICING_PAGE_CONTENT.hero),
    ...cloneData(value.hero || {}),
  },
  pricingSection: {
    ...cloneData(DEFAULT_PRICING_PAGE_CONTENT.pricingSection),
    ...cloneData(value.pricingSection || {}),
  },
  faqs: cloneArray(value.faqs, DEFAULT_PRICING_PAGE_CONTENT.faqs),
  cta: {
    ...cloneData(DEFAULT_PRICING_PAGE_CONTENT.cta),
    ...cloneData(value.cta || {}),
  },
  services: cloneArray(value.services, DEFAULT_PRICING_PAGE_CONTENT.services),
});

export const createDefaultPricingPageContent = () =>
  normalizePricingPageContent(DEFAULT_PRICING_PAGE_CONTENT);
