import React from "react";
import {
  DEFAULT_PROMOTION_PAGE,
  PROMOTION_SECTION_COMPONENTS,
  PROMOTION_SECTION_KEYS,
} from "../promotionPageConfig";

const defaultSectionOrder = PROMOTION_SECTION_KEYS;

export default function Home({ pageConfig = DEFAULT_PROMOTION_PAGE }) {
  const sections = (
    pageConfig?.sections?.length
      ? pageConfig.sections
      : defaultSectionOrder.map((key, index) => ({
          key,
          enabled: true,
          order: index,
          config: {},
        }))
  ).filter((section) => section?.enabled !== false);

  const orderedSections = [...sections].sort((a, b) => {
    const aOrder = Number.isFinite(Number(a?.order)) ? Number(a.order) : 0;
    const bOrder = Number.isFinite(Number(b?.order)) ? Number(b.order) : 0;
    return aOrder - bOrder;
  });

  return (
    <>
      <main className="min-h-screen">
        {orderedSections.map((section) => {
          const SectionComponent = PROMOTION_SECTION_COMPONENTS[section.key];

          if (!SectionComponent) {
            return null;
          }

          return (
            <SectionComponent
              key={section.key}
              config={section.config || {}}
              pageConfig={pageConfig}
            />
          );
        })}
      </main>
    </>
  );
}
