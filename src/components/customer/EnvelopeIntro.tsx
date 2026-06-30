"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { getTextDirection, getTranslations, type Language } from "@/lib/translations";

const ENVELOPE_INTRO_STORAGE_KEY = "moonarose_envelope_intro_seen";
const OPEN_ANIMATION_MS = 1400;

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
  const skipButtonRef = useRef<HTMLButtonElement>(null);
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

  useEffect(() => {
    if (phase !== "visible") {
      return;
    }

    skipButtonRef.current?.focus();
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
      className={`envelope-intro ${isOpening ? "envelope-intro-opening envelope-open" : ""}`}
      dir={direction}
      role="dialog"
      aria-modal="true"
      aria-label={t.envelopeIntroHint}
    >
      <button
        ref={skipButtonRef}
        type="button"
        className="envelope-intro-skip"
        aria-label={t.envelopeIntroSkip}
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
        <div className="envelope-fullscreen" aria-hidden="true">
          <div className="envelope-paper-base">
            <div className="envelope-paper-texture" />
            <div className="envelope-paper-vignette" />
          </div>

          <div className="envelope-left-fold" />
          <div className="envelope-right-fold" />
          <div className="envelope-bottom-flap" />
          <div className="envelope-top-flap" />

          <div className="envelope-crease-lines">
            <span className="envelope-crease-line envelope-crease-tl" />
            <span className="envelope-crease-line envelope-crease-tr" />
            <span className="envelope-crease-line envelope-crease-bl" />
            <span className="envelope-crease-line envelope-crease-br" />
          </div>

          <div className="envelope-seal-stack">
            <div className="envelope-wax-seal">
              <span className="envelope-wax-seal-mark">Moonarośe</span>
            </div>
            <p className="envelope-hint">{t.envelopeIntroHint}</p>
          </div>
        </div>
      </button>
    </div>
  );
}
