import PromotionFooter from "@/components/shared/PromotionFooter";
import Home from "@/components/promotion/Home/Home";
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
      return createDefaultPromotionPage(slug);
    }

    const data = await response.json();
    return normalizePromotionPage(data.page) || createDefaultPromotionPage(slug);
  } catch (error) {
    return createDefaultPromotionPage(slug);
  }
}

export default async function Page() {
  const page = await loadPromotionPage("website");

  return (
    <>
      <Home pageConfig={page} />
      <PromotionFooter />
    </>
  );
}
