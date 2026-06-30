import { adminTabs } from "@/components/admin/constants";
import type { AdminTab } from "@/components/admin/types";

type AdminTabsProps = {
  selectedTab: AdminTab;
  onSelectTab: (tab: AdminTab) => void;
};

export function AdminTabs({ selectedTab, onSelectTab }: AdminTabsProps) {
  return (
    <nav className="admin-nav" aria-label="ניווט בלוח הבקרה">
      <div className="admin-nav-tabs" role="tablist">
        {adminTabs.map((tab) => {
          const isSelected = selectedTab === tab;

          return (
            <button
              key={tab}
              type="button"
              role="tab"
              id={`admin-tab-${tab}`}
              aria-selected={isSelected}
              aria-controls="admin-tab-panel"
              onClick={() => onSelectTab(tab)}
              className={`admin-tab ${isSelected ? "admin-tab-active" : ""}`}
            >
              {tab}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
