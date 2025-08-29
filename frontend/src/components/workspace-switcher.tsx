"use client";

import * as React from "react";
import { ChevronsUpDown, Plus } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { useGetWorkspaces } from "@/features/workspaces/api/use-get-workspaces";
import { Organization } from "./organisation/types";
import CreateWorkspaceModal from "@/features/workspaces/components/create-workspace-modal";
import { useState } from "react";

export function OrganizationSwitcher({ onOrganizationChange }: { onOrganizationChange?: (org: Organization | null) => void }) {
  const { isMobile } = useSidebar();
  const { data: workspaces, isLoading, isError, error } = useGetWorkspaces();
  const [activeOrganization, setActiveOrganization] = useState<Organization | null>(null);

  const [open, setOpen] = useState(false);
  // Fonction pour obtenir la première lettre du nom de l'organisation
  const getOrganizationInitial = (name: string) => {
    return name.charAt(0).toUpperCase();
  };

  // Définir l'organisation active par défaut
  React.useEffect(() => {
    if (workspaces && workspaces.length > 0 && !activeOrganization) {
      setActiveOrganization(workspaces[0]);
    }
  }, [workspaces, activeOrganization]);

  // Notifier le parent quand l'organisation change
  React.useEffect(() => {
    if (onOrganizationChange) {
      onOrganizationChange(activeOrganization);
    }
  }, [activeOrganization, onOrganizationChange]);

  // Gestion des états de chargement et d'erreur
  if (isLoading) {
    return (
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton size="lg" className="animate-pulse">
            <div className="bg-gray-200 w-8 h-8 rounded-lg"></div>
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="bg-gray-200 h-4 w-20 rounded"></span>
              <span className="bg-gray-200 h-3 w-16 rounded mt-1"></span>
            </div>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    );
  }

  if (isError || !workspaces || workspaces.length === 0) {
    return (
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton size="lg">
            <div className="bg-red-100 text-red-600 flex aspect-square w-8 h-8 items-center justify-center rounded-lg font-semibold text-sm">
              ?
            </div>
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-medium">
                {isError ? "Erreur" : "Aucune organisation"}
              </span>
              <span className="truncate text-xs text-muted-foreground">
                {isError ? "Impossible de charger" : "Créer une organisation"}
              </span>
            </div>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    );
  }

  if (!activeOrganization) {
    return null;
  }

  
  return (
    <>
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild className="p-3">
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <div className="relative bg-gradient-to-br from-[#1e3a8a] via-[#2563eb] to-[#0ea5e9] text-white flex aspect-square w-8 h-8 items-center justify-center rounded-lg shadow-lg overflow-hidden">
                {/* Effet de brillance subtile */}
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent"></div>
                
                {activeOrganization.avatarUrl ? (
                  <img 
                    src={activeOrganization.avatarUrl} 
                    alt={activeOrganization.name}
                    className="w-8 h-8 rounded-lg object-cover relative z-10"
                  />
                ) : (
                  <span className="font-semibold text-sm relative z-10 drop-shadow-sm">
                    {getOrganizationInitial(activeOrganization.name)}
                  </span>
                )}
                
                {/* Bordure intérieure subtile */}
                <div className="absolute inset-0 rounded-lg border border-white/20"></div>
              </div>

              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{activeOrganization.name}</span>
                <span className="truncate text-xs text-muted-foreground">
                  {activeOrganization.organizer?.fullName || "Organisation"}
                </span>
              </div>
              <ChevronsUpDown className="ml-auto" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            align="start"
            side={isMobile ? "bottom" : "right"}
            sideOffset={4}
          >
            <DropdownMenuLabel className="text-muted-foreground text-xs">
              Organisations
            </DropdownMenuLabel>
            {workspaces.map((organization: Organization, index: number) => (
              <DropdownMenuItem
                key={organization.id}
                onClick={() => setActiveOrganization(organization)}
                className="gap-2 p-2"
              >
                <div className="relative flex size-6 items-center justify-center rounded-md border border-[#2563eb]/20 bg-gradient-to-br from-[#1e3a8a] to-[#0ea5e9] overflow-hidden">
                  {/* Effet de brillance */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent"></div>
                  
                  {organization.avatarUrl ? (
                    <img 
                      src={organization.avatarUrl} 
                      alt={organization.name}
                      className="w-6 h-6 rounded-md object-cover relative z-10"
                    />
                  ) : (
                    <span className="font-semibold text-xs text-white relative z-10 drop-shadow-sm">
                      {getOrganizationInitial(organization.name)}
                    </span>
                  )}
                </div>
                <div className="flex flex-col">
                  <span className="font-medium">{organization.name}</span>
                  {organization.organizer && (
                    <span className="text-xs text-muted-foreground">
                      {organization.organizer.fullName}
                    </span>
                  )}
                </div>
                <DropdownMenuShortcut>⌘{index + 1}</DropdownMenuShortcut>
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuItem className="gap-2 p-2"  onClick={() => setOpen(true)}>
              <div className="flex size-6 items-center justify-center rounded-md border bg-transparent">
                <Plus className="size-4" />
              </div>
              <div className="text-muted-foreground font-medium">Ajouter une organisation</div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
    <CreateWorkspaceModal open={open} onOpenChange={setOpen} canClose={true} />
    </>
  );
}