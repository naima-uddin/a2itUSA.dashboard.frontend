"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { motion } from "framer-motion";
import { Plus, Search, Trash2, Edit2 } from "lucide-react";
import DashboardLayout from "../components/DashboardLayout";
import PromotionSectionEditor from "@/components/promotion/PromotionSectionEditor";
import {
  DEFAULT_PROMOTION_PAGE,
  createDefaultPromotionPage,
  PROMOTION_SECTION_KEYS,
  PROMOTION_SECTION_LABELS,
} from "@/components/promotion/promotionPageConfig";

const API_BASE = process.env.NEXT_PUBLIC_API_URL;

const cloneData = (value) => JSON.parse(JSON.stringify(value || {}));

const mergeSectionData = (
  templateSection = {},
  pageSection = {},
  index = 0,
) => ({
  key: templateSection.key || pageSection.key || "",
  enabled:
    pageSection.enabled !== undefined
      ? pageSection.enabled !== false
      : templateSection.enabled !== false,
  order:
    pageSection.order !== undefined &&
    Number.isFinite(Number(pageSection.order))
      ? Number(pageSection.order)
      : templateSection.order !== undefined &&
          Number.isFinite(Number(templateSection.order))
        ? Number(templateSection.order)
        : index,
  config: {
    ...cloneData(templateSection.config || {}),
    ...cloneData(pageSection.config || {}),
  },
});

const createDefaultSectionState = (page = DEFAULT_PROMOTION_PAGE) =>
  PROMOTION_SECTION_KEYS.map((key, index) => {
    const existingSection = (page.sections || []).find(
      (section) => section.key === key,
    );
    return {
      key,
      enabled:
        existingSection?.enabled !== undefined
          ? existingSection.enabled !== false
          : true,
      order:
        existingSection && Number.isFinite(Number(existingSection.order))
          ? Number(existingSection.order)
          : index,
      config: cloneData(existingSection?.config || {}),
    };
  });

const createFormDataFromPage = (
  page = DEFAULT_PROMOTION_PAGE,
  options = {},
) => ({
  slug: options.slug !== undefined ? options.slug : page.slug || "",
  title: page.title || "",
  description: page.description || "",
  metaTitle: page.metaTitle || "",
  metaDescription: page.metaDescription || "",
  isActive: page.isActive !== false,
  sections: createDefaultSectionState(page),
  footer: {
    ...(DEFAULT_PROMOTION_PAGE.footer || {}),
    ...(page.footer || {}),
  },
});

const createDefaultFormData = (page = DEFAULT_PROMOTION_PAGE) =>
  createFormDataFromPage(page, { slug: "" });

const mergePageWithTemplate = (templatePage, page) => ({
  slug: page?.slug || templatePage?.slug || "",
  title: page?.title || templatePage?.title || "",
  description: page?.description || templatePage?.description || "",
  metaTitle: page?.metaTitle || templatePage?.metaTitle || "",
  metaDescription: page?.metaDescription || templatePage?.metaDescription || "",
  isActive: page?.isActive !== false,
  sections: PROMOTION_SECTION_KEYS.map((key, index) => {
    const templateSection = (templatePage?.sections || []).find(
      (section) => section.key === key,
    );
    const pageSection = (page?.sections || []).find(
      (section) => section.key === key,
    );

    return mergeSectionData(templateSection || {}, pageSection || {}, index);
  }),
  footer: {
    ...(DEFAULT_PROMOTION_PAGE.footer || {}),
    ...(templatePage?.footer || {}),
    ...(page?.footer || {}),
  },
});

