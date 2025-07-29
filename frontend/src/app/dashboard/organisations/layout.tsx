"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import SearchUi from "@/features/workspaces/components/search-icon";
import { Plus } from "lucide-react";
import CreateWorkspaceModal from "@/features/workspaces/components/create-workspace-modal";

export default function OrganiazationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="max-w-6xl mx-auto p-8 font-sans bg-gray-50 min-h-screen">
      <div className="mb-8 flex items-center justify-between gap-2">
        <SearchUi />
        <Button
          variant="outline"
          size="sm"
          className="flex items-center gap-1 font-medium rounded-md shadow-sm transition-all"
          onClick={() => setOpen(true)}
        >
          <Plus className="w-4 h-4" />
          <span className="text-sm">Créer</span>
        </Button>
      </div>

      {/* Modal bien fermé */}
      <CreateWorkspaceModal open={open} onOpenChange={setOpen} canClose={true} />

      {/* Contenu principal */}
      {children}
    </div>
  );
}
