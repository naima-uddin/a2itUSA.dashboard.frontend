import ContactUsWrapper from "@/components/contact-page-component/ContactUsWrapper";
import React from "react";

export const metadata = {

  metadataBase: new URL('https://a2itllc.com'),
  title: "Contact Us | Get in Touch",
  description:
    "Get in touch with A2IT LLC for inquiries about IT services, web development, eCommerce solutions, digital marketing, and more.",
  keywords: [
    "Contact A2IT LLC",
    "IT Services Inquiry",
    "Web Development Contact",
    "eCommerce Consultation",
    "Digital Marketing Contact",
    "Shopify Contact",
    "Amazon Services Inquiry",
  ],
  alternates: {
    canonical: "https://a2itllc.com/contact",
  },
  openGraph: {
    title: "Contact Us | Get in Touch",
    description:
      "Reach out to A2IT LLC for any queries regarding web development, mobile apps, eCommerce, Shopify, Amazon, or digital marketing services.",
    url: "https://a2itllc.com/contact",
    siteName: "A2IT LLC",
    images: [
      {
        url: "/portfolio.png",
        width: 1200,
        height: 630,
        alt: "Contact A2IT LLC",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Contact Us | Get in Touch",
    description:
      "Contact A2IT LLC for inquiries about IT services, web development, eCommerce, Shopify, Amazon, and digital marketing solutions.",
    images: ["/portfolio.png"],
  },
};

export default function Page() {
  return (
    <>
      <ContactUsWrapper />

      {/* Schema JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ContactPage",
            name: "Contact Us",
            url: "https://a2itllc.com/contact",
            description:
              "Get in touch with A2IT LLC for inquiries about IT services, web development, eCommerce solutions, digital marketing, and more.",
            publisher: {
              "@type": "Organization",
              name: "A2IT LLC",
              url: "https://a2itllc.com",
              logo: "https://a2itllc.com/A2ITLogo.png",
            },
            contactOption: [
              {
                "@type": "ContactPoint",
                contactType: "customer support",
                telephone: "+18083015039",
                email: "info@a2itllc.com",
                areaServed: "Worldwide",
              },
              {
                "@type": "ContactPoint",
                contactType: "Bangladesh office",
                telephone: "+8801846937397",
                email: "info@a2itllc.com",
                areaServed: "Bangladesh",
              },
            ],
          }),
        }}
      />
    </>
  );
}





