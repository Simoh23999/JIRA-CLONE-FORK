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
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "./ui/alert-dialog";
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
  url:string;
  }[];
}) {
  const { isMobile } = useSidebar();
  const [openAdd,setOpenAdd] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project>();
  


  const handleAddMemberProject= (isOpen: boolean,project:Project)=>{
    setSelectedProject(project)
    setOpenAdd(isOpen);
  };

   const openDeleteDialog = (isOpen:boolean,project: Project) => {
    setSelectedProject(project);
    setOpenDeleteProject(isOpen)
  };


  const [openDeleteProject, setOpenDeleteProject] = useState(false);
  const { mutateAsync: deleteProject, isPending: loadingDelete } = useDeleteProject();
  
const handleDeleteProject = async () => {
  try {
    await deleteProject({
      projectId: selectedProject?.id! });
    setOpenDeleteProject(false);
  } catch (error) {
    toast.error("Erreur lors de la suppression du projet");
  }
};

  return (
    <>
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel>Projects</SidebarGroupLabel>
      {projects.length === 0 && (
        <div className="p-4 text-sm text-gray-500 italic">
          Aucun projet disponible
        </div>)}  
      <SidebarMenu>
        {projects.map((item) => (
          <SidebarMenuItem key={item.name}>
            <SidebarMenuButton asChild>
              <a href={item.url}>
                 {/* <div className="relative flex size-6 items-center justify-center rounded-md border border-[#2563eb]/20 bg-gradient-to-br from-[#1e3a8a] to-[#0ea5e9] overflow-hidden"> */}
                  <div className="relative flex size-6 items-center justify-center rounded-md border border-[#2563eb]/20 bg-[#0ea5e9] overflow-hidden">
                  {/* Effet de brillance */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent"></div>
                    <span className="font-semibold text-xs text-white relative z-10 drop-shadow-sm">
                      {item.name.charAt(0).toUpperCase()}
                    </span>
                </div>
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
                  <span>Voir le projet</span>
                </DropdownMenuItem>
                </Link>
                <DropdownMenuItem>
                  <Share2 className="text-muted-foreground" />
                  <span>Partager le projet</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={()=>{handleAddMemberProject(true,item)}}>
                <UserPlus className="text-muted-foreground" />
                  <span>Inviter des membres</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem variant="destructive" onClick={() => openDeleteDialog(true,item)}>
                  <Trash2 className="text-muted-foreground" />
                  <span>Supprimer le projet</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        ))}
        {/* <SidebarMenuItem>
          <SidebarMenuButton className="text-sidebar-foreground/70">
            <MoreHorizontal className="text-sidebar-foreground/70" />
            <span>More</span>
          </SidebarMenuButton>
        </SidebarMenuItem> */}
      </SidebarMenu>
    </SidebarGroup>
       
       
{/* formulaire de ajoute member projet */}
   <ResponsiveModal open={openAdd} onOpenChange={setOpenAdd}>
    <AddMemberProjectForm
          projectId={selectedProject?.id!}
          onCancel={() => setOpenAdd(false)}
          onSuccess={() => setOpenAdd(false)} project={selectedProject!} />
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
