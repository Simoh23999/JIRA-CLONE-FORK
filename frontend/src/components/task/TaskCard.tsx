"use client";

import { Task } from "@/types/task";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  CalendarIcon,
  EllipsisVerticalIcon,
  UserIcon,
  Edit,
  Trash2,
  Share2,
  Icon,
  IceCream,
  RedoIcon,
  CheckCircle,
  Loader,
  Clock,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuPortal,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
} from "@/components/ui/dropdown-menu";
import { useGetProjectMembers } from "@/features/project/api/use-get-project-members";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";


interface TaskCardProps {
  task: Task;
  onClick?: (id: number) => void;
  onStatusChange: (taskId: number, status: Task["status"]) => void;
  onEdit: (taskId: number) => void;
  onDelete: (taskId: number) => void;
  onAssign: (taskId: number,openAssign:boolean) => void;
}

export default function TaskCard({
  task,
  onClick,
  onStatusChange,
  onEdit,
  onDelete,
  onAssign,
}: TaskCardProps) {
  const statusColors: Record<Task["status"], string> = {
    TODO: "bg-[#0A66C2]/20 text-[#0A66C2]",
    INPROGRESS: "bg-[#1E3A8A]/20 text-[#1E3A8A]",
    DONE: "bg-green-100 text-green-700",
  };
  const { data: members} = useGetProjectMembers(task.projectId);
  const assigendUser =members?.filter(m=>m.id===task.assignedToProjectMembershipId)
  return (
    <Card
      className="cursor-pointer hover:shadow-md transition border border-gray-200 rounded-xl bg-white"
    >
      {/* Header */}
      <CardHeader className="flex flex-row items-start justify-between space-y-0 p-3">
        <div className="flex flex-col"  onClick={() => (onEdit(task.id))}>
          <CardTitle className="text-base font-semibold text-gray-800">
            {task.title}
          </CardTitle>
          {task.description && (
            <p className="text-sm text-gray-500 line-clamp-2 mt-1">
              {task.description}
            </p>
          )}
        </div>

        {/* Menu ... */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="p-1 rounded-full hover:bg-gray-100">
              <EllipsisVerticalIcon className="w-5 h-5 text-gray-500" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-44">

            {/* Edit */}

                <DropdownMenuItem onClick={() => (onEdit(task.id))}>
                  <Edit className="w-4 h-4 mr-2" /> Modifier
                </DropdownMenuItem>

            {/* Assign */}
            
                <DropdownMenuItem onClick={() => (onAssign && onAssign(task.id,true))}>
                  <UserIcon className="w-4 h-4 mr-2" /> Assigner
                </DropdownMenuItem>
              
            {/* Change status */}
           
                {/* Change status */}

         <DropdownMenuSub>
      <DropdownMenuSubTrigger className="flex items-center gap-2">
        <Loader className="w-4 h-4 text-muted-foreground" />
        <span>Changer statut</span>
      </DropdownMenuSubTrigger>
      <DropdownMenuPortal>
        <DropdownMenuSubContent className="w-40">
          <DropdownMenuItem
            onClick={() => onStatusChange(task.id, "TODO")}
            className="flex items-center gap-2 text-blue-600"
          >
            <Clock className="w-4 h-4" />
            <span>À faire</span>
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => onStatusChange(task.id, "INPROGRESS")}
            className="flex items-center gap-2 text-yellow-600"
          >
            <Loader className="w-4 h-4 animate-spin-slow" />
            <span>En cours</span>
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => onStatusChange(task.id, "DONE")}
            className="flex items-center gap-2 text-green-600"
          >
            <CheckCircle className="w-4 h-4" />
            <span>Terminé</span>
          </DropdownMenuItem>
        </DropdownMenuSubContent>
      </DropdownMenuPortal>
    </DropdownMenuSub>

        

            {/* Delete */}
                <DropdownMenuSeparator />
                <DropdownMenuItem variant="destructive" onClick={() => (onDelete ? onDelete(task.id) : null)}>
                  <Trash2 className="w-4 h-4 mr-2 text-red-600" /> Supprimer
                </DropdownMenuItem>

          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>

      {/* Footer */}
      <CardContent className="flex justify-between items-center px-3 pb-3 text-xs text-gray-600">
        <div className="flex items-center gap-2">
          {assigendUser && assigendUser.length > 0 ? (
            assigendUser.map((member, index) => (
              <div key={member.id} className="flex flex-row items-center cursor-pointer">
                  <Avatar
                    className="h-9 w-9 border-2 border-white ring-1 ring-gray-200 hover:z-10 hover:ring-2 hover:ring-[#417fc5] transition-all duration-200"
                    title={member.fullName}
                    style={{ zIndex: assigendUser.length - index }}
                  >
                    <AvatarImage
                      src={member.avatarUrl}
                      alt={member.fullName}
                      className="object-cover"
                    />
                    <AvatarFallback className="text-xs bg-gradient-to-br from-[#4684b3] to-[#417fc5] text-white">
                      {member.fullName.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-xs font-medium text-gray-700 p-4 mt-1 text-center">
                    {member.fullName}
                  </span>
                </div>


            ))
          ) : (
            <span>Non assigné</span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {task.dueDate && (
            <div className="flex items-center gap-1">
              <CalendarIcon className="w-4 h-4 text-gray-400" />
              <span>{new Date(task.dueDate).toLocaleDateString()}</span>
            </div>
          )}
          <Badge className={statusColors[task.status]}>{task.status}</Badge>
        </div>
      </CardContent>

    </Card>
  );
}
