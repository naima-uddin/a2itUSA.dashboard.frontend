import Pricing from '@/components/pricing-page-compoents/Pricing'
import React from 'react'

// 🔹 SEO metadata for Pricing Page
export const metadata = {
  title: "Pricing | Affordable IT Service Packages",
  description:
    "Explore A2IT LLC's competitive pricing for IT services including web development, mobile apps, eCommerce, Shopify, Amazon, SEO, and digital marketing solutions.",
  keywords: [
    "A2IT Pricing",
    "IT Services Pricing",
    "Web Development Cost",
    "Mobile App Development Pricing",
    "eCommerce Pricing",
    "Shopify Development Cost",
    "SEO Pricing",
    "Digital Marketing Packages",
  ],
  alternates: {
    canonical: "https://a2itllc.com/pricing",
  },
  openGraph: {
    title: "Pricing | Affordable IT Service Packages",
    description:
      "Get transparent pricing for A2IT LLC's web development, mobile apps, eCommerce, Shopify, Amazon, and digital marketing services.",
    url: "https://a2itllc.com/pricing",
    siteName: "A2IT LLC",
    images: [
      {
        url: "/pricing-img.avif",
        width: 1200,
        height: 630,
        alt: "A2IT LLC Pricing Plans",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Pricing | Affordable IT Service Packages",
    description:
      "Explore competitive pricing for IT services from A2IT LLC including web development, mobile apps, eCommerce, and digital marketing.",
    images: ["/pricing-img.avif"],
  },
};

export default function page() {
  return (
    <>
      <Pricing  />
      
      {/* 🔹 Schema Markup for Pricing Page */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "PriceSpecification",
            name: "A2IT LLC Service Pricing",
            url: "https://a2itllc.com/pricing",
            description:
              "Transparent and competitive pricing for IT services including web development, mobile apps, eCommerce, Shopify, and digital marketing solutions.",
            priceCurrency: "USD",
            provider: {
              "@type": "Organization",
              name: "A2IT LLC",
              url: "https://a2itllc.com",
              logo: "https://a2itllc.com/A2ITLogo.png",
            },
          }),
        }}
      />
    </>
  )
}
