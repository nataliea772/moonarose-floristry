"use client";

import { getTranslations } from "@/lib/translations";
import { VanIllustration } from "@/components/customer/VanIllustration";

type CustomerTranslations = ReturnType<typeof getTranslations>;

type ComingSoonVanCardProps = {
  translations: CustomerTranslations;
};

export function ComingSoonVanCard({ translations: t }: ComingSoonVanCardProps) {
  return (
    <aside
      className="coming-soon-van customer-van-card customer-on-road-card"
      aria-label={t.vanTeaserLabel}
    >
      <div
        className="coming-soon-van-visual customer-van-illustration customer-on-road-image-wrap"
        aria-hidden="true"
      >
        <VanIllustration />
      </div>

      <div className="coming-soon-van-copy customer-on-road-copy">
        <div className="coming-soon-van-label-row">
          <span className="coming-soon-van-label-dot" aria-hidden="true" />
          <p className="coming-soon-van-label">{t.vanTeaserLabel}</p>
          <span className="coming-soon-van-label-line" aria-hidden="true" />
        </div>
        <h3 className="coming-soon-van-title">{t.vanTeaserTitle}</h3>
        <p className="coming-soon-van-text">{t.vanTeaserText}</p>
      </div>
    </aside>
  );
}
