export const metadata = {
  title: "Thank You",
  description: "Thank you for contacting A2IT. We will get back to you soon.",
  keywords: ["A2IT LLC", "thank you", "contact form", "confirmation"],
  robots: {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false,
      noimageindex: true,
    },
  },
  alternates: {
    canonical: "/thank-you",
  },
  openGraph: {
    title: "Thank You | A2IT LLC",
    description: "Thank you for contacting A2IT. We will get back to you soon.",
    url: "/thank-you",
    type: "website",
    images: [
      {
        url: "/A2ITLogo.png",
        width: 1200,
        height: 630,
        alt: "Thank You - A2IT LLC",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Thank You | A2IT LLC",
    description: "Thank you for contacting A2IT. We will get back to you soon.",
    images: ["/A2ITLogo.png"],
  },
};

export default function ThankYouLayout({ children }) {
  return children;
}
