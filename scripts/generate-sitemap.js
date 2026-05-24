const fs = require("fs");
const path = require("path");

const baseUrl = "https://a2itllc.com";
const rootDir = path.join(__dirname, "..");
const blogDataPath = path.join(rootDir, "public", "blog-data.json");
const sitemapPath = path.join(rootDir, "public", "sitemap.xml");

const staticRoutes = [
  ["/", "daily", "1.0"],
  ["/about", "monthly", "0.9"],
  ["/services", "weekly", "0.9"],
  ["/portfolio", "weekly", "0.9"],
  ["/blog", "daily", "0.9"],
  ["/pricing", "monthly", "0.8"],
  ["/contact", "monthly", "0.8"],
  ["/privacy-policy", "yearly", "0.5"],
  ["/terms-of-service", "yearly", "0.5"],
  ["/services/amazon", "monthly", "0.8"],
  ["/services/shopify", "monthly", "0.8"],
  ["/services/e-bay", "monthly", "0.8"],
  ["/services/design-development", "monthly", "0.8"],
  ["/services/e-commerce", "monthly", "0.8"],
  ["/services/erp", "monthly", "0.8"],
  ["/services/mobile-app", "monthly", "0.8"],
  ["/services/seo", "monthly", "0.8"],
  ["/services/server-hosting", "monthly", "0.8"],
  ["/services/social-media", "monthly", "0.8"],
];

function escapeXml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function resolveLastMod(value) {
  const date = value ? new Date(value) : new Date();
  return Number.isNaN(date.getTime()) ? new Date().toISOString() : date.toISOString();
}

function buildUrlEntry(urlPath, changeFrequency, priority, lastModified) {
  return [
    "  <url>",
    `    <loc>${escapeXml(`${baseUrl}${urlPath}`)}</loc>`,
    `    <lastmod>${escapeXml(resolveLastMod(lastModified))}</lastmod>`,
    `    <changefreq>${escapeXml(changeFrequency)}</changefreq>`,
    `    <priority>${escapeXml(priority)}</priority>`,
    "  </url>",
  ].join("\n");
}

function loadBlogUrls() {
  try {
    const raw = fs.readFileSync(blogDataPath, "utf8");
    const data = JSON.parse(raw);
    const blogs = Array.isArray(data?.blogs) ? data.blogs : Array.isArray(data) ? data : [];

    return blogs
      .map((blog) => ({
        slug: String(blog?.slug || "").trim(),
        lastModified: blog?.datePublished || blog?.createdAt || null,
      }))
      .filter((blog) => blog.slug)
      .map((blog) => buildUrlEntry(`/blog/${blog.slug}`, "weekly", "0.8", blog.lastModified));
  } catch (error) {
    console.warn("[sitemap] Failed to read blog-data.json:", error.message);
    return [];
  }
}

function main() {
  const urlEntries = [
    ...staticRoutes.map(([urlPath, changeFrequency, priority]) =>
      buildUrlEntry(urlPath, changeFrequency, priority),
    ),
    ...loadBlogUrls(),
  ].join("\n");

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urlEntries}\n</urlset>\n`;

  fs.writeFileSync(sitemapPath, sitemap, "utf8");
  console.log(`[sitemap] Wrote ${path.relative(rootDir, sitemapPath)}`);
}

main();