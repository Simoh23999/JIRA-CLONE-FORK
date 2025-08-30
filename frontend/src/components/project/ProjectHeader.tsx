import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import type { Project } from "@/types/project";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  MoreHorizontalIcon,
  PlusIcon,
  Forward,
  MoreHorizontal,
  Trash2,
  Share2,
  UserPlus,
  Edit2,
  Settings,
} from "lucide-react";
import { Separator } from "@radix-ui/react-separator";
import { ResponsiveModal } from "../ResponsiveModal";
import CreatProjectModal from "./create-project-modal";
import UpdateProjectForm from "./update-project-from";
import { useState } from "react";
import { ConfirmDeleteDialog } from "./ConfirmDeleteDialog";

interface Props {
  project: Project;
  progress: number;
  onEdit?: () => void;
  onDelete: (isopen:boolean,project:Project) => void;
  onAddTask: () => void;
}

export const ProjectHeader = ({
  project,
  progress,
  onEdit,
  onDelete,
  onAddTask,
}: Props) => {
  const [openFP, setOpenFP] = useState(false);
  const hanldleOpenProjectForm = (isOpen: boolean) => {
    setOpenFP(isOpen);
  };

  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 p-4 border-b border-gray-200 bg-white shadow-sm rounded-md">
      {/* Infos du projet */}
      <div className="flex flex-col max-w-lg">
        <h1 className="text-2xl font-semibold text-gray-900 truncate">
          {project.name}
        </h1>
        {project.description && (
          <p className="mt-1 text-sm text-gray-600 line-clamp-2">
            {project.description}
          </p>
        )}
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        {/* Avancement */}
        <div className="flex items-center gap-3 min-w-[140px]">
          <span className="text-sm font-medium text-gray-700 whitespace-nowrap">
            Avancement :
          </span>
          <Progress value={progress} className="h-3 w-32 rounded-full" />
          <span className="text-sm font-medium text-gray-700">{progress}%</span>
        </div>
        <div className="flex items-center gap-2">
          {/* Bouton Ajouter une tâche avec icône */}
          <Button
            className="whitespace-nowrap flex items-center gap-2"
            size="sm"
            onClick={onAddTask}
          >
            <PlusIcon className="w-4 h-4" />
            Ajouter une tâche
          </Button>

          {/* Dropdown Modifier / Supprimer avec icônes */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" aria-label="Plus d'actions">
                <MoreHorizontalIcon className="h-5 w-5 text-gray-600" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              side="bottom"
              align="end"
              className="min-w-[160px]"
            >
              <DropdownMenuItem
                className="cursor-pointer hover:bg-gray-100 flex items-center gap-2"
                onClick={() => hanldleOpenProjectForm(true)}
              >
                <Settings className="w-4 h-4 text-gray-600" />
                Modifier
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="cursor-pointer hover:bg-red-100 text-red-600 flex items-center gap-2"
                onClick={() => onDelete?.(true, project)}
              >
                <Trash2 className="w-4 h-4  text-red-600" />
                Supprimer
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Modal pour creation de projet */}

          <ResponsiveModal open={openFP} onOpenChange={hanldleOpenProjectForm}>
            <UpdateProjectForm
              project={project}
              onCancel={() => setOpenFP(false)}
              onSuccess={() => setOpenFP(false)}
            />
          </ResponsiveModal>
        </div>
      </div>
    </div>
  );
};
