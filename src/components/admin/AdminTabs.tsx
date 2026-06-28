import { adminTabs } from "@/components/admin/constants";
import type { AdminTab } from "@/components/admin/types";

type AdminTabsProps = {
  selectedTab: AdminTab;
  onSelectTab: (tab: AdminTab) => void;
};

export function AdminTabs({ selectedTab, onSelectTab }: AdminTabsProps) {
  return (
    <nav className="admin-nav">
      {adminTabs.map((tab) => {
        const isSelected = selectedTab === tab;

        return (
          <button
            key={tab}
            type="button"
            onClick={() => onSelectTab(tab)}
            className={`admin-tab ${isSelected ? "admin-tab-active" : ""}`}
          >
            {tab}
          </button>
        );
      })}
    </nav>
  );
}
