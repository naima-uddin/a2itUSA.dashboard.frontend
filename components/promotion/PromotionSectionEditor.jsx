"use client";

import React, { useState } from "react";
import { authFetch } from "@/lib/api/authFetch";
import Gallery from "./Home/Gallery";
import CloudinaryImageField from "@/components/shared/CloudinaryImageField";

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL ||
  "https://a2it-usa-dashboard-backend.vercel.app";

const splitLines = (value) =>
  String(value || "")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

const joinLines = (value) => (Array.isArray(value) ? value.join("\n") : "");

const buildItem = (fields = []) =>
  fields.reduce((accumulator, field) => {
    if (field.default !== undefined) {
      accumulator[field.key] = field.default;
      return accumulator;
    }

    if (field.type === "number") {
      accumulator[field.key] = "";
    } else if (field.type === "checkbox") {
      accumulator[field.key] = true;
    } else if (field.type === "list") {
      accumulator[field.key] = [];
    } else {
      accumulator[field.key] = "";
    }

    return accumulator;
  }, {});

const uploadImageToCloudinary = async (file) => {
  const formData = new FormData();
  formData.append("image", file);

  const response = await authFetch(`${API_BASE}/api/upload/image/promotions`, {
    method: "POST",
    body: formData,
  });

  const data = await response.json();

  if (!response.ok || !data?.success || !data?.url) {
    throw new Error(data?.error || "Upload failed");
  }

  return data.url;
};

const getInputPlaceholder = (label) =>
  `Enter ${String(label || "value").toLowerCase()}`;

const ImageListField = ({
  label,
  value,
  onChange,
  placeholder,
  uploadKey,
  uploading,
  onUploadImage,
}) => {
  const items = Array.isArray(value) ? value : [];

  return (
    <div className="space-y-1 block md:col-span-2">
      <span className="text-xs font-medium text-slate-500">{label}</span>
      <textarea
        value={joinLines(items)}
        onChange={(e) => onChange(splitLines(e.target.value))}
        className="w-full rounded-lg border border-slate-300 px-3 py-2 min-h-28"
        placeholder={placeholder || "Paste one image URL per line"}
      />
      <div className="flex flex-wrap items-center gap-2">
        <label className="inline-flex cursor-pointer items-center rounded-lg border border-slate-300 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100">
          {uploading ? "Uploading..." : "Upload image files"}
          <input
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={async (e) => {
              const files = Array.from(e.target.files || []);
              if (!files.length) return;

              try {
                const uploadedUrls = [];
                for (const file of files) {
                  const imageUrl = await onUploadImage(uploadKey, file);
                  uploadedUrls.push(imageUrl);
                }
                onChange([...items, ...uploadedUrls]);
              } finally {
                e.target.value = "";
              }
            }}
          />
        </label>
        <span className="text-[11px] text-slate-500">
          You can paste URLs above or upload files here.
        </span>
      </div>
    </div>
  );
};

