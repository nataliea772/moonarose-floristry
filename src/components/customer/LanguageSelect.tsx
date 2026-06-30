"use client";

import {
  isLanguage,
  LANGUAGE_OPTIONS,
  getTranslations,
  type Language,
} from "@/lib/translations";

type LanguageSelectProps = {
  language: Language;
  pageDirection: "rtl" | "ltr";
  onLanguageChange: (language: Language) => void;
};

export function LanguageSelect({
  language,
  pageDirection,
  onLanguageChange,
}: LanguageSelectProps) {
  const t = getTranslations(language);

  return (
    <div
      className={`boutique-topbar ${
        language === "en" ? "boutique-topbar-end" : "boutique-topbar-start"
      }`}
    >
      <label className="language-select-wrap">
        <select
          className="language-select"
          dir={pageDirection}
          value={language}
          onChange={(event) => {
            const nextLanguage = event.target.value;
            if (isLanguage(nextLanguage)) {
              onLanguageChange(nextLanguage);
            }
          }}
          aria-label={t.languageSelectAria}
        >
          {LANGUAGE_OPTIONS.map((option) => (
            <option key={option.code} value={option.code}>
              {option.label}
            </option>
          ))}
        </select>
      </label>
    </div>
  );
}
