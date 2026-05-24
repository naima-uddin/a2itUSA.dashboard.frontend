import ShopifyServices from "@/components/ServicePage/shopify/ShopifyServices";
import React from "react";

// 🔹 SEO metadata for Shopify Services
export const metadata = {
  title: "Shopify Development Services | eCommerce Solutions",
  description:
    "A2IT LLC provides professional Shopify development services to build, customize, and optimize your eCommerce store for maximum sales and performance.",
  keywords: [
    "Shopify Development",
    "eCommerce Solutions",
    "Shopify Store Setup",
    "Shopify Customization",
    "Shopify Optimization",
    "Online Store Development",
    "Managed Shopify Services",
  ],
  alternates: {
    canonical: "https://a2itllc.com/services/shopify",
  },
  openGraph: {
    title: "Shopify Development Services | eCommerce Solutions",
    description:
      "Professional Shopify development services from A2IT LLC. Get custom Shopify stores, app integrations, and eCommerce optimization.",
    url: "https://a2itllc.com/services/shopify",
    siteName: "A2IT LLC",
    images: [
      {
        url: "/portfolio.png",
        width: 1200,
        height: 630,
        alt: "Shopify Services by A2IT LLC",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Shopify Development Services | eCommerce Solutions",
    description:
      "A2IT LLC offers custom Shopify development, store optimization, and eCommerce solutions with professional support.",
    images: ["/portfolio.png"],
  },
};

export default function Page() {
  return (
    <>
      <ShopifyServices />

      {/* 🔹 Schema Markup for Shopify Services */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Service",
            serviceType: "Shopify Development",
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
              "A2IT LLC provides expert Shopify development services including store setup, customization, app integrations, and optimization for eCommerce success.",
            hasOfferCatalog: {
              "@type": "OfferCatalog",
              name: "Shopify Services",
              itemListElement: [
                {
                  "@type": "Offer",
                  itemOffered: {
                    "@type": "Service",
                    name: "Shopify Store Setup",
                  },
                },
                {
                  "@type": "Offer",
                  itemOffered: {
                    "@type": "Service",
                    name: "Shopify Theme Customization",
                  },
                },
                {
                  "@type": "Offer",
                  itemOffered: {
                    "@type": "Service",
                    name: "Shopify App Integration",
                  },
                },
                {
                  "@type": "Offer",
                  itemOffered: {
                    "@type": "Service",
                    name: "Shopify Store Optimization",
                  },
                },
                {
                  "@type": "Offer",
                  itemOffered: {
                    "@type": "Service",
                    name: "Managed Shopify Services",
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
