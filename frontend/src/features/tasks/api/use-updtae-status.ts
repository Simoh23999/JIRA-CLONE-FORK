import { Task } from "@/types/task";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";

const baseURL = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:9090";


export function useUpdateTaskStatus() {
  const queryClient = useQueryClient();

  return useMutation<Task, Error, { taskId: number|string; newStatus: Task["status"] }>({
    mutationFn: async ({ taskId, newStatus }) => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.put(
          `${baseURL}/api/tasks/${taskId}/status?newStatus=${newStatus}`,
          {},
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        return response.data;
      } catch (err) {
        const axiosErr = err as AxiosError<{ message?: string }>;
        const msg =
          axiosErr.response?.data?.message ||
          axiosErr.message ||
          "Une erreur est survenue lors de la mise à jour du statut.";
        throw new Error(msg);
      }
    },
    onSuccess: (_, { taskId }) => {
      queryClient.invalidateQueries({ queryKey: ["tasks", taskId] });
      queryClient.invalidateQueries({ queryKey: ["tasks", "project"] });
      queryClient.invalidateQueries({ queryKey:  ["sprints", "project"] });
    },
  });
}

// Convenience hooks for specific status updates
export function useMarkTaskInProgress() {
  const updateTaskStatus = useUpdateTaskStatus();
  
  return useMutation<Task, Error, number|string>({
    mutationFn: (taskId: number|string) => 
      updateTaskStatus.mutateAsync({ taskId, newStatus: "INPROGRESS" }),
  });
}

export function useMarkTaskDone() {
  const updateTaskStatus = useUpdateTaskStatus();
  
  return useMutation<Task, Error, number>({
    mutationFn: (taskId: number) => 
      updateTaskStatus.mutateAsync({ taskId, newStatus: "DONE" }),
  });
}

export function useMarkTaskTodo() {
  const updateTaskStatus = useUpdateTaskStatus();
  
  return useMutation<Task, Error, number>({
    mutationFn: (taskId: number) => 
      updateTaskStatus.mutateAsync({ taskId, newStatus: "TODO" }),
  });
}