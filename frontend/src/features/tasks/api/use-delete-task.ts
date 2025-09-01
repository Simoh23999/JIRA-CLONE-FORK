import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { toast } from "sonner";

const baseURL = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:9090";

export function useDeleteTask(projectId: number | string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (taskId: number | string) => {

      try {
        const token = localStorage.getItem("token");
        const response = await axios.delete(
          `${baseURL}/api/tasks/${taskId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        return response.data;
      } catch (err) {
        const axiosErr = err as AxiosError<{ message?: string }>;
        const msg =
          axiosErr.response?.data?.message ||
          axiosErr.message ||
          "Une erreur est survenue lors de la suppression de la tâche.";
        throw new Error(msg);
      }
    },
    onSuccess: () => {
     toast.success("Tâche supprimée avec succès");
      queryClient.invalidateQueries({ 
        queryKey: ["tasks", "project", projectId] 
      });
      queryClient.invalidateQueries({ queryKey:  ["sprints", "project", projectId] });
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
}