const RepeatableEditor = ({
  title,
  items = [],
  fields = [],
  onChange,
  onUploadImage,
  uploadingKeys = {},
}) => {
  const safeItems = Array.isArray(items) ? items : [];

  const updateItem = (index, key, value) => {
    const nextItems = safeItems.map((item, itemIndex) =>
      itemIndex === index ? { ...item, [key]: value } : item,
    );
    onChange(nextItems);
  };

  const addItem = () => {
    onChange([...safeItems, buildItem(fields)]);
  };

  const removeItem = (index) => {
    onChange(safeItems.filter((_, itemIndex) => itemIndex !== index));
  };

  return (
    <div className="space-y-3 rounded-xl border border-slate-200 bg-slate-50 p-4">
      <div className="flex items-center justify-between gap-3">
        <h4 className="font-semibold text-slate-900">{title}</h4>
        <button
          type="button"
          onClick={addItem}
          className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm text-slate-700"
        >
          Add item
        </button>
      </div>

      <div className="space-y-3">
        {safeItems.map((item, index) => (
          <div
            key={`${title}-${index}`}
            className="rounded-lg border border-slate-200 bg-white p-4 space-y-3"
          >
            <div className="flex items-center justify-between gap-3">
              <div className="text-sm font-medium text-slate-700">
                Item {index + 1}
              </div>
              <button
                type="button"
                onClick={() => removeItem(index)}
                className="rounded-lg border border-red-200 bg-red-50 px-3 py-1.5 text-sm text-red-600"
              >
                Remove
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {fields.map((field) => {
                const value = item?.[field.key];
                const uploadKey = `${title}-${index}-${field.key}`;

                if (field.type === "textarea") {
                  return (
                    <div key={field.key} className="space-y-1 md:col-span-2">
                      <span className="text-xs font-medium text-slate-500">
                        {field.label}
                      </span>
                      <textarea
                        value={value || ""}
                        onChange={(e) =>
                          updateItem(index, field.key, e.target.value)
                        }
                        className="w-full rounded-lg border border-slate-300 px-3 py-2 min-h-24"
                        placeholder={
                          field.placeholder || getInputPlaceholder(field.label)
                        }
                      />
                    </div>
                  );
                }

                if (field.type === "image") {
                  return (
                    <CloudinaryImageField
                      key={field.key}
                      label={field.label}
                      value={value || ""}
                      onChange={(nextValue) =>
                        updateItem(index, field.key, nextValue)
                      }
                      placeholder={field.placeholder}
                      uploadKey={uploadKey}
                      uploading={Boolean(uploadingKeys[uploadKey])}
                      onUploadImage={onUploadImage}
                      className="space-y-1 md:col-span-2"
                    />
                  );
                }

                if (field.type === "list") {
                  return (
                    <label key={field.key} className="space-y-1 md:col-span-2">
                      <span className="text-xs font-medium text-slate-500">
                        {field.label}
                      </span>
                      <textarea
                        value={joinLines(value)}
                        onChange={(e) =>
                          updateItem(
                            index,
                            field.key,
                            splitLines(e.target.value),
                          )
                        }
                        className="w-full rounded-lg border border-slate-300 px-3 py-2 min-h-24"
                        placeholder={field.placeholder || "One item per line"}
                      />
                    </label>
                  );
                }

                if (field.type === "checkbox") {
                  return (
                    <label
                      key={field.key}
                      className="flex items-center gap-2 pt-6 text-sm text-slate-700"
                    >
                      <input
                        type="checkbox"
                        checked={Boolean(value)}
                        onChange={(e) =>
                          updateItem(index, field.key, e.target.checked)
                        }
                      />
                      {field.label}
                    </label>
                  );
                }

                if (field.type === "select") {
                  return (
                    <label key={field.key} className="space-y-1">
                      <span className="text-xs font-medium text-slate-500">
                        {field.label}
                      </span>
                      <select
                        value={value || ""}
                        onChange={(e) =>
                          updateItem(index, field.key, e.target.value)
                        }
                        className="w-full rounded-lg border border-slate-300 px-3 py-2 bg-white"
                      >
                        {(field.options || []).map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </label>
                  );
                }

                return (
                  <label key={field.key} className="space-y-1">
                    <span className="text-xs font-medium text-slate-500">
                      {field.label}
                    </span>
                    <input
                      type={field.type === "number" ? "number" : "text"}
                      value={value ?? ""}
                      onChange={(e) =>
                        updateItem(index, field.key, e.target.value)
                      }
                      className="w-full rounded-lg border border-slate-300 px-3 py-2"
                      placeholder={
                        field.placeholder || getInputPlaceholder(field.label)
                      }
                    />
                  </label>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <p className="text-xs text-slate-500"></p>
    </div>
  );
};

export default function PromotionSectionEditor({ section, onChange }) {
  const [uploadingKeys, setUploadingKeys] = useState({});
  const config = section.config || {};

  const updateConfig = (patch) => {
    onChange({ ...config, ...patch });
  };

  const uploadImage = async (uploadKey, file) => {
    setUploadingKeys((current) => ({
      ...current,
      [uploadKey]: (current[uploadKey] || 0) + 1,
    }));

    try {
      return await uploadImageToCloudinary(file);
    } finally {
      setUploadingKeys((current) => {
        const nextCount = (current[uploadKey] || 1) - 1;
        const nextState = { ...current };

        if (nextCount > 0) {
          nextState[uploadKey] = nextCount;
        } else {
          delete nextState[uploadKey];
        }

        return nextState;
      });
    }
  };

  if (section.key === "banner") {
    return (
      <div className="space-y-4 rounded-xl border border-slate-200 bg-white p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <label className="space-y-1">
            <span className="text-xs font-medium text-slate-500">Heading</span>
            <input
              value={config.heading || ""}
              onChange={(e) => updateConfig({ heading: e.target.value })}
              className="w-full rounded-lg border border-slate-300 px-3 py-2"
              placeholder="Enter heading"
            />
          </label>
          <label className="space-y-1">
            <span className="text-xs font-medium text-slate-500">
              Subheading
            </span>
            <input
              value={config.subheading || ""}
              onChange={(e) => updateConfig({ subheading: e.target.value })}
              className="w-full rounded-lg border border-slate-300 px-3 py-2"
              placeholder="Enter subheading"
            />
          </label>
          <label className="space-y-1">
            <span className="text-xs font-medium text-slate-500">
              Intro text
            </span>
            <input
              value={config.introText || ""}
              onChange={(e) => updateConfig({ introText: e.target.value })}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 md:col-span-2"
              placeholder="Enter intro text"
            />
          </label>
          <label className="space-y-1">
            <span className="text-xs font-medium text-slate-500">
              Start price
            </span>
            <input
              value={config.startPrice || ""}
              onChange={(e) => updateConfig({ startPrice: e.target.value })}
              className="w-full rounded-lg border border-slate-300 px-3 py-2"
              placeholder="Enter start price"
            />
          </label>
          <label className="space-y-1">
            <span className="text-xs font-medium text-slate-500">
              Button label
            </span>
            <input
              value={config.primaryLabel || ""}
              onChange={(e) => updateConfig({ primaryLabel: e.target.value })}
              className="w-full rounded-lg border border-slate-300 px-3 py-2"
              placeholder="Enter button label"
            />
          </label>
          <label className="space-y-1">
            <span className="text-xs font-medium text-slate-500">
              Secondary label
            </span>
            <input
              value={config.secondaryLabel || ""}
              onChange={(e) => updateConfig({ secondaryLabel: e.target.value })}
              className="w-full rounded-lg border border-slate-300 px-3 py-2"
              placeholder="Enter secondary label"
            />
          </label>
          <label className="space-y-1">
            <span className="text-xs font-medium text-slate-500">
              Modal button text
            </span>
            <input
              value={config.modalButtonText || ""}
              onChange={(e) =>
                updateConfig({ modalButtonText: e.target.value })
              }
              className="w-full rounded-lg border border-slate-300 px-3 py-2"
              placeholder="Enter modal button text"
            />
          </label>
          <CloudinaryImageField
            label="Background image"
            value={config.backgroundImage || ""}
            onChange={(backgroundImage) => updateConfig({ backgroundImage })}
            placeholder="Paste a background image URL"
            uploadKey="banner-backgroundImage"
            uploading={Boolean(uploadingKeys["banner-backgroundImage"])}
            onUploadImage={uploadImage}
            className="space-y-1 md:col-span-2"
          />
        </div>

        <label className="space-y-1 block">
          <span className="text-xs font-medium text-slate-500">Hero lines</span>
          <textarea
            value={joinLines(config.heroLines)}
            onChange={(e) =>
              updateConfig({ heroLines: splitLines(e.target.value) })
            }
            className="w-full rounded-lg border border-slate-300 px-3 py-2 min-h-28"
            placeholder="One line per row"
          />
        </label>
      </div>
    );
  }

  if (section.key === "slider") {
    return (
      <div className="space-y-4 rounded-xl border border-slate-200 bg-white p-4">
        <ImageListField
          label="Logo image URLs"
          value={config.images || []}
          onChange={(images) => updateConfig({ images })}
          placeholder="Paste one logo image URL per line"
          uploadKey="slider-images"
          uploading={Boolean(uploadingKeys["slider-images"])}
          onUploadImage={uploadImage}
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <label className="flex items-center gap-2 text-sm text-slate-700 pt-6">
            <input
              type="checkbox"
              checked={config.autoplay !== false}
              onChange={(e) => updateConfig({ autoplay: e.target.checked })}
            />
            Autoplay
          </label>
          <label className="space-y-1">
            <span className="text-xs font-medium text-slate-500">
              Interval (ms)
            </span>
            <input
              type="number"
              value={config.interval || ""}
              onChange={(e) => updateConfig({ interval: e.target.value })}
              className="w-full rounded-lg border border-slate-300 px-3 py-2"
              placeholder="Enter interval in milliseconds"
            />
          </label>
        </div>
      </div>
    );
  }

  if (section.key === "portfolio") {
    return (
      <div className="space-y-4 rounded-xl border border-slate-200 bg-white p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <label className="space-y-1">
            <span className="text-xs font-medium text-slate-500">Title</span>
            <input
              value={config.title || ""}
              onChange={(e) => updateConfig({ title: e.target.value })}
              className="w-full rounded-lg border border-slate-300 px-3 py-2"
              placeholder="Enter title"
            />
          </label>
          <label className="space-y-1">
            <span className="text-xs font-medium text-slate-500">
              Description
            </span>
            <input
              value={config.description || ""}
              onChange={(e) => updateConfig({ description: e.target.value })}
              className="w-full rounded-lg border border-slate-300 px-3 py-2"
              placeholder="Enter description"
            />
          </label>
        </div>

        <RepeatableEditor
          title="Portfolio projects"
          items={config.projects || []}
          onChange={(projects) => updateConfig({ projects })}
          fields={[
            {
              key: "title",
              label: "Title",
              placeholder: "Enter project title",
            },
            {
              key: "image",
              label: "Image URL",
              type: "image",
              placeholder: "Paste a project image URL or upload",
            },
            {
              key: "category",
              label: "Category",
              placeholder: "Enter category",
            },
            {
              key: "description",
              label: "Description",
              type: "textarea",
              placeholder: "Enter project description",
            },
          ]}
          onUploadImage={uploadImage}
          uploadingKeys={uploadingKeys}
        />
      </div>
    );
  }

  if (section.key === "gallery") {
    return (
      <div className="space-y-4 rounded-xl border border-slate-200 bg-white p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <label className="space-y-1">
            <span className="text-xs font-medium text-slate-500">Title</span>
            <input
              value={config.title || ""}
              onChange={(e) => updateConfig({ title: e.target.value })}
              className="w-full rounded-lg border border-slate-300 px-3 py-2"
              placeholder="Enter title"
            />
          </label>
          <label className="space-y-1">
            <span className="text-xs font-medium text-slate-500">
              Description
            </span>
            <input
              value={config.description || ""}
              onChange={(e) => updateConfig({ description: e.target.value })}
              className="w-full rounded-lg border border-slate-300 px-3 py-2"
              placeholder="Enter description"
            />
          </label>
        </div>
        <RepeatableEditor
          title="Gallery items"
          items={config.items || []}
          onChange={(items) => updateConfig({ items })}
          fields={[
            { key: "title", label: "Title", placeholder: "Enter item title" },
            {
              key: "image",
              label: "Image URL",
              type: "image",
              placeholder: "Paste a gallery image URL or upload",
            },
            {
              key: "description",
              label: "Description",
              type: "textarea",
              placeholder: "Enter item description",
            },
          ]}
          onUploadImage={uploadImage}
          uploadingKeys={uploadingKeys}
        />

        <div className="space-y-3 rounded-xl border border-slate-200 bg-slate-50 p-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h4 className="font-semibold text-slate-900">Live preview</h4>
              <p className="text-xs text-slate-500">
                Upload or edit images above. The layout below updates instantly.
              </p>
            </div>
            <span className="rounded-full bg-white px-3 py-1 text-xs font-medium text-slate-600 border border-slate-200">
              {(config.items || []).length} items
            </span>
          </div>

          <div className="rounded-lg border border-slate-200 bg-white overflow-hidden">
            <div className="max-h-220 overflow-auto">
              <Gallery
                config={{
                  title: config.title,
                  description: config.description,
                  items: config.items,
                }}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (section.key === "pricing") {
    return (
      <div className="space-y-4 rounded-xl border border-slate-200 bg-white p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <label className="space-y-1">
            <span className="text-xs font-medium text-slate-500">Heading</span>
            <input
              value={config.heading || ""}
              onChange={(e) => updateConfig({ heading: e.target.value })}
              className="w-full rounded-lg border border-slate-300 px-3 py-2"
              placeholder="Enter heading"
            />
          </label>
          <label className="space-y-1">
            <span className="text-xs font-medium text-slate-500">
              Highlight text
            </span>
            <input
              value={config.highlight || ""}
              onChange={(e) => updateConfig({ highlight: e.target.value })}
              className="w-full rounded-lg border border-slate-300 px-3 py-2"
              placeholder="Enter highlight text"
            />
          </label>
          <label className="space-y-1 md:col-span-2">
            <span className="text-xs font-medium text-slate-500">
              Description
            </span>
            <input
              value={config.description || ""}
              onChange={(e) => updateConfig({ description: e.target.value })}
              className="w-full rounded-lg border border-slate-300 px-3 py-2"
              placeholder="Enter pricing description"
            />
          </label>
        </div>

        <RepeatableEditor
          title="Pricing cards"
          items={config.packages || []}
          onChange={(packages) => updateConfig({ packages })}
          fields={[
            {
              key: "name",
              label: "Card title",
              placeholder: "Enter package title",
            },
            { key: "price", label: "Price", placeholder: "Enter price" },
            {
              key: "originalPrice",
              label: "Original price",
              placeholder: "Enter original price",
            },
            {
              key: "discount",
              label: "Discount text",
              placeholder: "Enter discount text",
            },
            {
              key: "color",
              label: "Color",
              type: "select",
              options: [
                { label: "Teal", value: "teal" },
                { label: "Orange", value: "orange" },
                { label: "Red", value: "red" },
                { label: "Blue", value: "blue" },
                { label: "Purple", value: "purple" },
                { label: "Indigo", value: "indigo" },
              ],
            },
            {
              key: "features",
              label: "Features",
              type: "list",
              placeholder: "One feature per line",
            },
          ]}
        />
      </div>
    );
  }

  if (section.key === "stats") {
    return (
      <div className="space-y-4 rounded-xl border border-slate-200 bg-white p-4">
        <label className="space-y-1 block">
          <span className="text-xs font-medium text-slate-500">Title</span>
          <input
            value={config.title || ""}
            onChange={(e) => updateConfig({ title: e.target.value })}
            className="w-full rounded-lg border border-slate-300 px-3 py-2"
            placeholder="Enter stats title"
          />
        </label>
        <RepeatableEditor
          title="Stats items"
          items={config.stats || []}
          onChange={(stats) => updateConfig({ stats })}
          fields={[
            {
              key: "end",
              label: "Number",
              type: "number",
              placeholder: "Enter number",
            },
            { key: "suffix", label: "Suffix", placeholder: "Enter suffix" },
            { key: "label", label: "Label", placeholder: "Enter label" },
          ]}
        />
      </div>
    );
  }

  if (section.key === "services") {
    return (
      <div className="space-y-4 rounded-xl border border-slate-200 bg-white p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <label className="space-y-1">
            <span className="text-xs font-medium text-slate-500">Kicker</span>
            <input
              value={config.kicker || ""}
              onChange={(e) => updateConfig({ kicker: e.target.value })}
              className="w-full rounded-lg border border-slate-300 px-3 py-2"
              placeholder="Enter kicker text"
            />
          </label>
          <label className="space-y-1">
            <span className="text-xs font-medium text-slate-500">Title</span>
            <input
              value={config.title || ""}
              onChange={(e) => updateConfig({ title: e.target.value })}
              className="w-full rounded-lg border border-slate-300 px-3 py-2"
              placeholder="Enter services title"
            />
          </label>
          <label className="space-y-1 md:col-span-2">
            <span className="text-xs font-medium text-slate-500">
              Description
            </span>
            <input
              value={config.description || ""}
              onChange={(e) => updateConfig({ description: e.target.value })}
              className="w-full rounded-lg border border-slate-300 px-3 py-2"
              placeholder="Enter services description"
            />
          </label>
          <CloudinaryImageField
            label="Background image"
            value={config.backgroundImage || ""}
            onChange={(backgroundImage) => updateConfig({ backgroundImage })}
            placeholder="Paste a background image URL"
            uploadKey="services-backgroundImage"
            uploading={Boolean(uploadingKeys["services-backgroundImage"])}
            onUploadImage={uploadImage}
            className="space-y-1 md:col-span-2"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <label className="space-y-1">
            <span className="text-xs font-medium text-slate-500">
              Modal title
            </span>
            <input
              value={config.modalTitle || ""}
              onChange={(e) => updateConfig({ modalTitle: e.target.value })}
              className="w-full rounded-lg border border-slate-300 px-3 py-2"
              placeholder="Enter modal title"
            />
          </label>
          <label className="space-y-1">
            <span className="text-xs font-medium text-slate-500">
              Modal subtitle
            </span>
            <input
              value={config.modalSubtitle || ""}
              onChange={(e) => updateConfig({ modalSubtitle: e.target.value })}
              className="w-full rounded-lg border border-slate-300 px-3 py-2"
              placeholder="Enter modal subtitle"
            />
          </label>
          <label className="space-y-1">
            <span className="text-xs font-medium text-slate-500">
              Modal button text
            </span>
            <input
              value={config.modalButtonText || ""}
              onChange={(e) =>
                updateConfig({ modalButtonText: e.target.value })
              }
              className="w-full rounded-lg border border-slate-300 px-3 py-2"
              placeholder="Enter modal button text"
            />
          </label>
          <label className="space-y-1">
            <span className="text-xs font-medium text-slate-500">
              CTA label
            </span>
            <input
              value={config.ctaLabel || ""}
              onChange={(e) => updateConfig({ ctaLabel: e.target.value })}
              className="w-full rounded-lg border border-slate-300 px-3 py-2"
              placeholder="Enter CTA label"
            />
          </label>
        </div>

        <label className="space-y-1 block">
          <span className="text-xs font-medium text-slate-500">
            Services list
          </span>
          <textarea
            value={joinLines(config.services)}
            onChange={(e) =>
              updateConfig({ services: splitLines(e.target.value) })
            }
            className="w-full rounded-lg border border-slate-300 px-3 py-2 min-h-28"
            placeholder="One service per line"
          />
        </label>
      </div>
    );
  }

  if (section.key === "enhancement") {
    return (
      <div className="space-y-4 rounded-xl border border-slate-200 bg-white p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <label className="space-y-1">
            <span className="text-xs font-medium text-slate-500">
              Highlight
            </span>
            <input
              value={config.highlight || ""}
              onChange={(e) => updateConfig({ highlight: e.target.value })}
              className="w-full rounded-lg border border-slate-300 px-3 py-2"
              placeholder="Enter highlight text"
            />
          </label>
          <label className="space-y-1">
            <span className="text-xs font-medium text-slate-500">Emphasis</span>
            <input
              value={config.emphasis || ""}
              onChange={(e) => updateConfig({ emphasis: e.target.value })}
              className="w-full rounded-lg border border-slate-300 px-3 py-2"
              placeholder="Enter emphasis text"
            />
          </label>
          <label className="space-y-1 md:col-span-2">
            <span className="text-xs font-medium text-slate-500">
              Description
            </span>
            <input
              value={config.description || ""}
              onChange={(e) => updateConfig({ description: e.target.value })}
              className="w-full rounded-lg border border-slate-300 px-3 py-2"
              placeholder="Enter enhancement description"
            />
          </label>
          <CloudinaryImageField
            label="Hero image"
            value={config.heroImage || ""}
            onChange={(heroImage) => updateConfig({ heroImage })}
            placeholder="Paste a hero image URL"
            uploadKey="enhancement-heroImage"
            uploading={Boolean(uploadingKeys["enhancement-heroImage"])}
            onUploadImage={uploadImage}
            className="space-y-1 md:col-span-2"
          />
        </div>

        <RepeatableEditor
          title="Trust cards"
          items={config.cards || []}
          onChange={(cards) => updateConfig({ cards })}
          fields={[
            { key: "title", label: "Title", placeholder: "Enter card title" },
            {
              key: "description",
              label: "Description",
              type: "textarea",
              placeholder: "Enter card description",
            },
            {
              key: "image",
              label: "Image URL",
              type: "image",
              placeholder: "Paste a card image URL or upload",
            },
          ]}
          onUploadImage={uploadImage}
          uploadingKeys={uploadingKeys}
        />
      </div>
    );
  }

  return (
    <div className="space-y-4 rounded-xl border border-slate-200 bg-white p-4">
      <p className="text-sm text-slate-600">
        This section uses the shared editor only.
      </p>
      <details className="rounded-lg border border-slate-200 bg-slate-50 p-3">
        <summary className="cursor-pointer text-sm font-medium text-slate-700">
          Advanced JSON
        </summary>
        <textarea
          value={JSON.stringify(config || {}, null, 2)}
          onChange={(e) => {
            try {
              onChange(JSON.parse(e.target.value || "{}"));
            } catch (error) {
              onChange(config);
            }
          }}
          className="mt-3 w-full rounded-lg border border-slate-300 px-3 py-2 min-h-40 font-mono text-sm"
        />
      </details>
    </div>
  );
}
