"use client";

import { WhatsAppIcon } from "@/components/ContactIcons";
import { TrustBenefitsStrip } from "@/components/customer/TrustBenefitsStrip";
import { getTranslations } from "@/lib/translations";

type CustomerTranslations = ReturnType<typeof getTranslations>;

type ConsultationCardProps = {
  translations: CustomerTranslations;
  whatsappHref: string;
};

function ConsultationFlowerIllustration() {
  return (
    <div className="customer-consultation-flower" aria-hidden="true">
      <img
        className="customer-consultation-flower-image"
        src="/images/consultation-flower.png"
        alt=""
        draggable={false}
      />
    </div>
  );
}

export function ConsultationCard({
  translations: t,
  whatsappHref,
}: ConsultationCardProps) {
  return (
    <section
      className="customer-consultation-card"
      aria-labelledby="customer-consultation-title"
    >
      <div className="customer-consultation-card-inner">
        <div className="customer-consultation-card-main">
          <ConsultationFlowerIllustration />

          <div className="customer-consultation-card-content">
            <h2
              id="customer-consultation-title"
              className="customer-consultation-card-title"
            >
              {t.consultationTitle}
            </h2>
            <p className="customer-consultation-card-text">{t.consultationText}</p>

            {whatsappHref ? (
              <a
                className="customer-consultation-button"
                href={whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={t.consultationWhatsApp}
              >
                <WhatsAppIcon className="customer-consultation-button-icon" />
                <span>{t.consultationWhatsApp}</span>
              </a>
            ) : null}
          </div>
        </div>

        <TrustBenefitsStrip translations={t} />
      </div>
    </section>
  );
}
