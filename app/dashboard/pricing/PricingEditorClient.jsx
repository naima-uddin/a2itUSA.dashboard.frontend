"use client";

import { useEffect, useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import DashboardLayout from "../components/DashboardLayout";
import { useAuth } from "@/context/AuthContext";
import {
  createDefaultPricingPageContent,
  normalizePricingPageContent,
} from "@/components/pricing-page-compoents/pricingPageData";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

const createId = (prefix) =>
  `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

const createPackageItem = () => ({
  id: createId("package"),
  name: "Special",
  price: "$0.00",
  color: "blue",
  features: [""],
});

const createServiceItem = () => ({
  id: createId("service"),
  category: "New Service",
  packages: [createPackageItem()],
});

const Input = (props) => (
  <input
    {...props}
    className={`w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-cyan-400 ${props.className || ""}`}
  />
);

const Textarea = (props) => (
  <textarea
    {...props}
    className={`w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-cyan-400 ${props.className || ""}`}
  />
);

const Select = (props) => (
  <select
    {...props}
    className={`w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-cyan-400 ${props.className || ""}`}
  />
);

const Field = ({ label, description, children }) => (
  <label className="block space-y-1">
    <span className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
      {label}
    </span>
    {description ? (
      <p className="text-xs text-slate-400">{description}</p>
    ) : null}
    {children}
  </label>
);

const Panel = ({ title, description, children, action }) => (
  <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
    <div className="mb-4 flex items-start justify-between gap-4">
      <div>
        <h2 className="text-xl font-bold text-slate-900">{title}</h2>
        {description ? (
          <p className="text-sm text-slate-500">{description}</p>
        ) : null}
      </div>
      {action}
    </div>
    {children}
  </section>
);

function PackageEditor({ pkg, onChange, onRemove, index }) {
  const update = (key, value) => onChange({ ...pkg, [key]: value });

  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
      <div className="mb-4 flex items-center justify-between gap-3">
        <h4 className="font-semibold text-slate-900">Package {index + 1}</h4>
        <button
          type="button"
          onClick={onRemove}
          className="inline-flex items-center gap-2 rounded-xl border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-600 transition hover:bg-red-50 hover:text-red-600"
        >
          <Trash2 className="h-4 w-4" />
          Remove
        </button>
      </div>

      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        <Field label="Package name" description="Special, Gold, Platinum, etc.">
          <Input
            value={pkg.name || ""}
            onChange={(event) => update("name", event.target.value)}
            placeholder="Special"
          />
        </Field>
        <Field label="Price">
          <Input
            value={pkg.price || ""}
            onChange={(event) => update("price", event.target.value)}
            placeholder="$299.00"
          />
        </Field>
        <Field label="Color">
          <Select
            value={pkg.color || "blue"}
            onChange={(event) => update("color", event.target.value)}
          >
            {["blue", "black", "teal", "orange", "red", "purple", "indigo"].map(
              (color) => (
                <option key={color} value={color}>
                  {color}
                </option>
              ),
            )}
          </Select>
        </Field>
      </div>

      <div className="mt-3 grid gap-3 md:grid-cols-2">
        <Field label="Package ID" description="Optional internal identifier.">
          <Input
            value={pkg.id || ""}
            onChange={(event) => update("id", event.target.value)}
            placeholder="design-special"
          />
        </Field>
        <Field label="Features" description="One feature per line.">
          <Textarea
            value={Array.isArray(pkg.features) ? pkg.features.join("\n") : ""}
            onChange={(event) =>
              update(
                "features",
                String(event.target.value || "")
                  .split("\n")
                  .map((line) => line.trim())
                  .filter(Boolean),
              )
            }
            rows={5}
            placeholder="Custom Website Design\nResponsive Layout\n5 Page Website"
          />
        </Field>
      </div>
    </div>
  );
}

function ServiceEditor({ service, index, onChange, onRemove }) {
  const packages = Array.isArray(service.packages) ? service.packages : [];

  const updateService = (key, value) => onChange({ ...service, [key]: value });

  const addPackage = () =>
    updateService("packages", [...packages, createPackageItem()]);

  const updatePackage = (packageIndex, nextPackage) => {
    const nextPackages = packages.map((item, itemIndex) =>
      itemIndex === packageIndex ? nextPackage : item,
    );
    updateService("packages", nextPackages);
  };

  const removePackage = (packageIndex) => {
    updateService(
      "packages",
      packages.filter((_, itemIndex) => itemIndex !== packageIndex),
    );
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <h3 className="text-lg font-bold text-slate-900">
            Service {index + 1}
          </h3>
          <p className="text-xs text-slate-500">
            This becomes a tab on the public pricing page.
          </p>
        </div>
        <button
          type="button"
          onClick={onRemove}
          className="inline-flex items-center gap-2 rounded-xl border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-600 transition hover:bg-red-50 hover:text-red-600"
        >
          <Trash2 className="h-4 w-4" />
          Remove service
        </button>
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        <Field label="Service category">
          <Input
            value={service.category || ""}
            onChange={(event) => updateService("category", event.target.value)}
            placeholder="Design & Development"
          />
        </Field>
        <Field label="Service ID" description="Optional internal identifier.">
          <Input
            value={service.id || ""}
            onChange={(event) => updateService("id", event.target.value)}
            placeholder="design-development"
          />
        </Field>
      </div>

      <div className="mt-4 space-y-4">
        {packages.map((pkg, packageIndex) => (
          <PackageEditor
            key={pkg.id || `${service.category || "service"}-${packageIndex}`}
            index={packageIndex}
            pkg={pkg}
            onChange={(nextPackage) => updatePackage(packageIndex, nextPackage)}
            onRemove={() => removePackage(packageIndex)}
          />
        ))}

        <button
          type="button"
          onClick={addPackage}
          className="inline-flex items-center gap-2 rounded-xl border border-dashed border-cyan-300 px-3 py-2 text-sm font-semibold text-cyan-700 transition hover:bg-cyan-50"
        >
          <Plus className="h-4 w-4" />
          Add package
        </button>
      </div>
    </div>
  );
}

export default function PricingEditorClient() {
  const { token } = useAuth();
  const [draftContent, setDraftContent] = useState(
    createDefaultPricingPageContent(),
  );
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState({ type: "info", text: "" });

  useEffect(() => {
    let mounted = true;

    fetch(`${API_BASE}/api/pricing-page`)
      .then((response) => response.json())
      .then((data) => {
        if (!mounted) return;

        const normalized = normalizePricingPageContent(
          data?.page?.content || data?.content || {},
        );

        setDraftContent(normalized);
        setStatus({ type: "success" });
      })
      .catch((error) => {
        console.error("Error loading pricing page settings:", error);
        if (mounted) {
          setStatus({
            type: "error",
            text: "Using defaults because saved pricing data could not be loaded.",
          });
        }
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  const services = Array.isArray(draftContent.services)
    ? draftContent.services
    : [];

  const addService = () => {
    setDraftContent((prev) => ({
      ...prev,
      services: [...(prev.services || []), createServiceItem()],
    }));
  };

  const updateService = (index, nextService) => {
    setDraftContent((prev) => ({
      ...prev,
      services: prev.services.map((item, itemIndex) =>
        itemIndex === index ? nextService : item,
      ),
    }));
  };

  const removeService = (index) => {
    setDraftContent((prev) => ({
      ...prev,
      services: prev.services.filter((_, itemIndex) => itemIndex !== index),
    }));
  };

  const handleReset = () => {
    const defaults = createDefaultPricingPageContent();
    setDraftContent((prev) => ({
      ...prev,
      services: defaults.services,
    }));
    setStatus({
      type: "info",
      text: "Reset services and packages to defaults.",
    });
  };

  const handleSave = async () => {
    try {
      setSaving(true);

      const normalized = normalizePricingPageContent(draftContent);
      const response = await fetch(`${API_BASE}/api/pricing-page`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ content: normalized }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.message || "Failed to save pricing page");
      }

      const saved = normalizePricingPageContent(
        data?.page?.content || normalized,
      );
      setDraftContent(saved);
      setStatus({
        type: "success",
        text: "Services and packages saved successfully.",
      });
    } catch (error) {
      setStatus({
        type: "error",
        text: error.message || "Failed to save services and packages.",
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-600">
                Dashboard / Pricing
              </p>
              <h1 className="text-3xl font-bold text-slate-900">
                Pricing packages editor
              </h1>
              <p className="max-w-2xl text-sm text-slate-600">
                Add and edit pricing services and packages here. The form
                matches the public pricing JSON structure.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                onClick={handleReset}
                className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                Reset defaults
              </button>
              <button
                onClick={handleSave}
                disabled={saving || loading}
                className="rounded-xl bg-linear-to-r from-cyan-500 to-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60"
              >
                {saving ? "Saving..." : "Save pricing data"}
              </button>
            </div>
          </div>

          {status.text && (
            <div
              className={`mt-4 rounded-xl border px-4 py-3 text-sm ${
                status.type === "error"
                  ? "border-red-200 bg-red-50 text-red-700"
                  : status.type === "success"
                    ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                    : "border-slate-200 bg-slate-50 text-slate-700"
              }`}
            >
              {status.text}
            </div>
          )}
        </div>

        <Panel
          title="Services and packages"
          description="This section controls the pricing tabs and package cards on the public page."
          action={
            <button
              type="button"
              onClick={addService}
              className="inline-flex items-center gap-2 rounded-xl border border-dashed border-cyan-300 px-3 py-2 text-sm font-semibold text-cyan-700 transition hover:bg-cyan-50"
            >
              <Plus className="h-4 w-4" />
              Add service
            </button>
          }
        >
          <div className="space-y-4">
            {services.map((service, index) => (
              <ServiceEditor
                key={service.id || `${service.category || "service"}-${index}`}
                index={index}
                service={service}
                onChange={(nextService) => updateService(index, nextService)}
                onRemove={() => removeService(index)}
              />
            ))}
          </div>
        </Panel>
      </div>
    </DashboardLayout>
  );
}
