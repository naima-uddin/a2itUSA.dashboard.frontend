import BlogListClient from "@/components/blog/BlogListClient";

export const metadata = {
  title: "Blog",
  description:
    "Read A2IT LLC blog articles, case studies, and insights on web development, eCommerce, SEO, and digital growth.",
  keywords: [
    "A2IT blog",
    "web development blog",
    "ecommerce tips",
    "SEO insights",
    "digital marketing articles",
  ],
  alternates: {
    canonical: "/blog",
  },
  openGraph: {
    title: "Blog | A2IT LLC",
    description:
      "Read A2IT LLC blog articles, case studies, and insights on web development, eCommerce, SEO, and digital growth.",
    url: "/blog",
    type: "website",
    images: [
      {
        url: "/A2IT%20Blog.jpg",
        width: 1200,
        height: 630,
        alt: "A2IT LLC Blog",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Blog | A2IT LLC",
    description:
      "Read A2IT LLC blog articles, case studies, and insights on web development, eCommerce, SEO, and digital growth.",
    images: ["/A2IT%20Blog.jpg"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function BlogPage() {
  return <BlogListClient />;
}
