import React from "react";

type TabNavigationProps = {
  activeTab: "connexion" | "inscription";
  onTabChange: (tab: "connexion" | "inscription") => void;
};

export default function TabNavigation({
  activeTab,
  onTabChange,
}: TabNavigationProps) {
  const tabs = [
    { id: "connexion", label: "Connexion" },
    { id: "inscription", label: "Inscription" },
  ] as const;

  return (
    <div className="mb-8 p-2" style={{ backgroundColor: "#E2E8F0" }}>
      <div className="flex gap-2">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`flex-1 py-3 px-4 text-sm font-medium transition-colors relative ${
              activeTab === tab.id
                ? "hover:bg-white"
                : "bg-transparent hover:bg-white/50"
            }`}
            style={{
              borderRadius: "0px",
              color: activeTab === tab.id ? "#527FC1" : "#64748B",
            }}
          >
            {tab.label}
            {activeTab === tab.id && (
              <div
                className="absolute bottom-0 left-0 right-0 h-[3px]"
                style={{
                  background:
                    "linear-gradient(90deg, #CA1771 0%, #F05F3C 100%)",
                }}
              />
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
