"use client";

import BackButton from "@/components/back-button";
import { ProjectHeader } from "@/components/project/ProjectHeader";
import { ProjectTabs } from "@/components/project/ProjectTabs";
import { TaskColumn } from "@/components/task/TaskColumn";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { useGetProjectById } from "@/features/project/api/use-get-project";


import type { Project } from "@/types/project";
import { Key } from "lucide-react";
import { useParams } from "next/navigation";
import DashboardLoading from "../../loading";
import { date } from "zod";
import { id } from "zod/v4/locales";
import { useGetProjectMembers } from "@/features/project/api/use-get-project-members";
import ProjectDetails from "@/components/project/ProjectDetails";

const ProjectDetailsId = () => {

  // const { projects, loading, error } = useGetProjects(1);
  const param= useParams()
  const idP=Number(param.id)
  const { data: project, isLoading, error } = useGetProjectById(idP);
  const { data: members} = useGetProjectMembers(idP);

  console.log("error",error,project)
  if (isLoading) return <DashboardLoading></DashboardLoading>;
  if (error) return <p className="text-red-600">{error.message}</p>;
  

  const avancement = 10;

  const handleTaskClick = (taskId: string) => {
    

  };

  return (
    <div className="space-y-8">
      <BackButton />
      {project && <ProjectDetails project={project} member={members ?? []} />}
    </div>
  );
};

export default ProjectDetailsId;
