import { inputClassName } from "@/components/admin/constants";

export { inputClassName };

export function PrimaryActionButton({
  children,
  onClick,
  disabled,
  className = "",
}: {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`admin-btn-primary ${className}`.trim()}
    >
      {children}
    </button>
  );
}

export function EditActionButton({ onClick }: { onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} className="admin-btn-edit">
      עריכה
    </button>
  );
}

export function DeleteActionButton({ onClick }: { onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} className="admin-btn-delete">
      מחיקה
    </button>
  );
}

export function FormField({
  label,
  children,
  className = "",
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <label className={`block ${className}`.trim()}>
      <span className="admin-form-label">{label}</span>
      {children}
    </label>
  );
}
