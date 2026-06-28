export type ContactDetails = {
  phone: string;
  whatsapp: string;
  instagram: string;
  facebook: string;
  tiktok: string;
};

export const EMPTY_CONTACT_DETAILS: ContactDetails = {
  phone: "",
  whatsapp: "",
  instagram: "",
  facebook: "",
  tiktok: "",
};

export function buildPhoneHref(phone: string): string {
  const trimmed = phone.trim();
  if (!trimmed) {
    return "";
  }

  return `tel:${trimmed}`;
}

export function normalizeWhatsAppPhone(phone: string): string {
  const digits = phone.trim().replace(/[\s\-()+]/g, "").replace(/\D/g, "");

  if (!digits) {
    return "";
  }

  if (digits.startsWith("972")) {
    return digits;
  }

  if (digits.startsWith("0")) {
    return `972${digits.slice(1)}`;
  }

  return digits;
}

export function buildWhatsAppHref(whatsapp: string, message?: string): string {
  const trimmed = whatsapp.trim();
  if (!trimmed) {
    return "";
  }

  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
    if (!message) {
      return trimmed;
    }

    try {
      const url = new URL(trimmed);
      url.searchParams.set("text", message);
      return url.toString();
    } catch {
      return trimmed;
    }
  }

  const normalized = normalizeWhatsAppPhone(trimmed);
  if (!normalized) {
    return "";
  }

  const base = `https://wa.me/${normalized}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}

export function buildInstagramHref(value: string): string {
  const trimmed = value.trim();
  if (!trimmed) {
    return "";
  }

  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
    return trimmed;
  }

  const username = trimmed.replace(/^@/, "");
  return `https://instagram.com/${username}`;
}

export function buildFacebookHref(value: string): string {
  const trimmed = value.trim();
  if (!trimmed) {
    return "";
  }

  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
    return trimmed;
  }

  return `https://facebook.com/${trimmed}`;
}

export function buildTikTokHref(value: string): string {
  const trimmed = value.trim();
  if (!trimmed) {
    return "";
  }

  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
    return trimmed;
  }

  const username = trimmed.replace(/^@/, "");
  return `https://tiktok.com/@${username}`;
}

export function buildSocialHref(value: string): string {
  const trimmed = value.trim();
  if (!trimmed) {
    return "";
  }

  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
    return trimmed;
  }

  return `https://${trimmed}`;
}
