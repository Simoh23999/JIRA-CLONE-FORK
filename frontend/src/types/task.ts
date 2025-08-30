// TaskPriority
export type TaskPriority = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";

// TaskStatus
export type TaskStatus = "TODO" | "INPROGRESS" | "DONE";

// Comment lié à une tâche
export interface Comment {
  id: number;
  taskId: number;
  projectMembershipId: number;
  content: string;
  createdAt: string; // ISO string
  updatedAt: string; // ISO string
}

// Task
export interface Task {
  id: number;
  title: string;
  description: string;
  projectId: number | string;
  sprintId?: number | string ;
  assignedToProjectMembershipId?: number | string | null;
  createdByProjectMembershipId: number;
  status: TaskStatus;
  priority?: TaskPriority;
  dueDate?: string | null; // ISO string
  orderInColumn?: number;
  storyPoints?: number;
  createdAt: string;
  updatedAt: string;
  comments?: Comment[];
}
