import EcommercePage from "@/components/ServicePage/E-commerce/EcommercePage";
import React from "react";

// 🔹 SEO metadata for E-commerce Development Services
export const metadata = {
  title: "E-commerce Development Solutions | A2IT",
  description:
    "A2IT builds powerful e-commerce solutions including custom online stores, Shopify, WooCommerce, Magento, and secure payment integrations.",
  keywords: [
    "E-commerce Development",
    "Online Store Development",
    "Shopify Development",
    "WooCommerce Development",
    "Magento Development",
    "Custom E-commerce Solutions",
  ],
  alternates: {
    canonical: "https://a2itllc.com/services/ecommerce",
  },
  openGraph: {
    title: "E-commerce Development Services | A2IT",
    description:
      "Professional e-commerce development including Shopify, WooCommerce, Magento, and custom solutions for businesses worldwide.",
    url: "https://a2itllc.com/services/ecommerce",
    siteName: "A2IT",
    images: [
      {
        url: "/portfolio.png", // 👉 place an OG image in /public
        width: 1200,
        height: 630,
        alt: "E-commerce Development by A2IT",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "E-commerce Development Services | A2IT",
    description:
      "A2IT provides e-commerce solutions including Shopify, WooCommerce, Magento, and secure payment integrations.",
    images: ["/portfolio.png"],
  },
};

export default function Page() {
  return (
    <>
      <EcommercePage />

      {/* 🔹 Schema Markup for E-commerce Development Services */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Service",
            serviceType: "E-commerce Development",
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
              "A2IT offers professional e-commerce development services including custom online stores, Shopify, WooCommerce, and Magento solutions.",
            hasOfferCatalog: {
              "@type": "OfferCatalog",
              name: "E-commerce Development Services",
              itemListElement: [
                {
                  "@type": "Offer",
                  itemOffered: {
                    "@type": "Service",
                    name: "Custom Online Store Development",
                  },
                },
                {
                  "@type": "Offer",
                  itemOffered: {
                    "@type": "Service",
                    name: "Shopify Development",
                  },
                },
                {
                  "@type": "Offer",
                  itemOffered: {
                    "@type": "Service",
                    name: "WooCommerce Development",
                  },
                },
                {
                  "@type": "Offer",
                  itemOffered: {
                    "@type": "Service",
                    name: "Magento Development",
                  },
                },
                {
                  "@type": "Offer",
                  itemOffered: {
                    "@type": "Service",
                    name: "Secure Payment Integration",
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
