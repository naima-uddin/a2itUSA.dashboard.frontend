import { notFound } from "next/navigation";
import Home from "@/components/promotion/Home/Home";
import PromotionFooter from "@/components/shared/PromotionFooter";
import {
  createDefaultPromotionPage,
  normalizePromotionPage,
} from "@/components/promotion/promotionPageConfig";

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL ||
  "https://a2it-usa-dashboard-backend.vercel.app";

export const dynamicParams = false;

async function loadPromotionSlugs() {
  try {
    const response = await fetch(`${API_BASE}/api/promotional-pages`, {
      cache: "force-cache",
    });

    if (!response.ok) {
      return ["website"];
    }

    const data = await response.json();
    const slugs = (data.pages || [])
      .map((page) => String(page?.slug || "").trim())
      .filter(Boolean);

    const unique = Array.from(new Set(["website", ...slugs]));
    return unique;
  } catch {
    return ["website"];
  }
}

async function loadPromotionPage(slug) {
  try {
    const response = await fetch(
      `${API_BASE}/api/promotional-pages/${encodeURIComponent(slug)}`,
      { cache: "force-cache" },
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

export async function generateStaticParams() {
  const slugs = await loadPromotionSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }) {
  const resolvedParams = await Promise.resolve(params || {});
  const slug = String(resolvedParams.slug || "website");
  const page = await loadPromotionPage(slug);
  const readableSlug = slug
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");

  if (!page) {
    return {
      title: `${readableSlug || "Promotion"}`,
      description: "Promotional landing page by A2IT LLC.",
      alternates: {
        canonical: `/promotions/${slug}`,
      },
      robots: {
        index: true,
        follow: true,
      },
    };
  }

  const title = page.metaTitle || page.title || `${readableSlug} Promotion`;
  const description =
    page.metaDescription ||
    page.description ||
    "Explore this promotion by A2IT LLC.";
  const image =
    page?.sections?.find((section) => section?.key === "banner")?.config
      ?.bannerImage || "/portfolio.png";

  return {
    title,
    description,
    keywords: [
      `${readableSlug} promotion`,
      "A2IT promotions",
      "landing page",
      "digital campaign",
    ],
    alternates: {
      canonical: `/promotions/${slug}`,
    },
    openGraph: {
      title: `${title} | A2IT LLC`,
      description,
      url: `/promotions/${slug}`,
      type: "website",
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: `${title} - A2IT Promotion`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | A2IT LLC`,
      description,
      images: [image],
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default async function PromotionSlugPage({ params }) {
  const resolvedParams = await Promise.resolve(params || {});
  const slug = String(resolvedParams.slug || "website");
  const page = await loadPromotionPage(slug);

  if (!page) {
    notFound();
  }

  return (
    <>
      <Home pageConfig={page} />
      <PromotionFooter config={page.footer} />
    </>
  );
}
