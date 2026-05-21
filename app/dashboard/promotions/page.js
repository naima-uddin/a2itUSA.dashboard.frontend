"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { motion } from "framer-motion";
import { Plus, Search, Trash2, Edit2 } from "lucide-react";
import DashboardLayout from "../components/DashboardLayout";
import {
  DEFAULT_PROMOTION_PAGE,
  PROMOTION_SECTION_KEYS,
  PROMOTION_SECTION_LABELS,
} from "@/components/promotion/promotionPageConfig";

const API_BASE = process.env.NEXT_PUBLIC_API_URL;

const defaultSectionState = DEFAULT_PROMOTION_PAGE.sections.map((section) => ({
  key: section.key,
  enabled: section.enabled,
  order: section.order,
  config: section.config,
}));

const defaultFormData = {
  slug: "",
  title: "",
  description: "",
  metaTitle: "",
  metaDescription: "",
  isActive: true,
  sections: defaultSectionState,
};

export default function PromotionalPagesDashboard() {
  const { token, isAdmin, isModerator } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [formData, setFormData] = useState(defaultFormData);
  const [formError, setFormError] = useState("");

  const isAllowed = isAdmin || isModerator;

  const resetForm = () => {
    setFormData(defaultFormData);
    setFormError("");
  };

  const fetchPages = async () => {
    try {
      setLoading(true);
      const url = isAdmin
        ? `${API_BASE}/api/promotional-pages/admin/all`
        : `${API_BASE}/api/promotional-pages`;
      const opts = isAdmin
        ? { headers: { Authorization: `Bearer ${token}` } }
        : {};

      const response = await fetch(url, opts);
      if (!response.ok) {
        throw new Error("Failed to fetch promotional pages");
      }

      const data = await response.json();
      setItems(data.pages || []);
    } catch (error) {
      console.error("Error fetching promotional pages:", error);
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) fetchPages();
  }, [token, isAdmin, isModerator]);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");

    let normalizedSections;
    try {
      normalizedSections = formData.sections.map((section, index) => ({
        key: section.key,
        enabled: section.enabled,
        order: Number(section.order ?? index),
        config: JSON.parse(JSON.stringify(section.config || {})),
      }));
    } catch (error) {
      setFormError("Section config must be valid JSON-compatible data.");
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
      setShowForm(false);
      setEditing(null);
      resetForm();
    } catch (error) {
      setFormError(error.message || "Failed to save page");
    }
  };

  const handleEdit = (page) => {
    setEditing(page);
    setFormData({
      slug: page.slug || "",
      title: page.title || "",
      description: page.description || "",
      metaTitle: page.metaTitle || "",
      metaDescription: page.metaDescription || "",
      isActive: page.isActive !== false,
      sections: PROMOTION_SECTION_KEYS.map((key, index) => {
        const match = (page.sections || []).find(
          (section) => section.key === key,
        );
        return {
          key,
          enabled: match ? match.enabled !== false : true,
          order:
            match && Number.isFinite(Number(match.order))
              ? Number(match.order)
              : index,
          config: match?.config || {},
        };
      }),
    });
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
                resetForm();
                setShowForm(!showForm);
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
            className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-6"
          >
            <div>
              <h2 className="text-xl font-bold text-slate-900 mb-1">
                {editing ? "Edit Promotion Page" : "Create Promotion Page"}
              </h2>
              <p className="text-slate-600 text-sm">
                Every section can be toggled per slug. Component content is
                stored as JSON config.
              </p>
            </div>

            {formError && (
              <div className="rounded-lg border border-red-200 bg-red-50 text-red-700 px-4 py-3 text-sm">
                {formError}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                <h3 className="text-lg font-semibold text-slate-900">
                  Sections
                </h3>

                <div className="space-y-4">
                  {formData.sections.map((section) => (
                    <div
                      key={section.key}
                      className="rounded-xl border border-slate-200 p-4 space-y-3"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <div>
                          <div className="font-semibold text-slate-900">
                            {PROMOTION_SECTION_LABELS[section.key] ||
                              section.key}
                          </div>
                          <div className="text-xs text-slate-500">
                            {section.key}
                          </div>
                        </div>
                        <label className="flex items-center gap-2 text-sm text-slate-700">
                          <input
                            type="checkbox"
                            checked={section.enabled}
                            onChange={(e) => {
                              handleSectionChange(section.key, (current) => ({
                                ...current,
                                enabled: e.target.checked,
                              }));
                            }}
                          />
                          Enabled
                        </label>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input
                          type="number"
                          value={section.order}
                          onChange={(e) => {
                            handleSectionChange(section.key, (current) => ({
                              ...current,
                              order: e.target.value,
                            }));
                          }}
                          placeholder="Order"
                          className="w-full px-4 py-2 border rounded-lg"
                        />
                        <div className="text-xs text-slate-500 flex items-center">
                          Order controls the display position on the page.
                        </div>
                      </div>

                      <textarea
                        value={JSON.stringify(section.config || {}, null, 2)}
                        onChange={(e) => {
                          try {
                            const parsed = JSON.parse(e.target.value || "{}");
                            handleSectionChange(section.key, (current) => ({
                              ...current,
                              config: parsed,
                            }));
                          } catch (error) {
                            handleSectionChange(section.key, (current) => ({
                              ...current,
                              config: current.config,
                            }));
                          }
                        }}
                        className="w-full px-4 py-3 border rounded-lg min-h-32 font-mono text-sm"
                        placeholder="Section config JSON"
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="submit"
                  className="bg-linear-to-r from-[#00f0ff] to-[#0066ff] text-[#0a0a12] font-semibold px-5 py-2 rounded-lg"
                >
                  {editing ? "Update Page" : "Create Page"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setEditing(null);
                    resetForm();
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
