"use client";

import { getTranslations } from "@/lib/translations";

type CustomerTranslations = ReturnType<typeof getTranslations>;

type ComingSoonVanCardProps = {
  translations: CustomerTranslations;
};

export function ComingSoonVanCard({ translations: t }: ComingSoonVanCardProps) {
  return (
    <aside className="coming-soon-van" aria-label={t.vanTeaserLabel}>
      <div className="coming-soon-van-copy">
        <div className="coming-soon-van-label-row">
          <span className="coming-soon-van-label-dot" aria-hidden="true" />
          <p className="coming-soon-van-label">{t.vanTeaserLabel}</p>
          <span className="coming-soon-van-label-line" aria-hidden="true" />
        </div>
        <h3 className="coming-soon-van-title">{t.vanTeaserTitle}</h3>
        <p className="coming-soon-van-text">{t.vanTeaserText}</p>
      </div>

      <div className="coming-soon-van-visual" aria-hidden="true">
        <div className="coming-soon-van-scene">
          <div className="coming-soon-van-glow" />
          <div className="coming-soon-van-road">
            <span className="coming-soon-van-road-line" />
          </div>

          <div className="coming-soon-van-truck">
            <div className="coming-soon-van-truck-motion">
              <div className="coming-soon-van-bouquet">
                <span className="coming-soon-van-stem coming-soon-van-stem-left" />
                <span className="coming-soon-van-stem coming-soon-van-stem-center" />
                <span className="coming-soon-van-stem coming-soon-van-stem-right" />
                <span className="coming-soon-van-bloom coming-soon-van-bloom-left" />
                <span className="coming-soon-van-bloom coming-soon-van-bloom-center" />
                <span className="coming-soon-van-bloom coming-soon-van-bloom-right" />
              </div>

              <div className="coming-soon-van-cab">
                <span className="coming-soon-van-cab-highlight" />
                <span className="coming-soon-van-windshield" />
              </div>

              <div className="coming-soon-van-body">
                <span className="coming-soon-van-awning" />
                <span className="coming-soon-van-awning-edge" />
                <span className="coming-soon-van-serving-window">
                  <span className="coming-soon-van-cup">
                    <span className="coming-soon-van-cup-rim" />
                    <span className="coming-soon-van-cup-body" />
                    <span className="coming-soon-van-cup-handle" />
                    <span className="coming-soon-van-cup-steam" />
                  </span>
                </span>
                <span className="coming-soon-van-side-mark">
                  <span className="coming-soon-van-moon" />
                  <span className="coming-soon-van-petal" />
                </span>
                <span className="coming-soon-van-body-shine" />
              </div>

              <div className="coming-soon-van-chassis" />

              <div className="coming-soon-van-wheels">
                <span className="coming-soon-van-wheel">
                  <span className="coming-soon-van-wheel-hub" />
                </span>
                <span className="coming-soon-van-wheel">
                  <span className="coming-soon-van-wheel-hub" />
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
