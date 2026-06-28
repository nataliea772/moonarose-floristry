"use client";

import { BRAND_NAME } from "@/lib/brand";
import {
  PhoneIcon,
  WhatsAppIcon,
  InstagramIcon,
  FacebookIcon,
  TikTokIcon,
} from "@/components/ContactIcons";
import { getTranslations } from "@/lib/translations";

type CustomerTranslations = ReturnType<typeof getTranslations>;

type CustomerHeroProps = {
  translations: CustomerTranslations;
  phoneHref: string;
  whatsappContactHref: string;
  instagramHref: string;
  facebookHref: string;
  tiktokHref: string;
  hasContactButtons: boolean;
};

export function CustomerHero({
  translations: t,
  phoneHref,
  whatsappContactHref,
  instagramHref,
  facebookHref,
  tiktokHref,
  hasContactButtons,
}: CustomerHeroProps) {
  return (
    <header className="hero-section mb-6 text-center sm:mb-16">
      <p className="hero-eyebrow mb-2 sm:mb-4">{t.floralBoutique}</p>

      <h1 className="brand-title mb-3 break-words px-1 sm:mb-5">{BRAND_NAME}</h1>

      <p className="hero-tagline mx-auto max-w-2xl px-2 text-sm sm:text-lg">
        {t.heroTagline}
      </p>

      {hasContactButtons && (
        <div className="contact-icons-row mt-4 sm:mt-9">
          {phoneHref && (
            <a
              className="contact-icon-btn"
              href={phoneHref}
              title={t.phone}
              aria-label={t.phone}
            >
              <PhoneIcon />
            </a>
          )}
          {whatsappContactHref && (
            <a
              className="contact-icon-btn"
              href={whatsappContactHref}
              target="_blank"
              rel="noopener noreferrer"
              title={t.whatsapp}
              aria-label={t.whatsapp}
            >
              <WhatsAppIcon />
            </a>
          )}
          {instagramHref && (
            <a
              className="contact-icon-btn"
              href={instagramHref}
              target="_blank"
              rel="noopener noreferrer"
              title={t.instagram}
              aria-label={t.instagram}
            >
              <InstagramIcon />
            </a>
          )}
          {facebookHref && (
            <a
              className="contact-icon-btn"
              href={facebookHref}
              target="_blank"
              rel="noopener noreferrer"
              title={t.facebook}
              aria-label={t.facebook}
            >
              <FacebookIcon />
            </a>
          )}
          {tiktokHref && (
            <a
              className="contact-icon-btn"
              href={tiktokHref}
              target="_blank"
              rel="noopener noreferrer"
              title={t.tiktok}
              aria-label={t.tiktok}
            >
              <TikTokIcon />
            </a>
          )}
        </div>
      )}
    </header>
  );
}
