import DesignDevelopment from "@/components/ServicePage/design-development/DesignDevelopment";
import React from "react";

// 🔹 SEO metadata for Design & Development Services
export const metadata = {
  title: "Web & App Design and Development Services | A2IT",
  description:
    "A2IT provides professional web design, mobile app development, eCommerce solutions, and UI/UX design to help businesses build powerful digital experiences.",
  keywords: [
    "Web Design",
    "Web Development",
    "Mobile App Development",
    "eCommerce Development",
    "UI UX Design",
  ],
  alternates: {
    canonical: "https://a2itllc.com/services/design-development",
  },
  openGraph: {
    title: "Design & Development Services | A2IT",
    description:
      "Expert web and app design, eCommerce solutions, and UI/UX services to create engaging digital products.",
    url: "https://a2itllc.com/services/design-development",
    siteName: "A2IT",
    images: [
      {
        url: "/portfolio.png", // 👉 place an OG image in /public
        width: 1200,
        height: 630,
        alt: "Design & Development Services by A2IT",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Design & Development Services | A2IT",
    description:
      "Build stunning websites, apps, and eCommerce solutions with A2IT’s professional design & development team.",
    images: ["/portfolio.png"],
  },
};

export default function Page() {
  return (
    <>
      <DesignDevelopment />

      {/* 🔹 Schema Markup for Design & Development Services */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Service",
            serviceType: "Web & App Design and Development",
            provider: {
              "@type": "Organization",
              name: "A2IT",
              url: "https://a2itllc.com",
              logo: "https://a2itllc.com/A2ITLogo.png",
            },
            areaServed: {
              "@type": "Country",
              name: "Worldwide",
            },
            description:
              "Professional web design, mobile app development, eCommerce solutions, and UI/UX design services by A2IT.",
            hasOfferCatalog: {
              "@type": "OfferCatalog",
              name: "Design & Development Services",
              itemListElement: [
                {
                  "@type": "Offer",
                  itemOffered: {
                    "@type": "Service",
                    name: "Web Design & Development",
                  },
                },
                {
                  "@type": "Offer",
                  itemOffered: {
                    "@type": "Service",
                    name: "Mobile App Development",
                  },
                },
                {
                  "@type": "Offer",
                  itemOffered: {
                    "@type": "Service",
                    name: "eCommerce Development",
                  },
                },
                {
                  "@type": "Offer",
                  itemOffered: {
                    "@type": "Service",
                    name: "UI/UX Design",
                  },
                },
              ],
            },
          }),
        }}
      />
    </>
  );
}
