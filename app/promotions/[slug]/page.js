import { notFound } from "next/navigation";
import Home from "@/components/promotion/Home/Home";
import PromotionFooter from "@/components/shared/PromotionFooter";
import {
  createDefaultPromotionPage,
  normalizePromotionPage,
} from "@/components/promotion/promotionPageConfig";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

async function loadPromotionPage(slug) {
  try {
    const response = await fetch(
      `${API_BASE}/api/promotional-pages/${encodeURIComponent(slug)}`,
      { cache: "no-store" },
    );

    if (!response.ok) {
      if (slug === "website") {
        return createDefaultPromotionPage(slug);
      }

      return null;
    }

    const data = await response.json();
    return normalizePromotionPage(data.page);
  } catch (error) {
    if (slug === "website") {
      return createDefaultPromotionPage(slug);
    }

    return null;
  }
}

export async function generateMetadata({ params }) {
  const slug = params?.slug || "website";
  const page = await loadPromotionPage(slug);

  if (!page) {
    return {
      title: "Promotions",
      description: "Promotional landing pages",
    };
  }

  return {
    title: page.metaTitle || page.title,
    description: page.metaDescription || page.description,
    alternates: {
      canonical: `/promotions/${slug}`,
    },
  };
}

export default async function PromotionSlugPage({ params }) {
  const slug = params?.slug || "website";
  const page = await loadPromotionPage(slug);

  if (!page) {
    notFound();
  }

  return (
    <>
      <Home pageConfig={page} />
      <PromotionFooter />
    </>
  );
}
