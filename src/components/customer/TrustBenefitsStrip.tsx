"use client";

import { getTranslations } from "@/lib/translations";

type CustomerTranslations = ReturnType<typeof getTranslations>;

type TrustBenefitsStripProps = {
  translations: CustomerTranslations;
};

function PickupIcon() {
  return (
    <svg
      className="customer-benefits-strip-icon"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M12 21c-3.5-2.5-6-5.2-6-8.5a3.5 3.5 0 0 1 6-2.2 3.5 3.5 0 0 1 6 2.2c0 3.3-2.5 6-6 8.5Z" />
      <path d="M12 10.3V21" />
    </svg>
  );
}

function HeartIcon() {
  return (
    <svg
      className="customer-benefits-strip-icon"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8Z" />
    </svg>
  );
}

function CalendarIcon() {
  return (
    <svg
      className="customer-benefits-strip-icon"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="3" y="4.5" width="18" height="16" rx="2.5" />
      <path d="M8 3v3M16 3v3M3 9.5h18" />
    </svg>
  );
}

function WhatsAppBenefitIcon() {
  return (
    <svg
      className="customer-benefits-strip-icon"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M7.5 18.5 5 21v-4.5H5a3.5 3.5 0 0 1-3.5-3.5v-7A3.5 3.5 0 0 1 5 2.5h14a3.5 3.5 0 0 1 3.5 3.5v7A3.5 3.5 0 0 1 19 16.5H7.5Z" />
      <path d="M8.5 8.5h7M8.5 12h4.5" />
    </svg>
  );
}

export function TrustBenefitsStrip({ translations: t }: TrustBenefitsStripProps) {
  const items = [
    {
      icon: <PickupIcon />,
      title: t.trustBenefit1Title,
      subtitle: t.trustBenefit1Subtitle,
    },
    {
      icon: <HeartIcon />,
      title: t.trustBenefit2Title,
      subtitle: t.trustBenefit2Subtitle,
    },
    {
      icon: <CalendarIcon />,
      title: t.trustBenefit3Title,
      subtitle: t.trustBenefit3Subtitle,
    },
    {
      icon: <WhatsAppBenefitIcon />,
      title: t.trustBenefit4Title,
      subtitle: t.trustBenefit4Subtitle,
    },
  ];

  return (
    <div className="customer-benefits-strip" aria-label={t.trustBenefitsAria}>
      {items.map((item) => (
        <div key={item.title} className="customer-benefits-strip-item">
          <div className="customer-benefits-strip-icon-wrap">{item.icon}</div>
          <p className="customer-benefits-strip-title">{item.title}</p>
          <p className="customer-benefits-strip-subtitle">{item.subtitle}</p>
        </div>
      ))}
    </div>
  );
}
