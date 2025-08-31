"use client";

import { Fragment, useEffect, useState } from "react";
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
import { DropdownMenuSeparator } from "@/app/ui/dropdown-menu";
import type { Project } from "@/types/project";
import type { ProjectMember } from "@/types/PRojectMember";
import { ResponsiveModal } from "../ResponsiveModal";
import AddMemberProjectForm from "../MemeberProject/Add-memberP-Form";
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
import { ConfirmDeleteDialog } from "./ConfirmDeleteDialog";
import { toast } from "sonner";
import { useUpdateMemberProjectRole } from "@/features/MembershipProject/api/use-update-role";
import { useDeleteMember } from "@/features/MembershipProject/api/use-delete-member";
import { useDeleteProject } from "@/features/project/api/use-delete-project";
import { useRouter } from "next/navigation";
import { useProjectAuthRole } from "@/hooks/useProjectAuthRole";
import { useGetProjectMembers } from "@/features/project/api/use-get-project-members";
import SprintPage from "@/components/sprint/sprintPage";
import ProjectSummary from "./ProjectSummary";
import { useGetTasksByProject } from "@/features/tasks/api/use-get-tasks2";
import { DragDropContext, DropResult } from "@hello-pangea/dnd";
import { Task } from "@/types/task";
import { useUpdateTaskStatus } from "@/features/tasks/api/use-updtae-status";
import CreateTaskForm from "../task/creat-task-form";
import { AssignTaskForm } from "../task/assign-task-form";
import { useDeleteTask } from "@/features/tasks/api/use-delete-task";
import UpdateTaskForm from "../task/update-task-form";
import { useGetTasksByTask } from "@/features/sprint/api/use-get-sprints";
import { SprintTimeline } from "../sprint/sprintimeline";
import { useGetSprintsByProjectId } from "@/features/sprint/api/use-get-sprints";

interface Props {
  project: Project;
  member: ProjectMember[];
}

