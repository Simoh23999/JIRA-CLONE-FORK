"use client";

import {
  Folder,
  Forward,
  MoreHorizontal,
  Trash2,
  Share2,
  UserPlus,
  type LucideIcon,
  Loader,
} from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import Link from "next/link";
import { ResponsiveModal } from "./ResponsiveModal";
import AddMemberProjectForm from "./MemeberProject/Add-memberP-Form";
import { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "./ui/alert-dialog";
import { useDeleteMember } from "@/features/MembershipProject/api/use-delete-member";
import { ConfirmDeleteDialog } from "./project/ConfirmDeleteDialog";
import { toast } from "sonner";
import { useDeleteProject } from "@/features/project/api/use-delete-project";
import { Project } from "@/types/project";

export function NavProjects({
  projects,
}: {
  projects: {
    icon: any;
    id: number;
    name: string;
    description: string;
    organizationId: number;
    createdByMembershipId: number;
    createdAt: string;
    updatedAt: string;
    status: string;
    url: string;
  }[];
}) {
  const { isMobile } = useSidebar();
  const [openAdd, setOpenAdd] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project>();

  const handleAddMemberProject = (isOpen: boolean, project: Project) => {
    setSelectedProject(project);
    setOpenAdd(isOpen);
  };

  const openDeleteDialog = (isOpen: boolean, project: Project) => {
    setSelectedProject(project);
    setOpenDeleteProject(isOpen);
  };

  const [openDeleteProject, setOpenDeleteProject] = useState(false);
  const { mutateAsync: deleteProject, isPending: loadingDelete } =
    useDeleteProject();

  const handleDeleteProject = async () => {
    try {
      await deleteProject({
        projectId: selectedProject?.id!,
      });
      setOpenDeleteProject(false);
    } catch (error) {
      toast.error("Erreur lors de la suppression du projet");
    }
  };

  return (
    <>
      <SidebarGroup className="group-data-[collapsible=icon]:hidden">
        <SidebarGroupLabel>Projects</SidebarGroupLabel>
        <SidebarMenu>
          {projects.map((item) => (
            <SidebarMenuItem key={item.name}>
              <SidebarMenuButton asChild>
                <a href={item.url}>
                  <item.icon />
                  <span>{item.name}</span>
                </a>
              </SidebarMenuButton>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <SidebarMenuAction showOnHover>
                    <MoreHorizontal />
                    <span className="sr-only">More</span>
                  </SidebarMenuAction>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  className="w-48 rounded-lg"
                  side={isMobile ? "bottom" : "right"}
                  align={isMobile ? "end" : "start"}
                >
                  <Link href={`/dashboard/projects/${item.id}`}>
                    <DropdownMenuItem>
                      <Folder className="text-muted-foreground" />
                      <span>View Project</span>
                    </DropdownMenuItem>
                  </Link>
                  <DropdownMenuItem>
                    <Share2 className="text-muted-foreground" />
                    <span>Share Project</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => {
                      handleAddMemberProject(true, item);
                    }}
                  >
                    <UserPlus className="text-muted-foreground" />
                    <span>Invite Members</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    variant="destructive"
                    onClick={() => openDeleteDialog(true, item)}
                  >
                    <Trash2 className="text-muted-foreground" />
                    <span>Delete Project</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </SidebarMenuItem>
          ))}
          <SidebarMenuItem>
            <SidebarMenuButton className="text-sidebar-foreground/70">
              <MoreHorizontal className="text-sidebar-foreground/70" />
              <span>More</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarGroup>

      {/* formulaire de ajoute member projet */}
      <ResponsiveModal open={openAdd} onOpenChange={setOpenAdd}>
        <AddMemberProjectForm
          projectId={selectedProject?.id!}
          onCancel={() => setOpenAdd(false)}
          onSuccess={() => setOpenAdd(false)}
          project={selectedProject!}
        />
      </ResponsiveModal>

      {/*supprimer un projet*/}
      <ConfirmDeleteDialog
        open={openDeleteProject}
        onOpenChange={setOpenDeleteProject}
        onConfirm={handleDeleteProject}
        loading={loadingDelete}
        title={
          <span>
            Supprimer le projet{" "}
            <span className="text-red-600 font-semibold">
              {selectedProject?.name}
            </span>
          </span>
        }
        description="Êtes-vous sûr de vouloir supprimer ce projet ? Cette action supprimera aussi toutes les tâches et membres associés."
      />
    </>
  );
}
