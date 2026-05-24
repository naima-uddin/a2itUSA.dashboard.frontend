import Link from "next/link";

const services = [
  {
    slug: "amazon",
    title: "Amazon Services",
    icon: "📦",
    desc: "Complete Amazon store setup and management services",
  },
  {
    slug: "shopify",
    title: "Shopify Development",
    icon: "🛍️",
    desc: "Professional Shopify store design and development",
  },
  {
    slug: "erp-system",
    title: "ERP System Development",
    icon: "⚙️",
    desc: "Custom ERP solutions for business management",
  },
  {
    slug: "server-hosting",
    title: "Server and Hosting Services",
    icon: "☁️",
    desc: "Reliable hosting and server management solutions",
  },
  {
    slug: "ebay",
    title: "E-bay Services",
    icon: "🏪",
    desc: "Complete E-bay store setup and optimization",
  },
];

// 🔹 Generate static params for all services
export async function generateStaticParams() {
  return services.map((service) => ({
    slug: service.slug,
  }));
}

// 🔹 Generate metadata for each service dynamically
export async function generateMetadata({ params }) {
  const resolvedParams = await Promise.resolve(params || {});
  const slug = String(resolvedParams.slug || services[0].slug);
  const service = services.find((s) => s.slug === slug) || services[0];

  return {
    title: `${service.title} `,
    description: service.desc,
    keywords: [
      service.title,
      "A2IT LLC",
      "IT Services",
      "Digital Solutions",
      "Web Development",
      "eCommerce",
    ],
    alternates: {
      canonical: `https://a2itllc.com/services/${slug}`,
    },
    openGraph: {
      title: `${service.title} `,
      description: service.desc,
      url: `https://a2itllc.com/services/${slug}`,
      siteName: "A2IT LLC",
      images: [
        {
          url: "/og-services.jpg",
          width: 1200,
          height: 630,
          alt: `${service.title} by A2IT LLC`,
        },
      ],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `${service.title} `,
      description: service.desc,
      images: ["/og-services.jpg"],
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default async function ServiceTemplate({ params }) {
  const { slug } = await params;
  const serviceSlug = slug || "amazon";
  const service = services.find((s) => s.slug === serviceSlug) || services[0];

  return (
    <>
      <main className="pt-20">
        <section className="relative min-h-[60vh] bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white flex items-center">
          <div className="relative max-w-7xl mx-auto px-6">
            <div className="max-w-3xl">
              <p className="text-yellow-500 font-semibold mb-4">OUR SERVICES</p>
              <h1 className="text-6xl font-bold mb-6">{service.title}</h1>
              <p className="text-xl text-gray-300">{service.desc}</p>
            </div>
          </div>
        </section>

        <section className="py-20 bg-black text-white">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <div>
                <h2 className="text-5xl font-bold mb-6">
                  PROFESSIONAL{" "}
                  <span className="text-yellow-500">SOLUTIONS</span>
                </h2>
                <p className="text-gray-300 text-lg">
                  We provide comprehensive {service.title.toLowerCase()} to help
                  your business succeed online. Our expert team delivers quality
                  solutions tailored to your specific needs.
                </p>
              </div>
              <div className="bg-gradient-to-br from-blue-900/50 to-purple-700/50 rounded-lg p-12 flex items-center justify-center">
                <div className="text-9xl">{service.icon}</div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-20 bg-gradient-to-r from-yellow-500 to-yellow-600">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <h2 className="text-5xl font-bold text-black mb-6">
              GET STARTED TODAY
            </h2>
            <Link
              href="/contact"
              className="inline-block px-8 py-4 bg-black text-white font-bold hover:bg-gray-800 transition-all"
            >
              CONTACT US
            </Link>
          </div>
        </section>
      </main>

      {/* 🔹 Schema Markup for Service */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Service",
            serviceType: service.title,
            provider: {
              "@type": "Organization",
              name: "A2IT LLC",
              url: "https://a2itllc.com",
              logo: "https://a2itllc.com/logo.png",
            },
            areaServed: {
              "@type": "Country",
              name: "Worldwide",
            },
            description: service.desc,
          }),
        }}
      />
    </>
  );
}
