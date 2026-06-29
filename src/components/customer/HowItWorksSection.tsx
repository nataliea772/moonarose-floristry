"use client";

import { getTranslations } from "@/lib/translations";

type CustomerTranslations = ReturnType<typeof getTranslations>;

type HowItWorksSectionProps = {
  translations: CustomerTranslations;
};

function BouquetStepIcon() {
  return (
    <svg
      className="customer-how-it-works-step-icon"
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
      <path d="M9.5 6.5 12 3l2.5 3.5" />
    </svg>
  );
}

function CalendarStepIcon() {
  return (
    <svg
      className="customer-how-it-works-step-icon"
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
      <path d="M12 13.5c.6.8.9 1.4.9 2a1.4 1.4 0 0 1-2.5.9" />
    </svg>
  );
}

function ChatStepIcon() {
  return (
    <svg
      className="customer-how-it-works-step-icon"
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

export function HowItWorksSection({ translations: t }: HowItWorksSectionProps) {
  const steps = [
    {
      number: 1,
      icon: <BouquetStepIcon />,
      title: t.howItWorksStep1Title,
      text: t.howItWorksStep1Text,
    },
    {
      number: 2,
      icon: <CalendarStepIcon />,
      title: t.howItWorksStep2Title,
      text: t.howItWorksStep2Text,
    },
    {
      number: 3,
      icon: <ChatStepIcon />,
      title: t.howItWorksStep3Title,
      text: t.howItWorksStep3Text,
    },
  ];

  return (
    <section
      className="customer-how-it-works"
      aria-labelledby="customer-how-it-works-title"
    >
      <h2
        id="customer-how-it-works-title"
        className="customer-how-it-works-title"
      >
        {t.howItWorksTitle}
      </h2>

      <div className="customer-how-it-works-divider" aria-hidden="true">
        <span className="customer-how-it-works-divider-line" />
        <span className="customer-how-it-works-divider-flower">✿</span>
        <span className="customer-how-it-works-divider-line" />
      </div>

      <ol className="customer-how-it-works-steps">
        {steps.map((step) => (
          <li key={step.number} className="customer-step">
            <div className="customer-step-visual">
              <span className="customer-step-badge">{step.number}</span>
              <div className="customer-step-icon-ring">{step.icon}</div>
            </div>
            <h3 className="customer-step-title">{step.title}</h3>
            <p className="customer-step-text">{step.text}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}
