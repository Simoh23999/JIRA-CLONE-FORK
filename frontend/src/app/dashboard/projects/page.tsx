"use client";

import { useOrganization } from "@/app/context/OrganizationContext";
import { Button } from "@/app/ui/button";
import { ProjectCard } from "@/components/project/CardProject";
import CreatProjectModal from "@/components/project/create-project-modal";
import { useGetProjects } from "@/features/project/api/use-get-project";
import { useGetOrganizationMembers } from "@/features/workspaces/api/use-get-workspace";
import { useAuthRole } from "@/hooks/useAuthRole";
import { Plus } from "lucide-react";
import { useState } from "react";

export default function ProjectsPage() {
  const { organization } = useOrganization();
  const workspaceId = organization?.id;

  const [open, setOpen] = useState(false);
  const { data: members} = useGetOrganizationMembers(workspaceId!);

   const { isAdminOrOwner, isMember, userId } = useAuthRole(members);
  // Hook pour récupérer les projets du workspace
  const { data: projects, isLoading, isError, error } = useGetProjects(workspaceId!);

  // Ici tu peux définir si l'utilisateur peut créer des projets
  // Exemple : si l'utilisateur est admin ou owner de l'organisation


  const handleOpenProjectForm = (value: boolean) => {
    setOpen(value);
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Projets</h1>

      {projects && projects.length > 0 && isAdminOrOwner && (
        <Button
          variant="outline"
          size="sm"
          className="flex items-center gap-1 font-medium rounded-md shadow-sm transition-all"
          onClick={() => handleOpenProjectForm(true)}
        >
          <Plus className="w-4 h-4" />
          <span className="text-sm">Créer</span>
        </Button>
      )}

      {isLoading ? (
        <p>Chargement des projets...</p>
      ) : isError ? (
        <p className="text-red-500">{error?.message || "Erreur lors du chargement des projets"}</p>
      ) : projects && projects.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              workspaceId={workspaceId!}
              progress={20} // à adapter selon le vrai calcul
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-64 border-2 border-[#1D71B8] rounded-xl p-6 shadow-md">
          <svg
            className="w-24 h-24 text-[#1D71B8] mb-4 animate-pulse"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect x="3" y="3" width="8" height="8" rx="1.5" />
            <rect x="13" y="3" width="8" height="8" rx="1.5" />
            <rect x="3" y="13" width="8" height="8" rx="1.5" />
            <rect x="13" y="13" width="8" height="8" rx="1.5" />
          </svg>
          <h3 className="text-2xl font-bold text-[#142D5C] mb-2 animate-pulse">Aucun projet</h3>
          <p className="text-sm text-[#1D71B8] text-center mb-4">
            Vous n'avez encore aucun projet dans cet espace de travail.
          </p>
  {isMember && ( <p className="text-sm text-gray-500 mb-4">
            Contactez un administrateur pour créer un projet. </p>)}
          {isAdminOrOwner && (
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-1 font-medium rounded-md shadow-sm transition-all"
              onClick={() => handleOpenProjectForm(true)}
            >
              <Plus className="w-4 h-4" />
              <span className="text-sm">Créer</span>
            </Button>
          )}
        </div>
      )}

      <CreatProjectModal open={open} onOpenChange={handleOpenProjectForm} canClose={true} orgid={workspaceId!} />
    </div>
  );
}
