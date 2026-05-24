"use client";

import React, { useState } from "react";
import BlogMediaLibrary from "@/components/dashboard/Blog/BlogMediaLibrary";

export default function CloudinaryImageField({
  label,
  value,
  onChange,
  placeholder,
  uploadKey,
  uploading,
  onUploadImage,
  className = "space-y-1 block md:col-span-2",
  defaultFolder = "a2it-usa/promotions",
  helperText = "Paste a URL, upload from your device, or select from Cloudinary.",
}) {
  const [showLibrary, setShowLibrary] = useState(false);

  const handleLibrarySelect = (item) => {
    const nextValue = item?.url || item?.secure_url || "";
    onChange(nextValue);
    setShowLibrary(false);
  };

  return (
    <div className={className}>
      <span className="text-xs font-medium text-slate-500">{label}</span>
      <div className="space-y-2">
        <input
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          placeholder={
            placeholder || `Paste ${String(label || "image").toLowerCase()} URL`
          }
          className="w-full rounded-lg border border-slate-300 px-3 py-2"
        />

        <div className="flex flex-wrap items-center gap-2">
          {onUploadImage ? (
            <label className="inline-flex cursor-pointer items-center rounded-lg border border-slate-300 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100">
              {uploading ? "Uploading..." : "Upload image"}
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;

                  try {
                    const imageUrl = await onUploadImage(uploadKey, file);
                    if (imageUrl) {
                      onChange(imageUrl);
                    }
                  } finally {
                    e.target.value = "";
                  }
                }}
              />
            </label>
          ) : null}

          <button
            type="button"
            onClick={() => setShowLibrary(true)}
            className="inline-flex items-center rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
          >
            Select from Cloudinary
          </button>

          <span className="text-[11px] text-slate-500">{helperText}</span>
        </div>
      </div>

      {showLibrary && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="max-h-[90vh] w-full max-w-6xl overflow-hidden rounded-2xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
              <div>
                <h3 className="text-lg font-semibold text-slate-900">
                  Select from Cloudinary
                </h3>
                <p className="text-sm text-slate-500">
                  Pick an existing asset from the media library.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowLibrary(false)}
                className="rounded-full border border-slate-200 px-3 py-1.5 text-sm text-slate-600 hover:bg-slate-50"
              >
                Close
              </button>
            </div>

            <div className="max-h-[calc(90vh-5rem)] overflow-y-auto bg-slate-50 p-4">
              <BlogMediaLibrary
                onSelect={handleLibrarySelect}
                showSelection={false}
                defaultFolder={defaultFolder}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
