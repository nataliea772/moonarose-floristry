export type OrderSettings = {
  availableDatesCount: number;
};

export const DEFAULT_ORDER_SETTINGS: OrderSettings = {
  availableDatesCount: 5,
};

export const AVAILABLE_DATES_COUNT_OPTIONS = [5, 7, 10, 14, 21, 30] as const;

export function normalizeAvailableDatesCount(count: number): number {
  const rounded = Math.round(count);

  if (!Number.isFinite(rounded) || rounded < 1 || rounded > 30) {
    return DEFAULT_ORDER_SETTINGS.availableDatesCount;
  }

  return rounded;
}

export function normalizeAvailableDatesCountForSelect(count: number): number {
  const normalized = normalizeAvailableDatesCount(count);

  if (
    AVAILABLE_DATES_COUNT_OPTIONS.includes(
      normalized as (typeof AVAILABLE_DATES_COUNT_OPTIONS)[number]
    )
  ) {
    return normalized;
  }

  return DEFAULT_ORDER_SETTINGS.availableDatesCount;
}

export function normalizeOrderSettings(settings: OrderSettings): OrderSettings {
  return {
    availableDatesCount: normalizeAvailableDatesCount(
      settings.availableDatesCount
    ),
  };
}