export default function PromotionalPagesDashboard() {
  const { token, isAdmin, isModerator } = useAuth();
  const [items, setItems] = useState([]);
  const [websiteTemplate, setWebsiteTemplate] = useState(
    DEFAULT_PROMOTION_PAGE,
  );
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [formData, setFormData] = useState(createDefaultFormData());
  const [formError, setFormError] = useState("");
  const [uploadingFooterLogo, setUploadingFooterLogo] = useState(false);
  const [savingSectionKey, setSavingSectionKey] = useState("");
  const [collapsedSections, setCollapsedSections] = useState({});

  const isAllowed = isAdmin || isModerator;

  const resetForm = (template = websiteTemplate) => {
    setFormData(createDefaultFormData(template));
    setFormError("");
  };

  const fetchWebsiteTemplate = useCallback(async () => {
    try {
      const response = await fetch(`${API_BASE}/api/promotional-pages/website`);

      if (!response.ok) {
        return createDefaultPromotionPage("website");
      }

      const data = await response.json();
      return mergePageWithTemplate(
        createDefaultPromotionPage("website"),
        data.page || {},
      );
    } catch (error) {
      console.error("Error fetching website template:", error);
      return createDefaultPromotionPage("website");
    }
  }, []);

  const fetchPages = useCallback(async () => {
    try {
      setLoading(true);
      const [pagesResponse, websitePage] = await Promise.all([
        fetch(
          isAdmin
            ? `${API_BASE}/api/promotional-pages/admin/all`
            : `${API_BASE}/api/promotional-pages`,
          isAdmin ? { headers: { Authorization: `Bearer ${token}` } } : {},
        ),
        fetchWebsiteTemplate(),
      ]);

      if (!pagesResponse.ok) {
        throw new Error("Failed to fetch promotional pages");
      }

      const data = await pagesResponse.json();
      const pages = data.pages || [];
      setItems(pages);
      setWebsiteTemplate(websitePage || DEFAULT_PROMOTION_PAGE);
    } catch (error) {
      console.error("Error fetching promotional pages:", error);
      setItems([]);
      setWebsiteTemplate(DEFAULT_PROMOTION_PAGE);
    } finally {
      setLoading(false);
    }
  }, [fetchWebsiteTemplate, isAdmin, token]);

  useEffect(() => {
    if (token) fetchPages();
  }, [token, isAdmin, isModerator, fetchPages]);

  const filteredItems = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return items;
    return items.filter((item) => {
      return (
        (item.slug || "").toLowerCase().includes(query) ||
        (item.title || "").toLowerCase().includes(query)
      );
    });
  }, [items, searchQuery]);

  const handleSectionChange = (sectionKey, updater) => {
    setFormData((prev) => ({
      ...prev,
      sections: prev.sections.map((section) =>
        section.key === sectionKey ? updater(section) : section,
      ),
    }));
  };

  const updateSectionConfig = (sectionKey, nextConfig) => {
    handleSectionChange(sectionKey, (current) => ({
      ...current,
      config: nextConfig,
    }));
  };

  const toggleSectionCollapse = (sectionKey) => {
    setCollapsedSections((prev) => ({
      ...prev,
      [sectionKey]: !prev[sectionKey],
    }));
  };

  const savePage = async ({ closeAfterSave = false, sectionKey = "" } = {}) => {
    setFormError("");
    setSavingSectionKey(sectionKey);

    let normalizedSections;
    try {
      normalizedSections = formData.sections.map((section, index) => ({
        key: section.key,
        enabled: section.enabled,
        order: Number(section.order ?? index),
        config: cloneData(section.config || {}),
      }));
    } catch (error) {
      setFormError("Section config must be valid JSON-compatible data.");
      setSavingSectionKey("");
      return;
    }

    const payload = {
      slug: formData.slug,
      title: formData.title,
      description: formData.description,
      metaTitle: formData.metaTitle,
      metaDescription: formData.metaDescription,
      isActive: formData.isActive,
      sections: normalizedSections,
      footer: cloneData(formData.footer || {}),
    };

    const url = editing
      ? `${API_BASE}/api/promotional-pages/${editing._id}`
      : `${API_BASE}/api/promotional-pages`;
    const method = editing ? "PUT" : "POST";

    try {
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result?.message || "Failed to save page");
      }

      await fetchPages();

      const savedPage = result.page || payload;
      const nextTemplate =
        String(savedPage.slug || "").toLowerCase() === "website"
          ? savedPage
          : websiteTemplate;

      if (closeAfterSave) {
        setShowForm(false);
        setEditing(null);
        setFormData(createDefaultFormData(nextTemplate));
      } else {
        setEditing(savedPage);
        setFormData(mergePageWithTemplate(websiteTemplate, savedPage));
        setShowForm(true);
      }
    } catch (error) {
      setFormError(error.message || "Failed to save page");
    } finally {
      setSavingSectionKey("");
    }
  };

  const handleFooterLogoUpload = async (file) => {
    if (!file || !token) return;

    setUploadingFooterLogo(true);

    try {
      const formData = new FormData();
      formData.append("image", file);

      const response = await fetch(`${API_BASE}/api/upload/image/promotions`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await response.json();

      if (!response.ok || !data?.success || !data?.url) {
        throw new Error(data?.error || "Upload failed");
      }

      setFormData((prev) => ({
        ...prev,
        footer: {
          ...(prev.footer || {}),
          logoImage: data.url,
        },
      }));
    } catch (error) {
      console.error("Footer logo upload failed:", error);
      alert(error?.message || "Footer logo upload failed");
    } finally {
      setUploadingFooterLogo(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await savePage({ closeAfterSave: true });
  };

  const handleEdit = (page) => {
    setEditing(page);
    setFormData(mergePageWithTemplate(websiteTemplate, page));
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this promotional page?")) return;

    try {
      const response = await fetch(`${API_BASE}/api/promotional-pages/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        setItems((prev) => prev.filter((item) => item._id !== id));
        await fetchPages();
      }
    } catch (error) {
      console.error("Error deleting promotional page:", error);
    }
  };

  if (!isAllowed) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <p className="text-slate-600">
            Access Denied. Admin or Moderator only.
          </p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-between items-center gap-4 flex-wrap"
        >
          <div>
            <h1 className="text-4xl font-bold text-slate-900 mb-2">
              Manage Promotion Pages
            </h1>
            <p className="text-slate-600">
              Add slugs like /promotions/seo or /promotions/erp and choose the
              sections for each page.
            </p>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            <div className="relative">
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search pages..."
                className="pl-10 pr-3 py-2 border rounded-lg"
              />
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            </div>
            <button
              onClick={() => {
                setEditing(null);
                resetForm(websiteTemplate);
                setShowForm(true);
              }}
              className="bg-linear-to-r from-[#00f0ff] to-[#0066ff] text-[#0a0a12] font-semibold px-4 py-2 rounded-lg flex items-center gap-2"
            >
              <Plus className="w-4 h-4" /> New Page
            </button>
          </div>
        </motion.div>

        {showForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-6"
          >
            <div>
              <h2 className="text-xl font-bold text-slate-900 mb-1">
                {editing ? "Edit Promotion Page" : "Create Promotion Page"}
              </h2>
              <p className="text-slate-600 text-sm">
                Start from the website template, then save each section on its
                own without losing the rest of the page.
              </p>
            </div>

            {formError && (
              <div className="rounded-lg border border-red-200 bg-red-50 text-red-700 px-4 py-3 text-sm">
                {formError}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <input
                  required
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  placeholder="Page Title"
                  className="w-full px-4 py-2 border rounded-lg"
                />
                <input
                  required
                  value={formData.slug}
                  onChange={(e) =>
                    setFormData({ ...formData, slug: e.target.value })
                  }
                  placeholder="Slug e.g. seo"
                  className="w-full px-4 py-2 border rounded-lg"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  value={formData.metaTitle}
                  onChange={(e) =>
                    setFormData({ ...formData, metaTitle: e.target.value })
                  }
                  placeholder="Meta Title"
                  className="w-full px-4 py-2 border rounded-lg"
                />
                <input
                  value={formData.metaDescription}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      metaDescription: e.target.value,
                    })
                  }
                  placeholder="Meta Description"
                  className="w-full px-4 py-2 border rounded-lg"
                />
              </div>

              <textarea
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="Page Description"
                className="w-full px-4 py-2 border rounded-lg min-h-24"
              />

              <label className="flex items-center gap-2 text-sm text-slate-700">
                <input
                  type="checkbox"
                  checked={formData.isActive}
                  onChange={(e) =>
                    setFormData({ ...formData, isActive: e.target.checked })
                  }
                />
                Active page
              </label>

              <div className="space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900">
                      Sections
                    </h3>
                    <p className="text-sm text-slate-600">
                      Save a single section when you only change one component.
                    </p>
                  </div>
                  <button
                    type="submit"
                    className="bg-linear-to-r from-[#00f0ff] to-[#0066ff] text-[#0a0a12] font-semibold px-5 py-2 rounded-lg"
                  >
                    {editing ? "Save Page" : "Create Page"}
                  </button>
                </div>

                <div className="space-y-4">
                  {formData.sections.map((section) => {
                    const isCollapsed = Boolean(collapsedSections[section.key]);

                    return (
                      <div
                        key={section.key}
                        className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-4"
                      >
                        <div className="flex flex-wrap items-start justify-between gap-4">
                          <div className="space-y-1">
                            <div className="flex flex-wrap items-center gap-2">
                              <div className="text-base font-semibold text-slate-900">
                                {PROMOTION_SECTION_LABELS[section.key] ||
                                  section.key}
                              </div>
                              <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-500">
                                {section.key}
                              </span>
                            </div>
                            <p className="text-sm text-slate-500">
                              Toggle visibility, adjust order, then save just
                              this component.
                            </p>
                          </div>
                          <div className="flex flex-wrap items-center gap-2">
                            <button
                              type="button"
                              onClick={() => toggleSectionCollapse(section.key)}
                              className="rounded-full border border-cyan-200 bg-slate-50 px-4 py-2 text-sm font-semibold text-slate-700"
                            >
                              {isCollapsed ? "Expand" : "Collapse"}
                            </button>
                            <label className="flex items-center gap-2 rounded-full border border-red-200 bg-slate-50 px-3 py-2 text-sm text-slate-700">
                              <input
                                type="checkbox"
                                checked={section.enabled}
                                onChange={(e) => {
                                  handleSectionChange(
                                    section.key,
                                    (current) => ({
                                      ...current,
                                      enabled: e.target.checked,
                                    }),
                                  );
                                }}
                              />
                              Enabled
                            </label>
                            <button
                              type="button"
                              onClick={() =>
                                savePage({
                                  closeAfterSave: false,
                                  sectionKey: section.key,
                                })
                              }
                              disabled={Boolean(savingSectionKey)}
                              className="rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
                            >
                              {savingSectionKey === section.key
                                ? "Saving..."
                                : "Save Section"}
                            </button>
                          </div>
                        </div>

                        {!isCollapsed && (
                          <>
                            <div className="grid grid-cols-1 md:grid-cols-[160px_1fr] gap-4 items-start">
                              <label className="space-y-1">
                                <span className="text-xs font-medium text-slate-500">
                                  Order
                                </span>
                                <input
                                  type="number"
                                  value={section.order}
                                  onChange={(e) => {
                                    handleSectionChange(
                                      section.key,
                                      (current) => ({
                                        ...current,
                                        order: e.target.value,
                                      }),
                                    );
                                  }}
                                  placeholder="Order"
                                  className="w-full px-4 py-2 border rounded-lg"
                                />
                              </label>
                              <div className="rounded-xl   px-4 py-3 text-sm text-slate-600">
                                Lower numbers appear earlier in the public page.
                              </div>
                            </div>

                            <PromotionSectionEditor
                              section={section}
                              onChange={(nextConfig) =>
                                updateSectionConfig(section.key, nextConfig)
                              }
                            />
                          </>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="rounded-xl border border-slate-200 p-4 space-y-4">
                <div>
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <h3 className="text-lg font-semibold text-slate-900">
                        Footer
                      </h3>
                      <p className="text-sm text-slate-600">
                        Edit the footer headline, description, logo, and
                        copyright for this route.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() =>
                        savePage({
                          closeAfterSave: false,
                          sectionKey: "footer",
                        })
                      }
                      disabled={Boolean(savingSectionKey)}
                      className="rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
                    >
                      {savingSectionKey === "footer"
                        ? "Saving..."
                        : "Save Footer"}
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    value={formData.footer?.headline || ""}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        footer: {
                          ...(prev.footer || {}),
                          headline: e.target.value,
                        },
                      }))
                    }
                    placeholder="Footer headline"
                    className="w-full px-4 py-2 border rounded-lg"
                  />
                  <input
                    value={formData.footer?.logoImage || ""}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        footer: {
                          ...(prev.footer || {}),
                          logoImage: e.target.value,
                        },
                      }))
                    }
                    placeholder="Paste a footer logo URL"
                    className="w-full px-4 py-2 border rounded-lg"
                  />
                  <div className="md:col-span-2 flex flex-wrap items-center gap-2">
                    <label className="inline-flex cursor-pointer items-center rounded-lg border border-slate-300 bg-slate-50 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100">
                      {uploadingFooterLogo
                        ? "Uploading..."
                        : "Upload footer logo"}
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (!file) return;

                          try {
                            await handleFooterLogoUpload(file);
                          } finally {
                            e.target.value = "";
                          }
                        }}
                      />
                    </label>
                    <span className="text-xs text-slate-500">
                      Paste a URL or upload directly to Cloudinary.
                    </span>
                  </div>
                  <textarea
                    value={formData.footer?.description || ""}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        footer: {
                          ...(prev.footer || {}),
                          description: e.target.value,
                        },
                      }))
                    }
                    placeholder="Footer description"
                    className="w-full px-4 py-2 border rounded-lg min-h-24 md:col-span-2"
                  />
                  <input
                    value={formData.footer?.copyrightText || ""}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        footer: {
                          ...(prev.footer || {}),
                          copyrightText: e.target.value,
                        },
                      }))
                    }
                    placeholder="Copyright text"
                    className="w-full px-4 py-2 border rounded-lg md:col-span-2"
                  />
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setEditing(null);
                    resetForm(websiteTemplate);
                    setShowForm(false);
                  }}
                  className="px-5 py-2 rounded-lg border border-slate-300 text-slate-700"
                >
                  Cancel
                </button>
              </div>
            </form>
          </motion.div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {loading ? (
            <div className="text-slate-500">Loading...</div>
          ) : filteredItems.length ? (
            filteredItems.map((page) => (
              <motion.div
                key={page._id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm"
              >
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-slate-900">
                      {page.title}
                    </h3>
                    <p className="text-slate-600">/promotions/{page.slug}</p>
                  </div>
                  <span
                    className={`text-xs px-2 py-1 rounded-full ${page.isActive ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-500"}`}
                  >
                    {page.isActive ? "Active" : "Inactive"}
                  </span>
                </div>

                <p className="text-slate-600 text-sm mb-4">
                  {page.description ||
                    page.metaDescription ||
                    "No description provided."}
                </p>

                <div className="flex flex-wrap gap-2 mb-4">
                  {(page.sections || []).map((section) => (
                    <span
                      key={section.key}
                      className={`text-xs px-2 py-1 rounded-full ${section.enabled ? "bg-cyan-100 text-cyan-700" : "bg-slate-100 text-slate-500"}`}
                    >
                      {PROMOTION_SECTION_LABELS[section.key] || section.key}
                    </span>
                  ))}
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => handleEdit(page)}
                    className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-100 text-slate-700"
                  >
                    <Edit2 className="w-4 h-4" /> Edit
                  </button>
                  <button
                    onClick={() => handleDelete(page._id)}
                    className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-red-50 text-red-600"
                  >
                    <Trash2 className="w-4 h-4" /> Delete
                  </button>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="text-slate-500">No pages found.</div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
