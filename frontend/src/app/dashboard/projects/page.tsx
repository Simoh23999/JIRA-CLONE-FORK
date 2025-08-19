"use client"
import { Button } from "@/app/ui/button";
import { ProjectCard } from "@/components/project/CardProject";
import CreatProjectModal from "@/components/project/create-project-modal";
import { useGetProjects } from "@/features/project/api/use-get-project";
import { Project } from "@/types/project";
import { Plus } from "lucide-react";
import { useState } from "react";

export default function ProjectsPage() {
  const workspaceId = "87"; // à remplacer dynamiquement si besoin

  const [open, setOpen] = useState(false);
  // Exemple de données fictives
 const { data:projects, loading, error } = useGetProjects(workspaceId);
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Projets</h1>

       <Button
          variant="outline"
          size="sm"
          className="flex items-center gap-1 font-medium rounded-md shadow-sm transition-all"
          onClick={() => setOpen(true)}
        >
          <Plus className="w-4 h-4" />
          <span className="text-sm">Créer</span>
        </Button>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects && projects.map((project) => (
          <ProjectCard
            key={project.id}
            project={project}
            workspaceId={workspaceId}
            progress={20} // à adapter si tu veux un vrai calcul
          />
        ))}
      </div>
          <CreatProjectModal open={open} onOpenChange={setOpen} canClose={true} orgid={workspaceId} />
    </div>
  );
}
