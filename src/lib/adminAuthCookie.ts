export const ADMIN_AUTH_COOKIE = "moonarose_admin_auth";
export const ADMIN_AUTH_COOKIE_VALUE = "1";

export function setAdminAuthCookie(): void {
  if (typeof document === "undefined") {
    return;
  }

  document.cookie = `${ADMIN_AUTH_COOKIE}=${ADMIN_AUTH_COOKIE_VALUE}; path=/; max-age=604800; SameSite=Lax`;
}

export function clearAdminAuthCookie(): void {
  if (typeof document === "undefined") {
    return;
  }

  document.cookie = `${ADMIN_AUTH_COOKIE}=; path=/; max-age=0; SameSite=Lax`;
}
