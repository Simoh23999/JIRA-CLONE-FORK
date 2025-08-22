"use client";

import { Fragment, useState } from "react";
import { ProjectHeader } from "@/components/project/ProjectHeader";
import { ProjectTabs } from "@/components/project/ProjectTabs";
import { TaskColumn } from "@/components/task/TaskColumn";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Loader,
  MoreVerticalIcon,
  PlusIcon,
  Trash2,
  User,
  UserCog,
  UserPlus,
} from "lucide-react";
import type { Project } from "@/types/project";
import type { ProjectMember } from "@/types/PRojectMember";
import { ResponsiveModal } from "../ResponsiveModal";
import AddMemberProjectForm from "../MemeberProject/Add-memberP-Form";
import { DropdownMenuSeparator } from "@/app/ui/dropdown-menu";
import {
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialog,
  AlertDialogContent,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogCancel,
  AlertDialogAction,
} from "../ui/alert-dialog";
import { toast } from "sonner";
import { useUpdateMemberProjectRole } from "@/features/MembershipProject/api/use-update-role";
import { useDeleteMember } from "@/features/MembershipProject/api/use-delete-member";
import { ConfirmDeleteDialog } from "./ConfirmDeleteDialog";
import { useDeleteProject } from "@/features/project/api/use-delete-project";
import { useRouter } from "next/navigation";
import { useProjectAuthRole } from "@/hooks/useProjectAuthRole";
import { useGetProjectMembers } from "@/features/project/api/use-get-project-members";
import SprintPage from "@/components/sprint/sprintPage";

interface Props {
  project: Project;
  member: ProjectMember[];
}

