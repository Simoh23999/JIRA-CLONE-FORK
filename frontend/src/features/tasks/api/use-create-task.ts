import { projectSchema } from "@/features/project/schemas";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import z from "zod";
import { createTaskSchema } from "../schemas";

const baseURL = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:9090";

export function useCreateTask(projectId: number | string) {
  const queryClient = useQueryClient();

  return useMutation({
      mutationFn: async (values: z.infer<typeof createTaskSchema>) => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.post(
          `${baseURL}/api/projects/${projectId}/tasks`,
          values,
          {
            headers: { 
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json"
            },
          }
        );
        return response.data;
      } catch (err) {
        const axiosErr = err as AxiosError<{ message?: string }>;
        const msg =
          axiosErr.response?.data?.message ||
          axiosErr.message ||
          "Une erreur est survenue lors de la création de la tâche.";
        throw new Error(msg);
      }
    },
    onSuccess: () => {
      // Invalidate and refetch tasks for this project
      queryClient.invalidateQueries({ 
        queryKey: ["tasks", "project", projectId] 
      });
    },
  });
}