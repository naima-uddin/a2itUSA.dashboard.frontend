export const metadata = {
  title: "IT Services",
  description:
    "Explore A2IT LLC's full range of IT services including Web Development, Mobile App Development, UI/UX Design, SEO, Paid Media, Amazon Marketing, ERP Solutions, Hosting, Shopify, and more.",
  keywords: [
    "IT Services",
    "Web Development",
    "Mobile App Development",
    "UI/UX Design",
    "SEO",
    "SEM",
    "PPC",
    "Amazon Marketing",
    "ERP Solutions",
    "Cloud Hosting",
    "Shopify Development",
    "Server and Hosting Services",
    "E-commerce Solutions",
  ],
  alternates: {
    canonical: "https://a2itllc.com/services",
  },
  openGraph: {
    title: "IT Services",
    description:
      "Discover A2IT LLC's complete suite of IT services including web & mobile development, SEO, digital marketing, hosting, Shopify, and ERP solutions.",
    url: "https://a2itllc.com/services",
    siteName: "A2IT LLC",
    images: [
      {
        url: "/portfolio.png",
        width: 1200,
        height: 630,
        alt: "IT Services by A2IT LLC",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "IT Services",
    description:
      "Explore A2IT LLC's full range of IT services including Web Development, Mobile App Development, UI/UX, SEO, Paid Media, Amazon Marketing, ERP Solutions, Hosting, Shopify, and more.",
    images: ["/portfolio.png"],
  },
};

export default function ServicesPage() {
  return (
    <>
      <h1 className="text-3xl font-bold mb-6">Our Services</h1>
      {/* Render your service categories/components here */}
      
      {/* 🔹 Schema Markup for Services */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Service",
            serviceType: "IT Services",
            provider: {
              "@type": "Organization",
              name: "A2IT LLC",
              url: "https://a2itllc.com",
              logo: "https://a2itllc.com/A2ITLogo.png",
            },
            areaServed: {
              "@type": "Country",
              name: "Worldwide",
            },
            description:
              "A2IT LLC provides a full range of IT services including Web Development, Mobile Apps, UI/UX, SEO, Paid Media, Amazon Marketing, ERP Solutions, Hosting, Shopify, and more.",
            hasOfferCatalog: {
              "@type": "OfferCatalog",
              name: "IT Services",
              itemListElement: [
                { "@type": "Offer", itemOffered: { "@type": "Service", name: "Web Development" } },
                { "@type": "Offer", itemOffered: { "@type": "Service", name: "Mobile App Development" } },
                { "@type": "Offer", itemOffered: { "@type": "Service", name: "UI/UX Design" } },
                { "@type": "Offer", itemOffered: { "@type": "Service", name: "SEO & SEM" } },
                { "@type": "Offer", itemOffered: { "@type": "Service", name: "PPC / Paid Media" } },
                { "@type": "Offer", itemOffered: { "@type": "Service", name: "Amazon Marketing" } },
                { "@type": "Offer", itemOffered: { "@type": "Service", name: "ERP Solutions" } },
                { "@type": "Offer", itemOffered: { "@type": "Service", name: "Hosting & Cloud Services" } },
                { "@type": "Offer", itemOffered: { "@type": "Service", name: "Shopify Development" } },
                { "@type": "Offer", itemOffered: { "@type": "Service", name: "E-commerce Solutions" } },
              ],
            },
          }),
        }}
      />
    </>
  );
}
