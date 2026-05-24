export const metadata = {
  title: "Dashboard Login",
  description: "Sign in to access the A2IT dashboard.",
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
};

export default function LoginLayout({ children }) {
  return children;
}
