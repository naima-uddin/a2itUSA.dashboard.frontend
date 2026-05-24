// app/amazon-affiliate-advertiser-disclosure/page.tsx
import AmazonAffiliateAdvertiserDisclosure from "@/components/AmazonAffiliateAdvertiserDisclosure";
import React from "react";

// ✅ SEO metadata for Affiliate Disclosure page
export const metadata = {
  title: "Advertiser Disclosure | A2IT LLC",
  description:
    "A2IT LLC participates in affiliate advertising programs. Learn more about our advertiser disclosure and how we earn commissions through partnerships.",
  openGraph: {
    title: "Advertiser Disclosure | A2IT LLC",
    description:
      "Transparency matters. Read our Advertiser Disclosure to understand how A2IT LLC earns commissions from qualifying referrals and partnerships.",
    url: "https://a2itllc.com/advertiser-disclosure",
    siteName: "A2IT LLC",
    images: [
      {
        url: "/portfolio.png",
        width: 1200,
        height: 630,
        alt: "Advertiser Disclosure - A2IT LLC",
      },
    ],
    type: "article",
  },
  twitter: {
    card: "summary_large_image",
    title: "Advertiser Disclosure | A2IT LLC",
    description:
      "A2IT LLC participates in affiliate advertising programs. Learn about our disclosure and commissions policy.",
    images: ["/portfolio.png"],
  },
  alternates: {
    canonical: "https://a2itllc.com/advertiser-disclosure",
  },
};

export default function Page() {
  return <AmazonAffiliateAdvertiserDisclosure />;
}