const ProjectDetails = ({ project, member }: Props) => {
  const avancement = 10;
  const [openAdd, setOpenAdd] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedMemberId, setSelectedMemberId] = useState<
    string | number | null
  >(null);
  const updateMemberProjectRole = useUpdateMemberProjectRole();
  const { isProjectOwner, isProjectMember, userProjectMembershipId } =
    useProjectAuthRole(project.id);

  const router = useRouter();

  const handleAddMemberProject = (isOpen: boolean) => {
    setOpenAdd(isOpen);
  };
  const handleTaskClick = (taskId: string) => {};

  const openDeleteDialog = (memberId: string | number) => {
    setSelectedMemberId(memberId);
    setDialogOpen(true);
  };

  function handleSetAsMember(memberId: string | number): void {
    updateMemberProjectRole.mutate({
      projectMembershipId: memberId,
      newRole: "PROJECT_MEMBER",
    });
  }

  function handleSetAsAdmin(memberId: string | number) {
    updateMemberProjectRole.mutate({
      projectMembershipId: memberId,
      newRole: "PROJECT_OWNER",
    });
  }
  // const deleteMember = useDeleteMember();
  // const isPending=false;
  const { mutateAsync: deleteMember, isPending: loadingSupprime } =
    useDeleteMember();

  const [openDeleteProject, setOpenDeleteProject] = useState(false);
  const { mutateAsync: deleteProject, isPending: loadingDelete } =
    useDeleteProject();

  const handleDeleteConfirm = async () => {
    if (!selectedMemberId) return;
    await deleteMember({ projectMembershipId: selectedMemberId });
    // deleteMember.mutate(
    //   { projectMembershipId: selectedMemberId }
    // );
  };

  const openDeleteDialogProject = (isOpen: boolean, project: Project) => {
    setOpenDeleteProject(isOpen);
  };

  const handleDeleteProject = async () => {
    try {
      const res = await deleteProject({
        projectId: project?.id!,
      });
      router.back();
      setOpenDeleteProject(false);
    } catch (error) {
      toast.error("Erreur lors de la suppression du projet");
    }
  };

  return (
    <div className="space-y-8">
      <ProjectHeader
        project={project}
        progress={avancement}
        onDelete={(isOpen: boolean, proj: Project) =>
          openDeleteDialogProject(isOpen, project)
        }
      />
      <Tabs defaultValue="toutes" className="w-full">
        <ProjectTabs />

        <TabsContent value="backlog">
          <TaskColumn
            title="Sprint"
            onTaskClick={handleTaskClick}
            isFullWidth
          />
        </TabsContent>

        <TabsContent value="Sprints">
          <SprintPage
            title="Sprint"
            onTaskClick={handleTaskClick}
            isFullWidth
          />
        </TabsContent>

        <TabsContent value="toutes">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <TaskColumn title="À faire" onTaskClick={handleTaskClick} />
            <TaskColumn title="En cours" onTaskClick={handleTaskClick} />
            <TaskColumn title="Terminée" onTaskClick={handleTaskClick} />
          </div>
        </TabsContent>

        <TabsContent value="calendrier">
          <TaskColumn
            title="À venir"
            onTaskClick={handleTaskClick}
            isFullWidth
          />
        </TabsContent>

        <TabsContent value="member">
          {/* Bouton aligné à droite */}
          <div className="flex justify-end mb-4">
            {isProjectOwner && (
              <Button
                variant="ghost"
                className="flex items-center gap-2"
                onClick={() => handleAddMemberProject(true)}
              >
                <UserPlus className="w-4 h-4" /> Ajouter un membre
              </Button>
            )}
          </div>

          {/* <div>
          {isProjectOwner && <p>Vous êtes Project Owner</p>}
          {isProjectMember && !isProjectOwner && <p>Vous êtes Project Member</p>}
          <p>ID Membership: {userProjectMembershipId}</p>
        </div> */}

          {/* Liste des membres */}
          {member.map((m) => (
            <Fragment key={m.membershipId}>
              <div className="flex items-center gap-3 border p-3 rounded-lg shadow-sm">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={m.avatarUrl} />
                  <AvatarFallback>{m.fullName?.[0] || "M"}</AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <p className="text-sm font-medium">{m.fullName}</p>
                  <p className="text-muted-foreground text-xs">
                    {m.roleInProject || "Membre"}
                  </p>
                </div>
                {isProjectOwner && m.id != userProjectMembershipId && (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        className="ml-auto"
                        variant="secondary"
                        size="icon"
                      >
                        <MoreVerticalIcon className="size-4 text-muted-foreground" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent side="bottom" align="end">
                      {m.roleInProject === "PROJECT_MEMBER" && (
                        <DropdownMenuItem
                          onClick={() => handleSetAsAdmin(m.id)}
                        >
                          <UserCog className="w-4 h-4 mr-2" />
                          Définir comme Admin
                        </DropdownMenuItem>
                      )}
                      {m.roleInProject === "PROJECT_OWNER" && (
                        <DropdownMenuItem
                          onClick={() => handleSetAsMember(m.id)}
                        >
                          <User className="w-4 h-4 mr-2" />
                          Définir comme Membre
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        variant="destructive"
                        onClick={() => openDeleteDialog(m.id)}
                      >
                        <Trash2 className="w-4 h-4  text-red-600" />
                        Supprimer
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
              </div>
            </Fragment>
          ))}
        </TabsContent>
      </Tabs>

      {/* AlertDialog pour confirmation suppression de members */}

      <ConfirmDeleteDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onConfirm={handleDeleteConfirm}
        loading={loadingSupprime}
        title="Confirmer la suppression"
        description="Êtes-vous sûr de vouloir supprimer ce membre ? Cette action est irréversible."
      />

      {/*AlertDialog pour confirmation suppression du projet*/}
      <ConfirmDeleteDialog
        open={openDeleteProject}
        onOpenChange={setOpenDeleteProject}
        onConfirm={handleDeleteProject}
        loading={loadingDelete}
        title={
          <span>
            Supprimer le projet{" "}
            <span className="text-red-600 font-semibold">{project.name}</span>
          </span>
        }
        description="Êtes-vous sûr de vouloir supprimer ce projet ? Cette action supprimera aussi toutes les tâches et membres associés."
      />

      {/* formulaire de ajoute member projet */}
      <ResponsiveModal open={openAdd} onOpenChange={setOpenAdd}>
        <AddMemberProjectForm
          projectId={project.id}
          onCancel={() => setOpenAdd(false)}
          onSuccess={() => setOpenAdd(false)}
          project={project}
        />
      </ResponsiveModal>
    </div>
  );
};

export default ProjectDetails;
