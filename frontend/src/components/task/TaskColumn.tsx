import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

interface TaskColumnProps {
  title: string;
  onTaskClick: (taskId: string) => void;
  isFullWidth?: boolean;
}

export const TaskColumn = ({
  title,
  onTaskClick,
  isFullWidth = false,
}: TaskColumnProps) => {
  const tasks: string[] = []; // Tu peux remplacer par une vraie liste plus tard

  return (
    <div
      className={cn(
        isFullWidth
          ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
          : "",
      )}
    >
      <div
        className={cn(
          "space-y-4",
          isFullWidth ? "col-span-full mb-4" : "h-full",
        )}
      >
        {!isFullWidth && (
          <div className="flex items-center justify-between">
            <h2 className="font-medium">{title}</h2>
            <Badge variant="outline">{tasks.length}</Badge>
          </div>
        )}

        <div
          className={cn(
            "space-y-3",
            isFullWidth && "grid grid-cols-2 lg:grid-cols-3 gap-4",
          )}
        >
          {tasks.length === 0 ? (
            <div className="text-center text-sm text-muted-foreground">
              Aucune tâche pour « {title} »
            </div>
          ) : (
            tasks.map((task, index) => (
              <div
                key={index}
                className="p-3 border rounded shadow-sm cursor-pointer hover:bg-muted"
                onClick={() => onTaskClick(task)}
              >
                {task}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
