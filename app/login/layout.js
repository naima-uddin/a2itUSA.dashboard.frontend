export const metadata = {
  title: "Dashboard Login",
  description: "Sign in to access the A2IT dashboard.",
  keywords: ["A2IT LLC", "dashboard login", "admin login", "secure access"],
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
    canonical: "/login",
  },
  openGraph: {
    title: "Dashboard Login | A2IT LLC",
    description: "Sign in to access the A2IT dashboard.",
    url: "/login",
    type: "website",
    images: [
      {
        url: "/A2ITLogo.png",
        width: 1200,
        height: 630,
        alt: "A2IT LLC Dashboard Login",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Dashboard Login | A2IT LLC",
    description: "Sign in to access the A2IT dashboard.",
    images: ["/A2ITLogo.png"],
  },
};

export default function LoginLayout({ children }) {
  return children;
}
