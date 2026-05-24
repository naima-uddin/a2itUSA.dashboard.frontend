import ProtectedLayoutClient from "./ProtectedLayoutClient";

export const metadata = {
  title: "Dashboard",
  description: "A2IT internal dashboard for content and team management.",
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
    canonical: "/dashboard",
  },
};

export default function DashboardLayout({ children }) {
  return <ProtectedLayoutClient>{children}</ProtectedLayoutClient>;
}
