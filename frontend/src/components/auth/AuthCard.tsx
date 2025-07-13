import React from "react";
import TabNavigation from "./TabNavigation";

interface AuthCardProps {
  activeTab: "connexion" | "inscription";
  onTabChange: (tab: "connexion" | "inscription") => void;
  children: React.ReactNode;
}

export default function AuthCard({
  activeTab,
  onTabChange,
  children,
}: AuthCardProps) {
  return (
    <div className="bg-white rounded-t-3xl sm:rounded-2xl p-8 shadow-2xl flex-1 lg:flex-initial">
      <TabNavigation activeTab={activeTab} onTabChange={onTabChange} />

      <div className="mt-8">{children}</div>
    </div>
  );
}