const ProjectDetails = ({ project, member }: Props) => {
  const avancement = 10;
  const [openAdd, setOpenAdd] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedMemberId, setSelectedMemberId] = useState<string | number | null>(null);

  const updateMemberProjectRole = useUpdateMemberProjectRole();
  const { isProjectOwner, userProjectMembershipId } = useProjectAuthRole(project.id);

  const { data: tasks } = useGetTasksByTask(project.id);
  const { data: sprints, isLoading: sprintsLoading, error: sprintsError } = useGetSprintsByProjectId(project.id);
  
  const [taskState, setTaskState] = useState<Task[]>([]);
  const deleteTaskMutation = useDeleteTask(project.id);


  const { mutateAsync: deleteMember, isPending: loadingSupprime } = useDeleteMember();
  const { mutateAsync: deleteProject, isPending: loadingDelete } = useDeleteProject();
  const [openDeleteProject, setOpenDeleteProject] = useState(false);
  const [openDeleteTask, setOpenDeleteTask] = useState(false);
 
  const [openFT, hanldleOpenTaskForm] = useState(false);
  const [openTaskUpdate, hanldleOpenTaskFormUpdate] = useState(false);          
  const [openAssign, handleOpenAssignForm] = useState(false);
  const [taskid, setTaskid] = useState<number|string>(0);
  const router = useRouter();

  const updateTaskStatus = useUpdateTaskStatus(); 

  useEffect(() => {
    if (tasks) {
      setTaskState(tasks);
    }
  }, [tasks]);

  // 🔹 Gestion drag & drop
  const onDragEnd = async (result: DropResult) => {
    const { destination, source, draggableId } = result;
    if (!destination) return;

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    const movedTask = taskState.find((t) => t.id.toString() === draggableId);
    if (!movedTask) {
      console.warn("Task not found for draggableId:", draggableId);
      return;
    }

    const newStatus =
      destination.droppableId === "todo"
        ? "TODO"
        : destination.droppableId === "in_progress"
        ? "INPROGRESS"
        : "DONE";

    const updatedTask = { ...movedTask, status: newStatus as Task["status"] };
    const updatedTasks = taskState.map((t) =>
      t.id === movedTask.id ? updatedTask : t
    );

    // Mise à jour UI immédiate (optimistic update)
    setTaskState(updatedTasks);

    try {
      // Appel API pour persister le changement
      await updateTaskStatus.mutateAsync({ taskId: movedTask.id, newStatus });
    } catch (err: any) {
      toast.error(err.message || "Erreur lors de la mise à jour du statut");
      // rollback si erreur
      setTaskState(tasks || []);
    }
  };

  const handleTaskClick = (taskId: string | number) => {
    

  };

  const handleSetAsMember = (memberId: string | number) => {
    updateMemberProjectRole.mutate({
      projectMembershipId: memberId,
      newRole: "PROJECT_MEMBER",
    });
  };

  const handleSetAsAdmin = (memberId: string | number) => {
    updateMemberProjectRole.mutate({
      projectMembershipId: memberId,
      newRole: "PROJECT_OWNER",
    });
  };

  const openDeleteDialog = (memberId: string | number) => {
    setSelectedMemberId(memberId);
    setDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedMemberId) return;
    await deleteMember({ projectMembershipId: selectedMemberId });
  };

  const handleDeleteProject = async () => {
    try {
      await deleteProject({ projectId: project.id });
      router.back();
      setOpenDeleteProject(false);
    } catch {
      toast.error("Erreur lors de la suppression du projet");
    }
  };
  const openTaskAssignDialog = (taskid: number|string) => {
    setTaskid(taskid);
    handleOpenAssignForm(true);
  };

  function handleDeleteTask(taskId: number): void {
    setTaskid(taskId);
    setOpenDeleteTask(true);
  }

  function DeleteTaskfunction(): void {
    if (!taskid) return;
    deleteTaskMutation.mutate(taskid);
    setOpenDeleteTask(false);
  }

  function handleUpdateTask(taskId: number): void {
    setTaskid(taskId);
    hanldleOpenTaskFormUpdate(true);
  }

  return (
    <div className="space-y-8">
      <ProjectHeader
        project={project}
        progress={avancement}
        onDelete={() => setOpenDeleteProject(true)} onAddTask={()=>{hanldleOpenTaskForm(true)}}      />

      <Tabs defaultValue="toutes" className="w-full">
        <ProjectTabs />
      
         <TabsContent value="summary">
          <ProjectSummary tasks={taskState} />
        </TabsContent>

        {/* <TabsContent value="backlog">
          <TaskColumn
            title="Sprint"
            onTaskClick={handleTaskClick}
            isFullWidth
          />
        </TabsContent> */}

        <TabsContent value="Sprints">
          <SprintPage
            title="Sprint"
            isProjectOwner={isProjectOwner}
            onTaskClick={handleTaskClick}
            isFullWidth
          />
        </TabsContent>

        <TabsContent value="toutes">
          <DragDropContext onDragEnd={onDragEnd}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <TaskColumn
                droppableId="todo"
                onAddTask={() => hanldleOpenTaskForm(true)}
                title="À faire"
                tasks={taskState.filter((t) => t.status === "TODO")}
                onTaskClick={openTaskAssignDialog}

                setOpenAssign={openTaskAssignDialog}
                onDeleteTask={handleDeleteTask} 
                onEditTask={ handleUpdateTask}              />
              <TaskColumn
                droppableId="in_progress"
                title="En cours"
                tasks={taskState.filter((t) => t.status === "INPROGRESS")}
                onTaskClick={handleTaskClick}
                setOpenAssign={openTaskAssignDialog}
                onDeleteTask={handleDeleteTask} 
                onEditTask={handleUpdateTask }               />
              <TaskColumn
                droppableId="done"
                title="Terminée"
                tasks={taskState.filter((t) => t.status === "DONE")}
                onTaskClick={handleTaskClick}
                setOpenAssign={openTaskAssignDialog}
                onDeleteTask={handleDeleteTask} 
                onEditTask={handleUpdateTask }              />
            </div>
          </DragDropContext>
        </TabsContent>

        <TabsContent value="calendrier">
          {sprintsLoading ? (
            <div className="text-center text-muted-foreground py-8">Chargement du calendrier...</div>
          ) : sprintsError ? (
            <div className="text-center text-red-500 py-8">Erreur lors du chargement des sprints</div>
          ) : sprints && sprints.length > 0 ? (
            <SprintTimeline sprints={sprints} />
          ) : (
            <div className="text-center text-muted-foreground py-8">Aucun sprint trouvé pour ce projet.</div>
          )}
        </TabsContent>

        <TabsContent value="member">
          <div className="flex justify-end mb-4">
            {isProjectOwner && (
              <Button
                variant="ghost"
                className="flex items-center gap-2"
                onClick={() => setOpenAdd(true)}
              >
                <UserPlus className="w-4 h-4" /> Ajouter un membre
              </Button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {member.map((m) => (
              <Fragment key={m.membershipId}>
                <div
                  className="flex items-center gap-4 bg-[#F4F5F7] border border-[#DEEBFF] p-4 rounded-xl shadow-sm transition hover:shadow-md hover:bg-[#E3F2FD]"
                  style={{ minHeight: 80 }}
                >
                  <Avatar className="h-12 w-12 border-2 border-[#0052CC] shadow">
                    <AvatarImage src={m.avatarUrl} />
                    <AvatarFallback className="bg-[#DEEBFF] text-[#0052CC] font-bold">
                      {m.fullName?.[0] || "M"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col flex-1">
                    <div className="flex items-center gap-2">
                      <p className="text-base font-semibold text-[#172B4D]">{m.fullName}</p>
                      {m.roleInProject === "PROJECT_OWNER" ? (
                        <UserCog className="w-4 h-4 text-[#0052CC]">
                          <title>Admin</title>
                        </UserCog>
                      ) : (
                        <User className="w-4 h-4 text-[#36B37E]" >
                        <title>Membre</title>
                        </User>

                      )}
                    </div>
                    <p className="text-xs font-medium text-[#5E6C84] mt-1">
                      {m.roleInProject === "PROJECT_OWNER" ? "Admin du projet" : "Membre"}
                    </p>
                  </div>

                  {isProjectOwner && m.id != userProjectMembershipId && (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button className="ml-auto" variant="secondary" size="icon">
                          <MoreVerticalIcon className="size-4 text-muted-foreground" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent side="bottom" align="end">
                        {m.roleInProject === "PROJECT_MEMBER" && (
                          <DropdownMenuItem onClick={() => handleSetAsAdmin(m.id)}>
                            <UserCog className="w-4 h-4 mr-2" />
                            Définir comme Admin
                          </DropdownMenuItem>
                        )}
                        {m.roleInProject === "PROJECT_OWNER" && (
                          <DropdownMenuItem onClick={() => handleSetAsMember(m.id)}>
                            <User className="w-4 h-4 mr-2" />
                            Définir comme Membre
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          variant="destructive"
                          onClick={() => openDeleteDialog(m.id)}
                        >
                          <Trash2 className="w-4 h-4 text-red-600" />
                          Supprimer
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}
                </div>
              </Fragment>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Suppression d'un membre */}
      <ConfirmDeleteDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onConfirm={handleDeleteConfirm}
        loading={loadingSupprime}
        title="Confirmer la suppression"
        description="Êtes-vous sûr de vouloir supprimer ce membre ? Cette action est irréversible."
      />

      {/* Suppression du projet */}
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

      {/* Suppression de tâche avec confirmation */}
            <ConfirmDeleteDialog
              open={openDeleteTask}
              onOpenChange={setOpenDeleteTask}
              onConfirm={DeleteTaskfunction}
              loading={false}
              title="Confirmer la suppression de la tâche"
              description="Êtes-vous sûr de vouloir supprimer cette tâche ? Cette action est irréversible."
            />

      {/* Ajout de membre */}
      <ResponsiveModal open={openAdd} onOpenChange={setOpenAdd}>
        <AddMemberProjectForm
          projectId={project.id}
          onCancel={() => setOpenAdd(false)}
          onSuccess={() => setOpenAdd(false)}
          project={project}
        />
      </ResponsiveModal>


       {/* Modal pour creation de task */}
      
            <ResponsiveModal open={openFT} onOpenChange={hanldleOpenTaskForm}>
                  <CreateTaskForm projectId={project.id} onCancel={()=> hanldleOpenTaskForm(false) } />
            </ResponsiveModal>

      
      {/* Modal pour modefication de task */}
            <ResponsiveModal open={openTaskUpdate} onOpenChange={hanldleOpenTaskFormUpdate}>
             <UpdateTaskForm task={taskState.find(t => t.id === taskid)!} onCancel={()=> hanldleOpenTaskFormUpdate(false)} />
            </ResponsiveModal>


       {/* Modal pour asignemet de task */}
      
            <ResponsiveModal open={openAssign} onOpenChange={handleOpenAssignForm}>
                 <AssignTaskForm taskId={taskid} members={member} oncancel={()=> handleOpenAssignForm(false)}  />
            </ResponsiveModal>
    </div>
  );
};

export default ProjectDetails;
