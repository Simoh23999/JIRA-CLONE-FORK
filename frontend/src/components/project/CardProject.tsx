import type { Project } from "@/types/project";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Progress } from "../ui/progress";
import { format } from "date-fns";
import { CalendarDays } from "lucide-react";
import Link from "next/link";

interface ProjectCardProps {
  project: Project;
  progress: number;
  workspaceId: number | string;
}

export const ProjectCard = ({ project, workspaceId }: ProjectCardProps) => {
  const Progressv = 10;
  return (
    //106/project/1
    <Link
      href={`/dashboard/organisations/${workspaceId}/project/${project.id}`}
    >
      <Card className="transition-all duration-300 hover:shadow-md hover:translate-y-1">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>{project.name}</CardTitle>
            <span className="text-xs rounded-full">{project.status}</span>
          </div>
          <CardDescription className="line-clamp-2">
            {project.description || "No description"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span>Progress</span>
                <span>{Progressv}%</span>
              </div>

              <Progress value={Progressv} className="h-2" />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center text-sm gap-2 text-muted-foreground">
                <span>{12}</span>
                <span>Tasks</span>
              </div>

              {project.createdAt && (
                <div className="flex items-center text-xs text-muted-foreground">
                  <CalendarDays className="w-4 h-4" />
                  <span>{format(project.createdAt, "MMM d, yyyy")}</span>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};
