"use client";

import {
  FormField,
  inputClassName,
  PrimaryActionButton,
} from "@/components/admin/AdminUI";
import { type ContactDetails } from "@/components/admin/types";

type ContactDetailsTabProps = {
  isLoadingContactDetails: boolean;
  contactLoadError: string;
  contactDetails: ContactDetails;
  onContactDetailsChange: (
    updater: (previous: ContactDetails) => ContactDetails
  ) => void;
  contactSaveMessage: string;
  contactSaveError: string;
  isSavingContactDetails: boolean;
  onSaveContactDetails: () => void;
};

export function ContactDetailsTab({
  isLoadingContactDetails,
  contactLoadError,
  contactDetails,
  onContactDetailsChange,
  contactSaveMessage,
  contactSaveError,
  isSavingContactDetails,
  onSaveContactDetails,
}: ContactDetailsTabProps) {
  return (
    <section className="admin-panel">
      <h2 className="admin-section-title mb-2">פרטי קשר שמופיעים ללקוחות</h2>
      <p className="admin-helper-text">
        השאירי שדה ריק כדי שהאייקון לא יופיע ללקוחות.
      </p>

      {isLoadingContactDetails ? (
        <p className="admin-message-muted">טוען פרטי קשר...</p>
      ) : contactLoadError ? (
        <p className="admin-message-error">{contactLoadError}</p>
      ) : (
        <>
          <div className="admin-form-grid">
            <FormField label="טלפון">
              <input
                type="text"
                className={inputClassName}
                value={contactDetails.phone}
                onChange={(event) =>
                  onContactDetailsChange((previous) => ({
                    ...previous,
                    phone: event.target.value,
                  }))
                }
              />
            </FormField>

            <FormField label="WhatsApp">
              <input
                type="text"
                className={inputClassName}
                value={contactDetails.whatsapp}
                onChange={(event) =>
                  onContactDetailsChange((previous) => ({
                    ...previous,
                    whatsapp: event.target.value,
                  }))
                }
              />
            </FormField>

            <FormField label="Instagram">
              <input
                type="text"
                className={inputClassName}
                placeholder="קישור או שם משתמש"
                value={contactDetails.instagram}
                onChange={(event) =>
                  onContactDetailsChange((previous) => ({
                    ...previous,
                    instagram: event.target.value,
                  }))
                }
              />
            </FormField>

            <FormField label="Facebook">
              <input
                type="text"
                className={inputClassName}
                placeholder="קישור או שם עמוד"
                value={contactDetails.facebook}
                onChange={(event) =>
                  onContactDetailsChange((previous) => ({
                    ...previous,
                    facebook: event.target.value,
                  }))
                }
              />
            </FormField>

            <FormField label="TikTok" className="admin-form-grid-span-2">
              <input
                type="text"
                className={inputClassName}
                placeholder="קישור או שם משתמש"
                value={contactDetails.tiktok}
                onChange={(event) =>
                  onContactDetailsChange((previous) => ({
                    ...previous,
                    tiktok: event.target.value,
                  }))
                }
              />
            </FormField>
          </div>

          {contactSaveMessage && (
            <p className="admin-message-success mt-4">{contactSaveMessage}</p>
          )}

          {contactSaveError && (
            <p className="admin-message-error mt-4">{contactSaveError}</p>
          )}

          <div className="mt-6">
            <PrimaryActionButton
              onClick={onSaveContactDetails}
              disabled={isSavingContactDetails}
            >
              {isSavingContactDetails ? "שומרת..." : "שמירת פרטי קשר"}
            </PrimaryActionButton>
          </div>
        </>
      )}
    </section>
  );
}
