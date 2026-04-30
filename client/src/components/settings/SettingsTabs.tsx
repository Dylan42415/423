import { ReactNode } from "react";
import { cn } from "@/utils/cn";

interface Tab {
  id: string;
  label: string;
}

interface SettingsTabsProps {
  tabs: Tab[];
  activeTab: string;
  onTabChange: (id: string) => void;
}

export default function SettingsTabs({
  tabs,
  activeTab,
  onTabChange,
}: SettingsTabsProps) {
  return (
    <div className="border-b border-border">
      <nav className="flex gap-1 px-1" aria-label="Settings tabs">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            data-testid={`tab-settings-${tab.id}`}
            className={cn(
              "px-4 py-3 text-sm font-medium transition-all duration-150 border-b-2 -mb-px whitespace-nowrap",
              activeTab === tab.id
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground hover:border-border",
            )}
          >
            {tab.label}
          </button>
        ))}
      </nav>
    </div>
  );
}
