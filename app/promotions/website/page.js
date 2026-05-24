import PromotionFooter from "@/components/shared/PromotionFooter";
import Home from "@/components/promotion/Home/Home";
import {
  createDefaultPromotionPage,
  normalizePromotionPage,
} from "@/components/promotion/promotionPageConfig";

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL ||
  "https://a2it-usa-dashboard-backend.vercel.app";

export const metadata = {
  title: "Website Promotion",
  description:
    "Explore A2IT website promotion offers, featured packages, and growth-focused digital solutions.",
  alternates: {
    canonical: "/promotions/website",
  },
  openGraph: {
    title: "Website Promotion | A2IT LLC",
    description:
      "Explore A2IT website promotion offers, featured packages, and growth-focused digital solutions.",
    url: "/promotions/website",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Website Promotion | A2IT LLC",
    description:
      "Explore A2IT website promotion offers, featured packages, and growth-focused digital solutions.",
  },
};

async function loadPromotionPage(slug) {
  try {
    const response = await fetch(
      `${API_BASE}/api/promotional-pages/${encodeURIComponent(slug)}`,
      { cache: "no-store" },
    );

    if (!response.ok) {
      return createDefaultPromotionPage(slug);
    }

    const data = await response.json();
    return (
      normalizePromotionPage(data.page) || createDefaultPromotionPage(slug)
    );
  } catch (error) {
    return createDefaultPromotionPage(slug);
  }
}

export default async function Page() {
  const page = await loadPromotionPage("website");

  return (
    <>
      <Home pageConfig={page} />
      <PromotionFooter config={page.footer} />
    </>
  );
}
