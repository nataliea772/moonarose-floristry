import { BRAND_NAME } from "@/lib/brand";

export function AdminHeader() {
  return (
    <header className="admin-header">
      <p className="admin-eyebrow">ADMIN DASHBOARD</p>
      <h1 className="brand-title mb-3">{BRAND_NAME}</h1>
      <p className="admin-subtitle">מערכת ניהול לעסק הפרחים</p>
    </header>
  );
}
