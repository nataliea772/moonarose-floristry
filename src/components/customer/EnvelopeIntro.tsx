"use client";

import { useCallback, useEffect, useState } from "react";
import { getTextDirection, getTranslations, type Language } from "@/lib/translations";

const ENVELOPE_INTRO_STORAGE_KEY = "moonarose_envelope_intro_seen";
const OPEN_ANIMATION_MS = 1100;

type EnvelopeIntroProps = {
  language: Language;
};

type IntroPhase = "checking" | "visible" | "opening" | "closed";

function readIntroSeen(): boolean {
  try {
    return sessionStorage.getItem(ENVELOPE_INTRO_STORAGE_KEY) === "1";
  } catch {
    return false;
  }
}

function markIntroSeen(): void {
  try {
    sessionStorage.setItem(ENVELOPE_INTRO_STORAGE_KEY, "1");
  } catch {
    // sessionStorage may be unavailable; intro still closes normally
  }
}

export function EnvelopeIntro({ language }: EnvelopeIntroProps) {
  const [phase, setPhase] = useState<IntroPhase>("checking");
  const t = getTranslations(language);
  const direction = getTextDirection(language);

  useEffect(() => {
    setPhase(readIntroSeen() ? "closed" : "visible");
  }, []);

  useEffect(() => {
    if (phase === "visible" || phase === "opening") {
      const previousOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";

      return () => {
        document.body.style.overflow = previousOverflow;
      };
    }

    document.body.style.overflow = "";
  }, [phase]);

  const closeIntro = useCallback(() => {
    if (phase !== "visible") {
      return;
    }

    markIntroSeen();
    setPhase("opening");

    window.setTimeout(() => {
      setPhase("closed");
    }, OPEN_ANIMATION_MS);
  }, [phase]);

  if (phase === "checking" || phase === "closed") {
    return null;
  }

  const isOpening = phase === "opening";

  return (
    <div
      className={`envelope-intro ${isOpening ? "envelope-intro-opening" : ""}`}
      dir={direction}
      role="dialog"
      aria-modal="true"
      aria-label={t.envelopeIntroHint}
    >
      <button
        type="button"
        className="envelope-intro-skip"
        onClick={(event) => {
          event.stopPropagation();
          closeIntro();
        }}
      >
        {t.envelopeIntroSkip}
      </button>

      <button
        type="button"
        className="envelope-intro-trigger"
        onClick={closeIntro}
        aria-label={t.envelopeIntroHint}
      >
        <div className="envelope-intro-card">
          <div className="envelope-intro-bloom" aria-hidden="true" />

          <div className="envelope-intro-envelope">
            <div className="envelope-body">
              <div className="envelope-texture" aria-hidden="true" />
              <div className="envelope-paper" aria-hidden="true" />
              <div className="envelope-fold envelope-fold-left" aria-hidden="true" />
              <div className="envelope-fold envelope-fold-right" aria-hidden="true" />
              <div className="envelope-fold envelope-fold-bottom" aria-hidden="true" />
              <div className="envelope-flap" aria-hidden="true" />
              <div className="envelope-seal-wrap">
                <div className="envelope-seal" aria-hidden="true">
                  <span className="envelope-seal-mark">m</span>
                </div>
                <p className="envelope-seal-hint">{t.envelopeIntroHint}</p>
              </div>
            </div>
          </div>
        </div>
      </button>
    </div>
  );
}
