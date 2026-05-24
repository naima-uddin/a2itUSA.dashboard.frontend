export const metadata = {
  title: "Thank You",
  description: "Thank you for contacting A2IT. We will get back to you soon.",
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
};

export default function ThankYouLayout({ children }) {
  return children;
}
