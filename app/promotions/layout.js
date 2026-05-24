import { Manrope, Source_Code_Pro, Oswald } from "next/font/google";
import "../globals.css";
import StickyContactBar from "@/components/shared/StickyContactBar";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
});

const sourceCodePro = Source_Code_Pro({
  variable: "--font-source-code-pro",
  subsets: ["latin"],
});

const oswald = Oswald({
  variable: "--font-oswald",
  subsets: ["latin"],
});

export const metadata = {
  title: {
    default: "Promotions",
    template: "%s | A2IT LLC",
  },
  description:
    "Explore A2IT promotional landing pages for web, e-commerce, marketing, and growth solutions.",
  keywords: [
    "A2IT promotions",
    "website promotion",
    "digital marketing campaign",
    "ecommerce growth",
    "landing page offers",
  ],
  alternates: {
    canonical: "/promotions",
  },
  openGraph: {
    title: "Promotions | A2IT LLC",
    description:
      "Explore A2IT promotional landing pages for web, e-commerce, marketing, and growth solutions.",
    url: "/promotions",
    type: "website",
    images: [
      {
        url: "/portfolio.png",
        width: 1200,
        height: 630,
        alt: "A2IT Promotions",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Promotions | A2IT LLC",
    description:
      "Explore A2IT promotional landing pages for web, e-commerce, marketing, and growth solutions.",
    images: ["/portfolio.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }) {
  return (
    <div
      className={`${manrope.variable} ${sourceCodePro.variable} ${oswald.variable} antialiased`}
    >
      <StickyContactBar />
      {children}
    </div>
  );
}
