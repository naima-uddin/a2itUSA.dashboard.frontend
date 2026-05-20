import { Geist, Geist_Mono, Oswald } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import NavbarSwitcher from "@/components/shared/NavbarSwitcher";
import Footer from "@/components/shared/Footer";
import WhatsAppFloating from "@/components/shared/WhatsAppFloating";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "@/context/AuthContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const oswald = Oswald({
  variable: "--font-oswald",
  subsets: ["latin"],
});

// 🔹 Global SEO metadata
export const metadata = {
  metadataBase: new URL("https://a2itllc.com"),
  title: {
    default:
      "A2IT LLC | IT Services, Web Development, eCommerce & Digital Solutions",
    template: "%s | A2IT LLC",
  },
  description:
    "A2IT LLC provides IT services including web development, mobile apps, UI/UX design, eCommerce, Shopify, Amazon, eBay, SEO, and digital marketing solutions worldwide.",
  keywords: [
    "A2IT LLC",
    "IT Services",
    "Web Development",
    "Mobile App Development",
    "UI/UX Design",
    "eCommerce Solutions",
    "Shopify",
    "Amazon",
    "eBay",
    "SEO",
    "Digital Marketing",
    "ERP Solutions",
    "Cloud Hosting",
  ],
  authors: [{ name: "A2IT LLC" }],
  creator: "A2IT LLC",
  publisher: "A2IT LLC",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  icons: {
    icon: "/A2ITLogo.png",
    shortcut: "/A2ITLogo.png",
    apple: "/A2ITLogo.png",
  },
  manifest: "/manifest.json",
  openGraph: {
    title:
      "A2IT LLC | IT Services, Web Development, eCommerce & Digital Solutions",
    description:
      "Professional IT services, web & mobile development, eCommerce, digital marketing, and marketplace solutions from A2IT LLC.",
    url: "https://a2itllc.com",
    siteName: "A2IT LLC",
    images: [
      {
        url: "/A2ITLogo.png",
        width: 1200,
        height: 630,
        alt: "A2IT LLC - IT Services and Digital Solutions",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title:
      "A2IT LLC | IT Services, Web Development, eCommerce & Digital Solutions",
    description:
      "A2IT LLC offers IT services, web development, mobile apps, eCommerce, Shopify, Amazon, eBay, SEO, and digital marketing solutions.",
    images: ["/A2ITLogo.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "your-google-verification-code",
    yandex: "your-yandex-verification-code",
    bing: "your-bing-verification-code",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=5"
        />
        {/* Meta Pixel Code */}
        <Script
          id="facebook-pixel"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              !function(f,b,e,v,n,t,s)
              {if(f.fbq)return;n=f.fbq=function(){
              n.callMethod?
              n.callMethod.apply(n,arguments):n.queue.push(arguments)};
              if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
              n.queue=[];t=b.createElement(e);t.async=!0;
              t.src=v;s=b.getElementsByTagName(e)[0];
              s.parentNode.insertBefore(t,s)}(window, document,'script',
              'https://connect.facebook.net/en_US/fbevents.js');
              fbq('init', '896902410076605');
              fbq('track', 'PageView');
            `,
          }}
        />
        <noscript>
          <img
            height="1"
            width="1"
            style={{ display: "none" }}
            src="https://www.facebook.com/tr?id=896902410076605&ev=PageView&noscript=1"
            alt=""
          />
        </noscript>
        {/* End Meta Pixel Code */}
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${oswald.variable}  antialiased`}
      >
        <AuthProvider>
          <Toaster
            position="top-center"
            reverseOrder={false}
            toastOptions={{
              duration: 4000,
              style: {
                background: "#363636",
                color: "#fff",
              },
              success: {
                duration: 3000,
                iconTheme: {
                  primary: "#10b981",
                  secondary: "#fff",
                },
              },
              error: {
                duration: 4000,
                iconTheme: {
                  primary: "#ef4444",
                  secondary: "#fff",
                },
              },
            }}
          />
          <NavbarSwitcher />
          <WhatsAppFloating />
          {children}
          <Footer />
        </AuthProvider>

        {/* 🔹 JSON-LD structured data for organization */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "A2IT LLC",
              url: "https://a2itllc.com",
              logo: "https://a2itllc.com/A2ITLogo.png",
              sameAs: [
                "https://www.facebook.com/A2ITLLC",
                "https://www.linkedin.com/company/yourcompany",
                "https://twitter.com/yourcompany",
              ],
              description:
                "A2IT LLC provides IT services including web development, mobile apps, UI/UX, eCommerce, Shopify, Amazon, eBay, SEO, and digital marketing solutions worldwide.",
              contactPoint: [
                {
                  "@type": "ContactPoint",
                  contactType: "customer support",
                  telephone: "+18083015039",
                  email: "info@a2itllc.com",
                  areaServed: "Worldwide",
                },
              ],
            }),
          }}
        />
      </body>
    </html>
  );
}
