import Link from "next/link";

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL ||
  "https://a2it-usa-dashboard-backend.vercel.app";

async function loadPromotionPages() {
  try {
    const response = await fetch(`${API_BASE}/api/promotional-pages`, {
      cache: "no-store",
    });

    if (!response.ok) {
      return [];
    }

    const data = await response.json();
    return data.pages || [];
  } catch (error) {
    return [];
  }
}

export const metadata = {
  title: "All Promotions",
  description:
    "Browse all active A2IT promotion landing pages and launch the experience that matches your campaign.",
  alternates: {
    canonical: "/promotions",
  },
  openGraph: {
    title: "All Promotions | A2IT LLC",
    description:
      "Browse all active A2IT promotion landing pages and launch the experience that matches your campaign.",
    url: "/promotions",
    type: "website",
    images: [
      {
        url: "/portfolio.png",
        width: 1200,
        height: 630,
        alt: "A2IT Promotions Hub",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "All Promotions | A2IT LLC",
    description:
      "Browse all active A2IT promotion landing pages and launch the experience that matches your campaign.",
    images: ["/portfolio.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default async function PromotionsIndexPage() {
  const pages = await loadPromotionPages();

  return (
    <main className="min-h-screen bg-[#06101f] text-white pt-28 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mb-12">
          <p className="text-cyan-300 uppercase tracking-[0.35em] text-xs mb-4">
            Promotions Hub
          </p>
          <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-4">
            Choose the promotional page you want to publish.
          </h1>
          <p className="text-slate-300 text-base md:text-lg">
            Each active slug below is managed from the dashboard and can render
            a different set of sections.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {(pages.length
            ? pages
            : [
                {
                  slug: "website",
                  title: "Website Promotion",
                  description: "Default promotions landing page",
                },
              ]
          ).map((page) => (
            <Link
              key={page.slug}
              href={`/promotions/${page.slug}`}
              className="group rounded-3xl border border-white/10 bg-white/5 backdrop-blur p-6 hover:border-cyan-400/40 hover:bg-white/10 transition"
            >
              <div className="text-xs uppercase tracking-[0.3em] text-cyan-300 mb-4">
                /promotions/{page.slug}
              </div>
              <h2 className="text-2xl font-semibold mb-3 group-hover:text-cyan-300 transition">
                {page.title}
              </h2>
              <p className="text-slate-300 mb-6">
                {page.description ||
                  page.metaDescription ||
                  "No description provided."}
              </p>
              <span className="inline-flex items-center gap-2 text-sm font-medium text-white/80 group-hover:text-white">
                Open page
                <span className="transition-transform group-hover:translate-x-1">
                  →
                </span>
              </span>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
