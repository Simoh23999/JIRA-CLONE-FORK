import { Draggable, Droppable } from "@hello-pangea/dnd";
import TaskCard from "./TaskCard";
import { Task } from "@/types/task";
import { Badge } from "@/components/ui/badge";
import { Button } from "../ui/button";
import { PlusIcon } from "lucide-react";
import { useUpdateTaskStatus } from "@/features/tasks/api/use-updtae-status";

interface TaskColumnProps {
  title: string;
  tasks: Task[];
  onTaskClick: (taskId: string | number) => void;
  onAddTask?: () => void;
  onDeleteTask: (taskId: number) => void;
  setOpenAssign: (taskid:number|string,open: boolean) => void;
  onEditTask: (taskId: number) => void;
  droppableId: string;
}

export const TaskColumn = ({ title, tasks, droppableId,onEditTask, onTaskClick,onDeleteTask,setOpenAssign ,onAddTask }: TaskColumnProps) => {


 const updateTaskStatus = useUpdateTaskStatus();

  function onChangeStatus(taskId: number | string, status: Task["status"]) {
    updateTaskStatus.mutate({ taskId, newStatus: status });
  }

  return (
    <div className="space-y-4 p-3 border rounded-lg shadow-sm bg-white">
      <div className="flex items-center justify-between">
        <h2 className="font-medium">{title}</h2>
        <Badge variant="outline">{tasks.length}</Badge>
      </div>

      <Droppable droppableId={droppableId}>
        {(provided) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className="space-y-3 min-h-[100px]"
          >
            {droppableId === "todo" && (
              <Button
                  variant={"ghost"}
                  className="whitespace-nowrap flex items-center gap-2"
                  size="sm"
                  onClick={onAddTask}
                >
                <PlusIcon className="w-4 h-4" />
                Ajouter une tâche
              </Button>
            )}
            {tasks.length === 0 ? (
              <div className="text-center text-sm text-muted-foreground p-4 border rounded-lg">
                Aucune tâche
              </div>
            ) : (
              tasks.map((task, index) => (
                <Draggable key={task.id.toString()} draggableId={task.id.toString()} index={index}>
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                  
                    >
                      <TaskCard task={task} onClick={function (id: number): void {
                        confirm("Function not implemented.");
                      } }
                      onStatusChange={onChangeStatus}
                      onAssign={setOpenAssign}

                      onDelete={onDeleteTask} onEdit={onEditTask }                      />
                    </div>
                  )}
                </Draggable>
              ))
            )}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
};
